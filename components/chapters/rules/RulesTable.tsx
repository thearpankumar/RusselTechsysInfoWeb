"use client";

// Table view. Fixed layout: the Rule column takes the room left over. On wide screens (xl) the table flows in
// the page and its header sticks to the top of the window; narrower, it scrolls sideways inside a focusable region
// (←/→ scroll it rather than switch chapter) with a sticky ID column.
import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { RuleRecord } from "@/content/types-extra";
import { RULE_STRENGTHS, ruleSectionLabel, sectionShort } from "@/content/rules";
import { SORT_LABEL, matchedEntities, type RuleSortKey, type SortDir } from "@/lib/rules";
import { cn } from "@/lib/utils";
import { AddedTag, ChangeTag, ConfirmFlag, ContextTag, EditedTag, Highlight, StatusLabel, keepArrows, useOverflowX } from "./shared";

/** Each column sorts by one or more keys (status shares a column with the active period it is derived from). */
const COLUMNS: { id: string; sorts: { key: RuleSortKey; label: string }[]; className: string }[] = [
  { id: "id", sorts: [{ key: "id", label: "ID" }], className: "w-24" },
  { id: "rule", sorts: [{ key: "title", label: "Rule" }], className: "" },
  {
    id: "status",
    sorts: [
      { key: "status", label: "Status" },
      { key: "from", label: "Active from" },
    ],
    className: "w-64",
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

const cell = "border-b border-border px-4 py-3 transition-colors duration-150 group-hover:bg-surface-raised";

function SortButton({ label, active, dir, onClick }: { label: string; active: boolean; dir: SortDir; onClick: () => void }) {
  const Arrow = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? `${label}, sorted ${dir === "asc" ? "ascending" : "descending"}` : `Sort by ${label}`}
      className={cn("group/sort inline-flex cursor-pointer items-center gap-1 t-mono-sm whitespace-nowrap transition-colors duration-150 hover:text-on-surface", active ? "text-on-surface" : "text-muted")}
    >
      {label}
      <Arrow aria-hidden className={cn("size-3.5", !active && "opacity-0 group-hover/sort:opacity-100 group-focus-visible/sort:opacity-100")} strokeWidth={1.5} />
    </button>
  );
}

export const RulesTable = React.memo(function RulesTable({
  rules,
  asOf,
  vs,
  tokens,
  sort,
  dir,
  openId,
  onSort,
  onOpen,
}: {
  rules: RuleRecord[];
  asOf: string;
  vs: string | null;
  tokens: string[];
  sort: RuleSortKey;
  dir: SortDir;
  openId: string | null;
  /** Sort by this key; the same key again flips the direction. */
  onSort: (key: RuleSortKey) => void;
  onOpen: (id: string) => void;
}) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const scrolls = useOverflowX(scroller);

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div
        ref={scroller}
        data-lenis-prevent
        tabIndex={scrolls ? 0 : undefined}
        role={scrolls ? "region" : undefined}
        aria-label={scrolls ? "Rules table (scrolls sideways)" : undefined}
        onKeyDown={keepArrows}
        className="scroll-pl-24 overflow-x-auto rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary xl:overflow-visible print:overflow-visible"
      >
        <table className="w-full min-w-4xl table-fixed border-separate border-spacing-0 text-left" data-rules-list>
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
                    className={cn(
                      "z-20 border-b border-border bg-surface-raised px-4 py-3 align-top font-normal xl:sticky xl:top-(--section-tabs-h)",
                      i === 0 && "sticky left-0 z-30 rounded-tl-xl pl-6",
                      i === COLUMNS.length - 1 && "rounded-tr-xl",
                      c.className
                    )}
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
            {rules.map((r) => {
              const current = r.id === openId;
              const entities = matchedEntities(r, tokens);
              return (
                <tr
                  key={r.id}
                  aria-current={current || undefined}
                  onClick={() => {
                    // Let people select text in a row without opening it.
                    if (window.getSelection()?.toString()) return;
                    onOpen(r.id);
                  }}
                  className={cn("group cursor-pointer align-top", current && "[&>td]:bg-surface-raised")}
                >
                  <td className={cn(cell, "sticky left-0 z-10 bg-surface pl-6")}>
                    <span className="block t-mono-sm text-on-surface">
                      <Highlight text={r.id} tokens={tokens} />
                    </span>
                    <span className="mt-1 block truncate t-mono-sm text-muted">{sectionShort(r.section)}</span>
                    {r.added && <AddedTag className="mt-2" />}
                    {r.edited && <EditedTag className="mt-2" />}
                  </td>
                  <td className={cell}>
                    <button
                      type="button"
                      data-rule-open={r.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(r.id);
                      }}
                      className="cursor-pointer scroll-mt-40 text-left t-body-md text-on-surface underline-offset-4 hover:underline"
                    >
                      <Highlight text={r.title} tokens={tokens} />
                    </button>
                    <p className="mt-1 line-clamp-1 t-body-sm text-muted" title={r.text}>
                      <Highlight text={r.text} tokens={tokens} />
                      {r.list && <span className="text-muted"> ({r.list.length} items)</span>}
                    </p>
                    {entities.length > 0 && (
                      <p className="mt-1 truncate t-mono-sm text-muted">
                        <Highlight text={entities.join(" · ")} tokens={tokens} />
                      </p>
                    )}
                    <p className="sr-only">{ruleSectionLabel(r.section)}</p>
                  </td>
                  <td className={cell}>
                    {/* Two lines: status, then the period with any open question beside it. */}
                    <StatusLabel rule={r} asOf={asOf} extra={<ConfirmFlag rule={r} compact />} />
                    {vs && <ChangeTag rule={r} vs={vs} asOf={asOf} className="mt-2" />}
                  </td>
                  <td className={cell}>
                    <span className="flex flex-col gap-1">
                      {r.contexts.map((c) => (
                        <ContextTag key={c} ctx={c} tokens={tokens} />
                      ))}
                    </span>
                  </td>
                  <td className={cell}>
                    <span className="block t-body-md text-body">{RULE_STRENGTHS[r.strength].label}</span>
                    <span className="mt-1 block t-body-sm text-muted">
                      <Highlight text={r.owner} tokens={tokens} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
