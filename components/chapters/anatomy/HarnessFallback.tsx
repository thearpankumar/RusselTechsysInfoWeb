"use client";

// Static exploded diagram: used for reduced motion, no WebGL, and while the 3D bundle loads.
import * as React from "react";
import { harnessParts, type HarnessPartId } from "@/content/materials";
import { cn } from "@/lib/utils";

// Anchor on the harness (where the part lives) → exploded glyph position.
const LAYOUT: Record<HarnessPartId, { at: [number, number]; to: [number, number]; glyph: "bar" | "circle" | "pins" | "cone" | "ring" | "tab" | "band" | "sleeve" | "mesh" }> = {
  wire: { at: [250, 214], to: [250, 300], glyph: "bar" },
  connector: { at: [726, 110], to: [740, 40], glyph: "circle" },
  contact: { at: [744, 214], to: [770, 290], glyph: "pins" },
  backshell: { at: [690, 128], to: [610, 50], glyph: "cone" },
  heatshrink: { at: [100, 214], to: [70, 120], glyph: "cone" },
  sleeving: { at: [180, 210], to: [170, 120], glyph: "sleeve" },
  braid: { at: [560, 208], to: [530, 290], glyph: "mesh" },
  clamp: { at: [340, 214], to: [360, 320], glyph: "tab" },
  splice: { at: [560, 288], to: [470, 360], glyph: "band" },
  marker: { at: [660, 214], to: [660, 340], glyph: "band" },
  lacing: { at: [430, 206], to: [420, 120], glyph: "ring" },
  grommet: { at: [380, 210], to: [300, 120], glyph: "ring" },
};

function Glyph({ kind, x, y, active }: { kind: (typeof LAYOUT)[HarnessPartId]["glyph"]; x: number; y: number; active: boolean }) {
  const cls = cn("transition-colors duration-150", active ? "fill-primary stroke-primary" : "fill-chart-past stroke-chart-mid");
  switch (kind) {
    case "bar":
      return <rect x={x - 50} y={y - 5} width={100} height={10} rx={5} className={cls} />;
    case "circle":
      return (
        <g className={cls}>
          <circle cx={x} cy={y} r={18} />
          <circle cx={x} cy={y} r={11} className="fill-background" />
        </g>
      );
    case "pins":
      return (
        <g className={cls}>
          {[-12, -4, 4, 12].map((d) => (
            <rect key={d} x={x + d - 2} y={y - 12} width={4} height={24} rx={2} />
          ))}
        </g>
      );
    case "cone":
      return <path d={`M${x - 18} ${y - 14} L${x + 18} ${y - 8} L${x + 18} ${y + 8} L${x - 18} ${y + 14} Z`} className={cls} />;
    case "ring":
      return <ellipse cx={x} cy={y} rx={9} ry={18} className={cn(cls, "fill-none")} strokeWidth={5} />;
    case "tab":
      return (
        <g className={cls}>
          <circle cx={x} cy={y} r={12} className="fill-none" strokeWidth={4} />
          <rect x={x - 4} y={y + 10} width={8} height={18} rx={2} />
        </g>
      );
    case "band":
      return <rect x={x - 14} y={y - 10} width={28} height={20} rx={4} className={cls} />;
    case "sleeve":
      return <rect x={x - 40} y={y - 11} width={80} height={22} rx={11} className={cls} />;
    case "mesh":
      return (
        <g className={cls}>
          <rect x={x - 36} y={y - 9} width={72} height={18} rx={9} />
          {[-24, -12, 0, 12, 24].map((d) => (
            <path key={d} d={`M${x + d - 6} ${y - 9} L${x + d + 6} ${y + 9}`} className="fill-none stroke-background" />
          ))}
        </g>
      );
  }
}

export function HarnessFallback({ onSelect, activeId, onHover, className }: { onSelect: (id: HarnessPartId) => void; activeId?: HarnessPartId | null; onHover?: (id: HarnessPartId | null) => void; className?: string }) {
  return (
    <svg viewBox="0 0 800 400" className={cn("h-auto w-full", className)} role="group" aria-label="Exploded wire harness: twelve numbered parts">
      {/* assembled harness skeleton */}
      <g className="fill-none stroke-chart-past" strokeLinecap="round">
        <path d="M80 214 C 200 206, 320 222, 470 212" strokeWidth={14} />
        <path d="M470 212 C 560 190, 640 140, 716 112" strokeWidth={8} />
        <path d="M470 212 C 580 214, 660 210, 736 214" strokeWidth={8} />
        <path d="M470 212 C 540 240, 600 300, 676 324" strokeWidth={8} />
      </g>
      <g className="fill-chart-past">
        <rect x={52} y={198} width={28} height={32} rx={4} />
        <rect x={716} y={96} width={28} height={30} rx={4} transform="rotate(-20 730 111)" />
        <rect x={736} y={199} width={28} height={30} rx={4} />
        <rect x={676} y={310} width={28} height={30} rx={4} transform="rotate(18 690 325)" />
      </g>
      {harnessParts.map((p) => {
        const L = LAYOUT[p.id];
        const active = activeId === p.id;
        return (
          <g
            key={p.id}
            role="button"
            tabIndex={0}
            aria-label={p.name}
            className="cursor-pointer outline-none"
            onClick={() => onSelect(p.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(p.id);
              }
            }}
            onMouseEnter={() => onHover?.(p.id)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(p.id)}
            onBlur={() => onHover?.(null)}
          >
            <line x1={L.at[0]} y1={L.at[1]} x2={L.to[0]} y2={L.to[1]} strokeDasharray="3 4" className={cn(active ? "stroke-primary" : "stroke-chart-past")} />
            <circle cx={L.at[0]} cy={L.at[1]} r={3} className={active ? "fill-primary" : "fill-chart-mid"} />
            <Glyph kind={L.glyph} x={L.to[0]} y={L.to[1]} active={active} />
            <text x={L.to[0]} y={L.to[1] - 26} textAnchor="middle" className={cn("t-mono-sm", active ? "fill-on-surface" : "fill-muted")}>
              {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
