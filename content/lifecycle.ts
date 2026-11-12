// How Rossell runs: lifecycle, flows, planning parameters, workflows, rules, systems, actors.
import type {
  ActorGroup,
  BusinessRule,
  FlowStep,
  LifecycleStage,
  PlanningParameter,
  SystemFact,
  Workflow,
  WorkflowPhase,
} from "./types-extra";

/* ---------- 1. Business lifecycle (info.md, 7 stages) ---------- */

export const lifecycleStages: LifecycleStage[] = [
  { id: "customer-order", index: 1, name: "Customer & Order Management", steps: ["Customer requirements", "Quotation", "Customer PO"], plain: "Win the work: understand what the customer needs, price it, receive the order.", workflowIds: ["W1"], sources: ["INFO"], confidence: "rules" },
  { id: "engineering-bom", index: 2, name: "Engineering & BOM Management", steps: ["Finished goods", "BOM", "Material requirements"], plain: "Turn the customer's drawing into a bill of materials per finished good and plant.", workflowIds: ["W2", "W3", "W4", "W5"], sources: ["INFO", "RULES"], confidence: "rules" },
  { id: "forecast-planning", index: 3, name: "Forecast & Material Planning", steps: ["Demand + Forecast", "BOM explosion", "Material shortfall"], plain: "Combine orders and forecasts, multiply through the BOM, and find what is short.", workflowIds: ["W6", "W7", "W8"], sources: ["INFO"], confidence: "rules" },
  { id: "supplier-procurement", index: 4, name: "Supplier & Procurement Management", steps: ["Supplier enquiry", "Supplier PO", "Promise dates"], plain: "Ask suppliers, place POs, and get committed delivery dates.", workflowIds: ["W9", "W10", "W11"], sources: ["INFO"], confidence: "rules" },
  { id: "inventory-logistics", index: 5, name: "Inventory & Logistics Management", steps: ["Shipment", "GRN", "Inspection", "Stock availability"], plain: "Bring goods in, inspect them and make them available as free stock.", workflowIds: ["W12", "W13", "W14"], sources: ["INFO"], confidence: "rules" },
  { id: "production", index: 6, name: "Production Management", steps: ["Work orders", "Kitting", "Production", "Finished goods"], plain: "Release work orders, kit the parts per wire bundle, build and test.", workflowIds: ["W15"], sources: ["INFO"], confidence: "rules" },
  { id: "finance-trade", index: 7, name: "Logistics, Finance & Trade Compliance", steps: ["Dispatch", "Invoice", "Payment", "Reconciliation"], plain: "Ship, bill against the PO, collect payment and reconcile (including import-duty reconciliation).", workflowIds: ["W16", "W17", "W18", "W19", "W20"], sources: ["INFO"], confidence: "rules" },
];

/* ---------- 2. Drawing → kitted wire bundle (8 steps; deck p.21 / research D6) ---------- */

export const bomToKitFlow: FlowStep[] = [
  { index: 1, name: "BOM", what: "Drawings in; engineering BOM per finished good.", supporting: "RT Consolidated BOM", fileIds: ["rt-consolidated-bom"], sources: ["WS", "DECK-SC"], confidence: "session" },
  { index: 2, name: "Demand", what: "Customer POs, schedules and forecasts.", supporting: "Forecast files; Sales Order (not in scope yet)", fileIds: ["forecast", "sales-order"], sources: ["WS", "DECK-SC"], confidence: "session" },
  { index: 3, name: "Requirements", what: "Net need by part, plant and date: what quantity, by when.", supporting: "Exception; Exception + Must Arrive By", fileIds: ["exception", "exception-mab"], sources: ["WS", "DECK-SC"], confidence: "session" },
  { index: 4, name: "Buy", what: "Supplier POs; weekly reorder.", supporting: "Reorder Report (IT-built); RT Open Order (open supplier POs)", fileIds: ["reorder", "rt-open-order"], sources: ["WS", "DECK-SC"], confidence: "session" },
  { index: 5, name: "Promise dates", what: "Suppliers confirm; SCM updates the ERP.", supporting: "Promise Date Upload Utility", fileIds: ["promise-date-upload"], sources: ["WS", "DECK-SC"], confidence: "session" },
  { index: 6, name: "Receive", what: "Goods receipt, inspection, stock.", supporting: "GRN; Active Stock", fileIds: ["grn", "active-stock"], sources: ["WS", "DECK-SC"], confidence: "session" },
  { index: 7, name: "Allocate & kit", what: "Stock to work orders; kits per wire bundle; clear-to-build.", supporting: "Clear-to-Build (CTB) report", fileIds: [], sources: ["WS", "DECK-SC"], confidence: "session" },
  { index: 8, name: "Build & deliver", what: "Assemble, test, ship, invoice.", supporting: "Work orders", fileIds: [], sources: ["WS", "DECK-SC"], confidence: "session" },
];

