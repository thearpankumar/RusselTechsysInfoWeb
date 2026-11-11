// Data dictionary across all entities in the BOM-to-kit flow.
// Entities come from the working sessions, the business rules and the report inventory; field lists are
// our model (to be validated against IQMS tables). `files` are DataFile ids from files.ts.
import type { DictionaryEntry } from "./types";

const e = (
  entity: string,
  field: string,
  type: string,
  definition: string,
  example: string | undefined,
  files: string[],
  usedBy: string[],
): DictionaryEntry => ({ entity, field, type, definition, example, files, usedBy });

const BUY = "Buyer";
const PPC = "PPC";
const SCM = "SCM";
const ENG = "Engineering";
const SRC = "Sourcing";
const FIN = "Finance";
const QA = "Quality";
const IT = "IT";

export const dataDictionary: DictionaryEntry[] = [
  // Customer hierarchy: Group → Segment → Customer, mapped to a domain (WS)
  e("Customer group", "Group ID", "string", "Top level of the customer hierarchy (e.g. a corporate parent).", "GRP-SMPL-01", [], [SRC, FIN]),
  e("Customer group", "Group name", "string", "Name of the customer group.", "Group A (sample)", [], [SRC, FIN]),
  e("Customer group", "Domain", "enum", "Domain the group maps to: aerospace, defence, semiconductor, space.", "Aerospace", [], [SRC, BUY]),
  e("Customer segment", "Segment ID", "string", "Middle level of the hierarchy (business unit / division).", "SEG-SMPL-03", [], [SRC]),
  e("Customer segment", "Segment name", "string", "Name of the segment.", "Defence systems (sample)", [], [SRC]),
  e("Customer segment", "Group ID", "string", "Parent customer group.", "GRP-SMPL-01", [], [SRC]),
  e("Customer", "Customer code", "string", "Unique customer identifier in IQMS.", "CUST-AERO-01", ["rt-open-order", "forecast", "sales-order"], [BUY, PPC, SRC, FIN]),
  e("Customer", "Customer name", "string", "Legal / trading name.", "Customer A (sample)", ["rt-open-order", "sales-order"], [BUY, FIN]),
  e("Customer", "Segment ID", "string", "Segment the customer belongs to.", "SEG-SMPL-03", [], [SRC]),
  e("Customer", "Domain", "enum", "Every customer is mapped to one domain; drives the ordering pattern.", "Semiconductor", ["rt-open-order"], [BUY, PPC]),
  e("Customer", "Country", "string", "Ship-to country; ~80% of exports go to North America.", "USA", [], [FIN, "Logistics"]),
  e("Customer", "Forecast exclusion months", "number", "Months at the start of a forecast file excluded from consolidation: 2 by default, 6 for LAM.", "6", ["forecast"], [BUY]),
  e("Customer", "Forecast buffer days", "number", "Extra duration added after the IQMS horizon before forecast counts.", "30", ["forecast"], [BUY]),

  // Domain
  e("Domain", "Domain ID", "enum", "aerospace | defence | semiconductor | space.", "aerospace", [], ["All"]),
  e("Domain", "Ordering pattern", "enum", "One PO / many schedules; scheduled deliveries; many POs / one schedule; project-based.", "One PO, many schedules", ["rt-open-order"], [BUY, PPC]),
  e("Domain", "Name", "string", "Display name.", "Semiconductor", [], ["All"]),

  // Project → Orders (WS)
  e("Project", "Project code", "string", "A customer program; 44 are running. Semiconductor has no project layer.", "PRJ-SMPL-07", ["rt-open-order", "material-planner"], [PPC, BUY]),
  e("Project", "Customer code", "string", "Customer that owns the project.", "CUST-AERO-01", ["rt-open-order"], [PPC]),
  e("Project", "Domain", "enum", "Domain of the project.", "Aerospace", [], [PPC]),
  e("Project", "Status", "enum", "Active / ramping / closing.", "Active", [], [PPC, "Management"]),
  e("Project", "Kit start date", "date", "Assigned date to start kitting for the project's next builds (current work, project-wise).", "2026-12-01", ["material-planner"], [PPC, SCM]),

  // Customer PO
  e("Customer PO", "Customer PO no", "string", "The customer's order to Rossell. Can carry many schedules.", "CPO-SMPL-4501", ["rt-open-order", "sales-order"], [BUY, FIN]),
  e("Customer PO", "Customer code", "string", "Ordering customer.", "CUST-AERO-01", ["rt-open-order"], [BUY]),
  e("Customer PO", "Project code", "string", "Project the PO belongs to (blank for semiconductor).", "PRJ-SMPL-07", ["rt-open-order"], [PPC]),
  e("Customer PO", "PO date", "date", "Date the order was received.", "2025-11-03", [], [FIN]),
  e("Customer PO", "Currency", "enum", "USD / INR / EUR.", "USD", ["rt-open-order"], [FIN]),
  e("Customer PO", "Total value", "number", "Order value; invoiced in parts as deliveries go out.", "1,850,000", ["sales-order"], [FIN]),

  // Schedule line
  e("Schedule line", "PO line", "number", "Line on the customer PO.", "1", ["rt-open-order"], [BUY]),
  e("Schedule line", "Schedule line no", "number", "Dated delivery under the PO line (e.g. 200 in Jan, 500 in Mar).", "2", ["rt-open-order"], [BUY, PPC]),
  e("Schedule line", "FG part no", "string", "Finished good ordered.", "001-0001-011", ["rt-open-order"], [BUY, PPC]),
  e("Schedule line", "Ordered qty", "number", "Quantity on the schedule.", "500", ["rt-open-order"], [BUY]),
  e("Schedule line", "Shipped qty", "number", "Quantity already shipped.", "120", ["rt-open-order"], [BUY, FIN]),
  e("Schedule line", "Open qty", "number", "Ordered − shipped: firm demand still to build.", "380", ["rt-open-order", "sales-order"], [BUY, PPC]),
  e("Schedule line", "Due date", "date", "Requested delivery date; drives need dates down the BOM.", "2026-03-31", ["rt-open-order"], [BUY, PPC]),

  // Forecast line
  e("Forecast line", "Customer code", "string", "Customer the forecast came from.", "CUST-SEMI-01", ["forecast"], [BUY, SRC]),
  e("Forecast line", "File date", "date", "Date the file was downloaded (daily for semiconductor).", "2026-11-10", ["forecast"], [BUY]),
  e("Forecast line", "Customer part no", "string", "Customer's part number for the FG.", "CPN-SMPL-8821", ["forecast"], [BUY]),
  e("Forecast line", "Bucket start", "date", "Start of the forecast period.", "2027-06-01", ["forecast"], [BUY]),
  e("Forecast line", "Forecast qty", "number", "Forecast quantity; the full file quantity is used.", "260", ["forecast"], [BUY, SRC]),
  e("Forecast line", "Label", "string", "Customer nomenclature; ignored in consolidation.", "Plan", ["forecast"], [BUY]),
  e("Forecast line", "Months out", "number", "Months between file date and bucket.", "7", ["forecast"], [BUY]),
  e("Forecast line", "In exclusion window", "boolean", "True when within the excluded first months (overlaps firm orders).", "false", ["forecast"], [BUY]),

  // Finished good
  e("Finished good", "FG part no", "string", "Rossell part number of the deliverable (e.g. a wire bundle).", "001-0001-011", ["rt-consolidated-bom", "rt-open-order", "sales-order"], [ENG, PPC, BUY]),
  e("Finished good", "Description", "string", "FG description.", "Wire bundle (sample)", ["rt-consolidated-bom"], [ENG]),
  e("Finished good", "Customer part no", "string", "Customer's number for the same FG.", "CPN-SMPL-0042", ["forecast"], [ENG, BUY]),
  e("Finished good", "Material master ref", "string", "FG must reference the canonical material master (rule 2.1).", "FG-MM-SMPL-011", ["rt-consolidated-bom"], [ENG]),
  e("Finished good", "FG type", "enum", "Wire bundle / panel / electro-mechanical / test equipment.", "Wire bundle", [], [ENG, PPC]),

  // Material master
  e("Material master", "Item no (RM)", "string", "Rossell's internal raw-material number.", "RM-SMPL-0021", ["active-stock", "exception", "rt-consolidated-bom", "grn", "reorder"], [BUY, PPC, ENG, SCM]),
  e("Material master", "Description", "string", "Canonical description.", "Connector, MIL-DTL-38999 type, shell 13", ["active-stock", "rt-consolidated-bom"], ["All"]),
  e("Material master", "UOM", "enum", "Unit of measure: EA, FT, M.", "EA", ["active-stock", "rt-consolidated-bom"], [BUY, PPC]),
  e("Material master", "Item revision", "string", "Revision of the material itself.", "B", ["active-stock"], [ENG]),
  e("Material master", "Commodity", "enum", "Wire, connector, contact, backshell, sleeving, clamp, splice, label …", "Connector", [], [SRC, BUY]),
  e("Material master", "Lead time (days)", "number", "Standard lead time from order to receipt.", "84", ["exception", "reorder"], [BUY]),
  e("Material master", "Shelf life (months)", "number", "For time-limited materials (sealants, potting).", "12", ["active-stock"], [PPC, QA]),
  e("Material master", "Lifecycle status", "enum", "Active / NRND / EOL / Obsolete.", "Active", [], [ENG, SRC]),
  e("Material master", "Long-lead / single-source flag", "boolean", "Triggers early buys and advance-payment requests.", "true", [], [BUY, FIN]),

  // Customer PN ↔ MPN
  e("Customer PN ↔ MPN", "Customer PN", "string", "Customer's part number on the drawing.", "CPN-SMPL-1407", ["rt-consolidated-bom"], [ENG]),
  e("Customer PN ↔ MPN", "RM item no", "string", "Mapped canonical Rossell material (one-to-many is an open question).", "RM-SMPL-0021", ["rt-consolidated-bom"], [ENG, "Master data owner"]),
  e("Customer PN ↔ MPN", "MPN", "string", "Manufacturer part number behind the RM (OEM part no.).", "D38999/26WB35PN (example)", ["rt-consolidated-bom", "sourcing"], [ENG, BUY]),
  e("Customer PN ↔ MPN", "Manufacturer", "string", "Maker of the MPN.", "Manufacturer D (sample)", ["sourcing"], [SRC]),
  e("Customer PN ↔ MPN", "Preferred", "boolean", "Preferred MPN when several are approved.", "true", [], [BUY]),

  // Plant
  e("Plant", "Plant code", "enum", "Rossell manufacturing plant: Bengaluru Plant 1, Plant 2, USA.", "BLR-P1", ["active-stock", "rt-consolidated-bom", "grn"], ["All"]),
  e("Plant", "Name", "string", "Plant name.", "Bengaluru Plant 1", [], ["All"]),
  e("Plant", "Country", "string", "India / USA.", "India", [], [FIN, "Logistics"]),
  e("Plant", "Customs status", "enum", "Bonded / DTA / EOU; drives import-duty treatment.", "DTA", [], ["Logistics", FIN]),

  // EBOM
  e("EBOM", "BOM ID", "string", "Identity = FG + plant (customer is not part of it, rule 2.1).", "BOM-001-0001-011-BLR-P1", ["rt-consolidated-bom"], [ENG]),
  e("EBOM", "FG part no", "string", "Finished good the BOM builds.", "001-0001-011", ["rt-consolidated-bom"], [ENG, PPC]),
  e("EBOM", "Plant code", "string", "Plant the BOM applies to.", "BLR-P1", ["rt-consolidated-bom"], [ENG]),
  e("EBOM", "Current accepted rev", "string", "Latest validated & accepted revision; stays in the main BOM tables.", "C", ["rt-consolidated-bom"], [ENG, PPC, BUY]),
  e("EBOM", "Line count", "number", "Number of raw-material lines (96 for the sample wire bundle).", "96", ["rt-consolidated-bom"], [ENG, PPC]),

  // BOM revision
  e("BOM revision", "Revision", "string", "Engineering revision letter.", "D", ["rt-consolidated-bom"], [ENG]),
  e("BOM revision", "Effective from", "date", "Date from which the revision applies to planning.", "2026-12-01", ["rt-consolidated-bom"], [ENG, PPC]),
  e("BOM revision", "Effective to", "date", "End of effectivity (next revision takes over).", "", ["rt-consolidated-bom"], [ENG]),
  e("BOM revision", "Accepted on", "date", "Date validation passed and the revision was accepted.", "2026-11-05", [], [ENG]),
  e("BOM revision", "Validation status", "enum", "Draft / Validated / Accepted / Rejected.", "Accepted", [], [ENG]),
  e("BOM revision", "ECN reference", "string", "Customer engineering change that caused the revision.", "ECN-SMPL-118", [], [ENG, QA]),

  // BOM line
  e("BOM line", "Line no", "number", "Sequence within the BOM.", "15", ["rt-consolidated-bom"], [ENG]),
  e("BOM line", "RM item no", "string", "Component material.", "RM-SMPL-0015", ["rt-consolidated-bom"], [ENG, BUY, PPC]),
  e("BOM line", "Qty per FG", "number", "Units of the RM in one FG (e.g. 200 FT of wire).", "200", ["rt-consolidated-bom"], [PPC, BUY]),
  e("BOM line", "UOM", "enum", "Unit of measure for the quantity.", "FT", ["rt-consolidated-bom"], [PPC, BUY]),
  e("BOM line", "Wire / reference designator", "string", "Wire number or connector reference on the drawing.", "W123 / P4", ["rt-consolidated-bom"], [ENG, "Production"]),
  e("BOM line", "Approved source", "string", "AML entry the line must be bought from (build-to-print).", "Manufacturer D (sample)", ["rt-consolidated-bom", "sourcing"], [BUY, SRC]),

  // BOM archive
  e("BOM archive", "Snapshot ID", "string", "Archived complete snapshot of a previous accepted revision (rule 2.2).", "SNAP-SMPL-0007", [], [ENG]),
  e("BOM archive", "Revision", "string", "Revision archived.", "B", [], [ENG]),
  e("BOM archive", "Archived on", "date", "When it was superseded.", "2026-10-01", [], [ENG]),
  e("BOM archive", "Line snapshot", "json", "All component lines as they were; history stays with the original revision.", "[96 lines]", [], [ENG, QA]),

  // AML / AVL
  e("AML / AVL", "RM item no", "string", "Material the approval is for.", "RM-SMPL-0021", ["sourcing", "vendor-master"], [ENG, SRC]),
  e("AML / AVL", "Manufacturer", "string", "Approved manufacturer.", "Manufacturer D (sample)", ["sourcing"], [ENG, SRC]),
  e("AML / AVL", "MPN", "string", "Approved manufacturer part number.", "D38999/26WB35PN (example)", ["sourcing"], [SRC, BUY]),
  e("AML / AVL", "Approval status", "enum", "Approved / Alternate pending customer approval / Disqualified.", "Approved", ["vendor-master"], [ENG, QA]),
  e("AML / AVL", "Customer approval ref", "string", "Deviation / waiver or approval reference from customer engineering.", "DEV-SMPL-22", [], [ENG, QA]),

  // Supplier
  e("Supplier", "Vendor code", "string", "IQMS vendor ID.", "V-SMPL-001", ["vendor-master", "supplier-contact", "grn"], [BUY, SCM]),
  e("Supplier", "Vendor name", "string", "Supplier name.", "Distributor A (sample)", ["vendor-master", "grn", "reorder"], [BUY, SCM]),
  e("Supplier", "Category", "enum", "Manufacturer / Distributor / Special process / Logistics / Service.", "Distributor", ["vendor-master"], [SRC]),
  e("Supplier", "Country", "string", "Supplier country; most components are imported.", "USA", ["vendor-master"], ["Logistics"]),
  e("Supplier", "Approval status", "enum", "ASL status.", "Approved", ["vendor-master"], [QA, SRC]),
  e("Supplier", "Contact email", "string", "Who to email for dates (to be provided).", "orders@distributor-a.example", ["supplier-contact"], [BUY, SCM]),
  e("Supplier", "Portal user", "boolean", "Whether the supplier uses the planned portal (open question).", "false", [], [SCM]),

  // Supplier PO
  e("Supplier PO", "PO no", "string", "Rossell's order to a supplier.", "PO-SMPL-77801", ["promise-date-upload", "grn", "open-order-mrp"], [BUY, SCM]),
  e("Supplier PO", "PO line", "number", "Line on the PO.", "1", ["promise-date-upload", "grn"], [BUY]),
  e("Supplier PO", "Supplier", "string", "Vendor code.", "V-SMPL-002", ["promise-date-upload"], [BUY]),
  e("Supplier PO", "Item no", "string", "Material ordered.", "RM-SMPL-0021", ["promise-date-upload", "open-order-mrp"], [BUY]),
  e("Supplier PO", "Order qty", "number", "Quantity ordered.", "40", [], [BUY]),
  e("Supplier PO", "Received qty", "number", "Quantity received to date.", "20", ["grn"], [SCM]),
  e("Supplier PO", "Open qty", "number", "Ordered − accepted: counts as in-flight supply.", "20", ["exception", "promise-date-upload", "open-order-mrp"], [BUY, PPC]),
  e("Supplier PO", "Due date", "date", "Date on the PO.", "2026-12-05", ["open-order-mrp"], [BUY]),
  e("Supplier PO", "Unit cost", "number", "Price per UOM.", "96.50", ["reorder", "sourcing"], [BUY, FIN]),
  e("Supplier PO", "In-transit qty", "number", "Shipped by supplier, not yet received; part of in-flight supply.", "10", [], [BUY, "Logistics"]),

  // Promise date
  e("Promise date", "Promise date", "date", "Supplier's committed delivery date; ETA = promise date.", "2026-12-05", ["promise-date-upload", "exception-mab"], [SCM, BUY, PPC]),
  e("Promise date", "Promise qty", "number", "Quantity committed for that date (partials allowed).", "20", ["promise-date-upload"], [SCM]),
  e("Promise date", "Change type", "enum", "New / Pull-in / Push-out / Split.", "Push-out", ["promise-date-upload"], [BUY, SCM]),
  e("Promise date", "Source", "enum", "Email / Portal / Phone / Upload.", "Email", ["promise-date-upload"], [SCM]),
  e("Promise date", "Updated by", "string", "User who recorded it.", "BYR-01", ["promise-date-upload"], [SCM, IT]),
  e("Promise date", "Updated at", "datetime", "When it was recorded (audit trail).", "2026-11-10 09:42", [], [IT]),

  // Need date
  e("Need date", "Need date", "date", "When the material is needed for its work order / demand.", "2026-12-01", ["exception-mab", "material-planner"], [BUY, PPC]),
  e("Need date", "Override need date", "date", "Buyer-overridden need date (allowed, logged).", "2026-11-26", [], [BUY]),
  e("Need date", "Override reason", "string", "Why the buyer overrode it.", "Customer pull-in", [], [BUY]),
  e("Need date", "Must arrive by", "date", "Need date minus receiving / inspection time.", "2026-11-24", ["exception-mab"], [BUY]),

  // GRN
  e("GRN", "GRN no", "string", "Goods received note number.", "GRN-SMPL-91001", ["grn"], [SCM, "Stores"]),
  e("GRN", "GRN date", "date", "Date received.", "2026-11-06", ["grn"], [SCM]),
  e("GRN", "Supplier PO", "string", "PO the receipt is booked against.", "PO-SMPL-77822", ["grn"], [SCM, BUY]),
  e("GRN", "Received qty", "number", "Quantity received.", "3000", ["grn"], [SCM]),
  e("GRN", "Accepted qty", "number", "Accepted by QA: leaves in-flight and enters inventory at the same moment.", "3000", ["grn", "active-stock"], [SCM, PPC]),
  e("GRN", "Rejected qty", "number", "Rejected or on hold; may trigger NCR / RTV.", "0", ["grn"], [QA, BUY]),
  e("GRN", "CoC reference", "string", "Certificate of conformance received with the goods.", "COC-SMPL-5531", ["grn"], [QA]),

  // Inspection
  e("Inspection", "Result", "enum", "Accept / Hold / Reject.", "Accept", ["grn"], [QA]),
  e("Inspection", "Counterfeit check", "enum", "Pass / Fail / N/A (AS5553 / AS6081 practice).", "Pass", [], [QA]),
  e("Inspection", "NCR no", "string", "Nonconformance report if rejected.", "NCR-SMPL-301", [], [QA, BUY]),
  e("Inspection", "Disposition", "enum", "Use as is / Rework / Scrap / RTV.", "RTV", [], [QA, "MRB"]),

  // Inventory lot
  e("Inventory lot", "Lot no", "string", "Lot for traceability.", "L-SAMPLE-2412", ["active-stock", "grn"], [PPC, QA]),
  e("Inventory lot", "Date code", "string", "Manufacturer date code (YYWW).", "2630", ["active-stock", "grn"], [QA]),
  e("Inventory lot", "Location", "string", "Bin / stores location.", "WH2-B02-01", ["active-stock"], ["Stores"]),
  e("Inventory lot", "On hand", "number", "Physical quantity.", "15000", ["active-stock"], [PPC, BUY]),
  e("Inventory lot", "In WIP", "number", "Issued to open work orders.", "3000", ["active-stock"], [PPC]),
  e("Inventory lot", "Kitted", "number", "Already placed in kits.", "4500", ["active-stock"], [PPC]),
  e("Inventory lot", "Free qty", "number", "On hand − WIP − kitted: the only stock planning counts.", "7500", ["active-stock"], [PPC, BUY]),
  e("Inventory lot", "QA status", "enum", "Accepted / On hold / Quarantine. Whether hold counts as supply is an open question.", "Accepted", ["active-stock"], [QA, PPC]),
  e("Inventory lot", "CFM flag", "boolean", "Customer-furnished material, kept separate.", "false", ["active-stock"], [PPC, FIN]),

  // VMI stock
  e("VMI stock", "Supplier", "string", "Supplier holding stock for Rossell.", "V-SMPL-001", [], [SCM]),
  e("VMI stock", "Item no", "string", "Material held.", "RM-SMPL-0034", [], [SCM, BUY]),
  e("VMI stock", "VMI on hand", "number", "Quantity the supplier reports holding for Rossell (uploaded in their portal or by email).", "8000", [], [BUY, PPC]),
  e("VMI stock", "Reported at", "datetime", "When the supplier last reported it.", "2026-11-09 18:00", [], [SCM]),

  // Safety stock
  e("Safety stock", "Safety stock qty", "number", "Buffer held against variability (e.g. 2 weeks' cover).", "500", ["material-planner"], [BUY, PPC]),
  e("Safety stock", "Need date", "date", "Safety-stock lines carry their own need date.", "2027-01-05", ["material-planner"], [BUY]),
  e("Safety stock", "Promise date", "date", "…and their own promise date.", "2027-01-02", ["promise-date-upload"], [BUY, SCM]),

  // Work order
  e("Work order", "WO no", "string", "Work order to build an FG.", "WO-SMPL-50112", ["exception-mab", "material-planner"], [PPC, "Production"]),
  e("Work order", "FG part no", "string", "What the WO builds.", "001-0001-011", ["exception-mab", "material-planner"], [PPC]),
  e("Work order", "BOM rev (frozen)", "string", "BOM revision frozen for allocation.", "C", ["material-planner"], [PPC, ENG]),
  e("Work order", "WO qty", "number", "Units to build.", "8", [], [PPC]),
  e("Work order", "Start date", "date", "Planned start; drives material need dates.", "2026-12-01", ["exception-mab"], [PPC]),
  e("Work order", "Firmed", "boolean", "Firmed WOs keep priority; unfirmed may be realigned.", "true", [], [PPC]),
  e("Work order", "Priority score", "number", "Configurable: need date, order value, project, customer.", "87", [], [PPC, "Management"]),

  // Allocation
  e("Allocation", "Allocation ID", "string", "Reservation of stock to a WO line.", "ALC-SMPL-00981", [], [PPC]),
  e("Allocation", "Allocated qty", "number", "Quantity reserved.", "16", ["material-planner"], [PPC]),
  e("Allocation", "Hard allocated", "boolean", "Hard allocations are served first and not realigned.", "true", ["material-planner"], [PPC]),
  e("Allocation", "Allocated at", "datetime", "When reserved (audit).", "2026-11-10 07:15", [], [PPC, IT]),
  e("Allocation", "Realigned from", "string", "WO the stock was moved from, if realigned.", "WO-SMPL-50099", [], [PPC, BUY]),

  // Kit / wire bundle
  e("Kit / wire bundle", "Kit ID", "string", "Kit for one WO / wire bundle.", "KIT-SMPL-50112", [], [PPC, "Stores"]),
  e("Kit / wire bundle", "Kit status", "enum", "Full (every material available) / Partial.", "Partial", [], [PPC, "Production"]),
  e("Kit / wire bundle", "Kit start date", "date", "Assigned date to start kitting.", "2026-11-28", ["material-planner"], [PPC, SCM]),
  e("Kit / wire bundle", "Lines short", "number", "BOM lines not yet available (1 of 96 short = 0 builds).", "1", [], [PPC, BUY]),

  // CTB status
  e("CTB status", "Clear to build", "boolean", "True only when every component is available or committed.", "false", [], [PPC, SCM, "Management"]),
  e("CTB status", "Projected CTB date", "date", "Latest ETA among short lines.", "2026-12-05", ["exception-mab", "promise-date-upload"], [PPC, "Management"]),
  e("CTB status", "Shortage qty", "number", "Required − on order − available (common formulation).", "8", ["exception"], [PPC, BUY]),
  e("CTB status", "Shortage ETA", "date", "Promise date of the supply that clears the shortage.", "2026-12-05", ["promise-date-upload"], [PPC, SCM]),

  // Planning run
  e("Planning run", "Run ID", "string", "One execution of the planning engine.", "RUN-SMPL-2026-11-11-0600", [], [IT, BUY, PPC]),
  e("Planning run", "Run at", "datetime", "When it ran (morning run + on-demand refresh).", "2026-11-11 06:00", [], [IT]),
  e("Planning run", "Inputs snapshot", "json", "IQMS extracts, forecast files and overrides used.", "{...}", ["active-stock", "rt-open-order", "forecast"], [IT]),
  e("Planning run", "BOM revisions used", "json", "Exact BOM revision per FG + plant (rule 2.2).", "{001-0001-011@BLR-P1: C}", ["rt-consolidated-bom"], [ENG, IT]),
  e("Planning run", "Consolidated demand", "number", "Firm + forecast (outside exclusion window) + safety stock, per part / plant / date.", "100", ["rt-open-order", "forecast"], [BUY]),
  e("Planning run", "In-flight supply", "number", "Open POs + in-transit.", "20", ["exception", "open-order-mrp"], [BUY]),
  e("Planning run", "Net demand", "number", "Consolidated demand − in-flight supply.", "80", [], [BUY, PPC]),
  e("Planning run", "Net requirement", "number", "Net demand − free stock (− safety stock rules, MOQ etc.).", "0", ["reorder"], [BUY]),

  // Reorder suggestion
  e("Reorder suggestion", "Suggested qty", "number", "Net requirement rounded to MOQ / order multiple.", "2000", ["reorder"], [BUY]),
  e("Reorder suggestion", "MOQ", "number", "Supplier minimum order quantity.", "1000", ["reorder"], [BUY]),
  e("Reorder suggestion", "Order by", "date", "Need date − lead time.", "2026-11-14", ["reorder"], [BUY]),

  // Invoice
  e("Invoice", "Invoice no", "string", "Raised against a customer PO; one PO can have many invoices.", "INV-SMPL-2026-0912", [], [FIN]),
  e("Invoice", "Customer PO", "string", "PO being billed.", "CPO-SMPL-4501", ["sales-order"], [FIN]),
  e("Invoice", "Invoice date", "date", "Date billed (at dispatch).", "2026-11-08", [], [FIN]),
  e("Invoice", "Amount", "number", "Billed amount (e.g. ₹1 Cr of a ₹10 Cr PO).", "1,00,00,000", [], [FIN]),
  e("Invoice", "Payment status", "enum", "Open / Part-paid / Paid / Reconciled.", "Open", [], [FIN]),

  // User
  e("User", "User ID", "string", "Login for the planning layer; roles by department and designation.", "u.sample01", ["user-details"], [IT]),
  e("User", "Department", "enum", "SCM, PPC, Engineering, Sourcing, IT, Finance …", "SCM", ["user-details"], [IT]),
  e("User", "Designation", "enum", "VP → Senior Manager → Manager → Assistant Manager → Team Lead → Principal Engineer → Engineer → Associate Engineer.", "Principal Engineer", ["user-details"], [IT]),
];

