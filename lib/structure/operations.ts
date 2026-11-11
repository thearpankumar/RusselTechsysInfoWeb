import type { SectionDef } from "./types";

export const operationsSections: SectionDef[] = [
  {
    id: "overview",
    label: "Lifecycle",
    statement: "How Rossell runs, from a drawing to a delivered wire bundle.",
    purpose: "Seven stages from the customer's requirement to reconciled cash.",
    subsections: [{ id: "operations-lifecycle", label: "Seven stages" }],
  },
  {
    id: "flow",
    label: "Drawing to cash",
    statement: "A drawing becomes a shipped wire bundle in eight steps, and the cash follows two purchase orders.",
    purpose: "The bill-of-materials-to-kit pipeline, then how a customer request turns into an invoice and payment.",
    subsections: [
      { id: "operations-pipeline", label: "Drawing to delivered" },
      { id: "operations-cash", label: "Request to cash" },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    statement: "What to buy is what is left after everything already on its way and on the shelf.",
    purpose: "The net-demand sum with a worked example, and the eleven parameters behind every planning decision.",
    subsections: [
      { id: "operations-net-demand", label: "Net demand" },
      { id: "operations-parameters", label: "Parameters" },
    ],
  },
  {
    id: "workflows",
    label: "Workflows",
    statement: "Twenty workflows in five phases.",
    purpose: "Each recurring piece of work, who does it, what starts it and what it produces.",
    subsections: [{ id: "operations-workflows", label: "Workflow board" }],
  },
  {
    id: "systems",
    label: "Systems",
    statement: "One system of record, a morning report, and Excel and email in between.",
    purpose: "The systems the teams use, and the supplier follow-up loop the buyers run every day.",
    subsections: [
      { id: "operations-systems", label: "Systems map" },
      { id: "operations-loop", label: "Follow-up loop" },
    ],
  },
  {
    id: "rules",
    label: "Rules & roles",
    statement: "The engineering rules that decide which parts list applies, and who touches the work.",
    purpose: "Bill-of-materials rules from the business-rules draft, and the customers, teams, suppliers and systems involved.",
    subsections: [
      { id: "operations-rules", label: "BOM rules" },
      { id: "operations-actors", label: "Actors" },
    ],
  },
  {
    id: "glossary",
    label: "Glossary",
    statement: "The words used every day, in plain English.",
    purpose: "Search or filter the vocabulary of planning, materials, quality and trade.",
    subsections: [{ id: "operations-glossary", label: "Glossary" }],
  },
];