export const currentWork = {
  text: "Kit start date assignment is what the team is doing now, through project-wise extraction.",
  sources: ["WS"],
  confidence: "session" as const,
};

/* ---------- 3. Request to cash: the document chain (deck p.7) ---------- */

export const requestToCash: FlowStep[] = [
  { index: 1, name: "RFP", what: "Customer asks for a proposal.", supporting: "Customer RFP", fileIds: [], sources: ["DECK-SC", "WS"], confidence: "session" },
  { index: 2, name: "Quotation", what: "Rossell prices item and schedule.", supporting: "Quotation", fileIds: [], sources: ["DECK-SC", "WS"], confidence: "session" },
  { index: 3, name: "Negotiate", what: "Price and dates agreed.", supporting: "LTA / contract terms", fileIds: [], sources: ["DECK-SC", "WS"], confidence: "session" },
  { index: 4, name: "Customer PO", what: "Order confirmed; can carry many delivery schedules.", supporting: "Customer PO", fileIds: ["sales-order"], sources: ["DECK-SC", "WS"], confidence: "session" },
  { index: 5, name: "Supplier POs", what: "Raw materials procured.", supporting: "Supplier PO", fileIds: ["reorder", "exception", "rt-open-order"], sources: ["DECK-SC", "WS"], confidence: "session" },
  { index: 6, name: "GRN & build", what: "Receive, kit, assemble.", supporting: "GRN; work orders", fileIds: ["grn"], sources: ["DECK-SC", "WS"], confidence: "session" },
  { index: 7, name: "Ship & invoice", what: "Invoices raised against the PO; one PO can have many invoices.", supporting: "Invoice", fileIds: [], sources: ["DECK-SC", "WS"], confidence: "session" },
];

export const requestToCashNotes = [
  { text: "Two POs are in play: the customer's PO to Rossell, and Rossell's POs to its suppliers. Planning links one to the other.", sources: ["DECK-SC"], confidence: "session" as const },
  { text: "One PO, many invoices: a ₹10 Cr PO can be billed in parts (₹1 Cr, then ₹2 Cr, then ₹5 Cr) as deliveries go out. Illustrative amounts.", sources: ["DECK-SC"], confidence: "session" as const },
];

/* ---------- 4. Net demand ---------- */

export const netDemand = {
  formula: "Net Demand = Consolidated Demand − In-flight Supply",
  inFlight: "In-flight supply = open purchase orders + in-transit supply",
  finalRequirement:
    "Final procurement requirement may additionally consider available stock, safety stock, existing POs and applicable procurement rules (MOQ, order multiples, lead-time offset).",
  freeStock: "Free stock = on hand, not in WIP and not kitted",
  sources: ["RULES", "INFO", "WS"],
  confidence: "rules" as const,
  workedExample: {
    steps: [
      { label: "Consolidated demand", value: 100 },
      { label: "− In-flight supply (open POs, in transit)", value: -20 },
      { label: "= Net demand", value: 80 },
      { label: "− Free stock (not in WIP, not kitted)", value: -80 },
      { label: "= Net requirement to buy", value: 0 },
    ],
    sources: ["DECK-SC", "DECK-RESEARCH", "WS"],
    confidence: "session" as const,
    note: "Session phrasing was '100 − 20 + whatever I have'. The research deck stops at net demand 80 'then compared with free stock'; the supply-chain deck p.5 completes it as 100 − 20 − 80 = 0. Illustrative numbers.",
  },
};

/* ---------- 5. Eleven planning parameters (deck p.5) ---------- */

