import type { SectionDef } from "./types";

export const rulesSections: SectionDef[] = [
  {
    id: "register",
    label: "Register",
    statement: "Every rule in one register: what applies, to what, and since when.",
    purpose: "Search, filter and sort every business rule by status, active period, context, section and owner, as a table, cards or a timeline.",
    subsections: [
      { id: "rules-overview", label: "At a glance" },
      { id: "rules-register", label: "All rules" },
      { id: "rules-questions", label: "Open questions" },
    ],
  },
];
