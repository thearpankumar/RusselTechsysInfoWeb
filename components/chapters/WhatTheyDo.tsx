"use client";

// 06 · What they do — four photo-led domain cards (each with a one-line ordering pattern strip) and the services catalogue.
import * as React from "react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { Card, Chip, Cite, ConfidenceTag, DetailOverlay, Eyebrow, KeyValueRows, PhotoCard, SegmentBar, Stat, StatRow } from "@/components/ui-rt";
import { domainOrderingNote, domains, services } from "@/content/domains";
import { DOMAIN_COLOR, getClient } from "@/content/clients";
import { DOMAIN_PHOTO } from "@/content/assets";
import { products } from "@/content/products";
import { useSearchOpen } from "@/lib/searchIndex";
import { dataBg } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { useIndexOverlay } from "./anatomy/shared";
import { OrderingStrip } from "./whattheydo/OrderingStrip";

type Service = (typeof services)[number] & { id: string };
const serviceList: Service[] = services.map((s) => ({ ...s, id: s.key }));

// Mix facts from the earnings calls (research/scale-clients.json → R-scl-*).
const EWIS_SHARE = { value: 70, asOf: "Aug 2025", note: "Balance of ~30% from panels, test equipment and other capabilities.", sources: ["R-scl-19"], confidence: "reported" as const };
const BTP_BTS = { btp: 90, bts: 10, asOf: "Feb 2026", note: "Approximate, as stated on the Q3 FY26 call.", sources: ["R-scl-15"], confidence: "reported" as const };

