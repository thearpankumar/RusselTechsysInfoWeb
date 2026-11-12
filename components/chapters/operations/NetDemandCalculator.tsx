"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { businessRules, netDemand } from "@/content/lifecycle";
import { Button, ChartFrame, Cite, ConfidenceTag, Stat, StatRow } from "@/components/ui-rt";
import { cn } from "@/lib/utils";

const EX = netDemand.workedExample.steps;
const DEFAULTS = { demand: EX[0].value, inFlight: -EX[1].value, free: -EX[3].value };
const MAX = 400;
const fmt = (n: number) => n.toLocaleString("en-IN");

function Slider({ id, label, hint, value, onChange }: { id: string; label: string; hint: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="t-body-md text-on-surface">
          {label}
        </label>
        <span className="t-body-lg tnum text-on-surface">{fmt(value)}</span>
      </div>
      <p className="mt-1 t-body-sm text-muted">{hint}</p>
      <input id={id} type="range" min={0} max={MAX} step={5} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 w-full cursor-pointer accent-primary" />
    </div>
  );
}

/** Interactive net-demand worked example: demand − in-flight − free stock → what to buy. */
export function NetDemandCalculator() {
  const [v, setV] = React.useState(DEFAULTS);
  const net = v.demand - v.inFlight;
  const netPos = Math.max(0, net);
  const buy = Math.max(0, net - v.free);
  const changed = v.demand !== DEFAULTS.demand || v.inFlight !== DEFAULTS.inFlight || v.free !== DEFAULTS.free;

  // Bar: demand split into covered by in-flight, covered by free stock, still to buy.
  const covInFlight = Math.min(v.inFlight, v.demand);
  const covFree = Math.min(v.free, netPos);
  const total = Math.max(1, v.demand);
  const seg = [
    { key: "inflight", label: "Covered by in-flight supply", value: covInFlight, cls: "bg-chart-mid" },
    { key: "free", label: "Covered by free stock", value: covFree, cls: "bg-chart-light" },
    { key: "buy", label: "Net requirement to buy", value: buy, cls: "bg-primary" },
  ];
  const rules = businessRules.filter((r) => r.group === "Net demand & supply");

  return (
    <ChartFrame
      eyebrow="Net demand"
      title="How much to buy, worked through"
      subtitle="Move the sliders: the bar shows how much of the demand is already covered, and the highlighted part is what still has to be bought."
      action={
        changed ? (
          <Button size="sm" icon={<RotateCcw />} onClick={() => setV(DEFAULTS)}>
            Session example
          </Button>
        ) : undefined
      }
      footer={
        <>
          <ConfidenceTag confidence={netDemand.workedExample.confidence} />
          <Cite ids={[...new Set([...netDemand.sources, ...netDemand.workedExample.sources])]} />
          <span className="t-body-sm text-muted">{netDemand.workedExample.note}</span>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-5">
          <Slider id="nd-demand" label="Consolidated demand" hint="Customer POs, schedules and forecast, by part and date" value={v.demand} onChange={(n) => setV((s) => ({ ...s, demand: n }))} />
          <Slider id="nd-inflight" label="In-flight supply" hint="Open purchase orders + in transit" value={v.inFlight} onChange={(n) => setV((s) => ({ ...s, inFlight: n }))} />
          <Slider id="nd-free" label="Free stock" hint="On hand, not in WIP and not kitted" value={v.free} onChange={(n) => setV((s) => ({ ...s, free: n }))} />
        </div>
        <div className="lg:col-span-7">
          <StatRow>
            <Stat label="Net demand" value={fmt(netPos)} caption="Demand − in-flight" sub={net < 0 ? `In-flight exceeds demand by ${fmt(-net)}` : undefined} />
            <Stat label="Net requirement" value={fmt(buy)} caption="Net demand − free stock" selected={buy > 0} />
          </StatRow>
          <div className="mt-8">
            <div className="flex h-10 w-full gap-1" role="img" aria-label={`Demand ${v.demand}: ${covInFlight} covered by in-flight supply, ${covFree} by free stock, ${buy} to buy`}>
              {v.demand === 0 ? (
                <div className="flex h-full w-full items-center rounded-sm border border-dashed border-border px-3 t-body-sm text-muted">No demand</div>
              ) : (
                seg
                  .filter((s) => s.value > 0)
                  .map((s) => <div key={s.key} title={`${s.label}: ${fmt(s.value)}`} className={cn("h-full rounded-sm transition-[flex-grow] duration-200 ease-out", s.cls)} style={{ flexGrow: s.value / total, flexBasis: 0 }} />)
              )}
            </div>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {seg.map((s) => (
                <li key={s.key} className="inline-flex items-center gap-2 t-body-md text-body">
                  <span aria-hidden className={cn("size-2.5 rounded-full", s.cls)} />
                  {s.label}
                  <span className="tnum text-on-surface">{fmt(s.value)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 rounded-lg bg-canvas p-6 t-mono-sm text-body">
            <p>
              Net demand = {fmt(v.demand)} − {fmt(v.inFlight)} = <span className="text-on-surface">{fmt(net)}</span>
            </p>
            <p className="mt-2">
              Net requirement = max(0, {fmt(net)} − {fmt(v.free)}) = <span className="text-on-surface">{fmt(buy)}</span>
            </p>
            <p className="mt-4 text-muted">{netDemand.formula}</p>
            <p className="mt-1 text-muted">{netDemand.inFlight}</p>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-border pt-8">
        <p className="t-label-caps text-muted">The rules behind it</p>
        <ul className="mt-4 grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {rules.map((r) => (
            <li key={r.id} className="flex gap-4 border-b border-border py-3">
              <span className="t-mono-sm text-muted">{r.id}</span>
              <span className="t-body-sm text-body">
                {r.text}
                {r.plain && <span className="mt-1 block text-muted">{r.plain}</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 t-body-sm text-muted">{netDemand.finalRequirement}</p>
      </div>
    </ChartFrame>
  );
}
