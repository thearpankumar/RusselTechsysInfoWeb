import type { SectionDef } from "./types";

export const sourcesSections: SectionDef[] = [
  {
    id: "overview",
    label: "How sure we are",
    statement: "Every figure on this site traces back to a source.",
    purpose: "How many sources and facts there are, where the sources come from, and the six confidence labels.",
    subsections: [
      { id: "sources-counts", label: "Counts" },
      { id: "sources-confidence", label: "Groups and labels" },
    ],
  },
  {
    id: "library",
    label: "Library",
    statement: "Every source, grouped. Citation links across the site land here.",
    purpose: "Search by title, publisher or id, filter by group, and follow any public link.",
    subsections: [{ id: "sources-library", label: "Source library" }],
  },
  {
    id: "disagree",
    label: "Gaps & conflicts",
    statement: "Where our documents tell different stories, and the version we show.",
    purpose: "Decks round, filings restate and press dates differ. We kept every version and chose one on purpose; then what the public record could not tell us.",
    subsections: [
      { id: "sources-disagree", label: "Where sources disagree" },
      { id: "sources-gaps", label: "Research gaps" },
    ],
  },
  {
    id: "questions",
    label: "Open questions",
    statement: "What we are still confirming with you.",
    purpose: "The questions still open with Rossell's teams, what each one affects, and the close of the journey.",
    subsections: [
      { id: "sources-questions", label: "Open questions" },
      { id: "sources-close", label: "Close" },
    ],
  },
];
