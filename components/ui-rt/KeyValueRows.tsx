import * as React from "react";
import { cn } from "@/lib/utils";

export interface KeyValueRow {
  label: React.ReactNode;
  /** Figure; null/undefined/"" renders a muted "—". */
  value?: React.ReactNode;
  /** Optional trailing meta (Cite / ConfidenceTag). */
  meta?: React.ReactNode;
  onClick?: () => void;
}

/** Key–value rows: label in body (left), figure right-aligned tabular on-surface, 1px dividers. */
export function KeyValueRows({ rows, className }: { rows: KeyValueRow[]; className?: string }) {
  return (
    <dl className={cn("divide-y divide-border", className)}>
      {rows.map((r, i) => {
        const empty = r.value === null || r.value === undefined || r.value === "";
        const inner = (
          <>
            <dt className="t-body-md text-body">{r.label}</dt>
            <dd className="flex min-w-0 flex-wrap items-center justify-end gap-2 text-right">
              <span className={cn("t-body-md tnum", empty ? "text-muted" : "text-on-surface")}>{empty ? "—" : r.value}</span>
              {r.meta}
            </dd>
          </>
        );
        const cls = "grid grid-cols-[1fr_auto] items-center gap-6 py-3";
        const btnCls = cn(cls, "-mx-3 w-[calc(100%+1.5rem)] cursor-pointer rounded-md px-3 text-left transition-colors duration-150 hover:bg-surface-raised");
        if (r.onClick && r.meta) {
          // Meta (Cite chips are buttons) cannot live inside the row button: render it beside it.
          return (
            <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <button type="button" onClick={r.onClick} className={cn(btnCls, "mx-0 -ml-3 w-[calc(100%+0.75rem)]")}>
                <span className="t-body-md text-body">{r.label}</span>
                <span className={cn("text-right t-body-md tnum", empty ? "text-muted" : "text-on-surface")}>{empty ? "—" : r.value}</span>
              </button>
              <div className="flex items-center gap-2">{r.meta}</div>
            </div>
          );
        }
        return r.onClick ? (
          <button key={i} type="button" onClick={r.onClick} className={btnCls}>
            {inner}
          </button>
        ) : (
          <div key={i} className={cls}>
            {inner}
          </div>
        );
      })}
    </dl>
  );
}
