// Business-rules register (chapter "rules"): every agreed rule with its status period, context and owner.
// Rule text: the business-rules specification (source RULES, §1–§12) and the working sessions (source WS).
// Rules the Operations chapter already shows keep their text in content/lifecycle.ts and are pulled in by id.
//
// SAMPLE: activeFrom / activeTo, contexts and owners are illustrative until Rossell confirms them.
// Change the dates in SAMPLE_PERIODS (one place) and the per-rule `ctx` / `owner` below.
import type { DataColor } from "@/lib/dataColors";
import type { RuleContext, RuleOrigin, RuleRecord, RuleStrength } from "./types-extra";
import { businessRules } from "./lifecycle";
import { openQuestions } from "./openQuestions";

/* ---------- vocabularies ---------- */

/** What a rule applies to. Colours follow DESIGN.md order and stay the same everywhere. */
export const RULE_CONTEXTS: Record<RuleContext, { label: string; colour: DataColor; blurb: string }> = {
  "engineering-bom": { label: "Engineering BOM", colour: "sage", blurb: "Rossell's own bill of materials per finished good and plant, and its revisions." },
  "customer-submission": { label: "Customer submission", colour: "slate", blurb: "Customer BOMs, files and part-number mapping to Rossell materials." },
  "customer-order": { label: "Customer order", colour: "tan", blurb: "Firm customer demand: ERP open orders, past-due and remaining quantities." },
  "customer-forecast": { label: "Customer forecast", colour: "lavender", blurb: "Forecast files from customers, their versions and the exclusion horizon." },
  "supplier-order": { label: "Supplier order", colour: "olive", blurb: "Purchase orders, in-transit supply, promise dates and VMI stock." },
  contractor: { label: "Contractor", colour: "teal", blurb: "Work and material out with subcontractors (special processes, job work)." },
  "inventory-allocation": { label: "Inventory & allocation", colour: "rose", blurb: "Stock on hand, kitting and allocation to work orders." },
  "planning-run": { label: "Planning run", colour: "moss", blurb: "Demand consolidation, forecast explosion and net-demand runs." },
};

export const RULE_CONTEXT_ORDER = Object.keys(RULE_CONTEXTS) as RuleContext[];

export const RULE_OWNERS = ["Engineering", "PPC", "SCM", "Sales & CS", "Stores", "IT & data"] as const;
export type RuleOwner = (typeof RULE_OWNERS)[number];

export const RULE_STRENGTHS: Record<RuleStrength, { label: string; blurb: string }> = {
  must: { label: "Must", blurb: "Binding: the system enforces it." },
  should: { label: "Should", blurb: "Recommended design; may change in the physical model." },
  may: { label: "May", blurb: "Allowed or possible, not required." },
};

export const RULE_ORIGINS: Record<RuleOrigin, { label: string }> = {
  spec: { label: "Business-rules spec" },
  session: { label: "Working session" },
};

/** SAMPLE effective dates, one per agreement batch. Replace with confirmed dates. */
export const SAMPLE_PERIODS = {
  /** §2.1, §2.2 and §7 agreed first. */
  specV1: "2026-08-03",
  /** Working-session rules (forecast, promise dates, buyer controls, allocation). */
  sessions: "2026-09-14",
  /** §1 and §2.3–§4: upload, consolidation, customer mapping, demand sources. */
  specV2: "2026-10-12",
  /** §5, §6, §8, §9, §12: forecast exclusion, consolidation, design, auditability (date of the RULES draft). */
  specV3: "2026-11-07",
  /** Rules whose core waits on an open question: scheduled for after the confirmation session. */
  pending: "2027-01-04",
} as const;

type Batch = Exclude<keyof typeof SAMPLE_PERIODS, "pending">;

export interface RuleSection {
  /** "2.3", "WS-A". */
  id: string;
  label: string;
  /** Spec part the section belongs to (groups the Section filter). */
  part: string;
  batch: Batch;
}

export const RULE_SECTIONS: RuleSection[] = [
  { id: "1", label: "Business domains", part: "Overview", batch: "specV2" },
  { id: "2.1", label: "BOM identity", part: "Engineering and BOM", batch: "specV1" },
  { id: "2.2", label: "BOM revision management", part: "Engineering and BOM", batch: "specV1" },
  { id: "2.3", label: "BOM upload and replacement", part: "Engineering and BOM", batch: "specV2" },
  { id: "2.4", label: "Component consolidation", part: "Engineering and BOM", batch: "specV2" },
  { id: "3.1", label: "Customer submission", part: "Customer BOM and mapping", batch: "specV2" },
  { id: "3.2", label: "Customer product / BOM mapping", part: "Customer BOM and mapping", batch: "specV2" },
  { id: "3.3", label: "Customer part-number mapping", part: "Customer BOM and mapping", batch: "specV2" },
  { id: "4.1", label: "ERP demand", part: "Demand sources", batch: "specV2" },
  { id: "4.2", label: "Customer forecast", part: "Demand sources", batch: "specV2" },
  { id: "5.1", label: "Configurable horizon", part: "Forecast exclusion", batch: "specV3" },
  { id: "5.2", label: "Forecast treatment", part: "Forecast exclusion", batch: "specV3" },
  { id: "6", label: "Demand consolidation", part: "Consolidation and net demand", batch: "specV3" },
  { id: "7", label: "Net demand and supply", part: "Consolidation and net demand", batch: "specV1" },
  { id: "8", label: "Demand processing design", part: "Design and audit", batch: "specV3" },
  { id: "9", label: "Auditability and reproducibility", part: "Design and audit", batch: "specV3" },
  { id: "12", label: "Implementation boundary", part: "Design and audit", batch: "specV3" },
  { id: "WS-F", label: "Forecast handling", part: "Working sessions", batch: "sessions" },
  { id: "WS-D", label: "Promise dates", part: "Working sessions", batch: "sessions" },
  { id: "WS-B", label: "Buyer controls", part: "Working sessions", batch: "sessions" },
  { id: "WS-A", label: "Allocation", part: "Working sessions", batch: "sessions" },
];

