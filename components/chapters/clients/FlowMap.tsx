"use client";

import * as React from "react";
import { ConfidenceTag } from "@/components/ui-rt/ConfidenceTag";
import { dataBg, dataStroke } from "@/lib/dataColors";
import { DOMAIN_COLOR, FLOW_COLUMNS, flowLinks, flowNodes, type FlowNode } from "@/content/clients";
import { cn } from "@/lib/utils";
import { useWidth } from "../financials/shared";

const ROW_H = 84;
const NODE_H = 64;
const MIN_W = 960;

/** Everything connected to `id`, walking links both upstream and downstream. */
function connected(id: string): Set<string> {
  const out = new Set([id]);
  const walk = (cur: string, dir: "up" | "down") => {
    for (const l of flowLinks) {
      const [a, b] = dir === "down" ? [l.from, l.to] : [l.to, l.from];
      if (a === cur && !out.has(b)) {
        out.add(b);
        walk(b, dir);
      }
    }
  };
  walk(id, "down");
  walk(id, "up");
  return out;
}

/**
 * Connection (sankey-style) diagram: domain → client → programs → value.
 * 1px curved data-* connectors at ~40% opacity between surface rows; hover/focus a node to trace its paths.
 */
export function FlowMap({ onNodeClick }: { onNodeClick: (n: FlowNode) => void }) {
  const [ref, measured] = useWidth<HTMLDivElement>();
  const [hover, setHover] = React.useState<string | null>(null);
  const width = Math.max(MIN_W, measured);
  const cols = FLOW_COLUMNS.length;
  const gap = 72;
  const nodeW = (width - gap * (cols - 1)) / cols;
  const maxRows = Math.max(...[0, 1, 2, 3].map((c) => flowNodes.filter((n) => n.col === c).length));
  const H = maxRows * ROW_H;

  const pos = React.useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    for (let c = 0; c < cols; c++) {
      const list = flowNodes.filter((n) => n.col === c);
      list.forEach((n, i) => m.set(n.id, { x: c * (nodeW + gap), y: (i + 0.5) * (H / list.length) }));
    }
    return m;
  }, [cols, nodeW, H]);

  const lit = hover ? connected(hover) : null;

  return (
    <div ref={ref} className="w-full">
      <div className="overflow-x-auto pb-2" data-lenis-prevent-wheel>
        <div className="relative" style={{ width, height: H + 48 }}>
          <div className="flex" style={{ gap }}>
            {FLOW_COLUMNS.map((c, i) => (
              <p key={c} className="t-label-caps text-muted" style={{ width: nodeW }}>
                <span className="mr-3 t-mono-sm tracking-normal">{String(i + 1).padStart(2, "0")}</span>
                {c}
              </p>
            ))}
          </div>
          <svg width={width} height={H} className="absolute top-12 left-0" aria-hidden>
            {flowLinks.map((l) => {
              const a = pos.get(l.from)!;
              const b = pos.get(l.to)!;
              const x1 = a.x + nodeW;
              const x2 = b.x;
              const mx = (x1 + x2) / 2;
              const on = lit ? lit.has(l.from) && lit.has(l.to) : false;
              return (
                <path
                  key={`${l.from}-${l.to}`}
                  d={`M${x1},${a.y} C${mx},${a.y} ${mx},${b.y} ${x2},${b.y}`}
                  fill="none"
                  strokeWidth={1}
                  className={cn(dataStroke[DOMAIN_COLOR[l.domain]], "transition-opacity duration-150")}
                  style={{ opacity: lit ? (on ? 1 : 0.12) : 0.4 }}
                />
              );
            })}
          </svg>
          {flowNodes.map((n) => {
            const p = pos.get(n.id)!;
            const dim = lit && !lit.has(n.id);
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => onNodeClick(n)}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover(null)}
                className={cn(
                  "absolute flex cursor-pointer flex-col justify-center gap-1 rounded-md border bg-surface px-3 text-left transition-[opacity,border-color] duration-150 ease-out hover:border-chart-mid",
                  lit?.has(n.id) ? "border-chart-mid" : "border-border",
                  dim && "opacity-40"
                )}
                style={{ left: p.x, top: 48 + p.y - NODE_H / 2, width: nodeW, height: NODE_H }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {n.domain && <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dataBg[DOMAIN_COLOR[n.domain]])} />}
                  <span className="truncate t-body-md text-on-surface">{n.label}</span>
                </span>
                {(n.sub || (n.confidence !== "reported" && n.confidence !== "session")) && (
                  <span className="flex min-w-0 items-center gap-2">
                    {n.sub && <span className="min-w-0 truncate t-body-sm text-muted">{n.sub}</span>}
                    {n.confidence !== "reported" && n.confidence !== "session" && <ConfidenceTag confidence={n.confidence} className="ml-auto" />}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
