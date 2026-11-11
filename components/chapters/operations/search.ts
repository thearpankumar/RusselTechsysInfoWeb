// ⌘K items for chapter "operations". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/operations/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { lifecycleStages, planningParameters, workflows } from "@/content/lifecycle";
import { glossary } from "@/content/glossary";

const CATEGORY_LABEL: Record<string, string> = {
  commercial: "Commercial",
  "material-engineering": "Materials & engineering",
  planning: "Planning",
  "quality-compliance": "Quality & compliance",
  systems: "Systems",
  trade: "Trade",
  general: "General",
};

/** Same slug as Glossary.tsx uses for its overlay ids. */
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const searchItems: SearchItem[] = [
  ...lifecycleStages.map((s) => ({ id: `stage:${s.id}`, label: `Stage ${s.index} · ${s.name}`, group: "Lifecycle", hint: "Operations", keywords: [s.plain, ...s.steps], href: "#operations-lifecycle" })),
  ...workflows.map((w) => ({ id: `workflow:${w.id}`, label: `${w.id} ${w.name}`, group: "Workflows", hint: w.inScope ? "In scope" : "Context", keywords: [w.trigger, w.output, ...w.actors], href: "#operations-workflows", open: { type: "workflow", id: w.id } })),
  ...planningParameters.map((p) => ({ id: `parameter:${p.id}`, label: p.name, group: "Planning parameters", hint: p.example, keywords: [p.meaning, p.from], href: "#operations-parameters" })),
  ...glossary.map((g) => ({
    id: `glossary:${slug(g.term)}`,
    label: g.term,
    group: "Glossary",
    hint: g.definition.length > 48 ? `${g.definition.slice(0, 47)}…` : g.definition,
    keywords: [g.definition, CATEGORY_LABEL[g.category] ?? ""],
    href: "#operations-glossary",
    open: { type: "glossary", id: slug(g.term) },
  })),
];
