"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { ChartFrame } from "@/components/ui-rt/ChartFrame";
import { Chip } from "@/components/ui-rt/Chip";
import { ConfidenceTag } from "@/components/ui-rt/ConfidenceTag";
import { Legend } from "@/components/ui-rt/Legend";
import { Marker } from "@/components/ui-rt/Marker";
import { HBar } from "@/components/ui-rt/HBar";
import { Button } from "@/components/ui-rt/Button";
import { Section } from "@/components/journey/Section";
import { motion } from "motion/react";
import { DoorStat as Stat } from "./financials/shared";
import { StatRow } from "@/components/ui-rt/StatRow";
import { TabTrack } from "@/components/ui-rt/TabTrack";
import {
  allCompetitors,
  competitors,
  rossell,
  COMPETITOR_GROUP_LABEL,
  COMPETITOR_SERVICES,
  marketSizes,
  harnessMarketRange,
  shareEstimate,
  type CompetitorX,
} from "@/content/competitors";
import type { Fact } from "@/content/types";
import { useSearchOpen } from "@/lib/searchIndex";
import { cn } from "@/lib/utils";
import { FactMeta, InfoOverlay, fmtNum, useOverlayList, type InfoContent } from "./financials/shared";
import { BubbleChart, GROUP_COLOR } from "./competition/BubbleChart";

type Filter = "all" | "indian" | "global";

const fmtFact = (f: Fact<number> | undefined, unit: "cr" | "pct") => (f ? (unit === "cr" ? fmtNum(f.value, 1) : `${fmtNum(f.value, 1)}%`) : null);

function competitorContent(c: CompetitorX): InfoContent {
  const f = [
    { k: "Revenue (₹ Cr)", v: c.revenueCr, u: "cr" as const },
    { k: "EBITDA margin", v: c.ebitdaMarginPct, u: "pct" as const },
    { k: "A&D share of revenue", v: c.adSharePct, u: "pct" as const },
  ];
  return {
    eyebrow: `${COMPETITOR_GROUP_LABEL[c.group]} · ${c.hq}`,
    title: c.name,
    description: c.focus,
    rows: [
      ...f.map((x) => ({ label: `${x.k}${x.v?.asOf ? ` · ${x.v.asOf}` : ""}`, value: fmtFact(x.v, x.u), meta: x.v ? <FactMeta sources={x.v.sources} confidence={x.v.confidence} /> : undefined })),
      { label: "Listing", value: c.listed ?? null },
    ],
    notes: [
      { label: "Why it matters to Rossell", text: c.relevance },
      ...f.filter((x) => x.v?.note).map((x) => ({ label: x.k, text: x.v!.note! })),
      ...(f.some((x) => !x.v) ? [{ text: "— means no reliable dated figure was found; we left it out rather than guess." }] : []),
    ],
    sources: c.sources,
    children: (
      <div>
        <p className="mb-3 t-label-caps text-muted">Services</p>
        <div className="flex flex-wrap gap-2">
          {COMPETITOR_SERVICES.filter((s) => c.services.includes(s.key)).map((s) => (
            <Chip key={s.key}>{s.label}</Chip>
          ))}
        </div>
      </div>
    ),
  };
}

const info: Record<string, InfoContent> = {
  share: {
    eyebrow: "Market position · estimate",
    title: "~0.5–0.8% of the global market",
    description: "Rossell's share of the global aerospace wiring harness market, from its FY26 revenue and four third-party market sizes.",
    rows: shareEstimate.steps.map((s) => ({ label: s.label, value: s.value })),
    notes: [{ label: "Method", text: shareEstimate.method }],
    sources: shareEstimate.sources,
    confidence: shareEstimate.confidence,
  },
  market: {
    eyebrow: "Market context",
    title: "US$5.9–8.35bn harness market",
    description: "Four research houses size the global aerospace wiring harness market differently; scopes and years differ.",
    rows: marketSizes.map((m) => ({ label: `${m.publisher} · ${m.asOf}`, value: `US$${m.value}bn`, meta: <FactMeta sources={m.sources} /> })),
    notes: marketSizes.map((m) => ({ label: `${m.publisher}: ${m.label}`, text: m.note })),
    sources: harnessMarketRange.sources,
    confidence: "reported",
  },
};

/* ---------- where Rossell sits (computed from content/competitors.ts) ---------- */

const NUM_WORD = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const word = (n: number) => NUM_WORD[n] ?? String(n);
const cr0 = (v: number) => fmtNum(v, 0);

