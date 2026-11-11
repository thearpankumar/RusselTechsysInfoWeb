import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChartFrameProps {
  /** Chart title (headline-md). */
  title: React.ReactNode;
  /** REQUIRED one-line plain-English subtitle saying how to read the chart (DESIGN.md rule). */
  subtitle: string;
  eyebrow?: React.ReactNode;
  /** Right-aligned control (e.g. TabTrack size="sm"). */
  action?: React.ReactNode;
  /** Rendered under the chart (Legend, Cite, ConfidenceTag…). */
  footer?: React.ReactNode;
  /** bare = no card surface (chart sits on the page). */
  bare?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Frame for every chart: optional eyebrow, headline-md title, mandatory one-line subtitle, chart, footer. */
export function ChartFrame({ title, subtitle, eyebrow, action, footer, bare, className, children }: ChartFrameProps) {
  return (
    <figure className={cn(!bare && "rounded-xl bg-surface p-6 sm:p-10", className)}>
      <figcaption className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="mb-3 t-label-caps text-muted">{eyebrow}</p>}
          <h3 className="t-headline-md text-on-surface">{title}</h3>
          <p className="mt-2 t-body-md text-muted">{subtitle}</p>
        </div>
        {action}
      </figcaption>
      {children}
      {footer && <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6">{footer}</div>}
    </figure>
  );
}
