"use client";

// 11 · Supply base: how many suppliers (honestly: not disclosed), in which categories, what Rossell itself says,
// an industry-example supplier universe with profiles, and where each supplier's products end up in a harness.
// Overlays live outside the sections so ⌘K and ?open= work on every section.
import * as React from "react";
import { Info } from "lucide-react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { ChartFrame, Chip, ChipCount, Cite, ConfidenceTag, Eyebrow, Legend, Stat, StatRow } from "@/components/ui-rt";
import { harnessParts, type HarnessPartId } from "@/content/materials";
import { getScale } from "@/content/scale";
import { supplierEvidence, supplierGroupOf, supplierGroups, suppliers, supplyBaseFacts, type SupplierGroup } from "@/content/suppliers";
import { useSearchOpen } from "@/lib/searchIndex";
import { cn } from "@/lib/utils";
import { useIndexOverlay } from "./anatomy/shared";
import { PartOverlay } from "./anatomy/PartOverlay";
import { ConnectionDiagram, shortName } from "./supply/ConnectionDiagram";
import { GROUP_STYLE, GroupDot } from "./supply/groups";
import { SupplierOverlay } from "./supply/SupplierOverlay";

const REPORTED_LABELS: { label: string; title: string }[] = [
  { label: "Where Rossell buys raw materials", title: "Global distributors" },
  { label: "Counterfeit-parts safeguard", title: "ERAI member" },
  { label: "Supplier categories Rossell recruits", title: "Partnership programme" },
  { label: "Supplier quality framework", title: "SQAM and SSAF" },
  { label: "US sourcing support", title: "RTI, Tempe" },
];
const reported = REPORTED_LABELS.map((r) => ({ ...r, fact: supplyBaseFacts.find((f) => f.label === r.label)! })).filter((r) => r.fact);
const scaleFact = supplyBaseFacts[0];
const supplierCount = getScale("supplier-count");
const groupCount = (g: SupplierGroup) => suppliers.filter((s) => supplierGroupOf(s) === g).length;
const indiaTotal = suppliers.filter((s) => s.inIndia).length;

type Filter = "all" | SupplierGroup;