const ranked = allCompetitors.filter((c) => c.revenueCr).sort((a, b) => b.revenueCr!.value - a.revenueCr!.value);
const listedIndianPeers = competitors.filter((c) => c.group === "indian" && c.revenueCr && c.listed && !/unlisted/i.test(c.listed));
const indianRev = listedIndianPeers.map((c) => c.revenueCr!.value);
const indianMin = Math.min(...indianRev);
const indianMax = Math.max(...indianRev);
const rossellRev = rossell.revenueCr!.value;
const indianRank = indianRev.filter((v) => v > rossellRev).length + 1;
const indianCount = listedIndianPeers.length + 1;
const sizeHeadline =
  indianRank === indianCount
    ? `Smallest of ${word(indianCount)} listed Indian companies compared`
    : `Number ${indianRank} of ${word(indianCount)} listed Indian companies by revenue`;

const adDisclosed = allCompetitors.filter((c) => c.adSharePct).sort((a, b) => b.adSharePct!.value - a.adSharePct!.value);
const rossellAdTop = adDisclosed[0]?.id === "rossell";

const peerServiceCounts = competitors.map((c) => c.services.length).sort((a, b) => a - b);
const median = (xs: number[]) => (xs.length % 2 ? xs[(xs.length - 1) / 2] : (xs[xs.length / 2 - 1] + xs[xs.length / 2]) / 2);
const peerMedian = median(peerServiceCounts);
const rossellMissing = COMPETITOR_SERVICES.filter((s) => !rossell.services.includes(s.key));
const adBasisText = shareEstimate.steps.find((s) => s.label.startsWith("A&D"))?.value ?? "";
const adBasisNums = adBasisText.match(/[\d.]+/g)?.map(Number) ?? [];
const adBasis = { text: adBasisText, mid: adBasisNums.length ? adBasisNums.reduce((a, b) => a + b, 0) / adBasisNums.length : 0 };
const allSources = (pick: (c: CompetitorX) => Fact<number> | undefined) => [...new Set(allCompetitors.flatMap((c) => pick(c)?.sources ?? []))];

