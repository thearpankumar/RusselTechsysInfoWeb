// The 16 reports in Rossell's file catalogue (File Catalogue & Business Meaning, FILES; report inventory, WS).
// Seven reports arrived as Rossell's own column sheets: their column names are exact and their meanings, review
// priorities, questions and answers come from those sheets (content/fileColumns.ts). The other nine keep OUR modelled
// layout until Rossell sends the file. Every sample value below is invented, obviously generic, and labelled
// "sample" in the UI; nothing is copied from Rossell's files.
import type { DataFile, FileColumn, FileSheet } from "./types";
import {
  activeStockColumns,
  consolidatedBomColumns,
  exceptionColumns,
  materialPlannerColumns,
  mustArriveColumns,
  openOrderColumns,
  openOrderWorkingExtra,
  reorderColumns,
  reorderWorkingExtra,
} from "./fileColumns";

type Cell = string | number;

/** A modelled column (no Rossell sheet behind it yet). */
const c = (name: string, type: string, description: string): FileColumn => ({ name, type, description });

/** A sheet whose sample rows are written like a spreadsheet: one array per row, values in column order. */
function sheet(name: string, columns: FileColumn[], rows: Cell[][], extra: Partial<FileSheet> = {}): FileSheet {
  const sampleRows = rows.map((r, i) => {
    if (r.length !== columns.length) throw new Error(`files: sheet "${name}" sample row ${i + 1} has ${r.length} values for ${columns.length} columns`);
    return Object.fromEntries(columns.map((col, j) => [col.name, r[j]]));
  });
  return { name, columns, sampleRows, ...extra };
}

/** A second sheet built on the same rows as `base` (a buyer's working copy): shared columns keep their values. */
function derived(base: FileSheet, name: string, columns: FileColumn[], extra: Record<string, Cell[]>, note?: string): FileSheet {
  const sampleRows = base.sampleRows.map((r, i) =>
    Object.fromEntries(
      columns.map((col) => {
        const v = col.name in extra ? extra[col.name][i] : r[col.name];
        if (v === undefined) throw new Error(`files: sheet "${name}" has no sample value for "${col.name}" in row ${i + 1}`);
        return [col.name, v];
      })
    )
  );
  return { name, columns, sampleRows, note };
}

const byName = (cols: FileColumn[], name: string) => {
  const col = cols.find((x) => x.name === name);
  if (!col) throw new Error(`files: no column "${name}"`);
  return col;
};

/* ---------- 1. Active Stock (Rossell's sheet: RT_Active_Stock_Report_With_Value) ---------- */

const activeStock = sheet("Sheet1", activeStockColumns, [
  ["RT-SMPL-0021", "Connector, circular, shell 13 (sample)", "OEM-SMPL-A01", "RM", "EACH", "WH1-C11-04", "Z-C", 46, 24, 96.5, "WO-SMPL-50112", "L-SAMPLE-2310", "2026-03-12", "", "RCPT-SMPL-91003", "PO-SMPL-77801", "EACH", "EACH", 1, "Supplier B (sample)", 96.5, "PRJ-SMPL-07", "Project A (sample)", "USD", "US Dollar", 84.1],
  ["RT-SMPL-0034", "Contact, crimp socket, size 22 (sample)", "OEM-SMPL-B07", "RM", "EACH", "WH2-B02-01", "Z-B", 15000, 7500, 0.42, "WO-SMPL-50140", "L-SAMPLE-2412", "2026-02-20", "", "RCPT-SMPL-91001", "PO-SMPL-77822", "EACH", "EACH", 1, "Supplier A (sample)", 0.42, "PRJ-SMPL-11", "Project B (sample)", "USD", "US Dollar", 84.1],
  ["RT-SMPL-0005", "Wire, 22 AWG, white (sample)", "OEM-SMPL-C12", "RM", "FT", "WH1-A03-02", "Z-A", 4200, 2800, 0.31, "", "L-SAMPLE-2201", "2026-01-15", "", "RCPT-SMPL-91004", "PO-SMPL-77830", "MTR", "FT", 3.281, "Supplier A (sample)", 1.02, "PRJ-SMPL-07", "Project A (sample)", "USD", "US Dollar", 84.1],
  ["RT-SMPL-0052", "Heat-shrink sleeving, 1/4 in, black (sample)", "OEM-SMPL-D03", "PS", "MTR", "PAN-01", "Z-P", 650, 600, 1850, "", "L-SAMPLE-2601", "2025-11-03", "2028-11-02", "RCPT-SMPL-90877", "PO-SMPL-77830", "MTR", "MTR", 1, "Supplier A (sample)", 1850, "", "", "INR", "Indian Rupee", 1],
  ["RT-SMPL-0089", "Fibre-optic terminus (sample)", "OEM-SMPL-E11", "RM", "EACH", "QA-HOLD-01", "Z-Q", 30, 0, 38, "", "L-SAMPLE-2507", "2026-06-01", "", "RCPT-SMPL-91002", "PO-SMPL-77844", "EACH", "EACH", 1, "Supplier D (sample)", 38, "PRJ-SMPL-07", "Project A (sample)", "EUR", "Euro", 91.6],
]);

/* ---------- 2. Exception (Rossell's sheet) ---------- */

const exception = sheet("Data", exceptionColumns, [
  ["RT-SMPL-0021", "Connector, circular, shell 13 (sample)", 46, "RM", "B", "EACH", "Division A (sample)", 74, 34, "N", "PLANT-SMPL-1", "CC-SMPL-410", "BYR-01", "V-SMPL-002", "CO-SMPL-01", "Circular connector, shell 13, receptacle (sample)", "N", 84, 40, 120],
  ["RT-SMPL-0034", "Contact, crimp socket, size 22 (sample)", 15000, "RM", "A", "EACH", "Division A (sample)", 7000, 2000, "N", "PLANT-SMPL-2", "CC-SMPL-410", "BYR-02", "V-SMPL-001", "CO-SMPL-01", "Crimp socket contact, size 22 (sample)", "N", 56, 5000, 22000],
  ["RT-SMPL-0005", "Wire, 22 AWG, white (sample)", 4200, "RM", "A", "FT", "Division A (sample)", 1320, 320, "Y", "PLANT-SMPL-1", "CC-SMPL-420", "BYR-03", "V-SMPL-001", "CO-SMPL-01", "Hook-up wire, 22 AWG, white (sample)", "N", 28, 1000, 5520],
  ["RT-SMPL-0052", "Heat-shrink sleeving, 1/4 in, black (sample)", 650, "PS", "A", "MTR", "Division B (sample)", 0, 0, "N", "PLANT-SMPL-1", "CC-SMPL-430", "BYR-01", "V-SMPL-001", "CO-SMPL-01", "Heat-shrink sleeving, 2:1, black (sample)", "N", 21, 300, 400],
  ["RT-SMPL-0089", "Fibre-optic terminus (sample)", 30, "RM", "C", "EACH", "Division A (sample)", 30, 30, "N", "PLANT-SMPL-1", "CC-SMPL-410", "BYR-02", "V-SMPL-004", "CO-SMPL-01", "Fibre-optic terminus, multimode (sample)", "Y", 112, 0, 60],
]);

