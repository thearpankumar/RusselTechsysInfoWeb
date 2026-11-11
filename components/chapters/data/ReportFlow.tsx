"use client";

import * as React from "react";
import { ArrowDown, Building2, Database, FileInput, FileOutput, ScrollText, Users } from "lucide-react";
import { files } from "@/content/files";
import { ChartFrame, Cite, ConfidenceTag } from "@/components/ui-rt";
import { cn } from "@/lib/utils";
import { CONSUMERS, consumerKeys, pad2 } from "./shared";

type Stripe = "past" | "mid" | "light" | "primary";
const stripeBg: Record<Stripe, string> = { past: "bg-chart-past", mid: "bg-chart-mid", light: "bg-chart-light", primary: "bg-primary" };

interface Edge {
  from: string;
  to: string;
  /** main = solid; loop = dash-dot (flows back into IQMS). */
  kind: "main" | "loop";
}

const inScope = files.filter((f) => f.status === "in-scope");
const inputs = inScope.filter((f) => f.direction === "input");
const outputs = inScope.filter((f) => f.direction === "output");

const EDGES: Edge[] = [
  { from: "iqms", to: "crystal", kind: "main" },
  { from: "customer", to: "forecast", kind: "main" },
  ...inputs.filter((f) => f.sourceSystem === "IQMS ERP").map((f) => ({ from: "crystal", to: f.id, kind: "main" as const })),
  ...inputs.flatMap((f) => consumerKeys(f).map((c) => ({ from: f.id, to: `c:${c}`, kind: "main" as const }))),
  // Reorder: built by IT on the ERP data (Crystal SQL, weekly) and read by buyers.
  { from: "crystal", to: "reorder", kind: "main" },
  { from: "reorder", to: "c:Buyer", kind: "main" },
  // Promise dates: typed by SCM / buyers from supplier emails, uploaded back into IQMS.
  { from: "c:SCM", to: "promise-date-upload", kind: "loop" },
  { from: "c:Buyer", to: "promise-date-upload", kind: "loop" },
  { from: "promise-date-upload", to: "iqms", kind: "loop" },
];

const reportsPerTeam = (c: string) => inScope.filter((f) => consumerKeys(f).includes(c as (typeof CONSUMERS)[number])).length;

