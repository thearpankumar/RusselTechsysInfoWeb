"use client";

// 10 · Scale: the four numbers (orders, order value, finished goods delivered, materials procured), the planning
// load, the 96-line all-or-nothing bill of materials, and the order wins on the record.
import * as React from "react";
import Link from "next/link";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { Card } from "@/components/ui-rt/Card";
import { ChartFrame } from "@/components/ui-rt/ChartFrame";
import { Cite } from "@/components/ui-rt/Cite";
import { ConfidenceTag } from "@/components/ui-rt/ConfidenceTag";
import { KeyValueRows } from "@/components/ui-rt/KeyValueRows";
import { StatRow } from "@/components/ui-rt/StatRow";
import { scale, type ScaleMetricX } from "@/content/scale";
import type { Confidence } from "@/content/types";
import { orders, orderDisclosure, type OrderWin } from "@/content/orders";
import { illustrativeBom } from "@/content/materials";
import { useSearchOpen } from "@/lib/searchIndex";
import { DoorStat as Stat, FactMeta, InfoOverlay, SectionHead, useOverlayList, type InfoContent } from "./financials/shared";
import { BomGrid } from "./scale/BomGrid";

const m = (id: string) => scale.find((s) => s.id === id)!;
const fmt = (v: string | number) => (typeof v === "number" ? v.toLocaleString("en-IN") : v);

const ordersSorted = [...orders].sort((a, b) => b.date.localeCompare(a.date));
const isUndisclosed = (v: string) => /^not disclosed/i.test(v);

function metricContent(s: ScaleMetricX): InfoContent {
  return {
    eyebrow: `Scale${s.asOf ? ` · ${s.asOf}` : ""}`,
    title: s.undisclosed ? `${s.label}: —` : `${fmt(s.value)}${s.unit ? ` ${s.unit}` : ""}`,
    description: s.undisclosed ? s.plain : `${s.label}. ${s.plain}`,
    notes: [...(s.method ? [{ label: "Method", text: s.method }] : []), ...(s.note ? [{ text: s.note }] : [])],
    sources: s.sources,
    confidence: s.confidence,
  };
}

function orderContent(o: OrderWin): InfoContent {
  return {
    eyebrow: `Order · ${o.when}`,
    title: o.title,
    description: o.product,
    rows: [
      { label: "Customer", value: o.customer },
      { label: "Value", value: isUndisclosed(o.value) ? null : o.value, meta: isUndisclosed(o.value) ? <span className="t-body-sm text-muted">{o.value}</span> : undefined },
      { label: "Duration", value: o.duration === "—" ? null : o.duration },
      { label: "Kind", value: o.kind === "aggregate" ? "Quarterly / annual total" : o.kind === "agreement" ? "Agreement / LOI" : "Contract" },
    ],
    notes: o.note ? [{ label: "Caveat", text: o.note }] : undefined,
    sources: o.sources,
    confidence: o.confidence,
  };
}

/** Cite chips plus an explicit confidence tag (shown for reported figures too, so each number says how sure it is). */
function Meta({ sources, confidence }: { sources: string[]; confidence: Confidence }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Cite ids={sources} />
      <ConfidenceTag confidence={confidence} showReported />
    </span>
  );
}

interface ScoreLine {
  /** Scale metric id (opens its overlay). */
  id: string;
  text: React.ReactNode;
}

/** One of the four equal cells of "The four numbers" (2 × 2; one row of four on wide screens): a headline figure and the supporting figures under it, each with its source. */
function ScoreCell({
  label,
  id,
  value,
  prefix,
  unit,
  caption,
  lines,
  extra,
  onOpen,
}: {
  label: string;
  id: string;
  value: React.ReactNode;
  prefix?: string;
  unit?: string;
  caption: React.ReactNode;
  lines: ScoreLine[];
  extra?: React.ReactNode;
  onOpen: (id: string) => void;
}) {
  const s = m(id);
  return (
    <div className="flex h-full flex-col">
      <Stat label={label} value={value} prefix={prefix} unit={unit} caption={caption} onClick={() => onOpen(id)} meta={<Meta sources={s.sources} confidence={s.confidence} />} />
      <ul className="mt-6 flex flex-col gap-4 border-t border-border pt-4">
        {lines.map((l) => {
          const x = m(l.id);
          return (
            <li key={l.id}>
              <button type="button" onClick={() => onOpen(l.id)} className="cursor-pointer text-left t-body-md text-on-surface transition-colors duration-150 hover:text-body">
                {l.text}
              </button>
              <div className="mt-2">
                <Meta sources={x.sources} confidence={x.confidence} />
              </div>
            </li>
          );
        })}
        {extra && <li>{extra}</li>}
      </ul>
    </div>
  );
}

