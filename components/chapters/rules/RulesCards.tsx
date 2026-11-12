"use client";

// Card view (md and up): the same fields in the same place on every card. Below md it becomes a compact two-line
// list, so 120 rules stay scannable on a phone instead of a 35,000px stack of cards.
import * as React from "react";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, RULE_STRENGTHS } from "@/content/rules";
import { dataBg } from "@/lib/dataColors";
import { STATE_LABEL, formatShort, isActive, matchedEntities, ruleStateAt, stateAt } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { ChangeTag, ConfirmFlag, ContextTag, EditedTag, Highlight, StateMarker, StatusLabel } from "./shared";

const sectionTag = (r: RuleRecord) => (r.section.startsWith("WS") ? "Session" : `§${r.section}`);

export const RulesCards = React.memo(function RulesCards({
  rules,
  asOf,
  vs,
  tokens,
  openId,
  onOpen,
}: {
  rules: RuleRecord[];
  asOf: string;
  vs: string | null;
  tokens: string[];
  openId: string | null;
  onOpen: (id: string) => void;
}) {
  return (
    <div data-rules-list>
      {/* Phones: compact list */}
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface md:hidden">
        {rules.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              data-rule-open={r.id}
              aria-current={r.id === openId || undefined}
              onClick={() => onOpen(r.id)}
              className={cn("flex w-full cursor-pointer flex-col gap-1 px-4 py-3 text-left transition-colors duration-150 hover:bg-surface-raised", r.id === openId && "bg-surface-raised")}
            >
              <span className="flex items-baseline gap-3">
                <span className="w-14 shrink-0 t-mono-sm text-muted">
                  <Highlight text={r.id} tokens={tokens} />
                </span>
                <span className="min-w-0 t-body-md text-on-surface">
                  <Highlight text={r.title} tokens={tokens} />
                </span>
              </span>
              <span className="flex items-center gap-3 pl-17">
                <StateMarker state={ruleStateAt(r, asOf)} />
                <span className="min-w-0 flex-1 truncate t-body-sm text-muted">
                  {isActive(r, asOf) ? `Active since ${formatShort(stateAt(r, asOf)!.from)}` : `Inactive · ${STATE_LABEL[ruleStateAt(r, asOf)]}`}
                  {r.edited && " · Edited"}
                </span>
                <span className="flex shrink-0 gap-1" aria-label={r.contexts.map((c) => RULE_CONTEXTS[c].label).join(", ")}>
                  {r.contexts.map((c) => (
                    <span key={c} aria-hidden className={cn("size-2 rounded-full", dataBg[RULE_CONTEXTS[c].colour])} />
                  ))}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* md and up: cards */}
      <ul className="hidden grid-cols-2 gap-4 md:grid xl:grid-cols-3">
        {rules.map((r) => {
          const entities = matchedEntities(r, tokens);
          return (
            <li key={r.id} className="min-w-0">
              <button
                type="button"
                data-rule-open={r.id}
                aria-current={r.id === openId || undefined}
                onClick={() => onOpen(r.id)}
                className={cn(
                  "relative flex h-full w-full cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border bg-surface p-6 text-left transition-colors duration-150 ease-out hover:border-chart-past",
                  r.id === openId ? "border-chart-past bg-surface-raised" : "border-transparent"
                )}
              >
                {/* 3px stripe in the primary context's colour. */}
                <span aria-hidden className={cn("absolute inset-y-6 left-0 w-0.75 rounded-r-full", dataBg[RULE_CONTEXTS[r.contexts[0]].colour])} />
                <span className="flex items-baseline justify-between gap-4 t-mono-sm text-muted">
                  <span>
                    <span className="text-on-surface">
                      <Highlight text={r.id} tokens={tokens} />
                    </span>
                    {" · "}
                    {sectionTag(r)}
                    {r.edited && <EditedTag className="ml-2 align-middle" />}
                  </span>
                  <span>
                    {RULE_STRENGTHS[r.strength].label} · {r.owner}
                  </span>
                </span>
                <span className="flex flex-col gap-2">
                  <span className="t-body-lg text-on-surface">
                    <Highlight text={r.title} tokens={tokens} />
                  </span>
                  <span className="line-clamp-3 t-body-sm text-body">
                    <Highlight text={r.text} tokens={tokens} />
                    {r.list && <span className="text-muted"> ({r.list.length} items)</span>}
                  </span>
                  {entities.length > 0 && (
                    <span className="truncate t-mono-sm text-muted">
                      <Highlight text={entities.join(" · ")} tokens={tokens} />
                    </span>
                  )}
                </span>
                <span className="flex flex-wrap gap-x-4 gap-y-1">
                  {r.contexts.map((c) => (
                    <ContextTag key={c} ctx={c} tokens={tokens} />
                  ))}
                </span>
                <span className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                  <StatusLabel rule={r} asOf={asOf} />
                  {vs && <ChangeTag rule={r} vs={vs} asOf={asOf} className="self-start" />}
                  <ConfirmFlag rule={r} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
