// Excel workbook of the whole business-rules register. Imported on demand (dynamic import from the toolbar),
// so neither this module nor write-excel-file is in the page bundle.
//
// Sheets: Rules (every rule in use, status on the as-of date, autofilter, frozen header and ID column), State
// history, Sections, Local changes (every change made in this browser), Open questions, Contexts, About.
// Changes made in this browser are marked: added rules have a light-green row; edited rules a light-yellow row with
// every changed cell bright yellow and the published values alongside; deleted items are listed in Local changes.
import writeExcelFile, { type Feature, type SheetData } from "write-excel-file/browser";
import { getOrderOfSiblings, insertElementMarkupAccordingToOrderOfSiblings, sanitizeAttributeValue } from "write-excel-file/utility";
import type { LocalChanges, RuleField, RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, RULE_CONTEXT_ORDER, RULE_ORIGINS, RULE_SECTIONS, RULE_STRENGTHS, currentSections, getRule, ruleSectionLabel } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";
import {
  FACETS,
  FACET_LABEL,
  FIELD_LABEL,
  STATE_LABEL,
  changeBetween,
  facetValueLabel,
  formatDate,
  fullText,
  historyText,
  isActive,
  pendingQuestions,
  ruleStateAt,
  safeCell,
  type RuleQuery,
} from "@/lib/rules";

type FileContent = Blob | ArrayBuffer;

const HEAD = { fontWeight: "bold" as const, backgroundColor: "#E7E5DE", wrap: true, alignVertical: "top" as const, bottomBorderColor: "#9A9890", bottomBorderStyle: "thin" as const };
/** Added here: light green row. Edited here: light yellow row, changed cell bright yellow. Deleted: light red. */
const ADDED_ROW = "#E2EFDA";
const EDITED_ROW = "#FFF2CC";
const CHANGED_CELL = "#FFFF00";
const DELETED_ROW = "#FCE4D6";

const head = (value: string) => ({ value, ...HEAD });
const fillOf = (fill?: string) => (fill ? { backgroundColor: fill } : {});
const text = (value: string | undefined, wrap = false, fill?: string) => ({ value: value ? safeCell(value) : "", type: String, wrap, alignVertical: "top" as const, ...fillOf(fill) });
const num = (value: number, fill?: string) => ({ value, type: Number, alignVertical: "top" as const, ...fillOf(fill) });
const date = (iso: string | undefined, fill?: string) =>
  iso
    ? { value: new Date(`${iso}T00:00:00Z`), type: Date, format: "d mmm yyyy", alignVertical: "top" as const, ...fillOf(fill) }
    : { value: "", type: String, ...fillOf(fill) };

/** Column letter for a 1-based index (1 → A, 27 → AA). */
const colLetter = (n: number): string => (n <= 0 ? "" : colLetter(Math.floor((n - 1) / 26)) + String.fromCharCode(65 + ((n - 1) % 26)));

/** Excel autofilter on the first sheet's header row (write-excel-file has no built-in for it). */
function autoFilter(sheetName: string, columns: number, rows: number): Feature<FileContent> {
  const ref = `A1:${colLetter(columns)}${rows}`;
  return {
    files: {
      transform: {
        "xl/worksheets/sheet{id}.xml": {
          transform: (xml, _options, { sheetIndex }) => {
            if (sheetIndex !== 0 || xml.includes("<autoFilter")) return xml;
            const order = getOrderOfSiblings("xl/worksheets/sheet{id}.xml", "worksheet");
            return order ? insertElementMarkupAccordingToOrderOfSiblings(xml, `<autoFilter ref="${ref}"/>`, order, "worksheet") : xml;
          },
        },
        "xl/workbook.xml": {
          transform: (xml) => {
            if (xml.includes("_xlnm._FilterDatabase")) return xml;
            const name = sanitizeAttributeValue("_xlnm._FilterDatabase");
            const target = `'${sheetName}'!$A$1:$${colLetter(columns)}$${rows}`;
            const definedName = `<definedName name="${name}" localSheetId="0" hidden="1">${target}</definedName>`;
            // write-excel-file 4 emits an empty <definedNames/>; fill it, extend an open one, or add one in order.
            if (xml.includes("<definedNames/>")) return xml.replace("<definedNames/>", `<definedNames>${definedName}</definedNames>`);
            if (xml.includes("</definedNames>")) return xml.replace("</definedNames>", `${definedName}</definedNames>`);
            const order = getOrderOfSiblings("xl/workbook.xml", "workbook");
            return order ? insertElementMarkupAccordingToOrderOfSiblings(xml, `<definedNames>${definedName}</definedNames>`, order, "workbook") : xml;
          },
        },
      },
    },
  };
}

