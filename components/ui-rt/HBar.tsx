import * as React from "react";
import { cn } from "@/lib/utils";

export interface HBarProps {
  value: number;
  /** Track maximum (default 100). */
  max?: number;
  /** Label above-left (body-md). */
  label?: React.ReactNode;
  /** Formatted value above-right; defaults to the raw value. Pass null to hide. */
  display?: React.ReactNode | null;
  /** Dim the fill (chart-light) for non-current rows. */
  muted?: boolean;
  className?: string;
}

/** Horizontal bar: 4px white fill on a chart-past track, rounded.full. */
export function HBar({ value, max = 100, label, display, muted, className }: HBarProps) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div className={cn("w-full", className)}>
      {(label !== undefined || display !== null) && (
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <span className="t-body-md text-body">{label}</span>
          {display !== null && <span className="t-body-md tnum text-on-surface">{display ?? value}</span>}
        </div>
      )}
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-chart-past"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div className={cn("h-full rounded-full transition-[width] duration-200 ease-out", muted ? "bg-chart-light" : "bg-primary")} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
