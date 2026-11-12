import type { SectionDef } from "./types";

// Four sections (sub-tabs) in reading order, so the register is one click away instead of a long scroll.
// Filters live in the URL, so a count, a coverage cell or a question opens "All rules" already filtered.
export const rulesSections: SectionDef[] = [
  {
    id: "overview",
    label: "At a glance",
    statement: "Every rule in one register: what applies, to what, and since when.",
    purpose: "How many rules are in force, how many wait on an answer, and what they apply to. Every count opens the rules behind it.",
    subsections: [{ id: "rules-overview", label: "At a glance" }],
  },
  {
    id: "coverage",
    label: "Coverage",
    statement: "Where the rules sit: each part of the spec against what it applies to.",
    purpose: "Brighter cells hold more rules; a dash means none. Select a cell to see those rules.",
    subsections: [{ id: "rules-coverage", label: "Coverage" }],
  },
  {
    id: "register",
    label: "All rules",
    statement: "Every rule, with its status on any date you pick.",
    purpose:
      "Each rule moves through dated states (draft, review, approved, active, replaced); its status is Active only while it is in force on the as-of date. Search (F), filter, sort, compare two dates, open a rule to edit its dates, or download it all as Excel.",
    subsections: [{ id: "rules-register", label: "All rules" }],
  },
  {
    id: "questions",
    label: "Open questions",
    statement: "These questions decide the rules that cannot switch on yet.",
    purpose: "Each answer either confirms the rules waiting on it or changes them. Select a question's rules to see them.",
    subsections: [{ id: "rules-questions", label: "Open questions" }],
  },
];
