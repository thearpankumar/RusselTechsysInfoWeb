"use client";

import * as React from "react";
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react";
import type { Source, SourceGroup } from "@/content/types";
import { Button, Chip } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import { useSearchOpen } from "@/lib/searchIndex";
import { cn } from "@/lib/utils";

export interface LibrarySource extends Source {
  note?: string;
  extraUrls?: string[];
  cites: number;
}

const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

/** Fire Escape so an open Cite popover (and a detail overlay under it) closes before we scroll. */
function dismissLayers() {
  const esc = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  esc();
  setTimeout(() => {
    if (document.querySelector('[role="dialog"][data-state="open"]')) esc();
  }, 40);
}

/** Source ids named in a hash ("#source-S12"), or null. */
const hashSourceId = (hash: string) => (hash.startsWith("#source-") ? decodeURIComponent(hash.slice("#source-".length)) : null);

/** Hrefs that point at a library entry: "#source-<id>" on this page, or "/sources/library#source-<id>" from a Cite popover. */
const SOURCE_LINK = 'a[href^="#source-"], a[href^="/sources/library#source-"]';

/**
 * All sources grouped, searchable, with collapsible groups; every entry is a `#source-<id>` anchor that Cite links land on.
 * On mount and on every hash change, a `#source-<id>` hash clears the filters, expands the group, scrolls to the entry and highlights it.
 */
