"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { DataFile } from "@/content/types";
import { files } from "@/content/files";
import { Chip, Cite, ConfidenceTag, DetailOverlay, KeyValueRows, Marker } from "@/components/ui-rt";
import { SheetTemplate } from "./SheetTemplate";
import { STATUS_LABEL, STATUS_MARKER, consumerCaveat, entitiesForFile, entityColor, pad2 } from "./shared";

/** Large overlay for one report: template view, plain meaning, what/when/who, columns explained, entities fed. Pages through all 16. */
export function FileOverlay({
  index,
  onIndexChange,
  onEntity,
}: {
  /** 0-based position in `files`, or null when closed. */
  index: number | null;
  onIndexChange: (i: number | null) => void;
  /** Jump to the data dictionary filtered to an entity. */
  onEntity: (entity: string) => void;
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
      {file && <FileDetail file={file} onEntity={onEntity} />}
    </DetailOverlay>
  );
}

export function FileDetail({ file, onEntity }: { file: DataFile; onEntity: (entity: string) => void }) {
  const m = STATUS_MARKER[file.status];
  const fed = entitiesForFile(file.id);
  const caveat = consumerCaveat(file);
  return (
    <div className="flex min-w-0 flex-col gap-12">
      <div className="flex flex-wrap items-center gap-2">
        <Chip marker={<Marker tone={m.tone} shape={m.shape} size={8} />}>{STATUS_LABEL[file.status]}</Chip>
        <Chip icon={file.direction === "input" ? <ArrowDownLeft /> : <ArrowUpRight />}>{file.direction === "input" ? "Input to planning" : "Output from planning"}</Chip>
        <Cite ids={file.sources} />
        <ConfidenceTag confidence="session" />
      </div>

      <section aria-label="Template view" className="min-w-0">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="t-label-caps text-muted">Template view</h3>
          <span className="t-body-sm text-muted">Hover a column name for its meaning</span>
        </div>
        <SheetTemplate file={file} />
      </section>

      <div className="grid grid-cols-1 min-w-0 gap-12 md:grid-cols-2">
        <section aria-label="What, when, who">
          <h3 className="mb-2 t-label-caps text-muted">What · when · who</h3>
          <KeyValueRows
            rows={[
              { label: "Holds", value: file.what },
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
                <li key={entity}>
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
        <h3 className="mb-2 t-label-caps text-muted">Columns explained</h3>
        <div className="divide-y divide-border">
          {file.columns.map((c) => (
            <div key={c.name} className="grid grid-cols-1 gap-x-4 gap-y-1 py-3 sm:grid-cols-[200px_88px_1fr]">
              <span className="t-body-md text-on-surface">{c.name}</span>
              <span className="col-start-2 t-mono-sm text-muted sm:col-start-auto">{c.type}</span>
              <span className="col-start-2 t-body-md text-body sm:col-start-auto">{c.description}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
