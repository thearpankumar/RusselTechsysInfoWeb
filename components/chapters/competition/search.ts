// ⌘K items for chapter "competition". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/competition/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { allCompetitors, COMPETITOR_GROUP_LABEL } from "@/content/competitors";

export const searchItems: SearchItem[] = [
  ...allCompetitors
    .filter((c) => c.id !== "rossell")
    .map((c) => ({ id: `competitor:${c.id}`, label: c.name, group: "Competitors", hint: COMPETITOR_GROUP_LABEL[c.group], keywords: [c.short, c.hq, c.listed ?? ""], href: "#comp-table", open: { type: "competitor", id: c.id } })),
  { id: "comp:position", label: "Where Rossell sits among peers", group: "Competitors", hint: "Revenue rank, A&D share, services", href: "#comp-ladder", keywords: ["rank", "smallest", "positioning"] },
  { id: "comp:share", label: "Rossell market share estimate ~0.5–0.8%", group: "Competitors", hint: "Estimate", href: "#comp-market", open: { type: "comp-info", id: "share" }, keywords: ["market share", "harness market"] },
  { id: "comp:market", label: "Aerospace wiring harness market US$5.9–8.35bn", group: "Competitors", hint: "Market", href: "#comp-market", open: { type: "comp-info", id: "market" }, keywords: ["market size", "EMS"] },
];