/** A field's value as text (for the "published → now" columns and the Local changes sheet). */
function fieldText(r: RuleRecord, f: RuleField): string {
  switch (f) {
    case "contexts":
      return r.contexts.map((c) => RULE_CONTEXTS[c].label).join("; ");
    case "section":
      return ruleSectionLabel(r.section);
    case "strength":
      return RULE_STRENGTHS[r.strength].label;
    case "list":
      return (r.list ?? []).join(" | ");
    case "entities":
      return (r.entities ?? []).join("; ");
    case "questions":
      return (r.questions ?? []).join("; ");
    case "history":
      return historyText(r);
    default:
      return String(r[f] ?? "");
  }
}

export async function downloadRulesWorkbook({ rules, local, asOf, query, shown }: { rules: RuleRecord[]; local: LocalChanges; asOf: string; query: RuleQuery; shown: RuleRecord[] }) {
  const inView = new Set(shown.map((r) => r.id));
  const added = rules.filter((r) => r.added);
  const edited = rules.filter((r) => r.edited);
  const sections = currentSections();
  const anyLocal = added.length + edited.length + local.deleted.length + Object.keys(local.sections.edits).length + local.sections.added.length + local.sections.deleted.length > 0;

  /** Row fill for a rule, and a fill for a cell given the fields it shows. */
  type Fills = { row?: string; cell: (...fields: (RuleField | "status" | "state" | "from" | "to")[]) => string | undefined };
  const fills = (r: RuleRecord): Fills => {
    if (r.added) return { row: ADDED_ROW, cell: () => ADDED_ROW };
    if (!r.edited || !r.original) return { cell: () => undefined };
    const o = r.original;
    const changed = new Set<string>(r.changedFields ?? []);
    if (isActive(o, asOf) !== isActive(r, asOf)) changed.add("status");
    if (ruleStateAt(o, asOf) !== ruleStateAt(r, asOf)) changed.add("state");
    if (o.activeFrom !== r.activeFrom) changed.add("from");
    if (o.activeTo !== r.activeTo) changed.add("to");
    return { row: EDITED_ROW, cell: (...fields) => (fields.some((f) => changed.has(f)) ? CHANGED_CELL : EDITED_ROW) };
  };

  /* Rules */
  type Col = { label: string; width: number; cell: (r: RuleRecord, f: Fills) => object };
  const ruleCols: Col[] = [
    { label: "ID", width: 10, cell: (r, f) => text(r.id, false, f.row) },
    { label: "Title", width: 34, cell: (r, f) => text(r.title, true, f.cell("title")) },
    { label: "Rule (as written)", width: 70, cell: (r, f) => text(fullText(r), true, f.cell("text", "list")) },
    { label: `Status on ${formatDate(asOf)}`, width: 14, cell: (r, f) => text(isActive(r, asOf) ? "Active" : "Inactive", false, f.cell("status")) },
    { label: `State on ${formatDate(asOf)}`, width: 16, cell: (r, f) => text(STATE_LABEL[ruleStateAt(r, asOf)], false, f.cell("state")) },
    ...(query.vs
      ? [
          {
            label: `Change since ${formatDate(query.vs)}`,
            width: 26,
            cell: (r: RuleRecord, f: Fills) => {
              const c = changeBetween(r, query.vs!, asOf);
              return text(c ? `${STATE_LABEL[c.from]} → ${STATE_LABEL[c.to]}` : "", false, f.row);
            },
          },
        ]
      : []),
    { label: "Active from", width: 13, cell: (r, f) => date(r.activeFrom, f.cell("from")) },
    { label: "Active to", width: 13, cell: (r, f) => date(r.activeTo, f.cell("to")) },
    ...(anyLocal
      ? [
          { label: "Local change", width: 12, cell: (r: RuleRecord, f: Fills) => text(r.added ? "Added" : r.edited ? "Edited" : "", false, f.row) },
          { label: "Changed fields", width: 22, cell: (r: RuleRecord, f: Fills) => text((r.changedFields ?? []).map((x) => FIELD_LABEL[x]).join("; "), true, f.row) },
          {
            label: "Published values",
            width: 50,
            cell: (r: RuleRecord, f: Fills) =>
              text(r.original ? (r.changedFields ?? []).map((x) => `${FIELD_LABEL[x]}: ${fieldText(r.original!, x)}`).join("\n") : "", true, f.row),
          },
        ]
      : []),
    { label: "State history", width: 44, cell: (r, f) => text(historyText(r), true, f.cell("history")) },
    { label: "Contexts", width: 30, cell: (r, f) => text(r.contexts.map((c) => RULE_CONTEXTS[c].label).join("; "), true, f.cell("contexts")) },
    { label: "Section", width: 30, cell: (r, f) => text(ruleSectionLabel(r.section), true, f.cell("section")) },
    { label: "Strength", width: 10, cell: (r, f) => text(RULE_STRENGTHS[r.strength].label, false, f.cell("strength")) },
    { label: "Owner", width: 12, cell: (r, f) => text(r.owner, false, f.cell("owner")) },
    { label: "Source", width: 20, cell: (r, f) => text(RULE_ORIGINS[r.origin].label, false, f.row) },
    { label: "Waits on (open questions)", width: 16, cell: (r, f) => text(pendingQuestions(r).join("; "), false, f.cell("questions")) },
    { label: "Superseded by", width: 12, cell: (r, f) => text(r.supersededBy, false, f.row) },
    { label: "Entities", width: 34, cell: (r, f) => text((r.entities ?? []).join("; "), true, f.cell("entities")) },
    { label: "In current view", width: 10, cell: (r, f) => text(inView.has(r.id) ? "Yes" : "No", false, f.row) },
    { label: "In plain words", width: 50, cell: (r, f) => text(r.plain, true, f.cell("plain")) },
    { label: "Source ids", width: 12, cell: (r, f) => text(r.sources.join("; "), false, f.row) },
  ];
  const ordered = [...rules].sort((a, b) => a.order - b.order);
  const rulesData = [
    ruleCols.map((c) => head(c.label)),
    ...ordered.map((r) => {
      const f = fills(r);
      return ruleCols.map((c) => c.cell(r, f));
    }),
  ] as SheetData;

  /* State history: one row per dated state change, published dates beside edited ones */
  const historyData = [
    ["Rule", "Title", "State", "From", "To", "Note", ...(anyLocal ? ["Local change", "Published state", "Published from"] : [])].map(head),
    ...ordered.flatMap((r) =>
      r.history.map((h, i) => {
        const row = r.added ? ADDED_ROW : r.edited ? EDITED_ROW : undefined;
        const datesEdited = r.edited && !!r.originalHistory && (r.changedFields ?? []).includes("history");
        const orig = datesEdited ? r.originalHistory?.[i] : undefined;
        const mark = (changed: boolean) => (datesEdited && changed ? CHANGED_CELL : row);
        return [
          text(r.id, false, row),
          text(r.title, true, row),
          text(STATE_LABEL[h.state], false, mark(orig?.state !== h.state)),
          date(h.from, mark(orig?.from !== h.from)),
          date(r.history[i + 1]?.from, mark(r.originalHistory?.[i + 1]?.from !== r.history[i + 1]?.from)),
          text(h.note, true, row),
          ...(anyLocal
            ? [text(r.added ? "Added" : r.edited ? "Edited" : "", false, row), text(orig ? STATE_LABEL[orig.state] : datesEdited ? "(added step)" : "", false, row), date(orig?.from, row)]
            : []),
        ];
      })
    ),
  ] as SheetData;

  /* Sections (in use, then deleted published ones) */
  const sectionsData = [
    ["ID", "Section", "Part", "Rules", "Local change", "Published name", "Published part"].map(head),
    ...sections.map((x) => {
      const row = x.added ? ADDED_ROW : x.edited ? EDITED_ROW : undefined;
      return [
        text(x.id, false, row),
        text(x.label, true, x.edited && x.original?.label !== x.label ? CHANGED_CELL : row),
        text(x.part, false, x.edited && x.original?.part !== x.part ? CHANGED_CELL : row),
        num(rules.filter((r) => r.section === x.id).length, row),
        text(x.added ? "Added" : x.edited ? "Edited" : "", false, row),
        text(x.original?.label, true, row),
        text(x.original?.part, false, row),
      ];
    }),
    ...local.sections.deleted
      .map((id) => RULE_SECTIONS.find((x) => x.id === id))
      .filter((x): x is NonNullable<typeof x> => !!x)
      .map((x) => [text(x.id, false, DELETED_ROW), text(x.label, true, DELETED_ROW), text(x.part, false, DELETED_ROW), text("", false, DELETED_ROW), text("Deleted", false, DELETED_ROW), text("", false, DELETED_ROW), text("", false, DELETED_ROW)]),
  ] as SheetData;

  /* Local changes: one row per change */
  const changeRows: object[][] = [];
  const change = (fill: string, kind: string, id: string, name: string, what: string, field: string, before: string, after: string) =>
    changeRows.push([text(kind, false, fill), text(id, false, fill), text(name, true, fill), text(what, false, fill), text(field, false, fill), text(before, true, fill), text(after, true, fill)]);
  for (const x of sections.filter((s) => s.added)) change(ADDED_ROW, "Section", x.id, x.label, "Added", "", "", `${x.label} (${x.part})`);
  for (const x of sections.filter((s) => s.edited && s.original)) {
    if (x.original!.label !== x.label) change(EDITED_ROW, "Section", x.id, x.label, "Edited", "Name", x.original!.label, x.label);
    if (x.original!.part !== x.part) change(EDITED_ROW, "Section", x.id, x.label, "Edited", "Part", x.original!.part, x.part);
  }
  for (const id of local.sections.deleted) {
    const x = RULE_SECTIONS.find((s) => s.id === id);
    if (x) change(DELETED_ROW, "Section", id, x.label, "Deleted", "", `${x.label} (${x.part})`, "");
  }
  for (const r of added) change(ADDED_ROW, "Rule", r.id, r.title, "Added", "", "", fullText(r));
  for (const r of edited)
    for (const f of r.changedFields ?? []) change(EDITED_ROW, "Rule", r.id, r.title, "Edited", FIELD_LABEL[f], r.original ? fieldText(r.original, f) : "", fieldText(r, f));
  for (const id of local.deleted) {
    const r = getRule(id);
    if (r) change(DELETED_ROW, "Rule", id, r.title, "Deleted", "", fullText(r), "");
  }
  const changesData = [["Item", "ID", "Name / title", "Change", "Field", "Published", "Now"].map(head), ...changeRows] as SheetData;

  /* Open questions that gate rules in use */
  const questionsData = [
    ["ID", "Question", "Status", "Why it matters", "Rules waiting"].map(head),
    ...openQuestions
      .map((q) => ({ q, waiting: rules.filter((r) => r.questions?.includes(q.id)) }))
      .filter((x) => x.waiting.length)
      .map(({ q, waiting }) => [text(q.id), text(q.question, true), text(q.status.replace("-", " ")), text(q.note, true), text(waiting.map((r) => r.id).join("; "), true)]),
  ] as SheetData;

  /* Contexts */
  const contextsData = [
    ["Context", "What it covers", "Rules"].map(head),
    ...RULE_CONTEXT_ORDER.map((c) => [text(RULE_CONTEXTS[c].label), text(RULE_CONTEXTS[c].blurb, true), num(rules.filter((r) => r.contexts.includes(c)).length)]),
  ] as SheetData;

  /* About */
  const filters = [
    ...FACETS.flatMap((f) => ((query[f] as string[]).length ? [`${FACET_LABEL[f]}: ${(query[f] as string[]).map((v) => facetValueLabel(f, v)).join(", ")}`] : [])),
    ...(query.q.trim() ? [`Search: "${query.q.trim()}"`] : []),
    ...(query.flag ? ["Needs confirmation only"] : []),
    ...(query.question ? [`Waits on ${query.question}`] : []),
    ...(query.edited ? ["Local changes only"] : []),
    ...(query.vs && query.changed ? [`Changed since ${formatDate(query.vs)} only`] : []),
  ];
  const localSummary = [
    added.length && `${added.length} rule${added.length === 1 ? "" : "s"} added`,
    edited.length && `${edited.length} edited`,
    local.deleted.length && `${local.deleted.length} deleted`,
    local.sections.added.length && `${local.sections.added.length} section${local.sections.added.length === 1 ? "" : "s"} added`,
    Object.keys(local.sections.edits).length && `${Object.keys(local.sections.edits).length} section${Object.keys(local.sections.edits).length === 1 ? "" : "s"} edited`,
    local.sections.deleted.length && `${local.sections.deleted.length} section${local.sections.deleted.length === 1 ? "" : "s"} deleted`,
  ].filter(Boolean);
  const aboutData = [
    [head("Rossell Techsys · Business rules register"), head("")],
    [text("Status and state shown for"), text(formatDate(asOf))],
    ...(query.vs ? [[text("Compared with"), text(formatDate(query.vs))]] : []),
    [text("Rules in the register"), num(rules.length)],
    [text("Rules in the current view"), num(shown.length)],
    [text("Filters in the current view"), text(filters.length ? filters.join(" · ") : "None", true)],
    ...(anyLocal
      ? [
          [
            text("Changed in this browser", false, CHANGED_CELL),
            text(
              `${localSummary.join(", ")}. Added rules: light-green rows. Edited rules: light-yellow rows with each changed cell bright yellow and the published values alongside. Every change is listed in the "Local changes" sheet. These changes are not confirmed by Rossell.`,
              true,
              CHANGED_CELL
            ),
          ],
        ]
      : []),
    [text("Rule text"), text("Spec rules are quoted as written in the business-rules specification (source RULES); session rules as recorded in the working-session notes (source WS).", true)],
    [text("Sample data"), text("State histories, active periods, contexts and owners are illustrative until Rossell confirms them. Status is derived from the state history on the date above.", true)],
    [text("Prepared by"), text("Talencia Global for Rossell Techsys")],
  ] as SheetData;

  const blob = await writeExcelFile(
    [
      { sheet: "Rules", data: rulesData, columns: ruleCols.map((c) => ({ width: c.width })), stickyRowsCount: 1, stickyColumnsCount: 1 },
      {
        sheet: "State history",
        data: historyData,
        columns: [{ width: 10 }, { width: 34 }, { width: 16 }, { width: 13 }, { width: 13 }, { width: 48 }, ...(anyLocal ? [{ width: 12 }, { width: 16 }, { width: 13 }] : [])],
        stickyRowsCount: 1,
      },
      { sheet: "Sections", data: sectionsData, columns: [{ width: 8 }, { width: 36 }, { width: 28 }, { width: 8 }, { width: 12 }, { width: 36 }, { width: 28 }], stickyRowsCount: 1 },
      { sheet: "Local changes", data: changesData, columns: [{ width: 9 }, { width: 10 }, { width: 36 }, { width: 10 }, { width: 16 }, { width: 50 }, { width: 50 }], stickyRowsCount: 1 },
      { sheet: "Open questions", data: questionsData, columns: [{ width: 6 }, { width: 70 }, { width: 16 }, { width: 50 }, { width: 30 }], stickyRowsCount: 1 },
      { sheet: "Contexts", data: contextsData, columns: [{ width: 24 }, { width: 60 }, { width: 8 }], stickyRowsCount: 1 },
      { sheet: "About", data: aboutData, columns: [{ width: 30 }, { width: 90 }] },
    ],
    { features: [autoFilter("Rules", ruleCols.length, ordered.length + 1)] }
  ).toBlob();
  return blob;
}
