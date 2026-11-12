"use client";

// At a glance: four counts that double as preset filters, the context mix (each context a filter), and the
// note on what is sample data.
import * as React from "react";
import { RULE_CONTEXTS, RULE_CONTEXT_ORDER, ruleRegister } from "@/content/rules";
import type { RuleContext, RuleRecord } from "@/content/types-extra";
import { Cite, ConfidenceTag, Stat, StatRow } from "@/components/ui-rt";
import { dataBg } from "@/lib/dataColors";
import { DEFAULT_QUERY, formatDate, isActive, needsConfirmation, type RuleQuery } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { SampleTag } from "./shared";

const contextCounts = Object.fromEntries(RULE_CONTEXT_ORDER.map((c) => [c, ruleRegister.filter((r) => r.contexts.includes(c)).length])) as Record<RuleContext, number>;
const maxContext = Math.max(...Object.values(contextCounts));
const flagged = ruleRegister.filter(needsConfirmation).length;

const FILTER_KEYS = ["q", "status", "state", "ctx", "sec", "str", "origin", "owner", "flag", "question", "changed", "edited"] as const;

/** True when the filters are exactly `patch` (sort and as-of ignored). */
function isPreset(q: RuleQuery, patch: Partial<RuleQuery>): boolean {
  const target = { ...DEFAULT_QUERY, ...patch };
  return FILTER_KEYS.every((k) => JSON.stringify(q[k]) === JSON.stringify(target[k]));
}

export function RulesOverview({
  rules,
  asOf,
  query,
  onPreset,
  onToggleContext,
}: {
  /** The register with this browser's date edits applied (status depends on dates). */
  rules: RuleRecord[];
  asOf: string;
  query: RuleQuery;
  onPreset: (patch: Partial<RuleQuery>) => void;
  onToggleContext: (c: RuleContext) => void;
}) {
  const active = rules.filter((r) => isActive(r, asOf)).length;
  const when = formatDate(asOf);

  return (
    <div className="flex flex-col gap-12">
      <StatRow>
        <Stat label="In the register" value={ruleRegister.length} unit="rules" caption="Spec and working sessions" sub="Every rule recorded so far" selected={isPreset(query, {})} onClick={() => onPreset({})} />
        <Stat label="Active" value={active} unit="rules" caption={`In force on ${when}`} sub="Approved and in force" selected={isPreset(query, { status: ["active"] })} onClick={() => onPreset({ status: ["active"] })} />
        <Stat label="Inactive" value={ruleRegister.length - active} unit="rules" caption="In draft, review or replaced" sub="Kept with their full state history" selected={isPreset(query, { status: ["inactive"] })} onClick={() => onPreset({ status: ["inactive"] })} />
        <Stat label="Needs confirmation" value={flagged} unit="rules" caption="Wait on an open question" sub="Confirm with Rossell's teams" selected={isPreset(query, { flag: true })} onClick={() => onPreset({ flag: true })} />
      </StatRow>

      <div>
        <p className="mb-4 t-mono-sm text-muted">Context · what each rule applies to (a rule can have up to three)</p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {RULE_CONTEXT_ORDER.map((c) => {
            const meta = RULE_CONTEXTS[c];
            const on = query.ctx.includes(c);
            return (
              <li key={c} className="min-w-0">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => onToggleContext(c)}
                  title={meta.blurb}
                  className={cn(
                    "flex w-full cursor-pointer flex-col gap-3 rounded-lg border p-4 text-left transition-colors duration-150 ease-out hover:border-chart-past hover:bg-surface-raised",
                    on ? "border-chart-past bg-surface-raised" : "border-border"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", dataBg[meta.colour])} />
                    <span className="min-w-0 flex-1 truncate t-body-md text-on-surface">{meta.label}</span>
                    <span className="t-body-md text-on-surface tnum">{contextCounts[c]}</span>
                  </span>
                  <span aria-hidden className="block h-1 w-full rounded-full bg-chart-past/50">
                    <span className={cn("block h-1 rounded-full", dataBg[meta.colour])} style={{ width: `${(contextCounts[c] / maxContext) * 100}%` }} />
                  </span>
                  <span className="t-body-sm text-muted">{meta.blurb}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap items-start gap-x-6 gap-y-3 rounded-lg border border-dashed border-border p-6">
        <SampleTag />
        <p className="min-w-0 flex-1 basis-80 t-body-md text-body">
          Spec rules are quoted as written in the business-rules specification; session rules as recorded in the working-session notes. Each
          rule&apos;s state history (draft, review, approval, activation, replacement), contexts and owner are illustrative until Rossell confirms
          them. Active or Inactive is worked out from that history, so it always matches the dates shown.
        </p>
        <span className="inline-flex items-center gap-2">
          <ConfidenceTag confidence="rules" />
          <Cite ids={["RULES", "WS"]} />
        </span>
      </div>
    </div>
  );
}
