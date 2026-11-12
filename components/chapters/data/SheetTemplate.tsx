"use client";

import * as React from "react";
import { FileSpreadsheet } from "lucide-react";
import type { DataFile } from "@/content/types";
import { TabTrack } from "@/components/ui-rt";
import { cn } from "@/lib/utils";
import { shortDate } from "./shared";

const colLetter = (i: number) => (i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(64 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26)));

const fmt = (v: string | number | undefined, type: string) => {
  if (v === undefined || v === "") return "—";
  if (typeof v === "number" && type === "number") return v.toLocaleString("en-IN");
  return String(v);
};

/** Spreadsheet-style template of a report: header band, sheet tabs, column letters, sticky header row, row numbers, sample rows. */
export function SheetTemplate({ file, className }: { file: DataFile; className?: string }) {
  const [sheetIdx, setSheetIdx] = React.useState(0);
  const sheet = file.sheets[Math.min(sheetIdx, file.sheets.length - 1)];
  const cols = sheet.columns;
  const rows = sheet.pivot ? sheet.sampleRows : sheet.sampleRows.slice(0, 5);
  const fromRossell = file.basis === "rossell-file";
  const runLine = fromRossell ? [file.workbook, file.extractDate && `extract ${shortDate(file.extractDate)}`].filter(Boolean).join(" · ") : [file.sourceSystem, file.mechanism, file.refresh].filter(Boolean).join(" · ");

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-canvas", className)}>
      {/* Report header band */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <FileSpreadsheet aria-hidden className="size-5 shrink-0 text-muted" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="truncate t-mono-sm text-on-surface">{file.name}</p>
            {runLine && <p className="truncate t-mono-sm text-muted">{runLine}</p>}
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {fromRossell ? (
            <span className="inline-flex h-8 items-center gap-2 rounded-full border border-border px-3 t-mono-sm text-on-surface">
              <span aria-hidden className="size-2 rounded-full bg-primary" />
              Rossell&apos;s column names
            </span>
          ) : (
            <span className="inline-flex h-8 items-center gap-2 rounded-full border border-dashed border-chart-mid px-3 t-mono-sm text-on-surface">
              <span aria-hidden className="size-2 rounded-full border border-chart-mid" />
              Our model
            </span>
          )}
          <span className="inline-flex h-8 items-center gap-2 rounded-full border border-dashed border-chart-mid px-3 t-mono-sm text-on-surface">
            <span aria-hidden className="hatch size-2 rounded-full" />
            Sample data
          </span>
        </div>
      </div>

      {file.sheets.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
          <TabTrack<string>
            label={`Sheets in ${file.name}`}
            size="sm"
            value={sheet.name}
            onChange={(name) => setSheetIdx(Math.max(0, file.sheets.findIndex((s) => s.name === name)))}
            options={file.sheets.map((s) => ({ value: s.name, label: s.name }))}
          />
          <span className="t-body-sm text-muted">{file.sheets.length} sheets in this workbook</span>
        </div>
      )}

      <div data-lenis-prevent className="max-h-96 overflow-auto" tabIndex={0} role="region" aria-label={`${file.name}, sheet ${sheet.name}, with sample rows`}>
        <table className="w-max min-w-full border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th aria-hidden className="sticky top-0 left-0 z-30 h-7 w-12 border-r border-b border-border bg-surface" />
              {cols.map((c, i) => (
                <th key={`l-${c.name}`} aria-hidden className="sticky top-0 z-20 h-7 border-r border-b border-border bg-surface px-3 text-center t-mono-sm font-normal text-muted">
                  {colLetter(i)}
                </th>
              ))}
            </tr>
            <tr>
              <th scope="col" className="sticky top-7 left-0 z-30 border-r border-b border-border bg-surface-raised px-3 py-2 t-mono-sm font-normal text-muted">
                #
              </th>
              {cols.map((c) => (
                <th
                  key={c.name}
                  scope="col"
                  title={`${c.full ? `${c.full}: ` : ""}${c.unclear ? "meaning not yet confirmed" : c.description}`}
                  className={cn(
                    "sticky top-7 z-20 border-r border-b border-border bg-surface-raised px-3 py-2 t-mono-sm font-normal whitespace-nowrap text-on-surface",
                    c.type === "number" && "text-right"
                  )}
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="group/row">
                <th scope="row" className="sticky left-0 z-10 border-r border-b border-border bg-surface px-3 py-2 text-right t-mono-sm font-normal text-muted">
                  {ri + 1}
                </th>
                {cols.map((c) => {
                  const v = r[c.name];
                  return (
                    <td
                      key={c.name}
                      className={cn(
                        "max-w-72 truncate border-r border-b border-border px-3 py-2 t-body-sm whitespace-nowrap text-body transition-colors duration-150 group-hover/row:bg-background group-hover/row:text-on-surface",
                        c.type === "number" && "text-right tnum",
                        (v === undefined || v === "") && "text-muted"
                      )}
                    >
                      {fmt(v, c.type)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border px-4 py-3 t-body-sm text-muted">
        {sheet.note && <p className="mb-1 text-body">{sheet.note}</p>}
        <p>
          {cols.length} columns · {rows.length} sample rows ·{" "}
          {fromRossell
            ? "column names exactly as in Rossell's file; every value is invented, not Rossell data."
            : "column layout is our model until Rossell sends this file; values are invented."}
        </p>
      </div>
    </div>
  );
}
