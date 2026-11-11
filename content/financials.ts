// Financials. All money in ₹ Cr (crore = 10 million rupees). FY = April–March (FY27 = Apr 2026–Mar 2027).
import type { Fact } from "./types";
import { fact, type FinancialPeriod, type KpiRow, type MixSplit, type SeriesPoint } from "./types-extra";

const CR = "₹ Cr";
const PCT = "%";

export const annual: FinancialPeriod[] = [
  {
    id: "FY24",
    label: "FY24",
    kind: "annual",
    periodEnd: "2024-03-31",
    revenue: fact(217, ["S44"], "reported", { unit: CR }),
    note: "Pre-listing year; only revenue is available from Screener.",
  },
  {
    id: "FY25",
    label: "FY25",
    kind: "annual",
    periodEnd: "2025-03-31",
    revenue: fact(259.4, ["S44", "DECK-RESEARCH"], "reported", { unit: CR }),
    ebitda: fact(38.4, ["S44"], "reported", { unit: CR }),
    ebitdaMarginPct: fact(14.8, ["S44"], "calc", { unit: PCT, note: "38.4 ÷ 259.4" }),
    pbt: fact(10.5, ["S44"], "reported", { unit: CR, note: "Reported as ~₹10–11 Cr; midpoint shown." }),
    yoyRevenueGrowthPct: fact(19.5, ["S44"], "calc", { unit: PCT, note: "259.4 ÷ 217 − 1" }),
  },
  {
    id: "FY26",
    label: "FY26",
    kind: "annual",
    periodEnd: "2026-03-31",
    revenue: fact(485.2, ["S29", "S59"], "reported", { unit: CR }),
    ebitda: fact(66.6, ["S29"], "reported", { unit: CR }),
    ebitdaMarginPct: fact(13.7, ["S29"], "calc", { unit: PCT, note: "66.6 ÷ 485.2" }),
    pbt: fact(28.5, ["S29"], "reported", { unit: CR }),
    pat: fact(21.9, ["S29"], "reported", { unit: CR, note: "Consolidated." }),
    yoyRevenueGrowthPct: fact(87, ["S29", "S59"], "reported", { unit: PCT, note: "Reported as 86.84%." }),
  },
  {
    id: "H1FY27",
    label: "H1 FY27",
    kind: "half",
    periodEnd: "2026-09-30",
    revenue: fact(340.2, ["S41", "S42"], "reported", { unit: CR }),
    ebitda: fact(52.2, ["S41"], "reported", { unit: CR }),
    ebitdaMarginPct: fact(15.3, ["S41"], "reported", { unit: PCT }),
    pbt: fact(22.3, ["S41"], "reported", { unit: CR }),
    pat: fact(16.4, ["S41"], "reported", {
      unit: CR,
      note: "Per company presentation. Adding the two consolidated quarterly PATs gives ₹16.80 Cr; the ₹7.0 Cr Q1 figure shown here is rounded.",
    }),
    yoyRevenueGrowthPct: fact(60, ["S41"], "reported", { unit: PCT }),
    note: "H1 FY27 = 70% of FY26 revenue. The supply-chain deck (p.17) rounds H1 to '~₹345 Cr'; the presentation figure is ₹340.2 Cr.",
  },
];

