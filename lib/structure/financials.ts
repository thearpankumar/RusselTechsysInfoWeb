import type { SectionDef } from "./types";

export const financialsSections: SectionDef[] = [
  {
    id: "overview",
    label: "Overview",
    statement: "Revenue nearly doubled in a year, and margins widened while it did.",
    purpose: "FY26 and first-half FY27 in three figures, and the four numbers that explain them.",
    subsections: [
      { id: "fin-headline", label: "Headline figures" },
      { id: "fin-glance", label: "At a glance" },
    ],
  },
  {
    id: "revenue",
    label: "Revenue",
    statement: "₹185.5 Cr in Q2 FY27, the best quarter in the company's history.",
    purpose: "Revenue by year and by quarter, margins by quarter, and the latest quarter line by line.",
    subsections: [
      { id: "fin-revenue-chart", label: "Annual and quarterly" },
      { id: "fin-latest-quarter", label: "Latest quarter" },
    ],
  },
  {
    id: "cost",
    label: "Cost",
    statement: "Sixty-three paise of every rupee buys material.",
    purpose: "Where each rupee of first-half FY27 revenue went, and how material spend grew with the mix.",
    subsections: [
      { id: "fin-rupee", label: "Where each rupee goes" },
      { id: "fin-materials", label: "Material spend" },
    ],
    anchors: ["fin-cost"],
  },
  {
    id: "balance",
    label: "Balance sheet",
    statement: "Growth was paid for with stock, debt and cash.",
    purpose: "Borrowings, inventory and operating cash flow: the three numbers that move with every new program.",
    subsections: [
      { id: "fin-balance", label: "Borrowings, inventory, cash" },
      { id: "fin-balance-trend", label: "Over time" },
    ],
  },
  {
    id: "raise",
    label: "₹300 Cr raise",
    statement: "A ₹300 Cr preferential issue, mostly to SBI Mutual Fund, resets the balance sheet.",
    purpose: "Who bought, at what price, what the money repays, and how the promoter holding changed.",
    subsections: [{ id: "fin-raise", label: "Capital raise" }],
  },
];
