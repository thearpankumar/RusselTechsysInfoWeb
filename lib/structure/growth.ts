import type { SectionDef } from "./types";

export const growthSections: SectionDef[] = [
  {
    id: "overview",
    label: "Order book",
    statement: "The order book is back at ₹900 Cr, and half of it is no longer aerospace.",
    purpose: "Confirmed orders at each disclosure since the relisting, and what ₹900 Cr covers.",
    subsections: [{ id: "growth-order-book", label: "Order book" }],
  },
  {
    id: "orders",
    label: "Orders and bids",
    statement: "About ₹430 Cr of new orders in six months, with ₹1,350 Cr of bids behind them.",
    purpose: "Firm orders won each quarter, the ~₹3,000 Cr of long-term agreements, and the bid pipeline.",
    subsections: [
      { id: "growth-orders", label: "New orders" },
      { id: "growth-pipeline", label: "Agreements and bids" },
    ],
  },
  {
    id: "mix",
    label: "Revenue mix",
    statement: "Aerospace and defence is heading from 70% of revenue to half.",
    purpose: "The FY26 split against the FY27 target, and how fast semiconductor and space are growing.",
    subsections: [
      { id: "growth-mix", label: "Mix shift" },
      { id: "growth-new-verticals", label: "Semiconductor and space" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory months",
    statement: "Stock on hand is falling from eight months of cover towards four.",
    purpose: "Months of consumption covered by inventory, the working-capital lever behind the growth.",
    subsections: [{ id: "growth-inventory", label: "Inventory months" }],
  },
  {
    id: "ambitions",
    label: "Ambitions",
    statement: "What management says it is aiming for, and by when.",
    purpose: "Targets and guidance as stated on calls and in decks; none of these is a result yet.",
    subsections: [
      { id: "growth-ambitions", label: "Headline targets" },
      { id: "growth-ambitions-more", label: "More targets" },
    ],
  },
];
