import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatProps {
  /** Small stat label above the figure (mono-sm, muted). */
  label?: React.ReactNode;
  /** The figure. null/undefined/"" renders a muted "—". */
  value?: React.ReactNode;
  /** Smaller muted unit on the same baseline ("₹ Cr", "%", "years"). */
  unit?: React.ReactNode;
  /** Optional unit placed before the value (e.g. "₹"). */
  prefix?: React.ReactNode;
  /** Plain-English label under the figure (body-lg, on-surface). */
  caption?: React.ReactNode;
  /** Sub-label (body-md, muted). Wraps; never truncated. */
  sub?: React.ReactNode;
  /** lg = metric-lg (rows/strips), xl = metric-xl (one per container). */
  size?: "lg" | "xl";
  /** Selected stat: surface-raised fade + 2px white underline. */
  selected?: boolean;
  /** Extra inline content after the sub (e.g. <Cite ids={...}/> or <ConfidenceTag/>). */
  meta?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/** Stat: label → big tabular figure (+unit) → caption → sub. */
export function Stat({ label, value, unit, prefix, caption, sub, size = "lg", selected, meta, onClick, className }: StatProps) {
  // A clickable stat is a <button>; meta (Cite chips are buttons) must then sit outside it.
  const metaOutside = Boolean(onClick && meta);
  const empty = value === null || value === undefined || value === "";
  const body = (
    <>
      {label && <div className="mb-3 t-mono-sm text-muted">{label}</div>}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {prefix && !empty && <span className="t-body-lg text-muted">{prefix}</span>}
        <span className={cn(size === "xl" ? "t-metric-xl" : "t-metric-lg", empty ? "text-muted" : "text-on-surface")}>
          {empty ? "—" : value}
        </span>
        {unit && !empty && <span className="t-body-lg text-muted">{unit}</span>}
      </div>
      {caption && <div className="mt-3 t-body-lg text-on-surface">{caption}</div>}
      {sub && <div className="mt-1 t-body-md text-muted">{sub}</div>}
      {meta && !metaOutside && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
    </>
  );
  const classes = cn(
    "block min-w-0 border-b-2 border-transparent pb-4 text-left",
    // The selected-stat fade is one of DESIGN.md's two permitted gradients.
    selected && "border-primary bg-linear-to-t from-surface-raised to-transparent",
    onClick && "cursor-pointer transition-colors duration-150 ease-out hover:border-chart-past",
    selected && onClick && "hover:border-primary",
    className
  );
  if (onClick) {
    const button = (
      <button type="button" onClick={onClick} aria-pressed={selected} className={classes}>
        {body}
      </button>
    );
    if (!metaOutside) return button;
    return (
      <div className="min-w-0">
        {button}
        <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>
      </div>
    );
  }
  return <div className={classes}>{body}</div>;
}
