"use client";

// One filter facet: a dashed "+ Context" pill (DESIGN.md: dashed = add) that opens a checklist with live counts.
// Applied, it becomes a solid "Context · 2" pill. Values with no matching rule are disabled.
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Check, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FacetPillOption {
  value: string;
  label: string;
  count: number;
  marker?: React.ReactNode;
  group?: string;
}

export function FacetPill({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: FacetPillOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const active = selected.length > 0;
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);

  // Group headings (Section facet) in first-seen order.
  const groups = React.useMemo(() => {
    const m = new Map<string, FacetPillOption[]>();
    for (const o of options) {
      const g = o.group ?? "";
      if (!m.has(g)) m.set(g, []);
      m.get(g)!.push(o);
    }
    return [...m.entries()];
  }, [options]);

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 t-body-md transition-colors duration-150 ease-out hover:border-chart-past hover:bg-surface-raised data-[state=open]:border-chart-past data-[state=open]:bg-surface-raised",
            active ? "border-chart-past bg-surface-raised text-on-surface" : "border-dashed border-border text-body"
          )}
        >
          {active ? null : <Plus aria-hidden className="size-4 text-muted" strokeWidth={1.5} />}
          {label}
          {active && <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-primary px-1 t-mono-sm text-on-primary tnum">{selected.length}</span>}
          <ChevronDown aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          data-lenis-prevent
          onKeyDown={(e) => e.stopPropagation()}
          aria-label={`Filter by ${label.toLowerCase()}`}
          className={cn(
            "z-50 flex max-h-[min(28rem,var(--radix-popover-content-available-height))] w-72 flex-col overflow-hidden rounded-lg border border-border bg-background text-on-surface",
            "duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <span className="t-label-caps text-muted">{label}</span>
            <button
              type="button"
              disabled={!active}
              onClick={() => onChange([])}
              className="cursor-pointer t-body-sm text-body underline-offset-4 hover:text-on-surface hover:underline disabled:pointer-events-none disabled:opacity-40"
            >
              Clear
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain p-2">
            {groups.map(([group, opts]) => (
              <div key={group || "all"} role="group" aria-label={group || label}>
                {group && <p className="px-2 pt-3 pb-1 t-mono-sm text-muted first:pt-1">{group}</p>}
                {opts.map((o) => {
                  const checked = selected.includes(o.value);
                  const disabled = !checked && o.count === 0;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={checked}
                      disabled={disabled}
                      onClick={() => toggle(o.value)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-raised disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center rounded-sm border",
                          checked ? "border-primary bg-primary text-on-primary" : "border-chart-mid"
                        )}
                      >
                        {checked && <Check className="size-3" strokeWidth={2} />}
                      </span>
                      {o.marker}
                      <span className="min-w-0 flex-1 truncate t-body-md text-on-surface">{o.label}</span>
                      <span className="t-mono-sm text-muted tnum">{o.count}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
