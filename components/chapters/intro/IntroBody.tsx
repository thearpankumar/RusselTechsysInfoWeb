"use client";

import * as React from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useScroll } from "motion/react";
import { Button, Cite, ConfidenceTag, Marker, Reveal, Stat, StatRow } from "@/components/ui-rt";
import { Globe } from "./Globe";

const lanes = [
  { id: "usa", label: "USA · Tempe, Arizona", share: "~80% of exports", sources: ["S28", "WS"], confidence: "reported" as const },
  { id: "israel", label: "Israel", share: "Share not disclosed", sources: ["WS"], confidence: "session" as const },
  { id: "europe", label: "Europe", share: "Share not disclosed", sources: ["WS", "S76"], confidence: "session" as const },
  { id: "se-asia", label: "SE Asia · Malaysia, Korea, Singapore", share: "Share not disclosed", sources: ["WS"], confidence: "session" as const },
];

/** Hero stats + the scroll-settled globe and the "built here, flown out" beat. */
export function IntroBody({ mask }: { mask: string }) {
  const layer = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: layer, offset: ["start 0.6", "end 0.6"] });

  // Mount exactly one globe (one WebGL context): the pinned background on desktop, the in-flow one on mobile.
  const [desktop, setDesktop] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div ref={layer}>
      {/* Desktop: a large globe pinned behind the right half of the hero (absolute to the hero section),
          bleeding off the right edge of the page. The camera keeps the whole sphere inside its canvas,
          so the only crop is the page edge. Turns to Bengaluru as the hero scrolls. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        <div className="sticky top-0 flex h-dvh items-center justify-end">
          {desktop === true && <Globe mask={mask} settle="scroll" progress={scrollYProgress} className="h-[min(108vh,1100px)] w-auto shrink-0 translate-x-[26%] opacity-80" />}
        </div>
      </div>
      {/* Mobile: the globe sits in the flow, between the headline and the figures. */}
      <div aria-hidden className="pointer-events-none mx-auto mb-12 aspect-square w-full max-w-md lg:hidden">
        {desktop === false && <Globe mask={mask} settle="scroll" progress={scrollYProgress} className="w-full opacity-60" />}
      </div>

      <div className="min-w-0 lg:max-w-[54%]">
      <Reveal delay={0.12}>
        <StatRow className="max-w-3xl md:grid md:gap-y-10 md:[&>*:nth-child(3)]:border-l-0 md:[&>*:nth-child(3)]:pl-0">
          <Stat label="Years" value="15" unit="years" caption="Since early 2011" sub="Anniversary marked 3 Nov 2026" meta={<Cite ids={["S72", "R-scl-24"]} />} />
          <Stat label="FY26 revenue" prefix="₹" value="485" unit="Cr" caption="Up 87% on FY25" sub="Year to 31 Mar 2026" meta={<Cite ids={["S29", "S28"]} />} />
          <Stat label="Exports" value="~98" unit="%" caption="Of revenue exported" sub="One report says ~99%" meta={<Cite ids={["S28"]} />} />
          <Stat
            label="Workforce"
            value="1,281"
            unit="people"
            caption="Total workforce"
            sub="Jun 2026 · includes contract staff and trainees"
            meta={<Cite ids={["R-scl-11"]} />}
          />
        </StatRow>
      </Reveal>

      <Reveal delay={0.18} className="mt-12">
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/portfolio">
            Begin the journey
            <ArrowRight aria-hidden />
          </Button>
          <Button onClick={() => document.getElementById("journey-map")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            See the map
            <ArrowDown aria-hidden />
          </Button>
        </div>
      </Reveal>

      {/* Second beat: the globe has turned to Bengaluru and the export lanes draw out. */}
      <div className="mt-16 border-t border-border pt-12">
        <div className="max-w-xl">
          <Reveal>
            <p className="t-mono-sm text-muted">Devanahalli · Bengaluru · 13.24° N · 77.71° E</p>
            <h3 className="mt-4 t-headline-md text-on-surface">Everything is built here. Almost all of it flies out.</h3>
            <p className="mt-4 t-body-md text-body">
              One campus beside Kempegowda International Airport ships harnesses, panels and assemblies by air to 8 export countries.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {lanes.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center gap-3 py-3">
                  <Marker tone="mid" size={8} />
                  <span className="t-body-md text-on-surface">{l.label}</span>
                  <span className="ml-auto t-body-sm text-muted">{l.share}</span>
                  <Cite ids={l.sources} />
                  <ConfidenceTag confidence={l.confidence} />
                </li>
              ))}
            </ul>
            <p className="mt-4 flex flex-wrap items-center gap-2 t-body-sm text-muted">
              8 export countries <Cite ids={["S28", "S34"]} />
            </p>
          </Reveal>
        </div>
      </div>
      </div>
    </div>
  );
}