/** Flow: IQMS ERP → Crystal Reports (each morning) → in-scope files → teams; the two outputs flow back. Hover a node to trace it. */
export function ReportFlow({ onOpenFile }: { onOpenFile: (fileId: string) => void }) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const nodes = React.useRef(new Map<string, HTMLElement>());
  const [rects, setRects] = React.useState<Record<string, { l: number; r: number; t: number; b: number; cy: number; cx: number }>>({});
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [hover, setHover] = React.useState<string | null>(null);

  const measure = React.useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const base = el.getBoundingClientRect();
    const out: typeof rects = {};
    nodes.current.forEach((n, k) => {
      const r = n.getBoundingClientRect();
      out[k] = { l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, b: r.bottom - base.top, cy: r.top - base.top + r.height / 2, cx: r.left - base.left + r.width / 2 };
    });
    setRects(out);
    setSize({ w: base.width, h: base.height });
  }, []);

  React.useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [measure]);

  const reg = (k: string) => (el: HTMLElement | null) => {
    if (el) nodes.current.set(k, el);
    else nodes.current.delete(k);
  };

  const wide = size.w >= 768;
  const linked = (e: Edge) => !hover || e.from === hover || e.to === hover;
  const hoverProps = (k: string) => ({ onMouseEnter: () => setHover(k), onMouseLeave: () => setHover(null), onFocus: () => setHover(k), onBlur: () => setHover(null) });

  const path = (e: Edge) => {
    const a = rects[e.from];
    const b = rects[e.to];
    if (!a || !b) return "";
    if (e.to === "iqms") {
      // Loop back: run left under the diagram at the output's height, then rise into IQMS from below.
      const r = 12;
      const y = a.cy;
      return `M ${a.l} ${y} L ${b.cx + r} ${y} Q ${b.cx} ${y} ${b.cx} ${y - r} L ${b.cx} ${b.b + 6}`;
    }
    if (a.l > b.r) {
      // Backwards (team → output): right-to-left S curve.
      const sx = a.l;
      const tx = b.r + 6;
      const dx = Math.max(24, (sx - tx) / 2);
      return `M ${sx} ${a.cy} C ${sx - dx} ${a.cy}, ${tx + dx} ${b.cy}, ${tx} ${b.cy}`;
    }
    const sx = a.r;
    const tx = b.l - 6;
    const dx = Math.max(24, (tx - sx) / 2);
    return `M ${sx} ${a.cy} C ${sx + dx} ${a.cy}, ${tx - dx} ${b.cy}, ${tx} ${b.cy}`;
  };

  return (
    <ChartFrame
      title="How the reports flow"
      subtitle="Read left to right: IQMS produces the reports each morning, five teams read them, and two outputs flow back into IQMS. Hover any box to trace it."
      footer={
        <>
          <span className="inline-flex items-center gap-2 t-body-md text-body">
            <svg aria-hidden width="32" height="8">
              <line x1="0" y1="4" x2="32" y2="4" className="stroke-chart-mid" strokeWidth={1} />
            </svg>
            Report feeds a team
          </span>
          <span className="inline-flex items-center gap-2 t-body-md text-body">
            <svg aria-hidden width="32" height="8">
              <line x1="0" y1="4" x2="32" y2="4" className="stroke-chart-mid" strokeWidth={1} strokeDasharray="6 3 1 3" />
            </svg>
            Loops back into IQMS
          </span>
          <span className="ml-auto inline-flex items-center gap-2">
            <Cite ids={["WS", "DECK-RESEARCH"]} />
            <ConfidenceTag confidence="session" />
          </span>
        </>
      }
    >
      <div ref={wrap} className="dot-grid relative -mx-2 rounded-lg p-2">
        {wide && size.w > 0 && (
          <svg aria-hidden className="pointer-events-none absolute inset-0" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
            <defs>
              <marker id="rf-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 z" className="fill-chart-mid" />
              </marker>
              <marker id="rf-arrow-hi" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 z" className="fill-primary" />
              </marker>
            </defs>
            {EDGES.map((e) => {
              const on = !!hover && linked(e);
              return (
                <path
                  key={`${e.from}>${e.to}`}
                  d={path(e)}
                  fill="none"
                  strokeWidth={1}
                  strokeDasharray={e.kind === "loop" ? "6 3 1 3" : undefined}
                  markerEnd={`url(#${on ? "rf-arrow-hi" : "rf-arrow"})`}
                  className={cn("transition-opacity duration-150", on ? "stroke-primary" : "stroke-chart-mid", hover && !on ? "opacity-20" : "opacity-100")}
                />
              );
            })}
          </svg>
        )}

        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.3fr)_minmax(0,0.9fr)] md:gap-12">
          <Column label="Source">
            <Node k="customer" reg={reg} {...hoverProps("customer")} dim={dimmed(hover, "customer")} stripe="past" icon={<Building2 />} type="Customer" title="Customer portal" meta="Forecast download" />
            <Node k="iqms" reg={reg} {...hoverProps("iqms")} dim={dimmed(hover, "iqms")} stripe="past" icon={<Database />} type="ERP" title="IQMS ERP" meta="DELMIAworks" />
          </Column>
          <Down />
          <Column label="Report engine">
            <Node k="crystal" reg={reg} {...hoverProps("crystal")} dim={dimmed(hover, "crystal")} stripe="mid" icon={<ScrollText />} type="Engine" title="Crystal Reports" meta="SQL on IQMS · each morning" />
          </Column>
          <Down />
          <Column label="In-scope files">
            {inputs.map((f) => (
              <Node
                key={f.id}
                k={f.id}
                reg={reg}
                {...hoverProps(f.id)}
                dim={dimmed(hover, f.id)}
                stripe="light"
                icon={<FileInput />}
                type={`${pad2(f.index)} · In`}
                title={f.name}
                onClick={() => onOpenFile(f.id)}
                compact
              />
            ))}
            <p className="mt-2 t-label-caps text-muted">Outputs</p>
            {outputs.map((f) => (
              <Node
                key={f.id}
                k={f.id}
                reg={reg}
                {...hoverProps(f.id)}
                dim={dimmed(hover, f.id)}
                stripe="primary"
                icon={<FileOutput />}
                type={`${pad2(f.index)} · Out`}
                title={f.name}
                onClick={() => onOpenFile(f.id)}
                compact
              />
            ))}
          </Column>
          <Down />
          <Column label="Teams">
            {CONSUMERS.map((c) => (
              <Node
                key={c}
                k={`c:${c}`}
                reg={reg}
                {...hoverProps(`c:${c}`)}
                dim={dimmed(hover, `c:${c}`)}
                stripe="mid"
                icon={<Users />}
                type="Team"
                title={c}
                meta={`${reportsPerTeam(c)} reports`}
              />
            ))}
          </Column>
        </div>
      </div>
    </ChartFrame>
  );
}

function dimmed(hover: string | null, k: string) {
  if (!hover || hover === k) return false;
  return !EDGES.some((e) => (e.from === hover && e.to === k) || (e.to === hover && e.from === k));
}

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col justify-center gap-2">
      <p className="mb-2 t-label-caps text-muted">{label}</p>
      {children}
    </div>
  );
}

function Down() {
  return (
    <div aria-hidden className="flex justify-center py-1 text-muted md:hidden">
      <ArrowDown className="size-5" strokeWidth={1.5} />
    </div>
  );
}

function Node({
  k,
  reg,
  stripe,
  icon,
  type,
  title,
  meta,
  onClick,
  compact,
  dim,
  ...events
}: {
  k: string;
  reg: (k: string) => (el: HTMLElement | null) => void;
  stripe: Stripe;
  icon: React.ReactNode;
  type: string;
  title: string;
  meta?: string;
  onClick?: () => void;
  compact?: boolean;
  dim?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}) {
  const cls = cn(
    "relative flex w-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-surface pl-4 text-left transition-[opacity,background-color,border-color] duration-150 ease-out",
    compact ? "py-2 pr-3" : "py-3 pr-4",
    dim && "opacity-40",
    onClick && "cursor-pointer hover:border-chart-past hover:bg-surface-raised"
  );
  const inner = (
    <>
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.75", stripeBg[stripe])} />
      <span className="flex items-center gap-2 t-mono-sm text-muted [&_svg]:size-3.5 [&_svg]:stroke-[1.5]">
        {icon}
        {type}
      </span>
      <span className="mt-1 truncate t-body-md text-on-surface">{title}</span>
      {meta && <span className="mt-1 truncate t-body-sm text-muted">{meta}</span>}
    </>
  );
  return onClick ? (
    <button ref={reg(k)} type="button" onClick={onClick} className={cls} {...events}>
      {inner}
    </button>
  ) : (
    <div ref={reg(k)} tabIndex={0} className={cls} {...events}>
      {inner}
    </div>
  );
}
