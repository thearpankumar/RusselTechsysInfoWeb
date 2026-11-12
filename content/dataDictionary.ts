// Data dictionary: one vocabulary across every report, as a crosswalk from each field to the exact column that
// carries it in each file ("Item No", "Item #", "RT_PART_NO" … are one field). Columns of the seven reports Rossell
// sent are exact; columns of the other nine are our model (content/files.ts). Field names, definitions and entity
// groupings are ours, to be validated with Rossell. Examples are invented samples.
// validateDataFiles() runs at module load: every column of Rossell's sheets maps to exactly one field (build fails otherwise).
import type { ColumnRef, DictionaryEntry } from "./types";
import { fileColumns, files, getFile } from "./files";

const BUY = "Buyer";
const PPC = "PPC";
const SCM = "SCM";
const ENG = "Engineering";
const SRC = "Sourcing";
const FIN = "Finance";
const STO = "Stores";
const QA = "Quality";
const IT = "IT";

/** "file-id:Exact column" → ColumnRef. */
const ref = (s: string): ColumnRef => {
  const i = s.indexOf(":");
  return { file: s.slice(0, i), column: s.slice(i + 1) };
};

function e(entity: string, field: string, type: string, definition: string, example: string | undefined, cols: string[], usedBy: string[]): DictionaryEntry {
  const columns = cols.map(ref);
  const fileIds = [...new Set(columns.map((x) => x.file))];
  const basis = fileIds.some((id) => getFile(id)?.basis === "rossell-file") ? "rossell-file" : "modelled";
  return { entity, field, type, definition, example, columns, files: fileIds, usedBy, basis };
}

// File ids, for readability.
const AS = "active-stock";
const EX = "exception";
const MA = "exception-mab";
const BOM = "rt-consolidated-bom";
const OO = "rt-open-order";
const RO = "reorder";
const MP = "material-planner";
const FC = "forecast";
const SO = "sales-order";
const GRN = "grn";
const SRCG = "sourcing";
const VM = "vendor-master";
const PDU = "promise-date-upload";
const MRP = "open-order-mrp";
const CON = "supplier-contact";
const USR = "user-details";

