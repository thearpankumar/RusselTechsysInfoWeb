"use client";

import type { DictionaryEntry } from "@/content/types";
import { dictionaryNote, entityGroupOf } from "@/content/dataDictionary";
import { getFile } from "@/content/files";
import { Chip, Cite, ConfidenceTag, DetailOverlay, KeyValueRows } from "@/components/ui-rt";
import { entityColor, pad2 } from "./shared";

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
  return (
    <DetailOverlay
      open={!!d}
      onOpenChange={(o) => !o && onIndexChange(null)}
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
            <Cite ids={dictionaryNote.sources} />
            <ConfidenceTag confidence={dictionaryNote.confidence} />
          </div>
          <KeyValueRows
            rows={[
              { label: "Type", value: <span className="t-mono-sm">{d.type}</span> },
              { label: "Example (sample)", value: d.example ? <span className="t-mono-sm">{d.example}</span> : undefined },
              { label: "Entity", value: d.entity },
              { label: "Used by", value: d.usedBy.join(" · ") },
            ]}
          />
          <section aria-label="Files that carry this field">
            <h3 className="mb-4 t-label-caps text-muted">Found in</h3>
            {d.files.length ? (
              <ul className="flex flex-wrap gap-2">
                {d.files.map((id) => {
                  const f = getFile(id);
                  return (
                    <li key={id}>
                      <Chip onClick={() => onOpenFile(id)} icon={<span className="t-mono-sm">{f ? pad2(f.index) : "—"}</span>}>
                        {f?.name ?? id}
                      </Chip>
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