/* ---------- 3. Exception with Must Arrive By (Rossell's sheet) ---------- */

const mustArrive = sheet("Sheet1", mustArriveColumns, [
  ["RT-SMPL-0021", "RM", "Connector, circular, shell 13 (sample)", "2026-11-16", "2027-02-08", 34],
  ["RT-SMPL-0034", "RM", "Contact, crimp socket, size 22 (sample)", "2026-10-08", "2026-12-03", 2000],
  ["RT-SMPL-0005", "RM", "Wire, 22 AWG, white (sample)", "2026-11-10", "2026-12-08", 320],
  ["RT-SMPL-0089", "RM", "Fibre-optic terminus (sample)", "2026-09-14", "2027-01-04", 30],
  ["RT-SMPL-0021", "RM", "Connector, circular, shell 13 (sample)", "2026-12-07", "2027-03-01", 40],
]);

/* ---------- 4. RT Consolidated BOM (Rossell's sheet) ---------- */

const consolidatedBom = sheet("Sheet1", consolidatedBomColumns, [
  ["WB-SMPL-011", "C", "PRJ-SMPL-07", "A", 10, "OP-10", "Wire bundle A (sample)", "RT-SMPL-0005", "RM", "OEM-SMPL-C12", 200, "FT"],
  ["WB-SMPL-011", "C", "PRJ-SMPL-07", "A", 10, "OP-20", "Wire bundle A (sample)", "RT-SMPL-0034", "RM", "OEM-SMPL-B07", 48, "EACH"],
  ["WB-SMPL-011", "C", "PRJ-SMPL-07", "A", 10, "OP-20", "Wire bundle A (sample)", "RT-SMPL-0021", "RM", "OEM-SMPL-A01", 2, "EACH"],
  ["WB-SMPL-011", "C", "PRJ-SMPL-07", "A", 10, "OP-30", "Wire bundle A (sample)", "RT-SMPL-0052", "PS", "OEM-SMPL-D03", 1.5, "MTR"],
  ["WB-SMPL-011", "C", "PRJ-SMPL-07", "A", 10, "OP-30", "Wire bundle A (sample)", "RT-SMPL-0089", "RM", "OEM-SMPL-E11", 4, "EACH"],
]);

/* ---------- 5. RT Open Order (Rossell's sheets: Raw Data, Working Sheet, Summary) ---------- */

const openOrderRaw = sheet("Raw Data", openOrderColumns, [
  ["PR-SMPL-3301", "PO-SMPL-77801", "2026-08-20", "Supplier B (sample)", "RT-SMPL-0021", "OEM-SMPL-A01", "Project A (sample)", "", "Connector, circular, shell 13 (sample)", 40, 96.5, "USD", 3860, 20, 1930, 20, 1930, "2026-11-24", "2026-12-05", "Buyer 01 (sample)", "Yes", "EACH", 1, "REL-SMPL-000101", "RAW MATERIAL", "Open"],
  ["PR-SMPL-3302", "PO-SMPL-77822", "2026-09-02", "Supplier A (sample)", "RT-SMPL-0034", "OEM-SMPL-B07", "Project B (sample)", "", "Contact, crimp socket, size 22 (sample)", 5000, 0.42, "USD", 2100, 3000, 1260, 2000, 840, "2026-12-03", "2026-11-28", "Buyer 02 (sample)", "Yes", "EACH", 1, "REL-SMPL-000102", "RAW MATERIAL", "Partly received"],
  ["PR-SMPL-3303", "PO-SMPL-77830", "2026-10-01", "Supplier A (sample)", "RT-SMPL-0005", "OEM-SMPL-C12", "Project A (sample)", "", "Wire, 22 AWG, white (sample)", 1500, 1.02, "USD", 1530, 1000, 1020, 500, 510, "2026-12-08", "2026-12-08", "Buyer 03 (sample)", "Yes", "MTR", 1, "REL-SMPL-000103", "RAW MATERIAL", "Partly received"],
  ["PR-SMPL-3304", "PO-SMPL-77830", "2026-10-01", "Supplier A (sample)", "RT-SMPL-0052", "OEM-SMPL-D03", "", "", "Heat-shrink sleeving, 1/4 in, black (sample)", 300, 1850, "INR", 555000, 0, 0, 300, 555000, "2026-12-15", "", "Buyer 01 (sample)", "No", "MTR", 2, "REL-SMPL-000104", "RAW MATERIAL", "Open"],
  ["PR-SMPL-3305", "PO-SMPL-77844", "2026-10-12", "Supplier D (sample)", "RT-SMPL-0089", "OEM-SMPL-E11", "Project A (sample)", "", "Fibre-optic terminus (sample)", 30, 38, "EUR", 1140, 0, 0, 30, 1140, "2027-01-05", "2027-02-10", "Buyer 02 (sample)", "Yes", "EACH", 1, "REL-SMPL-000105", "RAW MATERIAL", "Open"],
]);

const openOrderWorkingCols = (() => {
  const i = openOrderColumns.findIndex((x) => x.name === "Promise.Date");
  return [...openOrderColumns.slice(0, i + 1), byName(openOrderWorkingExtra, "Month"), ...openOrderColumns.slice(i + 1), byName(openOrderWorkingExtra, "Open Order Value In USD")];
})();