export const dataDictionary: DictionaryEntry[] = [
  /* ---------- Customer & demand (our model until the forecast and sales-order files arrive) ---------- */
  e("Customer", "Customer code", "string", "Unique customer identifier. Each customer maps to one domain (aerospace, defence, semiconductor, space).", "CUST-SEMI-01", [`${FC}:Customer`, `${SO}:Customer`], [BUY, PPC, SRC, FIN]),
  e("Customer", "Forecast exclusion horizon", "number", "Months at the start of a forecast that are excluded because they overlap firm orders. Configurable per customer (2 by default, 6 for LAM); each planning run keeps the value it used.", "6", [], [BUY]),
  e("Customer order", "Sales order no", "string", "Rossell's internal sales order.", "SO-SMPL-30011", [`${SO}:Sales Order`], [BUY, FIN]),
  e("Customer order", "Customer PO", "string", "The customer's purchase order to Rossell. One PO can carry many releases.", "CPO-SMPL-4501", [`${SO}:Customer PO`], [BUY, FIN]),
  e("Customer order", "PO revision", "string", "Revision of the customer PO; which one is authoritative is still open (Q21).", "C", [`${SO}:PO Revision`], [BUY]),
  e("Customer order", "Release / line", "string", "Release or schedule line under the customer PO.", "1/2", [`${SO}:Release / Line`], [BUY, PPC]),
  e("Customer order", "Blanket qty", "number", "Total quantity on a blanket order.", "1,000", [`${SO}:Blanket Qty`], [BUY]),
  e("Customer order", "Backlog qty", "number", "Ordered and not yet shipped: firm demand still to build.", "380", [`${SO}:Backlog Qty`], [BUY, PPC]),
  e("Customer order", "Request date", "date", "Date the customer asked for.", "2027-03-31", [`${SO}:Request Date`], [BUY, PPC]),
  e("Customer order", "Committed ship date", "date", "Date Rossell committed to the customer.", "2027-03-24", [`${SO}:Promise Date`], [BUY, PPC]),
  e("Customer order", "Shipped qty", "number", "Quantity already shipped.", "620", [`${SO}:Shipped Qty`], [BUY, FIN]),
  e("Customer order", "Last ship date", "date", "Date of the last shipment against the line.", "2026-10-30", [`${SO}:Last Ship Date`], [FIN]),
  e("Forecast line", "File date", "date", "Date the forecast file was downloaded (daily for semiconductor customers).", "2026-11-10", [`${FC}:File Date`], [BUY]),
  e("Forecast line", "Customer part no", "string", "The customer's number for the finished good; mapped to Rossell's wire bundle.", "CPN-SMPL-8821", [`${FC}:Customer Part No`], [BUY]),
  e("Forecast line", "Bucket start", "date", "Start of the forecast period.", "2027-06-01", [`${FC}:Bucket Start`], [BUY]),
  e("Forecast line", "Forecast qty", "number", "Forecast quantity in the bucket; eligible forecast is exploded through the BOM.", "260", [`${FC}:Forecast Qty`], [BUY, SRC]),
  e("Forecast line", "Label", "string", "Customer nomenclature; ignored in consolidation.", "Plan", [`${FC}:Label`], [BUY]),
  e("Forecast line", "Months out", "number", "Months between file date and bucket.", "7", [`${FC}:Months Out`], [BUY]),
  e("Forecast line", "In exclusion horizon", "boolean", "True when the bucket falls inside the configurable exclusion horizon.", "false", [`${FC}:In Exclusion Horizon`], [BUY]),

  /* ---------- Projects & BOM ---------- */
  e("Project", "Project code", "string", "Project identifier defined inside Rossell's application. A customer can run several projects at once; semiconductor work has no project layer.", "PRJ-SMPL-07", [`${AS}:Project code`, `${OO}:Project Code`, `${MP}:PROJECT`, `${BOM}:Project`, `${SO}:Project`], [PPC, BUY]),
  e("Project", "Project name", "string", "Descriptive project name shown next to the code.", "Project A (sample)", [`${AS}:Project`, `${OO}:Project`], [PPC, BUY]),
  e("Project", "Project list", "string", "Every project that uses the item, in one cell.", "PRJ-SMPL-07; PRJ-SMPL-11", [`${RO}:Project List`, `${USR}:Projects`], [BUY]),
  e("Wire bundle", "Wire bundle no", "string", "The finished good (wire bundle) Rossell builds. Forecasts and sales orders point to it after customer part mapping.", "WB-SMPL-011", [`${BOM}:Wire Bundle`, `${FC}:FG Part No`, `${SO}:FG Part No`], [ENG, PPC, BUY]),
  e("Wire bundle", "Wire bundle description", "string", "Business description of the wire bundle.", "Wire bundle A (sample)", [`${BOM}:Description`], [ENG, PPC]),
  e("BOM revision", "Latest revision", "string", "Most recent engineering revision of the wire bundle's BOM; the rule that decides 'latest' is still open.", "C", [`${BOM}:Latest Revision`], [ENG, PPC]),
  e("BOM revision", "Default revision", "string", "Base revision of the BOM; its role is still being confirmed.", "A", [`${BOM}:Default Revision`], [ENG]),
  e("BOM line", "Quantity per bundle", "number", "How much of the raw material one wire bundle needs.", "48", [`${BOM}:Quantity`], [ENG, BUY, PPC]),
  e("BOM line", "UOM / quantity", "enum", "Unit (or unit-and-quantity) the BOM quantity is expressed in; may need splitting.", "EACH", [`${BOM}:UOM/Qty`], [ENG, BUY]),
  e("BOM line", "Operation", "string", "Operation the material is used in; meaning to be confirmed.", "OP-20", [`${BOM}:Operation`], [ENG, PPC]),
  e("BOM line", "Batch size", "number", "Batch size on the BOM line; meaning to be confirmed.", "10", [`${BOM}:Batch Size`], [ENG, PPC]),

  /* ---------- Materials ---------- */
  e("Material", "RT part number", "string", "Rossell's internal part number. Item, material and part mean the same thing. Unique; leading zeros need not be kept (Rossell).", "RT-SMPL-0021", [`${AS}:Item No`, `${EX}:Item #`, `${MA}:Item Number`, `${BOM}:Raw Material`, `${OO}:RT Part Number`, `${RO}:RT Part Number`, `${MP}:RT_PART_NO`, `${GRN}:RT Part Number`, `${PDU}:RT Part Number`, `${MRP}:RT Part Number`, `${SRCG}:Item No`], [BUY, PPC, ENG, SCM, STO]),
  e("Material", "Description", "string", "Business description of the item, kept as supplied.", "Connector, circular, shell 13 (sample)", [`${AS}:Description`, `${EX}:Description`, `${MA}:Description`, `${OO}:Item Desc`, `${MP}:ITEM_DESCRIPTION`], [BUY, PPC, STO]),
  e("Material", "Extended description", "string", "Longer description beyond the primary one.", "Circular connector, shell 13, receptacle (sample)", [`${EX}:Ext Description`], [BUY, ENG]),
  e("Material", "OEM part number", "string", "Manufacturer's (or supplier's) part number behind the RT part.", "OEM-SMPL-A01", [`${AS}:OEM PartNo`, `${BOM}:OEM Part No`, `${OO}:OEM Part number`, `${RO}:OEM Part Number`, `${MP}:OEM_PART_NO`, `${SRCG}:MPN`], [BUY, SRC, ENG]),
  e("Material", "Class", "enum", "Item class. Rossell's codes: FG finished goods, RM raw material, PS pan stock, PK packaging, SF semi-finished.", "RM", [`${EX}:Class`, `${MA}:Class`, `${BOM}:Class`, `${RO}:Class`, `${MP}:CLASS`], [BUY, PPC, ENG]),
  e("Material", "Material type", "enum", "Type of material in the stock report; how it relates to Class is to be confirmed.", "RM", [`${AS}:Material Type`], [STO, BUY]),
  e("Material", "Item revision", "string", "Revision of the item itself.", "B", [`${EX}:Revision`, `${RO}:Revision`], [ENG, BUY]),
  e("Material", "VMI", "enum", "Whether the item is held under vendor-managed inventory (code set or quantity to be confirmed).", "N", [`${EX}:VMI`], [BUY, SCM]),
  e("Material", "MPS indicator", "enum", "Master production schedule indicator for the item.", "N", [`${EX}:MPS`], [PPC]),
  e("Material", "Shelf life applies", "enum", "Whether the item is shelf-life controlled.", "No", [`${MP}:SHELF_LIFE_APPLICABILITY`], [STO, QA]),
  e("Unit of measure", "Stock UOM", "enum", "Unit stock quantities are expressed in. Rossell's list: EACH, FT, ML, KG, GM, MTR, OZ, LBS, SO, GAL, LTR, IN.", "EACH", [`${AS}:Stock UOM`, `${EX}:UOM`, `${MP}:UOM`], [STO, BUY]),
  e("Unit of measure", "Native UOM", "enum", "The item's native unit in the reorder report; whether it equals stock UOM is to be confirmed.", "FT", [`${RO}:Native UOM`], [BUY]),
  e("Unit of measure", "Purchase UOM", "enum", "Unit used on the purchase order; can differ from stock UOM.", "MTR", [`${AS}:Purchase UOM`, `${OO}:UOM`, `${RO}:PO UOM`, `${GRN}:UOM`], [BUY, STO]),
  e("Unit of measure", "Conversion UOM", "enum", "Unit used when converting purchase to stock quantities.", "FT", [`${AS}:Conv UOM`], [STO, BUY]),
  e("Unit of measure", "Conversion value", "number", "Conversion factor between purchase and stock units (direction to be confirmed).", "3.281", [`${AS}:Conv Value`], [STO, BUY]),
  e("Planning parameters", "Lead time (days)", "number", "Lead time in days (calendar or working days: to be confirmed).", "84", [`${EX}:Lead Days`, `${SRCG}:Lead Time (days)`], [BUY, PPC]),
  e("Planning parameters", "Lead time (weeks)", "number", "Lead time in weeks used by the reorder report.", "12", [`${RO}:Lead Weeks`], [BUY]),
  e("Planning parameters", "Reorder level", "number", "Stock level at which the item should be reordered.", "30", [`${RO}:Reorder Level`, `${MP}:REORDER_POINT`], [BUY]),
  e("Planning parameters", "Reorder quantity", "number", "Quantity to reorder when the level is reached.", "50", [`${RO}:Reorder Qunatity`], [BUY]),
  e("Planning parameters", "Safety stock", "number", "Buffer quantity kept aside for the item.", "20", [`${RO}:Safety Stock`, `${MP}:SAFETY_STOCK`], [BUY, PPC]),
  e("Organisation", "Division", "string", "Business division responsible for the item or transaction.", "Division A (sample)", [`${EX}:Division`, `${RO}:Div`, `${RO}:Buyers`], [BUY, FIN]),
  e("Organisation", "Plant", "string", "Plant / site identifier (EPlant in IQMS).", "PLANT-SMPL-1", [`${EX}:EPlant ID`, `${USR}:Plant`], [PPC, STO]),
  e("Organisation", "Company", "string", "Company or legal entity code.", "CO-SMPL-01", [`${EX}:Company`], [FIN]),
  e("Organisation", "Cost object", "string", "Accounting or cost-allocation object.", "CC-SMPL-410", [`${EX}:Cost Object`], [FIN]),

  /* ---------- Requirements & planning ---------- */
  e("Exception", "Total exception qty", "number", "Quantity the ERP flags as an exception (shortage) for the item.", "74", [`${EX}:Total Exception`], [BUY]),
  e("Exception", "Left to order", "number", "Quantity still to be ordered after open POs are counted.", "34", [`${EX}:Left To Order`], [BUY]),
  e("Must-arrive requirement", "Must order date", "date", "Date by which the order must be placed.", "2026-11-16", [`${MA}:Must Order`], [BUY]),
  e("Must-arrive requirement", "Must arrive date", "date", "Date by which the material must be received.", "2027-02-08", [`${MA}:Must Arrive`], [BUY, SCM]),
  e("Must-arrive requirement", "Required qty", "number", "Quantity the dated requirement is for.", "34", [`${MA}:Quantity`], [BUY]),
  e("Planner line", "Qty required", "number", "Quantity required for the item and project.", "16", [`${MP}:QTY_REQUIRED`], [PPC, BUY]),
  e("Planner line", "Past due (days)", "number", "Days the requirement is past its due date.", "12", [`${MP}:PAST_DUE`], [PPC, BUY]),
  e("Planner line", "Month", "string", "Month attached to the planner line; meaning to be confirmed.", "Dec-2026", [`${MP}:MONTH`], [PPC]),
  e("Planner line", "Deficiency", "number", "Quantity still to be procured.", "8", [`${MP}:DEFICIENCY`], [BUY, PPC]),
  e("Planner line", "Pending order qty", "number", "Quantity still to be ordered from the supplier.", "40", [`${MP}:TOTAL_PENDING_ORD_QTY`], [BUY]),
  e("Planner line", "Remarks", "string", "Free-text comment or exception note.", "Partial delivery expected", [`${MP}:REMARKS`], [BUY, PPC]),
  e("Planner line", "Status upload date", "date", "Date the status was uploaded into the system.", "2026-11-12", [`${MP}:STATUS_UPLOAD_DT`], [PPC]),
  e("Reorder line", "RMLT demand", "number", "Demand figure in the reorder report; meaning to be confirmed.", "74", [`${RO}:RMLT Demand`], [BUY]),
  e("Reorder line", "Total cycle demand", "number", "Demand across the cycle; meaning to be confirmed.", "120", [`${RO}:Total Cycle Demand`], [BUY]),
  e("Reorder line", "Material status flag", "enum", "Status the report gives the item; values to be confirmed.", "Short", [`${RO}:Material Status Flag`], [BUY]),
  e("Reorder line", "Pull-in qty", "number", "Quantity Rossell pulls back from the supplier; reduces the PO quantity.", "150", [`${RO}:Pullin Qty`], [BUY]),
  e("Reorder line", "Check", "string", "Buyer's review indicator on the working sheet.", "Review", [`${RO}:Check`], [BUY]),
  e("Reorder line", "Exception qty", "number", "Quantity that does not match and needs reordering (buyer's working sheet).", "34", [`${RO}:Expection Qty`], [BUY]),
  e("Reorder line", "Revised material status", "enum", "Buyer's revised status for the item.", "Short", [`${RO}:Revised Material status`], [BUY]),
  e("Reorder line", "ISA qty", "number", "Quantity in the ISA column; meaning to be confirmed.", "10", [`${RO}:ISA Qty`], [BUY]),
  e("Reorder line", "TBO qty", "number", "Quantity in the TBO column; meaning to be confirmed.", "24", [`${RO}:TBO Qty`], [BUY]),
  e("Reorder line", "Revised pull-in", "number", "Buyer's revised pull-in quantity.", "150", [`${RO}:Revised Pullin`], [BUY]),
  e("Reorder line", "Shortage month", "string", "Month the item runs short, counting open purchase orders.", "Feb-2027", [`${RO}:Shortage Month considering OPOR`], [BUY]),
  e("Planning run", "Run ID", "string", "One planning run: its inputs, the rule versions used and its results are kept together.", "RUN-SMPL-0412", [], [BUY, PPC, IT]),
  e("Planning run", "Exclusion horizon used", "number", "Forecast exclusion horizon the run applied, kept for audit.", "2", [], [BUY, IT]),
  e("Planning run", "Net requirement", "number", "Consolidated demand minus free stock and in-flight supply, per item, plant and date.", "34", [], [BUY, PPC]),

  /* ---------- Purchasing ---------- */
  e("Purchase requisition", "PR no", "string", "Purchase requisition behind the PO line; the entity it identifies is to be confirmed.", "PR-SMPL-3301", [`${OO}:PR No`], [BUY]),
  e("Supplier PO line", "PO number", "string", "Rossell's supplier purchase order.", "PO-SMPL-77801", [`${OO}:PO No`, `${RO}:PO Number`, `${AS}:PONO`, `${GRN}:PO No`, `${PDU}:PO No`, `${MRP}:PO No`], [BUY, SCM, STO]),
  e("Supplier PO line", "PO date", "date", "Date the PO was raised.", "2026-08-20", [`${OO}:Po Date`], [BUY]),
  e("Supplier PO line", "PO line", "number", "Line on the PO; a PO has many lines.", "1", [`${OO}:PO line Number`, `${GRN}:PO line Number`, `${PDU}:PO line Number`, `${MRP}:PO line Number`], [BUY, SCM]),
  e("Supplier PO line", "Unique release ID", "string", "Release under a PO line. Promise dates and changes are tracked against it; how it relates to PO and line is open (Q20).", "REL-SMPL-000101", [`${OO}:Unique Rel ID`, `${PDU}:Unique Rel ID`, `${MRP}:Unique Rel ID`], [BUY, SCM, IT]),
  e("Supplier PO line", "Ordered qty", "number", "Quantity ordered on the line.", "40", [`${OO}:Qty.`], [BUY]),
  e("Supplier PO line", "Line value", "number", "Rate × quantity.", "3,860", [`${OO}:Value`], [BUY, FIN]),
  e("Supplier PO line", "Received qty", "number", "Quantity already received against the line.", "20", [`${OO}:Received Qty`], [BUY, STO]),
  e("Supplier PO line", "Received value", "number", "Value of the quantity received.", "1,930", [`${OO}:Received Value`], [FIN]),
  e("Supplier PO line", "Balance qty", "number", "Quantity still to come: the in-flight supply planning nets against demand.", "20", [`${OO}:Bal. Qty.`, `${PDU}:Bal. Qty.`, `${MRP}:Bal. Qty.`], [BUY, PPC]),
  e("Supplier PO line", "Balance value", "number", "Value of the balance still to come.", "1,930", [`${OO}:Bal. Value`], [FIN]),
  e("Supplier PO line", "Open order value (USD)", "number", "Balance value converted to USD (working sheet).", "1,930", [`${OO}:Open Order Value In USD`], [FIN, BUY]),
  e("Supplier PO line", "Required date", "date", "Date Rossell needs the material from the supplier.", "2026-11-24", [`${OO}:Req.date`, `${PDU}:Req.date`], [BUY, SCM]),
  e("Supplier PO line", "Promise date", "date", "Date the supplier committed to. Becomes the ETA; every change is kept as history.", "2026-12-05", [`${OO}:Promise.Date`, `${MP}:EXPECTED_DATE`, `${PDU}:Promise.Date`, `${MRP}:Promise.Date`], [BUY, SCM, PPC]),
  e("Supplier PO line", "Month", "string", "Month attached to the line in the working sheet; meaning to be confirmed.", "Dec-2026", [`${OO}:Month`], [BUY]),
  e("Supplier PO line", "Acknowledged", "enum", "Whether the supplier acknowledged the PO (to be confirmed).", "Yes", [`${OO}:Acknowledged`], [BUY, SCM]),
  e("Supplier PO line", "PO type", "enum", "Type of PO; values to be confirmed.", "RAW MATERIAL", [`${OO}:PO Type`], [BUY, FIN]),
  e("Supplier PO line", "Line status", "enum", "Status of the PO line; values to be confirmed.", "Open", [`${OO}:Status`], [BUY]),
  e("Supplier", "Supplier name", "string", "Supplier (vendor) the item is bought from; name or code, to be confirmed per report.", "Supplier A (sample)", [`${OO}:Supplier Name`, `${RO}:Vendor Name`, `${AS}:Vendor`, `${GRN}:Supplier`, `${PDU}:Supplier Name`, `${SRCG}:Supplier`, `${VM}:Vendor Name`, `${CON}:Vendor Name`], [BUY, SCM]),
  e("Supplier", "Vendor code", "string", "Supplier identifier in IQMS.", "V-SMPL-001", [`${EX}:Vendor #`, `${VM}:Vendor Code`, `${CON}:Vendor Code`], [BUY, SCM]),
  e("Supplier", "Manufacturer", "string", "Approved manufacturer of the part.", "Manufacturer A (sample)", [`${SRCG}:Manufacturer`], [SRC]),
  e("Supplier", "Category", "enum", "Manufacturer, distributor, special process, logistics or service.", "Distributor", [`${VM}:Category`], [SRC]),
  e("Supplier", "Country", "string", "Supplier country.", "USA", [`${VM}:Country`], [SRC]),
  e("Supplier", "Approval status", "enum", "Approved, conditional or disqualified.", "Approved", [`${VM}:Approval Status`], [SRC, QA]),
  e("Supplier", "Certifications", "string", "AS9100, AS9120, ISO 9001, NADCAP.", "AS9120, ISO 9001", [`${VM}:Certifications`], [SRC, QA]),
  e("Supplier", "Approved since", "date", "First approval date.", "2016-05-01", [`${VM}:Approved Since`], [SRC]),
  e("Supplier", "Next audit", "date", "Next supplier audit due.", "2027-05-01", [`${VM}:Next Audit`], [QA]),
  e("Supplier", "Payment terms", "string", "Agreed payment terms.", "Net 60", [`${VM}:Payment Terms`], [FIN]),
  e("Cost & price", "Unit price", "number", "Price per unit on the purchase (PO rate).", "96.5", [`${OO}:Rate.`, `${AS}:Purchase Unit Price`, `${SRCG}:Price`], [BUY, FIN]),
  e("Cost & price", "Last buy price", "number", "Price paid on the most recent PO for the item.", "96.5", [`${RO}:Last Buy Price`], [BUY]),
  e("Cost & price", "Actual cost", "number", "Cost of the stock under the inventory costing method (per unit or total: to be confirmed).", "96.5", [`${AS}:Actual Cost`], [FIN]),
  e("Cost & price", "Currency", "enum", "Currency of the price or PO.", "USD", [`${AS}:Currency`, `${OO}:Currency.`, `${RO}:Currency`, `${SRCG}:Currency`], [BUY, FIN]),
  e("Cost & price", "Currency description", "string", "Name of the currency.", "US Dollar", [`${AS}:Currency Description`], [FIN]),
  e("Cost & price", "Exchange rate", "number", "Rate to the reporting currency (direction to be confirmed).", "84.1", [`${AS}:Exchange Rate`], [FIN]),
  e("Cost & price", "Price break qty", "number", "Quantity a price applies from.", "1,000", [`${SRCG}:Price Break Qty`], [SRC]),
  e("Cost & price", "Price valid from", "date", "Start of price validity.", "2026-04-01", [`${SRCG}:Valid From`], [SRC]),
  e("Cost & price", "Price valid to", "date", "End of price validity.", "2027-03-31", [`${SRCG}:Valid To`], [SRC]),
  e("Cost & price", "Source type", "enum", "Manufacturer, authorised distributor or customer-directed.", "Authorised distributor", [`${SRCG}:Source Type`], [SRC]),
  e("Next scheduled delivery", "Next schedule qty", "number", "Quantity expected in the next delivery.", "20", [`${MP}:NEXT_SCHEDULE_QTY`], [BUY, PPC]),
  e("Next scheduled delivery", "Next schedule date", "date", "Date of the next expected delivery.", "2026-12-05", [`${MP}:NEXT_SCHEDULE_DATE`], [BUY, PPC]),
  e("Next scheduled delivery", "Next schedule supplier", "string", "Supplier of the next delivery.", "Supplier B (sample)", [`${MP}:NEXT_SCHEDULE_SUPPLIER`], [BUY]),
  e("Next scheduled delivery", "Next schedule PO", "string", "PO the next delivery comes on.", "PO-SMPL-77801", [`${MP}:NEXT_SCHEDULE_PO_NO`], [BUY]),
  e("Next scheduled delivery", "Current status", "enum", "Status of the PO or delivery; values to be confirmed.", "Open", [`${MP}:CURRENT_STATUS`], [BUY, SCM]),
  e("Promise date", "Promise qty", "number", "Quantity the supplier committed for the date (partials allowed).", "200", [`${PDU}:Promise Qty`], [SCM, BUY]),
  e("Promise date", "Change type", "enum", "New, pull-in, push-out or split.", "Push-out", [`${PDU}:Change Type`], [SCM, BUY]),
  e("Promise date", "Source", "enum", "Where the date came from: email, portal or phone.", "Email", [`${PDU}:Source`], [SCM]),
  e("Promise date", "Updated by", "string", "Buyer or SCM user who entered it.", "BYR-01", [`${PDU}:Updated By`], [SCM, IT]),
  e("MRP message", "New need date", "date", "Date MRP now says the material is needed.", "2026-11-24", [`${MRP}:New Need Date`], [BUY]),
  e("MRP message", "MRP message", "enum", "Expedite, de-expedite, cancel or OK.", "Expedite", [`${MRP}:MRP Message`], [BUY]),
  e("MRP message", "Days shift", "number", "New need date minus the current date on the PO.", "-11", [`${MRP}:Days Shift`], [BUY]),

  /* ---------- Stores & receipts ---------- */
  e("Receipt", "Receipt no", "string", "Goods receipt (GRN) document number; one item can have several.", "RCPT-SMPL-91003", [`${AS}:Receiptno`, `${GRN}:GRN No`], [STO, SCM]),
  e("Receipt", "Receipt date", "date", "Date goods were received (the planner report shows the latest).", "2026-11-07", [`${MP}:LAST_RECEIVED_DATE`, `${GRN}:GRN Date`], [STO, SCM]),
  e("Receipt", "Received qty", "number", "Quantity received (the planner report shows the latest receipt).", "20", [`${MP}:LAST_RECEIVED_QTY`, `${GRN}:Received Qty`], [STO, SCM]),
  e("Receipt", "Received batch", "string", "Batch of the latest receipt; meaning to be confirmed.", "L-SAMPLE-2310", [`${MP}:LAST_RECEIVED_BATCH`], [STO]),
  e("Receipt", "Accepted qty", "number", "Quantity accepted by incoming QA.", "20", [`${GRN}:Accepted Qty`], [QA, STO]),
  e("Receipt", "Rejected qty", "number", "Quantity rejected at incoming QA.", "0", [`${GRN}:Rejected Qty`], [QA]),
  e("Receipt", "Posting status", "enum", "Posted, unposted or void. A receipt is not available stock until its status allows it (Q22).", "Posted", [`${GRN}:Posting Status`], [STO, SCM]),
  e("Receipt", "CoC reference", "string", "Certificate of conformance reference.", "COC-SMPL-5540", [`${GRN}:CoC Ref`], [QA]),
  e("Stock lot", "Location", "string", "Warehouse, store or bin where the stock sits.", "WH1-C11-04", [`${AS}:Location`, `${GRN}:Location`], [STO]),
  e("Stock lot", "Zone", "string", "Zone within the location.", "Z-C", [`${AS}:Zone`], [STO]),
  e("Stock lot", "Lot no", "string", "Lot or batch for traceability.", "L-SAMPLE-2310", [`${AS}:LOTNO`, `${GRN}:Lot No`], [STO, QA]),
  e("Stock lot", "Date of manufacture", "date", "Manufacture date of the lot (DOM).", "2026-03-12", [`${AS}:DOM`], [QA, STO]),
  e("Stock lot", "Date of expiry", "date", "Expiry date of the lot (DOE), for shelf-life control.", "2028-11-02", [`${AS}:DOE`], [QA, STO]),
  e("Stock & supply position", "On hand", "number", "Quantity physically in stock, before allocations.", "46", [`${AS}:On Hand Stock`, `${EX}:On Hand`, `${RO}:ON Hand`, `${MP}:STOCK`], [BUY, PPC, STO]),
  e("Stock & supply position", "Available qty", "number", "On hand minus allocations and restrictions: what planning may use.", "24", [`${AS}:Avl Qty`], [BUY, PPC]),
  e("Stock & supply position", "Stores stock", "number", "Stock in stores, across locations.", "24", [`${MP}:STOCK_STORES`], [STO, PPC]),
  e("Stock & supply position", "Pan stock", "number", "Stock held as pan stock (class PS); meaning to be confirmed.", "600", [`${MP}:STOCK_PAN_STOCK`], [STO, PPC]),
  e("Stock & supply position", "Kitting stock", "number", "Stock already kitted and ready for production.", "10", [`${MP}:STOCK_KITTING`], [PPC, STO]),
  e("Stock & supply position", "Inward QC stock", "number", "Stock in incoming quality check, not yet usable.", "12", [`${MP}:STOCK_INWARD_QC`], [QA, STO]),
  e("Stock & supply position", "Qty on open POs", "number", "Total quantity on open supplier POs for the item.", "40", [`${EX}:Total Quantity on PO's`, `${RO}:Total Qty ONOrder`], [BUY]),
  e("Stock & supply position", "Open order in native UOM", "number", "Open PO quantity converted to the item's native unit.", "1,640.5", [`${RO}:Open Order In Native UOM`], [BUY]),
  e("Stock & supply position", "Qty on work orders", "number", "Total quantity required by work orders for the item.", "120", [`${EX}:Total Quantity on Work Orders`], [PPC, BUY]),

  /* ---------- Production & billing ---------- */
  e("Work order", "Work order no", "string", "Manufacturing work order the stock is linked to.", "WO-SMPL-50112", [`${AS}:Workorder No`], [PPC, STO]),
  e("Allocation", "Hard allocated", "number", "Quantity already allocated that cannot be re-allocated.", "8", [`${MP}:HARD_ALLOCATED`], [PPC, BUY]),
  e("Kit", "Kit start date", "date", "Date kitting starts for a wire bundle build (current work, project by project).", "2026-12-01", [], [PPC, SCM]),
  e("Kit", "Clear to build", "boolean", "Every line of the kit is covered by stock or confirmed supply.", "false", [], [PPC]),
  e("Invoice", "Invoice no", "string", "Invoice raised against the customer PO; one PO can have many invoices.", "INV-SMPL-2201", [], [FIN]),

  /* ---------- People & access ---------- */
  e("Buyer", "Buyer", "string", "Buyer responsible for the item or PO (code in the exception report, name in the open-order report).", "BYR-01", [`${EX}:Buyer Code`, `${OO}:Buyer`], [BUY, SCM]),
  e("User", "User ID", "string", "Login ID of a Rossell user.", "u.sample01", [`${USR}:User ID`], [IT]),
  e("User", "Name", "string", "Display name.", "Sample User 01", [`${USR}:Name`], [IT]),
  e("User", "Department", "enum", "SCM, PPC, Engineering, Sourcing, IT, Finance…", "SCM", [`${USR}:Department`], [IT]),
  e("User", "Designation", "enum", "VP … Associate Engineer.", "Manager", [`${USR}:Designation`], [IT]),
  e("User", "Role", "enum", "Buyer, planner, SCM, viewer or admin: drives access.", "Buyer", [`${USR}:Role`], [IT]),
  e("User", "Active", "boolean", "Account active.", "true", [`${USR}:Active`], [IT]),
  e("Supplier contact", "Contact role", "enum", "Sales, order desk, expediting or quality.", "Order desk", [`${CON}:Contact Role`], [SCM]),
  e("Supplier contact", "Email", "string", "Contact email for promise-date requests.", "orders@supplier-a.example", [`${CON}:Email`], [SCM, BUY]),
  e("Supplier contact", "Phone", "string", "Contact phone.", "+1-555-0100", [`${CON}:Phone`], [SCM]),
  e("Supplier contact", "Time zone", "string", "Supplier time zone.", "America/Chicago", [`${CON}:Time Zone`], [SCM]),
  e("Supplier contact", "Preferred channel", "enum", "Email, portal or phone.", "Email", [`${CON}:Preferred Channel`], [SCM]),
];

