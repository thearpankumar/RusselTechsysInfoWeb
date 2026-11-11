"use client";

import * as React from "react";
import { ArrowDown, Database, Download, FileSpreadsheet, FileText, Users, Truck } from "lucide-react";
import { primaryUsers, systems } from "@/content/lifecycle";
import type { Confidence } from "@/content/types";
import { Cite, ConfidenceTag, DetailOverlay, Legend } from "@/components/ui-rt";
import { dataBg, type DataColor } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { useIndexOverlay, useSize } from "../anatomy/shared";

type Kind = "input" | "system" | "report" | "manual" | "people";
const KIND: Record<Kind, { label: string; color: DataColor }> = {
  input: { label: "Outside input", color: "sage" },
  system: { label: "System of record", color: "slate" },
  report: { label: "Report", color: "tan" },
  manual: { label: "Manual glue", color: "olive" },
  people: { label: "People", color: "lavender" },
};

interface Node {
  id: string;
  title: string;
  meta: string;
  kind: Kind;
  icon: React.ReactNode;
  at: [number, number]; // fraction of width / height (desktop)
  facts: { text: string; sources: string[]; confidence: Confidence }[];
}

const factsFor = (system: string) => systems.filter((s) => s.system === system).map((s) => ({ text: s.fact, sources: s.sources, confidence: s.confidence }));

const NODES: Node[] = [
  { id: "forecast", title: "Customer forecasts", meta: "Downloaded as files, daily", kind: "input", icon: <Download />, at: [0, 0.04], facts: [{ text: "Customer forecasts are downloaded as files; semiconductor forecasts change every day.", sources: ["WS", "DECK-SC"], confidence: "session" }] },
  { id: "suppliers", title: "Suppliers", meta: "Promise dates by email · VMI portal", kind: "input", icon: <Truck />, at: [0, 0.66], facts: [{ text: "Suppliers send promise dates by email and upload VMI on-hand stock in their portal (or by email).", sources: ["WS"], confidence: "session" }] },
  { id: "excel", title: "Excel & email", meta: "In between everything", kind: "manual", icon: <FileSpreadsheet />, at: [0.37, 0.66], facts: factsFor("Excel & email") },
  { id: "iqms", title: "IQMS / DELMIAworks", meta: "ERP · system of record", kind: "system", icon: <Database />, at: [0.37, 0.04], facts: [...factsFor("IQMS ERP"), ...factsFor("DELMIAworks")] },
  { id: "crystal", title: "Crystal Reports on SQL", meta: "Refreshed each morning", kind: "report", icon: <FileText />, at: [0.74, 0.04], facts: factsFor("Crystal Reports") },
  { id: "people", title: "Buyers, PPC and SCM", meta: "Read, reconcile, decide", kind: "people", icon: <Users />, at: [0.74, 0.66], facts: [{ text: primaryUsers.text, sources: primaryUsers.sources, confidence: primaryUsers.confidence }, ...factsFor("Direction")] },
];

type Style = "main" | "alt" | "exception";
const EDGES: { from: string; to: string; label: string; style: Style }[] = [
  { from: "forecast", to: "excel", label: "files", style: "main" },
  { from: "suppliers", to: "excel", label: "dates by email", style: "main" },
  { from: "excel", to: "iqms", label: "upload utility", style: "main" },
  { from: "iqms", to: "crystal", label: "SQL", style: "main" },
  { from: "crystal", to: "people", label: "morning reports", style: "main" },
  { from: "people", to: "excel", label: "reconcile by hand", style: "exception" },
  { from: "iqms", to: "people", label: "web reports (direction)", style: "alt" },
];
const DASH: Record<Style, string | undefined> = { main: undefined, alt: "6 4", exception: "1.5 3" };

const NODE_W = 0.26;
const NODE_H = 104;
const HEIGHT = 420;

function clip(cx: number, cy: number, hw: number, hh: number, dx: number, dy: number) {
  const t = Math.min(hw / Math.max(1e-6, Math.abs(dx)), hh / Math.max(1e-6, Math.abs(dy)));
  return [cx + dx * t, cy + dy * t] as const;
}

function NodeCard({ n, onOpen, className, style }: { n: Node; onOpen: () => void; className?: string; style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={style}
      className={cn("relative flex cursor-pointer flex-col gap-2 overflow-hidden rounded-md border border-border bg-surface p-4 pl-6 text-left transition-colors duration-150 hover:border-chart-past", className)}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.75", dataBg[KIND[n.kind].color])} />
      <span className="flex items-center gap-2 t-mono-sm text-muted [&_svg]:size-3.5 [&_svg]:stroke-[1.5]">
        {n.icon}
        {KIND[n.kind].label}
      </span>
      <span className="t-body-md text-on-surface">{n.title}</span>
      <span className="t-body-sm text-muted">{n.meta}</span>
    </button>
  );
}