export const dictionaryEntities = Array.from(new Set(dataDictionary.map((d) => d.entity)));

export const dictionaryNote = {
  text: "Entities and relationships follow the working sessions, the BOM business rules and the report inventory. Field lists are our model, to be validated against IQMS tables; example values are samples.",
  sources: ["WS", "RULES", "DECK-SC"],
  confidence: "estimate" as const,
};

/* ---------- entity groups (filter chips + colour per group) ---------- */

export interface DictionaryEntityGroup {
  id: string;
  label: string;
  entities: string[];
}

/** Each dictionary entity belongs to exactly one group. Order = DESIGN.md data-colour order. */
export const dictionaryEntityGroups: DictionaryEntityGroup[] = [
  { id: "customer", label: "Customer & orders", entities: ["Customer group", "Customer segment", "Customer", "Domain", "Project", "Customer PO", "Schedule line"] },
  { id: "demand", label: "Demand & planning", entities: ["Forecast line", "Planning run", "Need date", "Safety stock", "Reorder suggestion"] },
  { id: "engineering", label: "Engineering & BOM", entities: ["Finished good", "EBOM", "BOM revision", "BOM line", "BOM archive"] },
  { id: "material", label: "Materials & sources", entities: ["Material master", "Customer PN ↔ MPN", "AML / AVL", "Supplier"] },
  { id: "purchasing", label: "Purchasing", entities: ["Supplier PO", "Promise date"] },
  { id: "stores", label: "Stores & inventory", entities: ["GRN", "Inspection", "Inventory lot", "VMI stock", "Plant"] },
  { id: "production", label: "Production & billing", entities: ["Allocation", "CTB status", "Kit / wire bundle", "Work order", "Invoice"] },
  { id: "access", label: "Access", entities: ["User"] },
];

