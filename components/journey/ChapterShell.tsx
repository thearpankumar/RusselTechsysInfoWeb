"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { chapters, getAct, getChapter, type ChapterId } from "@/lib/journeyChapters";
import { sectionHref, sectionsOf } from "@/lib/structure";
import { Kbd } from "@/components/ui-rt/Kbd";
import { EASE_OUT, useActiveSection } from "./Section";

export interface ChapterShellProps {
  id: ChapterId;
  /** Chapter statement (headline-lg; may end with a full stop). Shown on the first section. */
  statement: React.ReactNode;
  /** Eyebrow kicker; defaults to the chapter label from lib/chapters.ts. */
  eyebrow?: React.ReactNode;
  /** Lead paragraph under the statement, first section only. */
  lead?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const VISITED_KEY = "rt:visited";

export function markVisited(id: string) {
  try {
    const set = new Set<string>(JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]"));
    set.add(id);
    localStorage.setItem(VISITED_KEY, JSON.stringify([...set]));
  } catch {}
}

export function readVisited(): Set<string> {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(VISITED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

const focusRing = "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Sticky section tabs: "1 Overview · 2 Revenue · …" (always visible on a chapter page). */
function SectionTabs({ chapter, active }: { chapter: ChapterId; active: string }) {
  const secs = sectionsOf(chapter);
  const listRef = React.useRef<HTMLOListElement>(null);
  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);
  if (secs.length < 2) return null;
  return (
    <nav aria-label="Sections" className="sticky top-16 z-30 -mx-6 mt-10 border-b border-border bg-background/80 px-6 py-3 backdrop-blur-md sm:-mx-12 sm:px-12 lg:top-0 lg:-mx-16 lg:px-16 print:hidden">
      <ol ref={listRef} className="flex gap-1 overflow-x-auto rounded-full bg-surface p-1.5 [scrollbar-width:none] sm:w-fit sm:max-w-full">
        {secs.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <Link
                href={sectionHref(chapter, s.id)}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full px-4 t-body-md whitespace-nowrap transition-colors duration-150 ease-out",
                  focusRing,
                  on ? "bg-primary text-on-primary" : "text-body hover:bg-surface-raised hover:text-on-surface"
                )}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function DoorCard({ href, kicker, title, sub, dir }: { href: string; kicker: string; title: string; sub?: string; dir: "prev" | "next" }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-32 flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-6 transition-colors duration-150 ease-out hover:border-chart-past hover:bg-surface-raised sm:p-8",
        focusRing,
        dir === "next" && "sm:items-end sm:text-right"
      )}
    >
      <span className="inline-flex items-center gap-2 t-mono-sm text-muted">
        {dir === "prev" && <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden />}
        {kicker}
        {dir === "next" && <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />}
      </span>
      <span>
        <span className="block t-body-lg text-on-surface">{title}</span>
        {sub && <span className="mt-1 block t-body-sm text-muted">{sub}</span>}
      </span>
    </Link>
  );
}

