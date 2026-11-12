"use client";

// Timeline view: each rule's active period on one shared month axis, with a vertical line at the as-of date.
// Grouped by section when sorted by ID (document order); a flat list for any other sort.
import * as React from "react";
import type { RuleRecord } from "@/content/types-extra";
import { ruleSectionLabel } from "@/content/rules";
import { dayNumber, formatDate, ruleState, type RuleSortKey } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { Highlight, pct, stateReason } from "./shared";

/** Open-ended periods run solid to here, then fade into a dashed tail to the edge. */
const OPEN_END = 94;

interface Axis {
  start: number;
  end: number;
  ticks: { day: number; label: string }[];
}

export function RulesTimeline({ rules, asOf, axis, tokens, sort, onOpen }: { rules: RuleRecord[]; asOf: string; axis: Axis; tokens: string[]; sort: RuleSortKey; onOpen: (id: string) => void }) {
  const groups = React.useMemo(() => {
    if (sort !== "id") return [{ id: "", rules }];
    const out: { id: string; rules: RuleRecord[] }[] = [];
    for (const r of rules) {
      const last = out[out.length - 1];
      if (last && last.id === r.section) last.rules.push(r);
      else out.push({ id: r.section, rules: [r] });
    }
    return out;
  }, [rules, sort]);

  const asOfPct = pct(dayNumber(asOf), axis);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div data-lenis-prevent className="max-h-[70vh] overflow-auto overscroll-contain">
        <div className="min-w-4xl">
          {/* Axis */}
          <div className="sticky top-0 z-20 grid grid-cols-[22rem_minmax(0,1fr)] border-b border-border bg-surface-raised">
            <span className="px-6 py-3 t-mono-sm text-muted">Rule</span>
            <div className="relative mr-6 h-11">
              {axis.ticks.map((t) => (
                <span key={t.day} className="absolute top-0 flex h-full flex-col justify-center" style={{ left: `${pct(t.day, axis)}%` }}>
                  <span className="absolute top-0 bottom-0 w-px bg-border" />
                  {pct(t.day, axis) < 96 && <span className="pl-2 t-mono-sm whitespace-nowrap text-muted">{t.label}</span>}
                </span>
              ))}
              <span className="absolute top-0 bottom-0 w-px bg-primary" style={{ left: `${asOfPct}%` }} />
            </div>
          </div>

          {rules.length === 0 && <p className="px-6 py-12 text-center t-body-md text-muted">No rule matches these filters.</p>}

          {groups.map((g) => (
            <section key={g.id || "all"} aria-label={g.id ? ruleSectionLabel(g.id) : "Rules"}>
              {g.id && <h4 className="border-b border-border bg-surface px-6 pt-4 pb-2 t-mono-sm text-muted">{ruleSectionLabel(g.id)}</h4>}
              <ul>
                {g.rules.map((r) => {
                  const state = ruleState(r, asOf);
                  const active = state === "active";
                  const from = pct(dayNumber(r.activeFrom), axis);
                  const to = r.activeTo ? pct(dayNumber(r.activeTo), axis) : null;
                  const period = `${formatDate(r.activeFrom)} → ${r.activeTo ? formatDate(r.activeTo) : "open"}`;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => onOpen(r.id)}
                        aria-label={`${r.id} ${r.title}. ${active ? "Active" : "Inactive"}: ${stateReason(r, state)}. ${period}`}
                        className="group grid w-full cursor-pointer grid-cols-[22rem_minmax(0,1fr)] items-center border-b border-border text-left transition-colors duration-150 hover:bg-surface-raised"
                      >
                        <span className="flex min-w-0 items-baseline gap-3 px-6 py-2">
                          <span className="w-14 shrink-0 t-mono-sm text-muted">
                            <Highlight text={r.id} tokens={tokens} />
                          </span>
                          <span className={cn("truncate t-body-sm", active ? "text-on-surface" : "text-body")}>
                            <Highlight text={r.title} tokens={tokens} />
                          </span>
                        </span>
                        <span aria-hidden className="relative mr-6 block h-10" title={period}>
                          <span className="absolute top-0 bottom-0 w-px bg-primary/40" style={{ left: `${asOfPct}%` }} />
                          <span
                            className={cn("absolute top-1/2 h-1 -translate-y-1/2 rounded-full", active ? "bg-primary" : "bg-chart-past")}
                            style={{ left: `${from}%`, width: `${Math.max((to ?? OPEN_END) - from, 0.5)}%` }}
                          />
                          {to === null && (
                            <span
                              className={cn("absolute top-1/2 -translate-y-1/2 border-t border-dashed", active ? "border-primary" : "border-chart-past")}
                              style={{ left: `${Math.max(OPEN_END, from)}%`, right: 0 }}
                            />
                          )}
                          <span className={cn("absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full", active ? "bg-primary" : "bg-chart-past")} style={{ left: `${from}%` }} />
                          {to !== null && (
                            <span className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-chart-mid bg-surface" style={{ left: `${to}%` }} />
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
