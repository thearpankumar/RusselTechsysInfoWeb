// Excel workbook of the whole business-rules register. Imported on demand (dynamic import from the toolbar),
// so neither this module nor write-excel-file is in the page bundle.
//
// Sheets: Rules (all rules, status on the as-of date, autofilter, frozen header and ID column), State history,
// Open questions, Contexts, About (dates, filters in view, sample-data note).
import writeExcelFile, { type Feature, type SheetData } from "write-excel-file/browser";
import { getOrderOfSiblings, insertElementMarkupAccordingToOrderOfSiblings, sanitizeAttributeValue } from "write-excel-file/utility";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, RULE_CONTEXT_ORDER, RULE_ORIGINS, RULE_STRENGTHS, ruleQuestions, ruleRegister, ruleSectionLabel } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";
import {
  FACETS,
  FACET_LABEL,
  STATE_LABEL,
  changeBetween,
  facetValueLabel,
  formatDate,
  fullText,
  isActive,
  pendingQuestions,
  ruleStateAt,
  safeCell,
  type RuleQuery,
} from "@/lib/rules";

type FileContent = Blob | ArrayBuffer;

const HEAD = { fontWeight: "bold" as const, backgroundColor: "#E7E5DE", wrap: true, alignVertical: "top" as const, bottomBorderColor: "#9A9890", bottomBorderStyle: "thin" as const };
const head = (value: string) => ({ value, ...HEAD });
const text = (value: string | undefined, wrap = false) => ({ value: value ? safeCell(value) : "", type: String, wrap, alignVertical: "top" as const });
const date = (iso: string | undefined) =>
  iso ? { value: new Date(`${iso}T00:00:00Z`), type: Date, format: "d mmm yyyy", alignVertical: "top" as const } : { value: "", type: String };

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

export async function downloadRulesWorkbook({ asOf, query, shown }: { asOf: string; query: RuleQuery; shown: RuleRecord[] }) {
  const inView = new Set(shown.map((r) => r.id));

  /* Rules */
  const ruleCols: { label: string; width: number; cell: (r: RuleRecord) => object }[] = [
    { label: "ID", width: 10, cell: (r) => text(r.id) },
    { label: "Title", width: 34, cell: (r) => text(r.title, true) },
    { label: "Rule (as written)", width: 70, cell: (r) => text(fullText(r), true) },
    { label: `Status on ${formatDate(asOf)}`, width: 14, cell: (r) => text(isActive(r, asOf) ? "Active" : "Inactive") },
    { label: `State on ${formatDate(asOf)}`, width: 16, cell: (r) => text(STATE_LABEL[ruleStateAt(r, asOf)]) },
    ...(query.vs
      ? [{ label: `Change since ${formatDate(query.vs)}`, width: 26, cell: (r: RuleRecord) => {
          const c = changeBetween(r, query.vs!, asOf);
          return text(c ? `${STATE_LABEL[c.from]} → ${STATE_LABEL[c.to]}` : "");
        } }]
      : []),
    { label: "Active from", width: 13, cell: (r) => date(r.activeFrom) },
    { label: "Active to", width: 13, cell: (r) => date(r.activeTo) },
    { label: "Contexts", width: 30, cell: (r) => text(r.contexts.map((c) => RULE_CONTEXTS[c].label).join("; "), true) },
    { label: "Section", width: 30, cell: (r) => text(ruleSectionLabel(r.section), true) },
    { label: "Strength", width: 10, cell: (r) => text(RULE_STRENGTHS[r.strength].label) },
    { label: "Owner", width: 12, cell: (r) => text(r.owner) },
    { label: "Source", width: 18, cell: (r) => text(RULE_ORIGINS[r.origin].label) },
    { label: "Waits on (open questions)", width: 16, cell: (r) => text(pendingQuestions(r).join("; ")) },
    { label: "Superseded by", width: 12, cell: (r) => text(r.supersededBy) },
    { label: "Entities", width: 34, cell: (r) => text((r.entities ?? []).join("; "), true) },
    { label: "In current view", width: 10, cell: (r) => text(inView.has(r.id) ? "Yes" : "No") },
    { label: "In plain words", width: 50, cell: (r) => text(r.plain, true) },
    { label: "Source ids", width: 12, cell: (r) => text(r.sources.join("; ")) },
  ];
  const rulesData = [ruleCols.map((c) => head(c.label)), ...ruleRegister.map((r) => ruleCols.map((c) => c.cell(r)))] as SheetData;

  /* State history: one row per dated state change */
  const historyData = [
    ["Rule", "Title", "State", "From", "To", "Note"].map(head),
    ...ruleRegister.flatMap((r) =>
      r.history.map((h, i) => [text(r.id), text(r.title, true), text(STATE_LABEL[h.state]), date(h.from), date(r.history[i + 1]?.from), text(h.note, true)])
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
    ...RULE_CONTEXT_ORDER.map((c) => [text(RULE_CONTEXTS[c].label), text(RULE_CONTEXTS[c].blurb, true), { value: ruleRegister.filter((r) => r.contexts.includes(c)).length, type: Number }]),
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
    [text("Rules in the register"), { value: ruleRegister.length, type: Number }],
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
      { sheet: "State history", data: historyData, columns: [{ width: 10 }, { width: 34 }, { width: 16 }, { width: 13 }, { width: 13 }, { width: 48 }], stickyRowsCount: 1 },
      { sheet: "Open questions", data: questionsData, columns: [{ width: 6 }, { width: 70 }, { width: 16 }, { width: 50 }, { width: 30 }], stickyRowsCount: 1 },
      { sheet: "Contexts", data: contextsData, columns: [{ width: 24 }, { width: 60 }, { width: 8 }], stickyRowsCount: 1 },
      { sheet: "About", data: aboutData, columns: [{ width: 30 }, { width: 90 }] },
    ],
    { features: [autoFilter("Rules", ruleCols.length, ruleRegister.length + 1)] }
  ).toBlob();
  return blob;
}
