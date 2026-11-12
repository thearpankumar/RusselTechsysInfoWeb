"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { dataDictionary, dictionaryNote, entityGroupOf, entityMap } from "@/content/dataDictionary";
import { getFile } from "@/content/files";
import { Button, Chip, Cite, ConfidenceTag, Marker } from "@/components/ui-rt";
import { EntityMap } from "./EntityMap";
import { entityColor, pad2 } from "./shared";

/** Entity map (customer → invoice) with a detail panel for the selected step: its entities, field counts and source files. */
export function EntityExplorer({ onShowNode, onShowEntity }: { onShowNode: (nodeId: string) => void; onShowEntity: (entity: string) => void }) {
  const [selected, setSelected] = React.useState<string | null>(entityMap[0]?.id ?? null);
  const node = selected ? entityMap.find((n) => n.id === selected) : undefined;
  const idx = node ? entityMap.indexOf(node) : -1;
  const rows = node
    ? node.entities.map((e) => {
        const fields = dataDictionary.filter((d) => d.entity === e);
        const fileIds = [...new Set(fields.flatMap((d) => d.files))].sort((a, b) => (getFile(a)?.index ?? 0) - (getFile(b)?.index ?? 0));
        const byFile = fileIds.map((id) => ({ id, columns: [...new Set(fields.flatMap((d) => d.columns.filter((c) => c.file === id).map((c) => c.column)))] }));
        return { e, n: fields.length, byFile };
      })
    : [];
  const total = rows.reduce((s, r) => s + r.n, 0);
  const next = idx >= 0 ? entityMap[idx + 1] : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-4 t-body-md text-muted">Select a step in the chain to see the entities it holds, the reports that carry them and the exact column names. A solid marker means the step appears in Rossell&apos;s own column sheets; a hollow one, only in our model.</p>
        <EntityMap selected={selected} onSelect={setSelected} />
      </div>

      {node && (
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="t-mono-sm text-muted">
                {entityGroupOf(node.entities[0])?.label ?? "Entity"}
              </p>
              <h3 className="mt-2 t-headline-md text-on-surface">{node.label}</h3>
              {next && node.next && (
                <p className="mt-2 flex flex-wrap items-center gap-2 t-body-md text-body">
                  {node.label} <span className="text-muted">{node.next}</span> <ArrowRight aria-hidden className="size-4 text-chart-mid" strokeWidth={1.5} /> {next.label}
                </p>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={() => onShowNode(node.id)} icon={<ArrowRight aria-hidden />}>
              <span>
                Show {total} fields<span className="hidden sm:inline"> in the dictionary</span>
              </span>
            </Button>
          </div>
          <ul className="mt-6 divide-y divide-border border-t border-border">
            {rows.map((r) => (
              <li key={r.e} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] md:items-center md:gap-6">
                <span>
                  <Chip marker={entityColor(r.e)} count={r.n} onClick={() => onShowEntity(r.e)} title={`Show ${r.e} fields in the dictionary`}>
                    {r.e}
                  </Chip>
                </span>
                <span className="flex min-w-0 flex-col gap-1.5 t-body-sm text-body">
                  {r.byFile.length ? (
                    r.byFile.map(({ id, columns }) => {
                      const f = getFile(id);
                      const fromRossell = f?.basis === "rossell-file";
                      return (
                        <span key={id} className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                          <span className="inline-flex items-center gap-1.5 text-on-surface">
                            <Marker tone={fromRossell ? "primary" : "past"} shape={fromRossell ? "dot" : "hollow"} size={8} />
                            <span className="t-mono-sm text-muted">{pad2(f?.index ?? 0)}</span> {f?.name ?? id}
                          </span>
                          <span className="min-w-0 t-mono-sm text-muted">
                            {columns.slice(0, 6).join(" · ")}
                            {columns.length > 6 ? ` +${columns.length - 6}` : ""}
                          </span>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-muted">Our model: not carried by any of the sixteen reports yet</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ConfidenceTag confidence={dictionaryNote.confidence} />
            <Cite ids={dictionaryNote.sources} />
          </div>
        </div>
      )}
    </div>
  );
}
