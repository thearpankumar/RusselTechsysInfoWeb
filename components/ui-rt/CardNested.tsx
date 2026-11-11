import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardNestedProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hover brightens the border; renders a <button> when onClick is set. */
  interactive?: boolean;
  /** Selected/active state (border turns chart-mid). */
  selected?: boolean;
}

/** DESIGN.md card-nested: surface-raised, rounded.lg, 24px padding — for anything inside a Card. */
export function CardNested({ interactive, selected, className, onClick, children, ...rest }: CardNestedProps) {
  const classes = cn(
    "block w-full rounded-lg border border-transparent bg-surface-raised p-6 text-left text-on-surface",
    (interactive || onClick) && "cursor-pointer transition-colors duration-150 ease-out hover:border-chart-past",
    selected && "border-chart-mid",
    className
  );
  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    );
  }
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