const openOrderWorking = derived(
  openOrderRaw,
  "Working Sheet",
  openOrderWorkingCols,
  { Month: ["Dec-2026", "Nov-2026", "Dec-2026", "Dec-2026", "Feb-2027"], "Open Order Value In USD": [1930, 840, 510, 6599, 1243] },
  "The buyers' working copy of the raw data, with two added columns."
);

/** Summary pivot: open-order value in USD by category (rows) and month-end (columns); sample figures only. */
const SUMMARY_MONTHS = ["2026-10-31", "2026-11-30", "2026-12-31", "2027-01-31", "2027-02-28", "2027-03-31"];
const summaryColumns: FileColumn[] = [
  c("Sum of Open Order Value In USD", "string", "Row label: the category the open-order value is summed for."),
  c("Overdue", "number", "Open-order value already past its date."),
  ...SUMMARY_MONTHS.map((m) => c(m, "number", `Open-order value due in the month ending ${m}.`)),
  c("Grand Total", "number", "Row total across all months."),
];
const summaryRows: Cell[][] = (() => {
  const cats: [string, number[]][] = [
    ["CAPITAL", [0, 1200, 0, 4500, 0, 0, 0]],
    ["EXPENSE", [300, 800, 650, 400, 350, 300, 250]],
    ["OPEX", [0, 1500, 1500, 1500, 1500, 1500, 1500]],
    ["PACKING", [150, 900, 700, 650, 500, 450, 400]],
    ["RAW MATERIAL", [12000, 48000, 52000, 39000, 21000, 15000, 9000]],
    ["SERVICE PROVIDERS", [0, 2200, 1800, 1600, 1200, 900, 600]],
  ];
  const rows: Cell[][] = cats.map(([label, v]) => [label, ...v, v.reduce((s, x) => s + x, 0)]);
  const total = summaryColumns.slice(1).map((_, j) => rows.reduce((s, r) => s + (r[j + 1] as number), 0));
  return [...rows, ["Grand Total", ...total]];
})();
const openOrderSummary = sheet("Summary", summaryColumns, summaryRows, {
  pivot: true,
  note: "A pivot of the Working Sheet: open-order value in USD by category and month-end. Rossell's file runs month by month to 2029; six months are shown. What the categories are and how each is calculated is still open (Q24).",
});

/* ---------- 6. Reorder Order (Rossell's sheets: Raw data, Working Sheet) ---------- */

const reorderRaw = sheet("Raw data", reorderColumns, [
  ["RT-SMPL-0021", "RM", "B", "OEM-SMPL-A01", "PRJ-SMPL-07; PRJ-SMPL-11", 12, 74, 120, "EACH", 46, 30, 50, "", 40, "EACH", 40, "PO-SMPL-77801", "Supplier B (sample)", 96.5, "USD", "Short", 0, "Division A (sample)"],
  ["RT-SMPL-0034", "RM", "A", "OEM-SMPL-B07", "PRJ-SMPL-11", 8, 7000, 22000, "EACH", 15000, 8000, 5000, "", 5000, "EACH", 5000, "PO-SMPL-77822", "Supplier A (sample)", 0.42, "USD", "OK", 0, "Division A (sample)"],
  ["RT-SMPL-0005", "RM", "A", "OEM-SMPL-C12", "PRJ-SMPL-07", 4, 1320, 5520, "FT", 4200, 2000, 3281, "", 500, "MTR", 1640.5, "PO-SMPL-77830", "Supplier A (sample)", 1.02, "USD", "Short", 0, "Division A (sample)"],
  ["RT-SMPL-0052", "PS", "A", "OEM-SMPL-D03", "", 3, 0, 400, "MTR", 650, 200, 300, "", 300, "MTR", 300, "PO-SMPL-77830", "Supplier A (sample)", 1850, "INR", "Excess", 150, "Division B (sample)"],
  ["RT-SMPL-0089", "RM", "C", "OEM-SMPL-E11", "PRJ-SMPL-07", 16, 30, 60, "EACH", 30, 20, 50, "", 30, "EACH", 30, "PO-SMPL-77844", "Supplier D (sample)", 38, "EUR", "Short", 0, "Division A (sample)"],
]);

const reorderWorking = derived(
  reorderRaw,
  "Working Sheet",
  [...reorderColumns.filter((x) => x.name !== "Div"), ...reorderWorkingExtra],
  {
    Buyers: ["Buyer 01 (sample)", "Buyer 02 (sample)", "Buyer 03 (sample)", "Buyer 01 (sample)", "Buyer 02 (sample)"],
    Check: ["Review", "OK", "Review", "OK", "Review"],
    "Expection Qty": [34, 2000, 320, 0, 30],
    "Revised Material status": ["Short", "OK", "Short", "Excess", "Short"],
    "ISA Qty": [10, 0, 0, 0, 0],
    "TBO Qty": [24, 2000, 320, 0, 30],
    "Revised Pullin": [0, 0, 0, 150, 0],
    "Shortage Month considering OPOR": ["Feb-2027", "", "Dec-2026", "", "Jan-2027"],
  },
  "The buyers' working copy: Div is replaced by Buyers (its full name in the sheet is still Div) and eight review columns are added."
);

/* ---------- 16. Material Planner (Rossell's sheet: IQMS Material Planner) ---------- */

