// ⌘K items for chapter "growth". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/growth/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { ambitions } from "@/content/financials";

export const searchItems: SearchItem[] = [
  { id: "growth:order-book", label: "Order book ₹900 Cr (Sep 2026)", group: "Growth", hint: "03", href: "#growth-order-book", open: { type: "growth-info", id: "order-book" }, keywords: ["backlog", "orders"] },
  { id: "growth:inflow", label: "New orders by quarter", group: "Growth", hint: "03", href: "#growth-orders", keywords: ["order inflow", "purchase orders"] },
  { id: "growth:strategic", label: "Strategic agreements ~₹3,000 Cr", group: "Growth", hint: "03", href: "#growth-pipeline", open: { type: "growth-info", id: "strategic" } },
  { id: "growth:pipeline", label: "Bid pipeline ₹1,350 Cr", group: "Growth", hint: "03", href: "#growth-pipeline", open: { type: "growth-info", id: "pipeline" }, keywords: ["bids"] },
  { id: "growth:mix", label: "Revenue mix 70/30 → 50/50", group: "Growth", hint: "03", href: "#growth-mix", open: { type: "growth-info", id: "mix" }, keywords: ["A&D", "semiconductor", "space"] },
  { id: "growth:inventory", label: "Inventory months 7.98 → 6.67 → ~4", group: "Growth", hint: "03", href: "#growth-inventory", open: { type: "growth-info", id: "inventory" }, keywords: ["working capital", "stock"] },
  ...ambitions.map((a, i) => ({ id: `ambition:${a.id}`, label: `${a.label}: ${a.to}`, group: "Ambitions", hint: a.by, href: i < 4 ? "#growth-ambitions" : "#growth-ambitions-more", open: { type: "ambition", id: a.id } })),
];
