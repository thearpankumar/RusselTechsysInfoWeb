// Business-rules register (chapter "rules"): every agreed rule with its status period, context and owner.
// Rule text: the business-rules specification (source RULES, §1–§12) and the working sessions (source WS).
// Rules the Operations chapter already shows keep their text in content/lifecycle.ts and are pulled in by id.
//
// Spec rules are quoted as written (statements that end in a list keep the list items verbatim in `list`);
// session rules are as recorded in the session notes.
//
// SAMPLE: each rule's dated state history (draft → review → approved → active → …), its contexts and owner are
// illustrative until Rossell confirms them. Change the batch histories in SAMPLE_HISTORY (one place) and the
// per-rule `ctx` / `owner` / `pending` / `supersede` below. Active/Inactive is always derived from the history.
import type { DataColor } from "@/lib/dataColors";
import type { RuleContext, RuleLifecycle, RuleOrigin, RuleRecord, RuleStateChange, RuleStrength } from "./types-extra";
import { businessRules } from "./lifecycle";
import { openQuestions } from "./openQuestions";

/* ---------- vocabularies ---------- */

/** What a rule applies to. Colours follow DESIGN.md order and stay the same everywhere. */
export const RULE_CONTEXTS: Record<RuleContext, { label: string; colour: DataColor; blurb: string }> = {
  "engineering-bom": { label: "Engineering BOM", colour: "sage", blurb: "Rossell's BOM per finished good and plant, and its revisions." },
  "customer-submission": { label: "Customer submission", colour: "slate", blurb: "Customer files, BOMs and part-number mapping." },
  "customer-order": { label: "Customer order", colour: "tan", blurb: "Firm demand: ERP open orders and past-due quantities." },
  "customer-forecast": { label: "Customer forecast", colour: "lavender", blurb: "Forecast files, their versions and the exclusion horizon." },
  "supplier-order": { label: "Supplier order", colour: "olive", blurb: "Purchase orders, in-transit supply, promise dates, VMI." },
  contractor: { label: "Contractor", colour: "teal", blurb: "Work and material out with subcontractors." },
  "inventory-allocation": { label: "Inventory & allocation", colour: "rose", blurb: "Stock on hand, kitting and allocation to work orders." },
  "planning-run": { label: "Planning run", colour: "moss", blurb: "Consolidation, forecast explosion and net-demand runs." },
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

/** Lifecycle states in their usual order. Only "active" counts as Active. */
export const RULE_STATES: Record<RuleLifecycle, { label: string; blurb: string }> = {
  draft: { label: "Draft", blurb: "Written down, not yet reviewed." },
  review: { label: "Under review", blurb: "Being checked with Rossell's teams." },
  approved: { label: "Approved", blurb: "Agreed, waiting for its start date." },
  active: { label: "Active", blurb: "In force." },
  suspended: { label: "Suspended", blurb: "Paused; may come back." },
  retired: { label: "Retired", blurb: "No longer applies." },
  superseded: { label: "Superseded", blurb: "Replaced by another rule." },
};
export const RULE_STATE_ORDER = Object.keys(RULE_STATES) as RuleLifecycle[];

/** SAMPLE state histories, one per agreement batch. Replace with confirmed dates. */
export const SAMPLE_HISTORY = {
  /** §2.1, §2.2 and §7, agreed first. */
  specV1: [
    { state: "draft", from: "2026-07-06" },
    { state: "review", from: "2026-07-20" },
    { state: "approved", from: "2026-07-29" },
    { state: "active", from: "2026-08-03" },
  ],
  /** Working-session rules (forecast, promise dates, buyer controls, allocation). */
  sessions: [
    { state: "draft", from: "2026-09-07", note: "Recorded in the working sessions." },
    { state: "approved", from: "2026-09-11" },
    { state: "active", from: "2026-09-14" },
  ],
  /** §1 and §2.3–§4: upload, consolidation, customer mapping, demand sources. */
  specV2: [
    { state: "draft", from: "2026-09-21" },
    { state: "review", from: "2026-10-01" },
    { state: "approved", from: "2026-10-08" },
    { state: "active", from: "2026-10-12" },
  ],
  /** §5, §6, §8–§10, §12: forecast exclusion, consolidation, design, auditability (RULES draft of 7 Nov 2026). */
  specV3: [
    { state: "draft", from: "2026-10-19" },
    { state: "review", from: "2026-10-28" },
    { state: "approved", from: "2026-11-04" },
    { state: "active", from: "2026-11-07" },
  ],
} satisfies Record<string, RuleStateChange[]>;

type Batch = keyof typeof SAMPLE_HISTORY;

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
  { id: "10", label: "Logical entity inventory", part: "Design and audit", batch: "specV3" },
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
  /** Items the statement lists, verbatim. */
  list?: string[];
  /** Core still waits on an open question: drafted and under review, not approved yet. */
  pending?: boolean;
  /** Replaced by another rule on a date. */
  supersede?: { on: string; by: string; note?: string };
};

