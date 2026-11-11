"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { scaleLinear, scaleLog, scaleSqrt } from "d3-scale";
import { motion, useInView } from "motion/react";
import type { CompetitorX } from "@/content/competitors";
import { dataFill, type DataColor } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { useWidth } from "../financials/shared";

export const GROUP_COLOR: Record<CompetitorX["group"], DataColor> = { indian: "olive", global: "teal" };

/**
 * Bubble chart: x = revenue (₹ Cr, log scale), y = EBITDA margin (%), area = A&D share when known
 * (uniform hollow-ish size when unknown). Horizontal gridlines only; Rossell in white.
 */
export function BubbleChart({ data, onSelect }: { data: CompetitorX[]; onSelect: (id: string) => void }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotionSafe();
  const shown = inView || reduce;
  const h = 380;
  const m = { t: 24, r: 24, b: 48, l: 48 };
  const plotted = data.filter((d) => d.revenueCr && d.ebitdaMarginPct);
  const x = scaleLog().domain([300, 10000]).range([m.l, Math.max(m.l + 1, width - m.r)]);
  const y = scaleLinear().domain([0, 45]).range([h - m.b, m.t]);
  const r = scaleSqrt().domain([0, 100]).range([4, 30]);
  const compact = width < 600;
  const ticksX = [300, 1000, 3000, 10000];

  return (
    <div ref={ref} className="w-full" role="img" aria-label="Revenue versus EBITDA margin for Rossell and peers">
      {width > 0 ? (
        <svg width={width} height={h} className="block overflow-visible">
          {[0, 10, 20, 30, 40].map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} strokeWidth={1} className="stroke-border" />
              <text x={m.l - 8} y={y(t) + 4} textAnchor="end" className="fill-muted t-mono-sm">
                {t}%
              </text>
            </g>
          ))}
          {ticksX.map((t) => (
            <text key={t} x={x(t)} y={h - m.b + 24} textAnchor="middle" className="fill-muted t-mono-sm">
              ₹{t.toLocaleString("en-IN")}
            </text>
          ))}
          <text x={width - m.r} y={h - 4} textAnchor="end" className="fill-muted t-body-sm">
            Revenue, ₹ Cr (log scale) →
          </text>
          {plotted
            .slice()
            .sort((a, b) => (b.adSharePct?.value ?? 20) - (a.adSharePct?.value ?? 20))
            .map((d, i) => {
              const isR = d.id === "rossell";
              const cx = x(d.revenueCr!.value);
              const cy = y(d.ebitdaMarginPct!.value);
              const known = !!d.adSharePct;
              const rad = known ? r(d.adSharePct!.value) : 9;
              const labelRight = cx < width - 140;
              return (
                <g
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${d.short}: revenue ₹${d.revenueCr!.value} Cr, margin ${d.ebitdaMarginPct!.value}%${known ? `, A&D ${d.adSharePct!.value}%` : ""}`}
                  onClick={() => onSelect(d.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(d.id);
                    }
                  }}
                  className="group cursor-pointer outline-none"
                >
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={rad}
                    strokeWidth={1}
                    className={cn(
                      "stroke-background transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:stroke-primary",
                      isR ? "fill-primary" : dataFill[GROUP_COLOR[d.group]]
                    )}
                    style={{ opacity: 0.85, ...(known || isR ? {} : { fillOpacity: 0.35 }) }}
                    initial={false}
                    animate={{ scale: shown ? 1 : 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.05 * i }}
                  />
                  {(!compact || isR) && (
                    <text
                      x={labelRight ? cx + rad + 6 : cx - rad - 6}
                      y={cy + 4}
                      textAnchor={labelRight ? "start" : "end"}
                      className={cn("t-body-sm", isR ? "fill-on-surface" : "fill-body")}
                    >
                      {d.short}
                    </text>
                  )}
                </g>
              );
            })}
        </svg>
      ) : (
        <div style={{ height: h }} />
      )}
    </div>
  );
}