export const quarterly: FinancialPeriod[] = [
  {
    id: "Q1FY26",
    label: "Q1 FY26",
    kind: "quarter",
    periodEnd: "2025-06-30",
    revenue: fact(87.0, ["DECK-SC", "D-askfuzz"], "reported", { unit: CR }),
  },
  {
    id: "Q2FY26",
    label: "Q2 FY26",
    kind: "quarter",
    periodEnd: "2025-09-30",
    revenue: fact(125.3, ["S39", "DECK-SC"], "reported", { unit: CR }),
    ebitda: fact(15.1, ["S39", "DECK-RESEARCH"], "reported", { unit: CR }),
    ebitdaMarginPct: fact(12.0, ["S39", "DECK-RESEARCH"], "reported", { unit: PCT }),
    pbt: fact(6.7, ["S39", "DECK-RESEARCH"], "reported", { unit: CR }),
  },
  {
    id: "Q3FY26",
    label: "Q3 FY26",
    kind: "quarter",
    periodEnd: "2025-12-31",
    revenue: fact(130.0, ["DECK-SC", "D-tijori"], "reported", { unit: CR }),
  },
  {
    id: "Q4FY26",
    label: "Q4 FY26",
    kind: "quarter",
    periodEnd: "2026-03-31",
    revenue: fact(142.4, ["DECK-SC", "S92"], "reported", { unit: CR }),
    yoyRevenueGrowthPct: fact(61, ["S92"], "reported", { unit: PCT }),
    note: "Q4 is the strongest quarter of FY26 (S45). The four FY26 quarters sum to ₹484.7 Cr vs ₹485.2 Cr reported (rounding).",
  },
  {
    id: "Q1FY27",
    label: "Q1 FY27",
    kind: "quarter",
    periodEnd: "2026-06-30",
    revenue: fact(154.7, ["S30", "S31", "S73"], "reported", { unit: CR }),
    ebitda: fact(23.3, ["S30", "S31"], "reported", { unit: CR }),
    ebitdaMarginPct: fact(15.1, ["S30"], "calc", { unit: PCT, note: "23.3 ÷ 154.7" }),
    pbt: fact(9.6, ["S73"], "reported", { unit: CR }),
    pat: fact(7.0, ["S30", "S31"], "reported", { unit: CR }),
    yoyRevenueGrowthPct: fact(78, ["S30"], "reported", { unit: PCT }),
  },
  {
    id: "Q2FY27",
    label: "Q2 FY27",
    kind: "quarter",
    periodEnd: "2026-09-30",
    revenue: fact(185.5, ["S39"], "reported", { unit: CR, note: "Highest quarter ever." }),
    ebitda: fact(29.0, ["S39"], "reported", { unit: CR }),
    ebitdaMarginPct: fact(15.6, ["S39"], "calc", { unit: PCT, note: "29.0 ÷ 185.5" }),
    pbt: fact(12.7, ["S39"], "reported", { unit: CR, note: "First double-digit quarterly PBT." }),
    pat: fact(9.66, ["S40"], "reported", { unit: CR, note: "Consolidated. Standalone PAT ₹9.4 Cr (+88%) per the supply-chain deck." }),
    yoyRevenueGrowthPct: fact(48, ["S39"], "reported", { unit: PCT }),
  },
];

export const kpis: KpiRow[] = [
  { id: "fy26-revenue", label: "FY26 revenue", value: 485.2, unit: CR, asOf: "FY26", plain: "Full-year sales, up 87% on FY25.", sources: ["S29"], confidence: "reported" },
  { id: "q2-revenue", label: "Q2 FY27 revenue", value: 185.5, unit: CR, asOf: "Q2 FY27", plain: "Best quarter ever, +48% year on year.", sources: ["S39"], confidence: "reported" },
  { id: "q2-ebitda", label: "Q2 FY27 EBITDA", value: 29.0, unit: CR, asOf: "Q2 FY27", plain: "Operating profit before interest and depreciation, +92% YoY.", sources: ["S39", "DECK-SC"], confidence: "reported" },
  { id: "q2-margin", label: "Q2 FY27 EBITDA margin", value: 15.6, unit: PCT, asOf: "Q2 FY27", plain: "29.0 ÷ 185.5: margins widened as volume grew.", sources: ["S39"], confidence: "calc" },
  { id: "q2-pbt", label: "Q2 FY27 PBT", value: 12.7, unit: CR, asOf: "Q2 FY27", plain: "Profit before tax, +89%: the first double-digit quarter.", sources: ["S39"], confidence: "reported" },
  { id: "q2-pat", label: "Q2 FY27 PAT (consolidated)", value: 9.66, unit: CR, asOf: "Q2 FY27", plain: "Profit after tax. Standalone ₹9.4 Cr (+88%).", sources: ["S40", "DECK-SC"], confidence: "reported" },
  { id: "h1-revenue", label: "H1 FY27 revenue", value: 340.2, unit: CR, asOf: "H1 FY27", plain: "Six months already equal 70% of all of FY26.", sources: ["S41", "S42"], confidence: "reported" },
  { id: "h1-margin", label: "H1 FY27 EBITDA margin", value: 15.3, unit: PCT, asOf: "H1 FY27", plain: "Up from 13.7% for FY26.", sources: ["S41"], confidence: "reported" },
  { id: "order-book", label: "Order book", value: 900, unit: CR, asOf: "2026-09-30", plain: "Confirmed orders not yet delivered: about 2.6× H1 FY27 revenue, or ~1.5 years of trailing-12-month sales.", sources: ["S41", "S42"], confidence: "reported" },
  { id: "inventory-months", label: "Inventory carrying level", value: 6.67, unit: "months", asOf: "Q2 FY27", plain: "Stock on hand covers ~6.7 months of consumption, down from 7.98.", sources: ["S42", "DECK-SC"], confidence: "reported" },
];

