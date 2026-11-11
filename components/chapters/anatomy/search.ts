// ⌘K items for chapter "anatomy". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/anatomy/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { harnessParts, materials } from "@/content/materials";
import { products } from "@/content/products";

export const searchItems: SearchItem[] = [
  ...harnessParts.map((p) => ({ id: `harness-part:${p.id}`, label: p.name, group: "Harness parts", hint: p.spec, keywords: [p.spec, p.materialId], href: "/anatomy/harness#anatomy-harness", open: { type: "harness-part", id: p.id } })),
  ...products.map((p) => ({ id: `product:${p.id}`, label: p.name, group: "Products", hint: p.nickname, keywords: [...(p.programs ?? []), ...p.domains], href: "/anatomy/goods#anatomy-goods", open: { type: "product", id: p.id } })),
  ...materials.map((m) => ({ id: `material:${m.id}`, label: m.name, group: "Materials", hint: m.typicalSpec[0], keywords: [...m.typicalSpec, ...(m.exampleMakers ?? [])], href: "/anatomy/materials#anatomy-materials", open: { type: "material", id: m.id } })),
];