/** Systems map: IQMS as system of record, Crystal each morning, Excel & email in between. */
export function SystemsMap() {
  const [ref, { width }] = useSize<HTMLDivElement>();
  const ov = useIndexOverlay(NODES);
  const n = ov.current;
  const nodeW = width * NODE_W;
  const pos = (id: string) => {
    const nd = NODES.find((x) => x.id === id)!;
    return { x: nd.at[0] * width, y: nd.at[1] * HEIGHT, cx: nd.at[0] * width + nodeW / 2, cy: nd.at[1] * HEIGHT + NODE_H / 2 };
  };

  return (
    <div>
      {/* Desktop graph */}
      <div className="dot-grid hidden rounded-xl bg-canvas p-8 md:block">
        <div ref={ref} className="relative" style={{ height: HEIGHT }}>
          {width > 0 && (
            <>
              <svg aria-hidden className="pointer-events-none absolute inset-0" width={width} height={HEIGHT}>
                <defs>
                  <marker id="sys-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                    <path d="M0 0 L8 4 L0 8 z" className="fill-chart-mid" />
                  </marker>
                </defs>
                {EDGES.map((e) => {
                  const a = pos(e.from);
                  const b = pos(e.to);
                  const dx = b.cx - a.cx;
                  const dy = b.cy - a.cy;
                  const len = Math.hypot(dx, dy) || 1;
                  const [x1, y1] = clip(a.cx, a.cy, nodeW / 2 + 6, NODE_H / 2 + 6, dx / len, dy / len);
                  const [x2, y2] = clip(b.cx, b.cy, nodeW / 2 + 8, NODE_H / 2 + 8, -dx / len, -dy / len);
                  return <line key={`${e.from}-${e.to}`} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-chart-mid" strokeWidth={1} strokeDasharray={DASH[e.style]} markerEnd="url(#sys-arrow)" />;
                })}
              </svg>
              {EDGES.map((e) => {
                const a = pos(e.from);
                const b = pos(e.to);
                return (
                  <span key={`l-${e.from}-${e.to}`} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-sm bg-canvas px-1 t-mono-sm whitespace-nowrap text-muted" style={{ left: (a.cx + b.cx) / 2, top: (a.cy + b.cy) / 2 }}>
                    {e.label}
                  </span>
                );
              })}
              {NODES.map((nd) => {
                const p = pos(nd.id);
                return <NodeCard key={nd.id} n={nd} onOpen={() => ov.open(nd.id)} className="absolute" style={{ left: p.x, top: p.y, width: nodeW, height: NODE_H }} />;
              })}
            </>
          )}
        </div>
      </div>

      {/* Mobile: the same chain as a vertical flow */}
      <ol className="dot-grid flex flex-col items-stretch gap-2 rounded-xl bg-canvas p-4 md:hidden">
        {["forecast", "suppliers", "excel", "iqms", "crystal", "people"].map((id, i, arr) => {
          const nd = NODES.find((x) => x.id === id)!;
          const out = EDGES.find((e) => e.from === id && e.to === arr[i + 1]);
          return (
            <li key={id} className="flex flex-col items-stretch gap-2">
              <NodeCard n={nd} onOpen={() => ov.open(id)} />
              {i < arr.length - 1 && (
                <span className="flex items-center gap-2 self-center t-mono-sm text-muted">
                  <ArrowDown className="size-4" strokeWidth={1.5} aria-hidden />
                  {out?.label ?? ""}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Legend items={(Object.keys(KIND) as Kind[]).map((k) => ({ label: KIND[k].label, tone: KIND[k].color }))} />
        <span className="t-body-sm text-muted">Solid = main flow · dashed = direction · dotted = manual exception</span>
        <span className="ml-auto flex min-w-0 flex-wrap items-center gap-2">
          <ConfidenceTag confidence="session" />
          <Cite ids={["WS", "DECK-SC", "S68"]} />
        </span>
      </div>

      <DetailOverlay
        open={!!n}
        onOpenChange={ov.onOpenChange}
        eyebrow={n ? KIND[n.kind].label : undefined}
        title={n?.title ?? ""}
        description={n?.meta}
        index={ov.index}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      >
        {n && (
          <ul className="divide-y divide-border">
            {n.facts.map((f) => (
              <li key={f.text} className="py-4 first:pt-0">
                <p className="t-body-md text-body">{f.text}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <ConfidenceTag confidence={f.confidence} />
                  <Cite ids={f.sources} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </DetailOverlay>
    </div>
  );
}
