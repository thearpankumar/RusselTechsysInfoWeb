"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { motion } from "motion/react";

/** Fade + small upward slide (200ms ease-out) the first time the element scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  /** Seconds; use small staggers (0.04–0.08). */
  delay?: number;
  /** Slide distance in px (spacing scale: 8, 12, 16, 24). */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotionSafe();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  );
}
