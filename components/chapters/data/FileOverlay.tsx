"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { DataFile } from "@/content/types";
import { files } from "@/content/files";
import { Chip, Cite, ConfidenceTag, DetailOverlay, KeyValueRows, Marker } from "@/components/ui-rt";
import { ColumnList } from "./ColumnList";
import { SheetTemplate } from "./SheetTemplate";
import { BASIS_LABEL, STATUS_LABEL, STATUS_MARKER, consumerCaveat, entitiesForFile, entityColor, fileStats, pad2, shortDate } from "./shared";

/** Large overlay for one report: template view, plain meaning, what/when/who, columns explained, entities fed. Pages through all 16. */
export function FileOverlay({
  index,
  onIndexChange,
  onEntity,
  onField,
}: {
  /** 0-based position in `files`, or null when closed. */
  index: number | null;
  onIndexChange: (i: number | null) => void;
  /** Jump to the data dictionary filtered to an entity. */
  onEntity: (entity: string) => void;
  /** Open one dictionary field. */
  onField?: (fieldId: string) => void;
}) {
  const file: DataFile | undefined = index === null ? undefined : files[index];
  const n = files.length;
  return (
    <DetailOverlay
      open={!!file}
      onOpenChange={(o) => !o && onIndexChange(null)}
      size="lg"
      className="grid-cols-1"
      eyebrow={file ? `File ${pad2(file.index)} · ${STATUS_LABEL[file.status]} · ${file.direction === "input" ? "Input" : "Output"}` : undefined}
      title={file?.name ?? ""}
      description={file?.plainMeaning}
      index={index ?? undefined}
      total={n}
      onPrev={() => index !== null && onIndexChange((index - 1 + n) % n)}
      onNext={() => index !== null && onIndexChange((index + 1) % n)}
    >
      {file && <FileDetail key={file.id} file={file} onEntity={onEntity} onField={onField} />}
    </DetailOverlay>
  );
}

/** The non-zero counts after "must review", in reading order. */
function sheetFacts(s: ReturnType<typeof fileStats>) {
  return [
    s.questions && `${s.questions} open question${s.questions === 1 ? "" : "s"}`,
    s.answered && `${s.answered} answered by Rossell`,
    s.unclear && `${s.unclear} whose meaning nobody has confirmed yet`,
    s.generated && `${s.generated} the planning layer will generate`,
  ].filter((x): x is string => !!x);
}

export function FileDetail({ file, onEntity, onField }: { file: DataFile; onEntity: (entity: string) => void; onField?: (fieldId: string) => void }) {
  const m = STATUS_MARKER[file.status];
  const fed = entitiesForFile(file.id);
  const caveat = consumerCaveat(file);
  const fromRossell = file.basis === "rossell-file";
  const s = fileStats(file);
  return (
    <div className="@container flex min-w-0 flex-col gap-12">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Chip marker={<Marker tone={m.tone} shape={m.shape} size={8} />}>{STATUS_LABEL[file.status]}</Chip>
          <Chip icon={file.direction === "input" ? <ArrowDownLeft /> : <ArrowUpRight />}>{file.direction === "input" ? "Input to planning" : "Output from planning"}</Chip>
          <Chip dashed={!fromRossell} marker={<Marker tone={fromRossell ? "primary" : "past"} shape={fromRossell ? "dot" : "hollow"} size={8} />}>
            {fromRossell ? BASIS_LABEL["rossell-file"] : "Our model · awaiting Rossell's file"}
          </Chip>
          <Cite ids={file.sources} />
          <ConfidenceTag confidence="session" />
        </div>
        {fromRossell ? (
          <p className="max-w-3xl t-body-md text-body">
            Columns from Rossell&apos;s workbook <span className="t-mono-sm [overflow-wrap:anywhere] text-on-surface">{file.workbook}</span>
            {file.extractDate && <> (extract {shortDate(file.extractDate)})</>}: {s.columns} columns, <span className="text-on-surface">{s.must} must review</span>
            {sheetFacts(s).map((t) => `, ${t}`).join("")}.
          </p>
        ) : (
          <p className="max-w-3xl t-body-md text-body">Rossell has not sent this file yet. The columns below are our model of what it holds, to be replaced by Rossell&apos;s own column names.</p>
        )}
      </div>

      <section aria-label="Template view" className="min-w-0">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="t-label-caps text-muted">Template view</h3>
          <span className="t-body-sm text-muted">Hover a column name for its meaning</span>
        </div>
        <SheetTemplate file={file} />
      </section>

      <div className="grid min-w-0 grid-cols-1 gap-12 @2xl:grid-cols-2">
        <section aria-label="What, when, who">
          <h3 className="mb-2 t-label-caps text-muted">What · when · who</h3>
          <KeyValueRows
            rows={[
              { label: "Meaning", value: file.what },
              { label: "Catalogue note", value: file.notes },
              { label: "Source system", value: file.sourceSystem },
              { label: "Produced by", value: file.mechanism },
              { label: "Triggered by", value: file.trigger },
              { label: "Refresh", value: file.refresh },
              { label: "Created as", value: file.creates },
              { label: "Used by", value: file.consumers.map((c) => c.replace(/\s*\(.*\)$/, "")).join(" · ") },
            ]}
          />
          {caveat && <p className="mt-3 t-body-sm text-muted">Consumers: {caveat}.</p>}
        </section>

        <section aria-label="Dictionary entities this file feeds">
          <h3 className="mb-4 t-label-caps text-muted">Feeds the data dictionary</h3>
          {fed.length ? (
            <ul className="flex flex-wrap gap-2">
              {fed.map(({ entity, fields }) => (
                <li key={entity} className="max-w-full min-w-0">
                  <Chip marker={entityColor(entity)} count={fields.length} onClick={() => onEntity(entity)} title={`Show ${entity} fields in the dictionary`}>
                    {entity}
                  </Chip>
                </li>
              ))}
            </ul>
          ) : (
            <p className="t-body-md text-muted">No dictionary fields are mapped to this file yet.</p>
          )}
          <p className="mt-4 t-body-sm text-muted">Each chip shows how many dictionary fields come from this file. Select one to see them.</p>
        </section>
      </div>

      <section aria-label="Columns explained" className="min-w-0">
        <h3 className="mb-4 t-label-caps text-muted">Columns explained</h3>
        <ColumnList file={file} onField={onField} />
      </section>
    </div>
  );
}
