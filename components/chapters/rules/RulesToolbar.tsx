"use client";

// Register toolbar: search, facet pills, applied-filter chips, as-of date, sort, view switch and CSV export.
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ArrowDown, ArrowUp, ChartGantt, Check, ChevronDown, Download, LayoutGrid, Rows3, Search, X } from "lucide-react";
import type { RuleContext, RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, ruleRegister } from "@/content/rules";
import { openQuestions } from "@/content/openQuestions";
import { Button, Kbd, Marker, TabTrack } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import { dataBg } from "@/lib/dataColors";
import {
  FACET_LABEL,
  FACET_OPTIONS,
  SORT_LABEL,
  facetCounts,
  facetValueLabel,
  formatDate,
  hasFilters,
  needsConfirmation,
  rulesToCsv,
  type FacetKey,
  type RuleQuery,
  type RuleSortKey,
  type RuleView,
} from "@/lib/rules";
import { cn } from "@/lib/utils";
import { FacetPill, type FacetPillOption } from "./FacetPill";
import type { RulesState } from "./useRulesState";

const FACETS: FacetKey[] = ["status", "ctx", "sec", "str", "origin", "owner"];

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
};

function facetMarker(facet: FacetKey, value: string): React.ReactNode {
  if (facet === "ctx") return <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dataBg[RULE_CONTEXTS[value as RuleContext].colour])} />;
  if (facet === "status") return <Marker tone={value === "active" ? "primary" : "mid"} shape={value === "active" ? "dot" : "hollow"} size={8} />;
  return undefined;
}

export function RulesToolbar({ state, asOf, today, list }: { state: RulesState; asOf: string; today: string; list: RuleRecord[] }) {
  const { query, setQuery, clearFilters, view, setView } = state;
  const input = React.useRef<HTMLInputElement>(null);
  const { active } = useJourney();

  // "f" focuses the register search while this chapter is open ("/" stays the global palette).
  React.useEffect(() => {
    if (active !== "rules") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "f" || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if (isTyping(e.target) || document.querySelector('[role="dialog"][data-state="open"]')) return;
      e.preventDefault();
      input.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const facetOptions = (facet: FacetKey): FacetPillOption[] => {
    const counts = facetCounts(ruleRegister, query, asOf, facet);
    return FACET_OPTIONS[facet].map((o) => ({ ...o, count: counts.get(o.value) ?? 0, marker: facetMarker(facet, o.value) }));
  };

  const flagCount = React.useMemo(() => ruleRegister.filter(needsConfirmation).length, []);
  const question = query.question ? openQuestions.find((q) => q.id === query.question) : undefined;
  const filtered = hasFilters(query);

  const exportCsv = () => {
    const blob = new Blob([rulesToCsv(list, asOf)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rossell-business-rules-${asOf}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="flex h-14 items-center gap-3 rounded-lg border border-border px-4 transition-colors duration-150 focus-within:border-chart-past">
        <Search aria-hidden className="size-5 shrink-0 text-muted" strokeWidth={1.5} />
        <input
          ref={input}
          type="search"
          value={query.q}
          onChange={(e) => setQuery({ q: e.target.value })}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              if (query.q) setQuery({ q: "" });
              else input.current?.blur();
            }
          }}
          placeholder={`Search ${ruleRegister.length} rules: ids, wording, contexts, entities…`}
          aria-label="Search the business rules"
          className="h-full min-w-0 flex-1 bg-transparent t-body-lg text-on-surface outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
        {query.q ? (
          <button type="button" aria-label="Clear search" onClick={() => setQuery({ q: "" })} className="cursor-pointer text-muted hover:text-on-surface">
            <X className="size-5" strokeWidth={1.5} />
          </button>
        ) : (
          <Kbd className="hidden sm:inline-flex">f</Kbd>
        )}
      </label>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
        {FACETS.map((f) => (
          <FacetPill key={f} label={FACET_LABEL[f]} options={facetOptions(f)} selected={query[f] as string[]} onChange={(values) => setQuery({ [f]: values } as Partial<RuleQuery>)} />
        ))}
        <button
          type="button"
          aria-pressed={query.flag}
          onClick={() => setQuery({ flag: !query.flag })}
          className={cn(
            "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 t-body-md transition-colors duration-150 ease-out hover:border-chart-past hover:bg-surface-raised",
            query.flag ? "border-chart-past bg-surface-raised text-on-surface" : "border-dashed border-border text-body"
          )}
        >
          <Marker shape="hatch" size={8} />
          Needs confirmation
          <span className="tnum text-muted">{flagCount}</span>
        </button>
      </div>

      {filtered && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Applied filters">
          {FACETS.flatMap((f) =>
            (query[f] as string[]).map((v) => (
              <AppliedChip key={`${f}:${v}`} facet={FACET_LABEL[f]} label={facetValueLabel(f, v)} onClear={() => setQuery((q) => ({ [f]: (q[f] as string[]).filter((x) => x !== v) }) as Partial<RuleQuery>)} />
            ))
          )}
          {query.flag && <AppliedChip facet="Flag" label="Needs confirmation" onClear={() => setQuery({ flag: false })} />}
          {question && <AppliedChip facet="Waits on" label={question.id} onClear={() => setQuery({ question: null })} />}
          {query.q.trim() && <AppliedChip facet="Search" label={`“${query.q.trim()}”`} onClear={() => setQuery({ q: "" })} />}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border pt-4">
        <p role="status" aria-live="polite" className="t-body-md text-body">
          <span className="tnum text-on-surface">{list.length}</span> of <span className="tnum">{ruleRegister.length}</span> rules
        </p>
        <AsOfControl asOf={asOf} today={today} custom={query.asOf !== null} onChange={(d) => setQuery({ asOf: d === today ? null : d })} />
        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <SortMenu sort={query.sort} dir={query.dir} onChange={(sort, dir) => setQuery({ sort, dir })} />
          <TabTrack<RuleView>
            label="View"
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: "table", label: "Table", icon: <Rows3 aria-hidden /> },
              { value: "cards", label: "Cards", icon: <LayoutGrid aria-hidden /> },
              { value: "timeline", label: "Timeline", icon: <ChartGantt aria-hidden /> },
            ]}
          />
          <Button size="sm" icon={<Download aria-hidden />} onClick={exportCsv} disabled={!list.length} title={`Download the ${list.length} rules shown as CSV`}>
            CSV
          </Button>
        </div>
      </div>
    </div>
  );
}

