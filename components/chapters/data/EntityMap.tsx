"use client";

import * as React from "react";
import { dataDictionary, entityGroupOf, entityMap } from "@/content/dataDictionary";
import { dataBg } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { entityColor } from "./shared";

const NODE_H = 96;

const fieldCount = (entities: string[]) => dataDictionary.filter((d) => entities.includes(d.entity)).length;

/** Entity relationship mini-map: the Customer → … → Invoice chain as workflow-node cards on a dot grid, laid out as a snake. */
export function EntityMap({ selected, onSelect }: { selected: string | null; onSelect: (nodeId: string | null) => void }) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const [w, setW] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    setW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const cols = w >= 960 ? 5 : w >= 600 ? 3 : 2;
  const small = w < 600;
  const PAD = small ? 16 : 24;
  const GAP_X = small ? 24 : 48;
  const GAP_Y = small ? 32 : 48;
  const nodeW = w ? (w - PAD * 2 - GAP_X * (cols - 1)) / cols : 0;
  const rows = Math.ceil(entityMap.length / cols);
  const h = PAD * 2 + rows * NODE_H + (rows - 1) * GAP_Y;

  const pos = entityMap.map((_, i) => {
    const row = Math.floor(i / cols);
    const inRow = i % cols;
    const col = row % 2 === 0 ? inRow : cols - 1 - inRow;
    return { x: PAD + col * (nodeW + GAP_X), y: PAD + row * (NODE_H + GAP_Y), row };
  });

  const edges = entityMap.slice(0, -1).map((n, i) => {
    const a = pos[i];
    const b = pos[i + 1];
    let d: string;
    if (a.row === b.row) {
      const y = a.y + NODE_H / 2;
      d = b.x > a.x ? `M ${a.x + nodeW} ${y} L ${b.x - 6} ${y}` : `M ${a.x} ${y} L ${b.x + nodeW + 6} ${y}`;
    } else {
      const x = a.x + nodeW / 2;
      d = `M ${x} ${a.y + NODE_H} L ${x} ${b.y - 6}`;
    }
    const on = selected === n.id || selected === entityMap[i + 1].id;
    return { key: n.id, d, on };
  });

  return (
    <div ref={wrap} className="dot-grid relative overflow-hidden rounded-xl border border-border bg-canvas" style={{ height: w ? h : undefined }}>
      {w > 0 && (
        <>
          <svg aria-hidden className="pointer-events-none absolute inset-0" width={w} height={h}>
            <defs>
              <marker id="em-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 z" className="fill-chart-mid" />
              </marker>
              <marker id="em-arrow-hi" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 z" className="fill-primary" />
              </marker>
            </defs>
            {edges.map((e) => (
              <path
                key={e.key}
                d={e.d}
                fill="none"
                strokeWidth={1}
                markerEnd={`url(#${e.on ? "em-arrow-hi" : "em-arrow"})`}
                className={e.on ? "stroke-primary" : "stroke-chart-mid"}
              />
            ))}
          </svg>
          <ol aria-label="Entity chain, from customer to invoice">
            {entityMap.map((n, i) => {
              const p = pos[i];
              const active = selected === n.id;
              const group = entityGroupOf(n.entities[0]);
              const next = entityMap[i + 1];
              return (
                <li key={n.id} className="absolute" style={{ left: p.x, top: p.y, width: nodeW, height: NODE_H }}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onSelect(active ? null : n.id)}
                    title={next && n.next ? `${n.label} ${n.next} ${next.label}` : n.label}
                    className={cn(
                      "relative flex size-full cursor-pointer flex-col justify-center overflow-hidden rounded-md border bg-surface py-3 pr-3 pl-4 text-left transition-colors duration-150 ease-out",
                      active ? "border-primary bg-surface-raised" : "border-border hover:border-chart-past hover:bg-surface-raised",
                      selected && !active && "opacity-60 hover:opacity-100"
                    )}
                  >
                    <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.75", dataBg[entityColor(n.entities[0])])} />
                    <span className="truncate t-mono-sm text-muted">
                      {group?.label ?? "Entity"}
                    </span>
                    <span className="mt-1 truncate t-body-md text-on-surface">{n.label}</span>
                    <span className="mt-1 truncate t-body-sm text-muted">
                      {fieldCount(n.entities)} fields
                      {n.entities.length > 1 ? ` · ${n.entities.length} entities` : ""}
                    </span>
                    {next && n.next && <span className="sr-only">{`, ${n.next} ${next.label}`}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
