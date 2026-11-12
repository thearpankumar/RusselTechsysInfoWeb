import type { SectionDef } from "./types";

export const dataSections: SectionDef[] = [
  {
    id: "overview",
    label: "Inventory",
    statement: "Sixteen reports feed the planning floor. Eight are in scope; seven arrived as Rossell's own column sheets.",
    purpose: "How many reports there are, which are in scope, and the full list.",
    subsections: [
      { id: "data-overview", label: "At a glance" },
      { id: "data-sheets", label: "Rossell's column sheets" },
      { id: "data-files", label: "All sixteen reports" },
      { id: "data-treatment", label: "How files are treated" },
    ],
  },
  {
    id: "flow",
    label: "Report flow",
    statement: "Each morning IQMS runs its Crystal reports, the teams work from them, and the portal sends promise dates back.",
    purpose: "Where each in-scope report comes from and which team reads it. Hover a node to trace it; select a file to open it.",
    subsections: [{ id: "data-flow", label: "Report flow" }],
  },
  {
    id: "templates",
    label: "Templates",
    statement: "Every report, column by column, in Rossell's own column names.",
    purpose: "Pick any of the sixteen files to see its sheets, its columns as Rossell named them, what each one means and what is still to confirm.",
    subsections: [{ id: "data-templates", label: "Template view" }],
  },
  {
    id: "dictionary",
    label: "Dictionary",
    statement: "169 fields across 33 entities, holding every column of Rossell's files.",
    purpose: "Search every field and the exact column that carries it in each report, or filter by entity group, file or source.",
    subsections: [{ id: "data-dictionary", label: "Data dictionary" }],
  },
  {
    id: "entities",
    label: "Entity map",
    statement: "Fifteen steps link a customer to an invoice.",
    purpose: "How the entities connect, which reports carry each one, and a way into the dictionary for any step.",
    subsections: [{ id: "data-entities", label: "Entity map" }],
  },
];
