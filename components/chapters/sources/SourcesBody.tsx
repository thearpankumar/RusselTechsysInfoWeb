"use client";

import * as React from "react";
import type { Confidence, SourceGroup } from "@/content/types";
import { ChartFrame, ConfidenceTag, HBar, Stat, StatRow } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import type { LibrarySource } from "./SourceLibrary";

export const CONFIDENCE_PLAIN: Record<Confidence, string> = {
  reported: "Published by Rossell or a third party: stock-exchange filings, investor decks, press coverage, market studies.",
  session: "Heard in our working sessions with Rossell's SCM, planning and IT teams. To be confirmed in writing.",
  rules: "From the internal Engineering and BOM business-rules draft: agreed so far, still being formalised.",
  calc: "Our own arithmetic on sourced figures. The inputs are cited, so the sum can be checked.",
  estimate: "Our estimate where nothing is disclosed, always labelled as such.",
  "industry-example": "Typical of aerospace harness work, such as supplier part numbers. Not confirmed as Rossell's.",
};

export interface SourcesBodyProps {
  sources: LibrarySource[];
  groupOrder: SourceGroup[];
  groupLabel: Record<SourceGroup, string>;
  facts: { total: number; byConfidence: Record<Confidence, number>; cited: number; unresolved: number };
  confidenceOrder: Confidence[];
}

/** Library route with a group filter pending (consumed by useSearchOpen("source-group") in the library). */
export const libraryGroupHref = (g: SourceGroup) => `/sources/library?open=source-group:${g}#sources-library`;

/** Sources overview: headline counts, sources by group (each bar opens the library filtered) and the six confidence labels. */
export function SourcesBody({ sources, groupOrder, groupLabel, facts, confidenceOrder }: SourcesBodyProps) {
  const { goTo } = useJourney();

  const groupCounts = groupOrder.map((g) => ({ g, n: sources.filter((s) => s.group === g).length })).filter((x) => x.n);
  const maxGroup = Math.max(...groupCounts.map((x) => x.n));
  const withLink = sources.filter((s) => s.url).length;
  const pct = (n: number) => Math.round((n / (facts.total || 1)) * 100);
  const maxConf = Math.max(...confidenceOrder.map((c) => facts.byConfidence[c]));

  return (
    <div className="flex flex-col gap-16">
      <div id="sources-counts" className="scroll-mt-24">
        <StatRow>
          <Stat label="Sources" value={sources.length} sub={`${withLink} with a public link`} />
          <Stat label="Sourced facts" value={facts.total.toLocaleString("en-IN")} sub="each with a source and a confidence label" />
          <Stat label="Public record" value={pct(facts.byConfidence.reported)} unit="%" sub="of facts come from filings, press or market studies" />
          <Stat
            label="Sources cited"
            value={facts.cited}
            sub={facts.unresolved ? `${facts.unresolved} not yet listed below` : "every citation resolves to an entry below"}
          />
        </StatRow>
      </div>

      <div id="sources-confidence" className="grid scroll-mt-24 grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <ChartFrame title="Where the sources come from" subtitle="Each bar counts the sources in one group. Select a bar to open that group in the library." className="h-full">
            <ul className="flex flex-col gap-1">
              {groupCounts.map(({ g, n }) => (
                <li key={g}>
                  <button
                    type="button"
                    onClick={() => goTo(libraryGroupHref(g))}
                    className="-mx-3 w-[calc(100%+1.5rem)] cursor-pointer rounded-md px-3 py-2 text-left transition-colors duration-150 hover:bg-surface-raised"
                  >
                    <HBar value={n} max={maxGroup} label={groupLabel[g]} display={n} muted={n !== maxGroup} />
                  </button>
                </li>
              ))}
            </ul>
          </ChartFrame>
        </div>

        <div>
          <ChartFrame
            title="How sure we are"
            subtitle={`Every fact carries one of six labels. Bars count the ${facts.total.toLocaleString("en-IN")} labelled facts across the site.`}
            className="h-full"
          >
            <ul className="divide-y divide-border">
              {confidenceOrder.map((c) => (
                <li key={c} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 py-4 first:pt-0">
                  <ConfidenceTag confidence={c} showReported className={c === "reported" ? "border-solid text-on-surface" : undefined} />
                  <span className="t-body-md tnum text-on-surface">
                    {facts.byConfidence[c].toLocaleString("en-IN")}
                    <span className="ml-2 text-muted">{pct(facts.byConfidence[c])}%</span>
                  </span>
                  <p className="col-span-2 t-body-sm text-body">{CONFIDENCE_PLAIN[c]}</p>
                  <HBar className="col-span-2" value={facts.byConfidence[c]} max={maxConf} display={null} muted={c !== "reported"} />
                </li>
              ))}
            </ul>
          </ChartFrame>
        </div>
      </div>
    </div>
  );
}
