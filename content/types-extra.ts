// Additional content interfaces. types.ts is the shared contract and is not edited;
// everything here builds on its Confidence / Fact / Source vocabulary.
import type { Confidence, Fact } from "./types";

/** Anything that can be cited. */
export interface Sourced {
  sources: string[];
  confidence: Confidence;
  note?: string;
}

/** Helper to build a Fact with less noise. */
export function fact<T extends string | number>(
  value: T,
  sources: string[],
  confidence: Confidence,
  extra: Omit<Fact<T>, "value" | "sources" | "confidence"> = {},
): Fact<T> {
  return { value, sources, confidence, ...extra };
}

/* ---------- company ---------- */

export interface CompanyProfile {
  legalName: string;
  shortName: string;
  tagline: string;
  description: string;
  founded: Fact<string>;
  headquarters: Fact<string>;
  registeredOffice: Fact<string>;
  listing: { bse: Fact<string>; nse: Fact<string>; listedOn: Fact<string> };
  parent: Fact<string>;
  managingDirector: Fact<string>;
  chairman: Fact<string>;
  ceo: Fact<string>;
  segments: Fact<string>;
  headcount: Fact<number>;
  website: string;
}

export type TimelineKind =
  | "founding"
  | "corporate"
  | "listing"
  | "facility"
  | "contract"
  | "award"
  | "people"
  | "milestone"
  | "finance";

export interface TimelineEvent extends Sourced {
  id: string;
  date: string; // ISO (yyyy-mm-dd or yyyy-mm or yyyy)
  label: string;
  detail?: string;
  kind: TimelineKind;
}

export interface Certification extends Sourced {
  id: string;
  name: string;
  scope: string; // plain English
  holder?: string; // "Rossell Techsys Ltd" / "Rossell Techsys Inc"
  validTo?: string;
}

export interface Award extends Sourced {
  id: string;
  name: string;
  by: string;
  year: string;
  detail?: string;
}

export interface BusinessModelItem extends Sourced {
  id: string;
  name: string;
  plain: string;
}

/* ---------- financials ---------- */

export interface FinancialPeriod {
  id: string; // "FY26", "Q2FY27", "H1FY27"
  label: string;
  kind: "annual" | "quarter" | "half";
  periodEnd: string; // ISO date
  revenue?: Fact<number>;
  ebitda?: Fact<number>;
  ebitdaMarginPct?: Fact<number>;
  pbt?: Fact<number>;
  pat?: Fact<number>;
  yoyRevenueGrowthPct?: Fact<number>;
  note?: string;
}

export interface SeriesPoint extends Sourced {
  label: string; // "Mar-26"
  asOf: string; // ISO
  value: number;
  unit: string;
}

export interface KpiRow extends Sourced {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  asOf?: string;
  plain: string;
}

export interface MixSplit extends Sourced {
  label: string;
  parts: { name: string; pct: number }[];
}

/* ---------- locations ---------- */

export interface Location extends Sourced {
  id: string;
  name: string;
  kind: "plant" | "office" | "subsidiary" | "facility" | "registered-office";
  city: string;
  region?: string;
  country: string;
  lat: number;
  lng: number;
  coordsApprox: boolean;
  areaSqFt?: Fact<number>;
  status: "operating" | "ramping" | "planned";
  description: string;
}

export interface ExpansionEvent extends Sourced {
  id: string;
  date: string;
  label: string;
  areaSqFt?: number;
  capexCr?: number;
  locationId?: string;
}

export interface ExportMarket extends Sourced {
  id: string;
  region: string;
  countries: string[];
  lat: number;
  lng: number;
  sharePct?: Fact<number>;
  focus?: string;
}

/* ---------- people ---------- */

export interface DesignationLevel {
  rank: number;
  title: string;
  plain: string;
  sources: string[];
  confidence: Confidence;
}

export interface Department extends Sourced {
  id: string;
  name: string;
  does: string;
  usesFiles?: string[]; // DataFile ids
}

/* ---------- domains / services ---------- */

export interface Domain extends Sourced {
  id: "aerospace" | "defence" | "semiconductor" | "space";
  name: string;
  orderingPattern: string;
  orderingDetail: string;
  shape: "one-po-many-schedules" | "scheduled-deliveries" | "many-pos-one-schedule" | "project-based";
  customers: string[]; // Client ids
  notes: string[];
}

export interface ServiceDef {
  key: string;
  label: string;
  short: string;
  plain: string;
  sources: string[];
  confidence: Confidence;
}

/* ---------- products / materials ---------- */

export interface Product extends Sourced {
  id: string;
  name: string;
  nickname?: string;
  whatItIs: string;
  realLife: string;
  whereItSits: string;
  domains: ("aerospace" | "defence" | "semiconductor" | "space")[];
  services: string[]; // SERVICE_KEYS
  programs?: string[];
}

