"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { acts, chapters } from "@/lib/journeyChapters";
import { sectionHref, sectionsOf } from "@/lib/structure";
import { readVisited } from "@/components/journey/ChapterShell";
import { EASE_OUT } from "@/components/journey/Section";
import { Kbd } from "@/components/ui-rt/Kbd";
import { cn } from "@/lib/utils";
import { chapterIcon } from "@/lib/chapterIcons";
import { sources } from "@/content/sources";
import { suppliers } from "@/content/suppliers";
import { materials } from "@/content/materials";
import { files } from "@/content/files";
import { ruleRegister } from "@/content/rules";

/** Hub figures that are counts of content: computed so they never drift from the chapters. */
const LIVE_FIGURE: Record<string, string> = {
  sources: String(sources.length),
  "supply-base": String(suppliers.length),
  anatomy: String(materials.length),
  data: String(files.length),
  rules: String(ruleRegister.length),
};

/** Non-linear journey map: five acts, fifteen chapter doors, each listing its sections. Visited doors are marked. */
export function JourneyMap() {
  const [visited, setVisited] = React.useState<Set<string>>(() => new Set());
  const reduce = useReducedMotionSafe();
  // Read after mount (localStorage): no hydration mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setVisited(readVisited()), []);
  const seen = chapters.filter((c) => visited.has(c.id)).length;

  return (
    <section id="journey-map" aria-labelledby="journey-map-title" className="scroll-mt-16 border-t border-border px-6 py-16 sm:px-12 lg:scroll-mt-0 lg:px-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <p className="t-label-caps text-muted">The journey map</p>
          <h2 id="journey-map-title" className="mt-4 t-headline-lg text-on-surface">
            Five acts, fifteen chapters. Start anywhere.
          </h2>
          <p className="mt-4 t-body-lg text-body">Each door opens a chapter; each chapter is a few short sections. Use the arrow keys to walk through everything in order.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 t-body-sm text-muted">
          <span className="t-mono-sm tnum">
            {seen} of {chapters.length} visited
          </span>
          <span className="inline-flex items-center gap-2">
            <Kbd keys={["←", "→"]} /> step
          </span>
          <span className="inline-flex items-center gap-2">
            <Kbd>/</Kbd> search
          </span>
          <span className="inline-flex items-center gap-2">
            <Kbd>P</Kbd> present
          </span>
          <Link href="/factsheet" className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 t-body-md text-body transition-colors duration-150 hover:border-primary hover:bg-primary hover:text-on-primary">
            One-page fact sheet
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>

      <div className="mt-12 space-y-12">
        {acts.map((act, ai) => {
          const list = chapters.filter((c) => c.act === act.id);
          return (
            <div key={act.id} className="grid grid-cols-1 gap-6 xl:grid-cols-[16rem_1fr]">
              <div>
                
                <h3 className="mt-2 t-headline-md text-on-surface">{act.label}</h3>
                <p className="mt-2 t-body-sm text-muted">{act.blurb}</p>
              </div>
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                {list.map((c, i) => {
                  const secs = sectionsOf(c.id);
                  const isVisited = visited.has(c.id);
                  return (
                    <motion.li
                      key={c.id}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      transition={{ duration: 0.2, ease: EASE_OUT, delay: Math.min(ai * 0.02 + i * 0.05, 0.3) }}
                    >
                      <Link
                        href={sectionHref(c.id, secs[0].id)}
                        className="group relative flex h-full flex-col gap-6 rounded-xl border border-transparent bg-surface p-6 transition-colors duration-150 ease-out outline-none hover:border-chart-past hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-8"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="inline-flex items-center gap-3">
                            {(() => {
                              const Icon = chapterIcon(c.id);
                              return <Icon className="size-6 text-body transition-colors duration-150 group-hover:text-on-surface" strokeWidth={1.5} aria-hidden />;
                            })()}
                          </span>
                          {isVisited && (
                            <span className="inline-flex items-center gap-1 t-mono-sm text-muted">
                              <Check className="size-3.5" strokeWidth={1.5} aria-hidden />
                              Visited
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="t-body-lg text-on-surface">{c.label}</p>
                          <p className="mt-2 t-body-md text-body">{c.teaser}</p>
                        </div>
                        <div>
                          <p className="flex items-baseline gap-2">
                            <span className="t-metric-lg text-on-surface tnum">{LIVE_FIGURE[c.id] ?? c.figure.value}</span>
                            {"unit" in c.figure && <span className="t-body-md text-muted">{c.figure.unit}</span>}
                          </p>
                          <p className="mt-1 t-body-sm text-muted">{c.figure.label}</p>
                        </div>
                        <ol className="mt-auto flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-4 t-body-sm text-muted">
                          {secs.map((s) => (
                            <li key={s.id} className="whitespace-nowrap">
                              {s.label}
                            </li>
                          ))}
                        </ol>
                        <span className={cn("inline-flex items-center gap-2 t-body-md text-body transition-colors duration-150 group-hover:text-on-surface")}>
                          Open
                          <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
