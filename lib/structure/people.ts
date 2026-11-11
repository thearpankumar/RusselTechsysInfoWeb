import type { SectionDef } from "./types";

export const peopleSections: SectionDef[] = [
  {
    id: "overview",
    label: "Overview",
    statement: "A promoter-led board, a new operating team, and a workforce growing faster than its floor space.",
    purpose: "How many people work at Rossell, counted three ways, and the 2027 target.",
    subsections: [{ id: "people-headcount", label: "Workforce" }],
  },
  {
    id: "leadership",
    label: "Leadership",
    statement: "A leadership bench largely rebuilt between 2020 and 2025.",
    purpose: "Every named leader, what they did before, and where to find them on LinkedIn.",
    subsections: [{ id: "people-leadership", label: "Leaders" }],
  },
  {
    id: "structure",
    label: "Reporting chain",
    statement: "We work inside one reporting chain, six steps from the CEO to the buyers.",
    purpose: "The supply chain management (SCM) chain, who our contacts are, and who else reports where.",
    subsections: [{ id: "people-org", label: "Reporting chain" }],
  },
  {
    id: "roles",
    label: "Levels and departments",
    statement: "Eight designation levels and twelve departments under one approval layer.",
    purpose: "How titles rank below the C-suite, and what each department does.",
    subsections: [
      { id: "people-ladder", label: "Designation ladder" },
      { id: "people-departments", label: "Departments" },
    ],
  },
  {
    id: "workforce",
    label: "Workforce",
    statement: "A workforce that has nearly doubled in a year.",
    purpose: "Headcount at each disclosure since the 2025 ramp, with the definitions that make them differ.",
    subsections: [{ id: "people-workforce", label: "Headcount over time" }],
  },
  {
    id: "board",
    label: "Board",
    statement: "Six directors, three of them independent.",
    purpose: "Who sits on the board, in what capacity, and on which committees.",
    subsections: [{ id: "people-board", label: "Board of directors" }],
  },
];
