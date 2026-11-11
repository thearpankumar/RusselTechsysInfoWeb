import * as React from "react";
import { cn } from "@/lib/utils";

export interface TrackStep {
  label: React.ReactNode;
  sub?: React.ReactNode;
}

/**
 * Progress/status track: stops on a 1px line. Current stop = filled white dot with the line white
 * up to it; other stops = hollow 10px circles. `current` is the 0-based index (-1 = none).
 */
export function StatusTrack({
  steps,
  current,
  onStepClick,
  className,
}: {
  steps: TrackStep[];
  current: number;
  onStepClick?: (i: number) => void;
  className?: string;
}) {
  const n = steps.length;
  const progress = n > 1 ? Math.max(0, Math.min(1, current / (n - 1))) : 0;
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <ol className="relative grid min-w-max" style={{ gridTemplateColumns: `repeat(${n}, minmax(8rem, 1fr))` }}>
        {/* base line + white progress line, centred on the first/last dot */}
        <span aria-hidden className="absolute top-1.25 h-px bg-border" style={{ left: `calc(100% / ${n} / 2)`, right: `calc(100% / ${n} / 2)` }} />
        <span
          aria-hidden
          className="absolute top-1.25 h-px bg-primary transition-[width] duration-200 ease-out"
          style={{ left: `calc(100% / ${n} / 2)`, width: `calc((100% - 100% / ${n}) * ${progress})` }}
        />
        {steps.map((s, i) => {
          const isCurrent = i === current;
          const done = i < current;
          const dot = (
            <span
              className={cn(
                "relative z-10 block size-2.5 rounded-full border",
                isCurrent ? "border-primary bg-primary" : done ? "border-primary bg-background" : "border-chart-mid bg-background"
              )}
            />
          );
          const text = (
            <>
              <span className={cn("mt-3 block t-body-sm", isCurrent ? "text-on-surface" : "text-body")}>{s.label}</span>
              {s.sub && <span className="mt-1 block t-mono-sm text-muted">{s.sub}</span>}
            </>
          );
          return (
            <li key={i} aria-current={isCurrent ? "step" : undefined} className="flex flex-col items-center px-2 text-center">
              {onStepClick ? (
                <button type="button" onClick={() => onStepClick(i)} className="flex cursor-pointer flex-col items-center rounded-md">
                  {dot}
                  {text}
                </button>
              ) : (
                <>
                  {dot}
                  {text}
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
