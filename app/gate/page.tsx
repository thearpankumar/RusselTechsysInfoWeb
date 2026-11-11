import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui-rt/Eyebrow";
import { Reveal } from "@/components/ui-rt/Reveal";
import { safeNext } from "@/lib/gate";
import { GateForm } from "./GateForm";
import { Globe } from "@/components/chapters/intro/Globe";
import { getLandMask } from "@/components/chapters/intro/landMask";

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
      <header className="relative flex items-center justify-between px-6 pt-8 sm:px-12 lg:px-16">
        <span className="t-mono-sm text-muted">Talencia Global</span>
        <span className="t-mono-sm text-muted">Confidential · Nov 2026</span>
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