const sectionById = new Map(RULE_SECTIONS.map((s) => [s.id, s]));
export const getRuleSection = (id: string) => sectionById.get(id);
/** "§2.3 BOM upload and replacement" / "Sessions · Allocation". */
export const ruleSectionLabel = (id: string) => {
  const s = sectionById.get(id);
  if (!s) return id;
  return s.id.startsWith("WS") ? `Sessions · ${s.label}` : `§${s.id} ${s.label}`;
};

/* ---------- rules ---------- */

type Meta = {
  title: string;
  ctx: RuleContext[];
  str: RuleStrength;
  owner: RuleOwner;
  entities?: string[];
  q?: string[];
  plain?: string;
  /** Override the section's batch date. */
  from?: string;
  to?: string;
  supersededBy?: string;
};

type Draft = Omit<RuleRecord, "order" | "activeFrom"> & { activeFrom?: string };

const legacyById = new Map(businessRules.map((r) => [r.id, r]));

/** A rule from the business-rules spec, quoted as written. */
const spec = (section: string, id: string, text: string, m: Meta): Draft => ({
  id,
  section,
  text,
  plain: m.plain,
  title: m.title,
  contexts: m.ctx,
  strength: m.str,
  owner: m.owner,
  origin: "spec",
  entities: m.entities,
  questions: m.q,
  activeFrom: m.from,
  activeTo: m.to,
  supersededBy: m.supersededBy,
  sources: ["RULES"],
  confidence: "rules",
});

/** A rule already in content/lifecycle.ts (shown in Operations): text, sources and confidence come from there. */
const known = (section: string, id: string, m: Meta): Draft => {
  const r = legacyById.get(id);
  if (!r) throw new Error(`content/rules.ts: unknown business rule ${id}`);
  return {
    id,
    section,
    text: r.text,
    plain: m.plain ?? r.plain,
    title: m.title,
    contexts: m.ctx,
    strength: m.str,
    owner: m.owner,
    origin: r.confidence === "session" ? "session" : "spec",
    entities: m.entities,
    questions: m.q,
    activeFrom: m.from,
    activeTo: m.to,
    supersededBy: m.supersededBy,
    sources: r.sources,
    confidence: r.confidence,
    note: r.note,
  };
};

const P = SAMPLE_PERIODS;