/* ---------- debt, cash, cost ---------- */

export const debtAndCash: Fact<number>[] = [
  fact(240, ["S59"], "reported", { label: "Borrowings, end FY25", unit: CR, asOf: "2025-03-31" }),
  fact(409, ["S59"], "reported", { label: "Borrowings, end FY26", unit: CR, asOf: "2026-03-31", note: "+~70% (₹240 → ₹409 Cr); reported as +67%." }),
  fact(450.23, ["R-scl-2", "S40"], "reported", { label: "Borrowings, 30 Sep 2026 (consolidated)", unit: CR, asOf: "2026-09-30", note: "Per the H1 FY27 results filing balance sheet; also reported as total financial indebtedness (S40). Before the ₹300 Cr raise." }),
  fact(495, ["S44"], "reported", { label: "Borrowings per Screener", unit: CR, asOf: "2026-09-30", note: "Indicative only; Screener's figure includes other liabilities. Use ₹450.23 Cr." }),
  fact(-82.8, ["S85"], "reported", { label: "Operating cash flow, FY26", unit: CR, asOf: "FY26", note: "Negative: growth absorbed cash into inventory and receivables." }),
  fact(21.2, ["S41"], "reported", { label: "Finance cost, H1 FY27", unit: CR, asOf: "H1 FY27", note: "vs ₹9.8 Cr a year earlier: more than doubled." }),
  fact(9.8, ["S41"], "reported", { label: "Finance cost, H1 FY26", unit: CR, asOf: "H1 FY26" }),
];

export const costStructureH1FY27 = {
  basis: "Standalone, H1 FY27 (Apr–Sep 2026)",
  revenue: fact(340.2, ["S41"], "reported", { unit: CR }),
  lines: [
    { id: "materials", label: "Materials", amount: fact(213.4, ["S41"], "reported", { unit: CR }), sharePct: fact(62.7, ["S41"], "calc", { unit: PCT, note: "213.4 ÷ 340.2" }), plain: "Wire, connectors, contacts and every other bought-in part." },
    { id: "employee", label: "Employee cost", amount: fact(48.6, ["S41"], "reported", { unit: CR }), sharePct: fact(14.3, ["S41"], "calc", { unit: PCT, note: "48.6 ÷ 340.2" }), plain: "Salaries and wages for a workforce of ~1,281 (Jun 2026, incl. contract staff and trainees), working ~1.5 shifts." },
    { id: "finance", label: "Finance cost", amount: fact(21.2, ["S41"], "reported", { unit: CR }), sharePct: fact(6.2, ["S41"], "calc", { unit: PCT, note: "21.2 ÷ 340.2" }), plain: "Interest on the debt that funds inventory." },
  ],
  industryComparison: fact(70, ["S23"], "reported", { unit: PCT, label: "Components' share of product cost in EMS (industry)" }),
};

export const fundraise = {
  amount: fact(300, ["S42", "S86"], "reported", { unit: CR, label: "Preferential allotment" }),
  shares: fact(2572898, ["S42", "S86"], "reported", { unit: "shares", label: "25,72,898 equity shares" }),
  pricePerShare: fact(1166, ["S42", "S86"], "reported", { unit: "₹" }),
  checkAmount: fact(300.0, ["S86"], "calc", { unit: CR, note: "25,72,898 × ₹1,166 = ₹299.99 Cr" }),
  allottee: fact("Almost entirely SBI Mutual Fund schemes", ["S42", "S86"], "reported"),
  boardApproval: fact("2026-09-18", ["S42", "S86"], "reported"),
  egm: fact("2026-10-15", ["S42", "S86"], "reported"),
  allotted: fact("2026-11-03", ["S86", "R-scl-3"], "reported", { note: "Allotment date 3 Nov 2026 per S86; the exchange filing (R-scl-3) is dated 4 Nov 2026." }),
  debtRepayment: fact(230, ["S42"], "reported", { unit: CR, label: "At least this much earmarked to repay debt" }),
  replaced: fact("An earlier (Nov 2025) approval to raise up to ₹300 Cr via QIP", ["S86"], "reported"),
  promoterHoldingBeforePct: fact(69.9, ["S42", "S87"], "reported", { unit: PCT }),
  promoterHoldingAfterPct: fact(65.43, ["S42", "S87"], "reported", { unit: PCT }),
  kotakBulkDeal: fact(1847117, ["S87"], "reported", { unit: "shares", label: "Kotak Mahindra MF bought 18,47,117 shares from promoters (bulk deal)" }),
};

