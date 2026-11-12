"use client";

import * as React from "react";
import { fileColumns, files } from "@/content/files";
import { dataDictionary, fieldId } from "@/content/dataDictionary";
import type { DictionaryEntry } from "@/content/types";
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
import { columnStats } from "./shared";

const inScope = files.filter((f) => f.status === "in-scope");
const STATS = [
  { label: "Catalogued", value: files.length, caption: "reports in the inventory" },
  { label: "In scope", value: inScope.length, caption: "for the planning layer" },
  { label: "Inputs", value: inScope.filter((f) => f.direction === "input").length, caption: "read each morning or on change" },
  { label: "Outputs", value: inScope.filter((f) => f.direction === "output").length, caption: "sent back to buyers and IQMS" },
  { label: "Not in scope", value: files.filter((f) => f.status === "out-of-scope").length, caption: "known, not needed now" },
  { label: "Not yet available", value: files.filter((f) => f.status === "not-available").length, caption: "to be provided by Rossell" },
];

const rossellFiles = files.filter((f) => f.basis === "rossell-file");
const sheetStats = columnStats(rossellFiles.flatMap((f) => fileColumns(f)));
const SHEET_STATS = [
  { label: "Column sheets", value: rossellFiles.length, caption: "reports sent by Rossell" },
  { label: "Columns", value: sheetStats.columns, caption: "named exactly as in their files" },
  { label: "Must review", value: sheetStats.must, caption: "flagged in the sheets" },
  { label: "Open questions", value: sheetStats.questions, caption: "raised with Rossell" },
  { label: "Answered", value: sheetStats.answered, caption: "by Rossell so far" },
  { label: "Meaning unknown", value: sheetStats.unclear, caption: "columns nobody has explained yet" },
];

