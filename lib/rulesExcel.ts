// Excel workbook of the whole business-rules register. Imported on demand (dynamic import from the toolbar),
// so neither this module nor write-excel-file is in the page bundle.
//
// Sheets: Rules (all rules, status on the as-of date, autofilter, frozen header and ID column), State history,
// Open questions, Contexts, About (dates, filters in view, sample-data note).
// Dates edited in this browser are exported as edited: the rule's row is light yellow and every changed cell is
// bright yellow, with the original dates alongside.
import writeExcelFile, { type Feature, type SheetData } from "write-excel-file/browser";
import { getOrderOfSiblings, insertElementMarkupAccordingToOrderOfSiblings, sanitizeAttributeValue } from "write-excel-file/utility";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, RULE_CONTEXT_ORDER, RULE_ORIGINS, RULE_STRENGTHS, activeSpan, ruleQuestions, ruleSectionLabel } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";
import {
  FACETS,
  FACET_LABEL,
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
/** Edited rule: light yellow row; changed cell: bright yellow. */
const EDITED_ROW = "#FFF2CC";
const CHANGED_CELL = "#FFFF00";

const head = (value: string) => ({ value, ...HEAD });
const fillOf = (fill?: string) => (fill ? { backgroundColor: fill } : {});
const text = (value: string | undefined, wrap = false, fill?: string) => ({ value: value ? safeCell(value) : "", type: String, wrap, alignVertical: "top" as const, ...fillOf(fill) });
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

export async function downloadRulesWorkbook({ rules, asOf, query, shown }: { rules: RuleRecord[]; asOf: string; query: RuleQuery; shown: RuleRecord[] }) {
  const inView = new Set(shown.map((r) => r.id));
  const edited = rules.filter((r) => r.edited);
  const anyEdits = edited.length > 0;

  /** For an edited rule: the row fill, and a fill for cells whose value differs from the published one. */
  type Fills = { row?: string; changed: (k: string) => string | undefined; orig?: RuleRecord };
  const fills = (r: RuleRecord): Fills => {
    if (!r.edited || !r.originalHistory) return { changed: () => undefined };
    const orig = { ...r, history: r.originalHistory, ...activeSpan(r.originalHistory) } as RuleRecord;
    const diff: Record<string, boolean> = {
      status: isActive(orig, asOf) !== isActive(r, asOf),
      state: ruleStateAt(orig, asOf) !== ruleStateAt(r, asOf),
      from: orig.activeFrom !== r.activeFrom,
      to: orig.activeTo !== r.activeTo,
      history: historyText(orig) !== historyText(r),
    };
    return { row: EDITED_ROW, changed: (k: string) => (diff[k] ? CHANGED_CELL : EDITED_ROW), orig };
  };

  /* Rules */
  type Col = { label: string; width: number; cell: (r: RuleRecord, f: Fills) => object };
  const ruleCols: Col[] = [
    { label: "ID", width: 10, cell: (r, f) => text(r.id, false, f.row) },
    { label: "Title", width: 34, cell: (r, f) => text(r.title, true, f.row) },
    { label: "Rule (as written)", width: 70, cell: (r, f) => text(fullText(r), true, f.row) },
    { label: `Status on ${formatDate(asOf)}`, width: 14, cell: (r, f) => text(isActive(r, asOf) ? "Active" : "Inactive", false, f.changed("status")) },
    { label: `State on ${formatDate(asOf)}`, width: 16, cell: (r, f) => text(STATE_LABEL[ruleStateAt(r, asOf)], false, f.changed("state")) },
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
    { label: "Active from", width: 13, cell: (r, f) => date(r.activeFrom, f.changed("from")) },
    { label: "Active to", width: 13, cell: (r, f) => date(r.activeTo, f.changed("to")) },
    ...(anyEdits
      ? [
          { label: "Dates edited", width: 10, cell: (r: RuleRecord, f: Fills) => text(r.edited ? "Yes" : "", false, f.row) },
          { label: "Original active from", width: 13, cell: (r: RuleRecord, f: Fills) => date(f.orig?.activeFrom, f.row) },
          { label: "Original active to", width: 13, cell: (r: RuleRecord, f: Fills) => date(f.orig?.activeTo, f.row) },
        ]
      : []),
    { label: "State history", width: 44, cell: (r, f) => text(historyText(r), true, f.changed("history")) },
    { label: "Contexts", width: 30, cell: (r, f) => text(r.contexts.map((c) => RULE_CONTEXTS[c].label).join("; "), true, f.row) },
    { label: "Section", width: 30, cell: (r, f) => text(ruleSectionLabel(r.section), true, f.row) },
    { label: "Strength", width: 10, cell: (r, f) => text(RULE_STRENGTHS[r.strength].label, false, f.row) },
    { label: "Owner", width: 12, cell: (r, f) => text(r.owner, false, f.row) },
    { label: "Source", width: 18, cell: (r, f) => text(RULE_ORIGINS[r.origin].label, false, f.row) },
    { label: "Waits on (open questions)", width: 16, cell: (r, f) => text(pendingQuestions(r).join("; "), false, f.row) },
    { label: "Superseded by", width: 12, cell: (r, f) => text(r.supersededBy, false, f.row) },
    { label: "Entities", width: 34, cell: (r, f) => text((r.entities ?? []).join("; "), true, f.row) },
    { label: "In current view", width: 10, cell: (r, f) => text(inView.has(r.id) ? "Yes" : "No", false, f.row) },
    { label: "In plain words", width: 50, cell: (r, f) => text(r.plain, true, f.row) },
    { label: "Source ids", width: 12, cell: (r, f) => text(r.sources.join("; "), false, f.row) },
  ];
  const rulesData = [
    ruleCols.map((c) => head(c.label)),
    ...rules.map((r) => {
      const f = fills(r);
      return ruleCols.map((c) => c.cell(r, f));
    }),
  ] as SheetData;

  /* State history: one row per dated state change */
  const historyData = [
    ["Rule", "Title", "State", "From", "To", "Note", ...(anyEdits ? ["Edited", "Published state", "Published from"] : [])].map(head),
    ...rules.flatMap((r) =>
      r.history.map((h, i) => {
        const row = r.edited ? EDITED_ROW : undefined;
        const orig = r.edited ? r.originalHistory?.[i] : undefined;
        const stateChanged = r.edited && orig?.state !== h.state;
        const fromChanged = r.edited && orig?.from !== h.from;
        const toChanged = r.edited && r.originalHistory?.[i + 1]?.from !== r.history[i + 1]?.from;
        return [
          text(r.id, false, row),
          text(r.title, true, row),
          text(STATE_LABEL[h.state], false, stateChanged ? CHANGED_CELL : row),
          date(h.from, fromChanged ? CHANGED_CELL : row),
          date(r.history[i + 1]?.from, toChanged ? CHANGED_CELL : row),
          text(h.note, true, row),
          ...(anyEdits
            ? [text(r.edited ? "Yes" : "", false, row), text(orig ? STATE_LABEL[orig.state] : r.edited ? "(added)" : "", false, row), date(orig?.from, row)]
            : []),
        ];
      })
    ),
  ] as SheetData;

  /* Open questions that gate rules */
  const questionsData = [
    ["ID", "Question", "Status", "Why it matters", "Rules waiting"].map(head),
    ...ruleQuestions.map(({ question: q, rules }) => [text(q.id), text(q.question, true), text(q.status.replace("-", " ")), text(q.note, true), text(rules.map((r) => r.id).join("; "), true)]),
  ] as SheetData;

  /* Contexts */
  const contextsData = [
    ["Context", "What it covers", "Rules"].map(head),
    ...RULE_CONTEXT_ORDER.map((c) => [text(RULE_CONTEXTS[c].label), text(RULE_CONTEXTS[c].blurb, true), { value: rules.filter((r) => r.contexts.includes(c)).length, type: Number }]),
  ] as SheetData;

  /* About */
  const filters = [
    ...FACETS.flatMap((f) => ((query[f] as string[]).length ? [`${FACET_LABEL[f]}: ${(query[f] as string[]).map((v) => facetValueLabel(f, v)).join(", ")}`] : [])),
    ...(query.q.trim() ? [`Search: "${query.q.trim()}"`] : []),
    ...(query.flag ? ["Needs confirmation only"] : []),
    ...(query.question ? [`Waits on ${query.question}`] : []),
    ...(query.vs && query.changed ? [`Changed since ${formatDate(query.vs)} only`] : []),
  ];
  const aboutData = [
    [head("Rossell Techsys · Business rules register"), head("")],
    [text("Status and state shown for"), text(formatDate(asOf))],
    ...(query.vs ? [[text("Compared with"), text(formatDate(query.vs))]] : []),
    [text("Rules in the register"), { value: rules.length, type: Number }],
    ...(anyEdits
      ? [
          [
            text("Dates edited in this browser", false, CHANGED_CELL),
            text(
              `${edited.length} ${edited.length === 1 ? "rule" : "rules"}: ${edited.map((r) => r.id).join(", ")}. Their rows are light yellow and every changed cell is bright yellow, with the published dates alongside. Edits are not yet confirmed by Rossell.`,
              true,
              CHANGED_CELL
            ),
          ],
        ]
      : []),
    [text("Rules in the current view"), { value: shown.length, type: Number }],
    [text("Filters in the current view"), text(filters.length ? filters.join(" · ") : "None", true)],
    [text("Open questions gating rules"), { value: ruleQuestions.length, type: Number }],
    [text("Rule text"), text("Spec rules are quoted as written in the business-rules specification (source RULES); session rules as recorded in the working-session notes (source WS).", true)],
    [text("Sample data"), text("State histories, active periods, contexts and owners are illustrative until Rossell confirms them. Status is derived from the state history on the date above.", true)],
    [text("Prepared by"), text("Talencia Global for Rossell Techsys")],
    [text("Open questions in the deck"), { value: openQuestions.length, type: Number }],
  ] as SheetData;

  const blob = await writeExcelFile(
    [
      { sheet: "Rules", data: rulesData, columns: ruleCols.map((c) => ({ width: c.width })), stickyRowsCount: 1, stickyColumnsCount: 1 },
      {
        sheet: "State history",
        data: historyData,
        columns: [{ width: 10 }, { width: 34 }, { width: 16 }, { width: 13 }, { width: 13 }, { width: 48 }, ...(anyEdits ? [{ width: 8 }, { width: 16 }, { width: 13 }] : [])],
        stickyRowsCount: 1,
      },
      { sheet: "Open questions", data: questionsData, columns: [{ width: 6 }, { width: 70 }, { width: 16 }, { width: 50 }, { width: 30 }], stickyRowsCount: 1 },
      { sheet: "Contexts", data: contextsData, columns: [{ width: 24 }, { width: 60 }, { width: 8 }], stickyRowsCount: 1 },
      { sheet: "About", data: aboutData, columns: [{ width: 30 }, { width: 90 }] },
    ],
    { features: [autoFilter("Rules", ruleCols.length, rules.length + 1)] }
  ).toBlob();
  return blob;
}