export function entityGroupOf(entity: string): DictionaryEntityGroup | undefined {
  return dictionaryEntityGroups.find((g) => g.entities.includes(entity));
}

/* ---------- entity relationship map (the BOM-to-kit chain) ---------- */

export interface EntityMapNode {
  id: string;
  label: string;
  /** Dictionary entities this node stands for (clicking the node filters to them). */
  entities: string[];
  /** Relationship to the next node in the chain, in plain words. */
  next?: string;
}

/** Customer → … → Invoice, the chain every order walks through (WS, RULES, info.md lifecycle). */
export const entityMap: EntityMapNode[] = [
  { id: "customer", label: "Customer", entities: ["Customer", "Customer group", "Customer segment", "Domain"], next: "places" },
  { id: "customer-po", label: "Customer PO", entities: ["Customer PO", "Project"], next: "1 : many" },
  { id: "schedule", label: "Schedule", entities: ["Schedule line"], next: "adds up to" },
  { id: "demand", label: "Demand", entities: ["Forecast line", "Planning run", "Need date", "Safety stock"], next: "for each" },
  { id: "fg", label: "Finished good", entities: ["Finished good"], next: "built to" },
  { id: "bom-revision", label: "BOM revision", entities: ["BOM revision", "EBOM", "BOM archive"], next: "1 : many" },
  { id: "bom-line", label: "BOM line", entities: ["BOM line"], next: "calls for" },
  { id: "material", label: "Material", entities: ["Material master", "Customer PN ↔ MPN", "AML / AVL"], next: "bought on" },
  { id: "supplier-po", label: "Supplier PO", entities: ["Supplier PO", "Supplier", "Promise date", "Reorder suggestion"], next: "received as" },
  { id: "grn", label: "GRN", entities: ["GRN", "Inspection"], next: "becomes" },
  { id: "inventory", label: "Inventory", entities: ["Inventory lot", "VMI stock", "Plant"], next: "reserved by" },
  { id: "allocation", label: "Allocation", entities: ["Allocation", "CTB status"], next: "fills" },
  { id: "kit", label: "Kit / wire bundle", entities: ["Kit / wire bundle"], next: "issued to" },
  { id: "work-order", label: "Work order", entities: ["Work order"], next: "shipped and billed" },
  { id: "invoice", label: "Invoice", entities: ["Invoice"] },
];

/** Stable id for a dictionary field (search items, overlays). */
export const fieldId = (d: Pick<DictionaryEntry, "entity" | "field">) =>
  `${d.entity}-${d.field}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