export const planningParameters: PlanningParameter[] = [
  { id: "qty-per-fg", name: "Quantity per FG", meaning: "Units of a raw material in one finished good", from: "BOM", example: "200 FT of wire", sources: ["DECK-SC", "WS"], confidence: "session" },
  { id: "uom", name: "Unit of measure", meaning: "How that quantity is counted", from: "BOM, PO", example: "EA, FT, M", sources: ["DECK-SC", "WS"], confidence: "session" },
  { id: "bom-revision", name: "BOM revision", meaning: "Which BOM version is valid, from when", from: "Engineering", example: "Rev C from 1 Oct", sources: ["DECK-SC", "RULES"], confidence: "rules" },
  { id: "demand-need-date", name: "Demand and need date", meaning: "What the customer wants, and by when", from: "Customer PO, forecast", example: "500 by March", sources: ["DECK-SC", "WS"], confidence: "session" },
  { id: "lead-time", name: "Lead time", meaning: "Time from order to receipt, per part", from: "Supplier", example: "12 weeks", sources: ["DECK-SC"], confidence: "session" },
  { id: "open-po", name: "Open PO (in-flight)", meaning: "Ordered from suppliers, not yet received", from: "Supplier POs", example: "20 in transit", sources: ["DECK-SC", "RULES"], confidence: "rules" },
  { id: "promise-date", name: "Promise date", meaning: "Supplier's committed delivery date", from: "Supplier", example: "ETA 15 Nov", sources: ["DECK-SC", "WS"], confidence: "session" },
  { id: "free-stock", name: "Free stock", meaning: "On hand, not in WIP and not kitted", from: "Inventory, GRN", example: "80 free", sources: ["DECK-SC", "WS"], confidence: "session" },
  { id: "safety-stock", name: "Safety stock", meaning: "Buffer held against variability", from: "Planning policy", example: "2 weeks' cover", sources: ["DECK-SC", "WS"], confidence: "session" },
  { id: "net-requirement", name: "Net requirement", meaning: "Demand − in-flight − free stock", from: "Calculated", example: "100 − 20 − 80 = 0", sources: ["DECK-SC", "RULES"], confidence: "rules" },
  { id: "inventory-months", name: "Inventory months", meaning: "Stock held ÷ monthly consumption", from: "Finance", example: "6.67 months", sources: ["DECK-SC", "S42"], confidence: "reported" },
];

/* ---------- 6. Twenty workflows in five phases (research E2) ---------- */

export const workflowPhases: WorkflowPhase[] = [
  { id: "A", name: "Contract & engineering" },
  { id: "B", name: "Demand & planning" },
  { id: "C", name: "Procure" },
  { id: "D", name: "Receive & stock" },
  { id: "E", name: "Control & improve" },
];

const MODEL = ["DECK-RESEARCH", "DECK-SC"]; // Part E is a model to be validated with Rossell

