"use client";

import * as React from "react";
import { files } from "@/content/files";
import { dataDictionary, fieldId } from "@/content/dataDictionary";
import { Cite, ConfidenceTag, Eyebrow, Stat, StatRow } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import { Section, useActiveSection } from "@/components/journey/Section";
import { useSearchOpen } from "@/lib/searchIndex";
import { FileInventory } from "./FileInventory";
import { ReportFlow } from "./ReportFlow";
import { FileOverlay } from "./FileOverlay";
import { Dictionary, EMPTY_FILTERS, filterDictionary, type DictFilters } from "./Dictionary";
import { FieldOverlay } from "./FieldOverlay";
import { TemplateViewer } from "./TemplateViewer";
import { EntityExplorer } from "./EntityExplorer";

const inScope = files.filter((f) => f.status === "in-scope");
const STATS = [
  { label: "Catalogued", value: files.length, caption: "reports in the inventory" },
  { label: "In scope", value: inScope.length, caption: "for the planning layer" },
  { label: "Inputs", value: inScope.filter((f) => f.direction === "input").length, caption: "read each morning or on change" },
  { label: "Outputs", value: inScope.filter((f) => f.direction === "output").length, caption: "sent back to buyers and IQMS" },
  { label: "Out of scope", value: files.filter((f) => f.status === "out-of-scope").length, caption: "not needed now" },
  { label: "Not yet available", value: files.filter((f) => f.status === "not-available").length, caption: "to be provided by Rossell" },
];

/** Dictionary route with a pending filter (consumed by useSearchOpen in the dictionary section). */
const dictHref = (type: "entity" | "entity-node", id: string) => `/data/dictionary?open=${type}:${encodeURIComponent(id)}#data-dictionary`;

/** Chapter 13 body: inventory, report flow, template view per file, data dictionary and entity map, one section each. */
export function DataChapter() {
  const { goTo } = useJourney();
  const section = useActiveSection()?.section ?? null;
  const [fileIdx, setFileIdx] = React.useState<number | null>(null);
  const [templateIdx, setTemplateIdx] = React.useState(0);
  const [filters, setFilters] = React.useState<DictFilters>(EMPTY_FILTERS);
  const [fieldIdx, setFieldIdx] = React.useState<number | null>(null);
  const list = React.useMemo(() => filterDictionary(filters), [filters]);

  /** On the template section a file is shown inline; everywhere else it opens in the overlay. */
  const openFileById = React.useCallback(
    (id: string) => {
      const i = files.findIndex((f) => f.id === id);
      if (i < 0) return;
      setFieldIdx(null);
      if (section === "templates") {
        setFileIdx(null);
        setTemplateIdx(i);
        document.getElementById("data-templates")?.scrollIntoView({ block: "start" });
      } else setFileIdx(i);
    },
    [section]
  );

  const showEntity = React.useCallback(
    (entity: string) => {
      setFileIdx(null);
      setFieldIdx(null);
      if (section === "dictionary") {
        setFilters({ ...EMPTY_FILTERS, entity });
        setTimeout(() => goTo("data-dictionary"), 250);
      } else goTo(dictHref("entity", entity));
    },
    [goTo, section]
  );

  const openField = React.useCallback((id: string) => {
    const i = dataDictionary.findIndex((d) => fieldId(d) === id);
    if (i < 0) return;
    setFilters(EMPTY_FILTERS); // unfiltered list = dictionary order, so i stays valid
    setFileIdx(null);
    setFieldIdx(i);
  }, []);

  const entityFilter = React.useCallback((entity: string) => setFilters({ ...EMPTY_FILTERS, entity }), []);
  const nodeFilter = React.useCallback((node: string) => setFilters({ ...EMPTY_FILTERS, node }), []);

  useSearchOpen("file", openFileById);
  useSearchOpen("field", openField);
  useSearchOpen("entity", entityFilter);
  useSearchOpen("entity-node", nodeFilter);

  return (
    <>
      <Section id="overview">
        <div id="data-overview" className="scroll-mt-24">
          <StatRow>
            {STATS.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} sub={s.caption} />
            ))}
          </StatRow>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Cite ids={["WS"]} />
            <ConfidenceTag confidence="session" />
            <span className="t-body-sm text-muted">From the report inventory in the working-session notes.</span>
          </div>
        </div>
        <section id="data-files" aria-labelledby="data-files-title" className="scroll-mt-24">
          <Eyebrow>Report inventory</Eyebrow>
          <h2 id="data-files-title" className="mt-3 mb-8 max-w-3xl t-headline-md text-on-surface">
            All sixteen reports, with what each one holds, where it comes from and who reads it.
          </h2>
          <FileInventory onOpen={setFileIdx} />
        </section>
      </Section>

      <Section id="flow">
        <div id="data-flow" className="scroll-mt-24">
          <ReportFlow onOpenFile={openFileById} />
        </div>
      </Section>

      <Section id="templates">
        <div id="data-templates" className="scroll-mt-24">
          <TemplateViewer index={templateIdx} onIndexChange={setTemplateIdx} onEntity={showEntity} />
        </div>
      </Section>

      <Section id="dictionary">
        <section id="data-dictionary" aria-label="Data dictionary" className="scroll-mt-24">
          <p className="mb-8 max-w-3xl t-body-lg text-body">
            One vocabulary for every report: what each field means, its type, an example, which files carry it and which teams rely on it. Field lists are our model, to be
            validated against the IQMS tables. To filter by a step in the chain, use the{" "}
            <button type="button" onClick={() => goTo("/data/entities")} className="cursor-pointer text-on-surface underline underline-offset-4 transition-colors duration-150 hover:text-body">
              entity map
            </button>
            .
          </p>
          <Dictionary filters={filters} setFilters={setFilters} list={list} onOpenField={setFieldIdx} />
        </section>
      </Section>

      <Section id="entities">
        <div id="data-entities" className="scroll-mt-24">
          <EntityExplorer onShowNode={(id) => goTo(dictHref("entity-node", id))} onShowEntity={showEntity} />
        </div>
      </Section>

      <FileOverlay index={fileIdx} onIndexChange={setFileIdx} onEntity={showEntity} />
      <FieldOverlay list={list} index={fieldIdx} onIndexChange={setFieldIdx} onOpenFile={openFileById} onEntity={showEntity} />
    </>
  );
}

