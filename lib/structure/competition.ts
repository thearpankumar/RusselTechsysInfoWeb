import type { SectionDef } from "./types";

export const competitionSections: SectionDef[] = [
  {
    id: "overview",
    label: "Where Rossell sits",
    statement: "A small, focused player among much larger electronics makers.",
    purpose: "Rossell's rank on size, aerospace and defence focus, breadth of services and market share.",
    subsections: [
      { id: "comp-ladder", label: "Revenue ladder" },
      { id: "comp-position", label: "Focus, breadth, share" },
    ],
    anchors: ["competition"],
  },
  {
    id: "peers",
    label: "Peers",
    statement: "Indian peers are about 2–10× Rossell's size; global harness specialists are the closer benchmark.",
    purpose: "Side-by-side figures and a size-against-profitability chart; filter by peer set.",
    subsections: [
      { id: "comp-table", label: "Side by side" },
      { id: "comp-bubble", label: "Size vs profitability" },
    ],
  },
  {
    id: "services",
    label: "Who offers what",
    statement: "Broad in harness work; no PCB assembly, box build or avionics.",
    purpose: "Which of twelve services each company offers. Rossell is the first row.",
    subsections: [{ id: "comp-services", label: "Services matrix" }],
  },
  {
    id: "market",
    label: "Market",
    statement: "Well under 1% of a US$6–8bn market.",
    purpose: "Third-party sizes of the global harness market and Rossell's estimated share.",
    subsections: [{ id: "comp-market", label: "How big the pond is" }],
  },
];
