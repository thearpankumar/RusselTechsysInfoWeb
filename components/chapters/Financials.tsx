"use client";

import * as React from "react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { BarChart, type BarDatum } from "@/components/ui-rt/BarChart";
import { Card } from "@/components/ui-rt/Card";
import { ChartFrame } from "@/components/ui-rt/ChartFrame";
import { HBar } from "@/components/ui-rt/HBar";
import { KeyValueRows } from "@/components/ui-rt/KeyValueRows";
import { SegmentBar } from "@/components/ui-rt/SegmentBar";
import { DoorStat as Stat } from "./financials/shared";
import { StatRow } from "@/components/ui-rt/StatRow";
import { TabTrack } from "@/components/ui-rt/TabTrack";
import { Button } from "@/components/ui-rt/Button";
import {
  annual,
  quarterly,
  materialCostSeries,
  inventorySeries,
  borrowingsSeries,
  operatingCashFlowFY26,
  revenueRupeeH1FY27,
  fundraise,
  debtAndCash,
} from "@/content/financials";
import type { FinancialPeriod } from "@/content/types-extra";
import { useSearchOpen } from "@/lib/searchIndex";
import { FactMeta, GlanceLink, InfoOverlay, SectionHead, fmtNum, type InfoContent } from "./financials/shared";

type View = "annual" | "quarterly" | "margins";

const q2 = quarterly.find((q) => q.id === "Q2FY27")!;
const fy26 = annual.find((a) => a.id === "FY26")!;

/** Q4 FY26 EBITDA margin from the company release (R-comp-2); not in the quarterly content. */
const Q4_MARGIN = { value: 14.65, sources: ["R-comp-2"] };

function periodContent(p: FinancialPeriod): InfoContent {
  const rows = [
    { k: "Revenue", f: p.revenue, u: "₹ Cr" },
    { k: "EBITDA", f: p.ebitda, u: "₹ Cr" },
    { k: "EBITDA margin", f: p.ebitdaMarginPct, u: "%" },
    { k: "Profit before tax", f: p.pbt, u: "₹ Cr" },
    { k: "Profit after tax", f: p.pat, u: "₹ Cr" },
    { k: "Revenue growth, year on year", f: p.yoyRevenueGrowthPct, u: "%" },
  ];
  const sources = [...new Set(rows.flatMap((r) => r.f?.sources ?? []))];
  return {
    eyebrow: p.kind === "quarter" ? "Quarter" : p.kind === "half" ? "Half year" : "Financial year",
    title: p.label,
    description: `Period ending ${new Date(p.periodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}. Standalone unless noted; ₹ Cr.`,
    rows: rows.map((r) => ({
      label: r.k,
      value: r.f ? `${r.u === "₹ Cr" ? "₹" : ""}${fmtNum(r.f.value, 2)}${r.u === "%" ? "%" : " Cr"}` : null,
      meta: r.f ? <FactMeta sources={r.f.sources} confidence={r.f.confidence} /> : undefined,
    })),
    notes: [
      ...rows.filter((r) => r.f?.note).map((r) => ({ label: r.k, text: r.f!.note! })),
      ...(p.note ? [{ label: "Period note", text: p.note }] : []),
      ...(rows.every((r) => !r.f || r.k === "Revenue") ? [{ text: "Only revenue is public for this period; the other lines show —." }] : []),
    ],
    sources,
    confidence: "reported",
  };
}

type KpiId = "q2-revenue" | "q2-ebitda" | "q2-margin" | "q2-pbt" | "q2-pat";

