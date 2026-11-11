"use client";

// Supplier → harness part connection diagram (sankey-style 1px curved data-* connectors at ~40%).
import * as React from "react";
import { harnessParts, type HarnessPartId } from "@/content/materials";
import { supplierGroupOf, type SupplierProfile } from "@/content/suppliers";
import { cn } from "@/lib/utils";
import { useSize } from "../anatomy/shared";
import { GROUP_STYLE } from "./groups";

export const shortName = (n: string) => n.replace(/\s*\(.*\)\s*$/, "");
const PITCH = 44;

export function ConnectionDiagram({ suppliers, onSupplier, onPart }: { suppliers: SupplierProfile[]; onSupplier: (id: string) => void; onPart: (id: HarnessPartId) => void }) {
  const [ref, { width }] = useSize<HTMLDivElement>();
  const [focus, setFocus] = React.useState<{ kind: "s" | "p"; id: string } | null>(null);
  const linked = suppliers.filter((s) => s.harnessPartIds.length > 0);
  const n = Math.max(1, linked.length);
  const H = Math.max(n, harnessParts.length) * PITCH;
  const leftW = Math.max(128, width * 0.36);
  const rightW = Math.max(120, width * 0.3);
  const x1 = leftW + 8;
  const x2 = width - rightW - 8;
  const ly = (i: number) => (i + 0.5) * (H / n);
  const ry = (j: number) => (j + 0.5) * (H / harnessParts.length);

  const isOn = (sid: string, pid: string) => !focus || (focus.kind === "s" ? focus.id === sid : focus.id === pid);
  const touchesS = (s: SupplierProfile) => !focus || (focus.kind === "s" ? focus.id === s.id : s.harnessPartIds.includes(focus.id as HarnessPartId));
  const touchesP = (pid: string) => !focus || (focus.kind === "p" ? focus.id === pid : linked.find((s) => s.id === focus.id)?.harnessPartIds.includes(pid as HarnessPartId));

  return (
    <div ref={ref} className="relative w-full" style={{ height: H }} onMouseLeave={() => setFocus(null)}>
      {width > 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0" width={width} height={H}>
          {linked.map((s, i) =>
            s.harnessPartIds.map((pid) => {
              const j = harnessParts.findIndex((p) => p.id === pid);
              const ya = ly(i);
              const yb = ry(j);
              const mx = (x1 + x2) / 2;
              const on = isOn(s.id, pid);
              return (
                <path
                  key={`${s.id}-${pid}`}
                  d={`M${x1} ${ya} C ${mx} ${ya}, ${mx} ${yb}, ${x2} ${yb}`}
                  fill="none"
                  strokeWidth={1}
                  className={cn(GROUP_STYLE[supplierGroupOf(s)].stroke, "transition-opacity duration-150")}
                  style={{ opacity: focus ? (on ? 0.9 : 0.06) : 0.4 }}
                />
              );
            })
          )}
        </svg>
      )}
      <ul className="absolute top-0 left-0" style={{ width: leftW }}>
        {linked.map((s, i) => (
          <li key={s.id} className="absolute inset-x-0" style={{ top: ly(i) - 18 }}>
            <button
              type="button"
              onClick={() => onSupplier(s.id)}
              onMouseEnter={() => setFocus({ kind: "s", id: s.id })}
              onFocus={() => setFocus({ kind: "s", id: s.id })}
              className={cn(
                "flex h-9 w-full cursor-pointer items-center gap-2 rounded-full border border-border px-3 text-left t-body-sm text-on-surface transition-[opacity,background-color,border-color] duration-150 hover:border-chart-past hover:bg-surface-raised",
                !touchesS(s) && "opacity-30"
              )}
            >
              <span aria-hidden className={cn("size-2 shrink-0 rounded-full", GROUP_STYLE[supplierGroupOf(s)].bg)} />
              <span className="truncate">{shortName(s.name)}</span>
            </button>
          </li>
        ))}
      </ul>
      <ul className="absolute top-0 right-0" style={{ width: rightW }}>
        {harnessParts.map((p, j) => (
          <li key={p.id} className="absolute inset-x-0" style={{ top: ry(j) - 18 }}>
            <button
              type="button"
              onClick={() => onPart(p.id)}
              onMouseEnter={() => setFocus({ kind: "p", id: p.id })}
              onFocus={() => setFocus({ kind: "p", id: p.id })}
              className={cn(
                "flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 text-left t-body-sm text-on-surface transition-[opacity,background-color,border-color] duration-150 hover:border-chart-past hover:bg-surface-raised",
                !touchesP(p.id) && "opacity-30"
              )}
            >
              <span className="t-mono-sm text-muted">{p.index}</span>
              <span className="truncate">{p.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
