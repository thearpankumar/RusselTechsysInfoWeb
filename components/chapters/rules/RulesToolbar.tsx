"use client";

// Register toolbar, two compact rows (fits a 14" laptop without pushing the table down):
//   1. search · dates (as-of + compare, one popover) · sort · view switch · download · Add rule · ⋯ (sections,
//      deleted items, discard local changes)
//   2. filters: facet pills (each shows and clears its own values), flags, "Clear all", result count
// Patterns: Carbon data-table toolbar (few actions, row-height controls), Genesys Spark table filtering (compact
// search, filters as a row of dropdowns), PatternFly toolbar (search, filter, sort and view grouped above the data).
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ArrowDown, ArrowUp, CalendarDays, ChartGantt, Check, ChevronDown, Download, Ellipsis, FileSpreadsheet, FileText, FolderPlus, LayoutGrid, ListTree, Pencil, Plus, RotateCcw, Rows3, Search, Trash2, X } from "lucide-react";
import type { LocalChanges, RuleContext, RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS } from "@/content/rules";
import { Button, Kbd, Marker, TabTrack } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import { dataBg } from "@/lib/dataColors";
import {
  FACETS,
  FACET_LABEL,
  facetOptions,
  SORT_LABEL,
  addDays,
  facetCounts,
  flagCount,
  formatDate,
  formatShort,
  hasFilters,
  rulesToCsv,
  saveBlob,
  type FacetKey,
  type RuleQuery,
  type RuleSortKey,
  type RuleStateValue,
  type RuleView,
} from "@/lib/rules";
import { cn } from "@/lib/utils";
import { FacetPill, MoreFacets, type FacetPillOption } from "./FacetPill";
import { DateField, StateMarker } from "./shared";
import type { RulesState } from "./useRulesState";
import type { SectionsPanelView } from "./SectionsPanel";

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

const pill = "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 t-body-md transition-colors duration-150";

/** Facets that fold into "More" on laptop widths (the least used). */
const FOLDED: FacetKey[] = ["str", "origin", "owner"];
/** Below this width the view switch, sort and download show icons only (names stay for screen readers). */
const WIDE = "sr-only min-[1680px]:not-sr-only";

export function RulesToolbar({
  state,
  rules,
  counted,
  asOf,
  today,
  list,
  searchRef,
  local,
  changedCount,
  localCount,
  deletedCount,
  onAddRule,
  onManage,
  onDiscardAll,
}: {
  state: RulesState;
  /** The register with this browser's date edits applied. */
  rules: RuleRecord[];
  /** Deferred query: facet counts trail typing like the list does. */
  counted: RuleQuery;
  /** As-of date the list is computed for. */
  asOf: string;
  today: string;
  list: RuleRecord[];
  searchRef: React.RefObject<HTMLInputElement | null>;
  /** Everything changed in this browser (exported to Excel). */
  local: LocalChanges;
  /** Rules edited or added in this browser (the "Local changes" filter). */
  changedCount: number;
  /** Every local change (incl. deleted rules and section changes). */
  localCount: number;
  /** Published rules and sections deleted here. */
  deletedCount: number;
  onAddRule: () => void;
  onManage: (view: SectionsPanelView) => void;
  onDiscardAll: () => void;
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
      const counts = facetCounts(rules, counted, asOf, f);
      out[f] = facetOptions(f).map((o) => ({ ...o, count: counts.get(o.value) ?? 0, marker: facetMarker(f, o.value) }));
    }
    return out;
  }, [rules, counted, asOf]);
  const flags = React.useMemo(() => flagCount(rules, counted, asOf), [rules, counted, asOf]);
  const filtered = hasFilters(query);

  const clearAll = () => {
    clearFilters();
    searchRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-3 print:hidden">
      {/* Row 1: search · count · dates · sort · view · download */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 min-w-44 flex-1 basis-48 items-center gap-2 rounded-lg border border-border px-3 transition-colors duration-150 hover:border-chart-past focus-within:border-chart-past">
          <Search aria-hidden className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
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
            placeholder="Search rules…"
            aria-label="Search the business rules"
            className="h-full min-w-0 flex-1 bg-transparent t-body-md text-on-surface outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
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
              <X className="size-4" strokeWidth={1.5} />
            </button>
          ) : (
            <Kbd className="hidden h-6 min-w-6 sm:inline-flex">f</Kbd>
          )}
        </label>
        <DatesMenu query={query} setQuery={setQuery} today={today} liveAsOf={liveAsOf} asOfInput={asOfInput} vsInput={vsInput} compareButton={compareButton} />
        <SortMenu sort={query.sort} dir={query.dir} onChange={(sort, dir) => setQuery({ sort, dir })} />
        <TabTrack<RuleView>
          label="View"
          size="sm"
          value={view}
          onChange={setView}
          // Icons only on laptop widths (names stay for screen readers); names show from 1680px.
          options={[
            { value: "table", label: <span className={WIDE}>Table</span>, icon: <Rows3 aria-hidden /> },
            { value: "cards", label: <span className={WIDE}>Cards</span>, icon: <LayoutGrid aria-hidden /> },
            { value: "timeline", label: <span className={WIDE}>Timeline</span>, icon: <ChartGantt aria-hidden /> },
          ]}
        />
        <DownloadMenu rules={rules} local={local} query={query} asOf={asOf} list={list} editCount={localCount} />
        <Button size="sm" icon={<Plus aria-hidden />} onClick={onAddRule}>
          Add rule
        </Button>
        <ActionsMenu localCount={localCount} deletedCount={deletedCount} onManage={onManage} onDiscardAll={onDiscardAll} />
      </div>

      {/* Row 2: filters */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
        {FACETS.map((f) => (
          <FacetPill
            key={f}
            label={FACET_LABEL[f]}
            options={options[f]}
            selected={query[f] as string[]}
            onChange={(values) => setQuery({ [f]: values } as Partial<RuleQuery>)}
            className={FOLDED.includes(f) ? "hidden 2xl:inline-flex" : undefined}
          />
        ))}
        <MoreFacets
          className="2xl:hidden"
          facets={FOLDED.map((f) => ({
            key: f,
            label: FACET_LABEL[f],
            options: options[f],
            selected: query[f] as string[],
            onChange: (values: string[]) => setQuery({ [f]: values } as Partial<RuleQuery>),
          }))}
        />
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
        {(changedCount > 0 || query.edited) && (
          <button
            type="button"
            aria-pressed={query.edited}
            onClick={() => setQuery({ edited: !query.edited })}
            title="Rules edited or added in this browser"
            className={cn(pill, "cursor-pointer hover:border-chart-past hover:bg-surface-raised", query.edited ? "border-chart-past bg-surface-raised text-on-surface" : "border-dashed border-border text-body")}
          >
            <Pencil aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
            Local changes
            <span className="tnum text-muted">{changedCount}</span>
          </button>
        )}
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
        <p role="status" aria-live="polite" className="ml-auto px-2 t-body-md whitespace-nowrap text-body">
          <span className="tnum text-on-surface">{list.length}</span> of <span className="tnum">{rules.length}</span> rules
        </p>
      </div>
    </div>
  );
}

