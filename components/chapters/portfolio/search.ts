// ⌘K items for chapter "portfolio". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/portfolio/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { businessModel, certifications } from "@/content/company";
import { awardsWall, journey } from "@/content/portfolio";

export const searchItems: SearchItem[] = [
  ...journey.map((j) => ({ id: `milestone:${j.id}`, label: `${j.when} · ${j.label}`, group: "Milestones", hint: "Portfolio", href: "#portfolio-timeline", open: { type: "milestone", id: j.id }, keywords: [j.detail] })),
  ...certifications.map((c) => ({ id: `certification:${c.id}`, label: c.name, group: "Certifications", hint: "Portfolio", href: "#portfolio-certifications", open: { type: "certification", id: c.id }, keywords: [c.scope] })),
  ...awardsWall.map((a) => ({ id: `award:${a.id}`, label: `${a.name} · ${a.by}`, group: "Awards", hint: a.year, href: "#portfolio-awards", open: { type: "award", id: a.id } })),
  ...businessModel.map((b) => ({ id: `model:${b.id}`, label: b.name, group: "Business model", hint: "Portfolio", href: "#portfolio-model", open: { type: "business-model", id: b.id }, keywords: [b.plain] })),
];
