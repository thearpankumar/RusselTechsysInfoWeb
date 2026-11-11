// Chapter 14 — Sources: how sure we are, every source behind the site, where sources disagree and what the record lacks,
// what we are still confirming, and the close.
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { sources, sourceExtraUrls, sourceGroupLabel, sourceGroupOrder, sourceNotes } from "@/content/sources";
import { CONFIDENCE_ORDER, factTally } from "./sources/factCounts";
import { SourcesBody } from "./sources/SourcesBody";
import { SourceLibrary, type LibrarySource } from "./sources/SourceLibrary";
import { Disagreements, OpenQuestions, ResearchGaps } from "./sources/Questions";
import { Closing } from "./sources/Closing";

const library: LibrarySource[] = sources.map((s) => ({
  ...s,
  note: sourceNotes[s.id],
  extraUrls: sourceExtraUrls[s.id],
  cites: factTally.citeCounts[s.id] ?? 0,
}));

export default function Sources() {
  return (
    <ChapterShell
      id="sources"
      statement="Every figure on this site traces back to a source."
      lead={`${sources.length} sources sit behind this journey: Rossell's filings and coverage, market studies, domain literature, and our working sessions with your team. Every fact carries one of six labels, so you can see at a glance how sure we are.`}
    >
      <Section id="overview">
        <SourcesBody
          sources={library}
          groupOrder={sourceGroupOrder}
          groupLabel={sourceGroupLabel}
          facts={{ total: factTally.total, byConfidence: factTally.byConfidence, cited: factTally.cited.length, unresolved: factTally.unresolved.length }}
          confidenceOrder={CONFIDENCE_ORDER}
        />
      </Section>

      <Section id="library">
        <section id="sources-library" aria-label="Source library" className="scroll-mt-24">
          <SourceLibrary sources={library} groupOrder={sourceGroupOrder} groupLabel={sourceGroupLabel} />
        </section>
      </Section>

      <Section id="disagree">
        <Disagreements />
        <ResearchGaps />
      </Section>

      <Section id="questions">
        <OpenQuestions />
        <Closing />
      </Section>
    </ChapterShell>
  );
}
