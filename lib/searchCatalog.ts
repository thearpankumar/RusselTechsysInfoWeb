// Static ⌘K catalog: every chapter's items with hrefs resolved to section routes. Lazy-loaded by the palette.
import { chapters, type ChapterId } from "@/lib/journeyChapters";
import { resolveAnchor, sectionHref, structure } from "@/lib/structure";
import { searchIndex, type SearchItem } from "@/lib/searchIndex";
import { searchItems as portfolio } from "@/components/chapters/portfolio/search";
import { searchItems as financials } from "@/components/chapters/financials/search";
import { searchItems as growth } from "@/components/chapters/growth/search";
import { searchItems as footprint } from "@/components/chapters/footprint/search";
import { searchItems as people } from "@/components/chapters/people/search";
import { searchItems as whatTheyDo } from "@/components/chapters/whattheydo/search";
import { searchItems as clients } from "@/components/chapters/clients/search";
import { searchItems as competition } from "@/components/chapters/competition/search";
import { searchItems as anatomy } from "@/components/chapters/anatomy/search";
import { searchItems as scale } from "@/components/chapters/scale/search";
import { searchItems as supply } from "@/components/chapters/supply/search";
import { searchItems as operations } from "@/components/chapters/operations/search";
import { searchItems as data } from "@/components/chapters/data/search";
import { searchItems as rules } from "@/components/chapters/rules/search";
import { searchItems as sources } from "@/components/chapters/sources/search";

const byChapter: Record<ChapterId, SearchItem[]> = {
  portfolio,
  financials,
  growth,
  footprint,
  people,
  "what-they-do": whatTheyDo,
  clients,
  competition,
  anatomy,
  scale,
  "supply-base": supply,
  operations,
  data,
  rules,
  sources,
};

function resolve(chapter: ChapterId, href?: string): string {
  if (!href) return resolveAnchor(chapter);
  if (href.startsWith("#")) return resolveAnchor(chapter, href.slice(1));
  return href;
}

/** Sections as their own search group, so "Balance sheet" or "Data dictionary" lands on the right view. */
const sectionItems: SearchItem[] = chapters.flatMap((c) =>
  structure[c.id].map((s, i) => ({
    id: `section:${c.id}/${s.id}`,
    label: `${c.label} · ${s.label}`,
    group: "Sections",
    hint: `${c.index}.${i + 1}`,
    href: sectionHref(c.id, s.id),
    keywords: [s.statement, s.purpose, ...s.subsections.map((x) => x.label)],
  }))
);

export const catalog: SearchItem[] = [
  ...searchIndex.map((it) => ({ ...it, href: resolveAnchor(it.id.slice("chapter:".length) as ChapterId) })),
  { id: "page:map", label: "Journey map", group: "Chapters", hint: "00", href: "/", keywords: ["home", "hub", "overview", "at a glance"] },
  { id: "page:factsheet", label: "Fact sheet (printable, one page)", group: "Chapters", hint: "PDF", href: "/factsheet", keywords: ["print", "pdf", "summary", "key figures", "60 seconds"] },
  ...sectionItems,
  ...chapters.flatMap((c) => byChapter[c.id].map((it) => ({ ...it, href: resolve(c.id, it.href) }))),
];