export const workflows: Workflow[] = [
  { id: "W1", phase: "A", name: "Bid & contract", trigger: "Customer RFQ", actors: ["PreSales/Sourcing", "Component engineer", "Buyer", "Finance"], steps: ["Cost the BOM", "Identify long-lead / single-source parts", "Supplier quotes", "Add escalation / EPA / advance-payment terms", "Submit"], output: "Quote / LTA with back-to-back supplier terms", inScope: false, sources: [...MODEL, "S28"], confidence: "estimate" },
  { id: "W2", phase: "A", name: "Data intake & material master", trigger: "New drawing package or part number", actors: ["Engineering", "Master data owner", "Component engineer"], steps: ["Load drawings / BOM", "Map customer PN to canonical material", "Map MPNs and approved sources", "Flag CFM"], output: "Clean material master", inScope: false, sources: [...MODEL, "RULES"], confidence: "estimate" },
  { id: "W3", phase: "A", name: "EBOM creation & validation", trigger: "New finished good, or new plant", actors: ["Engineering", "BOM manager", "Component engineer"], steps: ["Build BOM per FG and plant", "Validate (components in master, UoM, quantities, sources)", "Accept", "Set effective date"], output: "Accepted EBOM [Rules 2.1]", inScope: false, sources: [...MODEL, "RULES"], confidence: "rules" },
  { id: "W4", phase: "A", name: "Engineering change & revisions", trigger: "Customer ECN or deviation", actors: ["Customer engineering", "BOM manager", "Planner", "Buyer", "QA"], steps: ["New revision", "Validate", "Accept", "Effective date", "Archive previous as full snapshot", "Impact on open POs, stock, WIP", "FAI if needed"], output: "New accepted revision [Rules 2.2]", inScope: false, sources: [...MODEL, "RULES", "S46"], confidence: "rules" },
  { id: "W5", phase: "A", name: "Approved sources & alternates", trigger: "Shortage, EOL notice, new supplier", actors: ["Component engineer", "Customer engineering", "Supplier quality"], steps: ["Propose alternate", "Customer approval", "Update AML", "Record deviation / waiver"], output: "Updated AML", inScope: false, sources: MODEL, confidence: "estimate" },
  { id: "W6", phase: "B", name: "Demand capture & consolidation", trigger: "Forecast, firm PO, schedule change, spares, FAI builds", actors: ["Program manager", "Buyer / planner"], steps: ["Load IQMS orders and customer forecast files", "Apply buffer and exclusion windows", "Normalise domain patterns"], output: "Consolidated demand by part, plant, date; forecast vs firm kept apart", inScope: true, sources: [...MODEL, "WS"], confidence: "session" },
  { id: "W7", phase: "B", name: "Planning run (net demand)", trigger: "Scheduled run or demand change", actors: ["Buyer / PPC", "Planning engine"], steps: ["Resolve effective BOM revision", "Explode", "Net = Demand − In-flight", "Net against stock and safety stock", "Apply MOQ, multiples, lead time"], output: "Planned requirements; BOM revision used is stored", inScope: true, sources: [...MODEL, "RULES"], confidence: "rules" },
  { id: "W8", phase: "B", name: "Long-lead, single-source & LTB", trigger: "Lead time beyond horizon, single source, EOL", actors: ["Planner", "Buyer", "Program manager", "Finance", "Customer buyer"], steps: ["Early buy", "Advance-payment request", "LTB approval"], output: "Early buys, advance payments", inScope: false, sources: [...MODEL, "S28"], confidence: "estimate" },
  { id: "W9", phase: "C", name: "Sourcing & supplier selection", trigger: "Requirement with no supplier agreement", actors: ["Buyer", "Sourcing", "Supplier quality"], steps: ["RFQ to approved sources", "Landed cost and lead-time comparison", "Select"], output: "Approved source", inScope: false, sources: MODEL, confidence: "estimate" },
  { id: "W10", phase: "C", name: "PO create, approve, release", trigger: "Planned requirement (Reorder report)", actors: ["Buyer", "Approver"], steps: ["Create", "Approve", "Release"], output: "Open PO (in-flight supply)", inScope: false, sources: [...MODEL, "WS"], confidence: "session" },
  { id: "W11", phase: "C", name: "Supplier follow-up & promise dates", trigger: "Open PO", actors: ["Buyer", "SCM", "Supplier"], steps: ["Acknowledge", "Promise date (portal / email)", "Upload to IQMS", "Track ETA", "Escalate slips"], output: "Promise dates / ETA in IQMS", inScope: true, sources: [...MODEL, "WS"], confidence: "session" },
  { id: "W12", phase: "C", name: "Import, customs & logistics", trigger: "Shipment dispatched", actors: ["Logistics / EXIM", "Freight forwarder", "Customs broker"], steps: ["Clear customs", "Bonded / DTA treatment per plant", "Move to plant"], output: "Goods at the right plant", inScope: false, sources: [...MODEL, "S45"], confidence: "estimate" },
  { id: "W13", phase: "D", name: "Goods receipt & incoming inspection", trigger: "Goods arrive", actors: ["Stores", "Incoming QA", "SCM"], steps: ["GRN", "CoC, lot / date code, traceability", "Counterfeit checks", "Accept / hold / reject"], output: "Accepted qty → inventory, removed from in-flight", inScope: true, sources: [...MODEL, "RULES", "WS"], confidence: "rules", note: "The GRN report itself is not in scope now; accepted receipts reach planning through the Active Stock report." },
  { id: "W14", phase: "D", name: "Inventory control", trigger: "Ongoing", actors: ["Stores", "PPC", "Finance"], steps: ["Stock by plant, lot, date code, shelf life", "Quarantine", "CFM kept separate", "Reservations", "VMI visibility"], output: "Accurate free stock (not in WIP, not kitted)", inScope: true, sources: [...MODEL, "WS"], confidence: "session" },
  { id: "W15", phase: "D", name: "Allocation, CTB & kitting", trigger: "Work orders planned / released", actors: ["PPC", "Stores", "Production", "SCM"], steps: ["Freeze BOM rev & WO", "Hard-allocated first", "Firmed WOs by date", "Realign unfirmed", "Kit status per wire bundle", "Shortages with ETAs"], output: "Kit start dates; CTB list; shortage list → W7 / W11", inScope: true, sources: [...MODEL, "WS"], confidence: "session" },
  { id: "W16", phase: "E", name: "Nonconformance & return to vendor", trigger: "Rejected or defective material", actors: ["QA", "MRB", "Buyer"], steps: ["NCR", "Disposition (use as is, rework, scrap, RTV)", "Replacement order"], output: "New in-flight supply", inScope: false, sources: MODEL, confidence: "estimate" },
  { id: "W17", phase: "E", name: "Excess & obsolete stock", trigger: "Revision change, program end, over-coverage", actors: ["Planner", "Finance", "Program manager"], steps: ["Reuse", "Sell", "Claim from customer", "Write off"], output: "Lower inventory coverage (target ~4 months)", inScope: false, sources: [...MODEL, "S28"], confidence: "estimate" },
  { id: "W18", phase: "E", name: "Price adjustment & cost recovery", trigger: "Supplier price increase", actors: ["Contracts", "Finance", "Customer buyer"], steps: ["Track increases against contract clauses", "EPA claim"], output: "Cost recovered", inScope: false, sources: [...MODEL, "S28"], confidence: "estimate" },
  { id: "W19", phase: "E", name: "Supplier performance", trigger: "Periodic", actors: ["Supplier quality", "Buyer"], steps: ["OTD", "Reject rate", "Lead-time and promise-date accuracy"], output: "Feeds W9", inScope: false, sources: MODEL, confidence: "estimate" },
  { id: "W20", phase: "E", name: "Exceptions & web reporting", trigger: "Continuous", actors: ["Planners", "Managers"], steps: ["Shortages vs need date", "Coverage months", "Late POs", "At-risk parts", "Web reports replacing Crystal"], output: "Management visibility", inScope: true, sources: [...MODEL, "WS"], confidence: "session" },
];