/* ---------- orders and pipeline ---------- */

export const orderBook: SeriesPoint[] = [
  { label: "Mar-26", asOf: "2026-03-31", value: 715, unit: CR, sources: ["S28"], confidence: "reported", note: "Confirmed POs; ~50/50 A&D vs non-A&D." },
  { label: "Jun-26", asOf: "2026-06-30", value: 800, unit: CR, sources: ["S73"], confidence: "reported" },
  { label: "Sep-26", asOf: "2026-09-30", value: 900, unit: CR, sources: ["S41", "S42"], confidence: "reported" },
];

export const pipeline: Fact<number>[] = [
  fact(570, ["S28"], "reported", { label: "Orders won in FY26", unit: CR, asOf: "2026-03" }),
  fact(3000, ["S28"], "reported", { label: "Long-term strategic agreements (more than)", unit: CR, asOf: "2026-03" }),
  fact(4500, ["S28"], "reported", { label: "Bids submitted (Q4 FY26 call)", unit: CR, asOf: "2026-05" }),
  fact(430, ["S39", "S42"], "reported", { label: "New orders, H1 FY27", unit: CR, asOf: "2026-09" }),
  fact(190, ["S39", "S42"], "reported", { label: "New orders, Q2 FY27", unit: CR, asOf: "2026-09" }),
  fact(240, ["S39", "S42"], "calc", { label: "New orders, Q1 FY27 (H1 − Q2)", unit: CR, asOf: "2026-06", note: "430 − 190" }),
  fact(1000, ["S39"], "reported", { label: "Bids submitted in Q2 FY27", unit: CR, asOf: "2026-09" }),
  fact(1350, ["S42"], "reported", { label: "Bid pipeline across A&D, semiconductor, industrial", unit: CR, asOf: "2026-09", note: "Definition differs from the ₹4,500 Cr Q4 call figure; not comparable." }),
];

export const programValues: Fact<string>[] = [
  fact("~US$200M strategic agreements (T-7)", ["S28"], "reported", { label: "T-7A", note: "Ramp-up later in FY27." }),
  fact("Up to 1,200 shipsets through 2033", ["DECK-SC", "S89"], "reported", { label: "T-7A electrical panel IDIQ" }),
  fact("~₹400 Cr multi-year contract", ["S28", "DECK-SC"], "reported", { label: "Space", note: "Deck dates the award to FY26." }),
  fact("~₹70 Cr left on a loss-making Boeing program, front-loaded into Q1–Q2 FY27 (~₹75 Cr executed in FY26)", ["S28"], "reported", { label: "Boeing legacy program" }),
];

/* ---------- mix and targets ---------- */

export const revenueMix: MixSplit[] = [
  { label: "Today (Q3–Q4 FY26)", parts: [{ name: "A&D", pct: 70 }, { name: "Non-A&D", pct: 30 }], sources: ["S88", "DECK-SC"], confidence: "reported" },
  { label: "Management target", parts: [{ name: "A&D", pct: 50 }, { name: "Non-A&D", pct: 50 }], sources: ["S88", "DECK-SC"], confidence: "reported" },
  { label: "Order book, Mar-26", parts: [{ name: "A&D", pct: 50 }, { name: "Non-A&D", pct: 50 }], sources: ["S28"], confidence: "reported", note: "'About 50/50' confirmed POs." },
];