const materialPlanner = sheet("sheet1", materialPlannerColumns, [
  ["RT-SMPL-0021", "OEM-SMPL-A01", "Connector, circular, shell 13 (sample)", "PRJ-SMPL-07", 0, 16, 8, "Dec-2026", "EACH", 46, 24, 0, 10, 12, 8, 30, 0, "No", "2026-11-07", 20, "L-SAMPLE-2310", 40, 20, "2026-12-05", "Supplier B (sample)", "PO-SMPL-77801", "Open", "2026-12-05", "Partial delivery expected", "RM", "2026-11-12"],
  ["RT-SMPL-0034", "OEM-SMPL-B07", "Contact, crimp socket, size 22 (sample)", "PRJ-SMPL-11", 0, 6400, 4400, "Dec-2026", "EACH", 15000, 7500, 0, 4500, 3000, 2000, 8000, 0, "No", "2026-11-06", 3000, "L-SAMPLE-2412", 2000, 2000, "2026-11-28", "Supplier A (sample)", "PO-SMPL-77822", "Open", "2026-11-28", "", "RM", "2026-11-12"],
  ["RT-SMPL-0005", "OEM-SMPL-C12", "Wire, 22 AWG, white (sample)", "PRJ-SMPL-07", 12, 1600, 1600, "Nov-2026", "FT", 4200, 2800, 0, 600, 0, 0, 2000, 0, "No", "2026-11-07", 3281, "L-SAMPLE-2608", 500, 500, "2026-12-08", "Supplier A (sample)", "PO-SMPL-77830", "Open", "2026-12-08", "", "RM", "2026-11-12"],
  ["RT-SMPL-0052", "OEM-SMPL-D03", "Heat-shrink sleeving, 1/4 in, black (sample)", "PRJ-SMPL-SEMI", 0, 520, 0, "Jun-2027", "MTR", 650, 0, 600, 0, 50, 0, 200, 0, "Yes", "2026-09-30", 300, "L-SAMPLE-2601", 300, 300, "2026-12-15", "Supplier A (sample)", "PO-SMPL-77830", "Not acknowledged", "", "Shelf life tracked", "PS", "2026-11-12"],
  ["RT-SMPL-0089", "OEM-SMPL-E11", "Fibre-optic terminus (sample)", "PRJ-SMPL-07", 0, 60, 0, "Jan-2027", "EACH", 30, 0, 0, 0, 30, 30, 20, 0, "No", "2026-11-06", 30, "L-SAMPLE-2507", 30, 30, "2027-02-10", "Supplier D (sample)", "PO-SMPL-77844", "Open", "2027-02-10", "Promise after need date", "RM", "2026-11-12"],
]);

/* ---------- modelled files (no Rossell sheet yet) ---------- */

const forecastCols = [
  c("Customer", "string", "Customer code"),
  c("File Date", "date", "Date the forecast file was downloaded"),
  c("Customer Part No", "string", "Customer's part number for the finished good"),
  c("FG Part No", "string", "Rossell finished good (wire bundle) number, mapped from the customer part"),
  c("Bucket Start", "date", "Start of the forecast period (week / month)"),
  c("Forecast Qty", "number", "Forecast quantity in the bucket"),
  c("Label", "string", "Customer nomenclature (ignored in consolidation)"),
  c("Months Out", "number", "Months from file date"),
  c("In Exclusion Horizon", "boolean", "True if inside the configurable exclusion horizon (for example 2 months, 6 for LAM)"),
];
const forecast = sheet("Template (our model)", forecastCols, [
  ["CUST-SEMI-01", "2026-11-10", "CPN-SMPL-8821", "WB-SMPL-220", "2026-12-01", 160, "Firm-ish", 1, "true"],
  ["CUST-SEMI-01", "2026-11-10", "CPN-SMPL-8821", "WB-SMPL-220", "2027-03-01", 210, "Plan", 4, "true"],
  ["CUST-SEMI-01", "2026-11-10", "CPN-SMPL-8821", "WB-SMPL-220", "2027-06-01", 260, "Plan", 7, "false"],
  ["CUST-SEMI-02", "2026-11-10", "CPN-SMPL-1407", "WB-SMPL-305", "2027-02-01", 90, "Upside", 3, "false"],
  ["CUST-AERO-02", "2026-11-09", "CPN-SMPL-0042", "WB-SMPL-011", "2027-04-01", 24, "LTA", 5, "false"],
]);

const salesOrderCols = [
  c("Sales Order", "string", "Internal sales order number"),
  c("Customer", "string", "Customer code"),
  c("Project", "string", "Project the order belongs to"),
  c("Customer PO", "string", "Customer purchase order number"),
  c("PO Revision", "string", "Revision of the customer PO; the latest one is authoritative (to confirm, Q21)"),
  c("Release / Line", "string", "Release or schedule line under the PO"),
  c("FG Part No", "string", "Finished good ordered"),
  c("Blanket Qty", "number", "Total quantity on a blanket order"),
  c("Backlog Qty", "number", "Ordered and not yet shipped"),
  c("Request Date", "date", "Customer's requested date"),
  c("Promise Date", "date", "Rossell's committed date"),
  c("Shipped Qty", "number", "Quantity already shipped"),
  c("Last Ship Date", "date", "Date of the last shipment"),
];
const salesOrder = sheet("Template (our model)", salesOrderCols, [
  ["SO-SMPL-30011", "CUST-AERO-01", "PRJ-SMPL-07", "CPO-SMPL-4501", "C", "1/2", "WB-SMPL-011", 1000, 380, "2027-03-31", "2027-03-24", 620, "2026-10-30"],
  ["SO-SMPL-30011", "CUST-AERO-01", "PRJ-SMPL-07", "CPO-SMPL-4501", "C", "1/3", "WB-SMPL-011", 1000, 300, "2027-06-30", "2027-06-23", 0, ""],
  ["SO-SMPL-30012", "CUST-DEF-01", "PRJ-SMPL-11", "CPO-SMPL-6120", "A", "1/1", "WB-SMPL-410", 60, 60, "2027-01-15", "2027-01-15", 0, ""],
  ["SO-SMPL-30013", "CUST-SEMI-01", "", "CPO-SMPL-9910", "B", "1/1", "WB-SMPL-220", 0, 40, "2026-12-14", "2026-12-14", 0, ""],
  ["SO-SMPL-30014", "CUST-SPACE-01", "PRJ-SMPL-SP1", "CPO-SMPL-7001", "A", "2/1", "WB-SMPL-901", 12, 4, "2026-11-30", "2026-12-05", 8, "2026-11-02"],
]);

