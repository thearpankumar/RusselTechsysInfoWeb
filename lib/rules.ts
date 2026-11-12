// Business-rules register logic: status by date, search, facets, sort, URL state and CSV. Pure; no React.
import type { RuleContext, RuleOrigin, RuleRecord, RuleStrength } from "@/content/types-extra";
import { RULE_CONTEXTS, RULE_CONTEXT_ORDER, RULE_ORIGINS, RULE_OWNERS, RULE_SECTIONS, RULE_STRENGTHS, ruleRegister, ruleSectionLabel } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";

/* ---------- dates ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export const isIsoDate = (s: string | null | undefined): s is string => !!s && ISO.test(s) && !Number.isNaN(Date.parse(s));

/** "2026-11-07" → "7 Nov 2026" (no locale or time-zone drift). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
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

/* ---------- status ---------- */

export type RuleState = "active" | "scheduled" | "retired";

/** Active when activeFrom ≤ asOf < activeTo. Status is always derived from the period, never stored. */
export function ruleState(r: RuleRecord, asOf: string): RuleState {
  if (asOf < r.activeFrom) return "scheduled";
  if (r.activeTo && asOf >= r.activeTo) return "retired";
  return "active";
}

export const isActive = (r: RuleRecord, asOf: string) => ruleState(r, asOf) === "active";

const openQuestionIds = new Set(openQuestions.filter((q) => q.status !== "answered").map((q) => q.id));

/** Open questions the rule still waits on ("Needs confirmation"). */
export const pendingQuestions = (r: RuleRecord) => (r.questions ?? []).filter((q) => openQuestionIds.has(q));
export const needsConfirmation = (r: RuleRecord) => pendingQuestions(r).length > 0;

/* ---------- query ---------- */

export type RuleStatusValue = "active" | "inactive";
export type RuleView = "table" | "cards" | "timeline";
export type RuleSortKey = "id" | "title" | "status" | "from" | "to" | "context" | "strength" | "owner";
export type SortDir = "asc" | "desc";
export type FacetKey = "status" | "ctx" | "sec" | "str" | "origin" | "owner";

export interface RuleQuery {
  q: string;
  status: RuleStatusValue[];
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
  sort: RuleSortKey;
  dir: SortDir;
}

export const DEFAULT_QUERY: RuleQuery = {
  q: "",
  status: [],
  ctx: [],
  sec: [],
  str: [],
  origin: [],
  owner: [],
  flag: false,
  question: null,
  asOf: null,
  sort: "id",
  dir: "asc",
};

/** True when any filter (not sort, not as-of) narrows the list. */
export const hasFilters = (q: RuleQuery) =>
  !!(q.q.trim() || q.status.length || q.ctx.length || q.sec.length || q.str.length || q.origin.length || q.owner.length || q.flag || q.question);

export const FACET_LABEL: Record<FacetKey, string> = {
  status: "Status",
  ctx: "Context",
  sec: "Section",
  str: "Strength",
  origin: "Source",
  owner: "Owner",
};

export const STATUS_LABEL: Record<RuleStatusValue, string> = { active: "Active", inactive: "Inactive" };

/** Label of one facet value, for chips and CSV. */
export function facetValueLabel(facet: FacetKey, value: string): string {
  switch (facet) {
    case "status":
      return STATUS_LABEL[value as RuleStatusValue] ?? value;
    case "ctx":
      return RULE_CONTEXTS[value as RuleContext]?.label ?? value;
    case "sec":
      return ruleSectionLabel(value);
    case "str":
      return RULE_STRENGTHS[value as RuleStrength]?.label ?? value;
    case "origin":
      return RULE_ORIGINS[value as RuleOrigin]?.label ?? value;
    default:
      return value;
  }
}

