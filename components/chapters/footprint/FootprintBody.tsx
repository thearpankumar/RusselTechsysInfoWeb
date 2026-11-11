"use client";

import * as React from "react";
import { BarChart, CardNested, ChartFrame, Chip, Cite, ConfidenceTag, DetailOverlay, Eyebrow, KeyValueRows, Legend, Marker, Stat, StatRow, StatusTrack } from "@/components/ui-rt";
import { Section } from "@/components/journey/Section";
import { dataBg, dataStroke, type DataColor } from "@/lib/dataColors";
import { exportFacts, floorArea, markets, sites, type FootprintSite, type MarketShare } from "@/content/footprint";
import { cn } from "@/lib/utils";
import { useIndexedOverlay } from "../portfolio/useIndexedOverlay";
import type { WorldMapData } from "./worldMap";

const MARKET_COLOR: Record<string, DataColor> = {
  "north-america": "sage",
  israel: "slate",
  europe: "tan",
  "se-asia": "lavender",
  india: "olive",
};

const fmtSqFt = (n?: number) => (n === undefined ? undefined : `${n.toLocaleString("en-IN")} sq ft`);
const siteKindLabel: Record<FootprintSite["kind"], string> = {
  plant: "Plant",
  facility: "Facility",
  office: "Registered office",
  subsidiary: "US subsidiary",
};

/* ---------- map ---------- */

