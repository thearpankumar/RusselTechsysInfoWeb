// Glossary: the deck's twelve everyday terms (p.4) + research Appendix A + A4 vocabulary.
import type { GlossaryTerm } from "./types-extra";

const DECK = ["DECK-SC", "WS"];
const APPX = ["RESEARCH"]; // research markdown Appendix A / A4 (standard usage)

/** The twelve terms used every day in the flow (deck p.4). */
export const dailyTerms: GlossaryTerm[] = [
  { term: "RFP", definition: "Customer's request for a proposal.", category: "commercial", sources: DECK, confidence: "session" },
  { term: "Quotation", definition: "Rossell's priced offer: item, schedule, price.", category: "commercial", sources: DECK, confidence: "session" },
  { term: "Customer PO", definition: "Confirmed order; can carry many delivery schedules.", category: "commercial", sources: DECK, confidence: "session" },
  { term: "Schedule", definition: "Dated quantity under a PO, e.g. 200 in Jan, 500 in Mar.", category: "commercial", sources: DECK, confidence: "session" },
  { term: "Supplier PO", definition: "Rossell's order to a supplier for raw material.", category: "commercial", sources: DECK, confidence: "session" },
  { term: "Invoice", definition: "Raised against a PO; one PO can have many invoices.", category: "commercial", sources: DECK, confidence: "session" },
  { term: "BOM", definition: "Bill of materials: every part and quantity for one FG.", category: "material-engineering", sources: DECK, confidence: "session" },
  { term: "FG", definition: "Finished good, e.g. a wire bundle delivered to the customer.", category: "material-engineering", sources: DECK, confidence: "session" },
  { term: "RM", definition: "Raw material: Rossell's internal part number.", category: "material-engineering", sources: DECK, confidence: "session" },
  { term: "OEM part no.", definition: "Manufacturer's global part number behind an RM.", category: "material-engineering", sources: DECK, confidence: "session" },
  { term: "UOM", definition: "Unit of measure: EA (each), FT, M.", category: "material-engineering", sources: DECK, confidence: "session" },
  { term: "Revision", definition: "BOM version; the latest accepted, effective one is used.", category: "material-engineering", sources: ["DECK-SC", "RULES"], confidence: "rules" },
];

