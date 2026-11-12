"use client";

import * as React from "react";
import Link from "next/link";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { BarChart } from "@/components/ui-rt/BarChart";
import { Card } from "@/components/ui-rt/Card";
import { ChartFrame } from "@/components/ui-rt/ChartFrame";
import { ConfidenceTag } from "@/components/ui-rt/ConfidenceTag";
import { HBar } from "@/components/ui-rt/HBar";
import { DoorStat as Stat } from "./financials/shared";
import { StatRow } from "@/components/ui-rt/StatRow";
import { StatusTrack } from "@/components/ui-rt/StatusTrack";
import {
  orderBookHistory,
  orderInflow,
  strategicAgreements,
  pipeline,
  semiSpaceShare,
  inventoryMonths,
  ambitions,
  revenueMix,
  mixFacts,
  type Ambition,
} from "@/content/financials";
import { useSearchOpen } from "@/lib/searchIndex";
import { FactMeta, GlanceLink, InfoOverlay, SectionHead, fmtNum, type InfoContent } from "./financials/shared";
import { OrderBookChart } from "./growth/OrderBookChart";
import { MixMorph } from "./growth/MixMorph";

const pipeline1350 = pipeline.find((p) => p.value === 1350)!;

const ambitionContent = (a: Ambition): InfoContent => ({
  eyebrow: "Ambition",
  title: a.label,
  description: a.plain,
  rows: [
    ...(a.from ? [{ label: "From", value: a.from }] : []),
    { label: "To", value: a.to },
    { label: "By", value: a.by },
  ],
  notes: a.note ? [{ text: a.note }] : [{ text: "A management target or company estimate, not a result. Shown as stated." }],
  sources: a.sources,
  confidence: a.confidence,
});

const info: Record<string, InfoContent> = {
  "order-book": {
    eyebrow: "Order book · confirmed POs",
    title: "₹900 Cr order book",
    description: "Confirmed purchase orders not yet delivered. It dipped after the relisting as old orders shipped, then climbed back in three quarters.",
    rows: orderBookHistory.map((p) => ({ label: p.label, value: `₹${p.display} Cr`, meta: <FactMeta sources={p.sources} /> })),
    notes: [
      ...orderBookHistory.filter((p) => p.note).map((p) => ({ label: p.label, text: p.note! })),
      { label: "Cover", text: "₹900 Cr ÷ trailing-12-month revenue ₹612 Cr ≈ 1.47 years (our calculation). Semiconductor and space orders ship fast and do not accumulate in the book." },
    ],
    sources: ["R-scl-35", "R-scl-13", "R-scl-1"],
    confidence: "reported",
  },
  strategic: {
    eyebrow: "Long-term agreements",
    title: "~₹3,000 Cr of strategic agreements",
    description: "Framework agreements over 3–5 years, mostly aerospace and defence. Firm orders are placed against them year by year, so they are not in the order book.",
    rows: strategicAgreements.map((p) => ({ label: p.label, value: `₹${fmtNum(p.value, 0)} Cr`, meta: <FactMeta sources={p.sources} /> })),
    notes: strategicAgreements.filter((p) => p.note).map((p) => ({ label: p.label, text: p.note! })),
    sources: ["R-scl-35", "R-scl-13", "R-scl-11"],
    confidence: "reported",
  },
  pipeline: {
    eyebrow: "Bids",
    title: "₹1,350 Cr bid pipeline",
    description: "Bids submitted across aerospace and defence, semiconductor and industrial, as of Sep 2026.",
    rows: pipeline.map((p) => ({ label: p.label ?? "", value: `₹${fmtNum(p.value, 0)} Cr`, meta: <FactMeta sources={p.sources} confidence={p.confidence} /> })),
    notes: [{ text: pipeline1350.note ?? "" }],
    sources: pipeline1350.sources,
    confidence: "reported",
  },
  mix: {
    eyebrow: "Revenue mix",
    title: "From 70/30 to 50/50",
    description: "Aerospace and defence was ~70% of revenue in FY26. Management targets 50/50 in FY27 as semiconductor and space grow 300–400%.",
    rows: [
      ...revenueMix.map((m) => ({ label: m.label, value: m.parts.map((p) => `${p.pct}`).join(" : "), meta: <FactMeta sources={m.sources} /> })),
      ...mixFacts.map((f) => ({ label: f.label ?? "", value: `${f.unit === "₹ Cr" ? "₹" : ""}${fmtNum(f.value)}${f.unit === "%" ? "%" : " Cr"}`, meta: <FactMeta sources={f.sources} confidence={f.confidence} /> })),
      { label: "A&D share of historical operational revenue", value: "~93%", meta: <FactMeta sources={["R-scl-11"]} /> },
      { label: "EWIS share of revenue (Aug 2025)", value: "70%", meta: <FactMeta sources={["R-scl-19"]} /> },
      { label: "Build-to-print vs build-to-spec", value: "90 : 10", meta: <FactMeta sources={["R-scl-15"]} /> },
    ],
    notes: [
      { text: "The 70/30 split counts all non-A&D (including industrial), so the 20% semiconductor + space share and the 30% non-A&D share do not conflict." },
      { label: "Order book", text: "The ₹715 Cr book at Mar-26 was already about 50/50; strategic agreements are mostly A&D." },
    ],
    sources: ["S88", "R-scl-15", "R-scl-14"],
    confidence: "reported",
  },
  inventory: {
    eyebrow: "Working capital",
    title: "Inventory months",
    description: "How many months of consumption the stock on hand would cover. Each month removed frees cash on a business running at ~₹185 Cr a quarter.",
    rows: inventoryMonths.map((p) => ({ label: p.label, value: `${fmtNum(p.value, 2)} months`, meta: <FactMeta sources={p.sources} confidence={p.confidence} /> })),
    notes: inventoryMonths.filter((p) => p.note).map((p) => ({ label: p.label, text: p.note! })),
    sources: ["S28", "S42", "DECK-SC"],
    confidence: "reported",
  },
};