export const mixFacts: Fact<number>[] = [
  fact(20, ["S28"], "reported", { label: "Semiconductor + space share of FY26 revenue", unit: PCT, note: "Semiconductor work so far is all wire harnesses. The 70/30 split counts all non-A&D (incl. industrial), so 20% and 30% are not in conflict." }),
  fact(145, ["DECK-SC"], "reported", { label: "Non-A&D revenue in H1 FY27 (~₹140–150 Cr)", unit: CR, note: "Deck says of '~₹345 Cr' H1 revenue; midpoint shown." }),
  fact(42.6, ["DECK-SC", "S41"], "calc", { label: "Non-A&D share of H1 FY27 revenue", unit: PCT, note: "145 ÷ 340.2; range 41–44%." }),
  fact(98, ["S28"], "reported", { label: "Export share of revenue", unit: PCT }),
  fact(80, ["S28"], "reported", { label: "North America share of exports", unit: PCT }),
];

export const targets: Fact<string>[] = [
  fact("FY27 revenue growth similar to FY26 (~87%)", ["S28"], "reported"),
  fact("Semiconductor + space revenue to grow 300–400% in FY27", ["S28", "DECK-SC"], "reported"),
  fact("Semiconductor revenue of ~US$200M in 3–5 years", ["S28", "DECK-SC"], "reported"),
  fact("Revenue mix from 70/30 to 50/50 A&D vs non-A&D", ["S88"], "reported"),
  fact("Electro-mechanical systems in FY28–29 at 21–30% margins", ["S28", "DECK-SC"], "reported"),
  fact("Defence platform value share from ~7% to ~15% in 3–5 years", ["S79"], "reported"),
  fact("Inventory to ~4 months of coverage", ["S28", "DECK-SC"], "reported", {
    note: "Deck p.15: 'target 4 in 24 months'. The research markdown could not re-confirm this on a second reading of the Q4 call: treat as indicative.",
  }),
];

/* ---------- inventory ---------- */

export const inventoryMonths: SeriesPoint[] = [
  { label: "Earlier", asOf: "2024-03-31", value: 10, unit: "months", sources: ["S28"], confidence: "reported", note: "'~10 months earlier' per Q4 FY26 call; exact date not given." },
  { label: "Q2 FY26", asOf: "2025-09-30", value: 7.98, unit: "months", sources: ["S42"], confidence: "reported" },
  { label: "FY26", asOf: "2026-03-31", value: 7.67, unit: "months", sources: ["S28"], confidence: "reported", note: "Research deck p.34 rounds to ~7.7." },
  { label: "Q2 FY27", asOf: "2026-09-30", value: 6.67, unit: "months", sources: ["S42", "DECK-SC"], confidence: "reported", note: "Markdown says ~6.7." },
  { label: "Target", asOf: "2028-09-30", value: 4, unit: "months", sources: ["S28", "DECK-SC"], confidence: "estimate", note: "Indicative long-term aim (~4 months, 'in 24 months' per deck); not re-confirmed." },
];

export const inventoryDays: SeriesPoint[] = [
  { label: "FY24", asOf: "2024-03-31", value: 565, unit: "days", sources: ["S44"], confidence: "reported" },
  { label: "FY25", asOf: "2025-03-31", value: 566, unit: "days", sources: ["S44"], confidence: "reported" },
  { label: "FY26", asOf: "2026-03-31", value: 380, unit: "days", sources: ["S44"], confidence: "reported" },
];

export const inventorySignals: Fact<string>[] = [
  fact("Inventory grew ~45% while revenue grew ~87% in FY26", ["S28"], "reported"),
  fact("Each month of coverage removed releases working capital on a business running at ~₹185 Cr a quarter", ["S39", "S42"], "calc"),
  fact("~₹200 Cr of stock tied up, ~₹40–50 Cr of it at physical risk", ["WS", "DECK-SC"], "session", { note: "From working sessions; to be validated with Rossell finance." }),
  fact("Late import-duty reconciliation estimated to cost ₹10–15 Cr", ["WS", "DECK-SC"], "session", { note: "To be validated with Rossell finance." }),
];

export const risks: Fact<string>[] = [
  fact("Customer concentration: one large customer per category; ~80% North America", ["S28"], "reported"),
  fact("Working-capital intensity: FY26 operating cash flow −₹82.8 Cr; H1 FY27 finance cost more than doubled", ["S85", "S41"], "reported"),
  fact("A loss-making Boeing program (~₹70 Cr left)", ["S28"], "reported"),
  fact("Ramp-up timing on T-7, semiconductor and space", ["S28"], "reported"),
  fact("Spending on qualifications, FAIs, training and tooling for new customers presses on margins", ["S28"], "reported"),
];