/**
 * One "Dates" control: the as-of date (status is computed for it) and an optional compare date, in a popover.
 * The trigger reads "As of 12 Nov 2026", or "1 Oct → 12 Nov 2026" while comparing.
 */
function DatesMenu({
  query,
  setQuery,
  today,
  liveAsOf,
  asOfInput,
  vsInput,
  compareButton,
}: {
  query: RuleQuery;
  setQuery: RulesState["setQuery"];
  today: string;
  liveAsOf: string;
  asOfInput: React.RefObject<HTMLInputElement | null>;
  vsInput: React.RefObject<HTMLInputElement | null>;
  compareButton: React.RefObject<HTMLButtonElement | null>;
}) {
  const custom = !!(query.asOf || query.vs);
  const [lo, hi] = query.vs ? (query.vs <= liveAsOf ? [query.vs, liveAsOf] : [liveAsOf, query.vs]) : [liveAsOf, liveAsOf];
  const field = "inline-flex h-10 items-center rounded-full border border-border px-3 transition-colors duration-150 hover:border-chart-past has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary";
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={query.vs ? `Dates: comparing ${formatDate(lo)} with ${formatDate(hi)}` : `Dates: status as of ${formatDate(liveAsOf)}`}
          className={cn(
            pill,
            "cursor-pointer hover:border-chart-past hover:bg-surface-raised data-[state=open]:border-chart-past data-[state=open]:bg-surface-raised",
            custom ? "border-chart-past bg-surface-raised text-on-surface" : "border-border text-on-surface"
          )}
        >
          <CalendarDays aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
          {query.vs ? (
            <span className="tnum whitespace-nowrap">
              {formatShort(lo)} → {formatDate(hi)}
            </span>
          ) : (
            <span className="whitespace-nowrap">
              <span className={cn("text-muted", WIDE)}>As of </span>
              <span className="tnum">{formatDate(liveAsOf)}</span>
            </span>
          )}
          <ChevronDown aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="Dates"
          className="z-50 flex w-88 flex-col gap-4 rounded-lg border border-border bg-background p-4 text-on-surface duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="rules-as-of" className="t-label-caps text-muted">
              Status as of
            </label>
            <div className="flex items-center gap-2">
              <span className={field}>
                <DateField id="rules-as-of" inputRef={asOfInput} value={liveAsOf} onChange={(d) => setQuery({ asOf: d === today ? null : d })} />
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={!query.asOf}
                aria-label={`Back to today, ${formatDate(today)}`}
                icon={<RotateCcw aria-hidden />}
                onClick={() => {
                  setQuery({ asOf: null });
                  asOfInput.current?.focus();
                }}
              >
                Today
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <label htmlFor="rules-vs" className="t-label-caps text-muted">
              Compare with
            </label>
            {query.vs ? (
              <div className="flex items-center gap-2">
                <span className={field}>
                  <DateField id="rules-vs" inputRef={vsInput} value={query.vs} onChange={(d) => setQuery({ vs: d })} />
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Stop comparing"
                  icon={<X aria-hidden />}
                  onClick={() => {
                    setQuery({ vs: null, changed: false });
                    requestAnimationFrame(() => compareButton.current?.focus());
                  }}
                >
                  Stop
                </Button>
              </div>
            ) : (
              <button
                ref={compareButton}
                type="button"
                onClick={() => {
                  setQuery({ vs: addDays(liveAsOf, -42) });
                  requestAnimationFrame(() => vsInput.current?.focus());
                }}
                className={cn(pill, "w-fit cursor-pointer border-dashed border-border text-body hover:border-chart-past hover:bg-surface-raised")}
              >
                <Plus aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
                Compare dates
              </button>
            )}
            <p className="t-body-sm text-muted">Comparing shows what changed between the two dates: a summary, a change log and a shaded band on the timeline.</p>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/** ⋯ menu: section management, deleted items, discard every local change. */
function ActionsMenu({
  localCount,
  deletedCount,
  onManage,
  onDiscardAll,
}: {
  localCount: number;
  deletedCount: number;
  onManage: (view: SectionsPanelView) => void;
  onDiscardAll: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const item = "flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left t-body-md transition-colors duration-150 hover:bg-surface-raised disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted";
  const go = (v: SectionsPanelView) => {
    setOpen(false);
    onManage(v);
  };
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={`More actions${localCount ? `, ${localCount} local changes` : ""}`}
          title="Sections, deleted items, local changes"
          className={cn(pill, "relative w-10 cursor-pointer justify-center border-border px-0 text-on-surface hover:border-chart-past hover:bg-surface-raised data-[state=open]:border-chart-past data-[state=open]:bg-surface-raised")}
        >
          <Ellipsis aria-hidden className="size-4" strokeWidth={1.5} />
          {localCount > 0 && <span aria-hidden className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-primary" />}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="More actions"
          className="z-50 w-72 rounded-lg border border-border bg-background p-2 text-on-surface duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          <button type="button" className={item} onClick={() => go("add")}>
            <FolderPlus strokeWidth={1.5} />
            Add section
          </button>
          <button type="button" className={item} onClick={() => go("sections")}>
            <ListTree strokeWidth={1.5} />
            Manage sections
          </button>
          <button type="button" className={item} onClick={() => go("deleted")}>
            <RotateCcw strokeWidth={1.5} />
            <span className="flex-1">Deleted here</span>
            <span className="t-mono-sm text-muted tnum">{deletedCount}</span>
          </button>
          <div className="my-1 border-t border-border" />
          <button
            type="button"
            className={item}
            disabled={!localCount}
            onClick={() => {
              setOpen(false);
              if (window.confirm(`Discard all ${localCount} local changes (edits, added and deleted rules and sections)? This cannot be undone.`)) onDiscardAll();
            }}
          >
            <Trash2 strokeWidth={1.5} />
            <span className="flex-1">Discard all local changes</span>
            <span className="t-mono-sm text-muted tnum">{localCount}</span>
          </button>
          <p className="px-2 pt-2 pb-1 t-body-sm text-muted">Changes stay in this browser. Download Excel to share them.</p>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
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
          <span className={cn("text-muted", WIDE)}>Sort</span>
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

function DownloadMenu({ rules, local, query, asOf, list, editCount }: { rules: RuleRecord[]; local: LocalChanges; query: RuleQuery; asOf: string; list: RuleRecord[]; editCount: number }) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const excel = async () => {
    setBusy(true);
    setError(null);
    try {
      const { downloadRulesWorkbook } = await loadExcel();
      saveBlob(await downloadRulesWorkbook({ rules, local, asOf, query, shown: list }), `rossell-business-rules-${asOf}.xlsx`);
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
          title="Download"
          onPointerEnter={() => void loadExcel()}
          onFocus={() => void loadExcel()}
          className={cn(pill, "cursor-pointer border-border text-on-surface hover:border-primary hover:bg-primary hover:text-on-primary data-[state=open]:border-chart-past data-[state=open]:bg-surface-raised data-[state=open]:text-on-surface")}
        >
          <Download aria-hidden className="size-4" strokeWidth={1.5} />
          <span className={WIDE}>Download</span>
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
              <span className="t-body-sm text-muted">
                All {rules.length} rules with state history, sections, open questions and contexts; status as of {formatDate(asOf)}.
                {editCount > 0 && ` Your ${editCount} local ${editCount === 1 ? "change is" : "changes are"} highlighted, with a sheet listing every change.`}
              </span>
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
