// Single source of the site's information architecture: Act → Chapter → Section → Sub-section.
// Drives the routes (/<chapter>/<section>), the rail, in-page navigation, ←/→ stepping and ⌘K.
import { chapters, type ChapterId } from "@/lib/journeyChapters";
import type { SectionDef } from "./types";
import { portfolioSections } from "./portfolio";
import { financialsSections } from "./financials";
import { growthSections } from "./growth";
import { footprintSections } from "./footprint";
import { peopleSections } from "./people";
import { whatTheyDoSections } from "./what-they-do";
import { clientsSections } from "./clients";
import { competitionSections } from "./competition";
import { anatomySections } from "./anatomy";
import { scaleSections } from "./scale";
import { supplyBaseSections } from "./supply-base";
import { operationsSections } from "./operations";
import { dataSections } from "./data";
import { rulesSections } from "./rules";
import { sourcesSections } from "./sources";

export type { SectionDef, SubsectionDef } from "./types";

export const structure: Record<ChapterId, SectionDef[]> = {
  "portfolio": portfolioSections,
  "financials": financialsSections,
  "growth": growthSections,
  "footprint": footprintSections,
  "people": peopleSections,
  "what-they-do": whatTheyDoSections,
  "clients": clientsSections,
  "competition": competitionSections,
  "anatomy": anatomySections,
  "scale": scaleSections,
  "supply-base": supplyBaseSections,
  "operations": operationsSections,
  "data": dataSections,
  "rules": rulesSections,
  "sources": sourcesSections,
};

export const sectionsOf = (chapter: ChapterId): SectionDef[] => structure[chapter];

export const sectionHref = (chapter: string, section?: string, hash?: string) =>
  `/${chapter}${section ? `/${section}` : ""}${hash ? `#${hash}` : ""}`;

/** Every (chapter, section) in reading order: what ←/→ walk through. */
export const sequence: { chapter: ChapterId; section: string; href: string }[] = chapters.flatMap((c) =>
  structure[c.id].map((s) => ({ chapter: c.id, section: s.id, href: sectionHref(c.id, s.id) }))
);

export function sequenceIndex(chapter: string | null, section: string | null): number {
  if (!chapter) return -1;
  const i = sequence.findIndex((x) => x.chapter === chapter && x.section === section);
  return i >= 0 ? i : sequence.findIndex((x) => x.chapter === chapter);
}

/** Resolve an in-chapter anchor ("fin-cost") to its section route; falls back to the first section. */
export function resolveAnchor(chapter: ChapterId, anchor?: string): string {
  const secs = structure[chapter];
  if (!anchor || anchor === chapter) return sectionHref(chapter, secs[0].id);
  const bySection = secs.find((s) => s.id === anchor);
  if (bySection) return sectionHref(chapter, bySection.id);
  const owner = secs.find((s) => s.subsections.some((x) => x.id === anchor) || s.anchors?.includes(anchor));
  return sectionHref(chapter, (owner ?? secs[0]).id, anchor);
}

/** "/financials/revenue" → { chapter, section }. */
export function parsePath(pathname: string | null): { chapter: ChapterId | null; section: string | null } {
  const [, a, b] = (pathname ?? "/").split("/");
  const ch = chapters.find((c) => c.id === a);
  if (!ch) return { chapter: null, section: null };
  const secs = structure[ch.id];
  return { chapter: ch.id, section: secs.find((s) => s.id === b)?.id ?? secs[0].id };
}