/* ---------- extended series (research/scale-clients.json, Nov 2026) ---------- */

/** Material cost by year: consolidated per Screener's expense schedule; H1 FY27 standalone per the investor presentation. */
export const materialCostSeries: (SeriesPoint & { sharePct: number })[] = [
  { label: "FY24", asOf: "2024-03-31", value: 113, unit: CR, sharePct: 52, sources: ["R-scl-33"], confidence: "reported", note: "52% of sales." },
  { label: "FY25", asOf: "2025-03-31", value: 140, unit: CR, sharePct: 54, sources: ["R-scl-33"], confidence: "reported", note: "54% of sales. Standalone cost of materials consumed ₹149.56 Cr before an inventory change of −₹9.67 Cr (R-scl-13)." },
  { label: "FY26", asOf: "2026-03-31", value: 303, unit: CR, sharePct: 62, sources: ["R-scl-33"], confidence: "reported", note: "62% of sales. Standalone cost of materials consumed ₹311.0 Cr (R-scl-1, R-scl-13)." },
  { label: "H1 FY27", asOf: "2026-09-30", value: 213.4, unit: CR, sharePct: 63, sources: ["R-scl-1", "S41"], confidence: "reported", note: "Standalone. Q1 ₹95.44 Cr + Q2 ₹117.96 Cr. ~63% of revenue." },
];

/** Inventory on the balance sheet (consolidated). */
export const inventorySeries: SeriesPoint[] = [
  { label: "Mar-24", asOf: "2024-03-31", value: 175, unit: CR, sources: ["R-scl-33"], confidence: "reported" },
  { label: "Mar-25", asOf: "2025-03-31", value: 218, unit: CR, sources: ["R-scl-33"], confidence: "reported", note: "Standalone ₹216.9 Cr (R-scl-13)." },
  { label: "Mar-26", asOf: "2026-03-31", value: 315, unit: CR, sources: ["R-scl-2", "R-scl-33"], confidence: "reported", note: "Standalone ₹313.76 Cr. Grew ~45% while revenue grew ~87%." },
  { label: "Sep-26", asOf: "2026-09-30", value: 386.44, unit: CR, sources: ["R-scl-2", "R-scl-33"], confidence: "reported" },
];

/** Borrowings (consolidated). */
export const borrowingsSeries: SeriesPoint[] = [
  { label: "Mar-25", asOf: "2025-03-31", value: 240, unit: CR, sources: ["S59"], confidence: "reported" },
  { label: "Mar-26", asOf: "2026-03-31", value: 409.41, unit: CR, sources: ["S59", "R-scl-2"], confidence: "reported", note: "Reported as +67%." },
  { label: "Sep-26", asOf: "2026-09-30", value: 450.23, unit: CR, sources: ["R-scl-2", "S40"], confidence: "reported", note: "Before the ₹300 Cr raise (allotted 3–4 Nov 2026). Screener's ₹495 Cr includes other liabilities." },
];

export const operatingCashFlowFY26 = fact(-82.8, ["S85"], "reported", { unit: CR, label: "Operating cash flow, FY26", note: "Negative: growth absorbed cash into inventory and receivables." });

/** H1 FY27 revenue rupee, split. "Other costs" is the residual (calc). Standalone. */
export const revenueRupeeH1FY27 = {
  revenue: 340.2,
  parts: [
    { id: "materials", label: "Materials", value: 213.4, sources: ["S41", "R-scl-1"], confidence: "reported" as const, plain: "Wire, connectors, contacts and every other bought-in part." },
    { id: "employee", label: "Employee cost", value: 48.6, sources: ["S41"], confidence: "reported" as const, plain: "Salaries across ~1.5 shifts." },
    { id: "finance", label: "Finance cost", value: 21.2, sources: ["S41"], confidence: "reported" as const, plain: "Interest on the debt that funds inventory; more than doubled from ₹9.8 Cr." },
    { id: "other", label: "Other costs and depreciation", value: 34.7, sources: ["S41"], confidence: "calc" as const, plain: "340.2 − 213.4 − 48.6 − 21.2 − 22.3 = 34.7. A residual, not a reported line." },
    { id: "pbt", label: "Profit before tax", value: 22.3, sources: ["S41"], confidence: "reported" as const, plain: "What is left before tax." },
  ],
};