const grnCols = [
  c("GRN No", "string", "Goods received note number"),
  c("GRN Date", "date", "Date received"),
  c("Supplier", "string", "Supplier name / code"),
  c("PO No", "string", "Supplier PO the receipt is booked against"),
  c("PO line Number", "number", "PO line"),
  c("RT Part Number", "string", "Rossell part number"),
  c("Received Qty", "number", "Quantity received"),
  c("Accepted Qty", "number", "Quantity accepted by incoming QA"),
  c("Rejected Qty", "number", "Quantity rejected"),
  c("UOM", "enum", "Unit of measure"),
  c("Lot No", "string", "Lot / batch"),
  c("Location", "string", "Receiving location (inward QC, stores…)"),
  c("Posting Status", "enum", "Posted / Unposted / Void: only posted receipts may count (to confirm, Q22)"),
  c("CoC Ref", "string", "Certificate of conformance reference"),
];
const grn = sheet("Template (our model)", grnCols, [
  ["GRN-SMPL-91001", "2026-11-06", "Supplier A (sample)", "PO-SMPL-77822", 1, "RT-SMPL-0034", 3000, 3000, 0, "EACH", "L-SAMPLE-2412", "WH2-B02-01", "Posted", "COC-SMPL-5531"],
  ["GRN-SMPL-91002", "2026-11-06", "Supplier D (sample)", "PO-SMPL-77750", 2, "RT-SMPL-0089", 30, 0, 30, "EACH", "L-SAMPLE-2507", "QA-HOLD-01", "Posted", "COC-SMPL-5532"],
  ["GRN-SMPL-91003", "2026-11-07", "Supplier B (sample)", "PO-SMPL-77801", 1, "RT-SMPL-0021", 20, 20, 0, "EACH", "L-SAMPLE-2310", "INWARD-QC", "Unposted", "COC-SMPL-5540"],
  ["GRN-SMPL-91004", "2026-11-07", "Supplier A (sample)", "PO-SMPL-77830", 1, "RT-SMPL-0005", 1000, 1000, 0, "MTR", "L-SAMPLE-2608", "WH1-A03-02", "Posted", "COC-SMPL-5544"],
  ["GRN-SMPL-91005", "2026-11-08", "Supplier A (sample)", "PO-SMPL-77830", 2, "RT-SMPL-0052", 100, 0, 0, "MTR", "L-SAMPLE-2611", "INWARD-QC", "Void", "COC-SMPL-5550"],
]);

const sourcingCols = [
  c("Item No", "string", "Rossell part number"),
  c("MPN", "string", "Manufacturer part number"),
  c("Manufacturer", "string", "Approved manufacturer"),
  c("Supplier", "string", "Supplier / distributor"),
  c("Price", "number", "Agreed unit price"),
  c("Currency", "enum", "USD / INR / EUR"),
  c("Price Break Qty", "number", "Quantity the price applies from"),
  c("Valid From", "date", "Price validity start"),
  c("Valid To", "date", "Price validity end"),
  c("Lead Time (days)", "number", "Quoted lead time"),
  c("Source Type", "enum", "Manufacturer / Authorised distributor / Customer-directed"),
];
const sourcing = sheet("Template (our model)", sourcingCols, [
  ["RT-SMPL-0021", "OEM-SMPL-A01", "Manufacturer D (sample)", "Supplier B (sample)", 96.5, "USD", 10, "2026-04-01", "2027-03-31", 84, "Authorised distributor"],
  ["RT-SMPL-0034", "OEM-SMPL-B07", "Manufacturer A (sample)", "Supplier A (sample)", 0.42, "USD", 1000, "2026-01-01", "2026-12-31", 56, "Authorised distributor"],
  ["RT-SMPL-0005", "OEM-SMPL-C12", "Manufacturer G (sample)", "Supplier A (sample)", 1.02, "USD", 1000, "2026-07-01", "2027-06-30", 28, "Authorised distributor"],
  ["RT-SMPL-0052", "OEM-SMPL-D03", "Manufacturer C (sample)", "Supplier A (sample)", 1850, "INR", 100, "2026-04-01", "2027-03-31", 21, "Authorised distributor"],
  ["RT-SMPL-0089", "OEM-SMPL-E11", "Manufacturer E (sample)", "Supplier D (sample)", 38, "EUR", 50, "2026-04-01", "2026-12-31", 112, "Customer-directed"],
]);

const vendorCols = [
  c("Vendor Code", "string", "IQMS vendor ID"),
  c("Vendor Name", "string", "Supplier name"),
  c("Category", "enum", "Manufacturer / Distributor / Special process / Logistics / Service"),
  c("Country", "string", "Supplier country"),
  c("Approval Status", "enum", "Approved / Conditional / Disqualified"),
  c("Certifications", "string", "AS9100 / AS9120 / ISO 9001 / NADCAP"),
  c("Approved Since", "date", "First approval date"),
  c("Next Audit", "date", "Next supplier audit due"),
  c("Payment Terms", "string", "e.g. Net 60"),
];
const vendorMaster = sheet("Template (our model)", vendorCols, [
  ["V-SMPL-001", "Supplier A (sample)", "Distributor", "USA", "Approved", "AS9120, ISO 9001", "2016-05-01", "2027-05-01", "Net 60"],
  ["V-SMPL-002", "Supplier B (sample)", "Distributor", "India", "Approved", "AS9120", "2019-02-11", "2027-02-11", "Net 45"],
  ["V-SMPL-003", "Supplier C (sample)", "Manufacturer", "USA", "Approved", "AS9100, ISO 9001", "2014-09-20", "2026-12-15", "Net 30"],
  ["V-SMPL-004", "Supplier D (sample)", "Manufacturer", "Germany", "Conditional", "ISO 9001", "2025-08-01", "2026-12-01", "Net 30"],
  ["V-SMPL-005", "Forwarder (sample)", "Logistics", "India", "Approved", "ISO 9001", "2018-01-15", "2027-01-15", "Net 15"],
]);