/** Values a rule carries for a facet (a rule has several contexts). */
function facetValues(r: RuleRecord, facet: FacetKey, asOf: string): string[] {
  switch (facet) {
    case "status":
      return [isActive(r, asOf) ? "active" : "inactive"];
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

const selected = (q: RuleQuery, facet: FacetKey): string[] => q[facet] as string[];

/* ---------- search ---------- */

const haystack = new Map(
  ruleRegister.map((r) => [
    r.id,
    [
      r.id,
      r.title,
      r.text,
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

/* ---------- filter, facets, sort ---------- */

/** Apply the query. `except` skips one facet (for counts computed against the other filters). */
export function filterRules(rules: RuleRecord[], q: RuleQuery, asOf: string, except?: FacetKey): RuleRecord[] {
  const tokens = searchTokens(q.q);
  const facets: FacetKey[] = (["status", "ctx", "sec", "str", "origin", "owner"] as FacetKey[]).filter((f) => f !== except && selected(q, f).length > 0);
  return rules.filter((r) => {
    if (q.flag && !needsConfirmation(r)) return false;
    if (q.question && !(r.questions ?? []).includes(q.question)) return false;
    for (const f of facets) {
      const want = selected(q, f);
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
const STATE_RANK: Record<RuleState, number> = { active: 0, scheduled: 1, retired: 2 };

export function sortRules(rules: RuleRecord[], key: RuleSortKey, dir: SortDir, asOf: string): RuleRecord[] {
  const cmp = (a: RuleRecord, b: RuleRecord): number => {
    switch (key) {
      case "id":
        return a.order - b.order;
      case "title":
        return a.title.localeCompare(b.title);
      case "status":
        return STATE_RANK[ruleState(a, asOf)] - STATE_RANK[ruleState(b, asOf)];
      case "from":
        return a.activeFrom.localeCompare(b.activeFrom);
      case "to":
        // Open-ended rules last when ascending.
        return (a.activeTo ?? "9999-12-31").localeCompare(b.activeTo ?? "9999-12-31");
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

const LIST_PARAMS: Record<FacetKey, string> = { status: "status", ctx: "ctx", sec: "sec", str: "str", origin: "src", owner: "own" };
export const RULE_PARAMS = ["q", ...Object.values(LIST_PARAMS), "flag", "question", "asOf", "sort", "dir", "view", "rule"];

const known = (facet: FacetKey) => new Set(FACET_OPTIONS[facet].map((o) => o.value));
const VIEWS: RuleView[] = ["table", "cards", "timeline"];

export function parseRuleQuery(params: URLSearchParams): RuleQuery {
  const list = (facet: FacetKey) => {
    const ok = known(facet);
    return (params.get(LIST_PARAMS[facet]) ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter((v, i, a) => v && ok.has(v) && a.indexOf(v) === i);
  };
  const sort = params.get("sort") as RuleSortKey | null;
  const asOf = params.get("asOf");
  const question = params.get("question");
  return {
    q: params.get("q") ?? "",
    status: list("status") as RuleStatusValue[],
    ctx: list("ctx") as RuleContext[],
    sec: list("sec"),
    str: list("str") as RuleStrength[],
    origin: list("origin") as RuleOrigin[],
    owner: list("owner"),
    flag: params.get("flag") === "1",
    question: question && openQuestions.some((x) => x.id === question) ? question : null,
    asOf: isIsoDate(asOf) ? asOf : null,
    sort: sort && sort in SORT_LABEL ? sort : "id",
    dir: params.get("dir") === "desc" ? "desc" : "asc",
  };
}

export const parseView = (v: string | null): RuleView | null => (v && (VIEWS as string[]).includes(v) ? (v as RuleView) : null);

/** Write the query, view and open rule into `params`, omitting defaults. */
export function writeRuleParams(params: URLSearchParams, q: RuleQuery, view: RuleView, rule: string | null) {
  for (const p of RULE_PARAMS) params.delete(p);
  if (q.q.trim()) params.set("q", q.q.trim());
  for (const f of Object.keys(LIST_PARAMS) as FacetKey[]) {
    const v = selected(q, f);
    if (v.length) params.set(LIST_PARAMS[f], v.join(","));
  }
  if (q.flag) params.set("flag", "1");
  if (q.question) params.set("question", q.question);
  if (q.asOf) params.set("asOf", q.asOf);
  if (q.sort !== "id") params.set("sort", q.sort);
  if (q.dir !== "asc") params.set("dir", q.dir);
  if (view !== "table") params.set("view", view);
  if (rule) params.set("rule", rule);
}

/* ---------- timeline axis ---------- */

/** Shared axis for every period strip: first start − 1 month → latest date (+ as-of) + 2 months. */
export function timelineDomain(asOf: string): { start: number; end: number; ticks: { day: number; label: string }[] } {
  const dates = ruleRegister.flatMap((r) => [r.activeFrom, ...(r.activeTo ? [r.activeTo] : [])]).concat(asOf);
  const min = dates.reduce((a, b) => (a < b ? a : b));
  const max = dates.reduce((a, b) => (a > b ? a : b));
  const [y0, m0] = min.split("-").map(Number);
  const [y1, m1] = max.split("-").map(Number);
  // From the first of the month before `min` to the first of the month two after `max`.
  const startMonth = y0 * 12 + (m0 - 1) - 1;
  const endMonth = y1 * 12 + (m1 - 1) + 2;
  const ticks: { day: number; label: string }[] = [];
  for (let m = startMonth; m <= endMonth; m++) {
    const y = Math.floor(m / 12);
    const mo = m % 12;
    const iso = `${y}-${String(mo + 1).padStart(2, "0")}-01`;
    ticks.push({ day: dayNumber(iso), label: mo === 0 || m === startMonth ? `${MONTHS[mo]} ${y}` : MONTHS[mo] });
  }
  return { start: ticks[0].day, end: ticks[ticks.length - 1].day, ticks };
}

/* ---------- CSV ---------- */

const cell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** CSV of the rules as shown (filtered and sorted), with the as-of status. */
export function rulesToCsv(rules: RuleRecord[], asOf: string): string {
  const head = ["ID", "Title", "Rule", `Status (as of ${asOf})`, "Active from", "Active to", "Contexts", "Section", "Strength", "Owner", "Source", "Waits on", "Superseded by", "Entities", "Source ids", "Metadata"];
  const rows = rules.map((r) => [
    r.id,
    r.title,
    r.text,
    isActive(r, asOf) ? "Active" : "Inactive",
    r.activeFrom,
    r.activeTo ?? "",
    r.contexts.map((c) => RULE_CONTEXTS[c].label).join("; "),
    ruleSectionLabel(r.section),
    RULE_STRENGTHS[r.strength].label,
    r.owner,
    RULE_ORIGINS[r.origin].label,
    pendingQuestions(r).join("; "),
    r.supersededBy ?? "",
    (r.entities ?? []).join("; "),
    r.sources.join("; "),
    "Sample status period, contexts and owner",
  ]);
  return "﻿" + [head, ...rows].map((row) => row.map(cell).join(",")).join("\r\n");
}
