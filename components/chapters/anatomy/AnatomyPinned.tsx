"use client";

// Chapter 09 signature moment: a pinned (sticky, ~320vh) track where the exploded harness assembles
// part by part as you scroll, with a side panel stepping through the twelve parts.
// Scroll progress is bound to the track itself (0 until the track reaches the tabs, 1 at its end), never to the page.
// The 3D scene mounts only while this section is routed and disposes on unmount; reduced motion / no WebGL use the static view.
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { harnessParts, type HarnessPartId } from "@/content/materials";
import { Button, Card, CardNested, Cite, ConfidenceTag, Kbd } from "@/components/ui-rt";
import { cn } from "@/lib/utils";
import { HarnessFallback } from "./HarnessFallback";
import { useIndexOverlay, useMounted, useWebGL } from "./shared";

const HarnessScene = dynamic(() => import("./HarnessScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center p-8 opacity-60">
      <HarnessFallback onSelect={() => {}} />
    </div>
  ),
});

const N = harnessParts.length;
/** Scroll progress → step index (matches partAssembly in HarnessScene). */
const stepOf = (p: number) => Math.min(N - 1, Math.max(0, Math.floor(Math.min(1, Math.max(0, (p - 0.05) / 0.85)) * N)));
/** Middle of a step's scroll window, as progress 0..1. */
const progressOfStep = (i: number) => 0.05 + ((i + 0.6) / N) * 0.85;

/** Height of the sticky section tabs (ChapterShell): the pinned stage sits just under them. */
const TABS_PX = 78;

const coarseQuery = "(pointer: coarse)";
function useCoarsePointer() {
  return React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(coarseQuery);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(coarseQuery).matches,
    () => false
  );
}

function PartPanel({ id, onOpen }: { id: HarnessPartId; onOpen: () => void }) {
  const p = harnessParts.find((x) => x.id === id)!;
  return (
    <div>
      <h3 className="t-headline-md text-on-surface">{p.name}</h3>
      <div className="mt-6 flex flex-col gap-6">
        <div>
          <p className="t-label-caps text-muted">What it is</p>
          <p className="mt-2 t-body-md text-body">{p.whatItIs}</p>
        </div>
        <div className="hidden sm:block">
          <p className="t-label-caps text-muted">What it does</p>
          <p className="mt-2 t-body-md text-body">{p.whatItDoes}</p>
        </div>
        <div>
          <p className="t-label-caps text-muted">Typical spec</p>
          <p className="mt-2 t-mono-sm text-on-surface">{p.spec}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <ConfidenceTag confidence={p.confidence} />
        <Cite ids={p.sources} />
        <Button size="sm" arrow onClick={onOpen} className="ml-auto">
          Open
        </Button>
      </div>
    </div>
  );
}

function StaticAnatomy({ onSelect }: { onSelect: (id: HarnessPartId) => void }) {
  const [hover, setHover] = React.useState<HarnessPartId | null>(null);
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <HarnessFallback onSelect={onSelect} activeId={hover} onHover={setHover} />
        <p className="mt-6 t-body-sm text-muted">Exploded view. Select a numbered part to see what it is and what it does.</p>
      </Card>
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {harnessParts.map((p) => (
          <li key={p.id}>
            <CardNested onClick={() => onSelect(p.id)} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.id)} onBlur={() => setHover(null)} className="h-full">
              <span className="block t-body-lg text-on-surface">{p.name}</span>
              <span className="mt-1 block t-mono-sm text-muted">{p.spec}</span>
            </CardNested>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AnatomyPinned({ overlay }: { overlay: ReturnType<typeof useIndexOverlay<(typeof harnessParts)[number]>> }) {
  const reduce = useReducedMotionSafe();
  const webgl = useWebGL();
  const mounted = useMounted();
  const coarse = useCoarsePointer();

  const trackRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef(0);
  const [step, setStep] = React.useState(0);
  const [hovered, setHovered] = React.useState<HarnessPartId | null>(null);
  const [inView, setInView] = React.useState(false);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: [`start ${TABS_PX}px`, "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const s = stepOf(v);
    setStep((cur) => (cur === s ? cur : s));
  });

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const jumpTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top - TABS_PX + progressOfStep(i) * (el.offsetHeight - window.innerHeight + TABS_PX);
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  const show3D = mounted && webgl && !reduce;
  const activeId = harnessParts[step].id;
  const panelId = hovered ?? activeId;

  if (mounted && !show3D) return <StaticAnatomy onSelect={overlay.open} />;

  return (
    <div ref={trackRef} className="relative h-[320vh]">
      <div className="sticky top-[141px] flex h-[calc(100dvh-141px)] flex-col gap-4 py-4 lg:top-[78px] lg:grid lg:h-[calc(100dvh-78px)] lg:grid-cols-12 lg:gap-6 lg:py-6">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-canvas lg:col-span-8">
          {show3D && (
            <HarnessScene
              progressRef={progressRef}
              activeId={activeId}
              step={step}
              hoveredId={hovered}
              onHover={setHovered}
              onSelect={overlay.open}
              paused={!inView || !!overlay.current}
              orbit={!coarse}
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4 sm:p-6">
            <span className="t-label-caps text-muted">Exploded → assembled</span>
            <span aria-hidden className="h-px w-24 bg-chart-past">
              <span className="block h-px bg-primary transition-[width] duration-200 ease-out" style={{ width: `${((step + 1) / N) * 100}%` }} />
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden flex-wrap items-center gap-4 p-6 t-body-sm text-muted sm:flex">
            <span>Scroll to assemble</span>
            {!coarse && <span>Drag to rotate</span>}
            <span>Select a part to open it</span>
          </div>
        </div>

        <aside className="flex min-h-0 flex-col rounded-xl bg-surface p-6 lg:col-span-4 lg:p-8" aria-live="polite">
          <div className="min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={panelId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}>
                <PartPanel id={panelId} onOpen={() => overlay.open(panelId)} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 hidden border-t border-border pt-6 lg:block">
            <p className="mb-3 flex items-center gap-2 t-body-sm text-muted">
              Jump to a part <Kbd>↵</Kbd>
            </p>
            <ol className="flex flex-wrap gap-1">
              {harnessParts.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    onMouseEnter={() => setHovered(p.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(p.id)}
                    onBlur={() => setHovered(null)}
                    aria-label={p.name}
                    aria-current={i === step ? "step" : undefined}
                    className={cn(
                      "flex h-8 cursor-pointer items-center justify-center rounded-full border px-3 t-body-sm whitespace-nowrap transition-colors duration-150",
                      i === step ? "border-primary bg-primary text-on-primary" : i < step ? "border-chart-past text-body hover:bg-surface-raised" : "border-border text-muted hover:bg-surface-raised"
                    )}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
