"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ChapterId } from "@/lib/journeyChapters";

interface SectionState {
  chapter: ChapterId;
  /** Active section id (from the route /<chapter>/<section>). */
  section: string;
}

const SectionContext = React.createContext<SectionState | null>(null);

/** Set by the section route: only the matching <Section> renders. */
export function SectionProvider({ chapter, section, children }: SectionState & { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ chapter, section }), [chapter, section]);
  return <SectionContext.Provider value={value}>{children}</SectionContext.Provider>;
}

/** Active { chapter, section } or null when rendered outside a section route. */
export function useActiveSection() {
  return React.useContext(SectionContext);
}

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * One section of a chapter. Renders only when it is the routed section (or always, outside a section route).
 * Mount = orchestrated entrance: each direct child fades and slides 12px up, staggered 60ms after the header.
 * Re-entering the route remounts it, so the entrance replays. Reduced motion: final state, no motion.
 */
export function Section({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(SectionContext);
  const reduce = useReducedMotionSafe();
  if (ctx && ctx.section !== id) return null;
  let i = 0;
  return (
    <div data-section={id} className={cn("space-y-16", className)}>
      {React.Children.map(children, (child) => {
        if (child === null || child === undefined || child === false) return child;
        const d = 0.12 + Math.min(i++, 6) * 0.06;
        return (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT, delay: d }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