/** Order book history, Dec 2024 → Sep 2026 (confirmed POs). */
export const orderBookHistory: (SeriesPoint & { approx?: boolean; display: string })[] = [
  { label: "Dec-24", asOf: "2024-12-12", value: 900, unit: CR, display: "900", sources: ["R-scl-35"], confidence: "reported", note: "At relisting (PTI). Plus >₹2,800 Cr long-term strategic agreements." },
  { label: "Aug-25", asOf: "2025-08-14", value: 700, unit: CR, display: "700+", approx: true, sources: ["R-scl-19"], confidence: "reported", note: "'Over ₹700 Cr'; strategic agreements ~₹2,500 Cr." },
  { label: "Sep-25", asOf: "2025-09-30", value: 700, unit: CR, display: "700+", approx: true, sources: ["R-scl-17", "R-scl-36"], confidence: "reported", note: "'Over INR 7,000 Mn'; the MD said 'over ₹720 Cr' on the 14 Nov 2025 call." },
  { label: "Dec-25", asOf: "2025-12-31", value: 700, unit: CR, display: "~700", approx: true, sources: ["R-scl-16"], confidence: "reported", note: "'~INR 7,000 Mn' per the Q3 deck; the MD said 'over ₹750 Cr' on the 4 Feb 2026 call." },
  { label: "Mar-26", asOf: "2026-03-31", value: 715, unit: CR, display: "715", sources: ["R-scl-13", "R-scl-14", "S28"], confidence: "reported", note: "~50/50 A&D vs non-A&D." },
  { label: "Jun-26", asOf: "2026-06-30", value: 800, unit: CR, display: "800", sources: ["R-scl-11", "S73"], confidence: "reported" },
  { label: "Sep-26", asOf: "2026-09-30", value: 900, unit: CR, display: "900", sources: ["R-scl-1", "S41", "S42"], confidence: "reported", note: "Bids submitted ~₹1,350 Cr." },
];

/** Quarterly order inflow (firm POs). null = not disclosed as a pure order figure. */
export const orderInflow: { label: string; value: number | null; display?: string; note: string; sources: string[]; confidence: "reported" | "calc" }[] = [
  { label: "Q2 FY26", value: null, note: "₹932.2 Cr reported as POs + bids combined; not a pure order-intake figure.", sources: ["R-scl-18", "R-scl-36"], confidence: "reported" },
  { label: "Q3 FY26", value: 200, display: "200+", note: "'>₹200 Cr' firm orders in the quarter.", sources: ["R-scl-15", "R-scl-16"], confidence: "reported" },
  { label: "Q4 FY26", value: null, note: "Quarter figure not disclosed. FY26 total ~₹570 Cr.", sources: ["R-scl-14"], confidence: "reported" },
  { label: "Q1 FY27", value: 240, note: "New POs; bids submitted ₹350 Cr.", sources: ["R-scl-11", "R-scl-12"], confidence: "reported" },
  { label: "Q2 FY27", value: 190, display: "~190", note: "~₹430 Cr across H1 FY27.", sources: ["R-scl-1", "R-scl-44", "S39"], confidence: "reported" },
];

/** Long-term strategic agreements (framework value; orders placed against them yearly). */
export const strategicAgreements: SeriesPoint[] = [
  { label: "Dec-24", asOf: "2024-12-12", value: 2800, unit: CR, sources: ["R-scl-35"], confidence: "reported", note: "'More than ₹2,800 Cr'." },
  { label: "Aug–Dec 25", asOf: "2025-12-31", value: 2500, unit: CR, sources: ["R-scl-19", "R-scl-17", "R-scl-16"], confidence: "reported", note: "~₹2,500 Cr over 3–5 years." },
  { label: "Mar–Jun 26", asOf: "2026-06-30", value: 3000, unit: CR, sources: ["R-scl-13", "R-scl-11", "S28"], confidence: "reported", note: "~₹3,000 Cr, mostly A&D; 3–5 year horizon." },
];

