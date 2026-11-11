import type { SectionDef } from "./types";

export const supplyBaseSections: SectionDef[] = [
  {
    id: "overview",
    label: "Overview",
    statement: "Thousands of materials. Hundreds of suppliers.",
    purpose: "How many suppliers, in which categories, and what Rossell itself says about its supply base.",
    subsections: [
      { id: "supply-base-count", label: "Count and categories" },
      { id: "sb-reported", label: "In Rossell's own words" },
    ],
  },
  {
    id: "universe",
    label: "Supplier profiles",
    statement: "Who typically supplies a harness maker.",
    purpose: "Industry-example suppliers in three groups; open any one for who they are, what they deal in, example parts and where they are.",
    subsections: [{ id: "supply-base-universe", label: "Supplier universe" }],
  },
  {
    id: "connections",
    label: "Supplier to part",
    statement: "Where each supplier's products end up in a harness.",
    purpose: "Lines join each supplier to the harness parts its products typically become.",
    subsections: [{ id: "supply-base-connections", label: "Supplier to part" }],
  },
];