export interface Material extends Sourced {
  id: string;
  name: string;
  category:
    | "wire"
    | "connector"
    | "contact"
    | "backshell"
    | "protection"
    | "clamp"
    | "splice"
    | "identification"
    | "shielding"
    | "lacing"
    | "grommet"
    | "fibre"
    | "electronics"
    | "consumable";
  whatItIs: string;
  whatItDoes: string;
  typicalSpec: string[];
  exampleMakers?: string[];
  uom: string;
  harnessPart?: string; // key for the 3D exploded harness (HarnessPartId in materials.ts)
}

export interface BomLine {
  line: number;
  partNo: string;
  description: string;
  materialId?: string;
  uom: "EA" | "FT" | "M" | "IN" | "KG" | "SET";
  qtyPerFg: number;
  sample: boolean; // true = generated illustration, NOT Rossell data
  sources: string[];
  confidence: Confidence;
}

export interface IllustrativeBom extends Sourced {
  fgPartNo: string;
  fgDescription: string;
  lineCount: number;
  lines: BomLine[];
  rule: string;
}

/* ---------- scale ---------- */

export interface ScaleMetric extends Sourced {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  asOf?: string;
  plain: string;
}

/* ---------- lifecycle ---------- */

export interface LifecycleStage extends Sourced {
  id: string;
  index: number;
  name: string;
  steps: string[];
  plain: string;
  workflowIds: string[];
}

export interface FlowStep extends Sourced {
  index: number;
  name: string;
  what: string;
  supporting: string;
  fileIds: string[];
}

export interface PlanningParameter extends Sourced {
  id: string;
  name: string;
  meaning: string;
  from: string;
  example: string;
}

export interface Workflow extends Sourced {
  id: string; // "W1"
  phase: "A" | "B" | "C" | "D" | "E";
  name: string;
  trigger: string;
  actors: string[];
  steps: string[];
  output: string;
  inScope: boolean;
}

export interface WorkflowPhase {
  id: "A" | "B" | "C" | "D" | "E";
  name: string;
}

export interface BusinessRule extends Sourced {
  id: string;
  group: "2.1 BOM identity" | "2.2 BOM revision" | "Net demand & supply" | "Session rules" | "Buyer controls" | "Allocation";
  text: string;
  plain?: string;
}

/* ---------- business-rules register (chapter "rules") ---------- */

/** What a rule applies to. Each context keeps one data colour everywhere (content/rules.ts). */
export type RuleContext =
  | "engineering-bom"
  | "customer-submission"
  | "customer-order"
  | "customer-forecast"
  | "supplier-order"
  | "contractor"
  | "inventory-allocation"
  | "planning-run";

/** Must / should / may, from the rule's wording. */
export type RuleStrength = "must" | "should" | "may";

/** Where the rule was agreed: the business-rules spec or the working sessions. */
export type RuleOrigin = "spec" | "session";

export interface RuleRecord extends Sourced {
  /** Existing ids are kept (R2.1.1, RND.3, WS.A2); new spec rules are R<section>.<n>. */
  id: string;
  /** Document order (the "ID" sort). */
  order: number;
  /** Short name for cards and table rows. */
  title: string;
  /** The rule as written. */
  text: string;
  plain?: string;
  /** RULE_SECTIONS id ("2.3", "WS-A"). */
  section: string;
  /** 1–3 contexts; the first is the primary one. SAMPLE until confirmed. */
  contexts: RuleContext[];
  strength: RuleStrength;
  origin: RuleOrigin;
  /** Owning team. SAMPLE until confirmed. */
  owner: string;
  /** ISO date the rule became active. SAMPLE until confirmed. */
  activeFrom: string;
  /** ISO date the rule stopped applying (exclusive); absent = open-ended. */
  activeTo?: string;
  /** Rule that replaced this one. */
  supersededBy?: string;
  /** Logical entities (spec §8 / §10) the rule touches. */
  entities?: string[];
  /** OpenQuestion ids this rule waits on ("Needs confirmation"). */
  questions?: string[];
}

export interface SystemFact extends Sourced {
  id: string;
  system: string;
  fact: string;
}

export interface ActorGroup extends Sourced {
  id: string;
  name: string;
  side: "customer" | "internal" | "supply" | "systems";
  members: { name: string; role: string; basis: Confidence }[];
}

/* ---------- glossary / open questions ---------- */

export interface GlossaryTerm extends Sourced {
  term: string;
  definition: string;
  category: "commercial" | "material-engineering" | "planning" | "quality-compliance" | "systems" | "trade" | "general";
}

export interface OpenQuestion extends Sourced {
  id: string;
  question: string;
  affects: string[];
  status: "open" | "partly-answered" | "answered";
}

export interface ResearchGap extends Sourced {
  id: string;
  gap: string;
  why: string;
}

export interface Contradiction {
  id: string;
  topic: string;
  versions: { value: string; sources: string[] }[];
  resolution: string;
}