const promiseCols = [
  c("PO No", "string", "Rossell supplier PO number"),
  c("PO line Number", "number", "PO line"),
  c("Unique Rel ID", "string", "Release the promise applies to (how it relates to PO and line is still open, Q20)"),
  c("RT Part Number", "string", "Rossell part number"),
  c("Supplier Name", "string", "Supplier"),
  c("Bal. Qty.", "number", "Quantity not yet received on the release"),
  c("Req.date", "date", "Rossell's required date (may be buyer-overridden)"),
  c("Promise.Date", "date", "Supplier's committed date (ETA)"),
  c("Promise Qty", "number", "Quantity committed for that date (partials allowed)"),
  c("Change Type", "enum", "New / Pull-in / Push-out / Split"),
  c("Source", "enum", "Email / Portal / Phone"),
  c("Updated By", "string", "Buyer / SCM user"),
];
const promiseUpload = sheet("Template (our model)", promiseCols, [
  ["PO-SMPL-77801", 1, "REL-SMPL-000101", "RT-SMPL-0021", "Supplier B (sample)", 20, "2026-11-24", "2026-12-05", 20, "Push-out", "Email", "BYR-01"],
  ["PO-SMPL-77822", 1, "REL-SMPL-000102", "RT-SMPL-0034", "Supplier A (sample)", 2000, "2026-12-03", "2026-11-28", 2000, "Pull-in", "Email", "BYR-02"],
  ["PO-SMPL-77830", 1, "REL-SMPL-000103", "RT-SMPL-0005", "Supplier A (sample)", 500, "2026-12-08", "2026-12-08", 500, "New", "Portal", "SCM-04"],
  ["PO-SMPL-77830", 2, "REL-SMPL-000104", "RT-SMPL-0052", "Supplier A (sample)", 300, "2026-12-15", "2026-12-15", 200, "Split", "Phone", "BYR-01"],
  ["PO-SMPL-77830", 2, "REL-SMPL-000106", "RT-SMPL-0052", "Supplier A (sample)", 300, "2026-12-15", "2027-01-12", 100, "Split", "Phone", "BYR-01"],
]);

const mrpCols = [
  c("PO No", "string", "Rossell supplier PO number"),
  c("PO line Number", "number", "PO line"),
  c("Unique Rel ID", "string", "Release on the line"),
  c("RT Part Number", "string", "Rossell part number"),
  c("Bal. Qty.", "number", "Not yet received"),
  c("Promise.Date", "date", "Current due / promise date on the PO"),
  c("New Need Date", "date", "Date MRP now says it is needed"),
  c("MRP Message", "enum", "Expedite / De-expedite / Cancel / OK"),
  c("Days Shift", "number", "New need date − current date"),
];
const openOrderMrp = sheet("Template (our model)", mrpCols, [
  ["PO-SMPL-77801", 1, "REL-SMPL-000101", "RT-SMPL-0021", 20, "2026-12-05", "2026-11-24", "Expedite", -11],
  ["PO-SMPL-77822", 1, "REL-SMPL-000102", "RT-SMPL-0034", 2000, "2026-11-28", "2026-12-03", "OK", 5],
  ["PO-SMPL-77760", 2, "REL-SMPL-000090", "RT-SMPL-0070", 500, "2026-11-30", "2027-02-15", "De-expedite", 77],
  ["PO-SMPL-77744", 1, "REL-SMPL-000081", "RT-SMPL-0091", 10, "2026-12-12", "", "Cancel", 0],
  ["PO-SMPL-77830", 1, "REL-SMPL-000103", "RT-SMPL-0005", 500, "2026-12-08", "2026-12-08", "OK", 0],
]);

const contactCols = [
  c("Vendor Code", "string", "IQMS vendor ID"),
  c("Vendor Name", "string", "Supplier name"),
  c("Contact Role", "enum", "Sales / Order desk / Expediting / Quality"),
  c("Email", "string", "Contact email"),
  c("Phone", "string", "Contact phone"),
  c("Time Zone", "string", "Supplier time zone"),
  c("Preferred Channel", "enum", "Email / Portal / Phone"),
];
const supplierContact = sheet("Template (our model)", contactCols, [
  ["V-SMPL-001", "Supplier A (sample)", "Order desk", "orders@supplier-a.example", "+1-555-0100", "America/Chicago", "Email"],
  ["V-SMPL-002", "Supplier B (sample)", "Sales", "sales@supplier-b.example", "+91-80-5550-0101", "Asia/Kolkata", "Portal"],
  ["V-SMPL-003", "Supplier C (sample)", "Expediting", "expedite@supplier-c.example", "+1-555-0102", "America/New_York", "Email"],
  ["V-SMPL-004", "Supplier D (sample)", "Quality", "quality@supplier-d.example", "+49-30-5550-0103", "Europe/Berlin", "Phone"],
  ["V-SMPL-005", "Forwarder (sample)", "Order desk", "ops@forwarder.example", "+91-80-5550-0104", "Asia/Kolkata", "Email"],
]);

const userCols = [
  c("User ID", "string", "Login ID"),
  c("Name", "string", "Display name"),
  c("Department", "enum", "SCM / PPC / Engineering / Sourcing / IT / Finance …"),
  c("Designation", "enum", "VP … Associate Engineer"),
  c("Role", "enum", "Buyer / Planner / SCM / Viewer / Admin"),
  c("Plant", "string", "Home plant"),
  c("Projects", "string", "Projects the user can see"),
  c("Active", "boolean", "Account active"),
];
const userDetails = sheet("Template (our model)", userCols, [
  ["u.sample01", "Sample User 01", "SCM", "Principal Engineer", "Buyer", "PLANT-SMPL-1", "PRJ-SMPL-07; PRJ-SMPL-11", "true"],
  ["u.sample02", "Sample User 02", "PPC", "Manager", "Planner", "PLANT-SMPL-1", "All", "true"],
  ["u.sample03", "Sample User 03", "SCM", "Senior Manager", "SCM", "PLANT-SMPL-2", "All", "true"],
  ["u.sample04", "Sample User 04", "Engineering", "Engineer", "Viewer", "PLANT-SMPL-1", "PRJ-SMPL-07", "true"],
  ["u.sample05", "Sample User 05", "IT Support", "Team Lead", "Admin", "PLANT-SMPL-1", "All", "false"],
]);

/* ---------- the catalogue ---------- */

const SRC = ["WS", "FILES"];

