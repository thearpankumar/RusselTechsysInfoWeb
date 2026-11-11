"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { dailyTerms, glossary } from "@/content/glossary";
import type { GlossaryTerm } from "@/content/types-extra";
import { Chip, Cite, ConfidenceTag, DetailOverlay, Kbd } from "@/components/ui-rt";
import { useSearchOpen } from "@/lib/searchIndex";
import { useIndexOverlay } from "../anatomy/shared";

const CATEGORY_LABEL: Record<GlossaryTerm["category"], string> = {
  commercial: "Commercial",
  "material-engineering": "Materials & engineering",
  planning: "Planning",
  "quality-compliance": "Quality & compliance",
  systems: "Systems",
  trade: "Trade",
  general: "General",
};

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const items = glossary.map((g) => ({ ...g, id: slug(g.term) }));
const dailyIds = new Set(dailyTerms.map((t) => slug(t.term)));

/** Searchable glossary: the deck's twelve everyday terms + appendix vocabulary; every term is in ⌘K. */
export function Glossary() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<GlossaryTerm["category"] | "all">("all");
  const query = q.trim().toLowerCase();
  const shown = items.filter((t) => (cat === "all" || t.category === cat) && (!query || `${t.term} ${t.definition}`.toLowerCase().includes(query)));
  const ov = useIndexOverlay(items);
  const t = ov.current;

  const open = ov.open;
  useSearchOpen("glossary", React.useCallback((id: string) => open(id), [open]));

  const cats = (Object.keys(CATEGORY_LABEL) as GlossaryTerm["category"][]).filter((c) => items.some((x) => x.category === c));

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="flex h-14 w-full items-center gap-3 rounded-lg border border-border bg-background px-4 focus-within:border-chart-past lg:max-w-md">
          <Search className="size-5 shrink-0 text-muted" strokeWidth={1.5} aria-hidden />
          <span className="sr-only">Search the glossary</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms"
            className="h-full min-w-0 flex-1 bg-transparent t-body-lg text-on-surface outline-none"
          />
          <span className="hidden items-center gap-2 t-body-sm text-muted sm:inline-flex">
            all pages <Kbd>/</Kbd>
          </span>
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <Chip selected={cat === "all"} onClick={() => setCat("all")} count={items.length}>
            All
          </Chip>
          {cats.map((c) => (
            <Chip key={c} selected={cat === c} onClick={() => setCat(c)} count={items.filter((x) => x.category === c).length}>
              {CATEGORY_LABEL[c]}
            </Chip>
          ))}
        </div>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-x-12 border-t border-border md:grid-cols-2">
        {shown.map((term) => {
          const daily = dailyIds.has(term.id);
          return (
            <li key={term.id} className="border-b border-border">
              <button type="button" onClick={() => ov.open(term.id)} className="group flex w-full cursor-pointer items-baseline gap-4 py-4 text-left">
                <span className="w-40 shrink-0 t-body-md text-on-surface underline-offset-4 group-hover:underline">{term.term}</span>
                <span className="min-w-0 flex-1 t-body-sm text-body">{term.definition}</span>
                {daily && <span className="t-mono-sm text-muted">deck</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {!shown.length && <p className="mt-6 t-body-md text-muted">No term matches “{q}”.</p>}
      <p className="mt-4 t-body-sm text-muted">deck = one of the twelve terms used every day in the flow (supply-chain deck p.4).</p>

      <DetailOverlay
        open={!!t}
        onOpenChange={ov.onOpenChange}
        eyebrow={t ? `Glossary · ${CATEGORY_LABEL[t.category]}${dailyIds.has(t.id) ? " · everyday term" : ""}` : undefined}
        title={t?.term ?? ""}
        description={t?.definition}
        index={ov.index}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      >
        {t && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <ConfidenceTag confidence={t.confidence} showReported />
            <Cite ids={t.sources} />
          </div>
        )}
      </DetailOverlay>
    </div>
  );
}
