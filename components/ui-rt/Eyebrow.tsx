import * as React from "react";
import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Deprecated: structural numbering was removed site-wide; accepted for compatibility, not rendered. */
  index?: string;
}

/** Eyebrow / section kicker: label-caps, muted, always uppercase. */
export function Eyebrow({ className, children, ...rest }: EyebrowProps) {
  return (
    <p className={cn("flex items-center gap-3 t-label-caps text-muted", className)} {...rest}>
      <span>{children}</span>
    </p>
  );
}
