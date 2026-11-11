// ⌘K items for chapter "financials". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/financials/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";

export const searchItems: SearchItem[] = [
  { id: "kpi:fy26-revenue", label: "FY26 revenue ₹485.2 Cr (+87%)", group: "Financials", hint: "02", href: "#fin-headline", open: { type: "fin-period", id: "FY26" }, keywords: ["revenue", "sales", "turnover"] },
  { id: "kpi:h1fy27", label: "H1 FY27 revenue ₹340.2 Cr", group: "Financials", hint: "02", href: "#fin-headline", open: { type: "fin-period", id: "H1FY27" } },
  { id: "fin:revenue-chart", label: "Revenue by year and quarter", group: "Financials", hint: "02", href: "#fin-revenue-chart", keywords: ["annual", "quarterly", "margins", "EBITDA"] },
  ...(
    [
      ["q2-revenue", "Q2 FY27 revenue ₹185.5 Cr"],
      ["q2-ebitda", "Q2 FY27 EBITDA ₹29.0 Cr"],
      ["q2-margin", "Q2 FY27 EBITDA margin 15.6%"],
      ["q2-pbt", "Q2 FY27 profit before tax ₹12.7 Cr"],
      ["q2-pat", "Q2 FY27 profit after tax ₹9.66 Cr"],
    ] as const
  ).map(([id, label]) => ({ id: `kpi:${id}`, label, group: "Financials", hint: "02", href: "#fin-latest-quarter", open: { type: "fin-kpi", id } })),
  { id: "fin:rupee", label: "Where each rupee of revenue went (H1 FY27)", group: "Financials", hint: "02", href: "#fin-rupee", keywords: ["cost structure", "employee cost", "other costs"] },
  { id: "fin:materials", label: "Material cost ₹303 Cr FY26", group: "Financials", hint: "02", href: "#fin-materials", open: { type: "fin-info", id: "materials" }, keywords: ["cost", "purchases", "BOM"] },
  { id: "fin:borrowings", label: "Borrowings ₹450 Cr (Sep 2026)", group: "Financials", hint: "02", href: "#fin-balance", open: { type: "fin-info", id: "borrowings" }, keywords: ["debt"] },
  { id: "fin:inventory", label: "Inventory ₹386 Cr (Sep 2026)", group: "Financials", hint: "02", href: "#fin-balance", open: { type: "fin-info", id: "inventory" }, keywords: ["stock", "working capital"] },
  { id: "fin:ocf", label: "Operating cash flow FY26 −₹82.8 Cr", group: "Financials", hint: "02", href: "#fin-balance", open: { type: "fin-info", id: "ocf" }, keywords: ["cash"] },
  { id: "fin:raise", label: "₹300 Cr preferential raise (SBI MF)", group: "Financials", hint: "02", href: "#fin-raise", open: { type: "fin-info", id: "raise" }, keywords: ["fundraise", "allotment", "promoter", "SBI"] },
];
