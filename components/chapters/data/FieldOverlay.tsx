"use client";

import type { DictionaryEntry } from "@/content/types";
import { dictionaryNote, entityGroupOf } from "@/content/dataDictionary";
import { fileColumns, getFile, sheetsWithColumn } from "@/content/files";
import { Chip, Cite, ConfidenceTag, DetailOverlay, KeyValueRows, Marker } from "@/components/ui-rt";
import { cn } from "@/lib/utils";
import { REVIEW_LABEL, REVIEW_MARKER, entityColor, pad2 } from "./shared";

/** Detail overlay for one dictionary field; pages through the currently filtered list. */
export function FieldOverlay({
  list,
  index,
  onIndexChange,
  onOpenFile,
  onEntity,
}: {
  list: DictionaryEntry[];
  index: number | null;
  onIndexChange: (i: number | null) => void;
  onOpenFile: (fileId: string) => void;
  onEntity: (entity: string) => void;
}) {
  const d = index === null ? undefined : list[index];
  const n = list.length;
  const group = d ? entityGroupOf(d.entity) : undefined;
  const names = d ? [...new Set(d.columns.map((c) => c.column))] : [];
  return (
    <DetailOverlay
      open={!!d}
      onOpenChange={(o) => !o && onIndexChange(null)}
      size="lg"
      className="grid-cols-1"
      eyebrow={d ? `${d.entity} · ${group?.label ?? "Entity"}` : undefined}
      title={d?.field ?? ""}
      description={d?.definition}
      index={index ?? undefined}
      total={n}
      onPrev={n > 1 ? () => index !== null && onIndexChange((index - 1 + n) % n) : undefined}
      onNext={n > 1 ? () => index !== null && onIndexChange((index + 1) % n) : undefined}
    >
      {d && (
        <div className="flex flex-col gap-12">
          <div className="flex flex-wrap items-center gap-2">
            <Chip marker={entityColor(d.entity)} onClick={() => onEntity(d.entity)} title={`Show every ${d.entity} field`}>
              {d.entity}
            </Chip>
            <Chip dashed={d.basis !== "rossell-file"} marker={<Marker tone={d.basis === "rossell-file" ? "primary" : "past"} shape={d.basis === "rossell-file" ? "dot" : "hollow"} size={8} />}>
              {d.basis === "rossell-file" ? "In Rossell's column sheets" : "Our model only"}
            </Chip>
            <Cite ids={dictionaryNote.sources} />
            <ConfidenceTag confidence={dictionaryNote.confidence} />
          </div>
          <KeyValueRows
            rows={[
              { label: "Type", value: <span className="t-mono-sm">{d.type}</span> },
              { label: "Known as", value: names.length ? <span className="t-mono-sm">{names.join(" · ")}</span> : undefined },
              { label: "Example (sample)", value: d.example ? <span className="t-mono-sm">{d.example}</span> : undefined },
              { label: "Entity", value: d.entity },
              { label: "Used by", value: d.usedBy.join(" · ") },
            ]}
          />
          <section aria-label="Columns that carry this field">
            <h3 className="mb-4 t-label-caps text-muted">Found in</h3>
            {d.columns.length ? (
              <ul className="divide-y divide-border border-t border-border">
                {d.columns.map((ref) => {
                  const f = getFile(ref.file);
                  const col = f ? fileColumns(f).find((c) => c.name === ref.column) : undefined;
                  const sheets = f && f.sheets.filter((s) => !s.pivot).length > 1 ? sheetsWithColumn(f, ref.column) : [];
                  const m = col?.review ? REVIEW_MARKER[col.review] : null;
                  return (
                    <li key={`${ref.file}-${ref.column}`} className="grid grid-cols-1 gap-x-6 gap-y-2 py-4 md:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onOpenFile(ref.file)}
                          className="inline-flex cursor-pointer items-center gap-2 text-left t-body-md text-on-surface underline-offset-4 transition-colors duration-150 hover:underline"
                        >
                          <span className="t-mono-sm text-muted">{f ? pad2(f.index) : "—"}</span>
                          {f?.name ?? ref.file}
                        </button>
                        <p className="mt-1 flex items-center gap-1.5 t-mono-sm text-muted">
                          <Marker tone={f?.basis === "rossell-file" ? "primary" : "past"} shape={f?.basis === "rossell-file" ? "dot" : "hollow"} size={8} />
                          {f?.basis === "rossell-file" ? "Rossell's sheet" : "Our model"}
                          {sheets.length > 0 && <span> · {sheets.join(", ")}</span>}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="t-mono-sm text-on-surface">{ref.column}</span>
                          {col?.full && <span className="t-body-sm text-muted">{col.full}</span>}
                          {m && col?.review && (
                            <span className="inline-flex items-center gap-1.5 t-mono-sm text-body">
                              <Marker tone={m.tone} shape={m.shape} size={8} />
                              {REVIEW_LABEL[col.review]}
                            </span>
                          )}
                        </p>
                        {col?.question && (
                          <p className="mt-1 t-body-sm text-muted">
                            <span className="text-body">Asked:</span> {col.question}
                          </p>
                        )}
                        {col?.answer && (
                          <p className={cn("mt-1 border-l border-primary pl-3 t-body-sm text-on-surface")}>
                            <span className="text-muted">Rossell:</span> {col.answer}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="t-body-md text-muted">Not carried by any of the 16 reports; it lives in IQMS master data or the planning layer.</p>
            )}
          </section>
          <p className="t-body-sm text-muted">{dictionaryNote.text}</p>
        </div>
      )}
    </DetailOverlay>
  );
}