export const glossary: GlossaryTerm[] = [
  ...dailyTerms,
  // A4 key vocabulary
  { term: "MPN", definition: "Manufacturer part number: the identity used to buy a component.", category: "material-engineering", sources: APPX, confidence: "industry-example" },
  { term: "EBOM / MBOM", definition: "Engineering BOM (what the design says) vs manufacturing BOM (how the plant builds it).", category: "material-engineering", sources: APPX, confidence: "industry-example" },
  { term: "AML / AVL", definition: "Approved manufacturer list / approved vendor list per part.", category: "material-engineering", sources: APPX, confidence: "industry-example" },
  { term: "Lifecycle status", definition: "Active → NRND (not recommended for new designs) → EOL → Obsolete.", category: "material-engineering", sources: [...APPX, "S6", "S7"], confidence: "industry-example" },
  { term: "PCN / PDN", definition: "Product change notice / product discontinuance notice from a manufacturer.", category: "material-engineering", sources: APPX, confidence: "industry-example" },
  { term: "LTB", definition: "Last-time buy before a part is discontinued.", category: "planning", sources: APPX, confidence: "industry-example" },
  { term: "Authorised vs independent distributor", definition: "Franchised channel vs open-market brokers (higher counterfeit risk).", category: "trade", sources: [...APPX, "S17"], confidence: "industry-example" },
  { term: "Compliance", definition: "RoHS, REACH, conflict minerals, country of origin (drives tariffs).", category: "quality-compliance", sources: APPX, confidence: "industry-example" },
  { term: "OEM / EMS", definition: "Brand owner vs contract manufacturer that often does the sourcing.", category: "general", sources: APPX, confidence: "industry-example" },
  { term: "CFM", definition: "Customer-furnished material: parts the customer supplies for Rossell to build with.", category: "material-engineering", sources: APPX, confidence: "industry-example" },
  { term: "FAI", definition: "First article inspection (AS9102): full check of the first unit built, repeated after design, supplier, location or material changes.", category: "quality-compliance", sources: [...APPX, "S46"], confidence: "industry-example" },
  // Appendix A
  { term: "AS9100 / AS9102 / AS9110", definition: "Aerospace quality management standard / first article inspection standard / MRO variant.", category: "quality-compliance", sources: APPX, confidence: "industry-example" },
  { term: "AS5553 / AS6081", definition: "Counterfeit electronic parts avoidance standards (manufacturers / distributors).", category: "quality-compliance", sources: APPX, confidence: "industry-example" },
  { term: "ASL", definition: "Approved supplier list.", category: "material-engineering", sources: APPX, confidence: "industry-example" },
  { term: "CTB", definition: "Clear-to-Build: report or status showing whether all materials for a work order are available or committed. (The session notes write 'Clear to Bill'.)", category: "planning", sources: [...APPX, "S56", "WS"], confidence: "session" },
  { term: "DPL", definition: "Defence production licence.", category: "quality-compliance", sources: APPX, confidence: "industry-example" },
  { term: "DTA", definition: "Domestic Tariff Area (India customs status, vs SEZ / EOU).", category: "trade", sources: APPX, confidence: "industry-example" },
  { term: "ECN / ECO", definition: "Engineering change notice / order.", category: "material-engineering", sources: APPX, confidence: "industry-example" },
  { term: "ECMS", definition: "Electronics Components Manufacturing Scheme (India).", category: "trade", sources: [...APPX, "S32", "S64"], confidence: "reported" },
  { term: "EMS", definition: "Electronics manufacturing services (contract manufacturing).", category: "general", sources: APPX, confidence: "industry-example" },
  { term: "EPA", definition: "Economic price adjustment clause.", category: "commercial", sources: [...APPX, "S28"], confidence: "industry-example" },
  { term: "ETA", definition: "Estimated time of arrival (here = supplier promise date).", category: "planning", sources: [...APPX, "WS"], confidence: "session" },
  { term: "EWIS", definition: "Electrical wiring interconnect system: all the wires, connectors and protection in an aircraft.", category: "material-engineering", sources: APPX, confidence: "industry-example" },
  { term: "GRN", definition: "Goods received note.", category: "planning", sources: APPX, confidence: "industry-example" },
  { term: "IQMS / DELMIAworks", definition: "Rossell's ERP; IQMS is now branded DELMIAworks (Dassault Systèmes).", category: "systems", sources: [...APPX, "WS", "S68"], confidence: "session" },
  { term: "LTA", definition: "Long-term agreement.", category: "commercial", sources: APPX, confidence: "industry-example" },
  { term: "MRB / NCR", definition: "Material review board / nonconformance report.", category: "quality-compliance", sources: APPX, confidence: "industry-example" },
  { term: "MRP", definition: "Material requirements planning.", category: "planning", sources: [...APPX, "WS"], confidence: "industry-example" },
  { term: "PPC", definition: "Production planning and control.", category: "planning", sources: [...APPX, "WS"], confidence: "session" },
  { term: "QIP", definition: "Qualified institutional placement.", category: "general", sources: APPX, confidence: "industry-example" },
  { term: "RTV", definition: "Return to vendor.", category: "quality-compliance", sources: APPX, confidence: "industry-example" },
  { term: "VMI", definition: "Vendor-managed inventory: stock held or managed by the supplier for the buyer.", category: "planning", sources: [...APPX, "WS"], confidence: "industry-example" },
  { term: "WFE", definition: "Wafer fab equipment.", category: "general", sources: [...APPX, "S49", "S51"], confidence: "industry-example" },
  { term: "WIP", definition: "Work in progress.", category: "planning", sources: APPX, confidence: "industry-example" },
  // Useful extras from the sessions
  { term: "Hard allocation", definition: "Stock firmly reserved for a work order, driven by need date; allocated first.", category: "planning", sources: ["WS"], confidence: "session" },
  { term: "Firmed / unfirmed work order", definition: "A firmed WO is committed and keeps priority; an unfirmed one can have its stock reassigned on realignment.", category: "planning", sources: ["WS"], confidence: "session" },
  { term: "Realignment", definition: "Moving allocated stock from an order that cannot ship to one that can.", category: "planning", sources: ["WS", "DECK-SC"], confidence: "session" },
  { term: "Pull-in / push-out", definition: "Moving a need date or supplier date earlier / later.", category: "planning", sources: ["WS"], confidence: "session" },
  { term: "Must Arrive By", definition: "The date a quantity must be on hand to meet the build; reported by the 'Exception Report with Must Arrive By'.", category: "planning", sources: ["WS"], confidence: "session" },
  { term: "Kit / kitting", definition: "Gathering all the parts for one wire bundle work order into a kit before production; full or partial.", category: "planning", sources: ["WS"], confidence: "session" },
  { term: "Shipset", definition: "One aircraft's worth of a given assembly.", category: "general", sources: ["DECK-SC"], confidence: "industry-example" },
  { term: "IDIQ", definition: "Indefinite-delivery / indefinite-quantity contract: a framework under which the customer places orders over time.", category: "commercial", sources: ["S80", "S89"], confidence: "industry-example" },
];
