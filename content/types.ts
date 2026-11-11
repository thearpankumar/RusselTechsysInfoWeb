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

export interface DataFile {
  id: string; // "active-stock"
  index: number; // 1..16
  name: string;
  status: "in-scope" | "out-of-scope" | "not-available";
  direction: "input" | "output";
  what: string;
  sourceSystem?: string;
  mechanism?: string;
  trigger?: string;
  refresh?: string;
  creates?: string;
  consumers: string[];
  plainMeaning: string;
  columns: { name: string; type: string; description: string }[];
  sampleRows: Record<string, string | number>[]; // SAMPLE data, labelled as such in UI
  sources: string[];
}

export interface DictionaryEntry {
  entity: string; // "BOM line"
  field: string;
  type: string;
  definition: string;
  example?: string;
  files: string[]; // DataFile ids
  usedBy: string[];
}
