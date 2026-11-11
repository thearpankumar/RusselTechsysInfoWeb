"use client";

// Small helpers shared by builder B's chapters (Financials, Growth, Clients, Competition, Scale).
import * as React from "react";
import { Cite } from "@/components/ui-rt/Cite";
import { ConfidenceTag } from "@/components/ui-rt/ConfidenceTag";
import { DetailOverlay } from "@/components/ui-rt/DetailOverlay";
import { KeyValueRows, type KeyValueRow } from "@/components/ui-rt/KeyValueRows";
import type { Confidence } from "@/content/types";
import { useSearchOpen } from "@/lib/searchIndex";
import { cn } from "@/lib/utils";
import { Stat, type StatProps } from "@/components/ui-rt/Stat";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Cite chip + confidence tag (tag hidden when reported). */
export function FactMeta({ sources, confidence, className }: { sources: string[]; confidence?: Confidence; className?: string }) {
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-2", className)}>
      <Cite ids={sources} />
      {confidence && <ConfidenceTag confidence={confidence} />}
    </span>
  );
}

/** ₹ Cr formatter: 485.2 → "485.2", 1261.5 → "1,261.5". */
export const fmtNum = (v: number, digits = 1) =>
  v.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: digits });

export interface InfoContent {
  eyebrow?: string;
  title: string;
  description?: string;
  rows?: KeyValueRow[];
  /** Paragraph(s) under the rows (method, caveats). */
  notes?: { label?: string; text: string }[];
  sources: string[];
  confidence?: Confidence;
  children?: React.ReactNode;
}

/** Detail overlay body for a fact: rows, notes, sources. */
export function InfoOverlay({
  content,
  open,
  onOpenChange,
  index,
  total,
  onPrev,
  onNext,
  size,
}: {
  content: InfoContent | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  index?: number;
  total?: number;
  onPrev?: () => void;
  onNext?: () => void;
  size?: "md" | "lg";
}) {
  return (
    <DetailOverlay
      open={open && !!content}
      onOpenChange={onOpenChange}
      eyebrow={content?.eyebrow}
      title={content?.title ?? ""}
      description={content?.description}
      index={index}
      total={total}
      onPrev={onPrev}
      onNext={onNext}
      size={size}
    >
      {content && (
        <div className="flex flex-col gap-8">
          {content.children}
          {content.rows && content.rows.length > 0 && <KeyValueRows rows={content.rows} />}
          {content.notes?.map((n, i) => (
            <div key={i} className="border-t border-border pt-6">
              {n.label && <p className="mb-2 t-label-caps text-muted">{n.label}</p>}
              <p className="t-body-md text-body">{n.text}</p>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <span className="t-mono-sm text-muted">Sources</span>
            <FactMeta sources={content.sources} confidence={content.confidence} />
            {content.confidence === "reported" && <ConfidenceTag confidence="reported" showReported />}
          </div>
        </div>
      )}
    </DetailOverlay>
  );
}

/**
 * Overlay state for a list of entities with prev/next, opened by click or by the ⌘K palette (type).
 * Returns the current index and handlers.
 */
export function useOverlayList<T extends { id: string }>(items: T[], searchType?: string) {
  const [index, setIndex] = React.useState<number | null>(null);
  const openId = React.useCallback(
    (id: string) => {
      const i = items.findIndex((x) => x.id === id);
      if (i >= 0) setIndex(i);
    },
    [items]
  );
  useSearchOpen(searchType ?? "__none__", openId);
  const n = items.length;
  return {
    index,
    item: index === null ? null : items[index],
    open: index !== null,
    openId,
    openAt: setIndex,
    close: () => setIndex(null),
    onOpenChange: (o: boolean) => {
      if (!o) setIndex(null);
    },
    prev: n > 1 ? () => setIndex((i) => (i === null ? i : (i - 1 + n) % n)) : undefined,
    next: n > 1 ? () => setIndex((i) => (i === null ? i : (i + 1) % n)) : undefined,
    total: n,
  };
}

/** Small section heading inside a chapter: eyebrow + headline-md + optional lead. */
export function SectionHead({ eyebrow, title, lead, action, className }: { eyebrow?: string; title: string; lead?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-3 t-label-caps text-muted">{eyebrow}</p>}
        <h3 className="t-headline-md text-on-surface">{title}</h3>
        {lead && <p className="mt-2 t-body-md text-muted">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/** Element width via ResizeObserver (0 until measured). */
export function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [w, setW] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setW(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/**
 * Stat that can be a door without nesting buttons: when onClick is set, `meta` (Cite chips are buttons)
 * renders below the clickable figure instead of inside it.
 */
export function DoorStat({ meta, ...props }: StatProps) {
  if (!props.onClick) return <Stat {...props} meta={meta} />;
  return (
    <div className="min-w-0">
      <Stat {...props} />
      {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
    </div>
  );
}

/**
 * Overview tile that links to another section (or chapter): label, figure, one line, "Open" hint.
 * Figures must come from content/*.ts so they match the section they point to.
 */
export function GlanceLink({ href, label, value, unit, prefix, sub, cta = "Open" }: { href: string; label: string; value: string; unit?: string; prefix?: string; sub?: string; cta?: string }) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-4 rounded-lg border border-border bg-surface p-6 outline-none transition-colors duration-150 ease-out hover:border-chart-past hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="t-label-caps text-muted">{label}</span>
      <span className="flex items-baseline gap-1">
        {prefix && <span className="t-body-lg text-muted">{prefix}</span>}
        <span className="t-headline-md tnum text-on-surface">{value}</span>
        {unit && <span className="t-body-lg text-muted">{unit}</span>}
      </span>
      {sub && <span className="t-body-sm text-body">{sub}</span>}
      <span className="mt-auto inline-flex items-center gap-2 t-body-sm text-muted group-hover:text-on-surface">
        {cta}
        <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
      </span>
    </Link>
  );
}
