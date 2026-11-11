import type { SupplierGroup } from "@/content/suppliers";
import type { MarkerTone } from "@/components/ui-rt";
import { cn } from "@/lib/utils";

/**
 * Supplier group encoding, used identically in chapters 09 and 11.
 * moss / rose / chart-mid neutral: avoids the domain colours (sage, slate, tan, lavender)
 * and Competition's olive / teal.
 */
export const GROUP_STYLE: Record<SupplierGroup, { bg: string; stroke: string; tone: MarkerTone }> = {
  manufacturer: { bg: "bg-data-moss", stroke: "stroke-data-moss", tone: "moss" },
  distributor: { bg: "bg-data-rose", stroke: "stroke-data-rose", tone: "rose" },
  services: { bg: "bg-chart-mid", stroke: "stroke-chart-mid", tone: "mid" },
};

/** 8px group dot for chips / pills. */
export function GroupDot({ group, className }: { group: SupplierGroup; className?: string }) {
  return <span aria-hidden className={cn("size-2 shrink-0 rounded-full", GROUP_STYLE[group].bg, className)} />;
}