const drafts: Draft[] = [
  // §1 Business domain overview
  spec("1", "R1.1", "The solution must maintain three distinct but interconnected business domains: Engineering, Customer BOM and Demand, and Demand Processing.", {
    title: "Three connected business domains",
    ctx: ["engineering-bom", "customer-submission", "planning-run"],
    str: "must",
    owner: "IT & data",
    plain: "Engineering says what Rossell builds; customer data says what is asked for; demand processing turns both into raw-material demand.",
  }),
  spec("1", "R1.2", "The original files and records received from different sources must be retained in the pre-staging domain.", {
    title: "Keep originals in pre-staging",
    ctx: ["customer-submission", "customer-forecast", "customer-order"],
    str: "must",
    owner: "IT & data",
  }),
  spec("1", "R1.3", "The canonical business model must not be designed around individual spreadsheet formats.", {
    title: "Model independent of spreadsheet formats",
    ctx: ["customer-submission", "customer-forecast"],
    str: "must",
    owner: "IT & data",
  }),

  // §2.1 BOM identity
  known("2.1", "R2.1.1", { title: "One BOM per finished good and plant", ctx: ["engineering-bom"], str: "must", owner: "Engineering", entities: ["bom.bom_definition"] }),
  known("2.1", "R2.1.2", { title: "Finished good uses the material master", ctx: ["engineering-bom"], str: "must", owner: "Engineering", entities: ["bom.bom_definition"], q: ["Q8"] }),
  known("2.1", "R2.1.3", { title: "BOM belongs to a Rossell plant", ctx: ["engineering-bom"], str: "must", owner: "Engineering", entities: ["bom.bom_definition"], q: ["Q6"] }),
  known("2.1", "R2.1.4", { title: "Customer is not part of BOM identity", ctx: ["engineering-bom", "customer-submission"], str: "must", owner: "Engineering", entities: ["bom.bom_definition"] }),
  known("2.1", "R2.1.5", { title: "Separate BOMs per plant allowed", ctx: ["engineering-bom"], str: "may", owner: "Engineering", entities: ["bom.bom_definition"], q: ["Q6", "Q12"] }),

  // §2.2 BOM revision management
  known("2.2", "R2.2.1", { title: "BOMs have revisions over time", ctx: ["engineering-bom"], str: "may", owner: "Engineering", entities: ["bom.bom_revision"] }),
  known("2.2", "R2.2.2", { title: "Latest accepted revision is current", ctx: ["engineering-bom"], str: "must", owner: "Engineering", entities: ["bom.bom_revision"] }),
  known("2.2", "R2.2.3", { title: "Current revision stays in main tables", ctx: ["engineering-bom"], str: "must", owner: "IT & data", entities: ["bom.bom_revision", "bom.bom_component"] }),
  known("2.2", "R2.2.4", { title: "Keep effective dates per revision", ctx: ["engineering-bom"], str: "must", owner: "Engineering", entities: ["bom.bom_revision"], q: ["Q7"] }),
  known("2.2", "R2.2.5", { title: "Resolve revision by planning date", ctx: ["engineering-bom", "planning-run"], str: "must", owner: "PPC", entities: ["bom.bom_revision"], q: ["Q7", "Q15"] }),
  known("2.2", "R2.2.6", { title: "Latest is not always effective", ctx: ["engineering-bom"], str: "must", owner: "Engineering", entities: ["bom.bom_revision"] }),
  known("2.2", "R2.2.7", { title: "Archive old revisions as snapshots", ctx: ["engineering-bom"], str: "must", owner: "IT & data", entities: ["bom.bom_revision_history"] }),
  known("2.2", "R2.2.8", { title: "History stays with its revision", ctx: ["engineering-bom"], str: "must", owner: "IT & data", entities: ["bom.bom_component_history"] }),
  known("2.2", "R2.2.9", { title: "Planning run keeps its BOM revision", ctx: ["planning-run", "engineering-bom"], str: "must", owner: "PPC", entities: ["planning.demand_planning_run", "bom.bom_revision"] }),

  // §2.3 BOM upload and replacement
  spec("2.3", "R2.3.1", "An uploaded BOM represents a complete replacement of the existing component set.", {
    title: "Upload replaces the whole component set",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "Engineering",
    entities: ["bom.bom_component"],
  }),
  spec("2.3", "R2.3.2", "The uploaded BOM must be validated before replacing the current accepted revision.", {
    title: "Validate before replacing",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "Engineering",
    entities: ["bom.bom_revision"],
  }),
  spec("2.3", "R2.3.3", "The previous accepted revision and its complete component set must be archived before publishing the new revision.", {
    title: "Archive before publishing",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "IT & data",
    entities: ["bom.bom_revision_history", "bom.bom_component_history"],
  }),
  spec("2.3", "R2.3.4", "Archiving and publishing must be performed atomically.", {
    title: "Archive and publish together",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "IT & data",
    plain: "Either both happen or neither does, so there is never a half-published BOM.",
  }),
  spec("2.3", "R2.3.5", "If validation or publication fails, the existing current BOM must remain unchanged.", {
    title: "Failed upload changes nothing",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "IT & data",
  }),
  spec("2.3", "R2.3.6", "Components omitted from the new accepted BOM are removed from the current component set but retained in historical snapshots.", {
    title: "Omitted components move to history",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "Engineering",
    entities: ["bom.bom_component", "bom.bom_component_history"],
  }),
  spec("2.3", "R2.3.7", "Rejected uploads must not replace the accepted engineering definition.", {
    title: "Rejected uploads never replace",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "Engineering",
  }),

  // §2.4 Component consolidation
  spec("2.4", "R2.4.1", "Identical component materials may be consolidated where possible.", {
    title: "Identical components may merge",
    ctx: ["engineering-bom"],
    str: "may",
    owner: "Engineering",
    q: ["Q16"],
    from: P.pending,
  }),
  spec("2.4", "R2.4.2", "Consolidation must not discard meaningful engineering distinctions.", {
    title: "Keep engineering distinctions",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "Engineering",
    q: ["Q16"],
  }),
  spec("2.4", "R2.4.3", "Material identity must be based on verified canonical material mapping, not description similarity alone.", {
    title: "Identity from verified mapping",
    ctx: ["engineering-bom", "customer-submission"],
    str: "must",
    owner: "Engineering",
    plain: "Two lines that both say 'connector, 12-way' are not the same part until the material mapping says so.",
  }),
  spec("2.4", "R2.4.4", "Operation, UOM, batch basis and other relevant engineering attributes must be considered.", {
    title: "Compare operation, UOM and batch basis",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "Engineering",
    q: ["Q16"],
  }),
  spec("2.4", "R2.4.5", "Quantities may be aggregated only when the relevant attributes and units are compatible.", {
    title: "Aggregate only compatible quantities",
    ctx: ["engineering-bom"],
    str: "may",
    owner: "Engineering",
    q: ["Q16"],
    from: P.pending,
  }),
  spec("2.4", "R2.4.6", "Source component lines must remain traceable even when consolidated in the accepted engineering representation.", {
    title: "Source lines stay traceable",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "IT & data",
    entities: ["bom.bom_component"],
  }),
  spec("2.4", "R2.4.7", "Ambiguous lines must be flagged for review rather than automatically combined.", {
    title: "Flag ambiguous lines for review",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "Engineering",
  }),

  // §3.1 Customer submission
  spec("3.1", "R3.1.1", "Customers may submit BOM and demand information in different file formats.", {
    title: "Customers use different file formats",
    ctx: ["customer-submission", "customer-forecast"],
    str: "may",
    owner: "Sales & CS",
  }),
  spec("3.1", "R3.1.2", "Different customer representatives may provide different formats.", {
    title: "Formats vary by representative",
    ctx: ["customer-submission"],
    str: "may",
    owner: "Sales & CS",
  }),
  spec("3.1", "R3.1.3", "Original uploaded files, source headers and source rows must be retained in pre-staging.", {
    title: "Keep original files, headers and rows",
    ctx: ["customer-submission"],
    str: "must",
    owner: "IT & data",
    entities: ["bom.customer_submission", "bom.customer_submission_line"],
  }),
  spec("3.1", "R3.1.4", "Customer submission processing must be independent of the original spreadsheet structure.", {
    title: "Processing ignores sheet layout",
    ctx: ["customer-submission"],
    str: "must",
    owner: "IT & data",
  }),
  spec("3.1", "R3.1.5", "Customer submissions may contain finished-good demand, customer forecast, customer-defined BOM structures, or a combination of these.", {
    title: "What a submission may contain",
    ctx: ["customer-submission", "customer-order", "customer-forecast"],
    str: "may",
    owner: "Sales & CS",
    entities: ["bom.customer_submission", "bom.customer_bom_structure_node"],
    q: ["Q17"],
  }),
  spec("3.1", "R3.1.6", "A customer submission is not an engineering revision of Rossell's BOM.", {
    title: "A submission is not a BOM revision",
    ctx: ["customer-submission", "engineering-bom"],
    str: "must",
    owner: "Engineering",
  }),
  spec("3.1", "R3.1.7", "Customer-submitted information must not overwrite Rossell engineering definitions.", {
    title: "Customer data never overwrites engineering",
    ctx: ["customer-submission", "engineering-bom"],
    str: "must",
    owner: "Engineering",
  }),

  // §3.2 Customer product / BOM mapping
  spec("3.2", "R3.2.1", "The customer product or submitted BOM must be mapped to the corresponding Rossell finished-good material and engineering BOM.", {
    title: "Map customer product to Rossell BOM",
    ctx: ["customer-submission", "engineering-bom"],
    str: "must",
    owner: "Engineering",
    entities: ["bom.customer_bom_mapping"],
  }),
  spec("3.2", "R3.2.2", "The mapping must retain the specific matched engineering revision.", {
    title: "Mapping keeps the matched revision",
    ctx: ["customer-submission", "engineering-bom"],
    str: "must",
    owner: "Engineering",
    entities: ["bom.customer_bom_mapping", "bom.bom_revision"],
  }),
  spec("3.2", "R3.2.3", "Confirmed mappings must remain pinned to the matched revision.", {
    title: "Confirmed mappings stay pinned",
    ctx: ["customer-submission"],
    str: "must",
    owner: "Engineering",
    entities: ["bom.customer_bom_mapping"],
  }),
  spec("3.2", "R3.2.4", "A newer Rossell revision must not silently update an existing customer mapping.", {
    title: "New revisions never silently remap",
    ctx: ["customer-submission", "engineering-bom"],
    str: "must",
    owner: "Engineering",
    plain: "When Rev E is accepted, a customer mapped to Rev D stays on Rev D until someone remaps it.",
  }),
  spec("3.2", "R3.2.5", "Remapping must require an explicit action.", {
    title: "Remapping is an explicit action",
    ctx: ["customer-submission"],
    str: "must",
    owner: "Engineering",
  }),
  spec("3.2", "R3.2.6", "Mapping decisions must retain their source evidence, status and audit details.", {
    title: "Mappings keep evidence and audit",
    ctx: ["customer-submission"],
    str: "must",
    owner: "IT & data",
    entities: ["bom.customer_bom_mapping"],
  }),

  // §3.3 Customer part-number mapping
  spec("3.3", "R3.3.1", "A customer may have its own part number for a Rossell material.", {
    title: "Customers have their own part numbers",
    ctx: ["customer-submission"],
    str: "may",
    owner: "Sales & CS",
  }),
  spec("3.3", "R3.3.2", "The system must support mapping customer part numbers to Rossell canonical materials.", {
    title: "Map customer part numbers to materials",
    ctx: ["customer-submission"],
    str: "must",
    owner: "Sales & CS",
    entities: ["bom.customer_material_mapping"],
    q: ["Q8"],
  }),
  spec("3.3", "R3.3.3", "Customer part numbers must be scoped by customer.", {
    title: "Part numbers are scoped by customer",
    ctx: ["customer-submission"],
    str: "must",
    owner: "IT & data",
    entities: ["bom.customer_material_mapping"],
  }),
  spec("3.3", "R3.3.4", "Customer part numbers must be retained as text in their original form.", {
    title: "Keep part numbers as original text",
    ctx: ["customer-submission"],
    str: "must",
    owner: "IT & data",
    plain: "Leading zeros, dashes and suffixes stay exactly as the customer wrote them.",
  }),
  spec("3.3", "R3.3.5", "The same customer part number may have different meanings for different customers.", {
    title: "Same number, different customers",
    ctx: ["customer-submission"],
    str: "may",
    owner: "Sales & CS",
  }),
  spec("3.3", "R3.3.6", "A missing customer part number is not automatically an error.", {
    title: "A missing part number is not an error",
    ctx: ["customer-submission"],
    str: "must",
    owner: "Sales & CS",
  }),
  spec("3.3", "R3.3.7", "The system must distinguish: not provided, not yet mapped, confirmed mapping, rejected mapping and conflicting mapping.", {
    title: "Five mapping states",
    ctx: ["customer-submission"],
    str: "must",
    owner: "IT & data",
    entities: ["bom.customer_material_mapping"],
    plain: "Each state is shown on its own, so a gap is never mistaken for a conflict.",
  }),
  spec("3.3", "R3.3.8", "Mapping decisions must retain evidence and audit information.", {
    title: "Part-number decisions keep evidence",
    ctx: ["customer-submission"],
    str: "must",
    owner: "IT & data",
    entities: ["bom.customer_material_mapping"],
  }),
  spec("3.3", "R3.3.9", "Where required, customer component lines must also be mapped to specific Rossell BOM component lines.", {
    title: "Map customer lines to BOM lines",
    ctx: ["customer-submission", "engineering-bom"],
    str: "must",
    owner: "Engineering",
    entities: ["bom.customer_bom_component_mapping", "bom.bom_component"],
  }),

  // §4.1 ERP demand
  spec("4.1", "R4.1.1", "ERP open-demand records are one source of demand.", {
    title: "ERP open demand is a source",
    ctx: ["customer-order"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_record"],
  }),
  spec("4.1", "R4.1.2", "Past-due demand and remaining required quantities must be considered.", {
    title: "Count past-due and remaining quantity",
    ctx: ["customer-order", "planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_record"],
  }),
  spec("4.1", "R4.1.3", "ERP demand is always included in consolidated demand.", {
    title: "ERP demand is always included",
    ctx: ["customer-order", "planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.consolidated_demand"],
  }),
  spec("4.1", "R4.1.4", "ERP source records must remain independently traceable.", {
    title: "ERP records stay traceable",
    ctx: ["customer-order"],
    str: "must",
    owner: "IT & data",
    entities: ["planning.demand_record"],
  }),

  // §4.2 Customer forecast
  spec("4.2", "R4.2.1", "Customer forecast documents are another source of demand.", {
    title: "Customer forecast is a source",
    ctx: ["customer-forecast"],
    str: "must",
    owner: "Sales & CS",
    entities: ["planning.forecast_record"],
  }),
  spec("4.2", "R4.2.2", "Forecast may arrive through multiple files and formats.", {
    title: "Forecast arrives in many files",
    ctx: ["customer-forecast"],
    str: "may",
    owner: "Sales & CS",
  }),
  spec("4.2", "R4.2.3", "Forecast may be expressed against finished goods, wire bundles or customer product identifiers.", {
    title: "Forecast by FG, bundle or customer product",
    ctx: ["customer-forecast", "customer-submission"],
    str: "may",
    owner: "Sales & CS",
  }),
  spec("4.2", "R4.2.4", "Customer identifiers must be mapped to Rossell canonical materials and engineering BOMs.", {
    title: "Map forecast identifiers to BOMs",
    ctx: ["customer-forecast", "customer-submission"],
    str: "must",
    owner: "PPC",
    entities: ["bom.customer_bom_mapping", "bom.customer_material_mapping"],
  }),
  spec("4.2", "R4.2.5", "Forecast records must preserve their original source and version.", {
    title: "Keep forecast source and version",
    ctx: ["customer-forecast"],
    str: "must",
    owner: "IT & data",
    entities: ["planning.forecast_record"],
    q: ["Q18", "Q19"],
  }),
  spec("4.2", "R4.2.6", "Eligible forecast beyond the configured exclusion horizon must be exploded through the applicable engineering BOM into raw-material requirements.", {
    title: "Explode eligible forecast into materials",
    ctx: ["customer-forecast", "planning-run", "engineering-bom"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_calculation_detail"],
    q: ["Q15"],
  }),

  // §5.1 Configurable horizon
  spec("5.1", "R5.1.1", "The forecast exclusion horizon must be configurable.", {
    title: "Exclusion horizon is configurable",
    ctx: ["planning-run", "customer-forecast"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_horizon_rule"],
    q: ["Q2"],
  }),
  spec("5.1", "R5.1.2", "Six months is an example, not a fixed value.", {
    title: "Six months is only an example",
    ctx: ["planning-run", "customer-forecast"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_horizon_rule"],
    plain: "Replaces the fixed six months for LAM noted in the working sessions.",
  }),
  spec("5.1", "R5.1.3", "Four months or other business-defined periods must also be supported.", {
    title: "Any business-defined period",
    ctx: ["planning-run", "customer-forecast"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_horizon_rule"],
  }),
  spec("5.1", "R5.1.4", "The horizon must be derived from the planning date.", {
    title: "Horizon counts from the planning date",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
    q: ["Q14"],
  }),
  spec("5.1", "R5.1.5", "The horizon must not be hard-coded in application logic.", {
    title: "Never hard-code the horizon",
    ctx: ["planning-run"],
    str: "must",
    owner: "IT & data",
    plain: "Replaces the fixed two-month default noted in the working sessions.",
  }),
  spec("5.1", "R5.1.6", "Configuration must support effective dates and audit history.", {
    title: "Horizon settings are dated and audited",
    ctx: ["planning-run"],
    str: "must",
    owner: "IT & data",
    entities: ["planning.demand_horizon_rule"],
  }),
  spec("5.1", "R5.1.7", "Each planning run must preserve the rule and configuration version used.", {
    title: "Run keeps its rule version",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_planning_run", "planning.demand_horizon_rule"],
  }),

  // §5.2 Forecast treatment
  spec("5.2", "R5.2.1", "Forecast within the exclusion horizon is not added again to demand.", {
    title: "In-horizon forecast is not added again",
    ctx: ["customer-forecast", "planning-run"],
    str: "must",
    owner: "PPC",
    q: ["Q13"],
    from: P.pending,
    plain: "Inside the horizon, firm ERP demand already covers it. Whether that holds only when matching ERP demand exists is still open.",
  }),
  spec("5.2", "R5.2.2", "Forecast beyond the exclusion horizon is exploded through the applicable BOM and added to raw-material demand.", {
    title: "Beyond-horizon forecast is added",
    ctx: ["customer-forecast", "planning-run", "engineering-bom"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_calculation_detail"],
    q: ["Q15"],
  }),
  spec("5.2", "R5.2.3", "Excluded forecast records must not be deleted.", {
    title: "Excluded forecast is never deleted",
    ctx: ["customer-forecast"],
    str: "must",
    owner: "IT & data",
    entities: ["planning.forecast_record"],
  }),
  spec("5.2", "R5.2.4", "Excluded quantities and exclusion reasons must remain available for reconciliation.", {
    title: "Keep exclusions and their reasons",
    ctx: ["customer-forecast", "planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_calculation_detail"],
  }),
  spec("5.2", "R5.2.5", "The system must retain the ERP demand contribution and forecast contribution separately.", {
    title: "ERP and forecast kept apart",
    ctx: ["planning-run", "customer-order", "customer-forecast"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_calculation_detail"],
  }),
  spec("5.2", "R5.2.6", "Consolidated demand must be independently identifiable.", {
    title: "Consolidated demand is identifiable",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.consolidated_demand"],
  }),

  // §6 Demand consolidation
  spec("6", "R6.1", "Consolidated Demand = ERP Demand + Eligible Forecast-Derived Raw-Material Demand.", {
    title: "Consolidated demand formula",
    ctx: ["planning-run", "customer-order", "customer-forecast"],
    str: "must",
    owner: "PPC",
    entities: ["planning.consolidated_demand"],
    plain: "RM-200: 200 from ERP plus 150 from forecast gives 350 consolidated.",
  }),
  spec("6", "R6.2", "Forecast-derived raw-material demand is calculated by exploding eligible finished-good forecast through the applicable engineering BOM.", {
    title: "Forecast demand comes from BOM explosion",
    ctx: ["planning-run", "customer-forecast", "engineering-bom"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_calculation_detail"],
    q: ["Q15"],
  }),
  spec("6", "R6.3", "The system must retain ERP demand, forecast demand received, forecast demand excluded, forecast demand included after BOM explosion, and consolidated raw-material demand.", {
    title: "Retain all five demand figures",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_calculation_detail", "planning.consolidated_demand"],
  }),
  spec("6", "R6.4", "These values must not be collapsed into one figure without retaining their individual contributions.", {
    title: "Never collapse into one figure",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
  }),
  spec("6", "R6.5", "The planner must be able to trace every consolidated figure to its contributing source records.", {
    title: "Trace every figure to its sources",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_calculation_detail"],
  }),

  // §7 Net demand and supply
  known("7", "RND.1", { title: "Net demand formula", ctx: ["planning-run", "supplier-order"], str: "must", owner: "PPC", entities: ["planning.consolidated_demand"] }),
  known("7", "RND.2", { title: "In-flight means open POs and in transit", ctx: ["supplier-order", "contractor"], str: "must", owner: "SCM" }),
  known("7", "RND.3", { title: "Received material is inventory", ctx: ["inventory-allocation", "supplier-order"], str: "must", owner: "Stores", q: ["Q4"] }),
  known("7", "RND.4", { title: "Received is not in-flight again", ctx: ["supplier-order", "contractor", "inventory-allocation"], str: "must", owner: "Stores" }),
  known("7", "RND.5", { title: "Supply kept apart from demand", ctx: ["planning-run", "inventory-allocation"], str: "must", owner: "PPC" }),
  known("7", "RND.6", { title: "Procurement may weigh stock and rules", ctx: ["supplier-order", "planning-run"], str: "may", owner: "SCM" }),

  // §8 Demand processing: logical design
  spec("8", "R8.1", "The recommended logical processing entities are the demand horizon rule, the demand planning run, the demand calculation detail and the consolidated demand.", {
    title: "Four logical processing entities",
    ctx: ["planning-run"],
    str: "should",
    owner: "IT & data",
    entities: ["planning.demand_horizon_rule", "planning.demand_planning_run", "planning.demand_calculation_detail", "planning.consolidated_demand"],
    plain: "Logical entities: some may end up as views or materialised views rather than tables.",
  }),
  spec("8", "R8.2", "Each planning run should preserve the planning date, exclusion horizon, rule/configuration version, source data batches or versions, execution status, execution timestamp and calculation metadata.", {
    title: "What each planning run records",
    ctx: ["planning-run"],
    str: "should",
    owner: "IT & data",
    entities: ["planning.demand_planning_run"],
  }),
  spec("8", "R8.3", "Each calculation detail should preserve the original source record, source type (ERP or forecast), original quantity and period, inclusion or exclusion decision and reason, finished good, BOM definition and revision used, component material, BOM quantity and UOM, calculated raw-material quantity and the resulting consolidated-demand reference.", {
    title: "What each calculation line records",
    ctx: ["planning-run"],
    str: "should",
    owner: "IT & data",
    entities: ["planning.demand_calculation_detail"],
  }),
  spec("8", "R8.4", "Consolidated demand must support aggregation by raw material, planning period, customer, project and wire bundle or finished good, and expose ERP demand, forecast contribution and consolidated demand separately.", {
    title: "Five ways to aggregate demand",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.consolidated_demand"],
  }),

  // §9 Auditability and reproducibility
  spec("9", "R9.1", "Original source files and source rows must remain available.", {
    title: "Source files and rows stay available",
    ctx: ["customer-submission", "customer-forecast", "customer-order"],
    str: "must",
    owner: "IT & data",
  }),
  spec("9", "R9.2", "Normalized records must retain source lineage.", {
    title: "Normalised records keep lineage",
    ctx: ["customer-submission", "customer-forecast"],
    str: "must",
    owner: "IT & data",
  }),
  spec("9", "R9.3", "Customer mappings must retain confirmation evidence.", {
    title: "Mappings keep confirmation evidence",
    ctx: ["customer-submission"],
    str: "must",
    owner: "Sales & CS",
    entities: ["bom.customer_bom_mapping", "bom.customer_material_mapping"],
  }),
  spec("9", "R9.4", "Engineering revisions must retain complete historical snapshots.", {
    title: "Revisions keep full snapshots",
    ctx: ["engineering-bom"],
    str: "must",
    owner: "Engineering",
    entities: ["bom.bom_revision_history", "bom.bom_component_history"],
  }),
  spec("9", "R9.5", "Forecast submissions must retain their versions.", {
    title: "Forecasts keep their versions",
    ctx: ["customer-forecast"],
    str: "must",
    owner: "IT & data",
    entities: ["planning.forecast_record"],
    q: ["Q18"],
  }),
  spec("9", "R9.6", "Every demand planning run must be reproducible using its original source and configuration references.", {
    title: "Every planning run is reproducible",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.demand_planning_run"],
  }),
  spec("9", "R9.7", "A new forecast or engineering revision must not silently change the historical result of an earlier planning run.", {
    title: "New inputs never rewrite past runs",
    ctx: ["planning-run", "customer-forecast", "engineering-bom"],
    str: "must",
    owner: "PPC",
  }),
  spec("9", "R9.8", "Reconciliation exceptions must be visible to planners.", {
    title: "Exceptions are visible to planners",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
  }),

  // §12 Implementation boundary
  spec("12", "R12.1", "No new database tables, migrations, database constraints or application changes are authorized until the logical model, relationships, attributes, business keys, lifecycle rules and validation rules have been reviewed and explicitly approved.", {
    title: "No build before the model is approved",
    ctx: ["planning-run", "engineering-bom", "customer-submission"],
    str: "must",
    owner: "IT & data",
    plain: "The current work is logical design only; implementation starts after explicit approval.",
  }),

  // Working sessions: forecast handling
  known("WS-F", "WS.F1", { title: "Forecast only beyond horizon + buffer", ctx: ["customer-forecast", "planning-run"], str: "must", owner: "PPC", q: ["Q2"] }),
  known("WS-F", "WS.F2", { title: "First two months excluded by default", ctx: ["customer-forecast", "planning-run"], str: "must", owner: "PPC", to: P.specV3, supersededBy: "R5.1.5" }),
  known("WS-F", "WS.F3", { title: "LAM: first six months excluded", ctx: ["customer-forecast", "planning-run"], str: "must", owner: "PPC", to: P.specV3, supersededBy: "R5.1.2" }),
  known("WS-F", "WS.F4", { title: "Whole forecast file quantity is used", ctx: ["customer-forecast"], str: "must", owner: "PPC", q: ["Q18"] }),

  // Working sessions: promise dates
  known("WS-D", "WS.D1", { title: "ETA equals promise date", ctx: ["supplier-order", "contractor"], str: "must", owner: "SCM" }),
  known("WS-D", "WS.D2", { title: "SCM sets promise dates for short parts", ctx: ["supplier-order", "contractor", "inventory-allocation"], str: "must", owner: "SCM" }),

  // Working sessions: buyer controls
  known("WS-B", "WS.B1", { title: "Buyers may override the need date", ctx: ["supplier-order"], str: "may", owner: "SCM" }),
  known("WS-B", "WS.B2", { title: "Pull-ins and push-outs are recorded", ctx: ["supplier-order", "customer-order"], str: "must", owner: "SCM" }),
  known("WS-B", "WS.B3", { title: "Orders may carry safety stock", ctx: ["supplier-order", "inventory-allocation"], str: "may", owner: "SCM" }),
  known("WS-B", "WS.B4", { title: "Suppliers report VMI stock", ctx: ["supplier-order", "inventory-allocation"], str: "may", owner: "SCM", q: ["Q5"] }),

  // Working sessions: allocation
  known("WS-A", "WS.A1", { title: "Freeze BOM revision during allocation", ctx: ["inventory-allocation", "engineering-bom"], str: "must", owner: "PPC" }),
  known("WS-A", "WS.A2", { title: "Hard allocation by need date", ctx: ["inventory-allocation"], str: "must", owner: "PPC", q: ["Q3"] }),
  known("WS-A", "WS.A3", { title: "Firmed work orders keep priority", ctx: ["inventory-allocation"], str: "must", owner: "PPC" }),
  known("WS-A", "WS.A4", { title: "Unfirmed orders are realigned", ctx: ["inventory-allocation"], str: "must", owner: "PPC", q: ["Q4"] }),
  known("WS-A", "WS.A5", { title: "Only free stock is available", ctx: ["inventory-allocation"], str: "must", owner: "Stores" }),
  known("WS-A", "WS.A6", { title: "Kit status per wire bundle", ctx: ["inventory-allocation"], str: "must", owner: "Stores" }),
  known("WS-A", "WS.A7", { title: "Configurable priority criteria", ctx: ["inventory-allocation", "customer-order"], str: "must", owner: "PPC", q: ["Q3"] }),
  known("WS-A", "WS.A8", { title: "System suggests, people approve", ctx: ["inventory-allocation"], str: "should", owner: "PPC" }),
];

export const ruleRegister: RuleRecord[] = drafts.map((d, i) => ({
  ...d,
  order: i + 1,
  activeFrom: d.activeFrom ?? SAMPLE_PERIODS[sectionById.get(d.section)?.batch ?? "specV3"],
}));

/** Spec rules that are new to the site (not copies of content/lifecycle.ts), for the Sources fact tally. */
export const newSpecRules: RuleRecord[] = ruleRegister.filter((r) => !legacyById.has(r.id));

const ruleById = new Map(ruleRegister.map((r) => [r.id, r]));
export const getRule = (id: string) => ruleById.get(id);

/** Open questions that gate at least one rule, in id order, with the rules they gate. */
export const ruleQuestions = openQuestions
  .map((q) => ({ question: q, rules: ruleRegister.filter((r) => r.questions?.includes(q.id)) }))
  .filter((x) => x.rules.length > 0);

/** Date the sample periods were last reviewed; used as "today" before the browser's clock is known. */
export const REGISTER_AS_OF = "2026-11-12";

/* ---------- integrity: fail the build on a bad edit ---------- */

function validateRegister() {
  const errors: string[] = [];
  const ids = new Set<string>();
  const questionIds = new Set(openQuestions.map((q) => q.id));
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  for (const r of ruleRegister) {
    if (ids.has(r.id)) errors.push(`duplicate id ${r.id}`);
    ids.add(r.id);
    if (!r.contexts.length) errors.push(`${r.id}: no context`);
    for (const c of r.contexts) if (!(c in RULE_CONTEXTS)) errors.push(`${r.id}: unknown context ${c}`);
    if (new Set(r.contexts).size !== r.contexts.length) errors.push(`${r.id}: repeated context`);
    if (!sectionById.has(r.section)) errors.push(`${r.id}: unknown section ${r.section}`);
    if (!iso.test(r.activeFrom)) errors.push(`${r.id}: activeFrom not ISO`);
    if (r.activeTo && (!iso.test(r.activeTo) || r.activeTo <= r.activeFrom)) errors.push(`${r.id}: activeTo must be an ISO date after activeFrom`);
    for (const q of r.questions ?? []) if (!questionIds.has(q)) errors.push(`${r.id}: unknown question ${q}`);
    if (r.supersededBy && !ruleById.has(r.supersededBy)) errors.push(`${r.id}: unknown supersededBy ${r.supersededBy}`);
    if (r.supersededBy && !r.activeTo) errors.push(`${r.id}: superseded rule needs activeTo`);
  }
  for (const id of legacyById.keys()) if (!ids.has(id)) errors.push(`business rule ${id} (content/lifecycle.ts) is missing from the register`);
  if (errors.length) throw new Error(`content/rules.ts is invalid:\n- ${errors.join("\n- ")}`);
}
validateRegister();
