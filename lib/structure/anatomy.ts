import type { SectionDef } from "./types";

export const anatomySections: SectionDef[] = [
  {
    id: "harness",
    label: "Anatomy",
    statement: "Anatomy of a harness.",
    purpose: "One harness taken apart into its twelve parts; scroll to watch it assemble and select any part.",
    subsections: [
      { id: "anatomy-intro", label: "What a harness is" },
      { id: "anatomy-harness", label: "The twelve parts" },
    ],
  },
  {
    id: "goods",
    label: "Finished goods",
    statement: "Finished goods: what leaves the plant.",
    purpose: "Every type of finished good Rossell ships, what it is and where it sits in an aircraft, tool or satellite.",
    subsections: [{ id: "anatomy-goods", label: "Finished goods by type" }],
  },
  {
    id: "materials",
    label: "Materials",
    statement: "Materials: what goes into every build.",
    purpose: "The families of raw material bought in for each build, each explained in plain English.",
    subsections: [{ id: "anatomy-materials", label: "Materials by family" }],
  },
];
