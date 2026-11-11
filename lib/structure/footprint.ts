import type { SectionDef } from "./types";

export const footprintSections: SectionDef[] = [
  {
    id: "overview",
    label: "Overview",
    statement: "One airport-side campus, a small US arm, and customers on three continents.",
    purpose: "The footprint in four numbers, and a map of the sites and the export markets they serve.",
    subsections: [
      { id: "footprint-stats", label: "In numbers" },
      { id: "footprint-map", label: "Map" },
    ],
  },
  {
    id: "sites",
    label: "Sites",
    statement: "Five addresses, one manufacturing cluster.",
    purpose: "Every Rossell site: what happens there, how big it is, and whether it is running yet.",
    subsections: [{ id: "footprint-sites", label: "Sites" }],
  },
  {
    id: "area",
    label: "Floor area",
    statement: "From 4,000 sq ft in 2011 to more than 450,000 sq ft today.",
    purpose: "Built-up floor area in Bengaluru at each disclosure, and how much of it is in use.",
    subsections: [{ id: "footprint-area", label: "Floor area" }],
  },
];
