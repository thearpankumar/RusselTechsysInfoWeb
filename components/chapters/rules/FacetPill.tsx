"use client";

// Filter facets. Empty: a dashed "Context" pill (DESIGN.md: dashed = add). Applied: the pill itself shows the
// values ("Context: Supplier order +1") with its own × to clear it, so there is no separate applied-filters row.
// The checklist shows live counts (against the other filters); values with no match are disabled.
// On laptop widths the least-used facets fold into one "More" pill (MoreFacets), which reuses the same checklist.
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FacetPillOption {
  value: string;
  label: string;
  count: number;
  marker?: React.ReactNode;
  group?: string;
}

const panel = cn(
  "z-50 flex max-h-[min(28rem,var(--radix-popover-content-available-height))] w-72 flex-col overflow-hidden rounded-lg border border-border bg-background text-on-surface",
  "duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
);

/** Header ("STATUS · Clear") + checklist with counts for one facet. */
function FacetChecklist({ label, options, selected, onChange }: { label: string; options: FacetPillOption[]; selected: string[]; onChange: (values: string[]) => void }) {
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
    <div role="group" aria-label={label}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="t-label-caps text-muted">{label}</span>
        <button
          type="button"
          disabled={!selected.length}
          onClick={() => onChange([])}
          className="cursor-pointer t-body-sm text-body underline-offset-4 hover:text-on-surface hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Clear
        </button>
      </div>
      <div className="p-2">
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
                    className={cn("inline-flex size-4 shrink-0 items-center justify-center rounded-sm border", checked ? "border-primary bg-primary text-on-primary" : "border-chart-mid")}
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
    </div>
  );
}

export function FacetPill({
  label,
  options,
  selected,
  onChange,
  className,
}: {
  label: string;
  options: FacetPillOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
}) {
  const trigger = React.useRef<HTMLButtonElement>(null);
  const active = selected.length > 0;
  const firstLabel = active ? (options.find((o) => o.value === selected[0])?.label ?? selected[0]) : "";

  return (
    <span
      className={cn(
        "inline-flex h-10 max-w-full shrink-0 items-center rounded-full border transition-colors duration-150 ease-out",
        active ? "border-chart-past bg-surface-raised" : "border-dashed border-border hover:border-chart-past",
        className
      )}
    >
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button
            ref={trigger}
            type="button"
            aria-label={active ? `${label}: ${selected.length} selected. Change` : `Filter by ${label.toLowerCase()}`}
            className={cn(
              "inline-flex h-full min-w-0 cursor-pointer items-center gap-1.5 rounded-full t-body-md transition-colors duration-150 hover:bg-surface-raised data-[state=open]:bg-surface-raised",
              active ? "pr-1 pl-3 text-on-surface" : "px-3 text-body"
            )}
          >
            <span className={active ? "text-muted" : undefined}>{active ? `${label}:` : label}</span>
            {active && (
              <span className="min-w-0 truncate">
                {firstLabel}
                {selected.length > 1 && <span className="text-muted"> +{selected.length - 1}</span>}
              </span>
            )}
            <ChevronDown aria-hidden className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
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
            className={panel}
          >
            <div className="overflow-y-auto overscroll-contain">
              <FacetChecklist label={label} options={options} selected={selected} onChange={onChange} />
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {active && (
        <button
          type="button"
          aria-label={`Clear ${label.toLowerCase()} filter`}
          onClick={() => {
            onChange([]);
            // The pill stays (now empty): keep focus on it rather than dropping to <body>.
            trigger.current?.focus();
          }}
          className="mr-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface hover:text-on-surface"
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      )}
    </span>
  );
}

/** Several facets behind one "More" pill (laptop widths): one popover, one checklist per facet. */
export function MoreFacets({
  facets,
  className,
}: {
  facets: { key: string; label: string; options: FacetPillOption[]; selected: string[]; onChange: (values: string[]) => void }[];
  className?: string;
}) {
  const applied = facets.reduce((n, f) => n + f.selected.length, 0);
  const names = facets.map((f) => f.label.toLowerCase()).join(", ");
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={`More filters: ${names}${applied ? `, ${applied} selected` : ""}`}
          className={cn(
            "inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 t-body-md transition-colors duration-150 ease-out hover:border-chart-past hover:bg-surface-raised data-[state=open]:bg-surface-raised",
            applied ? "border-chart-past bg-surface-raised text-on-surface" : "border-dashed border-border text-body",
            className
          )}
        >
          More
          {applied > 0 && <span className="tnum text-muted">· {applied}</span>}
          <ChevronDown aria-hidden className="size-4 shrink-0 text-muted" strokeWidth={1.5} />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          data-lenis-prevent
          onKeyDown={(e) => e.stopPropagation()}
          aria-label={`Filter by ${names}`}
          className={panel}
        >
          <div className="divide-y divide-border overflow-y-auto overscroll-contain">
            {facets.map((f) => (
              <FacetChecklist key={f.key} label={f.label} options={f.options} selected={f.selected} onChange={f.onChange} />
            ))}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