/* ---------- 7. Business rules ---------- */

export const businessRules: BusinessRule[] = [
  // 2.1
  { id: "R2.1.1", group: "2.1 BOM identity", text: "There will be one engineering BOM per finished good and plant.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.1.2", group: "2.1 BOM identity", text: "The finished good must reference the canonical material master.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.1.3", group: "2.1 BOM identity", text: "The BOM must reference a Rossell manufacturing plant.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.1.4", group: "2.1 BOM identity", text: "Customer identity does not form part of the engineering BOM identity.", plain: "The same harness built for two customers is still one BOM.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.1.5", group: "2.1 BOM identity", text: "The same finished good may have separate BOM definitions for different plants.", sources: ["RULES", "INFO"], confidence: "rules" },
  // 2.2
  { id: "R2.2.1", group: "2.2 BOM revision", text: "Each BOM can have multiple engineering revisions over time.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.2.2", group: "2.2 BOM revision", text: "The latest successfully validated and accepted revision is considered the current accepted revision.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.2.3", group: "2.2 BOM revision", text: "The current accepted revision must remain in the main/current BOM tables.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.2.4", group: "2.2 BOM revision", text: "Effective dates must be retained for every accepted revision.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.2.5", group: "2.2 BOM revision", text: "The revision applicable to a planning date must be resolved using its effective dates.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.2.6", group: "2.2 BOM revision", text: "The latest accepted revision and the currently effective revision are not necessarily the same.", plain: "Rev D can be approved today but only take effect from next month; until then Rev C is what you build.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.2.7", group: "2.2 BOM revision", text: "Previous accepted revisions must be archived as complete snapshots.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.2.8", group: "2.2 BOM revision", text: "Historical component records must remain associated with their original revision.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "R2.2.9", group: "2.2 BOM revision", text: "A planning run must retain the exact BOM revision used for its calculations.", sources: ["RULES", "INFO"], confidence: "rules" },
  // Net demand
  { id: "RND.1", group: "Net demand & supply", text: "Net Demand = Consolidated Demand − In-flight Supply", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "RND.2", group: "Net demand & supply", text: "In-flight supply includes open purchase orders and in-transit supply.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "RND.3", group: "Net demand & supply", text: "Material already received must be reflected in inventory.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "RND.4", group: "Net demand & supply", text: "Received material must not be counted again as in-flight supply.", plain: "At GRN acceptance a quantity leaves 'in-flight' and enters 'inventory' at the same moment.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "RND.5", group: "Net demand & supply", text: "Inventory and supply calculations must remain separate from the source-demand calculation.", sources: ["RULES", "INFO"], confidence: "rules" },
  { id: "RND.6", group: "Net demand & supply", text: "The final procurement requirement may additionally consider available stock, safety stock, existing purchase orders and applicable procurement rules.", sources: ["RULES", "INFO"], confidence: "rules" },
  // Session rules
  { id: "WS.F1", group: "Session rules", text: "Forecast is considered only beyond the IQMS horizon + a buffer duration.", sources: ["WS"], confidence: "session" },
  { id: "WS.F2", group: "Session rules", text: "The first 2 months of a forecast file are excluded from consolidation (default).", sources: ["WS"], confidence: "session" },
  { id: "WS.F3", group: "Session rules", text: "For LAM, the first 6 months of forecast are excluded.", sources: ["WS"], confidence: "session" },
  { id: "WS.F4", group: "Session rules", text: "Forecast file nomenclature (labels) is ignored; the entire file quantity is used.", sources: ["WS"], confidence: "session" },
  { id: "WS.D1", group: "Session rules", text: "ETA = promise date.", sources: ["WS"], confidence: "session" },
  { id: "WS.D2", group: "Session rules", text: "For part numbers with insufficient stock, SCM provides promise dates, updates them in IQMS, and they flow into the CTB report.", sources: ["WS"], confidence: "session" },
  { id: "WS.B1", group: "Buyer controls", text: "Buyers may override the need date; the change is logged.", sources: ["WS"], confidence: "session" },
  { id: "WS.B2", group: "Buyer controls", text: "Pull-ins and push-outs are recorded and updated.", sources: ["WS"], confidence: "session" },
  { id: "WS.B3", group: "Buyer controls", text: "An order can carry safety stock; safety-stock lines carry their own need date and promise date.", sources: ["WS"], confidence: "session" },
  { id: "WS.B4", group: "Buyer controls", text: "Suppliers upload VMI on-hand stock in their portal, and can also update by email.", sources: ["WS"], confidence: "session" },
  { id: "WS.A1", group: "Allocation", text: "The BOM revision and the work order are frozen during allocation.", sources: ["WS"], confidence: "session" },
  { id: "WS.A2", group: "Allocation", text: "Allocation is hard allocation, driven by need dates. Hard-allocated lines get their required quantity first.", sources: ["WS"], confidence: "session" },
  { id: "WS.A3", group: "Allocation", text: "Work orders are processed in ascending order; firmed work orders keep priority.", sources: ["WS"], confidence: "session" },
  { id: "WS.A4", group: "Allocation", text: "Unfirmed work orders and allocations that were not hard-allocated are reassigned on realignment.", sources: ["WS"], confidence: "session" },
  { id: "WS.A5", group: "Allocation", text: "Only stock that is not in WIP and not already kitted counts as available.", sources: ["WS"], confidence: "session" },
  { id: "WS.A6", group: "Allocation", text: "Kit status is per wire bundle: full only if all materials are available, otherwise partial.", sources: ["WS"], confidence: "session" },
  { id: "WS.A7", group: "Allocation", text: "Priority criteria are configurable: need date, order value, project, customer.", sources: ["WS"], confidence: "session" },
  { id: "WS.A8", group: "Allocation", text: "The system gives suggestions to users ('intelligence'); people approve. Enhancement: raw-material suggestions.", sources: ["WS"], confidence: "session" },
];

export const allocationSteps = [
  "Freeze the BOM revision and work order being allocated",
  "Hard-allocated first: give these work orders their required quantity",
  "Firmed work orders next, in ascending order by need date / work order",
  "Realign: stock on unfirmed or non-hard-allocated orders is reassigned",
  "Count only free stock: not in WIP, not already kitted",
  "Kit status per wire bundle: full only if every material is available, otherwise partial",
  "Shortages: SCM enters promise dates (ETA) in IQMS; CTB shows them",
];

export const realignmentExample = {
  orderA: "Needs 1,000 of part X. 500 received; 500 pushed out to January. Cannot ship; 500 sit idle.",
  move: "Realign 500",
  orderB: "Needs 500 of part X; every other part already in stock. Ships now with the realigned 500.",
  rule: "Hard-allocated orders first, then firmed orders by need date; weigh order value, customer and project. The system suggests, buyers and PPC approve.",
  sources: ["DECK-SC", "WS"],
  confidence: "session" as const,
  note: "Simplified example from working sessions; priority rules to be confirmed.",
};

/* ---------- 8. Systems ---------- */

export const systems: SystemFact[] = [
  { id: "sys-iqms", system: "IQMS ERP", fact: "System of record for production / manufacturing: BOMs, orders, stock, POs, GRNs and MRP.", sources: ["WS"], confidence: "session" },
  { id: "sys-xworks", system: "IQMS ERP", fact: "The 'Xworks?' entry in the session notes is most likely DELMIAworks, IQMS's current name.", sources: ["WS", "S68"], confidence: "estimate" },
  { id: "sys-dassault", system: "DELMIAworks", fact: "Formerly IQMS; acquired by Dassault Systèmes in early 2019 (~US$425M).", sources: ["S68"], confidence: "reported" },
  { id: "sys-scope", system: "DELMIAworks", fact: "Covers ERP, MRP, scheduling, shop-floor monitoring, quality, warehouse and EDI, with Crystal Reports-based reporting.", sources: ["S52"], confidence: "reported" },
  { id: "sys-2026", system: "DELMIAworks", fact: "2026 release GA 16 Jan 2026: MES and quality upgrades, Material Exception alerts for purchasing, BOM mapping to 3DEXPERIENCE. No AI or API features announced.", sources: ["S69"], confidence: "reported" },
  { id: "sys-api", system: "DELMIAworks", fact: "Many integrators bypass the API and query the Oracle / SQL Server database directly (ODBC/JDBC). The REST/GraphQL WebAPI is a separately licensed add-on with no public developer portal.", sources: ["S54"], confidence: "reported" },
  { id: "sys-reviews", system: "DELMIAworks", fact: "Users commonly customise reports with Crystal; some find report building tedious without Crystal skills. Some supply-chain users say the planning module does not follow APICS fundamentals (anecdotal).", sources: ["S52", "S53", "S55"], confidence: "reported" },
  { id: "sys-crystal", system: "Crystal Reports", fact: "Crystal Reports over SQL, run via the ERP, refreshed every morning.", sources: ["WS"], confidence: "session" },
  { id: "sys-excel", system: "Excel & email", fact: "Promise dates arrive by email and are uploaded from Excel; customer forecasts are downloaded as files.", sources: ["WS", "DECK-SC"], confidence: "session" },
  { id: "sys-direction", system: "Direction", fact: "Move to web-based reports; keep IQMS as the system of record.", sources: ["WS"], confidence: "session" },
  { id: "sys-website", system: "Rossell website", fact: "The website does not name the ERP; it mentions IT-enabled services, automation (bots), video traceability and full auditability in manufacturing.", sources: ["S71"], confidence: "reported" },
];

/* ---------- 9. Actors (deck p.19 four groups; research E1) ---------- */

export const actorGroups: ActorGroup[] = [
  {
    id: "customers",
    name: "Customers (OEMs)",
    side: "customer",
    members: [
      { name: "Customer OEM / prime", role: "Owns the design; sends drawing package, BOM, LTAs, POs and schedules", basis: "session" },
      { name: "Customer buyer / procurement", role: "POs, schedules, price-adjustment and advance-payment negotiation", basis: "estimate" },
      { name: "Customer engineering", role: "ECNs; approves alternates and deviations", basis: "estimate" },
      { name: "Customer quality / source inspector", role: "First article approval, source inspection", basis: "estimate" },
      { name: "Customer forecast portal", role: "Publishes forecasts that Rossell downloads daily", basis: "session" },
      { name: "Customer as material supplier", role: "Customer-furnished material (CFM), where applicable", basis: "estimate" },
    ],
    sources: ["WS", "DECK-SC", "DECK-RESEARCH"],
    confidence: "session",
  },
  {
    id: "rossell",
    name: "Rossell teams",
    side: "internal",
    members: [
      { name: "PreSales / Sourcing", role: "Bidding, costing, negotiation", basis: "session" },
      { name: "Engineering", role: "BOMs, revisions, alternates", basis: "session" },
      { name: "Buyer", role: "Exceptions, must-arrive-by, open orders, reorders, promise dates", basis: "session" },
      { name: "PPC", role: "Stock, work orders, kits, build dates", basis: "session" },
      { name: "SCM", role: "GRN, promise dates in IQMS, supplier follow-up", basis: "session" },
      { name: "Logistics / EXIM", role: "Import customs, bonded / DTA rules, air freight", basis: "session" },
      { name: "Quality / incoming QA", role: "CoC, traceability; accept, hold or reject", basis: "session" },
      { name: "Production", role: "Consumes kits; raises shortages", basis: "session" },
      { name: "Finance", role: "Working capital, advances, valuation", basis: "session" },
      { name: "IT (SCM) / software development", role: "Reports (e.g. Reorder), integration", basis: "session" },
      { name: "Program manager", role: "Program schedule, risk, customer contact", basis: "estimate" },
      { name: "BOM / configuration manager", role: "Revisions, validation, effective dates, archive", basis: "rules" },
      { name: "Component engineer", role: "Part validation, AML, alternates, obsolescence", basis: "estimate" },
      { name: "Master data owner", role: "Canonical material master; customer PN → MPN mapping", basis: "rules" },
      { name: "Stores / warehouse", role: "Receipt, lot control, quarantine, kitting", basis: "estimate" },
      { name: "Approver / management", role: "PO limits, early buys, write-offs", basis: "estimate" },
    ],
    sources: ["WS", "RULES", "DECK-SC", "DECK-RESEARCH"],
    confidence: "session",
  },
  {
    id: "suppliers",
    name: "Suppliers & partners",
    side: "supply",
    members: [
      { name: "Component manufacturers", role: "Quote, confirm promise dates; push out dates or short-ship", basis: "session" },
      { name: "Authorised distributors", role: "Stock and resell manufacturers' parts", basis: "session" },
      { name: "Independent brokers", role: "Only with approval and extra counterfeit checks", basis: "estimate" },
      { name: "Customer-directed suppliers", role: "Sources mandated by the customer", basis: "estimate" },
      { name: "Subcontractors / special-process vendors", role: "Plating, machining, special processes", basis: "estimate" },
      { name: "Freight forwarders & customs brokers", role: "Move and clear imports", basis: "estimate" },
      { name: "Service providers", role: "Logistics, testing", basis: "session" },
    ],
    sources: ["WS", "DECK-SC", "DECK-RESEARCH"],
    confidence: "session",
    note: "Mixed digital maturity: suppliers will not type thousands of rows; tools must take email, Excel and bulk confirmations.",
  },
  {
    id: "systems",
    name: "Systems & government",
    side: "systems",
    members: [
      { name: "IQMS (DELMIAworks) ERP", role: "System of record", basis: "session" },
      { name: "Crystal Reports on SQL", role: "Morning reports", basis: "session" },
      { name: "Excel and email", role: "In between everything", basis: "session" },
      { name: "Customer forecast portals / files", role: "Demand signal", basis: "session" },
      { name: "Customs and duty reporting", role: "Monthly and quarterly duty reconciliation", basis: "session" },
      { name: "PLM / document control", role: "Unknown", basis: "estimate" },
      { name: "QMS (FAI, NCR)", role: "Unknown", basis: "estimate" },
    ],
    sources: ["WS", "DECK-SC"],
    confidence: "session",
  },
];

export const primaryUsers = {
  text: "Buyers and PPC every morning; SCM for supplier dates; Engineering and Sourcing for BOM and supplier context.",
  sources: ["DECK-SC", "WS"],
  confidence: "session" as const,
};

/* ---------- 10. Supplier follow-up loop (deck p.22) ---------- */

export const supplierFollowUpLoop = {
  steps: [
    "Buyer emails or calls the supplier for a date",
    "Supplier gives a date, or no reply",
    "Supplier pushes out or ships part of the order",
    "Buyer updates Excel, then the ERP by hand",
    "Planner re-plans builds; the cycle repeats",
  ],
  consequences: [
    { title: "Partial kits block builds", text: "One late part strands the rest of the bill of materials." },
    { title: "Stock sits idle", text: "Parts already bought wait for the missing one; some are damaged or cancelled." },
    { title: "Customers escalate", text: "Delays reach the OEM, who presses for dates." },
    { title: "People absorb the gap", text: "Teams describe 17–18 hour days, seven days a week." },
  ],
  scaleNote: "Thousands of materials across hundreds of suppliers.",
  sources: ["WS", "DECK-SC"],
  confidence: "session" as const,
};

/* ---------- 11. Challenges heard (research D8) ---------- */

export const challenges: { area: string; challenge: string; module: "A" | "B" | "C" | "Foundation"; sources: string[]; confidence: "session" }[] = [
  { area: "Demand", challenge: "Semiconductor forecasts change daily and are trending up", module: "A", sources: ["WS"], confidence: "session" },
  { area: "Demand", challenge: "Near-term forecast duplicates firm orders and must be excluded", module: "A", sources: ["WS"], confidence: "session" },
  { area: "Demand", challenge: "Morning Crystal snapshots reconciled by hand during the day", module: "Foundation", sources: ["WS"], confidence: "session" },
  { area: "Dates", challenge: "Buyers need need-date overrides and pull-in/push-out tracking", module: "B", sources: ["WS"], confidence: "session" },
  { area: "Suppliers", challenge: "Promise dates arrive by email and go into IQMS via Excel", module: "B", sources: ["WS"], confidence: "session" },
  { area: "Suppliers", challenge: "Supplier-held (VMI) stock is not in the planning picture", module: "B", sources: ["WS"], confidence: "session" },
  { area: "Allocation", challenge: "Stock sits on unfirmed work orders while firmed ones wait", module: "C", sources: ["WS"], confidence: "session" },
  { area: "Kitting", challenge: "Hard to see which wire bundles are fully kittable today", module: "C", sources: ["WS"], confidence: "session" },
  { area: "Kitting", challenge: "Kit start dates assigned project by project with limited system support", module: "C", sources: ["WS"], confidence: "session" },
];
