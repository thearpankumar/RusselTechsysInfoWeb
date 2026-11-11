"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { supplierFollowUpLoop as loop } from "@/content/lifecycle";
import { CardNested, Cite, ConfidenceTag } from "@/components/ui-rt";

const N = loop.steps.length;
const R = 36;
const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
const pt = (i: number, r = R) => [50 + r * Math.cos(angle(i)), 50 + r * Math.sin(angle(i))] as const;

function arc(i: number) {
  const pad = 0.32; // radians kept clear around each node
  const a0 = angle(i) + pad;
  const a1 = angle(i + 1) - pad;
  const [x0, y0] = [50 + R * Math.cos(a0), 50 + R * Math.sin(a0)];
  const [x1, y1] = [50 + R * Math.cos(a1), 50 + R * Math.sin(a1)];
  return `M${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
}

/** The supplier follow-up loop (deck p.22) as a cycle, with what it costs. */
export function FollowUpLoop() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        {/* Circle (sm and up) */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-xl sm:block">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <marker id="loop-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0 0 L8 4 L0 8 z" className="fill-chart-mid" />
              </marker>
            </defs>
            {loop.steps.map((_, i) => (
              <path key={i} d={arc(i)} fill="none" className="stroke-chart-mid" strokeWidth={0.3} strokeDasharray="2.4 1.2 0.4 1.2" markerEnd="url(#loop-arrow)" />
            ))}
          </svg>
          <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center">
            <RefreshCw className="size-5 text-muted" strokeWidth={1.5} aria-hidden />
            <span className="t-mono-sm text-muted">repeats daily</span>
          </div>
          <ol>
            {loop.steps.map((s, i) => {
              const [x, y] = pt(i);
              return (
                <li key={s} className="absolute w-40 -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-surface p-3 lg:w-44" style={{ left: `${x}%`, top: `${y}%` }}>
                  <span className="t-mono-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block t-body-sm text-on-surface">{s}</span>
                </li>
              );
            })}
          </ol>
        </div>
        {/* List (mobile) */}
        <ol className="flex flex-col gap-2 sm:hidden">
          {loop.steps.map((s, i) => (
            <li key={s} className="rounded-md border border-border bg-surface p-3">
              <span className="t-mono-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-1 block t-body-sm text-on-surface">{s}</span>
            </li>
          ))}
          <li className="flex items-center gap-2 self-center t-mono-sm text-muted">
            <RefreshCw className="size-4" strokeWidth={1.5} aria-hidden /> back to 01
          </li>
        </ol>
      </div>
      <div className="flex flex-col gap-4 lg:col-span-5">
        <p className="t-label-caps text-muted">What the loop costs</p>
        {loop.consequences.map((c) => (
          <CardNested key={c.title}>
            <p className="t-body-lg text-on-surface">{c.title}</p>
            <p className="mt-1 t-body-md text-body">{c.text}</p>
          </CardNested>
        ))}
        <p className="t-body-md text-muted">{loop.scaleNote}</p>
        <div className="flex flex-wrap items-center gap-2">
          <ConfidenceTag confidence={loop.confidence} />
          <Cite ids={loop.sources} />
        </div>
      </div>
    </div>
  );
}
