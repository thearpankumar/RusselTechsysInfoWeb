"use client";

import { cn } from "@/lib/utils";
import { SourcePopover } from "./SourcePopover";

/** Citation chip: small mono outline pill showing source ids ("S12 · S40"); click lists the sources. */
export function Cite({ ids, max = 3, className }: { ids: string[]; max?: number; className?: string }) {
  if (!ids?.length) return null;
  const shown = ids.slice(0, max).join(" · ");
  const extra = ids.length > max ? ` +${ids.length - max}` : "";
  return (
    <SourcePopover ids={ids}>
      <button
        type="button"
        aria-label={`Sources: ${ids.join(", ")}`}
        className={cn(
          "inline-flex h-6 max-w-full min-w-0 cursor-pointer items-center rounded-full border border-border px-2 t-mono-sm whitespace-nowrap text-muted align-middle transition-colors duration-150 hover:border-chart-past hover:text-on-surface",
          className
        )}
      >
        {/* Long id lists truncate on narrow screens rather than push the page sideways (full list is in the aria-label + popover). */}
        <span className="truncate">{shown}</span>
        {extra && <span className="shrink-0">{extra}</span>}
      </button>
    </SourcePopover>
  );
}
