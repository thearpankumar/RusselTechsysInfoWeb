"use client";

// Register toolbar: search; one row of facet pills (each shows its own values and clears itself); as-of and compare
// dates; sort; view switch; download (Excel workbook of every rule, or CSV of the rows shown).
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ArrowDown, ArrowUp, ChartGantt, Check, ChevronDown, Download, FileSpreadsheet, FileText, LayoutGrid, Plus, RotateCcw, Rows3, Search, X } from "lucide-react";
import type { RuleContext, RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, ruleRegister } from "@/content/rules";
import { Button, Kbd, Marker, TabTrack } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import { dataBg } from "@/lib/dataColors";
import {
  AS_OF_MAX,
  AS_OF_MIN,
  FACETS,
  FACET_LABEL,
  FACET_OPTIONS,
  SORT_LABEL,
  dayNumber,
  facetCounts,
  flagCount,
  formatDate,
  hasFilters,
  isAsOfDate,
  rulesToCsv,
  saveBlob,
  type FacetKey,
  type RuleQuery,
  type RuleSortKey,
  type RuleStateValue,
  type RuleView,
} from "@/lib/rules";
import { cn } from "@/lib/utils";
import { FacetPill, type FacetPillOption } from "./FacetPill";
import { StateMarker } from "./shared";
import type { RulesState } from "./useRulesState";

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
};

function facetMarker(facet: FacetKey, value: string): React.ReactNode {
  if (facet === "ctx") return <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dataBg[RULE_CONTEXTS[value as RuleContext].colour])} />;
  if (facet === "status") return <StateMarker state={value === "active" ? "active" : "retired"} />;
  if (facet === "state") return <StateMarker state={value as RuleStateValue} />;
  return undefined;
}

/** ISO date `days` before `iso`, kept inside the as-of range. */
function shiftDate(iso: string, days: number): string {
  const d = new Date((dayNumber(iso) + days) * 86_400_000);
  const out = d.toISOString().slice(0, 10);
  return out < AS_OF_MIN ? AS_OF_MIN : out > AS_OF_MAX ? AS_OF_MAX : out;
}

const pill = "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 t-body-md transition-colors duration-150";

/** Keys a date field keeps: ←/→ move between its segments, Esc closes its picker (neither should reach the page). */
const keepDateKeys = (e: React.KeyboardEvent) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Escape") e.stopPropagation();
};

/**
 * Native date input (typing and the picker both work) that reads like the rest of the site at rest: "12 Nov 2026".
 * While focused, the native segments show so the date can be typed.
 */
function DateField({ id, value, onChange, inputRef }: { id: string; value: string; onChange: (iso: string) => void; inputRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <span className="relative inline-flex items-center">
      <input
        id={id}
        ref={inputRef}
        type="date"
        value={value}
        min={AS_OF_MIN}
        max={AS_OF_MAX}
        onChange={(e) => isAsOfDate(e.target.value) && onChange(e.target.value)}
        onKeyDown={keepDateKeys}
        // A click anywhere on the date opens the picker (typing still works once focused).
        onClick={(e) => {
          try {
            e.currentTarget.showPicker?.();
          } catch {
            /* not allowed here (e.g. in a cross-origin frame): the field still takes typing */
          }
        }}
        className="peer date-field w-36 cursor-pointer bg-transparent t-mono-sm text-transparent outline-none focus:text-on-surface"
      />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center t-body-md whitespace-nowrap text-on-surface tnum peer-focus:hidden">
        {formatDate(value)}
      </span>
    </span>
  );
}

