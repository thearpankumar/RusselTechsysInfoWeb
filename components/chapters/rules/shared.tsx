"use client";

// Small pieces shared by the business-rules register views (table, cards, timeline, panel).
import * as React from "react";
import type { RuleContext, RuleRecord } from "@/content/types-extra";
import { RULE_CONTEXTS, REGISTER_AS_OF } from "@/content/rules";
import { Marker } from "@/components/ui-rt";
import { dataBg } from "@/lib/dataColors";
import { AS_OF_MAX, AS_OF_MIN, STATE_LABEL, changeBetween, formatDate, isActive, isAsOfDate, pendingQuestions, ruleStateAt, statusLine, todayISO, type RuleStateValue } from "@/lib/rules";
import { cn } from "@/lib/utils";

const noop = () => () => {};

/** Today's date in the browser; the register's review date during prerender and hydration. */
export function useToday(): string {
  return React.useSyncExternalStore(noop, todayISO, () => REGISTER_AS_OF);
}

/**
 * Lifecycle marker: shape and fill, never hue (DESIGN.md). Active = solid highlighted dot; approved = solid grey;
 * under review = dashed ring; draft = dotted ring; suspended = hollow square; retired / superseded = hollow ring (ended).
 */
export function StateMarker({ state, className }: { state: RuleStateValue; className?: string }) {
  const base = "inline-block size-2.5 shrink-0";
  switch (state) {
    case "active":
      return <span aria-hidden className={cn(base, "rounded-full bg-primary", className)} />;
    case "approved":
      return <span aria-hidden className={cn(base, "rounded-full bg-chart-mid", className)} />;
    case "review":
      return <span aria-hidden className={cn(base, "rounded-full border border-dashed border-chart-light", className)} />;
    case "draft":
      return <span aria-hidden className={cn(base, "rounded-full border border-dotted border-chart-mid", className)} />;
    case "suspended":
      return <span aria-hidden className={cn(base, "rounded-[2px] border border-chart-mid", className)} />;
    case "retired":
    case "superseded":
      return <span aria-hidden className={cn(base, "rounded-full border border-chart-mid", className)} />;
    default:
      return <span aria-hidden className={cn(base, "flex items-center", className)}><span className="h-px w-full bg-chart-mid" /></span>;
  }
}

/** Status on `asOf`: marker + Active / Inactive (+ the lifecycle state when inactive), then the period or reason. */
export function StatusLabel({ rule, asOf, withLine = true, extra, className }: { rule: RuleRecord; asOf: string; withLine?: boolean; extra?: React.ReactNode; className?: string }) {
  const state = ruleStateAt(rule, asOf);
  const active = isActive(rule, asOf);
  return (
    <span className={cn("inline-flex min-w-0 flex-col gap-1", className)}>
      <span className={cn("inline-flex items-center gap-2 t-body-md", active ? "text-on-surface" : "text-body")}>
        <StateMarker state={state} />
        {active ? "Active" : "Inactive"}
        {!active && <span className="text-muted">· {STATE_LABEL[state]}</span>}
      </span>
      {withLine && (
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="t-body-sm text-muted">{statusLine(rule, asOf)}</span>
          {extra}
        </span>
      )}
    </span>
  );
}

/** "Under review → Active" between the compare date and the as-of date. */
export function ChangeTag({ rule, vs, asOf, className }: { rule: RuleRecord; vs: string; asOf: string; className?: string }) {
  const c = changeBetween(rule, vs, asOf);
  if (!c) return null;
  return (
    <span className={cn("inline-flex h-6 max-w-full items-center gap-1.5 rounded-full border border-chart-past bg-surface-raised px-2 t-mono-sm whitespace-nowrap text-on-surface", className)}>
      <StateMarker state={c.from} className="size-2" />
      <span className="truncate">{STATE_LABEL[c.from]}</span>
      <span aria-hidden className="text-muted">→</span>
      <span className="sr-only">to</span>
      <StateMarker state={c.to} className="size-2" />
      <span className="truncate">{STATE_LABEL[c.to]}</span>
    </span>
  );
}

/** Hatched marker + "Needs confirmation · Q13" when the rule waits on an open question. */
export function ConfirmFlag({ rule, compact, className }: { rule: RuleRecord; compact?: boolean; className?: string }) {
  const qs = pendingQuestions(rule);
  if (!qs.length) return null;
  return (
    <span className={cn("inline-flex items-center gap-2 t-body-sm text-body", className)} title={`Waits on open question ${qs.join(", ")}`}>
      <Marker shape="hatch" size={8} />
      {compact ? (
        <>
          <span className="sr-only">Needs confirmation:</span>
          {qs.join(" · ")}
        </>
      ) : (
        `Needs confirmation · ${qs.join(" · ")}`
      )}
    </span>
  );
}