/** File catalogue section 4: how the files are handled (FILES). */
const TREATMENT = [
  { title: "Source files are not the data model", text: "Original files, headers, rows and lineage are kept in pre-staging, then normalised into business entities that do not depend on any one report." },
  { title: "The BOM is engineering master data", text: "RT Consolidated BOM defines Rossell's engineering structure. Customer forecasts and demand never overwrite it." },
  { title: "Demand contributions stay separate", text: "ERP demand, customer forecast, excluded forecast and consolidated demand each stay traceable on their own." },
  { title: "Forecast exclusion is configurable", text: "Four months, six or another period. Each planning run keeps the rule and version it used." },
  { title: "Promise dates are supplier commitments", text: "Changes are tracked against the PO release (Unique Rel ID), with their full history." },
  { title: "The promise-date upload is a contract", text: "It follows the exact ERP template: no renamed, reordered, added or removed columns without Rossell's approval." },
  { title: "A GRN is a receipt, not available stock", text: "Posting, rejection, void and location rules must be defined before receipts can reconcile stock." },
  { title: "Scope labels matter", text: "Reports not in scope are not current inputs. Not yet available means Rossell has not supplied the file." },
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
  /** A field opened from a file that is not in the filtered list: shown on its own, so the reader's filters stay. */
  const [loose, setLoose] = React.useState<DictionaryEntry | null>(null);
  const list = React.useMemo(() => filterDictionary(filters), [filters]);
  const setField = React.useCallback((i: number | null) => {
    setLoose(null);
    setFieldIdx(i);
  }, []);

  /** On the template section a file is shown inline; everywhere else it opens in the overlay. */
  const openFileById = React.useCallback(
    (id: string) => {
      const i = files.findIndex((f) => f.id === id);
      if (i < 0) return;
      setField(null);
      if (section === "templates") {
        setFileIdx(null);
        setTemplateIdx(i);
        document.getElementById("data-templates")?.scrollIntoView({ block: "start" });
      } else setFileIdx(i);
    },
    [section, setField]
  );

  const showEntity = React.useCallback(
    (entity: string) => {
      setFileIdx(null);
      setField(null);
      if (section === "dictionary") {
        setFilters({ ...EMPTY_FILTERS, entity });
        setTimeout(() => goTo("data-dictionary"), 250);
      } else goTo(dictHref("entity", entity));
    },
    [goTo, section, setField]
  );

  const openField = React.useCallback(
    (id: string) => {
      setFileIdx(null);
      // Never touch the reader's filters: page through the filtered list when the field is in it, else show it alone.
      const inList = list.findIndex((d) => fieldId(d) === id);
      if (inList >= 0) return setField(inList);
      const d = dataDictionary.find((x) => fieldId(x) === id);
      if (!d) return;
      setLoose(d);
      setFieldIdx(0);
    },
    [list, setField]
  );

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
            <Cite ids={["FILES", "WS"]} />
            <ConfidenceTag confidence="session" />
            <span className="t-body-sm text-muted">From Rossell&apos;s file catalogue and the report inventory in the working-session notes.</span>
          </div>
        </div>
        <section id="data-sheets" aria-labelledby="data-sheets-title" className="scroll-mt-24">
          <Eyebrow>Rossell&apos;s column sheets</Eyebrow>
          <h2 id="data-sheets-title" className="mt-3 mb-8 max-w-3xl t-headline-md text-on-surface">
            Seven reports arrived as Rossell&apos;s own column sheets: every column named, described and marked for review.
          </h2>
          <StatRow>
            {SHEET_STATS.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} sub={s.caption} />
            ))}
          </StatRow>
          <p className="mt-6 max-w-3xl t-body-md text-body">
            Each sheet lists the column as Rossell names it, its full name and meaning, whether it must be reviewed, the question we asked and Rossell&apos;s answer. Open a
            report below, or the{" "}
            <button type="button" onClick={() => goTo("/data/templates")} className="cursor-pointer text-on-surface underline underline-offset-4 transition-colors duration-150 hover:text-body">
              template view
            </button>
            , to filter its columns by any of these. The sample values on this site are invented.
          </p>
        </section>
        <section id="data-files" aria-labelledby="data-files-title" className="scroll-mt-24">
          <Eyebrow>Report inventory</Eyebrow>
          <h2 id="data-files-title" className="mt-3 mb-8 max-w-3xl t-headline-md text-on-surface">
            All sixteen reports, with what each one holds, where it comes from and who reads it.
          </h2>
          <FileInventory onOpen={setFileIdx} />
        </section>
        <section id="data-treatment" aria-labelledby="data-treatment-title" className="scroll-mt-24">
          <Eyebrow>How these files are treated</Eyebrow>
          <h2 id="data-treatment-title" className="mt-3 mb-8 max-w-3xl t-headline-md text-on-surface">
            Eight rules from the file catalogue decide how the planning layer reads them.
          </h2>
          <ol className="grid grid-cols-1 gap-x-12 border-t border-border md:grid-cols-2">
            {TREATMENT.map((t, i) => (
              <li key={t.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-3 border-b border-border py-4">
                <span className="t-mono-sm text-muted tnum">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block t-body-lg text-on-surface">{t.title}</span>
                  <span className="mt-1 block t-body-md text-body">{t.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Cite ids={["FILES"]} />
            <ConfidenceTag confidence="session" />
          </div>
        </section>
      </Section>

      <Section id="flow">
        <div id="data-flow" className="scroll-mt-24">
          <ReportFlow onOpenFile={openFileById} />
        </div>
      </Section>

      <Section id="templates">
        <div id="data-templates" className="scroll-mt-24">
          <TemplateViewer index={templateIdx} onIndexChange={setTemplateIdx} onEntity={showEntity} onField={openField} />
        </div>
      </Section>

      <Section id="dictionary">
        <section id="data-dictionary" aria-label="Data dictionary" className="scroll-mt-24">
          <p className="mb-8 max-w-3xl t-body-lg text-body">
            One vocabulary for every report: what each field means, the exact column that holds it in each file, an example and which teams rely on it. Every column of
            Rossell&apos;s seven column sheets maps to one field here; the field names and groupings are our model, to be validated with Rossell. To filter by a step in the
            chain, use the{" "}
            <button type="button" onClick={() => goTo("/data/entities")} className="cursor-pointer text-on-surface underline underline-offset-4 transition-colors duration-150 hover:text-body">
              entity map
            </button>
            .
          </p>
          <Dictionary filters={filters} setFilters={setFilters} list={list} onOpenField={setField} />
        </section>
      </Section>

      <Section id="entities">
        <div id="data-entities" className="scroll-mt-24">
          <EntityExplorer onShowNode={(id) => goTo(dictHref("entity-node", id))} onShowEntity={showEntity} />
        </div>
      </Section>

      <FileOverlay index={fileIdx} onIndexChange={setFileIdx} onEntity={showEntity} onField={openField} />
      <FieldOverlay list={loose ? [loose] : list} index={fieldIdx} onIndexChange={setField} onOpenFile={openFileById} onEntity={showEntity} />
    </>
  );
}

