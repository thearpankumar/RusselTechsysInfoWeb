import { cn } from "@/lib/utils";
import type { Confidence } from "@/content/types";

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  reported: "Reported",
  session: "Working session",
  rules: "Internal rules",
  calc: "Our calculation",
  estimate: "Estimate",
  "industry-example": "Industry example",
};

/** Muted dashed tag flagging non-reported facts. "reported" renders nothing unless showReported. */
export function ConfidenceTag({ confidence, showReported, className }: { confidence: Confidence; showReported?: boolean; className?: string }) {
  if (confidence === "reported" && !showReported) return null;
  return (
    <span
      title={`Confidence: ${CONFIDENCE_LABEL[confidence]}`}
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full border border-dashed border-border px-2 t-mono-sm whitespace-nowrap text-muted",
        className
      )}
    >
      {CONFIDENCE_LABEL[confidence]}
    </span>
  );
}
