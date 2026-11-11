"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { dataDictionary, dictionaryNote, entityGroupOf, entityMap } from "@/content/dataDictionary";
import { getFile } from "@/content/files";
import { Button, Chip, Cite, ConfidenceTag } from "@/components/ui-rt";
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
        const fileIds = [...new Set(fields.flatMap((d) => d.files))];
        return { e, n: fields.length, fileIds };
      })
    : [];
  const total = rows.reduce((s, r) => s + r.n, 0);
  const next = idx >= 0 ? entityMap[idx + 1] : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-4 t-body-md text-muted">Select a step in the chain to see the entities it holds and the reports that carry them.</p>
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
              Show {total} fields in the dictionary
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
                <span className="t-body-sm text-body">
                  {r.fileIds.length ? (
                    <>
                      <span className="text-muted">Carried by </span>
                      {r.fileIds.map((id) => `${pad2(getFile(id)?.index ?? 0)} ${getFile(id)?.name ?? id}`).join(" · ")}
                    </>
                  ) : (
                    <span className="text-muted">Not carried by any of the sixteen reports yet</span>
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
