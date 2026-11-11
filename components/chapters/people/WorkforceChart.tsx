"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { motion, useInView } from "motion/react";
import type { WorkforcePoint } from "@/content/people";
import { cn } from "@/lib/utils";

/**
 * Workforce bars with the definition encoded by fill, not hue:
 * filled grey = total workforce, white = latest, hatched = permanent employees only, dashed outline = company target.
 */
export function WorkforceChart({ data, latestId, onSelect, height = 240 }: { data: WorkforcePoint[]; latestId: string; onSelect: (i: number) => void; height?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotionSafe();
  const max = Math.max(...data.map((d) => d.value));
  const shown = inView || reduce;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Workforce over time: ${data.map((d) => `${d.label} ${d.value.toLocaleString("en-IN")} (${d.basis})`).join("; ")}`}
      className="w-full overflow-x-auto"
      data-lenis-prevent
    >
      <div className="min-w-xl">
        <div className="flex items-end gap-2 border-b border-border sm:gap-4" style={{ height: height + 32 }}>
          {data.map((d, i) => {
            const h = Math.max(2, (d.value / max) * height);
            const latest = d.id === latestId;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`${d.label}: ${d.value.toLocaleString("en-IN")} people, ${d.basis}`}
                className="group flex h-full min-w-0 flex-1 cursor-pointer flex-col items-center justify-end gap-2"
              >
                <motion.span
                  className={cn("t-body-sm tnum whitespace-nowrap", latest ? "text-on-surface" : d.basis === "target" ? "text-muted" : "text-body")}
                  initial={false}
                  animate={{ opacity: shown ? 1 : 0 }}
                  transition={{ duration: 0.2, delay: reduce ? 0 : 0.1 + i * 0.04 }}
                >
                  {d.value.toLocaleString("en-IN")}
                </motion.span>
                <motion.span
                  aria-hidden
                  className={cn(
                    "block w-full max-w-16 origin-bottom rounded-t-sm transition-opacity duration-150 group-hover:opacity-90",
                    latest && "bg-primary",
                    !latest && d.basis === "total" && "bg-chart-past",
                    d.basis === "permanent" && "hatch border border-chart-mid",
                    d.basis === "target" && "border border-dashed border-chart-mid"
                  )}
                  style={{ height: h }}
                  initial={false}
                  animate={{ scaleY: shown ? 1 : 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : i * 0.04 }}
                />
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2 sm:gap-4">
          {data.map((d) => (
            <span key={d.id} className={cn("min-w-0 flex-1 text-center t-mono-sm", d.id === latestId ? "text-on-surface" : "text-muted")}>
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