function AppliedChip({ facet, label, onClear }: { facet: string; label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Remove filter ${facet}: ${label}`}
      className="inline-flex h-8 max-w-full cursor-pointer items-center gap-2 rounded-full border border-chart-past bg-surface-raised px-3 t-body-sm text-on-surface transition-colors duration-150 hover:border-primary"
    >
      <span className="text-muted">{facet}</span>
      <span className="truncate">{label}</span>
      <X aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
    </button>
  );
}

/** "As of" date: status is computed for this day. Today unless changed; a reset appears once changed. */
function AsOfControl({ asOf, today, custom, onChange }: { asOf: string; today: string; custom: boolean; onChange: (iso: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className={cn("inline-flex h-10 items-center gap-2 rounded-full border px-3 t-body-md transition-colors duration-150 focus-within:border-chart-past", custom ? "border-chart-past bg-surface-raised" : "border-border")}>
        <span className="text-muted">As of</span>
        <input
          type="date"
          value={asOf}
          min="2026-01-01"
          max="2028-12-31"
          onChange={(e) => e.target.value && onChange(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="Show status as of date"
          className="bg-transparent t-mono-sm text-on-surface tnum outline-none"
        />
      </label>
      {custom && (
        <button type="button" onClick={() => onChange(today)} className="cursor-pointer t-body-sm text-body underline-offset-4 hover:text-on-surface hover:underline">
          Back to today ({formatDate(today)})
        </button>
      )}
    </div>
  );
}

const SORT_KEYS = Object.keys(SORT_LABEL) as RuleSortKey[];

function SortMenu({ sort, dir, onChange }: { sort: RuleSortKey; dir: "asc" | "desc"; onChange: (sort: RuleSortKey, dir: "asc" | "desc") => void }) {
  const Arrow = dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={`Sort: ${SORT_LABEL[sort]}, ${dir === "asc" ? "ascending" : "descending"}`}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border px-3 t-body-md text-on-surface transition-colors duration-150 hover:border-chart-past hover:bg-surface-raised data-[state=open]:border-chart-past data-[state=open]:bg-surface-raised"
        >
          <span className="text-muted">Sort</span>
          {SORT_LABEL[sort]}
          <Arrow aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
          <ChevronDown aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="Sort rules"
          className="z-50 w-64 rounded-lg border border-border bg-background p-2 text-on-surface duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <div role="radiogroup" aria-label="Sort by">
            {SORT_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={k === sort}
                onClick={() => onChange(k, k === sort ? dir : "asc")}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left t-body-md transition-colors duration-150 hover:bg-surface-raised"
              >
                <span className="inline-flex size-4 items-center justify-center">{k === sort && <Check aria-hidden className="size-4" strokeWidth={1.5} />}</span>
                {SORT_LABEL[k]}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2 border-t border-border px-2 pt-3 pb-1" role="radiogroup" aria-label="Direction">
            {(["asc", "desc"] as const).map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={d === dir}
                onClick={() => onChange(sort, d)}
                className={cn(
                  "inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1 rounded-full border t-body-sm transition-colors duration-150",
                  d === dir ? "border-primary bg-primary text-on-primary" : "border-border text-body hover:border-chart-past"
                )}
              >
                {d === "asc" ? <ArrowUp aria-hidden className="size-4" strokeWidth={1.5} /> : <ArrowDown aria-hidden className="size-4" strokeWidth={1.5} />}
                {d === "asc" ? "Ascending" : "Descending"}
              </button>
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
