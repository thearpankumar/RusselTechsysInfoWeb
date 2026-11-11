"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { scaleLinear, scaleTime } from "d3-scale";
import { line, curveStepAfter } from "d3-shape";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useWidth } from "../financials/shared";

/** Indices whose labels fit at least `gap` px apart, keeping the latest point first, then working back in time. */
function thinLabels(xs: number[], gap: number) {
  const keep = new Set<number>();
  let prev = Infinity;
  for (let i = xs.length - 1; i >= 0; i--) {
    if (prev - xs[i] >= gap) {
      keep.add(i);
      prev = xs[i];
    }
  }
  return keep;
}

export interface StepPoint {
  label: string;
  asOf: string;
  value: number;
  display: string;
  approx?: boolean;
}

/** Step line over real time: hollow = approximate ("over ₹700 Cr"), filled = exact, white = latest. Points are doors. */
export function OrderBookChart({ data, onPointClick, ariaLabel }: { data: StepPoint[]; onPointClick?: (i: number) => void; ariaLabel: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotionSafe();
  const h = 260;
  const m = { t: 40, r: 24, b: 32, l: 24 };
  const dates = data.map((d) => new Date(d.asOf));
  const x = scaleTime()
    .domain([dates[0], dates[dates.length - 1]])
    .range([m.l, Math.max(m.l + 1, width - m.r)]);
  const y = scaleLinear().domain([0, 1000]).range([h - m.b, m.t]);
  const path = line<StepPoint>()
    .x((d) => x(new Date(d.asOf)))
    .y((d) => y(d.value))
    .curve(curveStepAfter)(data);
  const last = data.length - 1;
  const shown = inView || reduce;
  const xs = dates.map((d) => x(d));
  // Period labels (mono, ~6 chars) and value labels need ~80 / ~64 px (edge labels are end-anchored); skip the ones that would collide.
  const periodShown = thinLabels(xs, 80);
  const valueShown = thinLabels(xs, 64);

  return (
    <div ref={ref} className="w-full" role="img" aria-label={ariaLabel}>
      {width > 0 && (
        <svg width={width} height={h} className="block overflow-visible">
          {[0, 500, 1000].map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} className="stroke-border" strokeWidth={1} />
              {/* The top gridline stays unlabelled: its label would sit on the latest (₹900) value label. */}
              {t < 1000 && (
                <text x={width - m.r} y={y(t) - 6} textAnchor="end" className="fill-muted t-mono-sm">
                  {t === 0 ? "₹0" : `₹${t}`}
                </text>
              )}
            </g>
          ))}
          <motion.path
            d={path ?? ""}
            fill="none"
            className="stroke-chart-mid"
            strokeWidth={1.5}
            initial={false}
            animate={{ pathLength: shown ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
          {data.map((d, i) => {
            const cx = x(new Date(d.asOf));
            const cy = y(d.value);
            const current = i === last;
            const showLabel = valueShown.has(i);
            return (
              <g
                key={d.label}
                role={onPointClick ? "button" : undefined}
                tabIndex={onPointClick ? 0 : undefined}
                aria-label={`${d.label}: ₹${d.display} Cr`}
                onClick={() => onPointClick?.(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPointClick?.(i);
                  }
                }}
                className={cn(onPointClick && "cursor-pointer outline-none [&:focus-visible>circle:last-child]:stroke-primary")}
              >
                <circle cx={cx} cy={cy} r={14} className="fill-transparent" />
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={5}
                  strokeWidth={1.5}
                  className={cn(current ? "fill-primary stroke-primary" : d.approx ? "fill-background stroke-chart-mid" : "fill-chart-light stroke-chart-light")}
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0 }}
                  transition={{ duration: 0.2, delay: reduce ? 0 : 0.15 + i * 0.08 }}
                />
                {showLabel && (
                  <text x={cx} y={cy - 14} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} className={cn("t-body-sm tnum", current ? "fill-on-surface" : "fill-body")}>
                    {d.display}
                  </text>
                )}
                <text x={cx} y={h - 8} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} className={cn("t-mono-sm", current ? "fill-on-surface" : "fill-muted")}>
                  {periodShown.has(i) ? d.label : ""}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      {width === 0 && <div style={{ height: h }} />}
    </div>
  );
}
