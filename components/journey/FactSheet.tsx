"use client";

import * as React from "react";
import Link from "next/link";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui-rt/Button";
import { CONFIDENCE_LABEL } from "@/components/ui-rt/ConfidenceTag";
import { getScale } from "@/content/scale";
import { markets } from "@/content/company";
import { clientValues } from "@/content/clients";
import { rossell, shareEstimate } from "@/content/competitors";
import { suppliers } from "@/content/suppliers";
import { files } from "@/content/files";
import { sources } from "@/content/sources";
import type { Confidence } from "@/content/types";
import { chapters } from "@/lib/journeyChapters";
import { sectionHref, sectionsOf } from "@/lib/structure";

interface Row {
  label: string;
  value: string;
  note?: string;
  sources: string[];
  confidence: Confidence;
  chapter: string;
}

const s = (id: string) => getScale(id)!;
const fmt = (v: string | number) => (typeof v === "number" ? v.toLocaleString("en-IN") : v);

const groups: { title: string; rows: Row[] }[] = [
  {
    title: "Size and money",
    rows: [
      { label: "Revenue, FY26", value: `₹${fmt(rossell.revenueCr!.value)} Cr`, note: "Up 87% on FY25", sources: rossell.revenueCr!.sources, confidence: rossell.revenueCr!.confidence, chapter: "financials" },
      { label: "Order book, Sep 2026", value: `₹${s("order-book").value} Cr`, note: s("order-book").plain, sources: s("order-book").sources, confidence: s("order-book").confidence, chapter: "growth" },
      { label: "Orders won, FY26", value: `₹${s("orders-fy26").value} Cr`, sources: s("orders-fy26").sources, confidence: s("orders-fy26").confidence, chapter: "scale" },
      { label: "Revenue exported", value: `~${markets.exportSharePct.value}%`, note: markets.exportSharePct.note, sources: markets.exportSharePct.sources, confidence: markets.exportSharePct.confidence, chapter: "footprint" },
      { label: "Share of global aerospace harness market", value: "~0.5–0.8%", note: "Upper bound; method on the Competition chapter", sources: shareEstimate.sources, confidence: shareEstimate.confidence, chapter: "competition" },
    ],
  },
  {
    title: "Customers and people",
    rows: [
      { label: "Clients, Jul 2025", value: fmt(clientValues.clientCount.value), note: "OEM / Tier-1 customers: 30+", sources: clientValues.clientCount.sources, confidence: clientValues.clientCount.confidence, chapter: "clients" },
      { label: "Boeing share of FY26 revenue", value: `~${clientValues.boeingSharePct.value}%`, sources: clientValues.boeingSharePct.sources, confidence: clientValues.boeingSharePct.confidence, chapter: "clients" },
      { label: "Export countries", value: fmt(clientValues.exportCountries.value), sources: clientValues.exportCountries.sources, confidence: clientValues.exportCountries.confidence, chapter: "footprint" },
      { label: "Workforce, Jun 2026", value: fmt(s("workforce-latest").value), note: "Includes contract staff and trainees", sources: s("workforce-latest").sources, confidence: s("workforce-latest").confidence, chapter: "people" },
    ],
  },
  {
    title: "Volume: what they build and buy",
    rows: [
      { label: "Units delivered, all customers, Jan 2024", value: `${s("units-all-customers").value}`, sources: s("units-all-customers").sources, confidence: s("units-all-customers").confidence, chapter: "scale" },
      { label: "Assemblies delivered to Boeing, Sep 2025", value: `${s("boeing-assemblies").value}`, sources: s("boeing-assemblies").sources, confidence: s("boeing-assemblies").confidence, chapter: "scale" },
      { label: "Number of orders", value: "Not disclosed", note: s("order-count").plain, sources: s("order-count").sources, confidence: s("order-count").confidence, chapter: "scale" },
      { label: "Material cost, FY26", value: `₹${s("materials-fy26").value} Cr`, note: "62% of sales", sources: s("materials-fy26").sources, confidence: s("materials-fy26").confidence, chapter: "scale" },
      { label: "Materials purchased, FY26", value: `~₹${s("purchases-fy26").value} Cr`, note: "Not reported; consumption plus stock build", sources: s("purchases-fy26").sources, confidence: s("purchases-fy26").confidence, chapter: "scale" },
      { label: "Suppliers", value: "Hundreds", note: `Not disclosed publicly; ${suppliers.length} typical industry suppliers profiled`, sources: s("supplier-count").sources, confidence: s("supplier-count").confidence, chapter: "supply-base" },
    ],
  },
  {
    title: "How it runs",
    rows: [
      { label: "Running projects", value: fmt(s("projects").value), sources: s("projects").sources, confidence: s("projects").confidence, chapter: "scale" },
      { label: "Reports feeding planning", value: String(files.length), note: "Each with a template view and data dictionary", sources: ["WS"], confidence: "session", chapter: "data" },
      { label: "Inventory carrying level, Q2 FY27", value: `${s("inventory-months").value} months`, note: s("inventory-months").plain, sources: s("inventory-months").sources, confidence: s("inventory-months").confidence, chapter: "growth" },
    ],
  },
];

