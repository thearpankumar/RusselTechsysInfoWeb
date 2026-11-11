import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Deprecated: structural numbering was removed site-wide; accepted for compatibility, not rendered. */
  index?: string;
  /** Optional thin line icon element for the header (lucide, size 20). */
  icon?: React.ReactNode;
  /** Small header title (body-lg). Keep it small; the content is what's large. */
  title?: React.ReactNode;
  /** Right-aligned header action (e.g. <Button size="sm">Open →</Button>). */
  action?: React.ReactNode;
  /** Makes the whole card a door: hover brightens the border; renders a <button> when onClick is set. */
  interactive?: boolean;
  as?: "div" | "article" | "section" | "li";
}

/** DESIGN.md card: surface, rounded.xl, 40px padding (24px on mobile), no shadow, small header. */
export function Card({ icon, title, action, interactive, as = "div", className, children, onClick, ...rest }: CardProps) {
  const isButton = Boolean(onClick);
  const classes = cn(
    "relative block w-full rounded-xl border border-transparent bg-surface p-6 text-left text-on-surface sm:p-10",
    (interactive || isButton) && "cursor-pointer transition-colors duration-150 ease-out hover:border-chart-past",
    className
  );
  const header =
    icon || title || action ? (
      <div className="mb-6 flex min-h-12 items-center gap-3">
        {icon && <span className="text-muted [&_svg]:size-5 [&_svg]:stroke-[1.5]">{icon}</span>}
        {title && <span className="t-body-lg text-on-surface">{title}</span>}
        {action && <span className="ml-auto">{action}</span>}
      </div>
    ) : null;

  if (isButton) {
    return (
      <button type="button" className={classes} onClick={onClick as React.MouseEventHandler<HTMLButtonElement>} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {header}
        {children}
      </button>
    );
  }
  const Tag = as;
  return (
    <Tag className={classes} {...rest}>
      {header}
      {children}
    </Tag>
  );
}
