"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export interface BarDatum {
  /** Period label under the bar (mono-sm), e.g. "FY26" or "Q2 FY27". */
  label: string;
  /** Non-negative value; axis is at zero. null = no data (renders "—"). */
  value: number | null;
  /** Current period = white bar. If no datum sets it, the last one is current. */
  current?: boolean;
  /** Formatted value above the bar; defaults to formatValue(value). */
  display?: string;
}

export interface BarChartProps {
  data: BarDatum[];
  /** Plot height in px (bars area). */
  height?: number;
  formatValue?: (v: number) => string;
  /** Domain max; defaults to the data max. */
  max?: number;
  /** Accessible summary, e.g. "Revenue FY24 to FY26 in ₹ Cr". */
  ariaLabel: string;
  onBarClick?: (d: BarDatum, i: number) => void;
  className?: string;
}

/** Vertical bars: past = chart-past, current = white, values above, mono labels below, rounded.sm tops, no gridlines; grows in on view. */
export function BarChart({ data, height = 240, formatValue = (v) => v.toLocaleString("en-IN"), max, ariaLabel, onBarClick, className }: BarChartProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotionSafe();
  const hasCurrent = data.some((d) => d.current);
  const domainMax = max ?? Math.max(1, ...data.map((d) => d.value ?? 0));

  return (
    <div ref={ref} role="img" aria-label={ariaLabel} className={cn("w-full", className)}>
      <div className="flex items-end gap-2 border-b border-border sm:gap-4" style={{ height: height + 32 }}>
        {data.map((d, i) => {
          const current = hasCurrent ? !!d.current : i === data.length - 1;
          const h = d.value === null ? 0 : Math.max(2, (d.value / domainMax) * height);
          const shown = inView || reduce;
          const Col = onBarClick ? "button" : "div";
          return (
            <Col
              key={d.label}
              {...(onBarClick ? { type: "button" as const, onClick: () => onBarClick(d, i) } : {})}
              className={cn("group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2", onBarClick && "cursor-pointer")}
            >
              <motion.span
                className={cn("t-body-sm tnum whitespace-nowrap", d.value === null ? "text-muted" : current ? "text-on-surface" : "text-body")}
                initial={false}
                animate={{ opacity: shown ? 1 : 0 }}
                transition={{ duration: 0.2, delay: reduce ? 0 : 0.1 + i * 0.04 }}
              >
                {d.value === null ? "—" : (d.display ?? formatValue(d.value))}
              </motion.span>
              <motion.span
                aria-hidden
                className={cn(
                  "block w-full max-w-16 origin-bottom rounded-t-sm transition-opacity duration-150",
                  current ? "bg-primary" : "bg-chart-past",
                  onBarClick && "group-hover:opacity-90"
                )}
                style={{ height: h }}
                initial={false}
                animate={{ scaleY: shown ? 1 : 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : i * 0.04 }}
              />
            </Col>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2 sm:gap-4">
        {data.map((d, i) => {
          const current = hasCurrent ? !!d.current : i === data.length - 1;
          return (
            <span key={d.label} className={cn("min-w-0 flex-1 text-center t-mono-sm", current ? "text-on-surface" : "text-muted")}>
              {d.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
