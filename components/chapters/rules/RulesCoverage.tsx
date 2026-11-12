"use client";

// Coverage matrix: spec parts × contexts. Each cell counts the rules in that part that apply to that context, on
// the grey-to-highlight heat ramp (DESIGN.md); empty cells show "—". A cell filters the register to those rules.
import * as React from "react";
import { RULE_CONTEXTS, RULE_CONTEXT_ORDER, currentSections } from "@/content/rules";
import type { RuleContext, RuleRecord } from "@/content/types-extra";
import { heatLevel, type HeatLevel } from "@/components/ui-rt";
import { dataBg } from "@/lib/dataColors";
import type { RuleQuery } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { keepArrows, useOverflowX } from "./shared";

const LEVEL: Record<HeatLevel, string> = {
  empty: "bg-surface-raised text-muted",
  past: "bg-chart-past text-on-surface",
  low: "bg-chart-mid text-on-primary",
  mid: "bg-chart-light text-on-primary",
  high: "bg-primary text-on-primary",
};

/** Parts × contexts from the sections and rules in use (this browser's changes included). */
function buildMatrix(rules: RuleRecord[]) {
  const sections = currentSections();
  const parts = [...new Set(sections.map((s) => s.part))].map((part) => ({ part, sections: sections.filter((s) => s.part === part).map((s) => s.id) }));
  const matrix = parts.map(({ part, sections: ids }) => {
    const inPart = rules.filter((r) => ids.includes(r.section));
    return { part, sections: ids, total: inPart.length, cells: RULE_CONTEXT_ORDER.map((c) => inPart.filter((r) => r.contexts.includes(c)).length) };
  });
  return { matrix, max: Math.max(1, ...matrix.flatMap((m) => m.cells)) };
}

const same = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

export function RulesCoverage({ rules, query, onSelect }: { rules: RuleRecord[]; query: RuleQuery; onSelect: (ctx: RuleContext, sections: string[]) => void }) {
  const { matrix, max } = React.useMemo(() => buildMatrix(rules), [rules]);
  const scroller = React.useRef<HTMLDivElement>(null);
  const scrolls = useOverflowX(scroller);
  return (
    <div
      ref={scroller}
      tabIndex={scrolls ? 0 : undefined}
      role={scrolls ? "region" : undefined}
      aria-label={scrolls ? "Coverage matrix (scrolls sideways)" : undefined}
      onKeyDown={keepArrows}
      className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <table className="w-full min-w-4xl table-fixed border-separate border-spacing-1 text-left">
        <caption className="sr-only">Rules per spec part and context. Select a cell to show those rules in the register.</caption>
        <thead>
          <tr>
            <th scope="col" className="w-48 px-2 pb-2 align-bottom font-normal t-mono-sm text-muted">
              Part
            </th>
            {RULE_CONTEXT_ORDER.map((c) => (
              <th key={c} scope="col" className="px-2 pb-2 align-bottom font-normal">
                <span className="flex items-start gap-2 t-body-sm text-body">
                  <span aria-hidden className={cn("mt-1.5 size-2 shrink-0 rounded-full", dataBg[RULE_CONTEXTS[c].colour])} />
                  {RULE_CONTEXTS[c].label}
                </span>
              </th>
            ))}
            <th scope="col" className="w-16 px-2 pb-2 text-right align-bottom font-normal t-mono-sm text-muted">
              Rules
            </th>
          </tr>
        </thead>
        <tbody>
          {matrix.map((row) => (
            <tr key={row.part}>
              <th scope="row" className="px-2 text-left font-normal t-body-md text-on-surface">
                {row.part}
              </th>
              {row.cells.map((n, i) => {
                const c = RULE_CONTEXT_ORDER[i];
                const selected = same(query.ctx, [c]) && same(query.sec, row.sections);
                const level = n ? heatLevel(n, 1, max) : "empty";
                return (
                  <td key={c} className="p-0">
                    {n ? (
                      <button
                        type="button"
                        aria-pressed={selected}
                        aria-label={`${n} ${n === 1 ? "rule" : "rules"}: ${row.part}, ${RULE_CONTEXTS[c].label}. Show them`}
                        onClick={() => onSelect(c, row.sections)}
                        className={cn(
                          "flex h-12 w-full cursor-pointer items-center justify-center rounded-md t-body-md tnum transition-opacity duration-150 hover:opacity-85",
                          LEVEL[level],
                          selected && "outline-2 outline-offset-2 outline-primary"
                        )}
                      >
                        {n}
                      </button>
                    ) : (
                      <span className={cn("flex h-12 w-full items-center justify-center rounded-md t-body-md", LEVEL.empty)} aria-label={`No rules: ${row.part}, ${RULE_CONTEXTS[c].label}`}>
                        —
                      </span>
                    )}
                  </td>
                );
              })}
              <td className="px-2 text-right t-body-md text-on-surface tnum">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
