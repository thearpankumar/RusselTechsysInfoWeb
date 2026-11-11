import * as React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Accessible label (also used as the native tooltip). */
  label: string;
  /** Thin line icon element, e.g. <ChevronLeft />. */
  icon: React.ReactNode;
  /** outline = circular 1px border (default); bare = no container (toolbars). */
  variant?: "outline" | "bare";
  /** md = 48px (DESIGN), sm = 40px. */
  size?: "md" | "sm";
}

/** Circular icon button: outline pill that inverts to white on hover, or bare icon. */
export function IconButton({ label, icon, variant = "outline", size = "md", className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:stroke-[1.5]",
        size === "md" ? "size-12 [&_svg]:size-5" : "size-10 [&_svg]:size-5",
        variant === "outline" && "border border-border hover:border-primary hover:bg-primary hover:text-on-primary",
        variant === "bare" && "text-body hover:bg-surface-raised hover:text-on-surface",
        className
      )}
      {...rest}
    >
      {icon}
    </button>
  );
}