const kpiContent: Record<KpiId, InfoContent> = {
  "q2-revenue": {
    eyebrow: "Q2 FY27 · Jul–Sep 2026",
    title: "₹185.5 Cr revenue",
    description: "The highest quarter in the company's history: +48% on Q2 FY26 and +20% on Q1 FY27.",
    rows: [
      { label: "Q2 FY26", value: "₹125.3 Cr", meta: <FactMeta sources={["S39"]} /> },
      { label: "Q1 FY27", value: "₹154.7 Cr", meta: <FactMeta sources={["S30"]} /> },
      { label: "Q2 FY27", value: "₹185.5 Cr", meta: <FactMeta sources={["S39"]} /> },
    ],
    sources: ["S39", "R-scl-1"],
    confidence: "reported",
  },
  "q2-ebitda": {
    eyebrow: "Q2 FY27",
    title: "₹29.0 Cr EBITDA",
    description: "Operating profit before interest, depreciation and tax: up ~92% year on year.",
    rows: [
      { label: "Q2 FY26", value: "₹15.1 Cr", meta: <FactMeta sources={["S39"]} /> },
      { label: "Q1 FY27", value: "₹23.3 Cr", meta: <FactMeta sources={["S30"]} /> },
      { label: "Q2 FY27", value: "₹29.0 Cr", meta: <FactMeta sources={["S39"]} /> },
    ],
    sources: ["S39", "DECK-SC"],
    confidence: "reported",
  },
  "q2-margin": {
    eyebrow: "Q2 FY27",
    title: "15.6% EBITDA margin",
    description: "29.0 ÷ 185.5. Margins widen as volume spreads fixed costs.",
    rows: [
      { label: "FY25", value: "14.8%", meta: <FactMeta sources={["S44"]} confidence="calc" /> },
      { label: "FY26", value: "13.7%", meta: <FactMeta sources={["S29"]} confidence="calc" /> },
      { label: "H1 FY27", value: "15.3%", meta: <FactMeta sources={["S41"]} /> },
      { label: "Q2 FY27", value: "15.6%", meta: <FactMeta sources={["S39"]} confidence="calc" /> },
      { label: "FY27 guidance", value: "17–22%", meta: <FactMeta sources={["R-comp-1", "R-comp-2"]} /> },
    ],
    notes: [{ label: "Method", text: "Our calculation from reported EBITDA and revenue. The company's results summary shows 15.3% for the quarter, computed on a different base (likely total income)." }],
    sources: ["S39"],
    confidence: "calc",
  },
  "q2-pbt": {
    eyebrow: "Q2 FY27",
    title: "₹12.7 Cr profit before tax",
    description: "The first double-digit quarterly PBT in the company's history, +89% year on year.",
    rows: [
      { label: "Q2 FY26", value: "₹6.7 Cr", meta: <FactMeta sources={["S39"]} /> },
      { label: "Q1 FY27", value: "₹9.6 Cr", meta: <FactMeta sources={["S73"]} /> },
      { label: "Q2 FY27", value: "₹12.7 Cr", meta: <FactMeta sources={["S39"]} /> },
    ],
    notes: [{ text: "Finance cost more than doubled in H1 (₹21.2 Cr vs ₹9.8 Cr): PBT grew despite it. The ₹300 Cr raise repays working-capital lines, so interest should fall from Q3." }],
    sources: ["S39", "S41", "R-scl-38"],
    confidence: "reported",
  },
  "q2-pat": {
    eyebrow: "Q2 FY27",
    title: "₹9.66 Cr profit after tax",
    description: "Consolidated. Standalone PAT was ₹9.4 Cr (+88%).",
    rows: [
      { label: "Q1 FY27 (consolidated)", value: "₹7.0 Cr", meta: <FactMeta sources={["S30", "S31"]} /> },
      { label: "Q2 FY27 (consolidated)", value: "₹9.66 Cr", meta: <FactMeta sources={["S40"]} /> },
      { label: "H1 FY27 (presentation)", value: "₹16.4 Cr", meta: <FactMeta sources={["S41"]} /> },
    ],
    notes: [{ text: "Adding the two consolidated quarters gives ₹16.7 Cr against ₹16.4 Cr in the presentation: rounding and standalone vs consolidated bases." }],
    sources: ["S40", "DECK-SC"],
    confidence: "reported",
  },
};

const seriesLine = (s: { value: number }[]) => s.map((p) => fmtNum(p.value, 0)).join(" → ");

