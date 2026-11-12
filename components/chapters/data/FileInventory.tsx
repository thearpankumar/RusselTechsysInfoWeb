"use client";

import * as React from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from "lucide-react";
import type { DataFile } from "@/content/types";
import { files } from "@/content/files";
import { Marker, TabTrack } from "@/components/ui-rt";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, STATUS_MARKER, consumerText, fileStats, pad2 } from "./shared";

type Filter = "all" | DataFile["status"];

export function StatusChip({ status, className }: { status: DataFile["status"]; className?: string }) {
  const m = STATUS_MARKER[status];
  return (
    <span className={cn("inline-flex h-8 w-fit items-center gap-2 rounded-full border border-border px-3 t-body-sm whitespace-nowrap text-on-surface", className)}>
      <Marker tone={m.tone} shape={m.shape} size={8} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Direction({ dir }: { dir: DataFile["direction"] }) {
  const Icon = dir === "input" ? ArrowDownLeft : ArrowUpRight;
  return (
    <span className="inline-flex items-center gap-1 t-mono-sm text-body" title={dir === "input" ? "Input: read by the planning layer" : "Output: produced and sent back"}>
      <Icon aria-hidden className="size-4 text-muted" strokeWidth={1.5} />
      {dir === "input" ? "In" : "Out"}
    </span>
  );
}

const COLS = "xl:grid-cols-[40px_minmax(0,1.6fr)_160px_56px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)_20px]";

/** The 16-report inventory as a calm list. Each row opens the file's template view. */
export function FileInventory({ onOpen }: { onOpen: (i: number) => void }) {
  const [filter, setFilter] = React.useState<Filter>("all");
  const count = (s: DataFile["status"]) => files.filter((f) => f.status === s).length;
  const shown = files.map((f, i) => ({ f, i })).filter(({ f }) => filter === "all" || f.status === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <TabTrack<Filter>
          label="Filter reports by status"
          size="sm"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: `All ${files.length}` },
            { value: "in-scope", label: `In scope ${count("in-scope")}` },
            { value: "out-of-scope", label: `Not in scope ${count("out-of-scope")}` },
            { value: "not-available", label: `Not yet available ${count("not-available")}` },
          ]}
        />
        <p className="t-body-sm text-muted">Select a report to open its template view</p>
      </div>

      <div aria-label="Report inventory" className="border-t border-border">
        <div aria-hidden className={cn("hidden gap-4 border-b border-border py-3 t-mono-sm text-muted xl:grid", COLS)}>
          <span>#</span>
          <span>Report</span>
          <span>Status</span>
          <span>Dir</span>
          <span>Source system</span>
          <span>Refresh</span>
          <span>Used by</span>
          <span aria-hidden />
        </div>
        <ul>
          {shown.map(({ f, i }) => (
            <li key={f.id}>
              <button
                type="button"
                onClick={() => onOpen(i)}
                className={cn(
                  "group grid w-full cursor-pointer grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2 border-b border-border py-4 text-left transition-colors duration-150 ease-out hover:bg-surface xl:items-center",
                  COLS,
                  f.status !== "in-scope" && "text-body"
                )}
              >
                <span className="pt-1 t-mono-sm text-muted tnum xl:pt-0">
                  {pad2(f.index)}
                </span>
                <span className="min-w-0">
                  <span className={cn("block t-body-lg", f.status === "in-scope" ? "text-on-surface" : "text-body")}>{f.name}</span>
                  <span className="mt-1 block t-body-sm text-muted">{f.what}</span>
                  <span className="mt-1 flex items-center gap-1.5 t-mono-sm text-muted">
                    <Marker tone={f.basis === "rossell-file" ? "primary" : "past"} shape={f.basis === "rossell-file" ? "dot" : "hollow"} size={8} />
                    {f.basis === "rossell-file" ? `Rossell's sheet · ${fileStats(f).columns} columns · ${fileStats(f).must} must review` : "Our model · awaiting Rossell's file"}
                  </span>
                </span>
                <span className="col-start-2 row-start-2 flex flex-wrap items-center gap-3 xl:col-start-auto xl:row-start-auto xl:block">
                  <StatusChip status={f.status} />
                  <span className="xl:hidden">
                    <Direction dir={f.direction} />
                  </span>
                </span>
                <span className="hidden xl:block">
                  <Direction dir={f.direction} />
                </span>
                <span className={cn("col-start-2 t-body-md xl:col-start-auto", f.sourceSystem ? "text-body" : "text-muted")}>
                  <span className="t-mono-sm text-muted xl:hidden">Source · </span>
                  {f.sourceSystem ?? "—"}
                </span>
                <span className={cn("col-start-2 t-body-md xl:col-start-auto", f.refresh ? "text-body" : "text-muted")}>
                  <span className="t-mono-sm text-muted xl:hidden">Refresh · </span>
                  {f.refresh ?? "—"}
                </span>
                <span className={cn("col-start-2 t-body-md xl:col-start-auto", consumerText(f) ? "text-body" : "text-muted")}>
                  <span className="t-mono-sm text-muted xl:hidden">Used by · </span>
                  {consumerText(f) || "—"}
                </span>
                <ChevronRight
                  aria-hidden
                  className="col-start-3 row-start-1 size-5 text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-on-surface xl:col-start-auto xl:row-start-auto"
                  strokeWidth={1.5}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
