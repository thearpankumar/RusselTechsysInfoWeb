"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import type { DictionaryEntry } from "@/content/types";
import { dataDictionary, dictionaryEntityGroups, dictionaryNote, entityGroupOf, entityMap } from "@/content/dataDictionary";
import { fileColumns, files, getFile } from "@/content/files";
import { Button, Chip, Cite, ConfidenceTag, Kbd, Marker } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import { dataBg } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { entityColor, fieldCountByFile, groupColor, pad2 } from "./shared";

export interface DictFilters {
  q: string;
  group: string | null;
  file: string | null;
  /** Entity-map node id. */
  node: string | null;
  /** Single entity (from a file overlay or the palette). */
  entity: string | null;
  /** Only fields found in Rossell's own column sheets, or only our modelled ones. */
  basis: DictionaryEntry["basis"] | null;
}

export const EMPTY_FILTERS: DictFilters = { q: "", group: null, file: null, node: null, entity: null, basis: null };

/** Rossell's full column names, so "Item Number" also finds the field carried by "Item #". */
const fullName = (fileId: string, column: string) => {
  const f = getFile(fileId);
  return f ? fileColumns(f).find((c) => c.name === column)?.full ?? "" : "";
};

const hay = new Map(
  dataDictionary.map((d) => [
    d,
    `${d.entity} ${d.field} ${d.type} ${d.definition} ${d.example ?? ""} ${d.usedBy.join(" ")} ${d.columns.map((c) => `${c.column} ${fullName(c.file, c.column)}`).join(" ")}`.toLowerCase(),
  ])
);

/** The distinct column names a field goes by across the files. */
export const knownAs = (d: DictionaryEntry) => [...new Set(d.columns.map((c) => c.column))];

export function filterDictionary(f: DictFilters): DictionaryEntry[] {
  const tokens = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const nodeEntities = f.node ? entityMap.find((n) => n.id === f.node)?.entities ?? [] : null;
  return dataDictionary.filter((d) => {
    if (f.group && entityGroupOf(d.entity)?.id !== f.group) return false;
    if (f.file && !d.files.includes(f.file)) return false;
    if (nodeEntities && !nodeEntities.includes(d.entity)) return false;
    if (f.entity && d.entity !== f.entity) return false;
    if (f.basis && d.basis !== f.basis) return false;
    const h = hay.get(d)!;
    return tokens.every((t) => h.includes(t));
  });
}

/** Every one of the sixteen reports is a filter, even one with no mapped field yet. */
const dictFiles = files;
const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
};

