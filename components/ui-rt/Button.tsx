import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Common = {
  /** secondary (default) = outline pill that inverts to white on hover; primary = white fill (max ONE per view at rest); ghost = bare. */
  variant?: "secondary" | "primary" | "ghost";
  /** md = 48px body-lg (DESIGN default); sm = 40px body-md. */
  size?: "md" | "sm";
  /** Append a "→" arrow. */
  arrow?: boolean;
  /** Leading thin icon. */
  icon?: React.ReactNode;
  /** Trailing kbd hint (e.g. <Kbd>↵</Kbd>). */
  kbd?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export type ButtonProps = Common &
  (
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof Common>)
    | ({ href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof Common | "href">)
  );

export function buttonClasses({ variant = "secondary", size = "md", className }: Pick<Common, "variant" | "size" | "className">) {
  return cn(
    "group/btn inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full whitespace-nowrap transition-[background-color,color,border-color,opacity] duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:shrink-0 [&_svg]:stroke-[1.5]",
    size === "md" ? "h-12 px-5 t-body-lg [&_svg]:size-5" : "h-10 px-4 t-body-md [&_svg]:size-4",
    variant === "secondary" &&
      "border border-border bg-transparent text-on-surface hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:border-primary focus-visible:bg-primary focus-visible:text-on-primary",
    variant === "primary" && "bg-primary text-on-primary hover:opacity-90",
    variant === "ghost" && "text-body hover:bg-surface-raised hover:text-on-surface",
    className
  );
}

/** Pill button. Renders a Next <Link>/<a> when `href` is given. Labels are short verbs ("Open →"). */
export function Button(props: ButtonProps) {
  const { variant, size, arrow, icon, kbd, className, children } = props;
  const inner = (
    <>
      {icon}
      {children}
      {arrow && <ArrowRight aria-hidden className="transition-transform duration-150 group-hover/btn:translate-x-0.5" />}
      {kbd}
    </>
  );
  const classes = buttonClasses({ variant, size, className });
  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, size: _s, arrow: _a, icon: _i, kbd: _k, className: _c, children: _ch, href, external, ...rest } = props;
    if (external || /^https?:/.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, arrow: _a, icon: _i, kbd: _k, className: _c, children: _ch, href: _h, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      {inner}
    </button>
  );
}
