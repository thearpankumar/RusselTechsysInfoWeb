"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { bomToKitFlow, currentWork } from "@/content/lifecycle";
import { Chip, Cite, ConfidenceTag, StatusTrack } from "@/components/ui-rt";

const STEP_MS = 2600;

/**
 * Drawing → delivered: 8-step pipeline. On mount it walks once through the steps (one every 2.6s) and stops on the last;
 * selecting any step holds it. Reduced motion: no walk, first step shown.
 */
export function PipelineTrack() {
  const reduce = useReducedMotionSafe();
  const [current, setCurrent] = React.useState(0);
  const [held, setHeld] = React.useState(false);
  const step = bomToKitFlow[current];

  React.useEffect(() => {
    if (reduce || held || current >= bomToKitFlow.length - 1) return;
    const t = window.setTimeout(() => setCurrent((c) => Math.min(c + 1, bomToKitFlow.length - 1)), STEP_MS);
    return () => window.clearTimeout(t);
  }, [current, held, reduce]);

  const select = (i: number) => {
    setHeld(true);
    setCurrent(i);
  };

  return (
    <div>
      <StatusTrack steps={bomToKitFlow.map((s) => ({ label: s.name, sub: undefined }))} current={current} onStepClick={select} />
      <div className="mt-8 min-h-40 rounded-lg bg-surface-raised p-6" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step.index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}>
            <p className="t-body-lg text-on-surface">{step.name}</p>
            <p className="mt-1 t-body-md text-body">{step.what}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Chip>{step.supporting}</Chip>
              <ConfidenceTag confidence={step.confidence} />
              <Cite ids={step.sources} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 t-body-md text-muted">
        {currentWork.text}
        <ConfidenceTag confidence={currentWork.confidence} />
        <Cite ids={currentWork.sources} />
      </p>
    </div>
  );
}