function WorldMap({ map, onSite, onMarket }: { map: WorldMapData; onSite: (id: string) => void; onMarket: (id: string) => void }) {
  const pct = (p: { x: number; y: number }) => ({
    left: `${(p.x / map.width) * 100}%`,
    top: `${(p.y / map.height) * 100}%`,
  });
  const blr = map.pins["blr-plant-1"];
  const exportMarkets = markets.filter((m) => m.id !== "india");

  // Map pins: Bengaluru cluster (one marker for the campus sites), Kolkata, Tempe.
  const sitePins = [
    { id: "blr-plant-1", label: "Devanahalli campus · 3 sites", hollow: false },
    { id: "kolkata-ro", label: "Kolkata · registered office", hollow: true },
    { id: "tempe-rti", label: "Tempe, AZ · RTI", hollow: false },
  ];

  return (
    <div className="relative w-full" style={{ aspectRatio: `${map.width} / ${map.height}` }}>
      <svg viewBox={`0 0 ${map.width} ${map.height}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <path d={map.dotsPath} className="stroke-chart-past opacity-60" strokeWidth={0.42} strokeLinecap="round" fill="none" />
        {blr &&
          exportMarkets.map((m) => {
            const to = map.pins[`market-${m.id}`];
            if (!to) return null;
            const mx = (blr.x + to.x) / 2;
            const my = (blr.y + to.y) / 2 - Math.abs(blr.x - to.x) * 0.22;
            return (
              <path
                key={m.id}
                d={`M${blr.x} ${blr.y}Q${mx} ${my} ${to.x} ${to.y}`}
                className={cn("fill-none opacity-40", dataStroke[MARKET_COLOR[m.id]])}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
      </svg>

      {/* Export markets: data-coloured bubbles, sized by share of exports where disclosed. */}
      {markets.map((m) => {
        const p = map.pins[`market-${m.id}`];
        if (!p) return null;
        const size = m.sharePct ? Math.max(12, Math.round(Math.sqrt(m.sharePct) * 5)) : 10;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onMarket(m.id)}
            aria-label={`${m.region}: ${m.shareLabel}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={pct(p)}
          >
            <span
              aria-hidden
              className={cn("block rounded-full border border-background opacity-85 transition-opacity duration-150 group-hover:opacity-100", dataBg[MARKET_COLOR[m.id]])}
              style={{ width: size, height: size }}
            />
            {m.id !== "india" && (
              <span className="absolute top-full left-1/2 mt-1 hidden -translate-x-1/2 t-body-sm whitespace-nowrap text-body md:block">
                {m.region} <span className="text-muted">· {m.sharePct ? `~${m.sharePct}%` : "n/d"}</span>
              </span>
            )}
          </button>
        );
      })}

      {/* Rossell sites: white diamonds (hollow = no manufacturing). */}
      {sitePins.map((s) => {
        const p = map.pins[s.id];
        if (!p) return null;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSite(s.id)}
            aria-label={s.label}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center p-2"
            style={pct(p)}
          >
            <Marker tone="primary" shape={s.hollow ? "hollow" : "diamond"} />
            {s.id === "blr-plant-1" && <span aria-hidden className="absolute size-6 rounded-full border border-primary opacity-60" />}
            <span className={cn("absolute hidden t-body-sm whitespace-nowrap text-on-surface md:block", s.id === "kolkata-ro" ? "bottom-full mb-1" : "right-full mr-2")}>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- overlays ---------- */

function SiteDetail({ site }: { site: FootprintSite }) {
  return (
    <div className="space-y-8">
      <KeyValueRows
        rows={[
          { label: "Type", value: siteKindLabel[site.kind] },
          { label: "Location", value: `${site.city}, ${site.country}` },
          { label: "Floor area", value: fmtSqFt(site.areaSqFt) },
          {
            label: "Status",
            value: site.status === "ramping" ? "Ramping up" : "Operating",
          },
        ]}
      />
      {site.areaNote && <p className="t-body-sm text-muted">{site.areaNote}</p>}
      <div>
        <p className="mb-3 t-label-caps text-muted">What happens here</p>
        <p className="t-body-md text-body">{site.whatHappens}</p>
      </div>
      <div>
        <p className="mb-3 t-label-caps text-muted">Certifications</p>
        {site.certifications.length ? (
          <div className="flex flex-wrap gap-2">
            {site.certifications.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        ) : (
          <p className="t-body-md text-muted">— Not disclosed for this site</p>
        )}
      </div>
      <div>
        <p className="mb-4 t-label-caps text-muted">Expansion history</p>
        <ol className="space-y-4 border-l border-border pl-6">
          {site.history.map((h) => (
            <li key={h.label} className="relative">
              <span aria-hidden className="absolute top-2 -left-7 size-2 rounded-full border border-chart-mid bg-background" />
              <p className="t-mono-sm text-muted">{h.date}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 t-body-md text-on-surface">
                {h.label} <Cite ids={h.sources} />
              </p>
            </li>
          ))}
        </ol>
      </div>
      {site.note && <p className="t-body-sm text-muted">{site.note}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <Cite ids={site.sources} max={4} />
        <ConfidenceTag confidence={site.confidence} />
      </div>
    </div>
  );
}

function MarketDetail({ market }: { market: MarketShare }) {
  return (
    <div className="space-y-6">
      <KeyValueRows
        rows={[
          { label: "Countries", value: market.countries },
          { label: "Share", value: market.shareLabel },
        ]}
      />
      <p className="t-body-md text-body">{market.focus}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Cite ids={market.sources} />
        <ConfidenceTag confidence={market.confidence} />
      </div>
    </div>
  );
}

/* ---------- body ---------- */

export function FootprintBody({ map }: { map: WorldMapData }) {
  const siteOverlay = useIndexedOverlay(sites, "site");
  const marketOverlay = useIndexedOverlay(markets, "market");
  const [areaIdx, setAreaIdx] = React.useState<number | null>(null);
  const area = areaIdx === null ? null : floorArea[areaIdx];

  const legend = [
    {
      label: "Rossell site",
      tone: "primary" as const,
      shape: "diamond" as const,
    },
    {
      label: "Office, no manufacturing",
      tone: "primary" as const,
      shape: "hollow" as const,
    },
    ...markets.map((m) => ({
      label: `${m.region} · ${m.shareLabel}`,
      tone: MARKET_COLOR[m.id],
    })),
  ];

  return (
    <>
      <Section id="overview">
        <div id="footprint-stats" className="scroll-mt-24">
          <StatRow>
            <Stat
              label="Floor area"
              value="465k"
              unit="sq ft"
              caption="Bengaluru, after the new unit"
              sub="255k campus + 210k Aerospace Park"
              meta={
                <>
                  <Cite ids={["R-scl-7", "R-scl-24"]} />
                  <ConfidenceTag confidence="calc" />
                </>
              }
            />
            <Stat label="Newest site" value="210k" unit="sq ft" caption="Aerospace Park, opened 3 Nov 2026" meta={<Cite ids={["R-scl-24", "R-scl-7"]} />} />
            <Stat
              label="Exports"
              value={`~${exportFacts.exportSharePct.value}`}
              unit="%"
              caption="Of revenue"
              sub={exportFacts.exportSharePct.note}
              meta={<Cite ids={exportFacts.exportSharePct.sources} />}
            />
            <Stat label="Reach" value={String(exportFacts.countries.value)} unit="countries" caption="Exported to" meta={<Cite ids={exportFacts.countries.sources} />} />
          </StatRow>
        </div>

        <div id="footprint-map" className="scroll-mt-24">
          <ChartFrame
            title="Built in Bengaluru, flown to the world"
            subtitle="Diamonds are Rossell sites; circles are export markets, sized by share of exports where disclosed. Select any marker for detail."
            footer={
              <>
                <Legend items={legend} />
                <span className="flex flex-wrap items-center gap-2 t-body-sm text-muted">
                  North America ~80% of exports <Cite ids={["S28", "WS"]} />
                </span>
              </>
            }
          >
            <WorldMap map={map} onSite={siteOverlay.openId} onMarket={marketOverlay.openId} />
          </ChartFrame>
        </div>
      </Section>

      <Section id="sites">
        <div id="footprint-sites" className="scroll-mt-24">
          <Eyebrow>Sites</Eyebrow>
          <h3 className="mt-3 t-headline-md text-on-surface">Five addresses, one manufacturing cluster</h3>
          <p className="mt-2 t-body-md text-muted">Three Devanahalli sites sit within a few kilometres of each other near the airport; positions on the map are approximate. Select a site for its history and certifications.</p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {sites.map((s, i) => (
              <li key={s.id}>
                <CardNested onClick={() => siteOverlay.open(i)} className="flex h-full flex-col gap-4 p-4">
                  <span className="flex items-center gap-2 t-mono-sm text-muted">
                    <Marker tone="primary" shape={s.kind === "office" ? "hollow" : "diamond"} size={8} />
                    {siteKindLabel[s.kind]}
                  </span>
                  <span>
                    <span className="block t-body-lg text-on-surface">{s.short}</span>
                    <span className="mt-1 block t-body-sm text-muted">
                      {s.city}, {s.country}
                    </span>
                  </span>
                  <span className="line-clamp-3 t-body-sm text-body">{s.whatHappens}</span>
                  <span className="mt-auto t-body-sm text-body">{s.areaSqFt ? fmtSqFt(s.areaSqFt) : "Area not disclosed"}</span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="t-body-sm text-muted">{s.status === "ramping" ? "Ramping up" : "Operating"}</span>
                    <ConfidenceTag confidence={s.confidence} />
                  </span>
                </CardNested>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="area">
        <div id="footprint-area" className="scroll-mt-24">
          <ChartFrame
            title="Floor area, 2011 to today"
            subtitle="Built-up square feet in Bengaluru at each disclosure; the white bar adds the new 210,000 sq ft unit. Select a bar for the source."
            footer={
              <>
                <Cite ids={["R-scl-17", "R-scl-9", "R-scl-8", "R-scl-7", "R-scl-24"]} max={5} />
                <ConfidenceTag confidence="calc" />
                <span className="t-body-sm text-muted">Latest bar is our sum of two reported figures.</span>
              </>
            }
          >
            <BarChart
              ariaLabel="Bengaluru floor area in square feet: 4,000 in 2011; 225,000 Aug 2025; 240,000 Nov 2025; 255,000 May 2026; 465,000 Nov 2026 including the leased unit"
              data={floorArea.map((f) => ({
                label: f.label,
                value: f.value,
                display: f.display,
              }))}
              onBarClick={(_, i) => setAreaIdx(i)}
            />
            <div className="mt-8">
              <StatusTrack
                current={2}
                steps={[
                  { label: "In use", sub: "175k" },
                  { label: "Built up", sub: "255k" },
                  { label: "With new unit", sub: "465k" },
                ]}
              />
              <p className="mt-4 t-body-sm text-muted">
                May 2026: about 175,000 of 255,000 sq ft in use. <Cite ids={["R-scl-7"]} />
              </p>
            </div>
          </ChartFrame>
        </div>
      </Section>

      {/* Overlays live outside the sections so search can open them from any section. */}
      <DetailOverlay {...siteOverlay.overlayProps} eyebrow={siteOverlay.item ? `Site · ${siteOverlay.item.city}` : undefined} title={siteOverlay.item?.name ?? ""}>
        {siteOverlay.item && <SiteDetail site={siteOverlay.item} />}
      </DetailOverlay>

      <DetailOverlay {...marketOverlay.overlayProps} eyebrow="Export market" title={marketOverlay.item?.region ?? ""}>
        {marketOverlay.item && <MarketDetail market={marketOverlay.item} />}
      </DetailOverlay>

      <DetailOverlay
        open={area !== null}
        onOpenChange={(o) => !o && setAreaIdx(null)}
        eyebrow="Floor area"
        title={area ? `${area.value.toLocaleString("en-IN")} sq ft` : ""}
        description={area?.detail}
        index={areaIdx ?? 0}
        total={floorArea.length}
        onPrev={() => setAreaIdx((i) => ((i ?? 0) - 1 + floorArea.length) % floorArea.length)}
        onNext={() => setAreaIdx((i) => ((i ?? 0) + 1) % floorArea.length)}
      >
        {area && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="t-mono-sm text-muted">{area.label}</span>
            <Cite ids={area.sources} />
            <ConfidenceTag confidence={area.confidence} />
          </div>
        )}
      </DetailOverlay>
    </>
  );
}
