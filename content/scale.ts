// Scale: what Rossell plans, buys and builds. Undisclosed counts are labelled estimate / session.
import type { ScaleMetric } from "./types-extra";

export type ScaleMetricX = ScaleMetric & {
  /** How a calc / estimate was derived. */
  method?: string;
  /** True when the figure is not public: render "—" with "Not disclosed publicly". */
  undisclosed?: boolean;
};

export const scale: ScaleMetricX[] = [
  { id: "projects", label: "Running projects", value: 44, unit: "projects", plain: "Programs live at the same time, each with its own demand and BOMs.", sources: ["WS"], confidence: "session" },
  { id: "lines-per-project", label: "Demand lines per project", value: 300000, unit: "lines (up to ~3 lakh)", plain: "Rows in the Material Planner report for a single project.", sources: ["WS"], confidence: "session" },
  { id: "demand-lines-total", label: "Demand lines across all projects (upper bound)", value: 13200000, unit: "lines", plain: "44 × 3 lakh = up to ~1.32 crore demand lines, if every project were at the maximum. An upper bound, not a count.", sources: ["WS"], confidence: "calc" },
  { id: "reports", label: "Reports catalogued", value: 16, unit: "reports", plain: "Eight are in scope: six inputs, two outputs.", sources: ["WS", "FILES"], confidence: "session" },
  { id: "reports-in-scope", label: "Reports in scope", value: 8, unit: "reports", plain: "Active Stock, Exception, Exception + Must Arrive By, RT Consolidated BOM, RT Open Order, Forecast, Reorder, Promise Date Upload. GRN is not in scope.", sources: ["WS", "FILES"], confidence: "session" },
  { id: "bom-lines-example", label: "Lines in one wire bundle BOM", value: 96, unit: "lines", asOf: "001-0001-011", plain: "One finished good needs every one of its 96 raw-material lines to be buildable.", sources: ["DECK-SC", "WS"], confidence: "session" },
  { id: "order-book", label: "Order book", value: 900, unit: "₹ Cr", asOf: "2026-09-30", plain: "Up from ₹715 Cr (Mar-26) and ₹800 Cr (Jun-26).", sources: ["S41", "S42", "S73", "S28"], confidence: "reported" },
  { id: "new-orders-h1", label: "New orders, H1 FY27", value: 430, unit: "₹ Cr", asOf: "2026-09-30", plain: "Of which ~₹190 Cr in Q2.", sources: ["S39", "S42"], confidence: "reported" },
  { id: "orders-fy26", label: "Orders won, FY26", value: 570, unit: "₹ Cr", asOf: "2026-03-31", plain: "New business booked in the year.", sources: ["S28"], confidence: "reported" },
  { id: "boeing-parts", label: "Parts delivered to Boeing", value: "100,000+", unit: "parts", asOf: "2022", plain: "A cumulative milestone announced in 2022.", sources: ["S72"], confidence: "reported" },
  { id: "t7a-shipsets", label: "T-7A panel shipsets", value: 1200, unit: "shipsets (up to)", asOf: "through 2033", plain: "A shipset = one aircraft's worth of the panel assemblies.", sources: ["DECK-SC", "S89"], confidence: "reported" },
  { id: "materials-h1", label: "Materials consumed, H1 FY27", value: 213.4, unit: "₹ Cr", asOf: "H1 FY27", plain: "Standalone cost of materials in six months.", sources: ["S41"], confidence: "reported" },
  { id: "materials-share", label: "Materials as share of revenue, H1 FY27", value: 62.7, unit: "%", asOf: "H1 FY27", plain: "213.4 ÷ 340.2: about 63 paise of every rupee of revenue is bought-in material (industry ~70%).", sources: ["S41", "S23"], confidence: "calc" },
  { id: "materials-annualised", label: "Materials, annualised run-rate", value: 427, unit: "₹ Cr / yr", asOf: "H1 FY27 × 2", plain: "Simple doubling of H1. H2 has historically been the stronger half, so the full-year figure is likely higher.", sources: ["S41", "S42"], confidence: "estimate" },
  { id: "materials-count", label: "Materials and suppliers", value: "Thousands of materials, hundreds of suppliers", plain: "As described in working sessions; exact counts not yet shared.", sources: ["WS", "DECK-SC"], confidence: "session" },
  { id: "stock-tied", label: "Stock tied up", value: 200, unit: "₹ Cr (~)", plain: "Inventory on hand, from working sessions; to be validated with Rossell finance.", sources: ["WS", "DECK-SC"], confidence: "session" },
  { id: "stock-at-risk", label: "Stock at physical risk", value: "40–50", unit: "₹ Cr", plain: "Part of the tied-up stock at risk of damage or obsolescence; to be validated with Rossell finance.", sources: ["WS", "DECK-SC"], confidence: "session" },
  { id: "inventory-months", label: "Inventory carrying level", value: 6.67, unit: "months", asOf: "Q2 FY27", plain: "From 7.98 a year earlier; ~4 is the indicative aim.", sources: ["S42", "DECK-SC"], confidence: "reported" },
  { id: "clients", label: "Clients", value: 36, unit: "clients", asOf: "2025-07", plain: "From Boeing only in 2018–19.", sources: ["S79", "S34"], confidence: "reported" },
  { id: "oems", label: "OEM / Tier-1 customers", value: "30+", plain: "Across 8 export countries.", sources: ["S28", "S34"], confidence: "reported" },
  { id: "countries", label: "Export countries", value: 8, unit: "countries", plain: "~98% of revenue is exported.", sources: ["S28", "S34"], confidence: "reported" },
  { id: "headcount", label: "People (Aug 2025)", value: 950, unit: "(~)", asOf: "2025-08", plain: "Up from 680, with a second shift. Latest: 1,281 (Jun 2026, incl. contract staff and trainees).", sources: ["S84"], confidence: "reported" },
  { id: "hours", label: "Working pattern described", value: "17–18 hour days, 7 days a week", plain: "How teams described absorbing the supplier follow-up gap.", sources: ["WS", "DECK-SC"], confidence: "session" },
  // --- research/scale-clients.json (Nov 2026) ---
  { id: "boeing-assemblies", label: "High-value assemblies delivered to Boeing", value: "160,000+", unit: "assemblies", asOf: "2025-09-23", plain: "Cumulative, announced with the T-7A panel contract.", sources: ["R-scl-21"], confidence: "reported" },
  { id: "units-all-customers", label: "Units supplied, all customers", value: "175,000+", unit: "units", asOf: "2024-01", plain: "'More than 1,75,000 units supplied globally over 13 years', at under 500 PPM defects.", sources: ["R-scl-29"], confidence: "reported" },
  { id: "boeing-rate", label: "Boeing delivery rate (implied)", value: "~18,000", unit: "assemblies / year", asOf: "2022-06 to 2025-09", plain: "Roughly how many assemblies a year went to Boeing between the two milestones.", method: "(160,000 − 100,000) ÷ ~3.3 years. Both endpoints are 'over' figures, so this is rough.", sources: ["R-scl-27", "R-scl-21"], confidence: "calc" },
  { id: "skus", label: "SKUs offered / built", value: "250,000", unit: "SKUs", asOf: "2025-09-30", plain: "Distinct finished-good part numbers across customers (Q2 FY26 deck tile).", sources: ["R-scl-17"], confidence: "reported" },
  { id: "t7a-ewis-parts", label: "Unique T-7A EWIS parts (2022 IDIQ)", value: 84, unit: "part numbers", asOf: "2022-02-25", plain: "Distinct harness designs for one aircraft type, over a 10-year agreement.", sources: ["R-scl-22", "R-scl-23"], confidence: "reported" },
  { id: "platforms", label: "Platforms served with EWIS", value: "25+", unit: "platforms", plain: "Rotary and fixed-wing military, commercial, weapon and space systems.", sources: ["R-scl-32"], confidence: "reported" },
  { id: "materials-fy26", label: "Material cost, FY26", value: 303, unit: "₹ Cr", asOf: "FY26", plain: "Consolidated; 62% of sales. Standalone cost of materials consumed ₹311.0 Cr.", sources: ["R-scl-33", "R-scl-13"], confidence: "reported" },
  { id: "materials-run-rate", label: "Material consumption run-rate", value: 39, unit: "₹ Cr / month", asOf: "Q2 FY27", plain: "About ₹1.3 Cr of material consumed every day.", method: "₹117.96 Cr (Q2 FY27) ÷ 3", sources: ["R-scl-1"], confidence: "calc" },
  { id: "purchases-fy26", label: "Materials purchased, FY26", value: 400, unit: "₹ Cr (~)", asOf: "FY26", plain: "Purchases are not reported; this adds what was consumed to what was stocked up.", method: "Standalone materials consumed ₹311.0 Cr + rise in raw-material inventory (total inventory ₹216.9 → ₹313.8 Cr = +₹96.9 Cr, less FG/WIP build of ₹7.9 Cr ≈ +₹89 Cr) ≈ ₹400 Cr.", sources: ["R-scl-1", "R-scl-13"], confidence: "estimate" },
  { id: "purchases-h1", label: "Materials purchased, H1 FY27", value: 283, unit: "₹ Cr (~)", asOf: "H1 FY27", plain: "About ₹47 Cr of buying a month.", method: "Materials consumed ₹213.4 Cr + inventory increase in the cash-flow statement ~₹69.8 Cr (FG/WIP roughly flat).", sources: ["R-scl-1", "R-scl-2"], confidence: "estimate" },
  { id: "order-count", label: "Number of orders", value: "—", plain: "Not disclosed publicly. Rossell reports order intake only as quarterly totals.", undisclosed: true, sources: ["R-scl-4"], confidence: "reported" },
  { id: "order-filings", label: "Orders filed as 'receipt of order'", value: 2, unit: "filings", asOf: "2026-11-07", plain: "6 May 2026 (defence repeat) and 7 Aug 2026 (semiconductor first order). Everything else is a press release or a quarterly total.", sources: ["R-scl-4"], confidence: "reported" },
  { id: "supplier-count", label: "Number of suppliers", value: "—", plain: "Not disclosed publicly. Working sessions describe 'hundreds of suppliers'.", undisclosed: true, sources: ["WS", "DECK-SC"], confidence: "session" },
  { id: "material-count", label: "Number of distinct materials", value: "—", plain: "Not disclosed publicly. Working sessions describe 'thousands of materials'.", undisclosed: true, sources: ["WS", "DECK-SC"], confidence: "session" },
  { id: "order-book-cover", label: "Order book ÷ trailing revenue", value: 1.47, unit: "years", asOf: "2026-09-30", plain: "Confirmed orders cover about a year and a half of sales. Short-cycle semiconductor and space orders ship fast and do not pile up in the book.", method: "₹900 Cr ÷ TTM revenue ₹612 Cr (Screener consolidated)", sources: ["R-scl-1", "R-scl-33"], confidence: "calc" },
  { id: "cumulative-revenue", label: "Revenue since inception to FY25", value: "1,300+", unit: "₹ Cr", asOf: "FY25", plain: "About 14 years of sales; FY26 alone added ₹485 Cr.", sources: ["R-scl-16", "R-scl-15"], confidence: "reported" },
  { id: "workforce-latest", label: "Workforce", value: 1281, unit: "people", asOf: "2026-06-30", plain: "Including contract workers and trainees; targets 2,000 (2027) and 2,500 (2029).", sources: ["R-scl-11", "R-scl-1"], confidence: "reported" },
];

export const getScale = (id: string) => scale.find((m) => m.id === id);
