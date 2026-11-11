import * as React from "react";
import { cn } from "@/lib/utils";

export interface Segment {
  label: string;
  value: number;
  /** Mono index shown in the segment; defaults to 01, 02… */
  index?: string;
  /** Formatted value for the legend row; defaults to value. */
  display?: React.ReactNode;
}

/** Segment bar: surface-raised pill segments with 1px border and mono index; width ∝ value. Legend row underneath. */
export function SegmentBar({
  segments,
  showLegend = true,
  onSegmentClick,
  className,
}: {
  segments: Segment[];
  showLegend?: boolean;
  onSegmentClick?: (s: Segment, i: number) => void;
  className?: string;
}) {
  const idx = (s: Segment, i: number) => s.index ?? String(i + 1).padStart(2, "0");
  return (
    <div className={cn("w-full", className)}>
      <div className="flex w-full gap-1">
        {segments.map((s, i) => {
          const cls = "flex h-12 min-w-8 items-center rounded-md border border-border bg-surface-raised px-3 t-mono-sm text-muted";
          const style = { flexGrow: Math.max(s.value, 0), flexBasis: 0 };
          return onSegmentClick ? (
            <button key={s.label} type="button" title={s.label} style={style} onClick={() => onSegmentClick(s, i)} className={cn(cls, "cursor-pointer transition-colors duration-150 hover:border-chart-past hover:text-on-surface")}>
              {idx(s, i)}
            </button>
          ) : (
            <div key={s.label} title={s.label} style={style} className={cls}>
              {idx(s, i)}
            </div>
          );
        })}
      </div>
      {showLegend && (
        <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {segments.map((s, i) => (
            <li key={s.label} className="flex items-baseline gap-3 t-body-md">
              <span className="t-mono-sm text-muted">{idx(s, i)}</span>
              <span className="text-body">{s.label}</span>
              <span className="ml-auto tnum text-on-surface">{s.display ?? s.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
