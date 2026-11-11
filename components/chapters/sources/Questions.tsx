"use client";

import * as React from "react";
import { contradictions, howToClose, openQuestions, researchGaps } from "@/content/openQuestions";
import type { OpenQuestion } from "@/content/types-extra";
import { Button, Cite, ConfidenceTag, Eyebrow, Marker } from "@/components/ui-rt";

const STATUS: Record<OpenQuestion["status"], { label: string; tone: "primary" | "past"; shape: "dot" | "hollow" }> = {
  open: { label: "Open", tone: "past", shape: "hollow" },
  "partly-answered": { label: "Partly answered", tone: "past", shape: "dot" },
  answered: { label: "Answered", tone: "primary", shape: "dot" },
};

const SHOWN = 6;

/** Open questions: what we are still confirming with Rossell, and how they get closed. */
export function OpenQuestions() {
  return (
    <section id="sources-questions" aria-label="Open questions" className="scroll-mt-24">
      <p className="mb-8 max-w-3xl t-body-lg text-body">
        {howToClose.text} <Cite ids={howToClose.sources} />
      </p>
      <ol className="border-t border-border">
        {openQuestions.map((q, i) => {
          const st = STATUS[q.status];
          return (
            <li key={q.id}>
              <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-border py-6 md:grid-cols-[48px_minmax(0,1fr)_minmax(0,280px)]">
                <span className="pt-1 t-mono-sm text-muted tnum">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="t-body-lg text-on-surface">{q.question}</p>
                  {q.note && <p className="mt-2 t-body-sm text-muted">{q.note}</p>}
                </div>
                <div className="col-start-2 flex flex-wrap items-start gap-2 md:col-start-auto md:justify-end">
                  <span className="inline-flex h-6 items-center gap-2 rounded-full border border-border px-2 t-mono-sm text-on-surface">
                    <Marker tone={st.tone} shape={st.shape} size={8} />
                    {st.label}
                  </span>
                  <Cite ids={q.sources} />
                  <span className="w-full t-body-sm text-muted md:text-right">Affects {q.affects.join(" · ")}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** What the public record could not tell us, and why it matters. */
export function ResearchGaps() {
  return (
    <section id="sources-gaps" aria-labelledby="sources-gaps-title" className="scroll-mt-24">
      <Eyebrow>Research gaps</Eyebrow>
      <h2 id="sources-gaps-title" className="mt-3 mb-2 t-headline-md text-on-surface">
        Gaps in the public record
      </h2>
      <p className="mb-8 max-w-3xl t-body-md text-muted">What our research could not find, and why it matters.</p>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {researchGaps.map((g) => (
          <li key={g.id} className="flex flex-col gap-3 rounded-xl bg-surface p-6">
            <span className="t-mono-sm text-muted">{g.id}</span>
            <p className="t-body-lg text-on-surface">{g.gap}</p>
            <p className="t-body-md text-body">{g.why}</p>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
              <Cite ids={g.sources} />
              <ConfidenceTag confidence={g.confidence} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Where our documents disagree, every version kept, and the one we show. */
export function Disagreements() {
  const [allC, setAllC] = React.useState(false);
  const shownC = allC ? contradictions : contradictions.slice(0, SHOWN);
  return (
    <section id="sources-disagree" aria-label="Where sources disagree" className="scroll-mt-24">
      <ul className="border-t border-border">
        {shownC.map((c) => (
          <li key={c.id} className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-border py-6 lg:grid-cols-[48px_minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
            <span className="pt-1 t-mono-sm text-muted">{c.id}</span>
            <p className="t-body-lg text-on-surface">{c.topic}</p>
            <ul className="col-start-2 flex flex-col gap-2 lg:col-start-auto">
              {c.versions.map((v) => (
                <li key={v.value} className="flex flex-wrap items-center gap-2 t-body-md text-body">
                  <span>{v.value}</span>
                  <Cite ids={v.sources} />
                </li>
              ))}
            </ul>
            <p className="col-start-2 t-body-md text-body lg:col-start-auto">
              <span className="mb-1 block t-mono-sm text-muted">We show</span>
              {c.resolution}
            </p>
          </li>
        ))}
      </ul>
      {contradictions.length > SHOWN && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={() => setAllC((v) => !v)}>
            {allC ? "Show fewer" : `Show all ${contradictions.length}`}
          </Button>
        </div>
      )}
    </section>
  );
}
