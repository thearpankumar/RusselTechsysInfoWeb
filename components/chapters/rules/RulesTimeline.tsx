"use client";

// Timeline view: each rule's state history on one shared month axis. Segments differ by shape, not hue:
// active = solid highlighted bar, approved = solid grey, under review = dashed outline, draft = dotted outline,
// suspended = hatched, retired / superseded = hairline. A labelled line marks the as-of date; with a compare
// date, the window between the two is shaded. Grouped by section when sorted by ID.
import * as React from "react";
import type { RuleRecord, RuleStateChange } from "@/content/types-extra";
import { ruleSectionLabel } from "@/content/rules";
import { STATE_LABEL, dayNumber, formatDate, formatShort, isActive, ruleStateAt, statusLine, type RuleSortKey, type TimelineAxis } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { Highlight, StateLegend, StateMarker, keepArrows, pct, useOverflowX } from "./shared";

const SEGMENT: Record<RuleStateChange["state"], string> = {
  active: "h-2 rounded-full bg-primary",
  approved: "h-2 rounded-full bg-chart-mid",
  review: "h-2 rounded-full border border-dashed border-chart-light",
  draft: "h-2 rounded-full border border-dotted border-chart-mid",
  suspended: "h-2 rounded-full hatch border border-chart-mid",
  retired: "h-px bg-chart-mid",
  superseded: "h-px bg-chart-mid",
};

const LABEL_COL = "grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[20rem_minmax(0,1fr)]";

export const RulesTimeline = React.memo(function RulesTimeline({
  rules,
  asOf,
  vs,
  axis,
  tokens,
  sort,
  openId,
  onOpen,
}: {
  rules: RuleRecord[];
  asOf: string;
  vs: string | null;
  axis: TimelineAxis;
  tokens: string[];
  sort: RuleSortKey;
  openId: string | null;
  onOpen: (id: string) => void;
}) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const scrolls = useOverflowX(scroller);

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
  const vsPct = vs ? pct(dayNumber(vs), axis) : null;
  const band = vsPct === null ? null : { left: Math.min(asOfPct, vsPct), width: Math.abs(asOfPct - vsPct) };
  // Month labels too close to the as-of chip are hidden so they don't collide.
  const near = (p: number) => Math.abs(p - asOfPct) < 5 || (vsPct !== null && Math.abs(p - vsPct) < 5);

  return (
    <div className="flex flex-col gap-4">
      <StateLegend />
      <div className="rounded-xl border border-border bg-surface">
        <div
          ref={scroller}
          data-lenis-prevent
          tabIndex={scrolls ? 0 : undefined}
          role={scrolls ? "region" : undefined}
          aria-label={scrolls ? "Rules timeline (scrolls sideways)" : undefined}
          onKeyDown={keepArrows}
          className="overflow-x-auto rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary xl:overflow-visible print:overflow-visible"
          data-rules-list
        >
          <div className="min-w-3xl">
            {/* Axis */}
            <div className={cn("z-20 grid rounded-t-xl border-b border-border bg-surface-raised xl:sticky xl:top-0", LABEL_COL)}>
              <span className="sticky left-0 z-10 rounded-tl-xl bg-surface-raised px-4 py-3 t-mono-sm text-muted md:px-6">Rule</span>
              <div className="relative mr-6 h-12">
                {band && <span className="absolute inset-y-0 bg-primary/10" style={{ left: `${band.left}%`, width: `${band.width}%` }} />}
                {axis.ticks.map((t) => {
                  const p = pct(t.day, axis);
                  return (
                    <span key={t.day} className="absolute top-0 flex h-full flex-col justify-center" style={{ left: `${p}%` }}>
                      <span className="absolute top-0 bottom-0 w-px bg-border" />
                      {p < 96 && !near(p) && <span className="pl-2 t-mono-sm whitespace-nowrap text-muted">{t.label}</span>}
                    </span>
                  );
                })}
                {vsPct !== null && vs && (
                  <span className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-chart-mid bg-surface-raised px-1.5 t-mono-sm whitespace-nowrap text-body" style={{ left: `${vsPct}%` }}>
                    {formatShort(vs)}
                  </span>
                )}
                <span className="absolute top-0 bottom-0 w-px bg-primary" style={{ left: `${asOfPct}%` }} />
                <span className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-primary px-1.5 t-mono-sm whitespace-nowrap text-on-primary" style={{ left: `${asOfPct}%` }}>
                  {formatShort(asOf)}
                </span>
              </div>
            </div>

            {groups.map((g) => (
              <section key={g.id || "all"} aria-label={g.id ? ruleSectionLabel(g.id) : "Rules"}>
                {g.id && (
                  <p className="sticky left-0 border-b border-border bg-surface px-4 pt-4 pb-2 t-mono-sm text-muted md:px-6" role="heading" aria-level={3}>
                    {ruleSectionLabel(g.id)}
                  </p>
                )}
                <ul>
                  {g.rules.map((r) => {
                    const state = ruleStateAt(r, asOf);
                    const active = isActive(r, asOf);
                    const current = r.id === openId;
                    const summary = r.history.map((h) => `${STATE_LABEL[h.state]} from ${formatDate(h.from)}`).join(", ");
                    return (
                      <li key={r.id}>
                        <button
                          type="button"
                          data-rule-open={r.id}
                          aria-current={current || undefined}
                          onClick={() => onOpen(r.id)}
                          aria-label={`${r.id} ${r.title}. ${active ? "Active" : `Inactive, ${STATE_LABEL[state]}`}: ${statusLine(r, asOf)}. History: ${summary}.`}
                          className={cn("group grid w-full cursor-pointer scroll-mt-16 items-center border-b border-border text-left transition-colors duration-150 hover:bg-surface-raised", LABEL_COL, current && "bg-surface-raised")}
                        >
                          <span className={cn("sticky left-0 z-10 flex min-w-0 items-center gap-2 px-4 py-2 transition-colors duration-150 group-hover:bg-surface-raised md:gap-3 md:px-6", current ? "bg-surface-raised" : "bg-surface")}>
                            <StateMarker state={state} />
                            <span className="w-14 shrink-0 t-mono-sm text-muted">
                              <Highlight text={r.id} tokens={tokens} />
                            </span>
                            <span className={cn("hidden truncate t-body-sm md:block", active ? "text-on-surface" : "text-body")}>
                              <Highlight text={r.title} tokens={tokens} />
                            </span>
                          </span>
                          <span aria-hidden className="relative mr-6 block h-10" title={summary}>
                            {band && <span className="absolute inset-y-0 bg-primary/5" style={{ left: `${band.left}%`, width: `${band.width}%` }} />}
                            <span className="absolute top-0 bottom-0 w-px bg-primary/40" style={{ left: `${asOfPct}%` }} />
                            {r.history.map((h, i) => {
                              const from = pct(dayNumber(h.from), axis);
                              const next = r.history[i + 1];
                              const to = next ? pct(dayNumber(next.from), axis) : 100;
                              return (
                                <span
                                  key={h.from}
                                  className={cn("absolute top-1/2 -translate-y-1/2", SEGMENT[h.state])}
                                  style={{ left: `${from}%`, width: `calc(${Math.max(to - from, 0.4)}% - 2px)` }}
                                />
                              );
                            })}
                            {r.supersededBy && r.activeTo && (
                              <span className="absolute top-0 t-mono-sm text-muted" style={{ left: `calc(${pct(dayNumber(r.activeTo), axis)}% + 4px)` }}>
                                → {r.supersededBy}
                              </span>
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
    </div>
  );
});