const infoContent: Record<string, InfoContent> = {
  borrowings: {
    eyebrow: "Balance sheet",
    title: "Borrowings",
    description: "Debt nearly doubled in eighteen months to fund inventory and receivables for a business growing ~87% a year.",
    rows: borrowingsSeries.map((p) => ({ label: p.label, value: `₹${fmtNum(p.value, 2)} Cr`, meta: <FactMeta sources={p.sources} /> })),
    notes: [...borrowingsSeries.filter((p) => p.note).map((p) => ({ label: p.label, text: p.note! })), { label: "After the raise", text: "At least ₹230 Cr of the ₹300 Cr preferential issue is earmarked to repay debt." }],
    sources: ["S59", "R-scl-2", "S42"],
    confidence: "reported",
  },
  inventory: {
    eyebrow: "Balance sheet",
    title: "Inventory",
    description: "Stock on hand more than doubled in two and a half years. It is the single biggest use of cash.",
    rows: inventorySeries.map((p) => ({ label: p.label, value: `₹${fmtNum(p.value, 2)} Cr`, meta: <FactMeta sources={p.sources} /> })),
    notes: [
      ...inventorySeries.filter((p) => p.note).map((p) => ({ label: p.label, text: p.note! })),
      { label: "Months of cover", text: "Inventory carrying level fell from 7.98 months (Q2 FY26) to 6.67 months (Q2 FY27); ~4 months is the indicative aim." },
    ],
    sources: ["R-scl-33", "R-scl-2", "S42"],
    confidence: "reported",
  },
  ocf: {
    eyebrow: "Cash flow",
    title: "−₹82.8 Cr operating cash flow, FY26",
    description: "The business consumed cash in its best year: growth went into stock and receivables before it came back as cash.",
    rows: debtAndCash.map((f) => ({ label: f.label ?? "", value: `${f.value < 0 ? "−" : ""}₹${fmtNum(Math.abs(f.value), 2)} Cr`, meta: <FactMeta sources={f.sources} /> })),
    notes: [{ text: operatingCashFlowFY26.note ?? "" }],
    sources: operatingCashFlowFY26.sources,
    confidence: "reported",
  },
  materials: {
    eyebrow: "Cost structure",
    title: "Material cost",
    description: "What Rossell pays for wire, connectors, contacts and every other bought-in part. Its share of revenue rose as the semiconductor and space mix grew.",
    rows: materialCostSeries.map((p) => ({ label: p.label, value: `₹${fmtNum(p.value, 1)} Cr · ${p.sharePct}%`, meta: <FactMeta sources={p.sources} /> })),
    notes: [
      ...materialCostSeries.filter((p) => p.note).map((p) => ({ label: p.label, text: p.note! })),
      { label: "Industry", text: "Components are ~70% of product cost across EMS (S23): Rossell sits a little below that." },
    ],
    sources: ["R-scl-33", "R-scl-1", "S23"],
    confidence: "reported",
  },
  raise: {
    eyebrow: "Capital",
    title: "₹300 Cr preferential raise",
    description: "25,72,898 new shares at ₹1,166 each, almost entirely to SBI Mutual Fund schemes. It replaced an earlier plan to raise up to ₹300 Cr by QIP.",
    rows: [
      { label: "Board approval", value: "18 Sep 2026", meta: <FactMeta sources={fundraise.boardApproval.sources} /> },
      { label: "EGM approval", value: "15 Oct 2026", meta: <FactMeta sources={fundraise.egm.sources} /> },
      { label: "Allotted", value: "3 Nov 2026", meta: <FactMeta sources={fundraise.allotted.sources} /> },
      { label: "Shares × price", value: "25,72,898 × ₹1,166 = ₹299.99 Cr", meta: <FactMeta sources={fundraise.checkAmount.sources} confidence="calc" /> },
      { label: "SBI MF schemes, post-issue stake", value: "5.75%", meta: <FactMeta sources={["R-scl-3"]} /> },
      { label: "SBI Optimal Equity Fund AIF", value: "0.64%", meta: <FactMeta sources={["R-scl-3"]} /> },
      { label: "Earmarked to repay debt (at least)", value: "₹230 Cr", meta: <FactMeta sources={fundraise.debtRepayment.sources} /> },
      { label: "Promoter holding", value: "69.90% → 65.43%", meta: <FactMeta sources={fundraise.promoterHoldingAfterPct.sources} /> },
      { label: "Share count", value: "3,76,96,475 → 4,02,69,373", meta: <FactMeta sources={["R-scl-3"]} /> },
    ],
    notes: [{ label: "Also", text: "Kotak Mahindra MF bought 18,47,117 shares from promoters in a bulk deal (S87)." }],
    sources: ["S42", "S86", "S87", "R-scl-3"],
    confidence: "reported",
  },
};