/** Context dot + label. `size="sm"` is the dense row form. */
export function ContextTag({ ctx, tokens = [], size = "sm", className }: { ctx: RuleContext; tokens?: string[]; size?: "sm" | "md"; className?: string }) {
  const c = RULE_CONTEXTS[ctx];
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 text-body", size === "sm" ? "t-body-sm" : "t-body-md", className)}>
      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dataBg[c.colour])} />
      <span className="truncate">
        <Highlight text={c.label} tokens={tokens} />
      </span>
    </span>
  );
}

export interface Domain {
  start: number;
  end: number;
}

export const pct = (day: number, d: Domain) => Math.min(100, Math.max(0, ((day - d.start) / (d.end - d.start)) * 100));

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Wrap search matches in <mark>. */
export function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  const re = React.useMemo(() => (tokens.length ? new RegExp(`(${tokens.map(escapeRe).join("|")})`, "gi") : null), [tokens]);
  if (!re) return <>{text}</>;
  const parts = text.split(re);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-primary/20 px-0.5 text-on-surface">
            {p}
          </mark>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
}

/** Dashed "Sample" tag for illustrative metadata (state histories, contexts, owners). */
export function SampleTag({ className, children = "Sample metadata" }: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      title="State histories, contexts and owners are illustrative until Rossell confirms them."
      className={cn("inline-flex h-6 shrink-0 items-center rounded-full border border-dashed border-chart-mid px-2 t-mono-sm whitespace-nowrap text-muted", className)}
    >
      {children}
    </span>
  );
}

/** Lifecycle legend (marker + label), for the timeline and the panel's history. */
export function StateLegend({ className }: { className?: string }) {
  const states: RuleStateValue[] = ["draft", "review", "approved", "active", "suspended", "superseded"];
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-2", className)} aria-label="Lifecycle states">
      {states.map((s) => (
        <li key={s} className="inline-flex items-center gap-2 t-body-sm text-body">
          <StateMarker state={s} />
          {s === "superseded" ? "Retired or superseded" : STATE_LABEL[s]}
        </li>
      ))}
    </ul>
  );
}

/** True while the element's content is wider than the element (it scrolls sideways). */
export function useOverflowX<T extends HTMLElement>(ref: React.RefObject<T | null>): boolean {
  const [over, setOver] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ResizeObserver also fires once right after observe(), which sets the initial value.
    const ro = new ResizeObserver(() => setOver(el.scrollWidth > el.clientWidth + 1));
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [ref]);
  return over;
}

/** Keep ←/→ inside a sideways scroller (they scroll it) instead of switching chapter. */
export const keepArrows = (e: React.KeyboardEvent) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.stopPropagation();
};

/** Keys a date field keeps: ←/→ move between its segments, Esc closes its picker (neither should reach the page). */
export const keepDateKeys = (e: React.KeyboardEvent) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Escape") e.stopPropagation();
};

/**
 * Native date input (typing and the picker both work) that reads like the rest of the site at rest: "12 Nov 2026".
 * While focused, the native segments show so the date can be typed. Styled by the `date-field` utility (app/theme.css).
 */
export function DateField({
  id,
  value,
  onChange,
  inputRef,
  label,
}: {
  id: string;
  value: string;
  onChange: (iso: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /** Accessible name when there is no visible <label for>. */
  label?: string;
}) {
  return (
    <span className="relative inline-flex items-center">
      <input
        id={id}
        ref={inputRef}
        type="date"
        value={value}
        min={AS_OF_MIN}
        max={AS_OF_MAX}
        aria-label={label}
        onChange={(e) => isAsOfDate(e.target.value) && onChange(e.target.value)}
        onKeyDown={keepDateKeys}
        // A click anywhere on the date opens the picker (typing still works once focused).
        onClick={(e) => {
          try {
            e.currentTarget.showPicker?.();
          } catch {
            /* not allowed here (e.g. in a cross-origin frame): the field still takes typing */
          }
        }}
        className="peer date-field w-36 cursor-pointer bg-transparent t-mono-sm text-transparent outline-none focus:text-on-surface"
      />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center t-body-md whitespace-nowrap text-on-surface tnum peer-focus:hidden">
        {formatDate(value)}
      </span>
    </span>
  );
}

/** "Edited" tag: this rule's dates were changed in this browser (they show in exports, highlighted). */
export function EditedTag({ className }: { className?: string }) {
  return (
    <span
      title="Dates edited in this browser"
      className={cn("inline-flex h-6 shrink-0 items-center rounded-full border border-chart-past bg-surface-raised px-2 t-mono-sm whitespace-nowrap text-on-surface", className)}
    >
      Edited
    </span>
  );
}