type Draft = Omit<RuleRecord, "order" | "history" | "activeFrom" | "activeTo"> & { meta: Meta };

const legacyById = new Map(businessRules.map((r) => [r.id, r]));

/** A rule from the business-rules spec, quoted as written. */
const spec = (section: string, id: string, text: string, m: Meta): Draft => ({
  id,
  section,
  text,
  list: m.list,
  plain: m.plain,
  title: m.title,
  contexts: m.ctx,
  strength: m.str,
  owner: m.owner,
  origin: "spec",
  entities: m.entities,
  questions: m.q,
  supersededBy: m.supersede?.by,
  sources: ["RULES"],
  confidence: "rules",
  meta: m,
});

/** A rule already in content/lifecycle.ts (shown in Operations): text, sources and confidence come from there. */
const known = (section: string, id: string, m: Meta): Draft => {
  const r = legacyById.get(id);
  if (!r) throw new Error(`content/rules.ts: unknown business rule ${id}`);
  return {
    id,
    section,
    text: r.text,
    list: m.list,
    plain: m.plain ?? r.plain,
    title: m.title,
    contexts: m.ctx,
    strength: m.str,
    owner: m.owner,
    origin: r.confidence === "session" ? "session" : "spec",
    entities: m.entities,
    questions: m.q,
    supersededBy: m.supersede?.by,
    sources: r.sources,
    confidence: r.confidence,
    note: r.note,
    meta: m,
  };
};

/** History from the section's batch, cut short for pending rules and extended for superseded ones. */
function historyFor(d: Draft): RuleStateChange[] {
  const batch = sectionById.get(d.section)?.batch ?? "specV3";
  const base = SAMPLE_HISTORY[batch].map((h) => ({ ...h }) as RuleStateChange);
  if (d.meta.pending) {
    const kept = base.filter((h) => h.state === "draft" || h.state === "review");
    // Session batches have no review step: open one when the rule was recorded.
    if (!kept.some((h) => h.state === "review")) kept.push({ state: "review", from: kept[0].from });
    const last = kept.length - 1;
    kept[last] = { ...kept[last], note: `Waits on ${(d.questions ?? []).join(", ")}.` };
    return kept;
  }
  if (d.meta.supersede) base.push({ state: "superseded", from: d.meta.supersede.on, note: d.meta.supersede.note ?? `Replaced by ${d.meta.supersede.by}.` });
  return base;
}

/** First active date, and the end of the last active span (if it has ended). */
function activeSpan(history: RuleStateChange[]): { activeFrom?: string; activeTo?: string } {
  const first = history.findIndex((h) => h.state === "active");
  if (first < 0) return {};
  let last = first;
  history.forEach((h, i) => {
    if (h.state === "active") last = i;
  });
  return { activeFrom: history[first].from, activeTo: history[last + 1]?.from };
}

