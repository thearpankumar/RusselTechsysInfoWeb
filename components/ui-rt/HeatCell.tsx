import * as React from "react";
import { cn } from "@/lib/utils";

export type HeatLevel = "empty" | "past" | "low" | "mid" | "high";

const levelClass: Record<HeatLevel, string> = {
  empty: "bg-surface-raised text-muted",
  past: "bg-chart-past text-on-surface",
  low: "bg-chart-mid text-on-primary",
  mid: "bg-chart-light text-on-primary",
  high: "bg-primary text-on-primary",
};

/** Map a value onto the grey-to-white heat ramp. */
export function heatLevel(value: number | null | undefined, min: number, max: number): HeatLevel {
  if (value === null || value === undefined || Number.isNaN(value)) return "empty";
  const t = max === min ? 1 : (value - min) / (max - min);
  if (t >= 0.85) return "high";
  if (t >= 0.55) return "mid";
  if (t >= 0.25) return "low";
  return "past";
}

export interface HeatCellProps {
  /** Large value inside the cell; empty renders "—". */
  value?: React.ReactNode;
  /** Small name inside the cell. */
  name?: React.ReactNode;
  level: HeatLevel;
  onClick?: () => void;
  className?: string;
}

/** Heat-map cell: grey-to-white ramp, rounded.md, value large + name small. */
export function HeatCell({ value, name, level, onClick, className }: HeatCellProps) {
  const empty = level === "empty" || value === null || value === undefined || value === "";
  const classes = cn(
    "flex min-h-24 flex-col justify-between gap-2 rounded-md p-4 text-left",
    levelClass[empty ? "empty" : level],
    onClick && "cursor-pointer transition-opacity duration-150 hover:opacity-90",
    className
  );
  const inner = (
    <>
      <span className="t-headline-md tnum">{empty ? "—" : value}</span>
      {name && <span className="t-body-sm">{name}</span>}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={classes}>
      {inner}
    </button>
  ) : (
    <div className={classes}>{inner}</div>
  );
}
