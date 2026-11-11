// ⌘K items for chapter "what-they-do". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/what-they-do/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { domains, services } from "@/content/domains";

export const searchItems: SearchItem[] = [
  ...domains.map((d) => ({ id: `domain:${d.id}`, label: d.name, group: "Domains", hint: d.orderingPattern, href: "#wtd-domains", open: { type: "domain", id: d.id } })),
  ...services.map((s) => ({ id: `service:${s.key}`, label: s.label, group: "Services", hint: s.short, keywords: [s.short], href: "#what-they-do-services", open: { type: "service", id: s.key } })),
  { id: "wtd:mix", label: "Work mix: EWIS share and build-to-print vs build-to-spec", group: "Domains", hint: "What they do", href: "#wtd-mix", keywords: ["EWIS share", "build-to-print", "build-to-spec", "mix"] },
];
