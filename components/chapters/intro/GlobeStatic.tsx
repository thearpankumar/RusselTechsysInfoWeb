// Static SVG globe: the settled view (centred on Bengaluru, arcs drawn). Used for reduced motion,
// no-WebGL devices and as the pre-hydration placeholder. Pure; renders on server or client.
import * as React from "react";
import { cn } from "@/lib/utils";
import { ARC_TARGETS, BENGALURU, GLOBE_POINTS, decodeMask, fibonacciLatLng, latLngToXYZ } from "./geo";

type V3 = [number, number, number];
const DEG = Math.PI / 180;

/** Rotate a vector so Bengaluru faces the viewer (same transform as the 3D globe when settled). */
function toView([x, y, z]: V3): V3 {
  const b = -BENGALURU.lng * DEG;
  const x1 = x * Math.cos(b) + z * Math.sin(b);
  const z1 = -x * Math.sin(b) + z * Math.cos(b);
  const a = BENGALURU.lat * DEG;
  const y2 = y * Math.cos(a) - z1 * Math.sin(a);
  const z2 = y * Math.sin(a) + z1 * Math.cos(a);
  return [x1, y2, z2];
}

function arcPath(from: V3, to: V3, segments = 48): string {
  const dot = Math.min(1, Math.max(-1, from[0] * to[0] + from[1] * to[1] + from[2] * to[2]));
  const angle = Math.acos(dot);
  const lift = 0.06 + (angle / Math.PI) * 0.32;
  const sin = Math.sin(angle) || 1;
  let d = "";
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const k1 = Math.sin((1 - t) * angle) / sin;
    const k2 = Math.sin(t * angle) / sin;
    const r = 1 + Math.sin(Math.PI * t) * lift;
    const p = toView([(from[0] * k1 + to[0] * k2) * r, (from[1] * k1 + to[1] * k2) * r, (from[2] * k1 + to[2] * k2) * r]);
    d += `${i ? "L" : "M"}${(p[0] * 100).toFixed(2)} ${(-p[1] * 100).toFixed(2)}`;
  }
  return d;
}

export function GlobeStatic({ mask, dim, className }: { mask: string; dim?: boolean; className?: string }) {
  const dots = React.useMemo(() => {
    const out: [number, number][] = [];
    for (const i of decodeMask(mask)) {
      const [lat, lng] = fibonacciLatLng(i, GLOBE_POINTS);
      const p = toView(latLngToXYZ(lat, lng));
      if (p[2] > 0.02) out.push([p[0] * 100, -p[1] * 100]);
    }
    return out;
  }, [mask]);
  const blr = latLngToXYZ(BENGALURU.lat, BENGALURU.lng);
  const arcs = ARC_TARGETS.map((t) => {
    const to = latLngToXYZ(t.lat, t.lng);
    const end = toView(to);
    return { id: t.id, d: arcPath(blr, to), end: end[2] > 0 ? ([end[0] * 100, -end[1] * 100] as const) : null };
  });
  return (
    <svg viewBox="-112 -112 224 224" aria-hidden className={cn("h-full w-full", dim && "opacity-70", className)}>
      <circle cx={0} cy={0} r={100.5} className="fill-none stroke-border" strokeWidth={0.6} />
      <g className="fill-chart-past">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={0.7} />
        ))}
      </g>
      <g className="fill-none stroke-chart-mid" strokeWidth={0.5} vectorEffect="non-scaling-stroke">
        {arcs.map((a) => (
          <path key={a.id} d={a.d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g className="fill-chart-mid">
        {arcs.map((a) => (a.end ? <circle key={a.id} cx={a.end[0]} cy={a.end[1]} r={1.1} /> : null))}
      </g>
      <circle cx={0} cy={0} r={4} className="fill-none stroke-primary" strokeWidth={0.5} />
      <circle cx={0} cy={0} r={1.8} className="fill-primary" />
    </svg>
  );
}