/** Previous / next section (crossing into neighbouring chapters), the takeaway on the last section, and "Back to the map". */
function SectionFooter({ chapter, active }: { chapter: ChapterId; active: string }) {
  const secs = sectionsOf(chapter);
  const ci = chapters.findIndex((c) => c.id === chapter);
  const si = Math.max(0, secs.findIndex((s) => s.id === active));
  const ch = chapters[ci];
  const isLast = si === secs.length - 1;

  let prev: React.ReactNode = null;
  if (si > 0) {
    const s = secs[si - 1];
    prev = <DoorCard dir="prev" href={sectionHref(chapter, s.id)} kicker="Previous section" title={s.label} />;
  } else if (ci > 0) {
    const pc = chapters[ci - 1];
    const ps = sectionsOf(pc.id);
    const last = ps[ps.length - 1];
    prev = <DoorCard dir="prev" href={sectionHref(pc.id, last.id)} kicker="Previous chapter" title={pc.label} sub={last.label} />;
  }

  let next: React.ReactNode;
  if (!isLast) {
    const s = secs[si + 1];
    next = <DoorCard dir="next" href={sectionHref(chapter, s.id)} kicker="Next section" title={s.label} sub={s.purpose || undefined} />;
  } else if (ci < chapters.length - 1) {
    const nc = chapters[ci + 1];
    next = <DoorCard dir="next" href={sectionHref(nc.id, sectionsOf(nc.id)[0].id)} kicker="Next chapter" title={nc.label} sub={nc.teaser} />;
  } else {
    next = <DoorCard dir="next" href="/" kicker="End of the journey" title="Back to the map" sub="Every chapter, at a glance." />;
  }

  return (
    <footer className="mt-16 border-t border-border pt-12 print:hidden">
      {isLast && (
        <div className="mb-12 max-w-3xl">
          <p className="t-label-caps text-muted">What this means</p>
          <p className="mt-4 t-headline-md text-on-surface">{ch.takeaway}</p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>{prev}</div>
        <div>{next}</div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 t-body-sm text-muted">
        <Link href="/" className={cn("inline-flex items-center gap-2 rounded-full hover:text-on-surface", focusRing)}>
          <LayoutGrid className="size-4" strokeWidth={1.5} aria-hidden />
          Back to the map
          <Kbd>M</Kbd>
        </Link>
        <span className="hidden items-center gap-2 sm:inline-flex">
          <Kbd keys={["←", "→"]} /> previous / next section
        </span>
      </div>
    </footer>
  );
}

/**
 * Chapter page frame. On a section route (/<chapter>/<section>): header ("02.3 · eyebrow · statement"), sticky
 * section tabs, in-section sub-section chips, the active <Section>, then prev/next doors. Header → figure → blocks
 * enter in sequence on every section mount.
 */
export function ChapterShell({ id, statement, eyebrow, lead, className, children }: ChapterShellProps) {
  const chapter = getChapter(id);
  const act = getAct(chapter.act);
  const ctx = useActiveSection();
  const reduce = useReducedMotionSafe();
  const secs = sectionsOf(id);
  const activeId = ctx?.chapter === id ? ctx.section : secs[0].id;
  const si = Math.max(0, secs.findIndex((s) => s.id === activeId));
  const sec = secs[si];
  const first = si === 0;

  React.useEffect(() => markVisited(id), [id]);

  const head = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, ease: EASE_OUT, delay },
  });

  const headline = first || !sec.statement ? statement : sec.statement;
  const sublead = first ? lead : sec.purpose;

  return (
    <section
      id={id}
      data-chapter={id}
      aria-labelledby={`${id}-title`}
      className={cn("px-6 pt-12 pb-16 sm:px-12 lg:px-16 lg:pt-16", className)}
    >
      <header className="max-w-4xl">
        <motion.p {...head(0)} className="flex flex-wrap items-center gap-3 t-label-caps text-muted">
          <span>{eyebrow ?? chapter.label}</span>
          <span aria-hidden>·</span>
          <span>{first ? act.label : sec.label}</span>
        </motion.p>
        <motion.h1 {...head(0.04)} id={`${id}-title`} className="mt-6 t-headline-lg text-on-surface">
          {headline}
        </motion.h1>
        {sublead && (
          <motion.p {...head(0.08)} className="mt-6 max-w-3xl t-body-lg text-body">
            {sublead}
          </motion.p>
        )}
      </header>

      <SectionTabs chapter={id} active={activeId} />

      {sec.subsections.length > 1 && (
        <motion.nav {...head(0.1)} aria-label="On this section" className="mt-8 flex flex-wrap items-center gap-2 print:hidden">
          <span className="mr-2 t-mono-sm text-muted">In this section</span>
          {sec.subsections.map((x) => (
            <a
              key={x.id}
              href={`#${x.id}`}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border border-border px-3 t-body-md text-body transition-colors duration-150 ease-out hover:border-chart-past hover:text-on-surface",
                focusRing
              )}
            >
              {x.label}
            </a>
          ))}
        </motion.nav>
      )}

      {children && <div className="mt-12">{children}</div>}

      {ctx && <SectionFooter chapter={id} active={activeId} />}
    </section>
  );
}