export const dictionaryEntities = Array.from(new Set(dataDictionary.map((d) => d.entity)));

export const dictionaryNote = {
  text: "Column names come from Rossell's files where they exist; field names, definitions and how columns are grouped into entities are our model, to be validated with Rossell. Examples are samples.",
  sources: ["FILES", "WS", "RULES"],
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
  { id: "customer", label: "Customer & demand", entities: ["Customer", "Customer order", "Forecast line"] },
  { id: "engineering", label: "Projects & BOM", entities: ["Project", "Wire bundle", "BOM revision", "BOM line"] },
  { id: "material", label: "Materials", entities: ["Material", "Unit of measure", "Planning parameters", "Organisation"] },
  { id: "demand", label: "Requirements & planning", entities: ["Exception", "Must-arrive requirement", "Planner line", "Reorder line", "Planning run"] },
  { id: "purchasing", label: "Purchasing", entities: ["Purchase requisition", "Supplier PO line", "Supplier", "Cost & price", "Next scheduled delivery", "Promise date", "MRP message"] },
  { id: "stores", label: "Stores & receipts", entities: ["Receipt", "Stock lot", "Stock & supply position"] },
  { id: "production", label: "Production & billing", entities: ["Work order", "Allocation", "Kit", "Invoice"] },
  { id: "access", label: "People & access", entities: ["Buyer", "User", "Supplier contact"] },
];

