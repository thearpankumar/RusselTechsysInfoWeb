"use client";

// Compare two dates: one line saying what changed between them (by the state rules moved into), and a change log
// of every dated state change in the window, newest first. Respects the register's filters.
import * as React from "react";
import type { RuleLifecycle, RuleRecord } from "@/content/types-extra";
import { Button } from "@/components/ui-rt";
import { STATE_LABEL, changeBetween, changesInWindow, formatDate, type RuleStateValue } from "@/lib/rules";
import { StateMarker } from "./shared";

const VERB: Record<RuleStateValue, string> = {
  active: "became active",
  approved: "were approved",
  review: "went into review",
  draft: "were drafted",
  suspended: "were suspended",
  retired: "retired",
  superseded: "were superseded",
  none: "were not yet drafted",
};
const ORDER: RuleStateValue[] = ["active", "approved", "review", "draft", "suspended", "superseded", "retired", "none"];
const SHOWN = 12;

export function RulesChanges({ rules, vs, asOf, onOpenRule }: { rules: RuleRecord[]; vs: string; asOf: string; onOpenRule: (id: string) => void }) {
  const [all, setAll] = React.useState(false);
  const [earlier, later] = vs <= asOf ? [vs, asOf] : [asOf, vs];

  const byTarget = React.useMemo(() => {
    const m = new Map<RuleStateValue, number>();
    for (const r of rules) {
      const c = changeBetween(r, earlier, later);
      if (c) m.set(c.to, (m.get(c.to) ?? 0) + 1);
    }
    return ORDER.filter((s) => m.has(s)).map((s) => ({ state: s, n: m.get(s)! }));
  }, [rules, earlier, later]);
  const log = React.useMemo(() => changesInWindow(rules, earlier, later), [rules, earlier, later]);
  const changed = byTarget.reduce((a, b) => a + b.n, 0);

  return (
    <section aria-label="What changed between the two dates" className="rounded-xl border border-border bg-surface p-6">
      <p className="t-body-lg text-on-surface">
        Between {formatDate(earlier)} and {formatDate(later)}: {changed === 0 ? "no rule in this view changed state." : `${changed} ${changed === 1 ? "rule" : "rules"} in this view changed state.`}
      </p>
      {byTarget.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {byTarget.map(({ state, n }) => (
            <li key={state} className="inline-flex items-center gap-2 t-body-md text-body">
              <StateMarker state={state} />
              <span className="tnum text-on-surface">{n}</span> {VERB[state]}
            </li>
          ))}
        </ul>
      )}
      {log.length > 0 && (
        <details className="group mt-4 border-t border-border pt-4">
          <summary className="cursor-pointer t-body-md text-body marker:text-muted hover:text-on-surface">
            Change log · <span className="tnum">{log.length}</span> dated {log.length === 1 ? "change" : "changes"}
          </summary>
          <ol className="mt-3 divide-y divide-border">
            {(all ? log : log.slice(0, SHOWN)).map(({ rule, change, previous }) => (
              <li key={`${rule.id}-${change.from}`} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-2 sm:grid-cols-[6.5rem_4.5rem_minmax(0,1fr)_auto]">
                <span className="t-mono-sm text-muted tnum">{formatDate(change.from)}</span>
                <button type="button" onClick={() => onOpenRule(rule.id)} className="cursor-pointer text-left t-mono-sm text-on-surface underline-offset-4 hover:underline">
                  {rule.id}
                </button>
                <span className="col-span-2 min-w-0 truncate t-body-sm text-body sm:col-span-1">{rule.title}</span>
                <span className="col-span-2 inline-flex items-center gap-1.5 t-body-sm text-muted sm:col-span-1">
                  <StateMarker state={previous} className="size-2" />
                  {STATE_LABEL[previous]} → <StateMarker state={change.state as RuleLifecycle} className="size-2" />
                  <span className="text-on-surface">{STATE_LABEL[change.state]}</span>
                </span>
              </li>
            ))}
          </ol>
          {log.length > SHOWN && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setAll((x) => !x)}>
              {all ? "Show fewer" : `Show all ${log.length}`}
            </Button>
          )}
        </details>
      )}
    </section>
  );
}
