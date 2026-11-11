"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import {
  Card,
  CardNested,
  ChipCount,
  Cite,
  ConfidenceTag,
  DetailOverlay,
  Eyebrow,
  IconButton,
  KeyValueRows,
  SegmentBar,
  Stat,
  StatRow,
  StatusTrack,
} from "@/components/ui-rt";
import { Section } from "@/components/journey/Section";
import { businessModel, certificationGaps, certifications, company } from "@/content/company";
import { awarderLogos, awardsWall, buildSplit, certIssuers, cmVsDistributor, cmVsDistributorSources, journey, type AwardTile } from "@/content/portfolio";
import { cn } from "@/lib/utils";
import { useIndexedOverlay } from "./useIndexedOverlay";
import { IssuerLogoMark, getIssuerLogo } from "./IssuerLogo";

/** LOGO-<id> credit for an issuer mark, when one is shown. */
const logoSource = (id?: string) => (id && getIssuerLogo(id) ? [`LOGO-${id}`] : []);

/* ---------- search ---------- */


/* ---------- pieces ---------- */

function Meta({ sources, confidence }: { sources: string[]; confidence: Parameters<typeof ConfidenceTag>[0]["confidence"] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Cite ids={sources} />
      <ConfidenceTag confidence={confidence} />
    </span>
  );
}

function Identity() {
  const rows = [
    { label: "Legal name", value: company.legalName, meta: <Cite ids={["S33", "S77"]} /> },
    { label: "Founded", value: "Early 2011", meta: <Cite ids={company.founded.sources} /> },
    { label: "Headquarters", value: "Devanahalli, Bengaluru", meta: <Cite ids={company.headquarters.sources} /> },
    { label: "Registered office", value: "Kolkata, West Bengal", meta: <Cite ids={company.registeredOffice.sources} /> },
    { label: "Parent", value: "Demerged from Rossell India, 2024", meta: <Cite ids={company.parent.sources} /> },
    { label: "Managing Director", value: "Rishab Mohan Gupta", meta: <Cite ids={["R-ppl-2", "S77"]} /> },
    { label: "Chief Executive", value: "Senthil Balasubramanian", meta: <Cite ids={company.ceo.sources} /> },
    { label: "Reporting segments", value: "One", meta: <Cite ids={company.segments.sources} /> },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <Eyebrow>In one line</Eyebrow>
        <p className="mt-6 t-headline-md text-on-surface">
          Customers send drawings and a parts list; Rossell buys every part, builds the harness, panel or assembly, tests it and ships it.
        </p>
        <p className="mt-6 t-body-md text-body">{company.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Cite ids={["S76", "S73", "S46"]} />
        </div>
      </Card>
      <Card title="The company at a glance">
        <KeyValueRows rows={rows} />
      </Card>
    </div>
  );
}

function Timeline() {
  const [current, setCurrent] = React.useState(journey.length - 1);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const overlay = useIndexedOverlay(journey, "milestone");
  const stop = journey[current];

  const select = (i: number) => setCurrent(Math.max(0, Math.min(journey.length - 1, i)));

  React.useEffect(() => {
    const el = trackRef.current?.querySelector<HTMLElement>('[aria-current="step"]');
    const scroller = trackRef.current?.firstElementChild as HTMLElement | null;
    if (!el || !scroller) return;
    const left = el.offsetLeft - scroller.clientWidth / 2 + el.clientWidth / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
  }, [current]);

  return (
    <Card
      title="Fifteen years in fourteen stops"
      action={
        <span className="flex items-center gap-2">
          <span className="mr-2 t-mono-sm tnum text-muted">
            {String(current + 1).padStart(2, "0")} / {String(journey.length).padStart(2, "0")}
          </span>
          <IconButton label="Previous milestone" icon={<ChevronLeft />} size="sm" onClick={() => select(current - 1)} disabled={current === 0} />
          <IconButton label="Next milestone" icon={<ChevronRight />} size="sm" onClick={() => select(current + 1)} disabled={current === journey.length - 1} />
        </span>
      }
    >
      <div
        ref={trackRef}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            e.stopPropagation();
            select(current + (e.key === "ArrowRight" ? 1 : -1));
          }
        }}
        data-lenis-prevent
      >
        <StatusTrack
          className="pb-4"
          current={current}
          onStepClick={select}
          steps={journey.map((j) => ({ label: j.label, sub: j.when }))}
        />
      </div>
      {/* Whole card opens the milestone via a stretched button; the Cite chip stays a sibling (no nested buttons). */}
      <CardNested interactive className="relative mt-6">
        <button type="button" onClick={() => overlay.open(current)} aria-label={`Open ${stop.label}`} className="absolute inset-0 cursor-pointer rounded-lg" />
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="t-mono-sm text-muted">{stop.when}</span>
          <span className="t-body-lg text-on-surface">{stop.label}</span>
        </div>
        <p className="mt-3 max-w-3xl t-body-md text-body">{stop.detail}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="relative">
            <Meta sources={stop.sources} confidence={stop.confidence} />
          </span>
          <span aria-hidden className="ml-auto t-body-sm text-muted">Open →</span>
        </div>
      </CardNested>

      <DetailOverlay
        {...overlay.overlayProps}
        eyebrow={overlay.item ? `Milestone · ${overlay.item.when}` : undefined}
        title={overlay.item?.label ?? ""}
        description={overlay.item?.detail}
      >
        {overlay.item && (
          <div className="space-y-6">
            <KeyValueRows
              rows={[
                { label: "When", value: overlay.item.when },
                { label: "Kind", value: overlay.item.kind.charAt(0).toUpperCase() + overlay.item.kind.slice(1) },
                { label: "Position on the journey", value: `${overlay.index! + 1} of ${journey.length}` },
              ]}
            />
            {overlay.item.note && <p className="t-body-sm text-muted">{overlay.item.note}</p>}
            <Meta sources={overlay.item.sources} confidence={overlay.item.confidence} />
          </div>
        )}
      </DetailOverlay>
    </Card>
  );
}

