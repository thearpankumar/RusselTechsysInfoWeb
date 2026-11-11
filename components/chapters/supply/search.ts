// ⌘K items for chapter "supply-base". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/supply-base/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { supplierGroupOf, supplierGroups, suppliers } from "@/content/suppliers";

const shortName = (n: string) => n.replace(/\s*\(.*\)\s*$/, "");

export const searchItems: SearchItem[] = suppliers.map((s) => ({
  id: `supplier:${s.id}`,
  label: shortName(s.name),
  group: "Suppliers",
  hint: `${supplierGroups.find((g) => g.id === supplierGroupOf(s))?.label ?? ""} · industry example`,
  keywords: [s.name, s.hq, ...s.exampleParts.map((p) => p.part)],
  href: "/supply-base/universe#supply-base-universe",
  open: { type: "supplier", id: s.id },
}));
