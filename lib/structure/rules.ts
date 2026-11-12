import type { SectionDef } from "./types";

export const rulesSections: SectionDef[] = [
  {
    id: "register",
    label: "Register",
    statement: "Every rule in one register: what applies, to what, and since when.",
    purpose: "Search, filter and sort every business rule by status, state history, context, section and owner; compare two dates; download it as Excel.",
    subsections: [
      { id: "rules-overview", label: "At a glance" },
      { id: "rules-coverage", label: "Coverage" },
      { id: "rules-register", label: "All rules" },
      { id: "rules-questions", label: "Open questions" },
    ],
  },
];
