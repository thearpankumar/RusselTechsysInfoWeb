"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabTrackOption<V extends string> {
  value: V;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface TabTrackProps<V extends string> {
  options: TabTrackOption<V>[];
  value: V;
  onChange: (value: V) => void;
  /** Accessible name for the group. */
  label: string;
  size?: "md" | "sm";
  className?: string;
}

/** Segmented control: surface pill track (6px padding), active tab = white. For switching views, never data. */
export function TabTrack<V extends string>({ options, value, onChange, label, size = "md", className }: TabTrackProps<V>) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    e.stopPropagation(); // don't trigger chapter navigation
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };
  return (
    <div role="tablist" aria-label={label} className={cn("inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full bg-surface p-1.5", className)}>
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full whitespace-nowrap transition-colors duration-150 ease-out [&_svg]:size-5 [&_svg]:stroke-[1.5]",
              size === "md" ? "h-12 px-5 t-body-lg" : "h-10 px-4 t-body-md",
              active ? "bg-primary text-on-primary" : "text-body hover:bg-surface-raised hover:text-on-surface"
            )}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