export default function Financials() {
  const [view, setView] = React.useState<View>("annual");
  const [content, setContent] = React.useState<InfoContent | null>(null);

  const openPeriod = React.useCallback((id: string) => {
    const p = [...annual, ...quarterly].find((x) => x.id === id);
    if (p) setContent(periodContent(p));
  }, []);
  const openKpi = React.useCallback((id: string) => setContent(kpiContent[id as KpiId] ?? null), []);
  const openInfo = React.useCallback((id: string) => setContent(infoContent[id] ?? null), []);
  useSearchOpen("fin-period", openPeriod);
  useSearchOpen("fin-kpi", openKpi);
  useSearchOpen("fin-info", openInfo);

  const annualBars: BarDatum[] = annual.map((p) => ({ label: p.label, value: p.revenue?.value ?? null, current: p.id === "H1FY27", display: p.revenue ? fmtNum(p.revenue.value) : undefined }));
  const quarterBars: BarDatum[] = quarterly.map((p) => ({ label: p.label, value: p.revenue?.value ?? null, current: p.id === "Q2FY27" }));
  const marginBars: BarDatum[] = quarterly.map((p) => {
    const v = p.id === "Q4FY26" ? Q4_MARGIN.value : (p.ebitdaMarginPct?.value ?? null);
    return { label: p.label, value: v, current: p.id === "Q2FY27", display: v === null ? undefined : `${fmtNum(v, 2)}%` };
  });

  const chart = {
    annual: {
      title: "Revenue by year",
      subtitle: "Each bar is a year's revenue in ₹ Cr; the white bar is the first half of FY27 alone, already 70% of FY26.",
      data: annualBars,
      onClick: (_: BarDatum, i: number) => openPeriod(annual[i].id),
      sources: ["S44", "S29", "S41"],
    },
    quarterly: {
      title: "Revenue by quarter",
      subtitle: "Six quarters in ₹ Cr; the white bar is the latest quarter, the best in the company's history.",
      data: quarterBars,
      onClick: (_: BarDatum, i: number) => openPeriod(quarterly[i].id),
      sources: ["DECK-SC", "S39", "S30", "S92"],
    },
    margins: {
      title: "EBITDA margin by quarter",
      subtitle: "Operating profit as a share of revenue; — means the quarter's margin was not published.",
      data: marginBars,
      onClick: (_: BarDatum, i: number) => openPeriod(quarterly[i].id),
      sources: ["S39", "S30", "R-comp-2"],
    },
  }[view];

  const rupee = revenueRupeeH1FY27;

  const borrowLatest = borrowingsSeries[borrowingsSeries.length - 1];
  const invLatest = inventorySeries[inventorySeries.length - 1];

  return (
    <ChapterShell
      id="financials"
      statement="Revenue nearly doubled in a year, and margins widened while it did."
      lead="Rossell grew from ₹259.4 Cr to ₹485.2 Cr in FY26 and booked ₹340.2 Cr in the first half of FY27 alone. The cost of that growth shows up in inventory, borrowings and cash, which a ₹300 Cr raise has just reset."
    >
      {/* 1 · Overview: the headline figures, each a door to its section. */}
      <Section id="overview">
        <div id="fin-headline" className="scroll-mt-24 rounded-xl bg-surface p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-end">
            <Stat
              size="xl"
              label="FY26 · Apr 2025–Mar 2026"
              prefix="₹"
              value="485.2"
              unit="Cr"
              caption="Revenue in FY26, up 87% on FY25"
              sub="From ₹259.4 Cr in FY25. Q4 was the strongest quarter of the year."
              meta={<FactMeta sources={fy26.revenue!.sources} />}
              onClick={() => openPeriod("FY26")}
            />
            <div className="grid grid-cols-1 gap-6 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              <Stat label="H1 FY27 · Apr–Sep 2026" prefix="₹" value="340.2" unit="Cr" sub="+60% on H1 FY26; 70% of FY26 in six months" meta={<FactMeta sources={["S41", "S42"]} />} onClick={() => openPeriod("H1FY27")} />
              <Stat label="H1 FY27 EBITDA margin" value="15.3" unit="%" sub="From 13.7% in FY26" meta={<FactMeta sources={["S41"]} />} onClick={() => openKpi("q2-margin")} />
            </div>
          </div>
        </div>
        <div id="fin-glance" className="scroll-mt-24">
          <SectionHead eyebrow="At a glance" title="Four numbers behind the headline" lead="Each opens the section that explains it. EBITDA is earnings before interest, tax, depreciation and amortisation." />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <GlanceLink href="/financials/revenue#fin-latest-quarter" label="Q2 FY27 revenue" prefix="₹" value="185.5" unit="Cr" sub="+48% year on year, the best quarter yet" cta="Revenue" />
            <GlanceLink href="/financials/cost#fin-rupee" label="Material share" value="63" unit="paise" sub="Of every rupee of H1 FY27 revenue" cta="Cost" />
            <GlanceLink href="/financials/balance#fin-balance" label={`Borrowings · ${borrowLatest.label}`} prefix="₹" value={fmtNum(borrowLatest.value, 0)} unit="Cr" sub={`Inventory ₹${fmtNum(invLatest.value, 0)} Cr; FY26 operating cash flow −₹82.8 Cr`} cta="Balance sheet" />
            <GlanceLink href="/financials/raise#fin-raise" label="Preferential issue · Nov 2026" prefix="₹" value="300" unit="Cr" sub="Mostly SBI Mutual Fund; at least ₹230 Cr repays debt" cta="Capital raise" />
          </div>
        </div>
      </Section>

      {/* 2 · Revenue: annual, quarterly, margins; then the latest quarter line by line. */}
      <Section id="revenue">
        <div id="fin-revenue-chart" className="scroll-mt-24">
          <ChartFrame
            title={chart.title}
            subtitle={chart.subtitle}
            action={
              <TabTrack<View>
                size="sm"
                label="Revenue view"
                value={view}
                onChange={setView}
                options={[
                  { value: "annual", label: "Annual" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "margins", label: "Margins" },
                ]}
              />
            }
            footer={
              <>
                <span className="t-body-sm text-muted">{view === "margins" ? "%" : "₹ Cr"} · click a bar for the period</span>
                <FactMeta sources={chart.sources} />
              </>
            }
          >
            <BarChart key={view} data={chart.data} height={220} onBarClick={chart.onClick} ariaLabel={`${chart.title}. ${chart.subtitle}`} />
          </ChartFrame>
        </div>
        <div id="fin-latest-quarter" className="scroll-mt-24">
          <SectionHead eyebrow="Q2 FY27 · Jul–Sep 2026" title="The latest quarter, line by line" lead="Standalone figures unless marked. PBT is profit before tax; PAT is profit after tax. Each figure opens its history." />
          <StatRow>
            <Stat label="Revenue" prefix="₹" value="185.5" unit="Cr" sub="+48% YoY · record" meta={<FactMeta sources={q2.revenue!.sources} />} onClick={() => openKpi("q2-revenue")} />
            <Stat label="EBITDA" prefix="₹" value="29.0" unit="Cr" sub="+92% YoY" meta={<FactMeta sources={q2.ebitda!.sources} />} onClick={() => openKpi("q2-ebitda")} />
            <Stat label="EBITDA margin" value="15.6" unit="%" sub="29.0 ÷ 185.5" meta={<FactMeta sources={q2.ebitdaMarginPct!.sources} confidence="calc" />} onClick={() => openKpi("q2-margin")} />
            <Stat label="PBT" prefix="₹" value="12.7" unit="Cr" sub="First double-digit quarter" meta={<FactMeta sources={q2.pbt!.sources} />} onClick={() => openKpi("q2-pbt")} />
            <Stat label="PAT (consolidated)" prefix="₹" value="9.66" unit="Cr" sub="Standalone ₹9.4 Cr" meta={<FactMeta sources={q2.pat!.sources} />} onClick={() => openKpi("q2-pat")} />
          </StatRow>
        </div>
      </Section>

      {/* 3 · Cost: where each rupee goes, and material spend over time. */}
      <Section id="cost">
        <div id="fin-cost" className="grid scroll-mt-24 grid-cols-1 gap-6 xl:grid-cols-2">
          <div id="fin-rupee" className="scroll-mt-24">
            <ChartFrame
              eyebrow="H1 FY27 · standalone"
              title="Where each rupee of revenue went"
              subtitle="₹340.2 Cr of revenue split into what it paid for; segment width is the share of revenue."
              className="h-full"
              footer={
                <>
                  <span className="t-body-sm text-muted">Other costs is a residual (our calculation)</span>
                  <FactMeta sources={["S41", "R-scl-1"]} />
                </>
              }
            >
              <p className="mb-6 flex items-baseline gap-2">
                <span className="t-metric-lg text-on-surface tnum">63</span>
                <span className="t-body-lg text-muted">paise of every rupee is bought-in material</span>
              </p>
              <SegmentBar
                segments={rupee.parts.map((p) => ({ label: p.label, value: p.value, display: `₹${fmtNum(p.value)} Cr · ${fmtNum((p.value / rupee.revenue) * 100, 1)}%` }))}
                onSegmentClick={(s) => {
                  const p = rupee.parts.find((x) => x.label === s.label)!;
                  if (p.id === "materials") openInfo("materials");
                  else
                    setContent({
                      eyebrow: "H1 FY27 cost structure",
                      title: `${p.label}: ₹${fmtNum(p.value)} Cr`,
                      description: p.plain,
                      rows: [{ label: "Share of revenue", value: `${fmtNum((p.value / rupee.revenue) * 100, 1)}%`, meta: <FactMeta sources={["S41"]} confidence="calc" /> }],
                      sources: p.sources,
                      confidence: p.confidence,
                    });
                }}
              />
            </ChartFrame>
          </div>
          <div id="fin-materials" className="scroll-mt-24">
            <ChartFrame
              eyebrow="Material cost"
              title="Material spend, FY24 to H1 FY27"
              subtitle="₹ Cr of material consumed each period; the label under each bar is its share of revenue."
              className="h-full"
              footer={
                <>
                  <span className="t-body-sm text-muted">FY24–FY26 consolidated · H1 FY27 standalone</span>
                  <FactMeta sources={["R-scl-33", "R-scl-1"]} />
                </>
              }
            >
              <BarChart
                data={materialCostSeries.map((p) => ({ label: `${p.label} · ${p.sharePct}%`, value: p.value, display: fmtNum(p.value) }))}
                height={200}
                ariaLabel={`Material cost: ${materialCostSeries.map((p) => `${p.label} ₹${fmtNum(p.value)} Cr`).join(", ")}`}
                onBarClick={() => openInfo("materials")}
              />
            </ChartFrame>
          </div>
        </div>
      </Section>

      {/* 4 · Balance sheet and cash: the three numbers, then how they moved. */}
      <Section id="balance">
        <div id="fin-balance" className="scroll-mt-24">
          <SectionHead eyebrow="Balance sheet and cash · consolidated" title="Debt, stock and cash, at the latest dates" lead="The three numbers that move with every new program. Each opens its history." />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <Stat onClick={() => openInfo("borrowings")} label={`Borrowings · ${borrowLatest.label}`} prefix="₹" value={fmtNum(borrowLatest.value, 0)} unit="Cr" sub={`${seriesLine(borrowingsSeries)} since Mar-25`} />
              <HBar className="mt-6" value={borrowLatest.value} max={500} display={null} />
              <div className="mt-4">
                <FactMeta sources={["S59", "R-scl-2"]} />
              </div>
            </Card>
            <Card>
              <Stat onClick={() => openInfo("inventory")} label={`Inventory · ${invLatest.label}`} prefix="₹" value={fmtNum(invLatest.value, 0)} unit="Cr" sub={`${seriesLine(inventorySeries)} since Mar-24`} />
              <HBar className="mt-6" value={invLatest.value} max={500} display={null} />
              <div className="mt-4">
                <FactMeta sources={["R-scl-33", "R-scl-2"]} />
              </div>
            </Card>
            <Card>
              <Stat onClick={() => openInfo("ocf")} label="Operating cash flow · FY26" prefix="−₹" value="82.8" unit="Cr" sub="Growth absorbed cash into inventory and receivables" />
              <div className="mt-6 h-1 w-full rounded-full bg-chart-past hatch" aria-hidden />
              <div className="mt-4">
                <FactMeta sources={operatingCashFlowFY26.sources} />
              </div>
            </Card>
          </div>
        </div>
        <div id="fin-balance-trend" className="grid scroll-mt-24 grid-cols-1 gap-6 xl:grid-cols-2">
          <ChartFrame
            eyebrow="Borrowings"
            title="Debt nearly doubled in eighteen months"
            subtitle="₹ Cr at each balance-sheet date; the white bar is the latest, before the ₹300 Cr raise repays part of it."
            className="h-full"
            footer={<FactMeta sources={["S59", "R-scl-2", "S40"]} />}
          >
            <BarChart
              data={borrowingsSeries.map((p) => ({ label: p.label, value: p.value, display: fmtNum(p.value, 0) }))}
              height={160}
              max={500}
              ariaLabel={`Borrowings: ${borrowingsSeries.map((p) => `${p.label} ₹${fmtNum(p.value, 0)} Cr`).join(", ")}`}
              onBarClick={() => openInfo("borrowings")}
            />
          </ChartFrame>
          <ChartFrame
            eyebrow="Inventory"
            title="Stock on hand more than doubled since Mar-24"
            subtitle="₹ Cr at each balance-sheet date; inventory is the single biggest use of cash."
            className="h-full"
            footer={<FactMeta sources={["R-scl-33", "R-scl-2"]} />}
          >
            <BarChart
              data={inventorySeries.map((p) => ({ label: p.label, value: p.value, display: fmtNum(p.value, 0) }))}
              height={160}
              max={500}
              ariaLabel={`Inventory: ${inventorySeries.map((p) => `${p.label} ₹${fmtNum(p.value, 0)} Cr`).join(", ")}`}
              onBarClick={() => openInfo("inventory")}
            />
          </ChartFrame>
        </div>
      </Section>

      {/* 5 · The ₹300 Cr capital raise. */}
      <Section id="raise">
        <div id="fin-raise" className="grid scroll-mt-24 grid-cols-1 gap-6 rounded-xl bg-surface p-6 sm:p-10 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col gap-8">
            <Stat
              label="Preferential allotment · Nov 2026"
              prefix="₹"
              value="300"
              unit="Cr"
              caption="Raised from SBI Mutual Fund"
              sub="25,72,898 shares at ₹1,166 each, allotted 3 Nov 2026."
              meta={<FactMeta sources={fundraise.amount.sources} />}
            />
            <div className="flex flex-col gap-4">
              <HBar label="Promoter holding before" value={69.9} display="69.90%" muted />
              <HBar label="Promoter holding after" value={65.43} display="65.43%" />
              <FactMeta sources={fundraise.promoterHoldingAfterPct.sources} />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <KeyValueRows
              rows={[
                { label: "Price per share", value: "₹1,166", meta: <FactMeta sources={fundraise.pricePerShare.sources} /> },
                { label: "Check: 25,72,898 × ₹1,166", value: "₹299.99 Cr", meta: <FactMeta sources={fundraise.checkAmount.sources} confidence="calc" /> },
                { label: "Allottee", value: "SBI MF schemes (5.75%) + SBI AIF (0.64%)", meta: <FactMeta sources={["R-scl-3"]} /> },
                { label: "Earmarked to repay debt", value: "₹230 Cr+", meta: <FactMeta sources={fundraise.debtRepayment.sources} /> },
                { label: "Replaced", value: "Nov 2025 QIP (qualified institutions placement) approval", meta: <FactMeta sources={fundraise.replaced.sources} /> },
              ]}
            />
            <div>
              <Button size="sm" arrow onClick={() => openInfo("raise")}>
                Open timeline
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <InfoOverlay content={content} open={!!content} onOpenChange={(o) => !o && setContent(null)} />
    </ChapterShell>
  );
}