export const files: DataFile[] = [
  {
    id: "active-stock",
    index: 1,
    name: "Active Stock Report",
    status: "in-scope",
    direction: "input",
    what: "Current stock",
    notes: "Current stock position used by materials planning.",
    sourceSystem: "IQMS ERP",
    mechanism: "Crystal Reports-SQL via ERP",
    trigger: "Stock updates",
    refresh: "Every morning",
    creates: "Feature in ERP",
    consumers: ["Buyer", "PPC (Production Planning & Control)"],
    plainMeaning: "What is in stock this morning, item by item and lot by lot: where it sits, what it cost, which PO it came on and which project it belongs to. Planning counts the available quantity (Avl Qty), not everything on hand.",
    basis: "rossell-file",
    workbook: "RT_Active_Stock_Report_With_Value 15-10-2026 07.41.xlsx",
    extractDate: "2026-10-15",
    sheets: [activeStock],
    sources: SRC,
  },
  {
    id: "exception",
    index: 2,
    name: "Exception Report",
    status: "in-scope",
    direction: "input",
    what: "What you need as quantity",
    notes: "Identifies required material quantity / deficiency.",
    sourceSystem: "IQMS ERP",
    mechanism: "Default report",
    trigger: "Stock updates",
    refresh: "Every morning",
    creates: "Feature in ERP",
    consumers: ["Buyer"],
    plainMeaning: "The ERP's exception list: for each item, how much is short (Total Exception) and how much is still left to order once open POs are counted. The buyer's to-do list each morning.",
    basis: "rossell-file",
    workbook: "Exception Report 15-10-2026 07.40.XLSX",
    extractDate: "2026-10-15",
    sheets: [exception],
    sources: SRC,
  },
  {
    id: "exception-mab",
    index: 3,
    name: "Exception Report with Must Arrive By",
    status: "in-scope",
    direction: "input",
    what: "When quantity should arrive",
    notes: "Adds required arrival timing to the material requirement.",
    sourceSystem: "IQMS ERP",
    mechanism: "Crystal Reports-SQL via ERP",
    trigger: "Stock updates",
    refresh: "Every morning",
    creates: "Feature in ERP",
    consumers: ["Buyer"],
    plainMeaning: "The same shortages as dated requirements: for each item and quantity, by when it must be ordered and by when it must arrive.",
    basis: "rossell-file",
    workbook: "Exception Report With Must Arrive By 15-10-2026 07.37.XLSX",
    extractDate: "2026-10-15",
    sheets: [mustArrive],
    sources: SRC,
  },
  {
    id: "rt-consolidated-bom",
    index: 4,
    name: "RT Consolidated BOM",
    status: "in-scope",
    direction: "input",
    what: "BOM – master",
    notes: "Rossell engineering BOM master: finished-good / wire-bundle composition, component materials, quantities, UOM and revision information.",
    sourceSystem: "IQMS ERP",
    mechanism: "Crystal Reports-SQL via ERP",
    trigger: "New order / customer / revision",
    refresh: "Every morning",
    creates: "Feature in ERP",
    consumers: ["Engineering", "Buyer", "PPC", "Sourcing"],
    plainMeaning: "The recipe book: for every wire bundle, each raw material and how much of it goes into one unit, with the latest and default revisions. It is engineering master data; customer demand never overwrites it.",
    basis: "rossell-file",
    workbook: "RT Consolidated BOM 15th Oct 2026.xlsx",
    extractDate: "2026-10-15",
    sheets: [consolidatedBom],
    sources: SRC,
  },
  {
    id: "rt-open-order",
    index: 5,
    name: "RT Open Order Report",
    status: "in-scope",
    direction: "input",
    what: "Pending orders",
    notes: "ERP open supplier orders, including PO/release, supplier, quantity, required date, promise date and status.",
    sourceSystem: "IQMS ERP",
    mechanism: "Crystal Reports-SQL via ERP",
    trigger: "Daily",
    refresh: "Every morning",
    creates: "Feature in ERP",
    consumers: ["Buyer"],
    plainMeaning: "Every open supplier purchase order line: what was ordered from whom, what has arrived, the balance still to come, the required date and the supplier's promise date. This is the in-flight supply that planning nets against demand.",
    basis: "rossell-file",
    workbook: "RT Open Order Report 15102026.xlsx",
    extractDate: "2026-10-15",
    sheets: [openOrderRaw, openOrderWorking, openOrderSummary],
    sources: SRC,
  },
  {
    id: "reorder",
    index: 6,
    name: "Reorder Order Report",
    status: "in-scope",
    direction: "output",
    what: "To reorder to supplier",
    notes: "Output identifying what should be reordered from suppliers.",
    sourceSystem: "IT Team – SCM",
    mechanism: "Crystal Reports-SQL via ERP",
    trigger: "Weekly",
    refresh: "Weekly",
    creates: "Developed by IT",
    consumers: ["Buyer (semiconductor business)"],
    plainMeaning: "What to reorder from which supplier: per item, its demand, stock, reorder level and quantity, open orders, last buy price, a status flag and any pull-in. Buyers review it in a Working Sheet with extra columns.",
    basis: "rossell-file",
    workbook: "Reorder Order Report- 12-10-2026.xlsx",
    extractDate: "2026-10-12",
    sheets: [reorderRaw, reorderWorking],
    sources: SRC,
  },
  {
    id: "forecast",
    index: 7,
    name: "Forecast Report",
    status: "in-scope",
    direction: "input",
    what: "From customer",
    notes: "Customer forecast. Eligible forecast is exploded through the applicable BOM into raw-material demand, subject to the configurable exclusion horizon.",
    sourceSystem: "Customer",
    mechanism: "Customer",
    trigger: "Changes from customer – daily",
    refresh: "15 days (daily)",
    creates: "Downloaded",
    consumers: ["Buyer", "Sourcing"],
    plainMeaning: "The customer's own forecast file, downloaded from their portal; it changes daily for semiconductor customers. Eligible forecast is exploded through the BOM into raw-material demand. The first months are excluded by a configurable horizon (for example 2 months, 6 for LAM) because they overlap firm orders.",
    basis: "modelled",
    sheets: [forecast],
    sources: SRC,
  },
  {
    id: "sales-order",
    index: 8,
    name: "Sales Order Report",
    status: "out-of-scope",
    direction: "input",
    what: "Customer order – demand – FG level",
    notes: "Customer sales-order demand at finished-good level. Customer SO template includes order, PO revision, release/schedule, quantity, backlog, dates and shipment-related fields.",
    sourceSystem: "IQMS ERP",
    mechanism: "Crystal Reports-SQL via ERP",
    trigger: "Daily",
    refresh: "Every morning",
    creates: "Feature in ERP",
    consumers: [],
    plainMeaning: "Customer orders at finished-good level: order, PO revision, release, blanket and backlog quantities, requested and promised dates, and shipments. Its template is a sheet in Rossell's Templates.xlsx. Not in scope now.",
    basis: "modelled",
    sheets: [salesOrder],
    sources: SRC,
  },
  {
    id: "grn",
    index: 9,
    name: "GRN Report",
    status: "out-of-scope",
    direction: "input",
    what: "Goods received notes",
    notes: "ERP goods-receipt information; may later support PO receipt and stock reconciliation.",
    sourceSystem: "IQMS ERP",
    mechanism: "Crystal Reports-SQL via ERP",
    trigger: "Daily",
    refresh: "Every morning",
    creates: "Feature in ERP",
    consumers: ["SCM (per research deck; consumer column blank in the sheet)"],
    plainMeaning: "Goods received against supplier POs. A receipt is an event, not available stock: posting, rejection, void and location status must be defined before it can reconcile stock. Its template is a sheet in Rossell's Templates.xlsx. Not in scope now.",
    basis: "modelled",
    sheets: [grn],
    sources: [...SRC, "DECK-RESEARCH"],
  },
  {
    id: "sourcing",
    index: 10,
    name: "Sourcing Report",
    status: "out-of-scope",
    direction: "input",
    what: "Source, price validity",
    notes: "Supplier/source and price-validity information.",
    mechanism: "Future, not now (supplier master)",
    consumers: [],
    plainMeaning: "For each part: who we can buy it from, at what price, and until when that price holds. Planned for the future as part of a supplier master.",
    basis: "modelled",
    sheets: [sourcing],
    sources: SRC,
  },
  {
    id: "vendor-master",
    index: 11,
    name: "Vendor Master Report",
    status: "out-of-scope",
    direction: "input",
    what: "Approved supplier listing",
    notes: "Approved supplier list / supplier master information.",
    sourceSystem: "IQMS ERP",
    mechanism: "Live report",
    trigger: "Live",
    consumers: [],
    plainMeaning: "The approved supplier list (ASL): every supplier Rossell is allowed to buy from, with its approval status and certifications.",
    basis: "modelled",
    sheets: [vendorMaster],
    sources: SRC,
  },
  {
    id: "promise-date-upload",
    index: 12,
    name: "Promise Date Upload Utility",
    status: "in-scope",
    direction: "output",
    what: "Upload into ERP",
    notes: "Portal-generated ERP upload file for supplier promise dates. Must preserve the exact customer-provided template format.",
    mechanism: "Excel if API is not available",
    consumers: ["SCM", "Buyer (per research deck; consumer column blank in the sheet)"],
    plainMeaning: "The file the planning portal generates to load supplier promise dates into IQMS, release by release (Unique Rel ID). It is an integration contract: exact column order, headers, blanks, types and date formats, no unresolved exceptions, and a history of every export. The promise date becomes the ETA used by clear-to-build.",
    basis: "modelled",
    sheets: [promiseUpload],
    sources: [...SRC, "DECK-RESEARCH"],
  },
  {
    id: "open-order-mrp",
    index: 13,
    name: "RT Open Order Report with MRP Message",
    status: "out-of-scope",
    direction: "input",
    what: "Show new need dates",
    notes: "Open-order report with MRP messages / new need dates.",
    consumers: [],
    plainMeaning: "The open supplier POs with the ERP's advice attached: needed earlier, later or not at all. Not in scope now.",
    basis: "modelled",
    sheets: [openOrderMrp],
    sources: SRC,
  },
  {
    id: "supplier-contact",
    index: 14,
    name: "Supplier Contact Info",
    status: "not-available",
    direction: "input",
    what: "To send mail to suppliers",
    notes: "Supplier contact details needed for supplier communications; not currently available.",
    consumers: [],
    plainMeaning: "Who to email at each supplier about dates and confirmations. To be provided by Rossell.",
    basis: "modelled",
    sheets: [supplierContact],
    sources: SRC,
  },
  {
    id: "user-details",
    index: 15,
    name: "User Details – Rossell",
    status: "not-available",
    direction: "input",
    what: "Internal users",
    notes: "Rossell internal user information; not currently available.",
    consumers: [],
    plainMeaning: "The Rossell people who will use the planning layer, with department and designation for access roles. To be provided by Rossell.",
    basis: "modelled",
    sheets: [userDetails],
    sources: SRC,
  },
  {
    id: "material-planner",
    index: 16,
    name: "Material Planner Report",
    status: "out-of-scope",
    direction: "input",
    what: "Will have all the demands: 3L lines per project; 44 running projects",
    notes: "Material-planner report described as containing all demand; stated scale is “3L Lines per project” and 44 running projects. Not in scope. “3L” is not interpreted.",
    sourceSystem: "IQMS ERP",
    consumers: [],
    plainMeaning: "IQMS's material planner view: per item and project, the requirement, hard allocation, stock by bucket (stores, pan stock, kitting, inward QC), deficiency, reorder point and the next scheduled delivery. Described as holding all demand, “3L lines per project” across 44 running projects (what 3L means is still open, Q23). Not in scope now.",
    basis: "rossell-file",
    workbook: "IQMS Material Planner 15-10-2026 07.37.xlsx",
    extractDate: "2026-10-15",
    sheets: [materialPlanner],
    sources: SRC,
  },
];