function RevenueLadder({ onOpen }: { onOpen: (id: string) => void }) {
  const reduce = useReducedMotionSafe();
  const max = ranked[0]?.revenueCr?.value ?? 1;
  return (
    <ChartFrame
      eyebrow="Size"
      title={`${sizeHeadline}: ₹${cr0(rossellRev)} Cr against ₹${cr0(indianMin)}–${cr0(indianMax)} Cr`}
      subtitle="Latest full-year revenue in ₹ Cr, largest first; Rossell is the highlighted bar."
      footer={
        <>
          <span className="t-body-sm text-muted">FY26 for Indian companies; CY2025 for global, converted at ₹87/US$ and ₹98.57/€. Companies with no reliable revenue figure are left out.</span>
          <FactMeta sources={allSources((c) => c.revenueCr)} className="ml-auto" />
        </>
      }
    >
      <ol className="flex flex-col gap-3">
        {ranked.map((c, i) => {
          const isR = c.id === "rossell";
          const pct = (c.revenueCr!.value / max) * 100;
          return (
            <li key={c.id}>
              <button type="button" onClick={() => onOpen(c.id)} className="group grid w-full cursor-pointer grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 text-left sm:grid-cols-[10rem_minmax(0,1fr)_15rem]">
                <span className={cn("truncate t-body-md underline-offset-4 group-hover:underline", isR ? "text-on-surface" : "text-body")}>{c.short}</span>
                <span className="relative h-2 w-full" aria-hidden>
                  <motion.span
                    className={cn("absolute inset-y-0 left-0 rounded-full", isR ? "bg-primary" : "bg-chart-past")}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${Math.max(pct, 0.8)}%` }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.2 + i * 0.04 }}
                  />
                </span>
                <span className="col-start-2 inline-flex flex-wrap items-center gap-2 sm:col-start-3 sm:justify-end">
                  <span className={cn("t-body-md tnum whitespace-nowrap", isR ? "text-on-surface" : "text-body")}>₹{fmtNum(c.revenueCr!.value, 1)} Cr</span>
                  {c.revenueCr!.confidence !== "reported" && <ConfidenceTag confidence={c.revenueCr!.confidence} />}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </ChartFrame>
  );
}

function PositionCards({ onShare }: { onShare: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <ChartFrame
        eyebrow="Aerospace and defence focus"
        title={`~${rossell.adSharePct!.value}%${rossellAdTop ? `, the highest of the ${word(adDisclosed.length)} that disclose it` : ""}`}
        subtitle="Aerospace and defence (A&D) share of revenue; bars run 0–100%."
        footer={
          <>
            <span className="t-body-sm text-muted">Data Patterns is an A&D pure play but publishes no percentage.</span>
            <FactMeta sources={allSources((c) => c.adSharePct)} />
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {adDisclosed.map((c) => (
            <HBar
              key={c.id}
              value={c.adSharePct!.value}
              muted={c.id !== "rossell"}
              label={
                <span className={c.id === "rossell" ? "text-on-surface" : undefined}>
                  {c.short} <span className="t-body-sm text-muted">· {c.adSharePct!.asOf}</span>
                </span>
              }
              display={`${c.adSharePct!.value}%`}
            />
          ))}
        </div>
      </ChartFrame>

      <ChartFrame
        eyebrow="Breadth"
        title={`${rossell.services.length} of ${COMPETITOR_SERVICES.length} services, against a peer median of ${fmtNum(peerMedian, 1)}`}
        subtitle="Count of the twelve services in the matrix each company offers; Rossell is highlighted, grey is the peer median."
        footer={
          <>
            <span className="t-body-sm text-muted">Not offered: {rossellMissing.map((s) => s.label).join(", ")}.</span>
            <FactMeta sources={rossell.sources} confidence="calc" />
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <HBar value={rossell.services.length} max={COMPETITOR_SERVICES.length} label={<span className="text-on-surface">Rossell</span>} display={rossell.services.length} />
          <HBar value={peerMedian} max={COMPETITOR_SERVICES.length} muted label={`Median of ${word(competitors.length)} peers`} display={fmtNum(peerMedian, 1)} />
          <p className="t-body-sm text-muted">
            Peers range from {peerServiceCounts[0]} to {peerServiceCounts[peerServiceCounts.length - 1]}. Every service Rossell lacks sits outside harness work.
          </p>
        </div>
      </ChartFrame>

      <ChartFrame
        eyebrow="Market share"
        title={`~${shareEstimate.low}–${shareEstimate.value}% of the global harness market`}
        subtitle="Rossell's FY26 revenue divided by four third-party market sizes; an upper bound."
        footer={
          <>
            <ConfidenceTag confidence={shareEstimate.confidence} />
            <FactMeta sources={shareEstimate.sources} />
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <HBar value={shareEstimate.value} max={1} label="Total-revenue basis" display={`~${shareEstimate.value}%`} />
          <HBar value={adBasis.mid} max={1} muted label="A&D-only basis" display={adBasis.text} />
          <p className="t-body-sm text-muted">Bars run 0–1% of the market.</p>
          <Button variant="secondary" size="sm" onClick={onShare} className="w-fit">
            How we estimated this
          </Button>
        </div>
      </ChartFrame>
    </div>
  );
}

export default function Competition() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const ov = useOverlayList(allCompetitors, "competitor");
  const [content, setContent] = React.useState<InfoContent | null>(null);
  const openInfo = React.useCallback((id: string) => setContent(info[id] ?? null), []);
  useSearchOpen("comp-info", openInfo);

  const rows = allCompetitors.filter((c) => c.id === "rossell" || filter === "all" || c.group === filter);
  const unplotted = rows.filter((c) => !c.revenueCr || !c.ebitdaMarginPct).map((c) => c.short);
  const harness = marketSizes.filter((m) => m.id !== "india-ems");

  const filterBar = (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <TabTrack<Filter>
        label="Peer set"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All" },
          { value: "indian", label: "Indian peers" },
          { value: "global", label: "Global specialists" },
        ]}
      />
      <Legend
        items={[
          { label: "Rossell", tone: "primary" },
          { label: COMPETITOR_GROUP_LABEL.indian, tone: GROUP_COLOR.indian },
          { label: COMPETITOR_GROUP_LABEL.global, tone: GROUP_COLOR.global },
        ]}
      />
    </div>
  );

  return (
    <ChapterShell
      id="competition"
      statement="A small, focused player among much larger electronics makers."
      lead="Indian EMS (electronics manufacturing services) peers are 2–10× Rossell's size but spread across many industries. The global harness specialists are its real benchmark for aerospace build-to-print. On any of four market estimates, Rossell holds well under 1% of a US$6–8bn market."
    >
      <Section id="overview">
        <div id="comp-ladder" className="scroll-mt-24">
          <RevenueLadder onOpen={ov.openId} />
        </div>
        <div id="comp-position" className="scroll-mt-24">
          <PositionCards onShare={() => openInfo("share")} />
        </div>
      </Section>

      <Section id="peers" className="space-y-6">
        {filterBar}
        <div id="comp-table" className="scroll-mt-24">
          <ChartFrame
            title="Side by side"
            subtitle="Latest full-year figures; — means no reliable dated figure was found. Click a row for detail."
            footer={
              <>
                <span className="t-body-sm text-muted">FY26 = year to Mar 2026 for Indian companies; CY2025 for global, converted at ₹87/US$ and ₹98.57/€</span>
                <FactMeta sources={["R-comp-1", "R-comp-5", "R-comp-7", "R-comp-21", "R-comp-23"]} className="ml-auto" />
              </>
            }
          >
            <PeerTable rows={rows} onOpen={ov.openId} />
          </ChartFrame>
        </div>
        <div id="comp-bubble" className="scroll-mt-24">
          <ChartFrame
            title="Size against profitability"
            subtitle="Further right is bigger, higher is more profitable; bubble area is the A&D share of revenue, and faint bubbles have no A&D figure."
            footer={
              <>
                {unplotted.length > 0 && <span className="t-body-sm text-muted">Not plotted (no reliable revenue): {unplotted.join(" · ")}</span>}
                <FactMeta sources={["R-comp-1", "R-comp-5", "R-comp-9", "R-comp-15", "R-comp-21"]} className="ml-auto" />
              </>
            }
          >
            <BubbleChart data={rows} onSelect={ov.openId} />
          </ChartFrame>
        </div>
      </Section>

      <Section id="services" className="space-y-6">
        {filterBar}
        <div id="comp-services" className="scroll-mt-24">
          <ChartFrame
            title="Who offers what"
            subtitle="A highlighted dot means the company offers the service; Rossell is the first row."
            footer={<FactMeta sources={[...new Set(allCompetitors.flatMap((c) => c.sources))]} className="ml-auto" />}
          >
            <ServicesTable rows={rows} onOpen={ov.openId} />
          </ChartFrame>
        </div>
      </Section>

      <Section id="market">
        <div id="comp-market" className="scroll-mt-24 space-y-12">
          <StatRow>
            <Stat
              label="Global aerospace harness · 2025"
              prefix="US$"
              value="5.9–8.35"
              unit="bn"
              sub="Four estimates (GMI, 360iResearch, The Insight Partners, Research and Markets)"
              meta={<FactMeta sources={harnessMarketRange.sources} />}
              onClick={() => openInfo("market")}
            />
            <Stat
              label="India EMS market · FY25"
              prefix="US$"
              value="40–45"
              unit="bn"
              sub="Could exceed US$150bn by FY30 (KPMG)"
              meta={<FactMeta sources={["R-comp-31"]} />}
            />
            <Stat
              label="Rossell share of global harness"
              prefix="~"
              value="0.5–0.8"
              unit="%"
              sub="Upper bound; method shown on click"
              meta={<FactMeta sources={shareEstimate.sources} confidence="estimate" />}
              onClick={() => openInfo("share")}
            />
          </StatRow>
          <ChartFrame title="Four estimates of one market" subtitle="Global aerospace wiring harness market estimates in US$ bn, on a line from US$5bn to US$9bn.">
            <div className="relative h-24">
              <div className="absolute top-8 right-0 left-0 h-px bg-border" aria-hidden />
              <div className="absolute top-8 h-px bg-primary" style={{ left: `${((5.9 - 5) / 4) * 100}%`, width: `${((8.35 - 5.9) / 4) * 100}%` }} aria-hidden />
              {harness.map((mk, i) => (
                <button
                  key={mk.id}
                  type="button"
                  onClick={() => openInfo("market")}
                  className="absolute top-8 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center"
                  style={{ left: `${((mk.low - 5) / 4) * 100}%` }}
                  title={`${mk.publisher}: US$${mk.value}bn (${mk.asOf})`}
                >
                  <span className="block size-2.5 rounded-full border border-primary bg-background" />
                  <span className={cn("absolute t-mono-sm whitespace-nowrap text-body", i % 2 === 0 ? "top-4" : "-top-6")}>{mk.value}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between t-mono-sm text-muted">
              <span>US$5bn</span>
              <span>US$9bn</span>
            </div>
          </ChartFrame>
        </div>
      </Section>

      <InfoOverlay
        content={ov.item ? competitorContent(ov.item) : null}
        open={ov.open}
        onOpenChange={ov.onOpenChange}
        index={ov.index ?? undefined}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      />
      <InfoOverlay content={content} open={!!content} onOpenChange={(o) => !o && setContent(null)} />
    </ChapterShell>
  );
}

/* ---------- tables ---------- */

function PeerTable({ rows, onOpen }: { rows: CompetitorX[]; onOpen: (id: string) => void }) {
  return (
    <div className="overflow-x-auto" data-lenis-prevent-wheel>
      <table className="w-full min-w-3xl border-separate border-spacing-0 text-left">
        <thead>
          <tr className="t-mono-sm text-muted">
            <th className="pb-4 pl-4 font-normal">Company</th>
            <th className="pb-4 text-right font-normal">Revenue ₹ Cr</th>
            <th className="pb-4 text-right font-normal">EBITDA margin</th>
            <th className="pb-4 text-right font-normal">A&D share</th>
            <th className="pb-4 pr-4 text-right font-normal">Services</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const isR = c.id === "rossell";
            const cell = (f: Fact<number> | undefined, u: "cr" | "pct") => (
              <span className="inline-flex items-center justify-end gap-2">
                <span className={cn("t-body-md tnum", f ? "text-on-surface" : "text-muted")}>{fmtFact(f, u) ?? "—"}</span>
                {f && f.confidence !== "reported" && <ConfidenceTag confidence={f.confidence} />}
              </span>
            );
            return (
              <tr key={c.id} onClick={() => onOpen(c.id)} className={cn("group cursor-pointer", isR && "bg-surface-raised")}>
                <td className={cn("relative border-t border-border py-3 pl-4", isR && "rounded-l-md border-transparent")}>
                  {isR && <span aria-hidden className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(c.id);
                    }}
                    className="flex cursor-pointer items-center gap-3 text-left"
                  >
                    <Marker tone={isR ? "primary" : GROUP_COLOR[c.group]} size={8} />
                    <span className="flex flex-col">
                      <span className="t-body-md text-on-surface group-hover:underline group-hover:underline-offset-4">{c.short}</span>
                      <span className="t-body-sm text-muted">{c.hq}</span>
                    </span>
                  </button>
                </td>
                <td className={cn("border-t border-border py-3 text-right", isR && "border-transparent")}>{cell(c.revenueCr, "cr")}</td>
                <td className={cn("border-t border-border py-3 text-right", isR && "border-transparent")}>{cell(c.ebitdaMarginPct, "pct")}</td>
                <td className={cn("border-t border-border py-3 text-right", isR && "border-transparent")}>{cell(c.adSharePct, "pct")}</td>
                <td className={cn("border-t border-border py-3 pr-4 text-right t-body-md tnum text-body", isR && "rounded-r-md border-transparent")}>{c.services.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ServicesTable({ rows, onOpen }: { rows: CompetitorX[]; onOpen: (id: string) => void }) {
  return (
    <div className="overflow-x-auto" data-lenis-prevent-wheel>
      <table className="w-full min-w-4xl border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="pb-4 text-left t-mono-sm font-normal text-muted">Company</th>
            {COMPETITOR_SERVICES.map((s) => (
              <th key={s.key} title={s.label} className="px-1 pb-4 text-center t-mono-sm font-normal text-muted">
                {s.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const isR = c.id === "rossell";
            return (
              <tr key={c.id} className={cn("group", isR && "bg-surface-raised")}>
                <th scope="row" className={cn("relative border-t border-border py-2 pr-4 pl-3 text-left font-normal", isR && "rounded-l-md border-transparent")}>
                  {isR && <span aria-hidden className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
                  <button type="button" onClick={() => onOpen(c.id)} className="flex cursor-pointer items-center gap-3 whitespace-nowrap t-body-md text-body hover:text-on-surface">
                    <Marker tone={isR ? "primary" : GROUP_COLOR[c.group]} size={8} />
                    {c.short}
                  </button>
                </th>
                {COMPETITOR_SERVICES.map((s, i) => (
                  <td
                    key={s.key}
                    className={cn("border-t border-border px-1 py-2 text-center group-hover:bg-surface-raised", isR && "border-transparent", isR && i === COMPETITOR_SERVICES.length - 1 && "rounded-r-md")}
                  >
                    {c.services.includes(s.key) ? <Marker tone="primary" className="align-middle" /> : <span className="t-mono-sm text-chart-past">·</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
