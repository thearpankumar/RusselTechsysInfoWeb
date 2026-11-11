import { FileSpreadsheet } from "lucide-react";
import type { DataFile } from "@/content/types";
import { cn } from "@/lib/utils";

const colLetter = (i: number) => (i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(64 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26)));

const fmt = (v: string | number | undefined, type: string) => {
  if (v === undefined || v === "") return "—";
  if (typeof v === "number" && type === "number") return v.toLocaleString("en-IN");
  return String(v);
};

/** Spreadsheet-style template of a report: report header band, column letters, sticky header row, row numbers, sample rows. */
export function SheetTemplate({ file, className }: { file: DataFile; className?: string }) {
  const cols = file.columns;
  const rows = file.sampleRows.slice(0, 5);
  const runLine = [file.sourceSystem, file.mechanism, file.refresh].filter(Boolean).join(" · ");
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-canvas", className)}>
      {/* Report header band (what the Crystal / Excel output carries above the grid) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <FileSpreadsheet aria-hidden className="size-5 shrink-0 text-muted" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="truncate t-mono-sm text-on-surface">{file.name}</p>
            {runLine && <p className="truncate t-mono-sm text-muted">{runLine}</p>}
          </div>
        </div>
        <span className="inline-flex h-8 shrink-0 items-center gap-2 rounded-full border border-dashed border-chart-mid px-3 t-mono-sm text-on-surface">
          <span aria-hidden className="hatch size-2 rounded-full" />
          Sample data
        </span>
      </div>

      <div data-lenis-prevent className="max-h-96 overflow-auto" tabIndex={0} role="region" aria-label={`${file.name} template with sample rows`}>
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
                  title={c.description}
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
      <p className="border-t border-border px-4 py-3 t-body-sm text-muted">
        {cols.length} columns · {rows.length} sample rows · column layout is our template of a typical IQMS / Crystal report; values are invented, not Rossell data.
      </p>
    </div>
  );
}