export function entityGroupOf(entity: string): DictionaryEntityGroup | undefined {
  return dictionaryEntityGroups.find((g) => g.entities.includes(entity));
}

/* ---------- entity relationship map (customer → invoice) ---------- */

export interface EntityMapNode {
  id: string;
  label: string;
  /** Dictionary entities this node stands for (clicking the node filters to them). */
  entities: string[];
  /** Relationship to the next node in the chain, in plain words. */
  next?: string;
}

/** The chain every order walks through, with the entities Rossell's files carry at each step. */
export const entityMap: EntityMapNode[] = [
  { id: "customer", label: "Customer", entities: ["Customer"], next: "orders and forecasts" },
  { id: "demand", label: "Customer order & forecast", entities: ["Customer order", "Forecast line"], next: "for a" },
  { id: "project", label: "Project", entities: ["Project"], next: "builds" },
  { id: "wire-bundle", label: "Wire bundle", entities: ["Wire bundle"], next: "defined by" },
  { id: "bom-revision", label: "BOM revision", entities: ["BOM revision"], next: "1 : many" },
  { id: "bom-line", label: "BOM line", entities: ["BOM line"], next: "calls for" },
  { id: "material", label: "Material", entities: ["Material", "Unit of measure", "Planning parameters", "Organisation"], next: "netted into" },
  { id: "requirement", label: "Requirement", entities: ["Exception", "Must-arrive requirement", "Planner line", "Planning run"], next: "triggers" },
  { id: "reorder", label: "Reorder", entities: ["Reorder line"], next: "raised as" },
  { id: "purchase-order", label: "Purchase order", entities: ["Purchase requisition", "Supplier PO line", "Supplier", "Cost & price", "Next scheduled delivery", "Promise date", "MRP message"], next: "received as" },
  { id: "receipt", label: "Receipt", entities: ["Receipt"], next: "becomes" },
  { id: "stock", label: "Stock", entities: ["Stock lot", "Stock & supply position"], next: "reserved by" },
  { id: "allocation", label: "Allocation & work order", entities: ["Allocation", "Work order"], next: "fills" },
  { id: "kit", label: "Kit", entities: ["Kit"], next: "shipped and billed" },
  { id: "invoice", label: "Invoice", entities: ["Invoice"] },
];

