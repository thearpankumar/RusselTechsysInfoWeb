"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { animate, useInView } from "motion/react";
import { SegmentBar } from "@/components/ui-rt/SegmentBar";

/**
 * Two segment bars: FY26 actual (70/30, static) and the FY27 target, which morphs from 70/30 to 50/50
 * once this block is in view. The trigger is bound to the block itself (no page-scroll link), so it runs
 * the same whether the section fits on screen or not. Reduced motion: shows 50/50 directly.
 */
export function MixMorph({ onSegmentClick }: { onSegmentClick?: (which: "now" | "target") => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = React.useState(70);

  React.useEffect(() => {
    if (reduce || !inView) return;
    const controls = animate(70, 50, { duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce]);

  const target = reduce ? 50 : value;

  const segs = (a: number) => [
    { label: "Aerospace & defence", value: a, display: `${a}%` },
    { label: "Semiconductor, space & industrial", value: 100 - a, display: `${100 - a}%` },
  ];

  return (
    <div ref={ref} className="flex flex-col gap-8">
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <span className="t-mono-sm text-muted">FY26 · actual</span>
          <span className="t-body-md tnum text-body">70 : 30</span>
        </div>
        <SegmentBar segments={segs(70)} showLegend={false} onSegmentClick={onSegmentClick ? () => onSegmentClick("now") : undefined} />
      </div>
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <span className="t-mono-sm text-on-surface">FY27 · target</span>
          <span className="t-body-md tnum text-on-surface" aria-live="off">
            {target} : {100 - target}
          </span>
        </div>
        <SegmentBar segments={segs(target)} onSegmentClick={onSegmentClick ? () => onSegmentClick("target") : undefined} />
      </div>
    </div>
  );
}
