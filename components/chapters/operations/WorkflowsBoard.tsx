"use client";

import * as React from "react";
import { GitBranch } from "lucide-react";
import { workflowPhases, workflows } from "@/content/lifecycle";
import type { Workflow } from "@/content/types-extra";
import { Cite, ConfidenceTag, DetailOverlay, KeyValueRows, Legend, Marker } from "@/components/ui-rt";
import { dataBg, dataTint } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { PHASE_COLOR } from "./phases";

/** 20 workflows in 5 phase columns; workflow-node cards with a 3px phase stripe and an in-scope marker. */
export interface WorkflowOverlayState {
  current: Workflow | null;
  index: number;
  total: number;
  open: (id: string) => void;
  onOpenChange: (o: boolean) => void;
  prev: () => void;
  next: () => void;
}

export function WorkflowsBoard({ overlay }: { overlay: WorkflowOverlayState }) {
  const inScope = workflows.filter((x) => x.inScope).length;
  return (
    <div>
      <div className="dot-grid -mx-6 overflow-x-auto rounded-none bg-canvas px-6 py-8 sm:mx-0 sm:rounded-xl sm:px-8">
        <div className="grid min-w-[64rem] grid-cols-5 gap-4">
          {workflowPhases.map((ph) => {
            const list = workflows.filter((x) => x.phase === ph.id);
            return (
              <section key={ph.id} aria-label={`Phase ${ph.id}: ${ph.name}`}>
                <header className="mb-4 flex items-center gap-2">
                  <span aria-hidden className={cn("size-2.5 rounded-full", dataBg[PHASE_COLOR[ph.id]])} />
                  <span className="t-mono-sm text-muted">{ph.id}</span>
                  <span className="t-body-md text-on-surface">{ph.name}</span>
                  <span className="ml-auto t-mono-sm text-muted">{list.length}</span>
                </header>
                <ol className="flex flex-col gap-3">
                  {list.map((x) => (
                    <li key={x.id}>
                      <button
                        type="button"
                        onClick={() => overlay.open(x.id)}
                        className="relative flex w-full cursor-pointer flex-col gap-2 overflow-hidden rounded-md border border-border bg-surface p-4 pl-6 text-left transition-colors duration-150 hover:border-chart-past"
                      >
                        <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.75", dataBg[PHASE_COLOR[x.phase]])} />
                        <span className="flex items-center gap-2 t-mono-sm text-muted">
                          <GitBranch className="size-3.5" strokeWidth={1.5} aria-hidden />
                          {x.id}
                        </span>
                        <span className="t-body-md text-on-surface">{x.name}</span>
                        <span className="flex items-center gap-2 t-body-sm text-muted">
                          <Marker tone={x.inScope ? "primary" : "past"} shape={x.inScope ? "dot" : "hollow"} size={8} />
                          {x.inScope ? "In scope" : "Context"} · {x.actors.length} roles
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Legend
          items={[
            { label: "In scope of the working sessions", tone: "primary", count: inScope },
            { label: "Context around it", tone: "past", shape: "hollow", count: workflows.length - inScope },
          ]}
        />
        <span className="ml-auto flex min-w-0 flex-wrap items-center gap-2">
          <ConfidenceTag confidence="estimate" />
          <Cite ids={["DECK-RESEARCH", "DECK-SC", "WS"]} />
        </span>
      </div>
      <p className="mt-2 t-body-sm text-muted">A working model built from the sessions and the research deck, to be validated with Rossell; each card carries its own confidence.</p>
    </div>
  );
}

/** Workflow detail overlay. Mounted outside the sections so lifecycle stages and search can open it from any section. */
export function WorkflowOverlay({ overlay }: { overlay: WorkflowOverlayState }) {
  const w = overlay.current;
  return (
    <DetailOverlay
      open={!!w}
      onOpenChange={overlay.onOpenChange}
      eyebrow={w ? `Workflow ${w.id} · ${workflowPhases.find((p) => p.id === w.phase)?.name}` : undefined}
      title={w?.name ?? ""}
      description={w ? `Starts with: ${w.trigger}` : undefined}
      index={overlay.index}
      total={overlay.total}
      onPrev={overlay.prev}
      onNext={overlay.next}
    >
      {w && (
        <div className="flex flex-col gap-8">
          <div>
            <p className="t-label-caps text-muted">Who is involved</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {w.actors.map((a) => (
                <span key={a} className={cn("inline-flex h-7 items-center rounded-sm px-2 t-mono-sm text-on-surface", dataTint[PHASE_COLOR[w.phase]])}>
                  {a}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="t-label-caps text-muted">Steps</p>
            <ol className="mt-4 flex flex-col gap-2">
              {w.steps.map((s) => (
                <li key={s} className="flex gap-4 t-body-md text-body">
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <KeyValueRows
            rows={[
              { label: "Output", value: <span className="block max-w-md text-left">{w.output}</span> },
              { label: "Scope", value: w.inScope ? "In scope of the working sessions" : "Context" },
            ]}
          />
          {w.note && <p className="t-body-md text-muted">{w.note}</p>}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <ConfidenceTag confidence={w.confidence} showReported />
            <Cite ids={w.sources} />
          </div>
        </div>
      )}
    </DetailOverlay>
  );
}
