import type { SectionDef } from "./types";

export const dataSections: SectionDef[] = [
  {
    id: "overview",
    label: "Inventory",
    statement: "Sixteen reports feed the planning floor. We have mapped every one.",
    purpose: "How many reports there are, which are in scope, and the full list.",
    subsections: [
      { id: "data-overview", label: "At a glance" },
      { id: "data-files", label: "All sixteen reports" },
    ],
  },
  {
    id: "flow",
    label: "Report flow",
    statement: "Each morning IQMS runs its Crystal reports, the teams work from them, and promise dates flow back.",
    purpose: "Where each in-scope report comes from and which team reads it. Hover a node to trace it; select a file to open it.",
    subsections: [{ id: "data-flow", label: "Report flow" }],
  },
  {
    id: "templates",
    label: "Templates",
    statement: "A template of every report, column by column.",
    purpose: "Pick any of the sixteen files to see what it holds, how it is produced, its template sheet and each column explained.",
    subsections: [{ id: "data-templates", label: "Template view" }],
  },
  {
    id: "dictionary",
    label: "Dictionary",
    statement: "184 fields across 34 entities, from customer to invoice.",
    purpose: "Search every field across all sixteen reports, or filter by entity group or by file.",
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
