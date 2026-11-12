"use client";

import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import * as React from "react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { ChartFrame } from "@/components/ui-rt/ChartFrame";
import { Chip } from "@/components/ui-rt/Chip";
import { ConfidenceTag } from "@/components/ui-rt/ConfidenceTag";
import { Legend } from "@/components/ui-rt/Legend";
import { Marker } from "@/components/ui-rt/Marker";
import { Reveal } from "@/components/ui-rt/Reveal";
import { DoorStat as Stat } from "./financials/shared";
import { StatRow } from "@/components/ui-rt/StatRow";
import { TabTrack } from "@/components/ui-rt/TabTrack";
import { PhotoStrip } from "@/components/ui-rt/PhotoCard";
import { Section } from "@/components/journey/Section";
import { AnimatePresence, motion } from "motion/react";
import { PROGRAM_PHOTOS } from "@/content/assets";
import {
  clients,
  clientValues,
  programs,
  flowNodes,
  DOMAIN_COLOR,
  DOMAIN_LABEL,
  DOMAIN_ORDER,
  primaryDomain,
  getClient,
  type DomainId,
  type ClientX,
  type ClientStatus,
  type FlowNode,
} from "@/content/clients";
import { SERVICE_KEYS, serviceLabel, services } from "@/content/domains";
import { dataBg } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { FactMeta, InfoOverlay, SectionHead, fmtNum, useOverlayList, type InfoContent } from "./financials/shared";
import { FlowMap } from "./clients/FlowMap";
import { ClientLogoMark, getClientLogo } from "./clients/ClientLogo";

const wallClients = clients.filter((c) => !c.hideOnWall);

const STATUS_LABEL: Record<ClientStatus, string> = {
  active: "Publicly confirmed",
  named: "Named in working sessions",
  undisclosed: "Confirmed, name not public",
  unconfirmed: "Cited once, unconfirmed",
};

const tileClass: Record<ClientStatus, string> = {
  active: "bg-primary text-on-primary",
  named: "bg-chart-light text-on-primary",
  undisclosed: "bg-chart-mid text-on-primary",
  unconfirmed: "bg-chart-past text-body",
};

