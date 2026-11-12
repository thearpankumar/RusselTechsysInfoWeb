// Business-rules register logic: lifecycle state on a date, compare two dates, search, facets, sort, URL state
// and CSV. Pure; no React. Excel export lives in lib/rulesExcel.ts (lazy-loaded).
import type { RuleContext, RuleLifecycle, RuleOrigin, RuleRecord, RuleStateChange, RuleStrength } from "@/content/types-extra";
import {
  RULE_CONTEXTS,
  RULE_CONTEXT_ORDER,
  RULE_ORIGINS,
  RULE_OWNERS,
  RULE_SECTIONS,
  RULE_STATES,
  RULE_STATE_ORDER,
  RULE_STRENGTHS,
  activeSpan,
  ruleRegister,
  ruleSectionLabel,
} from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";

const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

/* ---------- dates ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Range the as-of and compare dates may take (the register's history sits inside it). */
export const AS_OF_MIN = "2026-01-01";
export const AS_OF_MAX = "2028-12-31";

/** A real calendar date in ISO form: rejects 2026-02-31, 0000-01-01 style values. */
export function isIsoDate(s: string | null | undefined): s is string {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return y >= 1000 && t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** A usable as-of date: real and inside [AS_OF_MIN, AS_OF_MAX]. */
export const isAsOfDate = (s: string | null | undefined): s is string => isIsoDate(s) && s >= AS_OF_MIN && s <= AS_OF_MAX;

/** "2026-11-07" → "7 Nov 2026" (no locale or time-zone drift). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "2026-11-07" → "7 Nov". */
export function formatShort(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** Today in the browser's local time zone, as an ISO date. */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Whole days since the epoch (UTC), for timeline maths. */
export const dayNumber = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
};

/* ---------- lifecycle ---------- */

/** "none" = the rule had not been drafted yet on that date. */
export type RuleStateValue = RuleLifecycle | "none";

export const STATE_LABEL: Record<RuleStateValue, string> = {
  ...(Object.fromEntries(RULE_STATE_ORDER.map((s) => [s, RULE_STATES[s].label])) as Record<RuleLifecycle, string>),
  none: "Not yet drafted",
};

/** The history entry in force on `date` (null before the first one). */
export function stateAt(r: RuleRecord, date: string): RuleStateChange | null {
  let cur: RuleStateChange | null = null;
  for (const h of r.history) {
    if (h.from <= date) cur = h;
    else break;
  }
  return cur;
}

export const ruleStateAt = (r: RuleRecord, date: string): RuleStateValue => stateAt(r, date)?.state ?? "none";

/** Active = the "active" lifecycle state. Every other state is Inactive. */
export const isActive = (r: RuleRecord, date: string) => ruleStateAt(r, date) === "active";

/** The change after the one in force on `date`, if any (e.g. the date an approved rule goes live). */
function nextChange(r: RuleRecord, date: string): RuleStateChange | undefined {
  return r.history.find((h) => h.from > date);
}

/** One line for the status cell: the active period, or why the rule is not active. */
export function statusLine(r: RuleRecord, date: string): string {
  const cur = stateAt(r, date);
  const next = nextChange(r, date);
  if (!cur) return `Not yet drafted · first draft ${formatDate(r.history[0].from)}`;
  switch (cur.state) {
    case "active":
      return `${formatDate(cur.from)} → ${next ? formatDate(next.from) : "open"}`;
    case "approved":
      return next?.state === "active" ? `Approved · active from ${formatDate(next.from)}` : `Approved since ${formatDate(cur.from)}`;
    case "review":
      return `Under review since ${formatDate(cur.from)}`;
    case "draft":
      return `Draft since ${formatDate(cur.from)}`;
    case "suspended":
      return `Suspended since ${formatDate(cur.from)}`;
    case "retired":
    case "superseded": {
      const span = r.activeFrom ? `Active ${formatDate(r.activeFrom)} → ${formatDate(cur.from)}` : `${STATE_LABEL[cur.state]} ${formatDate(cur.from)}`;
      return cur.state === "superseded" && r.supersededBy ? `${span} · replaced by ${r.supersededBy}` : span;
    }
  }
}

const openQuestionIds = new Set(openQuestions.filter((q) => q.status !== "answered").map((q) => q.id));

/** Open questions the rule still waits on ("Needs confirmation"). */
export const pendingQuestions = (r: RuleRecord) => (r.questions ?? []).filter((q) => openQuestionIds.has(q));
export const needsConfirmation = (r: RuleRecord) => pendingQuestions(r).length > 0;

/** State on `before` and on `after`, when they differ. */
export function changeBetween(r: RuleRecord, before: string, after: string): { from: RuleStateValue; to: RuleStateValue } | null {
  const a = ruleStateAt(r, before);
  const b = ruleStateAt(r, after);
  return a === b ? null : { from: a, to: b };
}

/** Every history entry dated in (from, to], newest first: the change log between two dates. */
export function changesInWindow(rules: RuleRecord[], from: string, to: string): { rule: RuleRecord; change: RuleStateChange; previous: RuleStateValue }[] {
  const [lo, hi] = from <= to ? [from, to] : [to, from];
  const out: { rule: RuleRecord; change: RuleStateChange; previous: RuleStateValue }[] = [];
  for (const r of rules)
    r.history.forEach((h, i) => {
      if (h.from > lo && h.from <= hi) out.push({ rule: r, change: h, previous: i > 0 ? r.history[i - 1].state : "none" });
    });
  return out.sort((a, b) => b.change.from.localeCompare(a.change.from) || a.rule.order - b.rule.order);
}

/* ---------- local date edits ---------- */

/** Edited histories by rule id (kept in this browser; see components/chapters/rules/useRuleEdits.ts). */
export type RuleEdits = Record<string, RuleStateChange[]>;

/** The register with local edits applied: new history, re-derived active span, flagged as edited. */
export function applyEdits(rules: RuleRecord[], edits: RuleEdits): RuleRecord[] {
  if (!Object.keys(edits).length) return rules;
  return rules.map((r) => {
    const h = edits[r.id];
    if (!h) return r;
    // Set both span fields explicitly: an edit can make a rule never active (both undefined).
    const span = activeSpan(h);
    return { ...r, history: h, activeFrom: span.activeFrom, activeTo: span.activeTo, edited: true, originalHistory: r.history };
  });
}

/** Why an edited history cannot be saved, or null when it is fine. */
export function validateHistory(h: RuleStateChange[], r: RuleRecord): string | null {
  if (!h.length) return "Keep at least one state.";
  for (let i = 0; i < h.length; i++) {
    const { state, from } = h[i];
    if (!has(RULE_STATES, state)) return "Pick a state for every row.";
    if (!isAsOfDate(from)) return `Dates must be real dates between ${formatDate(AS_OF_MIN)} and ${formatDate(AS_OF_MAX)}.`;
    if (i > 0 && from <= h[i - 1].from)
      return `Dates must move forward: ${STATE_LABEL[state]} (${formatDate(from)}) has to come after ${STATE_LABEL[h[i - 1].state]} (${formatDate(h[i - 1].from)}).`;
    if (i > 0 && state === h[i - 1].state) return `${STATE_LABEL[state]} appears twice in a row; remove one or change its state.`;
    if (state === "superseded" && !r.supersededBy) return "Only a rule with a replacement can be superseded; use Retired instead.";
  }
  return null;
}

/** A sensible state to add after `last` (the editor's "Add a state change"). */
export function suggestNextState(last: RuleLifecycle): RuleLifecycle {
  switch (last) {
    case "draft":
      return "review";
    case "review":
      return "approved";
    case "approved":
      return "active";
    case "active":
      return "retired";
    default:
      return "active";
  }
}

/** ISO date `days` after `iso`, kept inside the as-of range. */
export function addDays(iso: string, days: number): string {
  const out = new Date((dayNumber(iso) + days) * 86_400_000).toISOString().slice(0, 10);
  return out < AS_OF_MIN ? AS_OF_MIN : out > AS_OF_MAX ? AS_OF_MAX : out;
}

/* ---------- query ---------- */

export type RuleStatusValue = "active" | "inactive";
export type RuleView = "table" | "cards" | "timeline";
export type RuleSortKey = "id" | "title" | "status" | "from" | "to" | "context" | "strength" | "owner";
export type SortDir = "asc" | "desc";
export type FacetKey = "status" | "state" | "ctx" | "sec" | "str" | "origin" | "owner";
export const FACETS: FacetKey[] = ["status", "state", "ctx", "sec", "str", "origin", "owner"];

export interface RuleQuery {
  q: string;
  status: RuleStatusValue[];
  state: RuleStateValue[];
  ctx: RuleContext[];
  sec: string[];
  str: RuleStrength[];
  origin: RuleOrigin[];
  owner: string[];
  /** Only rules that wait on an open question. */
  flag: boolean;
  /** Only rules gated by this open question. */
  question: string | null;
  /** null = today. */
  asOf: string | null;
  /** Compare the as-of date with this earlier (or later) date. */
  vs: string | null;
  /** With `vs`: only rules whose state differs between the two dates. */
  changed: boolean;
  /** Only rules whose dates were edited in this browser. */
  edited: boolean;
  sort: RuleSortKey;
  dir: SortDir;
}

export const DEFAULT_QUERY: RuleQuery = {
  q: "",
  status: [],
  state: [],
  ctx: [],
  sec: [],
  str: [],
  origin: [],
  owner: [],
  flag: false,
  question: null,
  asOf: null,
  vs: null,
  changed: false,
  edited: false,
  sort: "id",
  dir: "asc",
};

/** True when any filter (not sort, not dates) narrows the list. */
export const hasFilters = (q: RuleQuery) =>
  !!(q.q.trim() || FACETS.some((f) => (q[f] as string[]).length) || q.flag || q.question || q.edited || (q.vs && q.changed));

export const FACET_LABEL: Record<FacetKey, string> = {
  status: "Status",
  state: "State",
  ctx: "Context",
  sec: "Section",
  str: "Strength",
  origin: "Source",
  owner: "Owner",
};

export const STATUS_LABEL: Record<RuleStatusValue, string> = { active: "Active", inactive: "Inactive" };

/** Label of one facet value, for chips and exports. */
export function facetValueLabel(facet: FacetKey, value: string): string {
  switch (facet) {
    case "status":
      return has(STATUS_LABEL, value) ? STATUS_LABEL[value as RuleStatusValue] : value;
    case "state":
      return has(STATE_LABEL, value) ? STATE_LABEL[value as RuleStateValue] : value;
    case "ctx":
      return has(RULE_CONTEXTS, value) ? RULE_CONTEXTS[value as RuleContext].label : value;
    case "sec":
      return ruleSectionLabel(value);
    case "str":
      return has(RULE_STRENGTHS, value) ? RULE_STRENGTHS[value as RuleStrength].label : value;
    case "origin":
      return has(RULE_ORIGINS, value) ? RULE_ORIGINS[value as RuleOrigin].label : value;
    default:
      return value;
  }
}

/** Values a rule carries for a facet (a rule has several contexts). */
function facetValues(r: RuleRecord, facet: FacetKey, asOf: string): string[] {
  switch (facet) {
    case "status":
      return [isActive(r, asOf) ? "active" : "inactive"];
    case "state":
      return [ruleStateAt(r, asOf)];
    case "ctx":
      return r.contexts;
    case "sec":
      return [r.section];
    case "str":
      return [r.strength];
    case "origin":
      return [r.origin];
    case "owner":
      return [r.owner];
  }
}

/* ---------- search ---------- */

const haystack = new Map(
  ruleRegister.map((r) => [
    r.id,
    [
      r.id,
      r.title,
      r.text,
      ...(r.list ?? []),
      r.plain ?? "",
      ruleSectionLabel(r.section),
      ...r.contexts.map((c) => RULE_CONTEXTS[c].label),
      r.owner,
      RULE_STRENGTHS[r.strength].label,
      RULE_ORIGINS[r.origin].label,
      ...(r.entities ?? []),
      ...(r.questions ?? []),
      r.supersededBy ?? "",
    ]
      .join(" ")
      .toLowerCase(),
  ])
);

export const searchTokens = (q: string) => q.toLowerCase().split(/\s+/).filter(Boolean);

/** Entities a search matched (shown under the row when nothing visible explains the match). */
export const matchedEntities = (r: RuleRecord, tokens: string[]) =>
  tokens.length ? (r.entities ?? []).filter((e) => tokens.some((t) => e.toLowerCase().includes(t))) : [];

/* ---------- filter, facets, sort ---------- */

/** Apply the query. `except` skips one facet (for counts computed against the other filters). */
export function filterRules(rules: RuleRecord[], q: RuleQuery, asOf: string, except?: FacetKey | "flag"): RuleRecord[] {
  const tokens = searchTokens(q.q);
  const facets = FACETS.filter((f) => f !== except && (q[f] as string[]).length > 0);
  return rules.filter((r) => {
    if (q.flag && except !== "flag" && !needsConfirmation(r)) return false;
    if (q.question && !(r.questions ?? []).includes(q.question)) return false;
    if (q.vs && q.changed && !changeBetween(r, q.vs, asOf)) return false;
    if (q.edited && !r.edited) return false;
    for (const f of facets) {
      const want = q[f] as string[];
      if (!facetValues(r, f, asOf).some((v) => want.includes(v))) return false;
    }
    if (tokens.length) {
      const h = haystack.get(r.id) ?? "";
      if (!tokens.every((t) => h.includes(t))) return false;
    }
    return true;
  });
}

/** Count of rules per value of `facet`, honouring every other active filter. */
export function facetCounts(rules: RuleRecord[], q: RuleQuery, asOf: string, facet: FacetKey): Map<string, number> {
  const counts = new Map<string, number>();
  for (const r of filterRules(rules, q, asOf, facet)) for (const v of facetValues(r, facet, asOf)) counts.set(v, (counts.get(v) ?? 0) + 1);
  return counts;
}

/** Rules that need confirmation, honouring every other active filter (the flag toggle's live count). */
export const flagCount = (rules: RuleRecord[], q: RuleQuery, asOf: string) => filterRules(rules, q, asOf, "flag").filter(needsConfirmation).length;

export interface FacetOption {
  value: string;
  label: string;
  group?: string;
}

/** Every value a facet can take, in display order. */
export const FACET_OPTIONS: Record<FacetKey, FacetOption[]> = {
  status: [
    { value: "active", label: STATUS_LABEL.active },
    { value: "inactive", label: STATUS_LABEL.inactive },
  ],
  state: [...RULE_STATE_ORDER, "none" as const].map((s) => ({ value: s, label: STATE_LABEL[s] })),
  ctx: RULE_CONTEXT_ORDER.map((c) => ({ value: c, label: RULE_CONTEXTS[c].label })),
  sec: RULE_SECTIONS.map((s) => ({ value: s.id, label: ruleSectionLabel(s.id), group: s.part })),
  str: (Object.keys(RULE_STRENGTHS) as RuleStrength[]).map((s) => ({ value: s, label: RULE_STRENGTHS[s].label })),
  origin: (Object.keys(RULE_ORIGINS) as RuleOrigin[]).map((o) => ({ value: o, label: RULE_ORIGINS[o].label })),
  owner: RULE_OWNERS.map((o) => ({ value: o, label: o })),
};

export const SORT_LABEL: Record<RuleSortKey, string> = {
  id: "ID",
  title: "Title",
  status: "Status",
  from: "Active from",
  to: "Active to",
  context: "Context",
  strength: "Strength",
  owner: "Owner",
};

const STRENGTH_RANK: Record<RuleStrength, number> = { must: 0, should: 1, may: 2 };
const STATE_RANK: Record<RuleStateValue, number> = { active: 0, approved: 1, review: 2, draft: 3, suspended: 4, superseded: 5, retired: 6, none: 7 };
const LAST = "9999-12-31";

export function sortRules(rules: RuleRecord[], key: RuleSortKey, dir: SortDir, asOf: string): RuleRecord[] {
  const cmp = (a: RuleRecord, b: RuleRecord): number => {
    switch (key) {
      case "id":
        return a.order - b.order;
      case "title":
        return a.title.localeCompare(b.title);
      case "status":
        return STATE_RANK[ruleStateAt(a, asOf)] - STATE_RANK[ruleStateAt(b, asOf)];
      case "from":
        // Never-active rules last when ascending.
        return (a.activeFrom ?? LAST).localeCompare(b.activeFrom ?? LAST);
      case "to":
        // Still-active (open-ended) rules last when ascending.
        return (a.activeTo ?? LAST).localeCompare(b.activeTo ?? LAST);
      case "context":
        return RULE_CONTEXT_ORDER.indexOf(a.contexts[0]) - RULE_CONTEXT_ORDER.indexOf(b.contexts[0]);
      case "strength":
        return STRENGTH_RANK[a.strength] - STRENGTH_RANK[b.strength];
      case "owner":
        return a.owner.localeCompare(b.owner);
    }
  };
  const sign = dir === "asc" ? 1 : -1;
  return [...rules].sort((a, b) => sign * cmp(a, b) || a.order - b.order);
}

/* ---------- URL state ---------- */

const LIST_PARAMS: Record<FacetKey, string> = { status: "status", state: "state", ctx: "ctx", sec: "sec", str: "str", origin: "src", owner: "own" };
export const RULE_PARAMS = ["q", ...Object.values(LIST_PARAMS), "flag", "question", "asOf", "vs", "changed", "edited", "sort", "dir", "view", "rule"];

const VIEWS: RuleView[] = ["table", "cards", "timeline"];

export function parseRuleQuery(params: URLSearchParams): RuleQuery {
  const list = (facet: FacetKey) => {
    const ok = new Set(FACET_OPTIONS[facet].map((o) => o.value));
    // Accept both ?ctx=a,b and ?ctx=a&ctx=b.
    const values = params.getAll(LIST_PARAMS[facet]).flatMap((v) => v.split(",")).map((v) => v.trim());
    return values.filter((v, i) => v && ok.has(v) && values.indexOf(v) === i);
  };
  const sort = params.get("sort");
  const asOf = params.get("asOf");
  const vs = params.get("vs");
  const question = params.get("question");
  return {
    q: params.get("q") ?? "",
    status: list("status") as RuleStatusValue[],
    state: list("state") as RuleStateValue[],
    ctx: list("ctx") as RuleContext[],
    sec: list("sec"),
    str: list("str") as RuleStrength[],
    origin: list("origin") as RuleOrigin[],
    owner: list("owner"),
    flag: params.get("flag") === "1",
    question: question && openQuestions.some((x) => x.id === question) ? question : null,
    asOf: isAsOfDate(asOf) ? asOf : null,
    vs: isAsOfDate(vs) ? vs : null,
    changed: params.get("changed") === "1",
    edited: params.get("edited") === "1",
    sort: sort && has(SORT_LABEL, sort) ? (sort as RuleSortKey) : "id",
    dir: params.get("dir") === "desc" ? "desc" : "asc",
  };
}

export const parseView = (v: string | null): RuleView | null => (v && (VIEWS as string[]).includes(v) ? (v as RuleView) : null);

/** Write the query, view and open rule into `params`, omitting defaults. */
export function writeRuleParams(params: URLSearchParams, q: RuleQuery, view: RuleView, rule: string | null) {
  for (const p of RULE_PARAMS) params.delete(p);
  if (q.q.trim()) params.set("q", q.q.trim());
  for (const f of FACETS) {
    const v = q[f] as string[];
    if (v.length) params.set(LIST_PARAMS[f], v.join(","));
  }
  if (q.flag) params.set("flag", "1");
  if (q.question) params.set("question", q.question);
  if (q.asOf) params.set("asOf", q.asOf);
  if (q.vs) params.set("vs", q.vs);
  if (q.vs && q.changed) params.set("changed", "1");
  if (q.edited) params.set("edited", "1");
  if (q.sort !== "id") params.set("sort", q.sort);
  if (q.dir !== "asc") params.set("dir", q.dir);
  if (view !== "table") params.set("view", view);
  if (rule) params.set("rule", rule);
}

/* ---------- timeline axis ---------- */

export interface TimelineAxis {
  start: number;
  end: number;
  ticks: { day: number; label: string }[];
  /** Months on the axis (each gets a fixed width, so a long range scrolls instead of squashing). */
  months: number;
}

/** Shared month axis: the month before the first history date → two months after the latest date (incl. as-of / vs). */
export function timelineDomain(rules: RuleRecord[], asOf: string, vs?: string | null): TimelineAxis {
  let min = asOf;
  let max = asOf;
  for (const d of [...rules.flatMap((r) => r.history.map((h) => h.from)), ...(vs ? [vs] : [])]) {
    if (d < min) min = d;
    if (d > max) max = d;
  }
  const [y0, m0] = min.split("-").map(Number);
  const [y1, m1] = max.split("-").map(Number);
  const startMonth = y0 * 12 + (m0 - 1) - 1;
  const endMonth = y1 * 12 + (m1 - 1) + 2;
  const ticks: { day: number; label: string }[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const y = Math.floor(m / 12);
    const mo = m % 12;
    ticks.push({ day: dayNumber(`${y}-${String(mo + 1).padStart(2, "0")}-01`), label: mo === 0 || m === startMonth ? `${MONTHS[mo]} ’${String(y).slice(2)}` : MONTHS[mo] });
  }
  return { start: ticks[0].day, end: ticks[ticks.length - 1].day, ticks, months: ticks.length - 1 };
}

/* ---------- exports ---------- */

/** Spreadsheet-safe text: a leading = + - @ (or tab / CR) would be read as a formula (OWASP CSV injection). */
export const safeCell = (v: string) => (/^[=+\-@\t\r]/.test(v) ? `'${v}` : v);

/** The statement with its list items, as one line of text. */
export const fullText = (r: RuleRecord) => (r.list?.length ? `${r.text} ${r.list.join(" ")}` : r.text);

/** "2026-07-06 Draft; 2026-07-20 Under review; …" */
export const historyText = (r: RuleRecord) => r.history.map((h) => `${h.from} ${STATE_LABEL[h.state]}`).join("; ");

const csvCell = (v: string) => {
  const s = safeCell(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** CSV of the rules as shown (filtered and sorted), with the as-of status. */
export function rulesToCsv(rules: RuleRecord[], asOf: string): string {
  const head = ["ID", "Title", "Rule", "Status", `State on ${asOf}`, "Active from", "Active to", "Contexts", "Section", "Strength", "Owner", "Source", "Waits on", "Superseded by", "Entities", "State history", "Dates edited", "Source ids", "Metadata"];
  const rows = rules.map((r) => [
    r.id,
    r.title,
    fullText(r),
    isActive(r, asOf) ? "Active" : "Inactive",
    STATE_LABEL[ruleStateAt(r, asOf)],
    r.activeFrom ?? "",
    r.activeTo ?? "",
    r.contexts.map((c) => RULE_CONTEXTS[c].label).join("; "),
    ruleSectionLabel(r.section),
    RULE_STRENGTHS[r.strength].label,
    r.owner,
    RULE_ORIGINS[r.origin].label,
    pendingQuestions(r).join("; "),
    r.supersededBy ?? "",
    (r.entities ?? []).join("; "),
    historyText(r),
    r.edited ? "Yes (in this browser)" : "",
    r.sources.join("; "),
    "Sample state history, contexts and owner",
  ]);
  return "﻿" + [head, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}

/** Save a Blob as a file (revoked after the browser has started the download). */
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
