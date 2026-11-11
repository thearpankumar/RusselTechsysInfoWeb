import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui-rt/Eyebrow";
import { Reveal } from "@/components/ui-rt/Reveal";
import { safeNext } from "@/lib/gate";
import { GateForm } from "./GateForm";
import { Globe } from "@/components/chapters/intro/Globe";
import { getLandMask } from "@/components/chapters/intro/landMask";
import { TalenciaMark } from "@/components/journey/TalenciaMark";

export const metadata: Metadata = { title: "Welcome" };

// Cinematic title card + passcode entry.
export default async function GatePage({ searchParams }: { searchParams: Promise<{ next?: string | string[]; error?: string | string[] }> }) {
  const sp = await searchParams;
  const next = safeNext(Array.isArray(sp.next) ? sp.next[0] : sp.next);
  const mask = getLandMask();
  return (
    <main className="relative flex min-h-dvh flex-col bg-canvas">
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-20" />
      {/* The same dot-matrix globe as the journey intro, dimmed; it turns to Bengaluru on its own. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden lg:justify-end">
        <Globe mask={mask} settle="auto" dim surface="canvas" className="w-full max-w-2xl opacity-25 sm:opacity-40 lg:w-3/5 lg:max-w-none lg:translate-x-1/4 lg:opacity-70" />
      </div>
      <header className="relative isolate flex items-start justify-between px-6 pt-8 sm:px-12 lg:px-16">
        {/* Talencia Global mark as a hairline watermark, cropped by the page's top-left corner (same treatment as the rail). */}
        <TalenciaMark variant="outline" className="pointer-events-none absolute -top-10 -left-8 -z-10 h-48 text-chart-mid opacity-25 sm:h-56" />
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-3">
            <TalenciaMark variant="brand" title="Talencia Global" className="h-9 w-auto shrink-0" />
            <span className="t-label-md whitespace-nowrap text-on-surface">Talencia Global</span>
          </span>
          <span className="t-mono-sm whitespace-nowrap text-muted">for Rossell Techsys</span>
        </div>
        <span className="hidden pt-2 t-mono-sm text-muted sm:inline">Confidential · Nov 2026</span>
      </header>
      <section className="relative flex flex-1 flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
        <div className="max-w-5xl">
          <Reveal>
            <Eyebrow>Prepared by Talencia Global for Rossell Techsys</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-8 t-headline-display text-on-surface">Rossell Techsys, as we understand it.</h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-2xl t-body-lg text-body">
              Fifteen years of aerospace, defence and semiconductor interconnects, seen from the outside in. Enter the passcode to begin.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <GateForm next={next} initialError={sp.error === "1"} />
          </Reveal>
        </div>
      </section>
      <footer className="relative flex flex-col items-start gap-2 px-6 pb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-12 lg:px-16">
        <span className="t-mono-sm text-muted">Devanahalli · Bengaluru</span>
        <span className="t-mono-sm text-muted">13.2° N · 77.7° E</span>
      </footer>
    </main>
  );
}
