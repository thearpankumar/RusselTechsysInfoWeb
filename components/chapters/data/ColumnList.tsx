"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import type { DataFile, FileColumn } from "@/content/types";
import { fieldForColumn, fieldId } from "@/content/dataDictionary";
import { fileColumns, sheetsWithColumn } from "@/content/files";
import { Chip, Marker } from "@/components/ui-rt";
import { FLAG_LABEL, REVIEW_LABEL, REVIEW_MARKER, columnStats } from "./shared";

type Filter = "all" | "must" | "open" | "answered" | "generated" | "unclear";

const FILTERS: { id: Filter; label: string; test: (c: FileColumn) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "must", label: "Must review", test: (c) => c.review === "must" },
  { id: "open", label: "Open question", test: (c) => !!c.question && !c.answer },
  { id: "answered", label: "Answered by Rossell", test: (c) => !!c.answer },
  { id: "unclear", label: "Meaning unknown", test: (c) => !!c.unclear },
  { id: "generated", label: "To be generated", test: (c) => c.generated === "yes" },
];

/** Every column of a file, explained: Rossell's name and full name, our reading, review priority, question and answer, and the dictionary field it feeds. */
export function ColumnList({ file, onField }: { file: DataFile; onField?: (fieldId: string) => void }) {
  const cols = fileColumns(file);
  const fromRossell = file.basis === "rossell-file";
  const multiSheet = file.sheets.filter((s) => !s.pivot).length > 1;
  const [filter, setFilter] = React.useState<Filter>("all");
  const active = FILTERS.find((f) => f.id === filter)!;
  const shown = cols.filter(active.test);
  const stats = columnStats(cols);

  return (
    <div className="min-w-0">
      {fromRossell && (
        <div role="group" aria-label="Filter columns" className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const n = cols.filter(f.test).length;
            if (f.id !== "all" && n === 0) return null;
            return (
              <Chip key={f.id} selected={filter === f.id} count={n} onClick={() => setFilter(filter === f.id ? "all" : f.id)}>
                {f.label}
              </Chip>
            );
          })}
        </div>
      )}
      {fromRossell && (
        <p className="mb-2 t-body-sm text-muted" role="status">
          {shown.length === cols.length ? `${cols.length} columns` : `${shown.length} of ${cols.length} columns`} · {stats.must} must review · {stats.answered} answered by Rossell
        </p>
      )}
      <ul className="divide-y divide-border border-t border-border">
        {shown.map((c) => {
          const field = fieldForColumn(file.id, c.name);
          const elsewhere = field ? field.files.filter((id) => id !== file.id).length : 0;
          const sheets = multiSheet ? sheetsWithColumn(file, c.name) : [];
          const m = c.review ? REVIEW_MARKER[c.review] : null;
          return (
            <li key={c.name} className="grid grid-cols-1 gap-x-6 gap-y-2 py-4 @xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
              <div className="min-w-0">
                <p className="t-mono-sm break-words text-on-surface">{c.name}</p>
                {c.full && <p className="mt-1 t-body-sm text-muted">Full name: {c.full}</p>}
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 t-mono-sm text-muted">
                  <span>{c.type}</span>
                  {m && c.review && (
                    <span className="inline-flex items-center gap-1.5 text-body">
                      <Marker tone={m.tone} shape={m.shape} size={8} />
                      {REVIEW_LABEL[c.review]}
                    </span>
                  )}
                </p>
                {sheets.length > 0 && sheets.length < file.sheets.filter((s) => !s.pivot).length && <p className="mt-1 t-body-sm text-muted">Only in: {sheets.join(", ")}</p>}
              </div>
              <div className="min-w-0">
                {c.unclear ? (
                  <p className="t-body-md text-body">
                    <span className="text-on-surface">Meaning not yet confirmed.</span> {fromRossell ? `The sheet calls it "${c.description.replace(/\.$/, "")}".` : c.description}
                  </p>
                ) : (
                  <p className="t-body-md text-body">{c.description}</p>
                )}
                {c.question && (
                  <p className="mt-2 t-body-sm text-muted">
                    <span className="text-body">Asked:</span> {c.question}
                  </p>
                )}
                {c.answer && (
                  <p className="mt-2 border-l border-primary pl-3 t-body-sm text-on-surface">
                    <span className="text-muted">Rossell:</span> {c.answer}
                  </p>
                )}
                {(c.available || c.stored || c.generated) && (
                  <p className="mt-2 t-mono-sm text-muted">
                    {[
                      c.available && `Available: ${FLAG_LABEL[c.available]}`,
                      c.stored && `Stored: ${FLAG_LABEL[c.stored]}`,
                      c.generated && `Generated: ${FLAG_LABEL[c.generated]}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
                {field && onField && (
                  <button
                    type="button"
                    onClick={() => onField(fieldId(field))}
                    className="mt-2 block cursor-pointer text-left t-body-sm text-body underline-offset-4 transition-colors duration-150 hover:text-on-surface hover:underline"
                  >
                    {field.entity} › {field.field}
                    {elsewhere > 0 && <span className="text-muted"> · also in {elsewhere} other {elsewhere === 1 ? "file" : "files"}</span>}
                    <ArrowRight aria-hidden className="ml-1.5 inline size-4 align-[-3px]" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
