// ⌘K items for chapter "footprint". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/footprint/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { markets, sites } from "@/content/footprint";

export const searchItems: SearchItem[] = [
  ...sites.map((s) => ({ id: `site:${s.id}`, label: s.name, group: "Locations", hint: s.city, href: "#footprint-sites", open: { type: "site", id: s.id }, keywords: [s.whatHappens] })),
  ...markets.map((m) => ({ id: `market:${m.id}`, label: m.region, group: "Export markets", hint: m.shareLabel, href: "#footprint-map", open: { type: "market", id: m.id }, keywords: [m.countries, m.focus] })),
  { id: "footprint:area", label: "Floor area 465k sq ft (Bengaluru)", group: "Locations", hint: "04", href: "#footprint-area", keywords: ["square feet", "campus", "Aerospace Park", "capacity"] },
];