/** Semiconductor + space share of revenue. */
export const semiSpaceShare: (SeriesPoint & { revenueCr: string })[] = [
  { label: "FY26", asOf: "2026-03-31", value: 20, unit: PCT, revenueCr: "≈ ₹100 Cr", sources: ["R-scl-14", "R-scl-38"], confidence: "reported" },
  { label: "H1 FY27", asOf: "2026-09-30", value: 41, unit: PCT, revenueCr: ">₹140 Cr", sources: ["R-scl-38", "R-scl-1"], confidence: "calc", note: "140 ÷ 340.2 ≈ 41%. From a secondary summary of the Q2 FY27 call; the transcript was not yet filed." },
];

/** Workforce (all people incl. contract and trainees) with company targets. */
export const workforceSeries: (SeriesPoint & { target?: boolean })[] = [
  { label: "2011", asOf: "2011", value: 25, unit: "people", sources: ["R-scl-17"], confidence: "reported" },
  { label: "Aug-25", asOf: "2025-08-14", value: 960, unit: "people", sources: ["R-scl-19"], confidence: "reported", note: "Up from 680." },
  { label: "Dec-25", asOf: "2025-12-31", value: 1177, unit: "people", sources: ["R-scl-15"], confidence: "reported", note: "904 employees, contract staff and consultants + 273 trainees." },
  { label: "Jun-26", asOf: "2026-06-30", value: 1281, unit: "people", sources: ["R-scl-11"], confidence: "reported" },
  { label: "2027", asOf: "2027", value: 2000, unit: "people", target: true, sources: ["R-scl-1"], confidence: "reported", note: "Company estimate in the Q2 FY27 deck." },
  { label: "2029", asOf: "2029", value: 2500, unit: "people", target: true, sources: ["R-scl-1"], confidence: "reported", note: "Company estimate in the Q2 FY27 deck." },
];

export interface Ambition {
  id: string;
  label: string;
  from?: string;
  to: string;
  by: string;
  plain: string;
  sources: string[];
  confidence: "reported" | "estimate" | "calc";
  note?: string;
}

export const ambitions: Ambition[] = [
  { id: "semi-200m", label: "Semiconductor revenue", to: "US$200M", by: "3–5 years (from May 2026)", plain: "Roughly 3.5× all of FY26 revenue, from one vertical.", sources: ["R-scl-14", "S28"], confidence: "reported" },
  { id: "semi-space-growth", label: "Semiconductor + space growth", to: "+300–400%", by: "FY27", plain: "The newer verticals are meant to multiply within one year.", sources: ["R-scl-14", "S28"], confidence: "reported" },
  { id: "platform-share", label: "Share of defence platform value", from: "~7%", to: "~15%", by: "3–5 years", plain: "Moving from harnesses alone to panels, electro-mechanical and test content on the same aircraft.", sources: ["S79"], confidence: "reported" },
  { id: "ems-margins", label: "Electro-mechanical systems margin", to: "21–30%", by: "FY28–29", plain: "Higher-value assemblies are expected to carry richer margins than harnesses.", sources: ["S28", "DECK-SC"], confidence: "reported" },
  { id: "content-per-aircraft", label: "Content per aircraft", from: "2%", to: "15% → 25%", by: "Value-chain target", plain: "EWIS is ~2–3% of aircraft cost; current capability 5–7%, aiming at 12–15% and later 25%.", sources: ["R-scl-1", "R-scl-11", "R-scl-19"], confidence: "reported" },
  { id: "margin-guidance", label: "EBITDA margin guidance", from: "13.7% (FY26)", to: "17–22%", by: "FY27", plain: "Guided range; H1 FY27 came in at 15.3%.", sources: ["R-comp-1", "R-comp-2", "S41"], confidence: "reported" },
  { id: "workforce", label: "Workforce", from: "1,281 (Jun 2026)", to: "2,000 → 2,500", by: "2027 → 2029", plain: "Company estimates charted in the Q2 FY27 deck.", sources: ["R-scl-1", "R-scl-11"], confidence: "reported" },
  { id: "mix", label: "Revenue mix A&D : non-A&D", from: "70 : 30", to: "50 : 50", by: "FY27", plain: "Semiconductor and space grow faster than aerospace and defence.", sources: ["S88", "R-scl-15", "R-scl-14"], confidence: "reported" },
];
