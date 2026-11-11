import type { SectionDef } from "./types";

export const portfolioSections: SectionDef[] = [
  {
    id: "overview",
    label: "Overview",
    statement: "A build-to-print specialist Boeing has twice named supplier of the year.",
    purpose: "Who Rossell is in one line, the company at a glance, and how it is listed.",
    subsections: [
      { id: "portfolio-identity", label: "At a glance" },
      { id: "portfolio-listing", label: "Listing" },
    ],
  },
  {
    id: "journey",
    label: "Fifteen years",
    statement: "From a division of a tea group to a listed aerospace supplier.",
    purpose: "Fourteen milestones from 2011 to today; step through them or open any one.",
    subsections: [{ id: "portfolio-timeline", label: "Timeline" }],
  },
  {
    id: "model",
    label: "Business model",
    statement: "Nine jobs in ten arrive as someone else's finished design.",
    purpose: "Build-to-print against build-to-spec, and why a contract manufacturer is not a distributor.",
    subsections: [{ id: "portfolio-model", label: "How the work arrives" }],
  },
  {
    id: "approvals",
    label: "Approvals & awards",
    statement: "Approved to build for aircraft and defence, and recognised by the customers who audit hardest.",
    purpose: "The certifications that open each market, and the awards customers have given.",
    subsections: [
      { id: "portfolio-certifications", label: "Certifications" },
      { id: "portfolio-awards", label: "Awards" },
    ],
  },
];