/** Every column of a file, across its sheets, once each (pivot sheets excluded), in sheet order. */
export function fileColumns(f: DataFile): FileColumn[] {
  const seen = new Set<string>();
  const out: FileColumn[] = [];
  for (const s of f.sheets) {
    if (s.pivot) continue;
    for (const col of s.columns) {
      if (seen.has(col.name)) continue;
      seen.add(col.name);
      out.push(col);
    }
  }
  return out;
}

/** The sheet(s) of a file that hold a column. */
export const sheetsWithColumn = (f: DataFile, name: string) => f.sheets.filter((s) => !s.pivot && s.columns.some((col) => col.name === name)).map((s) => s.name);

export const fileSummary = {
  inScope: files.filter((f) => f.status === "in-scope").map((f) => f.id),
  outOfScope: files.filter((f) => f.status === "out-of-scope").map((f) => f.id),
  notAvailable: files.filter((f) => f.status === "not-available").map((f) => f.id),
  text: "16 reports: 8 in scope (6 inputs, 2 outputs), 6 not in scope, 2 not yet available.",
  sources: SRC,
  confidence: "session" as const,
  sampleNote: "Column names of the seven reports Rossell sent are exactly as in their files; the other nine are our model. Every sample value is invented, not Rossell data.",
};

export const getFile = (id: string): DataFile | undefined => files.find((f) => f.id === id);
