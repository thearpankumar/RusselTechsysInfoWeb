"use client";

// Small pieces shared by the business-rules register views (table, cards, timeline, overlay).
import * as React from "react";
import type { RuleContext, RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, REGISTER_AS_OF } from "@/content/rules";
import { Marker } from "@/components/ui-rt";
import { dataBg } from "@/lib/dataColors";
import { dayNumber, formatDate, pendingQuestions, ruleState, todayISO, type RuleState } from "@/lib/rules";
import { cn } from "@/lib/utils";

const noop = () => () => {};

/** Today's date in the browser; the register's review date during prerender and hydration. */
export function useToday(): string {
  return React.useSyncExternalStore(noop, todayISO, () => REGISTER_AS_OF);
}

/** Why a rule is or is not active on `asOf`, in one line. */
export function stateReason(r: RuleRecord, state: RuleState): string {
  if (state === "scheduled") return `Not yet effective · from ${formatDate(r.activeFrom)}`;
  if (state === "retired") return `Retired ${formatDate(r.activeTo!)}${r.supersededBy ? ` · replaced by ${r.supersededBy}` : ""}`;
  return r.activeTo ? `Until ${formatDate(r.activeTo)}` : `Since ${formatDate(r.activeFrom)}`;
}

/** Status marker + label (shape, never colour alone): solid = active, hollow = inactive. */
export function StatusLabel({ rule, asOf, withReason, className }: { rule: RuleRecord; asOf: string; withReason?: boolean; className?: string }) {
  const state = ruleState(rule, asOf);
  const active = state === "active";
  return (
    <span className={cn("inline-flex min-w-0 flex-col gap-1", className)}>
      <span className={cn("inline-flex items-center gap-2 t-body-md", active ? "text-on-surface" : "text-body")}>
        <Marker tone={active ? "primary" : "mid"} shape={active ? "dot" : "hollow"} size={8} />
        {active ? "Active" : "Inactive"}
      </span>
      {withReason && <span className="t-body-sm text-muted">{stateReason(rule, state)}</span>}
    </span>
  );
}

/** Hatched marker + "Needs confirmation · Q13" when the rule waits on an open question. */
export function ConfirmFlag({ rule, compact, className }: { rule: RuleRecord; compact?: boolean; className?: string }) {
  const qs = pendingQuestions(rule);
  if (!qs.length) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 t-body-sm text-body", className)} title={`Waits on open question ${qs.join(", ")}`}>
      <Marker shape="hatch" size={8} />
      {compact ? qs.join(" · ") : `Needs confirmation · ${qs.join(" · ")}`}
    </span>
  );
}

/** Context dot + label. `size="sm"` is the dense row form. */
export function ContextTag({ ctx, size = "sm", className }: { ctx: RuleContext; size?: "sm" | "md"; className?: string }) {
  const c = RULE_CONTEXTS[ctx];
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 text-body", size === "sm" ? "t-body-sm" : "t-body-md", className)}>
      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dataBg[c.colour])} />
      <span className="truncate">{c.label}</span>
    </span>
  );
}

/** Active period as text: "3 Aug 2026 → open". */
export function PeriodText({ rule, className }: { rule: RuleRecord; className?: string }) {
  return (
    <span className={cn("t-mono-sm whitespace-nowrap text-body tnum", className)}>
      {formatDate(rule.activeFrom)} → {rule.activeTo ? formatDate(rule.activeTo) : <span className="text-muted">open</span>}
    </span>
  );
}

export interface Domain {
  start: number;
  end: number;
}

export const pct = (day: number, d: Domain) => Math.min(100, Math.max(0, ((day - d.start) / (d.end - d.start)) * 100));

/**
 * Mini validity strip on the register's shared axis: highlighted bar while active on `asOf`, grey otherwise;
 * open-ended periods fade into a dashed tail; a thin tick marks the as-of date. Decorative (dates are in text beside it).
 */
export function PeriodStrip({ rule, asOf, domain, className }: { rule: RuleRecord; asOf: string; domain: Domain; className?: string }) {
  const active = ruleState(rule, asOf) === "active";
  const from = pct(dayNumber(rule.activeFrom), domain);
  const to = rule.activeTo ? pct(dayNumber(rule.activeTo), domain) : null;
  const solidEnd = to ?? Math.max(from, 92);
  return (
    <span aria-hidden className={cn("relative block h-3 w-full", className)}>
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
      <span className={cn("absolute top-1/2 h-1 -translate-y-1/2 rounded-full", active ? "bg-primary" : "bg-chart-past")} style={{ left: `${from}%`, width: `${Math.max(solidEnd - from, 1.5)}%` }} />
      {to === null && <span className={cn("absolute top-1/2 -translate-y-1/2 border-t border-dashed", active ? "border-primary" : "border-chart-past")} style={{ left: `${solidEnd}%`, right: 0 }} />}
      <span className="absolute top-0 h-3 w-px bg-muted" style={{ left: `${pct(dayNumber(asOf), domain)}%` }} />
    </span>
  );
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wrap search matches in <mark>. */
export function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  const re = React.useMemo(() => (tokens.length ? new RegExp(`(${tokens.map(escapeRe).join("|")})`, "gi") : null), [tokens]);
  if (!re) return <>{text}</>;
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-primary/20 px-0.5 text-on-surface">
            {p}
          </mark>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
}

/** Dashed "Sample" tag for illustrative metadata (status periods, contexts, owners). */
export function SampleTag({ className, children = "Sample metadata" }: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      title="Status periods, contexts and owners are illustrative until Rossell confirms them."
      className={cn("inline-flex h-6 shrink-0 items-center gap-2 rounded-full border border-dashed border-chart-mid px-2 t-mono-sm whitespace-nowrap text-muted", className)}
    >
      <Marker shape="hatch" size={8} />
      {children}
    </span>
  );
}
