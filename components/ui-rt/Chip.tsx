import * as React from "react";
import { cn } from "@/lib/utils";
import { dataBg, type DataColor } from "@/lib/dataColors";

export interface ChipProps {
  children: React.ReactNode;
  /** Leading 8px category dot (data colour) or any custom marker node. */
  marker?: DataColor | React.ReactNode;
  /** Trailing count (on-surface, tabular). */
  count?: number | string;
  /** Dashed outline = add / optional action. */
  dashed?: boolean;
  /** Selected = surface-raised fill. */
  selected?: boolean;
  /** Leading thin icon. */
  icon?: React.ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
}

const isDataColor = (m: unknown): m is DataColor =>
  typeof m === "string" && m in dataBg;

/** Outline pill chip, 40px tall, body-md. Renders a <button> when onClick is set. */
export function Chip({ children, marker, count, dashed, selected, icon, onClick, title, className }: ChipProps) {
  const classes = cn(
    "inline-flex h-10 max-w-full shrink-0 items-center gap-2 rounded-full border border-border px-3 t-body-md text-on-surface",
    dashed && "border-dashed text-body",
    selected && "border-chart-past bg-surface-raised",
    onClick && "cursor-pointer transition-colors duration-150 ease-out hover:border-chart-past hover:bg-surface-raised",
    className
  );
  const content = (
    <>
      {marker !== undefined &&
        (isDataColor(marker) ? (
          <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dataBg[marker])} />
        ) : (
          marker
        ))}
      {icon && <span className="text-muted [&_svg]:size-4 [&_svg]:stroke-[1.5]">{icon}</span>}
      <span className="truncate">{children}</span>
      {count !== undefined && <span className="tnum text-muted">{count}</span>}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} aria-pressed={selected} title={title} className={classes}>
      {content}
    </button>
  ) : (
    <span title={title} className={classes}>
      {content}
    </span>
  );
}

/** Raised count chip for counts like "5 phases" or the "+N" overflow chip. */
export function ChipCount({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const classes = cn(
    "inline-flex h-10 shrink-0 items-center rounded-full bg-surface-raised px-3 t-body-md tnum text-on-surface",
    onClick && "cursor-pointer transition-colors duration-150 hover:bg-border",
    className
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  ) : (
    <span className={classes}>{children}</span>
  );
}