function FourNumbers({ onOpen }: { onOpen: (id: string) => void }) {
  const filings = m("order-filings");
  const book = m("order-book");
  const fy26 = m("orders-fy26");
  const h1 = m("new-orders-h1");
  const units = m("units-all-customers");
  const boeing = m("boeing-assemblies");
  const bought = m("purchases-fy26");
  const consumed = m("materials-fy26");
  return (
    <div id="scale-four" className="scroll-mt-24 rounded-xl bg-surface p-6 sm:p-10">
      <p className="mb-6 t-label-caps text-muted">The four numbers</p>
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 2xl:grid-cols-4 [&>div]:border-t [&>div]:border-border [&>div]:pt-6">
        <ScoreCell
          label="Order count"
          id="order-count"
          value={null}
          caption="Not disclosed"
          onOpen={onOpen}
          lines={[{ id: "order-filings", text: <>What is known: {fmt(filings.value)} formal &lsquo;receipt of order&rsquo; filings</> }]}
          extra={
            <Link href="/scale/orders" className="t-body-md text-body underline underline-offset-4 transition-colors duration-150 hover:text-on-surface">
              Order wins are listed under Orders
            </Link>
          }
        />
        <ScoreCell
          label="Order value"
          id="order-book"
          prefix="₹"
          value={fmt(book.value)}
          unit="Cr"
          caption="Order book · Sep 2026"
          onOpen={onOpen}
          lines={[
            { id: "orders-fy26", text: <>₹{fmt(fy26.value)} Cr orders won in FY26</> },
            { id: "new-orders-h1", text: <>₹{fmt(h1.value)} Cr new orders in H1 FY27</> },
          ]}
        />
        <ScoreCell
          label="Finished goods delivered"
          id="units-all-customers"
          value={fmt(units.value)}
          unit="units"
          caption="All customers · by Jan 2024"
          onOpen={onOpen}
          lines={[{ id: "boeing-assemblies", text: <>{fmt(boeing.value)} assemblies to Boeing alone, by Sep 2025</> }]}
        />
        <ScoreCell
          label="Materials procured"
          id="purchases-fy26"
          prefix="~₹"
          value={fmt(bought.value)}
          unit="Cr"
          caption="Purchases · FY26 · select for the method"
          onOpen={onOpen}
          lines={[{ id: "materials-fy26", text: <>₹{fmt(consumed.value)} Cr of material consumed in FY26</> }]}
        />
      </div>
    </div>
  );
}