const pr = "print:text-on-primary";

/** One-page fact sheet of key figures with sources; prints cleanly (dark tokens swap to near-black on paper). */
export function FactSheet() {
  return (
    <article className="px-6 pt-12 pb-16 sm:px-12 lg:px-16 lg:pt-16 print:bg-on-surface print:p-8 print:pt-0 print:pb-0">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-3xl">
          <p className={`t-label-caps text-muted ${pr}`}>Fact sheet · Prepared by Talencia Global for Rossell Techsys · November 2026</p>
          <h1 className={`mt-4 t-headline-lg text-on-surface ${pr} print:mt-2 print:t-headline-md`}>Rossell Techsys in one page.</h1>
          <p className={`mt-4 t-body-lg text-body ${pr} print:hidden`}>
            The figures we rely on most, each with its source and how sure we are. Source ids match the Sources chapter.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 print:hidden">
          <Button onClick={() => window.print()} icon={<Printer aria-hidden />}>
            Print or save as PDF
          </Button>
          <Button href="/sources">All sources</Button>
        </div>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 xl:grid-cols-2 print:mt-4 print:grid-cols-2 print:gap-x-6 print:gap-y-3">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className={`t-label-caps text-muted ${pr}`}>{g.title}</h2>
            <dl className="mt-4 divide-y divide-border border-y border-border print:divide-chart-mid print:border-chart-mid">
              {g.rows.map((r) => {
                const ch = chapters.find((c) => c.id === r.chapter)!;
                return (
                  <div key={r.label} className="grid break-inside-avoid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-3 print:gap-y-0 print:py-1">
                    <dt className={`t-body-md text-body ${pr} print:t-body-sm`}>
                      <Link href={sectionHref(ch.id, sectionsOf(ch.id)[0].id)} className="hover:text-on-surface print:no-underline">
                        {r.label}
                      </Link>
                    </dt>
                    <dd className={`text-right t-body-lg text-on-surface tnum ${pr} print:t-body-md`}>{r.value}</dd>
                    <dd className={`col-span-2 t-body-sm text-muted ${pr} print:text-xs`}>
                      {r.note && <span>{r.note} · </span>}
                      <span className="t-mono-sm">{r.sources.join(" · ")}</span>
                      {r.confidence !== "reported" && <span> · {CONFIDENCE_LABEL[r.confidence]}</span>}
                      <span className="print:hidden"> · {ch.label}</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}
      </div>

      <footer className={`mt-12 print:mt-4 border-t border-border pt-6 t-body-sm text-muted ${pr} print:border-chart-mid`}>
        {sources.length} sources in total. Estimates, our calculations and working-session figures are labelled; everything else is from public filings or reports.
        Knowledge only: open to correction.
      </footer>
    </article>
  );
}