/** Stable id for a dictionary field (search items, overlays). */
export const fieldId = (d: Pick<DictionaryEntry, "entity" | "field">) =>
  `${d.entity}-${d.field}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The dictionary field that holds a file's column, if any. */
const fieldByColumn = new Map<string, DictionaryEntry>();
for (const d of dataDictionary) for (const c of d.columns) fieldByColumn.set(`${c.file}\u0000${c.column}`, d);
export const fieldForColumn = (fileId: string, column: string) => fieldByColumn.get(`${fileId}\u0000${column}`);

/* ---------- build-time checks ---------- */

/** Throws (failing `pnpm build`) when the files and the crosswalk disagree. */
export function validateDataFiles() {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const f of files) {
    if (ids.has(f.id)) errors.push(`duplicate file id ${f.id}`);
    ids.add(f.id);
    if (!f.sheets.length) errors.push(`${f.id}: no sheets`);
    for (const s of f.sheets) {
      const names = s.columns.map((c) => c.name);
      const dup = names.filter((n, i) => names.indexOf(n) !== i);
      if (dup.length) errors.push(`${f.id} / ${s.name}: duplicate columns ${dup.join(", ")}`);
      for (const r of s.sampleRows) for (const k of Object.keys(r)) if (!names.includes(k)) errors.push(`${f.id} / ${s.name}: sample value for unknown column "${k}"`);
    }
  }
  const used = new Map<string, string>();
  for (const d of dataDictionary) {
    if (!entityGroupOf(d.entity)) errors.push(`entity "${d.entity}" is in no group`);
    for (const c of d.columns) {
      const f = getFile(c.file);
      const key = `${c.file}:${c.column}`;
      if (!f) errors.push(`${d.entity} › ${d.field}: unknown file ${c.file}`);
      else if (!fileColumns(f).some((x) => x.name === c.column)) errors.push(`${d.entity} › ${d.field}: ${f.name} has no column "${c.column}"`);
      if (used.has(key)) errors.push(`column ${key} is mapped twice (${used.get(key)} and ${d.entity} › ${d.field})`);
      used.set(key, `${d.entity} › ${d.field}`);
    }
  }
  for (const f of files) {
    if (f.basis !== "rossell-file") continue;
    for (const c of fileColumns(f)) if (!used.has(`${f.id}:${c.name}`)) errors.push(`${f.name}: column "${c.name}" is not in the dictionary`);
  }
  const fieldIds = dataDictionary.map(fieldId);
  const dupField = fieldIds.filter((x, i) => fieldIds.indexOf(x) !== i);
  if (dupField.length) errors.push(`duplicate dictionary fields: ${dupField.join(", ")}`);
  for (const n of entityMap) for (const en of n.entities) if (!dictionaryEntities.includes(en)) errors.push(`entity map node ${n.id}: unknown entity "${en}"`);
  if (errors.length) throw new Error(`Data files / dictionary are inconsistent:\n- ${errors.join("\n- ")}`);
}

validateDataFiles();