function BusinessModel() {
  const overlay = useIndexedOverlay(businessModel, "business-model");
  return (
    <div id="portfolio-model" className="grid grid-cols-1 scroll-mt-24 gap-6 lg:grid-cols-[2fr_3fr]">
      <Card title="How the work arrives">
        <p className="t-body-md text-body">Roughly nine jobs in ten arrive as finished designs; Rossell designs the detail for the rest.</p>
        <SegmentBar
          className="mt-8"
          segments={[
            { label: "Build-to-print: the customer owns the design", value: buildSplit.btpPct, index: "BTP", display: `~${buildSplit.btpPct}%` },
            { label: "Build-to-spec: Rossell completes the design", value: buildSplit.btsPct, index: "BTS", display: `~${buildSplit.btsPct}%` },
          ]}
        />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Cite ids={buildSplit.sources} />
          <span className="t-body-sm text-muted">{buildSplit.note}</span>
        </div>
        <ul className="mt-8 divide-y divide-border border-t border-border">
          {businessModel.map((b, i) => (
            <li key={b.id}>
              <button type="button" onClick={() => overlay.open(i)} className="flex w-full cursor-pointer items-center gap-3 py-3 text-left transition-colors duration-150 hover:text-on-surface">
                <span className="t-mono-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-body-md text-body">{b.name}</span>
                <span aria-hidden className="ml-auto t-body-sm text-muted">→</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Contract manufacturer, not distributor">
        <p className="t-body-md text-body">The difference explains why one late part can hold up a whole shipment.</p>
        <div className="mt-8 overflow-x-auto" data-lenis-prevent>
          <table className="w-full min-w-xl border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 t-mono-sm text-muted">Aspect</th>
                <th className="py-3 pr-4 t-body-md text-on-surface">Rossell (contract manufacturer)</th>
                <th className="py-3 t-body-md text-body">A distributor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cmVsDistributor.map((r) => (
                <tr key={r.aspect} className="align-top">
                  <td className="py-3 pr-4 t-body-sm text-muted">{r.aspect}</td>
                  <td className="py-3 pr-4 t-body-md text-on-surface">{r.cm}</td>
                  <td className="py-3 t-body-md text-body">{r.distributor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <Meta {...cmVsDistributorSources} />
        </div>
      </Card>

      <DetailOverlay {...overlay.overlayProps} eyebrow="Business model" title={overlay.item?.name ?? ""} description={overlay.item?.plain}>
        {overlay.item && <Meta sources={overlay.item.sources} confidence={overlay.item.confidence} />}
      </DetailOverlay>
    </div>
  );
}

function Certifications() {
  const overlay = useIndexedOverlay(certifications, "certification");
  return (
    <section id="portfolio-certifications" aria-labelledby="portfolio-cert-title" className="scroll-mt-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Certifications</Eyebrow>
          <h3 id="portfolio-cert-title" className="mt-3 t-headline-md text-on-surface">
            {certifications.length} approvals that let them build for aircraft, defence and the US
          </h3>
        </div>
        <ChipCount>{certifications.length} held</ChipCount>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {certifications.map((c, i) => {
          const issuer = certIssuers[c.id];
          const logo = issuer?.logo && getIssuerLogo(issuer.logo) ? issuer.logo : undefined;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => overlay.open(i)}
                className="group relative isolate flex h-full min-h-36 w-full cursor-pointer flex-col justify-end gap-4 overflow-hidden rounded-md border border-border bg-surface p-4 text-left transition-colors duration-150 hover:border-chart-past hover:bg-surface-raised"
              >
                {/* Issuer mark as a large background graphic, cropped by the card's top-right edge. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-3 -right-3 -z-10 flex h-20 w-[82%] items-center justify-end text-chart-past opacity-50 transition-[color,opacity] duration-200 ease-out group-hover:text-chart-mid group-hover:opacity-50 motion-reduce:transition-none"
                >
                  {logo ? (
                    <IssuerLogoMark id={logo} area={6400} maxHeight={80} maxWidth="100%" />
                  ) : (
                    <ShieldCheck className="size-20" strokeWidth={1} />
                  )}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="t-body-md text-on-surface">{c.name}</span>
                  {issuer && (
                    <span className="t-body-sm text-muted">
                      {issuer.role} {issuer.body}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
        {certificationGaps.map((g) => (
          <li key={g.value}>
            <div className="flex h-full min-h-32 flex-col justify-between gap-4 rounded-md border border-dashed border-border p-4">
              <span className="t-mono-sm text-muted">Gap</span>
              <span className="t-body-sm text-body">{g.value}</span>
            </div>
          </li>
        ))}
      </ul>
      <DetailOverlay
        {...overlay.overlayProps}
        eyebrow="Certification"
        title={overlay.item?.name ?? ""}
        description={overlay.item?.scope}
      >
        {overlay.item && (
          <div className="space-y-6">
            <KeyValueRows
              rows={[
                { label: "Held by", value: overlay.item.holder ?? "Rossell Techsys Ltd" },
                ...(certIssuers[overlay.item.id] ? [{ label: certIssuers[overlay.item.id].role, value: certIssuers[overlay.item.id].body }] : []),
                { label: "Valid to", value: overlay.item.validTo },
              ]}
            />
            <Meta sources={[...overlay.item.sources, ...logoSource(certIssuers[overlay.item.id]?.logo)]} confidence={overlay.item.confidence} />
          </div>
        )}
      </DetailOverlay>
    </section>
  );
}

function Awards() {
  const byAwarder = React.useMemo(() => {
    const m = new Map<string, AwardTile[]>();
    for (const a of awardsWall) m.set(a.by, [...(m.get(a.by) ?? []), a]);
    return [...m.entries()];
  }, []);
  const [filter, setFilter] = React.useState<string | null>(null);
  const overlay = useIndexedOverlay(awardsWall, "award");
  const shown = awardsWall.map((a, i) => ({ a, i })).filter(({ a }) => !filter || a.by === filter);

  return (
    <section id="portfolio-awards" aria-labelledby="portfolio-awards-title" className="scroll-mt-24">
      <div className="mb-8">
        <Eyebrow>Awards</Eyebrow>
        <h3 id="portfolio-awards-title" className="mt-3 t-headline-md text-on-surface">
          Recognised by the customers who audit them hardest
        </h3>
        <p className="mt-2 t-body-md text-muted">Choose a customer to see what they awarded; choose it again to show all.</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {byAwarder.map(([by, list]) => {
          const active = filter === by;
          const dimmed = filter !== null && !active;
          const logoId = awarderLogos[by];
          const logo = logoId ? getIssuerLogo(logoId) : undefined;
          // Show the name under emblem marks, and where the mark is a parent brand (TLMAL under Tata).
          const showName = !logo || logo.caption || logo.title !== by;
          const count = `${list.length} ${list.length === 1 ? "award" : "awards"}`;
          return (
            <li key={by}>
              <button
                type="button"
                aria-pressed={active}
                aria-label={`${by}, ${count}`}
                onClick={() => setFilter(active ? null : by)}
                className={cn(
                  "flex h-full min-h-36 w-full cursor-pointer flex-col items-center gap-3 rounded-md p-4 text-center transition-[opacity,background-color] duration-150",
                  dimmed ? "bg-chart-past text-on-surface opacity-60" : "bg-primary text-on-primary hover:opacity-90"
                )}
              >
                <span className="flex min-h-16 w-full flex-1 flex-col items-center justify-center gap-2">
                  {logo && logoId && <IssuerLogoMark id={logoId} area={2400} maxHeight={logo.caption ? 48 : 52} maxWidth="80%" />}
                  {showName && <span className={cn("t-body-sm leading-tight text-balance", logo && "opacity-70")}>{by}</span>}
                </span>
                <span className="inline-flex h-6 shrink-0 items-center rounded-full border border-current/25 px-2 t-body-sm leading-none tnum">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {shown.map(({ a, i }) => (
          <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4 sm:flex-nowrap">
            <button
              type="button"
              onClick={() => overlay.open(i)}
              className="grid min-w-0 flex-1 cursor-pointer grid-cols-[8rem_1fr] items-baseline gap-4 rounded-md text-left transition-colors duration-150 hover:text-on-surface"
            >
              <span className="t-mono-sm text-muted">{a.year}</span>
              <span>
                <span className="block t-body-lg text-on-surface">{a.name}</span>
                <span className="block t-body-sm text-muted">{a.by}</span>
              </span>
            </button>
            <Cite ids={a.sources} />
          </li>
        ))}
      </ul>
      <DetailOverlay
        {...overlay.overlayProps}
        eyebrow={overlay.item ? `Award · ${overlay.item.by}` : undefined}
        title={overlay.item?.name ?? ""}
        description={overlay.item?.detail}
      >
        {overlay.item && (
          <div className="space-y-6">
            <KeyValueRows
              rows={[
                { label: "Awarded by", value: overlay.item.by },
                { label: "Year", value: overlay.item.year },
              ]}
            />
            <Meta sources={[...overlay.item.sources, ...logoSource(awarderLogos[overlay.item.by])]} confidence={overlay.item.confidence} />
          </div>
        )}
      </DetailOverlay>
    </section>
  );
}

function Listing() {
  return (
    <section aria-label="Listing facts">
      <Eyebrow>Listing</Eyebrow>
      <StatRow className="mt-8">
        <Stat label="NSE" value="ROSSTECH" caption="Ticker" meta={<Cite ids={company.listing.nse.sources} />} />
        <Stat label="BSE" value="544294" caption="Scrip code" meta={<Cite ids={company.listing.bse.sources} />} />
        <Stat label="Listed" value="9 Dec" unit="2024" caption="After the demerger" meta={<Cite ids={company.listing.listedOn.sources} />} />
        <Stat label="Raised" prefix="₹" value="300" unit="Cr" caption="Preferential issue, Nov 2026" sub="Mostly SBI Mutual Fund" meta={<Cite ids={["S86", "R-scl-3"]} />} />
      </StatRow>
    </section>
  );
}

export function PortfolioBody() {
  return (
    <>
      <Section id="overview">
        <div id="portfolio-identity" className="scroll-mt-24">
          <Identity />
        </div>
        <div id="portfolio-listing" className="scroll-mt-24">
          <Listing />
        </div>
      </Section>
      <Section id="journey">
        <div id="portfolio-timeline" className="scroll-mt-24">
          <Timeline />
        </div>
      </Section>
      <Section id="model">
        <BusinessModel />
      </Section>
      <Section id="approvals">
        <Certifications />
        <Awards />
      </Section>
    </>
  );
}
