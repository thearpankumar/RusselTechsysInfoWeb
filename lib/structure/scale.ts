import type { SectionDef } from "./types";

export const scaleSections: SectionDef[] = [
  {
    id: "overview",
    label: "The four numbers",
    statement: "Hundreds of thousands of assemblies, built one complete kit at a time.",
    purpose: "Orders, order value, finished goods delivered and materials procured: what is on the record and what is not.",
    subsections: [
      { id: "scale-four", label: "The four numbers" },
      { id: "scale-delivered", label: "Behind the delivered count" },
    ],
  },
  {
    id: "planning",
    label: "Planning load",
    statement: "Forty-four projects, each with up to three lakh demand lines.",
    purpose: "What planning has to hold at once: projects, demand lines and the material bill.",
    subsections: [
      { id: "scale-planning", label: "Projects and material" },
      { id: "scale-undisclosed", label: "Not disclosed" },
    ],
  },
  {
    id: "bom",
    label: "96 lines",
    statement: "96 lines, all or nothing.",
    purpose: "One wire bundle's bill of materials: mark any line short and see what can still be built.",
    subsections: [{ id: "scale-bom", label: "The 96-line bill of materials" }],
  },
  {
    id: "orders",
    label: "Orders",
    statement: "Order wins on the record.",
    purpose: "Contracts, agreements and quarterly totals as disclosed; Rossell does not publish a count of orders.",
    subsections: [{ id: "scale-orders", label: "Order wins" }],
  },
];
