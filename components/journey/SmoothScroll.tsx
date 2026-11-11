"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";

/**
 * Motion defaults for the journey. Native scrolling (Lenis was removed when the site moved to routed sections:
 * Next resets scroll per route and scroll-linked moments are bound to their own containers).
 * MotionConfig reducedMotion="user" makes every motion/react animation honour prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
