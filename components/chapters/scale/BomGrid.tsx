"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui-rt/Button";
import { ConfidenceTag } from "@/components/ui-rt/ConfidenceTag";
import { Legend } from "@/components/ui-rt/Legend";
import { illustrativeBom, buildableCount } from "@/content/materials";
import { cn } from "@/lib/utils";
import { FactMeta } from "../financials/shared";

/** Stock on hand covers this many bundles on every line (illustrative). */
const COVER = 12;
const lines = illustrativeBom.lines;
const fullStock: Record<number, number> = Object.fromEntries(lines.map((l) => [l.line, l.qtyPerFg * COVER]));

/**
 * "96 lines, all or nothing": click any line to mark it short. Buildable bundles drop to 0
 * and the other 95 lines turn idle (hatched). Reset restores full stock.
 */
export function BomGrid() {
  const [short, setShort] = React.useState<Set<number>>(() => new Set());
  const [focus, setFocus] = React.useState<number>(lines[0].line);

  const onHand = React.useMemo(() => {
    const m = { ...fullStock };
    short.forEach((n) => {
      const l = lines.find((x) => x.line === n)!;
      m[n] = Math.max(0, l.qtyPerFg - 1);
    });
    return m;
  }, [short]);
  const builds = buildableCount(onHand);
  const anyShort = short.size > 0;
  const idle = anyShort ? lines.length - short.size : 0;
  const f = lines.find((l) => l.line === focus)!;

  const toggle = (n: number) => {
    setFocus(n);
    setShort((s) => {
      const next = new Set(s);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div>
        <ul className="grid grid-cols-8 gap-1 sm:grid-cols-12" aria-label={`Bill of materials for ${illustrativeBom.fgPartNo}: ${lines.length} lines`}>
          {lines.map((l) => {
            const isShort = short.has(l.line);
            const isIdle = anyShort && !isShort;
            return (
              <li key={l.line}>
                <button
                  type="button"
                  aria-pressed={isShort}
                  aria-label={`Line ${l.line}: ${l.description}. ${isShort ? "Short" : isIdle ? "In stock, idle" : "In stock"}. Click to ${isShort ? "restore" : "mark short"}.`}
                  title={`${String(l.line).padStart(2, "0")} · ${l.description}`}
                  onClick={() => toggle(l.line)}
                  onMouseEnter={() => setFocus(l.line)}
                  onFocus={() => setFocus(l.line)}
                  className={cn(
                    "flex aspect-square w-full cursor-pointer items-center justify-center rounded-sm border t-mono-sm tnum transition-colors duration-150 ease-out",
                    isShort
                      ? "border-primary bg-primary text-on-primary"
                      : isIdle
                        ? "hatch border-border text-muted"
                        : "border-border bg-surface-raised text-body hover:border-chart-mid hover:text-on-surface",
                    focus === l.line && !isShort && "border-chart-mid"
                  )}
                >
                  {String(l.line).padStart(2, "0")}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Legend
            items={[
              { label: "In stock", tone: "past", count: anyShort ? undefined : lines.length },
              { label: "Short", tone: "primary", count: short.size || undefined },
              { label: "Idle, waiting", tone: "mid", shape: "hatch", count: idle || undefined },
            ]}
          />
          <Button size="sm" icon={<RotateCcw />} onClick={() => setShort(new Set())} disabled={!anyShort}>
            Reset
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="rounded-lg bg-surface-raised p-6" aria-live="polite">
          <p className="t-mono-sm text-muted">Bundles buildable · {illustrativeBom.fgPartNo}</p>
          <p className="mt-3 flex items-baseline gap-2">
            <span className={cn("t-metric-xl tnum transition-colors duration-150", builds === 0 ? "text-muted" : "text-on-surface")}>{builds}</span>
            <span className="t-body-lg text-muted">of {COVER}</span>
          </p>
          <p className="mt-3 t-body-lg text-on-surface">
            {anyShort
              ? `${short.size} short line${short.size > 1 ? "s" : ""} stop${short.size > 1 ? "" : "s"} the bundle. ${idle} lines of stock sit idle.`
              : "Every line in stock: the bundle can be built."}
          </p>
          <p className="mt-1 t-body-md text-muted">Stock shown covers {COVER} bundles on every line (illustrative).</p>
        </div>

        <div className="border-t border-border pt-6">
          <p className="t-mono-sm text-muted">Line {String(f.line).padStart(2, "0")} · {f.partNo}</p>
          <p className="mt-2 t-body-lg text-on-surface">{f.description}</p>
          <p className="mt-1 t-body-md text-muted">
            {f.qtyPerFg} {f.uom} per bundle · {short.has(f.line) ? "marked short" : "in stock"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <FactMeta sources={f.sources} confidence={f.confidence} />
            {f.sample && <span className="t-body-sm text-muted">Sample line, not Rossell data</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
          <span className="t-body-sm text-body">Lines 1–4, the line count and the part number come from the BOM master reviewed in working sessions; lines 5–96 are illustrative.</span>
          <ConfidenceTag confidence="session" />
          <FactMeta sources={illustrativeBom.sources} />
        </div>
      </div>
    </div>
  );
}
