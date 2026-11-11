import type { SectionDef } from "./types";

export const whatTheyDoSections: SectionDef[] = [
  {
    id: "overview",
    label: "Overview",
    statement: "Four domains, four ways of ordering.",
    purpose: "The four markets Rossell builds for, and how customers in each place their orders.",
    subsections: [{ id: "wtd-domains", label: "Domains" }],
    anchors: ["what-they-do"],
  },
  {
    id: "services",
    label: "Services",
    statement: "Ten things Rossell does, in plain words.",
    purpose: "The services catalogue; open any service to see which finished goods use it.",
    subsections: [{ id: "what-they-do-services", label: "Catalogue" }],
  },
  {
    id: "mix",
    label: "Work mix",
    statement: "Mostly wire harnesses, mostly built to someone else's design.",
    purpose: "How the work splits by product and by who owns the design.",
    subsections: [{ id: "wtd-mix", label: "How the work splits" }],
  },
];
