// Shared content contract. Every fact shown on the site traces back to a Source.

export type Confidence =
  | "reported" // public filing / public report
  | "session" // Rossell working sessions (Notes - RMIG.xlsx)
  | "rules" // internal "Engineering and BOM — Business Rules" draft
  | "calc" // our own calculation from sourced figures
  | "estimate" // our estimate, clearly labelled
  | "industry-example"; // typical industry example, NOT confirmed as Rossell's

export type SourceGroup =
  | "rossell"
  | "market"
  | "domain"
  | "industry-forces"
  | "systems"
  | "competitors"
  | "suppliers"
  | "people"
  | "internal"
  | "imagery"; // photo credits (content/assets.ts)

export interface Source {
  id: string; // "S1".."S92" = research markdown Appendix B numbering; "R-<topic>-<n>" = new web research; "WS", "RULES", "DECK-RESEARCH", "DECK-SC" = internal
  title: string;
  publisher?: string;
  url?: string;
  date?: string; // ISO or "Nov 2026"
  accessed?: string;
  group: SourceGroup;
}

export interface Fact<T = string | number> {
  value: T;
  label?: string;
  unit?: string; // "₹ Cr", "%", "months"…
  asOf?: string;
  note?: string;
  sources: string[]; // Source ids
  confidence: Confidence;
}

export interface Person {
  id: string;
  name: string;
  title: string;
  function?: string;
  background?: string;
  linkedin?: string; // only when unambiguous; else omit
  profileUrl?: string; // company leadership page
  reportsTo?: string; // person id
  isContact?: boolean; // our day-to-day contact
  sources: string[];
  confidence: Confidence;
}

export interface Competitor {
  id: string;
  name: string;
  hq: string;
  listed?: string; // "NSE: KAYNES"
  revenueCr?: Fact<number>; // latest FY, ₹ Cr
  ebitdaMarginPct?: Fact<number>;
  adSharePct?: Fact<number>; // aerospace & defence share of revenue
  services: string[]; // keys from SERVICE_KEYS
  focus: string;
  relevance: string;
  sources: string[];
}

export interface Supplier {
  id: string;
  name: string;
  category: "manufacturer" | "distributor" | "special-process" | "logistics" | "service";
  hq: string;
  indiaPresence?: string;
  makes: string; // plain English
  exampleParts: { part: string; whatItDoes: string }[];
  usedIn: string; // where it shows up in a harness
  url?: string;
  sources: string[];
  confidence: Confidence; // nearly always "industry-example"
}

export interface Client {
  id: string;
  name: string;
  domain: ("aerospace" | "defence" | "semiconductor" | "space")[];
  country?: string;
  services: string[];
  programs?: string[];
  since?: string;
  value?: Fact<string>; // contract value / share where known
  highlights?: string[];
  sources: string[];
  confidence: Confidence;
}

/** Answer cells in Rossell's column sheets ("Data Availability", "To be stored", "To be generated"). */
export type ColumnFlag = "yes" | "no" | "not-sure" | "maybe";

export interface FileColumn {
  /** Header exactly as in Rossell's file (their spelling kept), or our modelled name. */
  name: string;
  /** "Full Column Name" from Rossell's sheet, when it differs from the header. */
  full?: string;
  /** string | number | date | enum | boolean: our reading of the column. */
  type: string;
  description: string;
  /** The sheet says nobody yet knows what the column means. */
  unclear?: boolean;
  /** "Needs Review" row: Must Review / Good to Review. */
  review?: "must" | "good";
  /** Clarification question raised with Rossell. */
  question?: string;
  /** Rossell's answer ("Your Comments" row). */
  answer?: string;
  available?: ColumnFlag;
  stored?: ColumnFlag;
  generated?: ColumnFlag;
}

export interface FileSheet {
  name: string;
  columns: FileColumn[];
  /** SAMPLE data, invented and labelled as such in the UI. Never values from Rossell's files. */
  sampleRows: Record<string, string | number>[];
  note?: string;
  /** A summary pivot (row labels × periods), not a list of records: kept out of the column crosswalk. */
  pivot?: boolean;
}

export interface DataFile {
  id: string; // "active-stock"
  index: number; // 1..16
  name: string;
  status: "in-scope" | "out-of-scope" | "not-available";
  direction: "input" | "output";
  /** "Meaning" column of the file catalogue. */
  what: string;
  /** "Notes / Interpretation" column of the file catalogue. */
  notes: string;
  sourceSystem?: string;
  mechanism?: string;
  trigger?: string;
  refresh?: string;
  creates?: string;
  consumers: string[];
  plainMeaning: string;
  /** rossell-file: column names come from Rossell's own workbook; modelled: our layout until the file arrives. */
  basis: "rossell-file" | "modelled";
  /** Rossell's workbook name and extract date, for rossell-file entries. */
  workbook?: string;
  extractDate?: string;
  /** One or more sheets; the first is the main one. */
  sheets: FileSheet[];
  sources: string[];
}

/** One exact column in one file (and sheet) that carries a dictionary field. */
export interface ColumnRef {
  file: string; // DataFile id
  column: string; // exact header
}

export interface DictionaryEntry {
  entity: string; // "BOM line"
  field: string;
  type: string;
  definition: string;
  example?: string;
  /** Every column, across the files, that holds this field (the crosswalk). */
  columns: ColumnRef[];
  /** Files that carry the field: the columns' files plus modelled links. */
  files: string[]; // DataFile ids
  usedBy: string[];
  /** rossell-file when at least one column comes from a Rossell workbook. */
  basis: "rossell-file" | "modelled";
}
