// ⌘K items for chapter "scale". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/scale/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { scale } from "@/content/scale";
import { orders } from "@/content/orders";
import { illustrativeBom } from "@/content/materials";

/** Scale metric ids shown in the chapter, with the section each lives in. */
const SHOWN: Record<string, string> = {
  "order-count": "/scale/overview#scale-four",
  "order-filings": "/scale/overview#scale-four",
  "order-book": "/scale/overview#scale-four",
  "orders-fy26": "/scale/overview#scale-four",
  "new-orders-h1": "/scale/overview#scale-four",
  "units-all-customers": "/scale/overview#scale-four",
  "boeing-assemblies": "/scale/overview#scale-four",
  "purchases-fy26": "/scale/overview#scale-four",
  "materials-fy26": "/scale/overview#scale-four",
  skus: "/scale/overview#scale-delivered",
  "t7a-ewis-parts": "/scale/overview#scale-delivered",
  "t7a-shipsets": "/scale/overview#scale-delivered",
  "boeing-rate": "/scale/overview#scale-delivered",
  "boeing-parts": "/scale/overview#scale-delivered",
  projects: "/scale/planning#scale-planning",
  "lines-per-project": "/scale/planning#scale-planning",
  "demand-lines-total": "/scale/planning#scale-planning",
  "materials-h1": "/scale/planning#scale-planning",
  "materials-run-rate": "/scale/planning#scale-planning",
  "materials-count": "/scale/planning#scale-undisclosed",
  "supplier-count": "/scale/planning#scale-undisclosed",
  "material-count": "/scale/planning#scale-undisclosed",
};

const fmt = (v: string | number) => (typeof v === "number" ? v.toLocaleString("en-IN") : v);

export const searchItems: SearchItem[] = [
  ...Object.entries(SHOWN).flatMap(([id, href]) => {
    const s = scale.find((x) => x.id === id);
    if (!s) return [];
    return [{ id: `scale:${id}`, label: `${s.label}${s.undisclosed ? " (not disclosed)" : `: ${fmt(s.value)}${s.unit ? ` ${s.unit}` : ""}`}`, group: "Scale", hint: "10", href, open: { type: "scale", id } }];
  }),
  ...orders.map((o) => ({ id: `order:${o.id}`, label: `${o.title} · ${o.when}`, group: "Orders", hint: o.customer.split(" (")[0], keywords: [o.customer, o.value], href: "/scale/orders#scale-orders", open: { type: "order", id: o.id } })),
  { id: "bom:001-0001-011", label: `Wire bundle ${illustrativeBom.fgPartNo} · 96-line BOM`, group: "Scale", hint: "10", href: "/scale/bom#scale-bom", keywords: ["all or nothing", "BOM", "bill of materials", "buildable"] },
];