/** Overview: the honest count, how many are profiled here, and the categories. */
function CountAndCategories() {
  return (
    <div id="supply-base-count" className="flex scroll-mt-24 flex-col gap-10">
      <div className="rounded-xl bg-surface p-6 sm:p-10">
        <StatRow>
          <Stat
            label="Rossell's suppliers"
            value="Hundreds"
            caption="Per working sessions; not disclosed publicly"
            sub="Rossell has not published a supplier count or list."
            meta={
              <>
                <Cite ids={supplierCount?.sources ?? scaleFact.sources} />
                <ConfidenceTag confidence={supplierCount?.confidence ?? scaleFact.confidence} />
              </>
            }
          />
          <Stat
            label="Profiled in this chapter"
            value={suppliers.length}
            unit="suppliers"
            caption="Industry examples, not confirmed suppliers"
            sub={`Who they are, what they deal in, example parts and where they are; ${indiaTotal} have a presence in India.`}
            meta={
              <>
                <Cite ids={["R-sup-6", "R-sup-15", "R-sup-32"]} />
                <ConfidenceTag confidence="industry-example" />
              </>
            }
          />
        </StatRow>
      </div>

      <div>
        <Eyebrow>Three categories</Eyebrow>
        <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {supplierGroups.map((g) => (
            <li key={g.id} className="rounded-lg bg-surface-raised p-6">
              <div className="flex items-center gap-3">
                <GroupDot group={g.id} className="size-2.5" />
                <p className="t-body-lg text-on-surface">{g.label}</p>
                <ChipCount className="ml-auto h-7 px-2 t-mono-sm">{groupCount(g.id)}</ChipCount>
              </div>
              <p className="mt-2 t-body-md text-body">{g.plain}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 t-body-sm text-muted">Counts are the profiled industry examples in each category, not Rossell&apos;s own split.</p>
      </div>

      <div role="note" className="flex items-start gap-4 rounded-lg border border-dashed border-border p-6 sm:p-8">
        <Info aria-hidden className="mt-1 size-5 shrink-0 text-muted" strokeWidth={1.5} />
        <div>
          <p className="t-body-lg text-on-surface">Rossell has not shared its supplier list. The profiles in this chapter are typical of aerospace harness supply chains: industry examples, not confirmed suppliers.</p>
          <p className="mt-2 t-body-md text-muted">{supplierEvidence[0].finding} We searched the company website, press releases, trade press, job postings and customs-import aggregators.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ConfidenceTag confidence="industry-example" />
            <Cite ids={supplierEvidence[0].sources} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InOwnWords() {
  return (
    <section id="sb-reported" aria-labelledby="sb-reported-title" className="scroll-mt-24">
      <Eyebrow id="sb-reported-title">In Rossell&apos;s own words</Eyebrow>
      <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-5 xl:gap-x-0">
        {reported.map((r) => (
          <li key={r.label} className="min-w-0 xl:border-l xl:border-border xl:px-6 xl:first:border-l-0 xl:first:pl-0">
            <p className="t-body-lg text-on-surface">{r.title}</p>
            <p className="mt-2 t-body-sm text-body">{r.fact.value}.</p>
            {r.fact.note && <p className="mt-2 t-body-sm text-muted">{r.fact.note}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ConfidenceTag confidence={r.fact.confidence} showReported />
              <Cite ids={r.fact.sources} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SupplyBase() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const [indiaOnly, setIndiaOnly] = React.useState(false);
  const shown = suppliers.filter((s) => (filter === "all" || supplierGroupOf(s) === filter) && (!indiaOnly || s.inIndia));
  const overlay = useIndexOverlay(shown);
  const parts = useIndexOverlay(harnessParts);

  const open = overlay.open;
  const openSupplier = React.useCallback(
    (id: string) => {
      setFilter("all");
      setIndiaOnly(false);
      open(id);
    },
    [open]
  );
  useSearchOpen("supplier", openSupplier);

  const countFor = (g: Filter) => suppliers.filter((s) => (g === "all" || supplierGroupOf(s) === g) && (!indiaOnly || s.inIndia)).length;
  const indiaCount = suppliers.filter((s) => (filter === "all" || supplierGroupOf(s) === filter) && s.inIndia).length;

  return (
    <ChapterShell
      id="supply-base"
      statement="Thousands of materials. Hundreds of suppliers."
      lead={
        <>
          That is how the working sessions describe the scale of what the buying team chases every day. Rossell has not published a supplier count; the figure is the team&apos;s own description.{" "}
          <span className="inline-flex flex-wrap items-center gap-2 align-middle">
            <ConfidenceTag confidence={scaleFact.confidence} />
            <Cite ids={scaleFact.sources} />
          </span>
        </>
      }
    >
      <Section id="overview">
        <CountAndCategories />
        <InOwnWords />
      </Section>

      <Section id="universe">
        <section id="supply-base-universe" aria-labelledby="sb-universe" className="scroll-mt-24">
          <ChartFrame
            eyebrow="Supplier universe"
            title={<span id="sb-universe">{suppliers.length} typical suppliers in three groups</span>}
            subtitle="Each pill is a company that commonly supplies military and aerospace harness makers; select one for who they are, what they deal in, example parts and where they are."
            footer={
              <>
                <Legend items={supplierGroups.map((g) => ({ label: g.label, tone: GROUP_STYLE[g.id].tone, count: groupCount(g.id) }))} />
                <span className="ml-auto flex min-w-0 flex-wrap items-center gap-2">
                  <ConfidenceTag confidence="industry-example" />
                  <Cite ids={["R-sup-6", "R-sup-15", "R-sup-32"]} />
                </span>
              </>
            }
          >
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter suppliers">
              <Chip selected={filter === "all"} onClick={() => setFilter("all")} count={countFor("all")}>
                All
              </Chip>
              {supplierGroups.map((g) => (
                <Chip key={g.id} marker={<GroupDot group={g.id} />} selected={filter === g.id} onClick={() => setFilter(g.id)} count={countFor(g.id)}>
                  {g.label}
                </Chip>
              ))}
              <span aria-hidden className="mx-2 hidden h-6 w-px bg-border sm:block" />
              <Chip dashed={!indiaOnly} selected={indiaOnly} onClick={() => setIndiaOnly((v) => !v)} count={indiaCount}>
                Has India presence
              </Chip>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {supplierGroups.map((g) => {
                const list = shown.filter((s) => supplierGroupOf(s) === g.id);
                const dim = filter !== "all" && filter !== g.id;
                return (
                  <div key={g.id} className={cn("rounded-lg bg-surface-raised p-6 transition-opacity duration-150", dim && "opacity-40")}>
                    <div className="flex items-center gap-3">
                      <span aria-hidden className={cn("size-2.5 rounded-full", GROUP_STYLE[g.id].bg)} />
                      <p className="t-body-lg text-on-surface">{g.label}</p>
                      <ChipCount className="ml-auto h-7 px-2 t-mono-sm">{list.length}</ChipCount>
                    </div>
                    <p className="mt-2 t-body-sm text-muted">{g.plain}</p>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {list.map((s) => (
                        <li key={s.id} className="max-w-full">
                          <Chip marker={<GroupDot group={g.id} />} onClick={() => overlay.open(s.id)} title={s.name}>
                            {shortName(s.name)}
                            {s.inIndia && <span className="ml-2 t-mono-sm text-muted">IN</span>}
                          </Chip>
                        </li>
                      ))}
                      {!list.length && <li className="t-body-md text-muted">—</li>}
                    </ul>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 t-body-sm text-muted">IN = an office, plant or legal entity in India was found in the research.</p>
          </ChartFrame>
        </section>
      </Section>

      <Section id="connections">
        <section id="supply-base-connections" className="scroll-mt-24">
          <ChartFrame
            eyebrow="Supplier to part"
            title="Where each supplier's products end up in a harness"
            subtitle="Lines join a supplier (left) to the harness parts its products typically become (right); hover either side to trace it, select a part for what it is."
            footer={
              <>
                <Legend items={supplierGroups.map((g) => ({ label: g.label, tone: GROUP_STYLE[g.id].tone }))} />
                <span className="ml-auto flex min-w-0 flex-wrap items-center gap-2">
                  <ConfidenceTag confidence="industry-example" />
                  <Cite ids={["R-sup-6", "R-sup-11", "R-sup-15", "R-sup-23", "R-sup-46"]} />
                </span>
              </>
            }
          >
            <ConnectionDiagram suppliers={suppliers} onSupplier={openSupplier} onPart={(id: HarnessPartId) => parts.open(id)} />
            {suppliers.some((s) => !s.harnessPartIds.length) && (
              <p className="mt-6 t-body-sm text-muted">Test labs and logistics providers support the whole build rather than a single part, so they are not drawn.</p>
            )}
          </ChartFrame>
        </section>
      </Section>

      <SupplierOverlay supplier={overlay.current} index={overlay.index} total={overlay.total} onOpenChange={overlay.onOpenChange} onPrev={overlay.prev} onNext={overlay.next} />
      <PartOverlay part={parts.current} onOpenChange={parts.onOpenChange} onPrev={parts.prev} onNext={parts.next} onSupplier={openSupplier} />
    </ChapterShell>
  );
}
