"use client";

// Table view: sortable column headers (aria-sort on the sorted column), sticky header and ID column.
// Fixed layout so the Rule column takes the room left over; narrow screens scroll sideways past min-w-4xl.
import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_STRENGTHS, ruleSectionLabel } from "@/content/rules";
import { SORT_LABEL, type RuleSortKey, type SortDir } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { ConfirmFlag, ContextTag, Highlight, PeriodStrip, PeriodText, StatusLabel, type Domain } from "./shared";

/** Each column sorts by one or more keys (status and period share a column: status is derived from the period). */
const COLUMNS: { id: string; sorts: { key: RuleSortKey; label: string }[]; className: string }[] = [
  { id: "id", sorts: [{ key: "id", label: "ID" }], className: "w-24" },
  { id: "rule", sorts: [{ key: "title", label: "Rule" }], className: "" },
  {
    id: "status",
    sorts: [
      { key: "status", label: "Status" },
      { key: "from", label: "Active period" },
    ],
    className: "w-60",
  },
  { id: "context", sorts: [{ key: "context", label: "Context" }], className: "w-52" },
  {
    id: "strength",
    sorts: [
      { key: "strength", label: "Strength" },
      { key: "owner", label: "Owner" },
    ],
    className: "w-36",
  },
];

const cell = "border-b border-border px-4 py-4 transition-colors duration-150 group-hover:bg-surface-raised";

function SortButton({ label, active, dir, onClick }: { label: string; active: boolean; dir: SortDir; onClick: () => void }) {
  const Arrow = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("group/sort inline-flex cursor-pointer items-center gap-1 t-mono-sm whitespace-nowrap transition-colors duration-150 hover:text-on-surface", active ? "text-on-surface" : "text-muted")}
    >
      {label}
      <Arrow aria-hidden className={cn("size-3.5", !active && "opacity-0 group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100")} strokeWidth={1.5} />
    </button>
  );
}

export function RulesTable({
  rules,
  asOf,
  domain,
  tokens,
  sort,
  dir,
  onSort,
  onOpen,
}: {
  rules: RuleRecord[];
  asOf: string;
  domain: Domain;
  tokens: string[];
  sort: RuleSortKey;
  dir: SortDir;
  /** Sort by this key; the same key again flips the direction. */
  onSort: (key: RuleSortKey) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div data-lenis-prevent className="max-h-[70vh] overflow-auto overscroll-contain">
        <table className="w-full min-w-4xl table-fixed border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            Business rules, {rules.length} shown, sorted by {SORT_LABEL[sort]} {dir === "asc" ? "ascending" : "descending"}. Status is as of {asOf}. Use the column header
            buttons to sort; select a rule to open it.
          </caption>
          <thead>
            <tr>
              {COLUMNS.map((c, i) => {
                const sorted = c.sorts.some((s) => s.key === sort);
                return (
                  <th
                    key={c.id}
                    scope="col"
                    aria-sort={sorted ? (dir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("sticky top-0 z-20 border-b border-border bg-surface-raised px-4 py-3 font-normal", i === 0 && "left-0 z-30 pl-6", c.className)}
                  >
                    <span className="flex flex-col items-start gap-1">
                      {c.sorts.map((s) => (
                        <SortButton key={s.key} label={s.label} active={sort === s.key} dir={dir} onClick={() => onSort(s.key)} />
                      ))}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} onClick={() => onOpen(r.id)} className="group cursor-pointer align-top">
                <td className={cn(cell, "sticky left-0 z-10 bg-surface pl-6")}>
                  <span className="block t-mono-sm text-on-surface">
                    <Highlight text={r.id} tokens={tokens} />
                  </span>
                  <span className="mt-1 block t-mono-sm text-muted">{r.section.startsWith("WS") ? "Session" : `§${r.section}`}</span>
                </td>
                <td className={cell}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(r.id);
                    }}
                    className="cursor-pointer text-left t-body-md text-on-surface underline-offset-4 hover:underline"
                  >
                    <Highlight text={r.title} tokens={tokens} />
                  </button>
                  <p className="mt-1 line-clamp-2 t-body-sm text-muted" title={r.text}>
                    <Highlight text={r.text} tokens={tokens} />
                  </p>
                  <p className="sr-only">{ruleSectionLabel(r.section)}</p>
                </td>
                <td className={cell}>
                  <StatusLabel rule={r} asOf={asOf} withReason />
                  <PeriodText rule={r} className="mt-3 block" />
                  <PeriodStrip rule={r} asOf={asOf} domain={domain} className="mt-2" />
                  <ConfirmFlag rule={r} className="mt-2" />
                </td>
                <td className={cell}>
                  <span className="flex flex-col gap-1">
                    {r.contexts.map((c) => (
                      <ContextTag key={c} ctx={c} />
                    ))}
                  </span>
                </td>
                <td className={cell}>
                  <span className="block t-body-md text-on-surface">{RULE_STRENGTHS[r.strength].label}</span>
                  <span className="mt-1 block t-body-sm text-muted">{r.owner}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