export function RulesToolbar({
  state,
  counted,
  asOf,
  today,
  list,
  searchRef,
}: {
  state: RulesState;
  /** Deferred query: facet counts trail typing like the list does. */
  counted: RuleQuery;
  /** As-of date the list is computed for. */
  asOf: string;
  today: string;
  list: RuleRecord[];
  searchRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { query, setQuery, clearFilters, view, setView } = state;
  const { active } = useJourney();
  const asOfInput = React.useRef<HTMLInputElement>(null);
  const vsInput = React.useRef<HTMLInputElement>(null);
  const compareButton = React.useRef<HTMLButtonElement>(null);
  const liveAsOf = query.asOf ?? today;

  // "f" focuses the register search while this chapter is open ("/" stays the global palette).
  React.useEffect(() => {
    if (active !== "rules") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "f" || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if (isTyping(e.target) || document.querySelector('[role="dialog"][data-state="open"]')) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, searchRef]);

  const options = React.useMemo(() => {
    const out = {} as Record<FacetKey, FacetPillOption[]>;
    for (const f of FACETS) {
      const counts = facetCounts(ruleRegister, counted, asOf, f);
      out[f] = FACET_OPTIONS[f].map((o) => ({ ...o, count: counts.get(o.value) ?? 0, marker: facetMarker(f, o.value) }));
    }
    return out;
  }, [counted, asOf]);
  const flags = React.useMemo(() => flagCount(ruleRegister, counted, asOf), [counted, asOf]);
  const filtered = hasFilters(query);

  const clearAll = () => {
    clearFilters();
    searchRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-4 print:hidden">
      <label className="flex h-14 items-center gap-3 rounded-lg border border-border px-4 transition-colors duration-150 focus-within:border-chart-past">
        <Search aria-hidden className="size-5 shrink-0 text-muted" strokeWidth={1.5} />
        <input
          ref={searchRef}
          type="search"
          value={query.q}
          onChange={(e) => setQuery({ q: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              if (query.q) setQuery({ q: "" });
              else searchRef.current?.blur();
            } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.stopPropagation();
          }}
          placeholder={`Search ${ruleRegister.length} rules: ids, wording, contexts, entities…`}
          aria-label="Search the business rules"
          className="h-full min-w-0 flex-1 bg-transparent t-body-lg text-on-surface outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
        {query.q ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery({ q: "" });
              searchRef.current?.focus();
            }}
            className="cursor-pointer text-muted hover:text-on-surface"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        ) : (
          <Kbd className="hidden sm:inline-flex">f</Kbd>
        )}
      </label>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
        {FACETS.map((f) => (
          <FacetPill key={f} label={FACET_LABEL[f]} options={options[f]} selected={query[f] as string[]} onChange={(values) => setQuery({ [f]: values } as Partial<RuleQuery>)} />
        ))}
        <button
          type="button"
          aria-pressed={query.flag}
          onClick={() => setQuery({ flag: !query.flag })}
          className={cn(pill, "cursor-pointer hover:border-chart-past hover:bg-surface-raised", query.flag ? "border-chart-past bg-surface-raised text-on-surface" : "border-dashed border-border text-body")}
        >
          <Marker shape="hatch" size={8} />
          Needs confirmation
          <span className="tnum text-muted">{flags}</span>
        </button>
        {query.question && (
          <span className={cn(pill, "border-chart-past bg-surface-raised pr-1 text-on-surface")}>
            <span className="text-muted">Waits on:</span> {query.question}
            <button
              type="button"
              aria-label={`Clear filter: waits on ${query.question}`}
              onClick={() => {
                setQuery({ question: null });
                searchRef.current?.focus();
              }}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface hover:text-on-surface"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          </span>
        )}
        {query.vs && (
          <button
            type="button"
            aria-pressed={query.changed}
            onClick={() => setQuery({ changed: !query.changed })}
            className={cn(pill, "cursor-pointer hover:border-chart-past hover:bg-surface-raised", query.changed ? "border-chart-past bg-surface-raised text-on-surface" : "border-dashed border-border text-body")}
          >
            Changed since {formatDate(query.vs)} only
          </button>
        )}
        {filtered && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border pt-4">
        <p role="status" aria-live="polite" className="t-body-md text-body">
          <span className="tnum text-on-surface">{list.length}</span> of <span className="tnum">{ruleRegister.length}</span> rules
        </p>

        {/* As of: status is computed for this day. The reset sits inside the pill, so nothing moves. */}
        <span className={cn(pill, "pr-1 hover:border-chart-past has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary", query.asOf ? "border-chart-past bg-surface-raised" : "border-border")}>
          <label htmlFor="rules-as-of" className="text-muted">
            As of
          </label>
          <DateField id="rules-as-of" inputRef={asOfInput} value={liveAsOf} onChange={(d) => setQuery({ asOf: d === today ? null : d })} />
          <button
            type="button"
            disabled={!query.asOf}
            aria-label={`Back to today, ${formatDate(today)}`}
            title="Back to today"
            onClick={() => {
              setQuery({ asOf: null });
              asOfInput.current?.focus();
            }}
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-on-surface disabled:pointer-events-none disabled:opacity-0"
          >
            <RotateCcw className="size-4" strokeWidth={1.5} />
          </button>
        </span>

        {/* Compare: state changes between another date and the as-of date. */}
        {query.vs ? (
          <span className={cn(pill, "border-chart-past bg-surface-raised pr-1 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary")}>
            <label htmlFor="rules-vs" className="text-muted">
              Compared with
            </label>
            <DateField id="rules-vs" inputRef={vsInput} value={query.vs} onChange={(d) => setQuery({ vs: d })} />
            <button
              type="button"
              aria-label="Stop comparing"
              onClick={() => {
                setQuery({ vs: null, changed: false });
                requestAnimationFrame(() => compareButton.current?.focus());
              }}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface hover:text-on-surface"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          </span>
        ) : (
          <button
            ref={compareButton}
            type="button"
            onClick={() => {
              setQuery({ vs: shiftDate(liveAsOf, -42) });
              requestAnimationFrame(() => vsInput.current?.focus());
            }}
            className={cn(pill, "cursor-pointer border-dashed border-border text-body hover:border-chart-past hover:bg-surface-raised")}
          >
            <Plus aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
            Compare dates
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2 xl:ml-auto">
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
          <DownloadMenu query={query} asOf={asOf} list={list} />
        </div>
      </div>
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
          className={cn(pill, "cursor-pointer border-border text-on-surface hover:border-chart-past hover:bg-surface-raised data-[state=open]:border-chart-past data-[state=open]:bg-surface-raised")}
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
          <p className="px-2 pt-1 pb-2 t-label-caps text-muted">Sort by</p>
          <div role="group" aria-label="Sort by">
            {SORT_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={k === sort}
                onClick={() => onChange(k, k === sort ? dir : "asc")}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left t-body-md transition-colors duration-150 hover:bg-surface-raised"
              >
                <span className="inline-flex size-4 items-center justify-center">{k === sort && <Check aria-hidden className="size-4" strokeWidth={1.5} />}</span>
                {SORT_LABEL[k]}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2 border-t border-border px-2 pt-3 pb-1" role="group" aria-label="Direction">
            {(["asc", "desc"] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={d === dir}
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

const loadExcel = () => import("@/lib/rulesExcel");

function DownloadMenu({ query, asOf, list }: { query: RuleQuery; asOf: string; list: RuleRecord[] }) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const excel = async () => {
    setBusy(true);
    setError(null);
    try {
      const { downloadRulesWorkbook } = await loadExcel();
      saveBlob(await downloadRulesWorkbook({ asOf, query, shown: list }), `rossell-business-rules-${asOf}.xlsx`);
    } catch {
      setError("The workbook could not be built. Try the CSV instead.");
    } finally {
      setBusy(false);
    }
  };
  const csv = () => saveBlob(new Blob([rulesToCsv(list, asOf)], { type: "text/csv;charset=utf-8" }), `rossell-business-rules-${asOf}.csv`);

  const item = "flex w-full cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-raised disabled:pointer-events-none disabled:opacity-40";
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          // Start fetching the Excel code as soon as the menu is likely to be used.
          onPointerEnter={() => void loadExcel()}
          onFocus={() => void loadExcel()}
          className={cn(pill, "cursor-pointer border-border text-on-surface hover:border-primary hover:bg-primary hover:text-on-primary data-[state=open]:border-chart-past data-[state=open]:bg-surface-raised data-[state=open]:text-on-surface")}
        >
          <Download aria-hidden className="size-4" strokeWidth={1.5} />
          Download
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="Download rules"
          className="z-50 w-80 rounded-lg border border-border bg-background p-2 text-on-surface duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <button type="button" onClick={excel} disabled={busy} className={item}>
            <FileSpreadsheet aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.5} />
            <span className="flex flex-col">
              <span className="t-body-md text-on-surface">{busy ? "Preparing workbook…" : "Excel workbook (.xlsx)"}</span>
              <span className="t-body-sm text-muted">All {ruleRegister.length} rules with state history, open questions and contexts; status as of {formatDate(asOf)}.</span>
            </span>
          </button>
          <button type="button" onClick={csv} disabled={!list.length} className={item}>
            <FileText aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.5} />
            <span className="flex flex-col">
              <span className="t-body-md text-on-surface">CSV of this view</span>
              <span className="t-body-sm text-muted">The {list.length} rules shown, in this order.</span>
            </span>
          </button>
          {error && (
            <p role="alert" className="px-2 pt-2 t-body-sm text-on-surface">
              {error}
            </p>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