/** Searchable data dictionary: search ("f" to focus while in this chapter), group / file chips, dense grouped list. */
export function Dictionary({
  filters,
  setFilters,
  list,
  onOpenField,
}: {
  filters: DictFilters;
  setFilters: React.Dispatch<React.SetStateAction<DictFilters>>;
  /** Already-filtered list (shared with the field overlay for prev/next). */
  list: DictionaryEntry[];
  onOpenField: (i: number) => void;
}) {
  const input = React.useRef<HTMLInputElement>(null);
  const { active } = useJourney();

  // Local shortcut: "f" focuses the dictionary search while this chapter is in view ("/" stays the global palette).
  React.useEffect(() => {
    if (active !== "data") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "f" || e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if (isTyping(e.target) || document.querySelector('[role="dialog"][data-state="open"]')) return;
      e.preventDefault();
      input.current?.focus({ preventScroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const set = (patch: Partial<DictFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const anyFilter = !!(filters.q || filters.group || filters.file || filters.node || filters.entity || filters.basis);

  const grouped = React.useMemo(() => {
    const m = new Map<string, { d: DictionaryEntry; i: number }[]>();
    list.forEach((d, i) => {
      if (!m.has(d.entity)) m.set(d.entity, []);
      m.get(d.entity)!.push({ d, i });
    });
    return [...m.entries()];
  }, [list]);

  const groupCount = (id: string) => dataDictionary.filter((d) => entityGroupOf(d.entity)?.id === id).length;
  const node = filters.node ? entityMap.find((n) => n.id === filters.node) : undefined;
  const file = filters.file ? getFile(filters.file) : undefined;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <label className="flex h-14 items-center gap-3 rounded-lg border border-border px-4 transition-colors duration-150 focus-within:border-chart-past">
          <Search aria-hidden className="size-5 shrink-0 text-muted" strokeWidth={1.5} />
          <input
            ref={input}
            type="search"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Escape") {
                if (filters.q) set({ q: "" });
                else input.current?.blur();
              }
            }}
            placeholder={`Search ${dataDictionary.length} fields and their column names…`}
            aria-label="Search the data dictionary"
            className="h-full min-w-0 flex-1 bg-transparent t-body-lg text-on-surface outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.q ? (
            <button type="button" aria-label="Clear search" onClick={() => set({ q: "" })} className="cursor-pointer text-muted hover:text-on-surface">
              <X className="size-5" strokeWidth={1.5} />
            </button>
          ) : (
            <Kbd className="hidden sm:inline-flex">f</Kbd>
          )}
        </label>

        <div className="flex flex-col gap-3">
          <p className="t-mono-sm text-muted">Entity group</p>
          <div className="flex flex-wrap gap-2">
            <Chip selected={!filters.group} onClick={() => set({ group: null })} count={dataDictionary.length}>
              All
            </Chip>
            {dictionaryEntityGroups.map((g) => (
              <Chip key={g.id} marker={groupColor[g.id]} selected={filters.group === g.id} onClick={() => set({ group: filters.group === g.id ? null : g.id })} count={groupCount(g.id)}>
                {g.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="t-mono-sm text-muted">Source</p>
          <div className="flex flex-wrap gap-2">
            <Chip selected={!filters.basis} onClick={() => set({ basis: null })} count={dataDictionary.length}>
              All
            </Chip>
            <Chip
              marker={<Marker tone="primary" shape="dot" size={8} />}
              selected={filters.basis === "rossell-file"}
              onClick={() => set({ basis: filters.basis === "rossell-file" ? null : "rossell-file" })}
              count={dataDictionary.filter((d) => d.basis === "rossell-file").length}
            >
              In Rossell&apos;s column sheets
            </Chip>
            <Chip
              marker={<Marker tone="past" shape="hollow" size={8} />}
              selected={filters.basis === "modelled"}
              onClick={() => set({ basis: filters.basis === "modelled" ? null : "modelled" })}
              count={dataDictionary.filter((d) => d.basis === "modelled").length}
            >
              Our model only
            </Chip>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="t-mono-sm text-muted">Found in file · all {files.length} reports</p>
          <div className="flex flex-wrap gap-2">
            {dictFiles.map((f) => (
              <Chip
                key={f.id}
                selected={filters.file === f.id}
                onClick={() => set({ file: filters.file === f.id ? null : f.id })}
                icon={<span className="t-mono-sm">{pad2(f.index)}</span>}
                count={fieldCountByFile[f.id] ?? 0}
                title={f.name}
              >
                {f.name}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <p className="t-body-md text-body" aria-live="polite">
            <span className="tnum text-on-surface">{list.length}</span> fields · <span className="tnum text-on-surface">{grouped.length}</span> entities
          </p>
          {node && <ActiveFilter label={`Entity: ${node.label}`} onClear={() => set({ node: null })} />}
          {filters.entity && <ActiveFilter label={`Entity: ${filters.entity}`} onClear={() => set({ entity: null })} />}
          {file && <ActiveFilter label={`File: ${file.name}`} onClear={() => set({ file: null })} />}
          {filters.basis && <ActiveFilter label={filters.basis === "rossell-file" ? "In Rossell's column sheets" : "Our model only"} onClear={() => set({ basis: null })} />}
          {anyFilter && (
            <Button variant="ghost" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear all
            </Button>
          )}
          <span className="inline-flex min-w-0 flex-wrap items-center gap-2 sm:ml-auto">
            <Cite ids={dictionaryNote.sources} />
            <ConfidenceTag confidence={dictionaryNote.confidence} />
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div aria-hidden className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)] gap-4 border-b border-border px-6 py-3 t-mono-sm text-muted md:grid">
            <span>Field · type</span>
            <span>Definition</span>
            <span>Example (sample)</span>
            <span>Known as · files</span>
          </div>
          <div data-lenis-prevent className="max-h-180 overflow-y-auto overscroll-contain">
            {grouped.length === 0 && <p className="px-6 py-12 text-center t-body-md text-muted">No field matches. Try fewer words or clear the filters.</p>}
            {grouped.map(([entity, rows]) => (
              <section key={entity} aria-label={entity}>
                <h4 className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface-raised px-6 py-3">
                  <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dataBg[entityColor(entity)])} />
                  <span className="t-body-md text-on-surface">{entity}</span>
                  <span className="t-mono-sm text-muted">{rows.length}</span>
                  <span className="ml-auto truncate t-body-sm text-muted">{entityGroupOf(entity)?.label}</span>
                </h4>
                <ul>
                  {rows.map(({ d, i }) => (
                    <li key={`${d.entity}-${d.field}`}>
                      <button
                        type="button"
                        onClick={() => onOpenField(i)}
                        className="grid w-full cursor-pointer grid-cols-1 gap-x-4 gap-y-1 border-b border-border px-6 py-3 text-left transition-colors duration-150 ease-out hover:bg-surface-raised md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)]"
                      >
                        <span className="min-w-0">
                          <span className="block t-body-md text-on-surface">{d.field}</span>
                          <span className="block t-mono-sm text-muted">{d.type}</span>
                        </span>
                        <span className="t-body-sm text-body">{d.definition}</span>
                        <span className={cn("min-w-0 truncate t-mono-sm", d.example ? "text-body" : "text-muted")}>
                          <span className="text-muted md:hidden">e.g. </span>
                          {d.example ?? "—"}
                        </span>
                        <span className="min-w-0">
                          <span className="flex min-w-0 items-center gap-2" title={d.basis === "rossell-file" ? "Column names from Rossell's column sheets" : "Our model only"}>
                            <Marker tone={d.basis === "rossell-file" ? "primary" : "past"} shape={d.basis === "rossell-file" ? "dot" : "hollow"} size={8} />
                            <span className={cn("min-w-0 truncate t-mono-sm", d.columns.length ? "text-body" : "text-muted")}>
                              {d.columns.length ? knownAs(d).slice(0, 3).join(" · ") : "Our model"}
                              {knownAs(d).length > 3 && <span className="text-muted"> +{knownAs(d).length - 3}</span>}
                            </span>
                          </span>
                          <span className="block truncate t-mono-sm text-muted" title={d.files.map((id) => getFile(id)?.name ?? id).join(", ")}>
                            {d.files.length ? `${d.files.length === 1 ? "File" : "Files"} ${d.files.map((id) => pad2(getFile(id)?.index ?? 0)).join(" · ")}` : "Not in any report yet"}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActiveFilter({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border border-chart-past bg-surface-raised px-3 t-body-sm text-on-surface transition-colors duration-150 hover:border-primary"
    >
      {label}
      <X aria-label="Clear" className="size-4" strokeWidth={1.5} />
    </button>
  );
}