const drafts: Draft[] = [
  // §1 Business domain overview
  spec("1", "R1.1", "The solution must maintain three distinct but interconnected business domains:", {
    title: "Three connected business domains",
    list: [
      "Engineering: Defines what Rossell manufactures and the materials required to manufacture each finished good.",
      "Customer BOM and Demand: Captures customer-submitted product structures, demand and forecast information.",
      "Demand Processing: Consolidates ERP demand and customer forecast into raw-material demand using the applicable engineering BOM.",
    ],
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
    pending: true,
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
    pending: true,
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
  spec("3.1", "R3.1.5", "Customer submissions may contain:", {
    list: ["Finished-good demand.", "Customer forecast.", "Customer-defined BOM structures.", "A combination of the above."],
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
  spec("3.3", "R3.3.7", "The system must distinguish:", {
    list: ["Not provided.", "Not yet mapped.", "Confirmed mapping.", "Rejected mapping.", "Conflicting mapping."],
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
    pending: true,
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
  spec("6", "R6.1", "Consolidated Demand = ERP Demand + Eligible Forecast-Derived Raw-Material Demand", {
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
  spec("6", "R6.3", "The system must retain:", {
    list: ["ERP demand.", "Forecast demand received.", "Forecast demand excluded.", "Forecast demand included after BOM explosion.", "Consolidated raw-material demand."],
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
  spec("7", "RND.0", "The planning calculation must distinguish demand from supply.", {
    title: "Demand and supply kept distinct",
    ctx: ["planning-run", "supplier-order"],
    str: "must",
    owner: "PPC",
  }),
  known("7", "RND.1", { title: "Net demand formula", ctx: ["planning-run", "supplier-order"], str: "must", owner: "PPC", entities: ["planning.consolidated_demand"] }),
  known("7", "RND.2", { title: "In-flight means open POs and in transit", ctx: ["supplier-order", "contractor"], str: "must", owner: "SCM" }),
  known("7", "RND.3", { title: "Received material is inventory", ctx: ["inventory-allocation", "supplier-order"], str: "must", owner: "Stores", q: ["Q4"] }),
  known("7", "RND.4", { title: "Received is not in-flight again", ctx: ["supplier-order", "contractor", "inventory-allocation"], str: "must", owner: "Stores" }),
  known("7", "RND.5", { title: "Supply kept apart from demand", ctx: ["planning-run", "inventory-allocation"], str: "must", owner: "PPC" }),
  known("7", "RND.6", { title: "Procurement may weigh stock and rules", ctx: ["supplier-order", "planning-run"], str: "may", owner: "SCM" }),

  // §8 Demand processing: logical design
  spec("8", "R8.1", "The recommended logical processing entities are:", {
    title: "Four logical processing entities",
    ctx: ["planning-run"],
    str: "should",
    owner: "IT & data",
    entities: ["planning.demand_horizon_rule", "planning.demand_planning_run", "planning.demand_calculation_detail", "planning.consolidated_demand"],
    list: [
      "planning.demand_horizon_rule: Configurable forecast exclusion rules.",
      "planning.demand_planning_run: Records each demand consolidation and forecast explosion execution.",
      "planning.demand_calculation_detail: Preserves source contributions, exclusions, BOM explosion details and calculation lineage.",
      "planning.consolidated_demand: Represents the resulting consolidated raw-material demand by material and period.",
    ],
    plain: "These are logical entities: some may end up as views or materialised views rather than physical tables.",
  }),
  spec("8", "R8.2", "Each run should preserve:", {
    title: "What each planning run records",
    ctx: ["planning-run"],
    str: "should",
    owner: "IT & data",
    entities: ["planning.demand_planning_run"],
    list: ["Planning date.", "Exclusion horizon.", "Rule/configuration version.", "Source data batches or versions.", "Execution status.", "Execution timestamp.", "Calculation metadata."],
  }),
  spec("8", "R8.3", "Each calculation detail should preserve:", {
    title: "What each calculation line records",
    ctx: ["planning-run"],
    str: "should",
    owner: "IT & data",
    entities: ["planning.demand_calculation_detail"],
    list: [
      "Original source record.",
      "Source type: ERP or forecast.",
      "Original source quantity and period.",
      "Inclusion/exclusion decision.",
      "Exclusion reason, where applicable.",
      "Finished-good material, where applicable.",
      "BOM definition and revision used.",
      "Component material.",
      "BOM quantity and UOM.",
      "Calculated raw-material quantity.",
      "Resulting consolidated-demand reference.",
    ],
  }),
  spec("8", "R8.4", "The output must support aggregation by:", {
    title: "Five ways to aggregate demand",
    ctx: ["planning-run"],
    str: "must",
    owner: "PPC",
    entities: ["planning.consolidated_demand"],
    list: ["Raw material.", "Planning period.", "Customer.", "Project.", "Wire bundle / finished good, where relevant."],
    plain: "The output is the consolidated raw-material demand.",
  }),
  spec("8", "R8.5", "It must expose ERP demand, forecast contribution and consolidated demand separately.", {
    title: "ERP, forecast and total shown apart",
    ctx: ["planning-run", "customer-order", "customer-forecast"],
    str: "must",
    owner: "PPC",
    entities: ["planning.consolidated_demand"],
    plain: "'It' is the consolidated-demand output in R8.4.",
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

  // §10 Proposed logical entity inventory
  spec("10", "R10.1", "Existing master-data, reference and pre-staging entities should be reused wherever appropriate.", {
    title: "Reuse existing master-data entities",
    ctx: ["engineering-bom", "customer-submission", "planning-run"],
    str: "should",
    owner: "IT & data",
    plain: "The entity list is a proposed logical inventory, not a final list of physical tables.",
  }),

  // §12 Implementation boundary
  spec("12", "R12.1", "No new database tables, migrations, database constraints or application changes are authorized by this document.", {
    title: "This document authorises no build",
    ctx: ["planning-run", "engineering-bom", "customer-submission"],
    str: "must",
    owner: "IT & data",
    plain: "The current activity is logical design and business-rule definition.",
  }),
  spec("12", "R12.2", "Implementation should begin only after the logical model, relationships, attributes, business keys, lifecycle rules and validation rules have been reviewed and explicitly approved.", {
    title: "Build only after explicit approval",
    ctx: ["planning-run", "engineering-bom", "customer-submission"],
    str: "should",
    owner: "IT & data",
  }),

  // Working sessions: forecast handling
  known("WS-F", "WS.F1", { title: "Forecast only beyond horizon + buffer", ctx: ["customer-forecast", "planning-run"], str: "must", owner: "PPC", q: ["Q2"] }),
  known("WS-F", "WS.F2", { title: "First two months excluded by default", ctx: ["customer-forecast", "planning-run"], str: "must", owner: "PPC", supersede: { on: "2026-11-07", by: "R5.1.5", note: "Replaced by R5.1.5: the horizon must not be hard-coded." } }),
  known("WS-F", "WS.F3", { title: "LAM: first six months excluded", ctx: ["customer-forecast", "planning-run"], str: "must", owner: "PPC", supersede: { on: "2026-11-07", by: "R5.1.2", note: "Replaced by R5.1.2: six months is an example, not a fixed value." } }),
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

export const ruleRegister: RuleRecord[] = drafts.map(({ meta: _meta, ...d }, i) => {
  const history = historyFor({ ...d, meta: _meta });
  return { ...d, order: i + 1, history, ...activeSpan(history) };
});

/** Spec rules that are new to the site (not copies of content/lifecycle.ts), for the Sources fact tally. */
export const newSpecRules: RuleRecord[] = ruleRegister.filter((r) => !legacyById.has(r.id));

const ruleById = new Map(ruleRegister.map((r) => [r.id, r]));
export const getRule = (id: string) => ruleById.get(id);

/** Open questions that gate at least one rule, in id order, with the rules they gate. */
export const ruleQuestions = openQuestions
  .map((q) => ({ question: q, rules: ruleRegister.filter((r) => r.questions?.includes(q.id)) }))
  .filter((x) => x.rules.length > 0);

/** Date the sample histories were last reviewed; used as "today" before the browser's clock is known. */
export const REGISTER_AS_OF = "2026-11-12";

/* ---------- integrity: fail the build on a bad edit ---------- */

/** A real calendar date in ISO form (rejects 2026-02-31). */
const isRealDate = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
};

function validateRegister() {
  const errors: string[] = [];
  const ids = new Set<string>();
  const questionIds = new Set(openQuestions.map((q) => q.id));
  const dupes = (xs: string[] | undefined) => !!xs && new Set(xs).size !== xs.length;
  for (const r of ruleRegister) {
    if (ids.has(r.id)) errors.push(`duplicate id ${r.id}`);
    ids.add(r.id);
    if (!r.contexts.length) errors.push(`${r.id}: no context`);
    for (const c of r.contexts) if (!(c in RULE_CONTEXTS)) errors.push(`${r.id}: unknown context ${c}`);
    if (dupes(r.contexts) || dupes(r.questions) || dupes(r.entities)) errors.push(`${r.id}: repeated context, question or entity`);
    if (!sectionById.has(r.section)) errors.push(`${r.id}: unknown section ${r.section}`);
    if (r.list && !r.list.length) errors.push(`${r.id}: empty list`);
    if (!r.history.length) errors.push(`${r.id}: empty history`);
    r.history.forEach((h, i) => {
      if (!(h.state in RULE_STATES)) errors.push(`${r.id}: unknown state ${h.state}`);
      if (!isRealDate(h.from)) errors.push(`${r.id}: history date ${h.from} is not a real ISO date`);
      if (i > 0 && h.from <= r.history[i - 1].from) errors.push(`${r.id}: history dates must strictly increase`);
      if (i > 0 && h.state === r.history[i - 1].state) errors.push(`${r.id}: repeated state ${h.state}`);
    });
    for (const q of r.questions ?? []) if (!questionIds.has(q)) errors.push(`${r.id}: unknown question ${q}`);
    const superseded = r.history.some((h) => h.state === "superseded");
    if (superseded !== !!r.supersededBy) errors.push(`${r.id}: a superseded state and supersededBy go together`);
    if (r.supersededBy) {
      const by = ruleById.get(r.supersededBy);
      const on = r.history.find((h) => h.state === "superseded")?.from;
      if (r.supersededBy === r.id) errors.push(`${r.id}: cannot supersede itself`);
      else if (!by) errors.push(`${r.id}: unknown supersededBy ${r.supersededBy}`);
      else if (on && (!by.activeFrom || by.activeFrom > on)) errors.push(`${r.id}: ${by.id} must be active by ${on}, when it replaces this rule`);
    }
  }
  for (const id of legacyById.keys()) if (!ids.has(id)) errors.push(`business rule ${id} (content/lifecycle.ts) is missing from the register`);
  if (errors.length) throw new Error(`content/rules.ts is invalid:\n- ${errors.join("\n- ")}`);
}
validateRegister();