export default function Growth() {
  const [content, setContent] = React.useState<InfoContent | null>(null);
  const openInfo = React.useCallback((id: string) => setContent(info[id] ?? null), []);
  const openAmbition = React.useCallback((id: string) => {
    const a = ambitions.find((x) => x.id === id);
    if (a) setContent(ambitionContent(a));
  }, []);
  useSearchOpen("growth-info", openInfo);
  useSearchOpen("ambition", openAmbition);

  const invCurrent = inventoryMonths.findIndex((p) => p.label === "Q2 FY27");

  return (
    <ChapterShell
      id="growth"
      statement="The order book is back at ₹900 Cr, and half of it is no longer aerospace."
      lead="Orders dipped as the relisting-era book shipped, then rebuilt to ₹900 Cr by Sep 2026 in three quarters. Behind it sit ~₹3,000 Cr of strategic agreements and ₹1,350 Cr of bids, with semiconductor and space pulling the mix towards 50/50."
    >
      {/* 1 · Overview: the order book. */}
      <Section id="overview">
        <div id="growth-order-book" className="grid scroll-mt-24 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
          <ChartFrame
            title="Confirmed order book"
            subtitle="₹ Cr of confirmed POs (purchase orders) at each disclosure; hollow dots are 'over' or approximate figures, the highlighted dot is the latest."
            footer={
              <>
                <span className="t-body-sm text-muted">Click a point for the exact wording</span>
                <FactMeta sources={["R-scl-35", "R-scl-19", "R-scl-13", "R-scl-1"]} />
              </>
            }
          >
            <OrderBookChart
              data={orderBookHistory}
              ariaLabel="Order book: ₹900 Cr Dec 2024, about ₹700 Cr through 2025, ₹715 Cr Mar 2026, ₹800 Cr Jun 2026, ₹900 Cr Sep 2026"
              onPointClick={(i) => {
                const p = orderBookHistory[i];
                setContent({ eyebrow: "Order book", title: `₹${p.display} Cr · ${p.label}`, description: p.note, sources: p.sources, confidence: p.confidence, rows: [{ label: "As of", value: p.asOf }] });
              }}
            />
          </ChartFrame>
          <div className="flex flex-col gap-6">
            <Card className="flex-1">
              <Stat onClick={() => openInfo("order-book")} size="xl" label="Sep 2026" prefix="₹" value="900" unit="Cr" caption="Confirmed order book" sub="≈ 1.5 years of trailing revenue (₹900 Cr ÷ ₹612 Cr, our calculation)" meta={<FactMeta sources={["R-scl-1", "S41"]} confidence="calc" />} />
            </Card>
            <GlanceLink href="/growth/mix#growth-mix" label="Revenue mix, FY27 target" value="50 : 50" sub="Aerospace and defence against everything else, from 70 : 30 in FY26" cta="Mix" />
          </div>
        </div>
      </Section>

      {/* 2 · Orders: new orders by quarter, agreements and bids. */}
      <Section id="orders">
        <div id="growth-orders" className="grid scroll-mt-24 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <ChartFrame
            title="New orders by quarter"
            subtitle="₹ Cr of firm purchase orders won each quarter; — means no pure order figure was published."
            className="h-full"
            footer={
              <>
                <span className="t-body-sm text-muted">FY26 total ~₹570 Cr · H1 FY27 ~₹430 Cr</span>
                <FactMeta sources={["R-scl-15", "R-scl-11", "R-scl-1", "R-scl-14"]} />
              </>
            }
          >
            <BarChart
              data={orderInflow.map((o) => ({ label: o.label, value: o.value, display: o.display }))}
              height={180}
              ariaLabel="Order inflow: Q3 FY26 over ₹200 Cr, Q1 FY27 ₹240 Cr, Q2 FY27 about ₹190 Cr"
              onBarClick={(_, i) => {
                const o = orderInflow[i];
                setContent({ eyebrow: "Order inflow", title: o.label, description: o.note, rows: [{ label: "Firm orders", value: o.value === null ? null : `₹${o.display ?? o.value} Cr` }], sources: o.sources, confidence: o.confidence });
              }}
            />
          </ChartFrame>
          <div id="growth-pipeline" className="flex scroll-mt-24 flex-col justify-between gap-8 rounded-xl bg-surface p-6 sm:p-10">
            <Stat label="Strategic agreements" prefix="~₹" value="3,000" unit="Cr" sub="3–5 year frameworks, mostly aerospace and defence (A&D)" meta={<FactMeta sources={["R-scl-13", "R-scl-11"]} />} onClick={() => openInfo("strategic")} />
            <div className="border-t border-border pt-6">
              <Stat label="Bids submitted · Sep 2026" prefix="₹" value="1,350" unit="Cr" sub="A&D, semiconductor and industrial" meta={<FactMeta sources={pipeline1350.sources} />} onClick={() => openInfo("pipeline")} />
            </div>
          </div>
        </div>
      </Section>

      {/* 3 · Mix: the morph, and the new verticals' share. */}
      <Section id="mix">
        <div id="growth-mix" className="grid scroll-mt-24 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <ChartFrame
            eyebrow="Business mix"
            title="Aerospace and defence, from 70% to half"
            subtitle="Share of revenue by vertical; the lower bar moves from the FY26 split to the FY27 target."
            className="h-full"
            footer={
              <>
                <span className="t-body-sm text-muted">Order book at Mar-26 was already ~50/50</span>
                <FactMeta sources={["S88", "R-scl-15", "R-scl-14"]} />
              </>
            }
          >
            <MixMorph onSegmentClick={() => openInfo("mix")} />
          </ChartFrame>
          <div id="growth-new-verticals" className="scroll-mt-24">
            <ChartFrame
              eyebrow="New verticals"
              title="Semiconductor + space share"
              subtitle="Share of revenue from semiconductor and space; the H1 figure comes from a secondary call summary."
              className="h-full"
              footer={<FactMeta sources={["R-scl-14", "R-scl-38"]} confidence="calc" />}
            >
              <div className="flex flex-col gap-8">
                {semiSpaceShare.map((p, i) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() =>
                      setContent({
                        eyebrow: "Semiconductor + space",
                        title: `${p.value}% of revenue · ${p.label}`,
                        description: `${p.revenueCr} of revenue.`,
                        notes: p.note ? [{ text: p.note }] : undefined,
                        sources: p.sources,
                        confidence: p.confidence,
                      })
                    }
                    className="-m-3 cursor-pointer rounded-md p-3 text-left transition-colors duration-150 hover:bg-surface-raised"
                  >
                    <div className="mb-3 flex items-baseline gap-2">
                      <span className="t-metric-lg tnum text-on-surface">{i === 1 ? "~" : ""}{p.value}</span>
                      <span className="t-body-lg text-muted">%</span>
                      <span className="ml-auto t-mono-sm text-muted">{p.label}</span>
                    </div>
                    <HBar value={p.value} muted={i === 0} display={null} />
                    <p className="mt-2 flex flex-wrap items-center gap-2 t-body-sm text-muted">
                      {p.revenueCr}
                      {p.confidence !== "reported" && <ConfidenceTag confidence={p.confidence} />}
                    </p>
                  </button>
                ))}
                <p className="t-body-sm text-muted">Secondary source: summary of the 6 Nov 2026 call; the transcript was not yet filed.</p>
              </div>
            </ChartFrame>
          </div>
        </div>
      </Section>

      {/* 4 · Inventory months. */}
      <Section id="inventory">
        <div id="growth-inventory" className="scroll-mt-24 rounded-xl bg-surface p-6 sm:p-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="mb-3 t-label-caps text-muted">Working capital</p>
              <h3 className="t-headline-md text-on-surface">Inventory months, falling towards four</h3>
              <p className="mt-2 t-body-md text-muted">Months of consumption covered by stock on hand; the highlighted stop is the latest, the last stop is the indicative aim.</p>
            </div>
            <Stat label="Q2 FY27" value="6.67" unit="months" sub="From 7.98 a year earlier" meta={<FactMeta sources={["S42", "DECK-SC"]} />} onClick={() => openInfo("inventory")} />
          </div>
          <StatusTrack
            current={invCurrent}
            steps={inventoryMonths.map((p) => ({ label: p.label, sub: `${p.label === "Earlier" || p.label === "Target" ? "~" : ""}${fmtNum(p.value, 2)} mo` }))}
            onStepClick={() => openInfo("inventory")}
          />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {inventoryMonths
              .filter((p) => p.label !== "Earlier")
              .map((p) => (
                <HBar key={p.label} label={p.label} value={p.value} max={10} display={`${fmtNum(p.value, 2)} mo`} muted={p.label !== "Q2 FY27"} />
              ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="t-body-sm text-muted">Target is indicative and not re-confirmed on the Q4 FY26 call</span>
            <ConfidenceTag confidence="estimate" />
          </div>
        </div>
        <p className="t-body-md text-muted">
          The rupee value of that stock (₹386 Cr at Sep-26) is in{" "}
          <Link href="/financials/balance#fin-balance" className="text-on-surface underline decoration-border underline-offset-4 hover:decoration-on-surface">
            Financials · Balance sheet
          </Link>
          .
        </p>
      </Section>

      {/* 5 · Stated ambitions. */}
      <Section id="ambitions">
        <div id="growth-ambitions" className="scroll-mt-24">
          <SectionHead eyebrow="What management is aiming for" title="Stated ambitions" lead="Targets and guidance as said on calls and in decks, not results. Each opens its source." />
          <StatRow>
            {ambitions.slice(0, 4).map((a) => (
              <Stat key={a.id} label={a.label} value={a.to} sub={`${a.from ? `From ${a.from} · ` : ""}${a.by}`} meta={<FactMeta sources={a.sources} confidence={a.confidence === "reported" ? undefined : a.confidence} />} onClick={() => openAmbition(a.id)} />
            ))}
          </StatRow>
        </div>
        {ambitions.length > 4 && (
          <div id="growth-ambitions-more" className="grid scroll-mt-24 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {ambitions.slice(4).map((a) => (
              <Card key={a.id} interactive onClick={() => openAmbition(a.id)} className="h-full">
                <p className="t-mono-sm text-muted">{a.by}</p>
                <p className="mt-4 t-headline-md text-on-surface tnum">{a.to}</p>
                <p className="mt-2 t-body-md text-on-surface">{a.label}</p>
                {a.from && <p className="mt-1 t-body-sm text-muted">From {a.from}</p>}
              </Card>
            ))}
          </div>
        )}
      </Section>

      <InfoOverlay content={content} open={!!content} onOpenChange={(o) => !o && setContent(null)} />
    </ChapterShell>
  );
}