export default function Scale() {
  const [metric, setMetric] = React.useState<InfoContent | null>(null);
  const ov = useOverlayList(ordersSorted, "order");
  const openMetric = React.useCallback((id: string) => {
    const s = scale.find((x) => x.id === id);
    if (s) setMetric(metricContent(s));
  }, []);
  useSearchOpen("scale", openMetric);

  const statFor = (id: string, opts: { value?: string; prefix?: string; unit?: string; sub?: string; label?: string } = {}) => {
    const s = m(id);
    return (
      <Stat
        label={opts.label ?? s.label}
        prefix={opts.prefix}
        value={s.undisclosed ? null : (opts.value ?? fmt(s.value))}
        unit={opts.unit ?? s.unit}
        sub={opts.sub ?? s.plain}
        meta={<FactMeta sources={s.sources} confidence={s.confidence} className="max-w-full min-w-0" />}
        onClick={() => openMetric(id)}
      />
    );
  };

  return (
    <ChapterShell
      id="scale"
      statement="Hundreds of thousands of assemblies, built one complete kit at a time."
      lead="Rossell had supplied more than 175,000 units to its customers by January 2024 and more than 160,000 assemblies to Boeing alone by September 2025. It buys hundreds of crores of material a year across thousands of parts. Every one of those builds needs every line of its bill of materials on the shelf at once."
    >
      <Section id="overview">
        <FourNumbers onOpen={openMetric} />
        <div id="scale-delivered" className="scroll-mt-24">
          <SectionHead eyebrow="Behind the delivered count" title="Part numbers, programmes and pace" />
          <StatRow>
            {statFor("skus", { label: "SKUs · Sep 2025", sub: "Finished-good part numbers (stock-keeping units)" })}
            {statFor("t7a-ewis-parts", { label: "T-7A EWIS parts", unit: "unique", sub: "2022 IDIQ, 10 years" })}
            {statFor("t7a-shipsets", { label: "T-7A panel shipsets", unit: "shipsets", sub: "Up to; 2025 IDIQ, through 2033" })}
            {statFor("boeing-rate", { label: "To Boeing per year", sub: "Jun 2022 to Sep 2025, rough" })}
          </StatRow>
        </div>
      </Section>

      <Section id="planning">
        <div id="scale-planning" className="scroll-mt-24">
          <SectionHead eyebrow="What planning has to hold" title="Projects, demand lines and material" lead="Working-session figures are marked; estimates show their method on click." />
          <StatRow>
            {statFor("projects", { label: "Running projects", sub: "Live at once, each with its own bills of materials" })}
            {statFor("lines-per-project", { label: "Demand lines per project", value: "3", unit: "lakh (up to)", sub: "Up to ~1.32 crore lines in total" })}
            {statFor("materials-h1", { label: "Material · H1 FY27", prefix: "₹", unit: "Cr", sub: "~63% of revenue" })}
            {statFor("materials-run-rate", { label: "Material run-rate · Q2 FY27", prefix: "₹", unit: "Cr / month", sub: "About ₹1.3 Cr a day" })}
          </StatRow>
        </div>
        <div id="scale-undisclosed" className="grid scroll-mt-24 grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <button type="button" onClick={() => openMetric("materials-count")} className="block cursor-pointer text-left">
              <span className="block t-mono-sm text-muted">Materials and suppliers</span>
              <span className="mt-4 block t-headline-md text-on-surface transition-colors duration-150 hover:text-body">Thousands of materials across hundreds of suppliers.</span>
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <FactMeta sources={m("materials-count").sources} confidence="session" />
            </div>
          </Card>
          <Card>
            <p className="mb-2 t-mono-sm text-muted">Not disclosed publicly</p>
            <KeyValueRows
              rows={["order-count", "supplier-count", "material-count"].map((id) => ({
                label: m(id).label,
                value: null,
                meta: <span className="t-body-sm text-muted">Not disclosed publicly</span>,
                onClick: () => openMetric(id),
              }))}
            />
          </Card>
        </div>
      </Section>

      <Section id="bom">
        <div id="scale-bom" className="scroll-mt-24">
          <ChartFrame
            eyebrow={`Bundle ${illustrativeBom.fgPartNo} · ${illustrativeBom.lineCount} lines`}
            title="96 lines, all or nothing"
            subtitle="Each square is one line of the bundle's bill of materials; click any line to mark it short and watch what can be built."
          >
            <p className="-mt-4 mb-8 max-w-3xl t-body-lg text-body">{illustrativeBom.rule}</p>
            <BomGrid />
          </ChartFrame>
        </div>
      </Section>

      <Section id="orders">
        <div id="scale-orders" className="scroll-mt-24">
          <SectionHead
            eyebrow="Orders"
            title="Contracts, agreements and quarterly totals"
            lead="As disclosed. Rossell does not publish a count of orders. Each row opens its sources."
            action={<FactMeta sources={orderDisclosure.sources} />}
          />
          <div className="rounded-xl bg-surface p-6 sm:p-10">
            <KeyValueRows
              rows={[
                {
                  label: "Number of orders",
                  value: null,
                  meta: <span className="t-body-sm text-muted">Not disclosed publicly</span>,
                  onClick: () => openMetric("order-count"),
                },
                {
                  label: "Orders filed as 'receipt of order'",
                  value: fmt(m("order-filings").value),
                  onClick: () => openMetric("order-filings"),
                },
                ...ordersSorted.map((o, i) => ({
                  label: (
                    <span className="flex flex-col">
                      <span className="t-body-md text-on-surface">{o.title}</span>
                      <span className="t-body-sm text-muted">
                        {o.when} · {o.customer}
                      </span>
                    </span>
                  ),
                  value: isUndisclosed(o.value) ? null : o.value,
                  meta: (
                    <span className="inline-flex items-center gap-2">
                      {isUndisclosed(o.value) && <span className="t-body-sm text-muted">Not disclosed publicly</span>}
                      {o.confidence !== "reported" && <ConfidenceTag confidence={o.confidence} />}
                    </span>
                  ),
                  onClick: () => ov.openAt(i),
                })),
              ]}
            />
          </div>
        </div>
      </Section>

      <InfoOverlay content={metric} open={!!metric} onOpenChange={(o) => !o && setMetric(null)} />
      <InfoOverlay
        content={ov.item ? orderContent(ov.item) : null}
        open={ov.open}
        onOpenChange={ov.onOpenChange}
        index={ov.index ?? undefined}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      />
    </ChapterShell>
  );
}
