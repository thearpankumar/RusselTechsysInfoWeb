import { cn } from "@/lib/utils";
import { dataBg, type DataColor } from "@/lib/dataColors";

export type MarkerTone = DataColor | "primary" | "past" | "mid";
export type MarkerShape = "dot" | "diamond" | "hollow" | "hatch";

const toneBg: Record<"primary" | "past" | "mid", string> = {
  primary: "bg-primary",
  past: "bg-chart-past",
  mid: "bg-chart-mid",
};

/** 8–10px status/category marker. dot = filled, diamond = distinct location type, hollow = ended, hatch = at risk. */
export function Marker({ tone = "primary", shape = "dot", size = 10, className }: { tone?: MarkerTone; shape?: MarkerShape; size?: 8 | 10; className?: string }) {
  const bg = tone in toneBg ? toneBg[tone as keyof typeof toneBg] : dataBg[tone as DataColor];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0",
        size === 8 ? "size-2" : "size-2.5",
        shape === "diamond" ? "rotate-45 rounded-[1px]" : "rounded-full",
        shape === "hollow" ? "border border-chart-mid bg-transparent" : shape === "hatch" ? "hatch border border-chart-mid" : bg,
        className
      )}
    />
  );
}