export default function WhatTheyDo() {
  const dom = useIndexOverlay(domains);
  const svc = useIndexOverlay(serviceList);

  const openDom = dom.open;
  const openSvc = svc.open;
  useSearchOpen("domain", React.useCallback((id: string) => openDom(id), [openDom]));
  useSearchOpen("service", React.useCallback((id: string) => openSvc(id), [openSvc]));

  const d = dom.current;
  const s = svc.current;
  const svcProducts = s ? products.filter((p) => p.services.includes(s.key)) : [];

  return (
    <ChapterShell
      id="what-they-do"
      statement="Four domains, four ways of ordering."
      lead="Rossell builds wiring and electrical assemblies to its customers' designs. The product is similar across domains; the way customers order it is not, and planning has to bring all four patterns into one view of demand."
    >
      <Section id="overview">
        <div id="wtd-domains" className="scroll-mt-24">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {domains.map((dm, i) => (
              <li key={dm.id}>
                {/* Whole card opens the domain via a stretched button; the photo credit link stays a sibling (no nested interactive elements). */}
                <Card interactive className="flex h-full flex-col">
                  <button type="button" onClick={() => dom.open(dm.id)} aria-label={`Open ${dm.name}`} className="absolute inset-0 cursor-pointer rounded-xl" />
                  <span className="flex items-center gap-3">
                    <span aria-hidden className={cn("size-2.5 rounded-full", dataBg[DOMAIN_COLOR[dm.id]])} />
                    <span className="t-body-lg text-on-surface">{dm.name}</span>
                  </span>
                  <PhotoCard
                    asset={DOMAIN_PHOTO[dm.id as keyof typeof DOMAIN_PHOTO]}
                    ratio="3/2"
                    sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 100vw"
                    className="relative z-10 mt-6"
                    priority={i < 2}
                    onClick={() => dom.open(dm.id)}
                  />
                  <OrderingStrip shape={dm.shape} className="mt-6 border-y border-border py-2 box-content" />
                  <span className="mt-6 block t-headline-md text-on-surface">{dm.orderingPattern}</span>
                  <span className="mt-2 block t-body-md text-body">{dm.orderingDetail}</span>
                  <span className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                    <ConfidenceTag confidence={dm.confidence} />
                    <span className="t-body-sm text-muted">{dm.customers.length} {dm.customers.length === 1 ? "customer" : "customers"} mapped</span>
                  </span>
                </Card>
              </li>
            ))}
          </ul>
          <p className="mt-6 flex flex-wrap items-center gap-2 t-body-md text-muted">
            {domainOrderingNote.text}
            <ConfidenceTag confidence={domainOrderingNote.confidence} />
            <Cite ids={domainOrderingNote.sources} />
          </p>
        </div>
      </Section>

      <Section id="services">
        <section id="what-they-do-services" className="scroll-mt-24" aria-labelledby="wtd-services">
          <Eyebrow id="wtd-services">Services catalogue</Eyebrow>
          <ul className="mt-8 grid grid-cols-1 gap-x-12 border-t border-border md:grid-cols-2">
            {serviceList.map((sv) => (
              <li key={sv.key} className="border-b border-border">
                <button type="button" onClick={() => svc.open(sv.key)} className="group flex w-full cursor-pointer items-start gap-4 py-6 text-left">
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3">
                      <span className="t-body-lg text-on-surface underline-offset-4 group-hover:underline">{sv.label}</span>
                      <span className="t-mono-sm text-muted">{sv.short}</span>
                    </span>
                    <span className="mt-2 block t-body-md text-body">{sv.plain}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ConfidenceTag confidence="reported" showReported />
            <Cite ids={["S76", "S73", "S33"]} />
          </div>
        </section>
      </Section>

      <Section id="mix">
        <section id="wtd-mix" className="scroll-mt-24" aria-labelledby="wtd-mix-title">
          <Eyebrow id="wtd-mix-title">How the work splits</Eyebrow>
          <StatRow className="mt-8">
            <Stat
              label="EWIS share of revenue"
              value={EWIS_SHARE.value}
              unit="%"
              caption="Wire harnesses / EWIS (electrical wiring interconnection systems)"
              sub={`${EWIS_SHARE.asOf} · ${EWIS_SHARE.note}`}
              meta={<Cite ids={EWIS_SHARE.sources} />}
            />
            <Stat
              label="Build-to-print vs build-to-spec"
              value={`${BTP_BTS.btp} / ${BTP_BTS.bts}`}
              unit="%"
              caption="Customer's design vs Rossell finishing the design"
              sub={`${BTP_BTS.asOf} · ${BTP_BTS.note}`}
              meta={<Cite ids={BTP_BTS.sources} />}
            />
          </StatRow>
          <div className="mt-8 max-w-3xl">
            <SegmentBar
              segments={[
                { label: "Build-to-print: the customer owns the design", value: BTP_BTS.btp, index: "BTP", display: `~${BTP_BTS.btp}%` },
                { label: "Build-to-spec: Rossell completes the design", value: BTP_BTS.bts, index: "BTS", display: `~${BTP_BTS.bts}%` },
              ]}
            />
          </div>
        </section>
      </Section>

      <DetailOverlay
        open={!!d}
        onOpenChange={dom.onOpenChange}
        eyebrow={d ? `Domain · ${d.orderingPattern}` : undefined}
        title={d?.name ?? ""}
        description={d?.orderingDetail}
        total={dom.total}
        onPrev={dom.prev}
        onNext={dom.next}
      >
        {d && (
          <div className="flex flex-col gap-8">
            <div>
              <PhotoCard asset={DOMAIN_PHOTO[d.id as keyof typeof DOMAIN_PHOTO]} ratio="16/9" sizes="(min-width: 768px) 640px, 100vw" />
              <OrderingStrip shape={d.shape} className="mt-6 border-y border-border py-2 box-content" />
            </div>
            <div>
              <p className="t-label-caps text-muted">What we heard and read</p>
              <ul className="mt-4 divide-y divide-border">
                {d.notes.map((n) => (
                  <li key={n} className="py-3 t-body-md text-body">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label-caps text-muted">Customers in this domain</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {d.customers.map((c) => (
                  <Chip key={c} marker={DOMAIN_COLOR[d.id]}>
                    {getClient(c)?.name ?? c}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <ConfidenceTag confidence={d.confidence} />
              <Cite ids={d.sources} />
            </div>
          </div>
        )}
      </DetailOverlay>

      <DetailOverlay
        open={!!s}
        onOpenChange={svc.onOpenChange}
        eyebrow={s ? `Service · ${s.short}` : undefined}
        title={s?.label ?? ""}
        description={s?.plain}
        total={svc.total}
        onPrev={svc.prev}
        onNext={svc.next}
      >
        {s && (
          <div className="flex flex-col gap-8">
            <div>
              <p className="t-label-caps text-muted">Finished goods that use it</p>
              {svcProducts.length ? (
                <KeyValueRows className="mt-2" rows={svcProducts.map((p) => ({ label: p.name, value: <span className="t-body-sm text-muted">{p.nickname}</span> }))} />
              ) : (
                <p className="mt-3 t-body-md text-muted">—</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <ConfidenceTag confidence={s.confidence} showReported />
              <Cite ids={s.sources} />
            </div>
          </div>
        )}
      </DetailOverlay>
    </ChapterShell>
  );
}
