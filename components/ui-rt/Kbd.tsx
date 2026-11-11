import * as React from "react";
import { cn } from "@/lib/utils";

/** Keyboard key(s): mono-sm, 1px border, rounded.sm, one box per key. Pass `keys` or children. */
export function Kbd({ keys, children, className }: { keys?: string[]; children?: React.ReactNode; className?: string }) {
  const box = "inline-flex h-7 min-w-7 items-center justify-center rounded-sm border border-border px-1.5 t-mono-sm text-muted";
  if (keys && keys.length) {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        {keys.map((k) => (
          <kbd key={k} className={box}>
            {k}
          </kbd>
        ))}
      </span>
    );
  }
  return <kbd className={cn(box, className)}>{children}</kbd>;
}

/** Mono count badge (28px box), e.g. a muted count next to a nav label. */
export function CountBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex size-7 items-center justify-center rounded-sm border border-border t-mono-sm text-muted", className)}>
      {children}
    </span>
  );
}