export function SourceLibrary({
  sources,
  groupOrder,
  groupLabel,
}: {
  sources: LibrarySource[];
  groupOrder: SourceGroup[];
  groupLabel: Record<SourceGroup, string>;
}) {
  const { goTo } = useJourney();
  const [filterGroup, onFilterGroup] = React.useState<SourceGroup | null>(null);
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState<Set<SourceGroup>>(() => new Set());
  const [flash, setFlash] = React.useState<string | null>(null);

  const byId = React.useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  const searching = tokens.length > 0;

  const groups = React.useMemo(() => {
    const t = q.toLowerCase().split(/\s+/).filter(Boolean);
    return groupOrder
      .filter((g) => !filterGroup || g === filterGroup)
      .map((g) => {
        const all = sources.filter((s) => s.group === g);
        const hits = t.length ? all.filter((s) => t.every((x) => `${s.id} ${s.title} ${s.publisher ?? ""} ${s.url ?? ""} ${s.date ?? ""}`.toLowerCase().includes(x))) : all;
        return { g, all, hits };
      })
      .filter(({ all, hits }) => all.length && (!t.length || hits.length));
  }, [sources, groupOrder, filterGroup, q]);

  const total = groups.reduce((n, x) => n + x.hits.length, 0);

  /** Make a source visible (clear filters, expand its group), scroll to it and flash it. */
  const reveal = React.useCallback(
    (id: string) => {
      const s = byId.get(id);
      if (!s) {
        goTo("sources-library");
        return;
      }
      setQ("");
      onFilterGroup(null);
      setOpen((o) => new Set(o).add(s.group));
      setTimeout(() => {
        goTo(`source-${id}`);
        setFlash(id);
        setTimeout(() => setFlash((f) => (f === id ? null : f)), 2400);
      }, 320);
    },
    [byId, goTo, onFilterGroup]
  );

  // Cite popovers on this page link to the library: intercept so collapsed groups open first, without a navigation.
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.(SOURCE_LINK) as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href")!;
      const id = hashSourceId(href.slice(href.indexOf("#")));
      if (!id) return;
      e.preventDefault();
      e.stopPropagation();
      dismissLayers();
      if (window.location.hash !== `#source-${encodeURIComponent(id)}`) window.history.pushState(window.history.state, "", `#source-${encodeURIComponent(id)}`);
      reveal(id);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reveal]);

  // Deep link (/sources/library#source-S12): on mount (after the section entrance has settled) and on every hash change.
  const revealRef = React.useRef(reveal);
  React.useEffect(() => {
    revealRef.current = reveal;
  }, [reveal]);
  React.useEffect(() => {
    const fromHash = () => {
      const id = hashSourceId(window.location.hash);
      if (id) revealRef.current(id);
    };
    const t = window.setTimeout(fromHash, 450);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  useSearchOpen("source", reveal);
  useSearchOpen(
    "source-group",
    React.useCallback((g: string) => {
      if (groupOrder.includes(g as SourceGroup)) onFilterGroup(g as SourceGroup);
    }, [groupOrder])
  );

  const toggle = (g: SourceGroup) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(g)) n.delete(g);
      else n.add(g);
      return n;
    });

  const allOpen = groups.every(({ g }) => open.has(g));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="flex h-14 flex-1 items-center gap-3 rounded-lg border border-border px-4 transition-colors duration-150 focus-within:border-chart-past">
          <Search aria-hidden className="size-5 shrink-0 text-muted" strokeWidth={1.5} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Escape") setQ("");
            }}
            placeholder={`Search ${sources.length} sources: title, publisher, id…`}
            aria-label="Search sources"
            className="h-full min-w-0 flex-1 bg-transparent t-body-lg text-on-surface outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button type="button" aria-label="Clear search" onClick={() => setQ("")} className="cursor-pointer text-muted hover:text-on-surface">
              <X className="size-5" strokeWidth={1.5} />
            </button>
          )}
        </label>
        {!searching && (
          <Button variant="secondary" onClick={() => setOpen(allOpen ? new Set() : new Set(groups.map((x) => x.g)))}>
            {allOpen ? "Collapse all" : "Expand all"}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip selected={!filterGroup} onClick={() => onFilterGroup(null)} count={sources.length}>
          All
        </Chip>
        {groupOrder.map((g) => {
          const n = sources.filter((s) => s.group === g).length;
          if (!n) return null;
          return (
            <Chip key={g} selected={filterGroup === g} onClick={() => onFilterGroup(filterGroup === g ? null : g)} count={n}>
              {groupLabel[g]}
            </Chip>
          );
        })}
      </div>

      {searching && (
        <p className="t-body-md text-body" aria-live="polite">
          <span className="tnum text-on-surface">{total}</span> {total === 1 ? "source matches" : "sources match"}
        </p>
      )}

      <div className="border-t border-border">
        {groups.length === 0 && <p className="py-12 text-center t-body-md text-muted">No source matches. Try fewer words.</p>}
        {groups.map(({ g, all, hits }) => {
          const expanded = searching || open.has(g) || !!filterGroup;
          const publishers = new Set(all.map((s) => s.publisher).filter(Boolean)).size;
          return (
            <section key={g} aria-label={groupLabel[g]} className="border-b border-border">
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => (searching || filterGroup ? undefined : toggle(g))}
                  className="group flex w-full cursor-pointer items-center gap-4 py-6 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block t-body-lg text-on-surface">{groupLabel[g]}</span>
                    <span className="mt-1 block t-body-sm text-muted">
                      {all.length} sources · {publishers} publishers
                    </span>
                  </span>
                  <span className="t-metric-lg text-on-surface tnum">{searching ? hits.length : all.length}</span>
                  <ChevronDown
                    aria-hidden
                    className={cn("size-5 text-muted transition-transform duration-200 group-hover:text-on-surface", expanded && "rotate-180", (searching || filterGroup) && "invisible")}
                    strokeWidth={1.5}
                  />
                </button>
              </h3>
              {expanded && (
                <ul className="pb-6">
                  {hits.map((s) => (
                    <SourceRow key={s.id} s={s} flash={flash === s.id} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SourceRow({ s, flash }: { s: LibrarySource; flash: boolean }) {
  const meta = [s.publisher, s.date, s.accessed && `accessed ${s.accessed}`].filter(Boolean).join(" · ");
  return (
    <li
      id={`source-${s.id}`}
      className={cn(
        "grid scroll-mt-24 grid-cols-[88px_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-lg border-t border-border px-3 py-4 transition-colors duration-200 first:border-t-0 md:grid-cols-[104px_minmax(0,1fr)_minmax(0,240px)]",
        flash ? "bg-surface-raised" : "bg-transparent"
      )}
    >
      <span className="pt-0.5 t-mono-sm break-all text-muted">{s.id}</span>
      <div className="min-w-0">
        <p className="t-body-md text-on-surface">{s.title}</p>
        {meta && <p className="mt-1 t-body-sm text-muted">{meta}</p>}
        {s.note && <p className="mt-1 t-body-sm text-body">{s.note}</p>}
        <p className="mt-1 t-body-sm text-muted">{s.cites ? `Cited by ${s.cites} ${s.cites === 1 ? "fact" : "facts"} on this site` : "Background reading"}</p>
      </div>
      <div className="col-start-2 flex min-w-0 flex-col gap-1 md:col-start-auto md:items-end">
        {s.url ? (
          [s.url, ...(s.extraUrls ?? [])].map((u) => (
            <a
              key={u}
              href={u}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1 t-body-sm text-body underline-offset-4 transition-colors duration-150 hover:text-on-surface hover:underline"
            >
              <span className="truncate">{host(u)}</span>
              <ArrowUpRight aria-hidden className="size-4 shrink-0" strokeWidth={1.5} />
            </a>
          ))
        ) : (
          <span className="t-body-sm text-muted">{s.group === "internal" ? "Internal document" : "No public link"}</span>
        )}
      </div>
    </li>
  );
}
