// ⌘K items for chapter "sources". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/sources/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { sourceGroupLabel, sources } from "@/content/sources";
import { contradictions, openQuestions } from "@/content/openQuestions";

const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

export const searchItems: SearchItem[] = [
  ...sources.map((s) => ({
    id: `source:${s.id}`,
    label: s.title,
    group: "Sources",
    hint: s.id,
    keywords: [s.publisher ?? "", sourceGroupLabel[s.group], s.url ? host(s.url) : ""],
    href: `/sources/library#source-${s.id}`,
  })),
  ...openQuestions.map((q) => ({
    id: `question:${q.id}`,
    label: q.question,
    group: "Open questions",
    hint: q.id,
    keywords: q.affects,
    href: "#sources-questions",
  })),
  ...contradictions.map((c) => ({
    id: `contradiction:${c.id}`,
    label: c.topic,
    group: "Where sources disagree",
    hint: c.id,
    keywords: [c.resolution, ...c.versions.map((v) => v.value)],
    href: "#sources-disagree",
  })),
];
