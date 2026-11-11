import type { SectionDef } from "./types";

export const clientsSections: SectionDef[] = [
  {
    id: "overview",
    label: "Overview",
    statement: "One anchor customer became thirty, across four domains.",
    purpose: "The headline numbers, then every client grouped by the domain it mainly buys for.",
    subsections: [
      { id: "clients-numbers", label: "In numbers" },
      { id: "clients-wall", label: "Who Rossell builds for" },
    ],
    anchors: ["clients"],
  },
  {
    id: "matrix",
    label: "Services",
    statement: "What each client buys, service by service.",
    purpose: "Rows are clients, columns are services; open a row for the detail behind it.",
    subsections: [{ id: "clients-matrix", label: "Clients and services" }],
  },
  {
    id: "mapping",
    label: "Financials",
    statement: "Boeing is about 40% of revenue; most other client values are not public.",
    purpose: "Follow each domain to its clients, programs and value, as a diagram or as a plain table.",
    subsections: [{ id: "clients-mapping", label: "Clients, services and financials" }],
  },
  {
    id: "programs",
    label: "Programs",
    statement: "The aircraft Rossell's harnesses and panels go into.",
    purpose: "Named programs by customer, with photos of four of the aircraft.",
    subsections: [
      { id: "clients-programs-photos", label: "Photos" },
      { id: "clients-programs", label: "Program list" },
    ],
  },
];
