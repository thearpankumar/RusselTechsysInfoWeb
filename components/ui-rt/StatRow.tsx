import * as React from "react";
import { cn } from "@/lib/utils";

/** Row of equal-width stat cells separated by 1px vertical borders; sits on the page, not in a card. */
export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <div className={cn("grid grid-cols-2 gap-y-8 md:flex md:gap-y-0", className)}>
      {items.map((child, i) => (
        <div
          key={i}
          className={cn(
            "min-w-0 md:flex-1 md:border-l md:border-border md:px-6 md:first:border-l-0 md:first:pl-0",
            i % 2 === 1 ? "border-l border-border pl-6" : "pr-6"
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
