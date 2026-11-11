import { cn } from "@/lib/utils";
import { Marker, type MarkerShape, type MarkerTone } from "./Marker";

export interface LegendItem {
  label: string;
  tone?: MarkerTone;
  shape?: MarkerShape;
  count?: number | string;
}

/** Chart/map legend: marker + label (body-md) + optional count (on-surface). Never colour-only. */
export function Legend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-6 gap-y-2", className)}>
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-center gap-2 t-body-md text-body">
          <Marker tone={it.tone} shape={it.shape} />
          <span>{it.label}</span>
          {it.count !== undefined && <span className="tnum text-on-surface">{it.count}</span>}
        </li>
      ))}
    </ul>
  );
}