function clientContent(c: ClientX): InfoContent {
  return {
    eyebrow: `${c.domain.map((d) => DOMAIN_LABEL[d]).join(" · ")}${c.country ? ` · ${c.country}` : ""}`,
    title: c.name,
    description: c.supplies,
    rows: [
      { label: "Status", value: STATUS_LABEL[c.status] },
      { label: "Customer since", value: c.since ?? null },
      { label: "Value", value: c.value ? String(c.value.value) : "Not disclosed", meta: c.value ? <FactMeta sources={c.value.sources} confidence={c.value.confidence} /> : undefined },
    ],
    notes: [
      ...(c.value?.note ? [{ label: "On the value", text: c.value.note }] : []),
      ...(c.note ? [{ label: "Note", text: c.note }] : []),
      ...(c.highlights?.length ? [{ label: "Highlights", text: c.highlights.join(" ") }] : []),
      ...(c.awards?.length ? [{ label: "Awards", text: c.awards.join(" · ") }] : []),
    ],
    sources: getClientLogo(c.id) ? [...c.sources, `LOGO-${c.id}`] : c.sources,
    confidence: c.confidence,
    children: (
      <div className="flex flex-col gap-6">
        {getClientLogo(c.id) && (
          <div className="flex h-24 w-full max-w-xs items-center justify-center rounded-md bg-primary px-6 text-on-primary">
            <ClientLogoMark id={c.id} scale={1.9} maxWidth="78%" />
            <span className="sr-only">{c.name} logo</span>
          </div>
        )}
        {c.programs && c.programs.length > 0 && (
          <div>
            <p className="mb-3 t-label-caps text-muted">Programs</p>
            <div className="flex flex-wrap gap-2">
              {c.programs.map((p) => (
                <Chip key={p}>{p}</Chip>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="mb-3 t-label-caps text-muted">What Rossell supplies</p>
          <div className="flex flex-wrap items-center gap-2">
            {c.services.length === 0 && <span className="t-body-md text-muted">—</span>}
            {c.services.map((s) => (
              <Chip key={s} marker={<Marker tone={c.servicesInferred ? "mid" : "primary"} shape={c.servicesInferred ? "hollow" : "dot"} size={8} />}>
                {serviceLabel(s)}
              </Chip>
            ))}
            {c.servicesPitched?.map((s) => (
              <Chip key={s} dashed>
                {serviceLabel(s)} · pitched
              </Chip>
            ))}
            {c.servicesInferred && <ConfidenceTag confidence="estimate" />}
          </div>
        </div>
      </div>
    ),
  };
}

function LogoWall({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-8">
      {DOMAIN_ORDER.map((d) => {
        const list = wallClients.filter((c) => primaryDomain(c) === d);
        if (!list.length) return null;
        return (
          <div key={d} className="grid grid-cols-1 gap-4 lg:grid-cols-[12rem_1fr]">
            <div className="flex items-center gap-3 lg:items-start lg:pt-2">
              <Marker tone={DOMAIN_COLOR[d]} />
              <span className="t-body-lg text-on-surface">{DOMAIN_LABEL[d]}</span>
              <span className="t-mono-sm text-muted tnum">{list.length}</span>
            </div>
            <ul className="grid grid-cols-2 gap-3 [--logo-scale:1.3] sm:grid-cols-3 md:grid-cols-4 md:[--logo-scale:1] xl:grid-cols-6">
              {list.map((c, i) => (
                <Reveal as="li" key={c.id} delay={i * 0.03} y={8}>
                  <button
                    type="button"
                    onClick={() => onOpen(c.id)}
                    title={`${c.name} · ${STATUS_LABEL[c.status]}`}
                    className={cn(
                      "relative flex h-24 w-full cursor-pointer items-center justify-center rounded-md px-3 text-center transition-opacity duration-150 ease-out hover:opacity-90",
                      tileClass[c.status]
                    )}
                  >
                    {getClientLogo(c.id) ? (
                      <span className="flex w-full flex-col items-center justify-center gap-2">
                        <ClientLogoMark id={c.id} />
                        {getClientLogo(c.id)?.caption && (
                          <span aria-hidden className="t-mono-sm leading-none opacity-70">
                            {c.wordmark}
                          </span>
                        )}
                        <span className="sr-only">{c.name}</span>
                      </span>
                    ) : (
                      <span className="min-w-0 max-w-full px-2 t-body-md leading-tight [overflow-wrap:anywhere]">{c.wordmark}</span>
                    )}
                    <span className="absolute top-2 right-2 flex gap-1" aria-hidden>
                      {c.domain.map((dd) => (
                        <span key={dd} className={cn("size-2 rounded-full", dataBg[DOMAIN_COLOR[dd]])} />
                      ))}
                    </span>
                    {c.status !== "active" && <span className="sr-only">{STATUS_LABEL[c.status]}</span>}
                  </button>
                </Reveal>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const matrixServices = SERVICE_KEYS.filter((k) => clients.some((c) => c.services.includes(k) || c.servicesPitched?.includes(k)));

function ServicesMatrix({ onOpen }: { onOpen: (id: string) => void }) {
  const short = (k: string) => services.find((s) => s.key === k)?.short ?? k;
  return (
    <div className="overflow-x-auto" data-lenis-prevent-wheel>
      <table className="w-full min-w-3xl border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-surface pb-4 text-left t-mono-sm text-muted">Client</th>
            {matrixServices.map((k) => (
              <th key={k} className="px-2 pb-4 text-center t-mono-sm text-muted" title={serviceLabel(k)}>
                {short(k)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {wallClients.map((c) => (
            <tr key={c.id} className={cn("group", c.status === "unconfirmed" && "opacity-60")}>
              <th scope="row" className="sticky left-0 z-10 border-t border-border bg-surface py-2 pr-4 text-left">
                <button type="button" onClick={() => onOpen(c.id)} className="flex cursor-pointer items-center gap-3 rounded-md py-1 t-body-md text-body transition-colors duration-150 hover:text-on-surface">
                  <span className="flex gap-1" aria-hidden>
                    {c.domain.map((d) => (
                      <span key={d} className={cn("size-2 rounded-full", dataBg[DOMAIN_COLOR[d]])} />
                    ))}
                  </span>
                  <span className="whitespace-nowrap">{c.wordmark}</span>
                </button>
              </th>
              {matrixServices.map((k) => {
                const has = c.services.includes(k);
                const pitched = c.servicesPitched?.includes(k);
                return (
                  <td key={k} className="border-t border-border px-2 py-2 text-center group-hover:bg-surface-raised">
                    {has ? (
                      <Marker tone={c.servicesInferred ? "mid" : "primary"} shape={c.servicesInferred ? "hollow" : "dot"} className="align-middle" />
                    ) : pitched ? (
                      <Marker tone="mid" shape="hatch" className="align-middle" />
                    ) : (
                      <span className="t-mono-sm text-chart-past">·</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- clients, services and financials: plain table ---------- */

type MapView = "diagram" | "table";

/** Domains whose combined revenue share is reported (semiconductor + space ≈ 20% of FY26). */
const SEMI_SPACE: DomainId[] = ["semiconductor", "space"];

function shareOfRevenue(c: ClientX): { text: string; meta?: React.ReactNode } {
  if (c.id === "boeing") {
    return {
      text: `~${clientValues.boeingSharePct.value}% of FY26, ≈ ₹${fmtNum(clientValues.boeingRevenueCr.value)} Cr`,
      meta: <FactMeta sources={clientValues.boeingRevenueCr.sources} confidence="calc" />,
    };
  }
  if (c.domain.length && c.domain.every((d) => SEMI_SPACE.includes(d))) {
    return { text: `Part of ~${clientValues.semiSpaceSharePct.value}% (semi + space, FY26)`, meta: <FactMeta sources={clientValues.semiSpaceSharePct.sources} /> };
  }
  return { text: "Not disclosed" };
}

function programsOf(c: ClientX): string[] {
  const listed = programs.filter((p) => p.customer === c.id).map((p) => p.name);
  return listed.length ? listed : (c.programs ?? []);
}

const shortService = (k: string) => services.find((s) => s.key === k)?.short ?? k;

function MappingTable({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="overflow-x-auto" data-lenis-prevent-wheel>
      <table className="w-full min-w-4xl border-separate border-spacing-0 text-left">
        <thead>
          <tr className="t-mono-sm text-muted">
            <th className="pb-4 pr-4 font-normal">Client</th>
            <th className="pb-4 pr-4 font-normal">Domain</th>
            <th className="pb-4 pr-4 font-normal">Services</th>
            <th className="pb-4 pr-4 font-normal">Programs</th>
            <th className="pb-4 pr-4 font-normal">Value</th>
            <th className="pb-4 font-normal">Share of revenue</th>
          </tr>
        </thead>
        <tbody>
          {wallClients.map((c) => {
            const progs = programsOf(c);
            const share = shareOfRevenue(c);
            const value = c.value && !/^not disclosed/i.test(String(c.value.value)) ? c.value : null;
            return (
              <tr key={c.id} className="align-top">
                <th scope="row" className="border-t border-border py-3 pr-4 font-normal">
                  <button type="button" onClick={() => onOpen(c.id)} className="cursor-pointer text-left t-body-md text-on-surface underline-offset-4 hover:underline">
                    {c.wordmark}
                  </button>
                  {c.status !== "active" && <span className="block t-body-sm text-muted">{STATUS_LABEL[c.status]}</span>}
                </th>
                <td className="border-t border-border py-3 pr-4">
                  <span className="flex flex-col gap-1">
                    {c.domain.map((d) => (
                      <span key={d} className="inline-flex items-center gap-2 t-body-sm text-body whitespace-nowrap">
                        <Marker tone={DOMAIN_COLOR[d]} size={8} />
                        {DOMAIN_LABEL[d]}
                      </span>
                    ))}
                  </span>
                </td>
                <td className="border-t border-border py-3 pr-4 t-body-sm text-body">
                  {c.services.length ? c.services.map(shortService).join(" · ") : <span className="text-muted">Not stated</span>}
                  {c.servicesPitched?.length ? <span className="block text-muted">Pitched: {c.servicesPitched.map(shortService).join(" · ")}</span> : null}
                  {c.servicesInferred && <ConfidenceTag confidence="estimate" className="mt-1" />}
                </td>
                <td className="max-w-xs border-t border-border py-3 pr-4 t-body-sm text-body">{progs.length ? progs.join(" · ") : <span className="text-muted">Not public</span>}</td>
                <td className="max-w-sm border-t border-border py-3 pr-4">
                  {value ? (
                    <span className="flex flex-col items-start gap-1">
                      <span className="t-body-sm text-on-surface">{String(value.value)}</span>
                      <ConfidenceTag confidence={value.confidence} showReported />
                    </span>
                  ) : (
                    <span className="t-body-sm text-muted">Not disclosed</span>
                  )}
                </td>
                <td className="w-44 border-t border-border py-3">
                  <span className="flex flex-col items-start gap-1">
                    <span className={cn("t-body-sm", share.meta ? "text-on-surface" : "text-muted")}>{share.text}</span>
                    {share.meta}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Mapping({ onNode, onOpen }: { onNode: (n: FlowNode) => void; onOpen: (id: string) => void }) {
  const [view, setView] = React.useState<MapView>("diagram");
  const reduce = useReducedMotionSafe();
  return (
    <ChartFrame
      title="Clients, services and financials"
      subtitle={
        view === "diagram"
          ? "Follow a line from domain to client to program to value; hover a box to trace it, and tags mark what is calculated or inferred."
          : "One row per client: what it buys, on which programs, and what is known about its value."
      }
      action={
        <TabTrack<MapView>
          label="Mapping view"
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: "diagram", label: "Diagram" },
            { value: "table", label: "Table" },
          ]}
        />
      }
      footer={
        <>
          <span className="t-body-sm text-muted">
            Per-client values are not disclosed except the figures shown. ₹{fmtNum(clientValues.boeingRevenueCr.value)} Cr = {clientValues.boeingSharePct.value}% × ₹485.2 Cr.
          </span>
          <FactMeta sources={[...new Set(flowNodes.flatMap((n) => n.sources))]} className="ml-auto" />
        </>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
        >
          {view === "diagram" ? <FlowMap onNodeClick={onNode} /> : <MappingTable onOpen={onOpen} />}
        </motion.div>
      </AnimatePresence>
    </ChartFrame>
  );
}

/* ---------- programs ---------- */

function ProgramList({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <ul className="grid grid-cols-1 gap-x-12 border-t border-border md:grid-cols-2">
      {programs.map((p) => {
        const c = getClient(p.customer);
        return (
          <li key={p.id} className="border-b border-border">
            <button type="button" onClick={() => onOpen(p.customer)} className="group flex w-full cursor-pointer items-start gap-4 py-4 text-left">
              <span className="w-16 shrink-0 t-mono-sm text-muted">{p.name}</span>
              <span className="min-w-0 flex-1">
                <span className="block t-body-md text-on-surface underline-offset-4 group-hover:underline">{p.what}</span>
                <span className="mt-1 block t-body-sm text-muted">
                  {c?.wordmark ?? p.customer} · {p.services.map(shortService).join(" · ")}
                </span>
              </span>
              {p.confidence !== "reported" && <ConfidenceTag confidence={p.confidence} />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function Clients() {
  const ov = useOverlayList(clients, "client");
  const [node, setNode] = React.useState<InfoContent | null>(null);

  const openNode = (n: FlowNode) => {
    if (n.clientId) return ov.openId(n.clientId);
    setNode({ eyebrow: `Connection map · ${["Domain", "Client", "Programs", "Value"][n.col]}`, title: n.label, description: n.detail, rows: n.sub ? [{ label: "Detail", value: n.sub }] : undefined, sources: n.sources, confidence: n.confidence });
  };

  const counts = DOMAIN_ORDER.map((d) => ({ d, n: wallClients.filter((c) => c.domain.includes(d)).length }));
  const programSources = [...new Set(programs.flatMap((p) => p.sources))];

  return (
    <ChapterShell
      id="clients"
      statement="One anchor customer became thirty, across four domains."
      lead="Boeing was the only customer in 2018–19 and is still ~40% of revenue. Around it Rossell has added defence primes, Indian programs, two semiconductor equipment makers and a space constellation. Logos are shown in one tone; where a name is not public we say so."
    >
      <Section id="overview">
        <div id="clients-numbers" className="scroll-mt-24">
          <StatRow>
            <Stat label="Customers · Nov 2026" value="30+" sub="26 active in Aug 2025" meta={<FactMeta sources={clientValues.oemCount.sources} />} />
            <Stat label="Export countries" value="8" sub="~98% of revenue exported" meta={<FactMeta sources={clientValues.exportCountries.sources} />} />
            <Stat label="Boeing share · FY26" value="~40" unit="%" sub="≈ ₹194 Cr (our calculation)" meta={<FactMeta sources={clientValues.boeingRevenueCr.sources} confidence="calc" />} onClick={() => ov.openId("boeing")} />
            <Stat label="Semi + space · FY26" value="20" unit="%" sub="≈ ₹100 Cr of revenue" meta={<FactMeta sources={clientValues.semiSpaceSharePct.sources} />} />
          </StatRow>
        </div>
        <div id="clients-wall" className="scroll-mt-24">
          <ChartFrame
            title="Who Rossell builds for"
            subtitle="Each tile is a client, grouped by main domain; dots show every domain it buys in, and greyer tiles are less confirmed."
            action={<Legend items={counts.map(({ d, n }) => ({ label: DOMAIN_LABEL[d], tone: DOMAIN_COLOR[d], count: n }))} />}
            footer={
              <>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {(Object.keys(STATUS_LABEL) as ClientStatus[]).map((s) => (
                    <li key={s} className="inline-flex items-center gap-2 t-body-md text-body">
                      <span aria-hidden className={cn("size-3 rounded-sm", tileClass[s].split(" ")[0])} />
                      {STATUS_LABEL[s]}
                    </li>
                  ))}
                </ul>
                <FactMeta sources={["R-scl-31", "R-scl-24", "S76", "WS"]} className="ml-auto" />
              </>
            }
          >
            <LogoWall onOpen={ov.openId} />
          </ChartFrame>
        </div>
      </Section>

      <Section id="matrix">
        <div id="clients-matrix" className="scroll-mt-24">
          <ChartFrame
            title="Clients and services"
            subtitle="Rows are clients, columns are services; a solid dot is publicly confirmed, a hollow dot is our reading where the scope is not public."
            footer={
              <>
                <Legend
                  items={[
                    { label: "Confirmed", tone: "primary" },
                    { label: "Inferred (scope not public)", tone: "mid", shape: "hollow" },
                    { label: "Pitched, not yet delivered", tone: "mid", shape: "hatch" },
                  ]}
                />
                <FactMeta sources={["R-scl-14", "R-scl-39", "R-scl-20", "S76"]} className="ml-auto" />
              </>
            }
          >
            <ServicesMatrix onOpen={ov.openId} />
          </ChartFrame>
        </div>
      </Section>

      <Section id="mapping">
        <div id="clients-mapping" className="scroll-mt-24">
          <Mapping onNode={openNode} onOpen={ov.openId} />
        </div>
      </Section>

      <Section id="programs">
        <div id="clients-programs-photos" className="scroll-mt-24">
          <PhotoStrip assets={PROGRAM_PHOTOS} label="Programs Rossell supplies" priority />
        </div>
        <div id="clients-programs" className="scroll-mt-24">
          <SectionHead
            eyebrow="Program list"
            title={`${programs.length} named programs`}
            lead="Open a program to see its customer. Three are listed on the company website without the prime named; the customer shown is ours, from the aircraft's maker."
          />
          <ProgramList onOpen={ov.openId} />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <FactMeta sources={programSources} />
          </div>
        </div>
      </Section>

      <InfoOverlay
        content={ov.item ? clientContent(ov.item) : null}
        open={ov.open}
        onOpenChange={ov.onOpenChange}
        index={ov.index ?? undefined}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      />
      <InfoOverlay content={node} open={!!node} onOpenChange={(o) => !o && setNode(null)} />
    </ChapterShell>
  );
}
