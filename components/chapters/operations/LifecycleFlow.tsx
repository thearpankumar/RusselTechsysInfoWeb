"use client";

import * as React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { lifecycleStages, workflows } from "@/content/lifecycle";
import { Card, Chip, Cite, ConfidenceTag, DetailOverlay, IconButton } from "@/components/ui-rt";
import { dataBg } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { useIndexOverlay } from "../anatomy/shared";
import { PHASE_COLOR } from "./phases";

/** The seven-stage business lifecycle (info.md) as a horizontal, scroll-snapped flow. */
export function LifecycleFlow({ openWorkflow }: { openWorkflow: (id: string) => void }) {
  const ov = useIndexOverlay(lifecycleStages);
  const rowRef = React.useRef<HTMLOListElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = rowRef.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 360), behavior: "smooth" });
  };
  const st = ov.current;

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <IconButton label="Scroll stages left" icon={<ChevronLeft />} size="sm" onClick={() => scrollBy(-1)} />
        <IconButton label="Scroll stages right" icon={<ChevronRight />} size="sm" onClick={() => scrollBy(1)} />
      </div>
      <ol ref={rowRef} className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:-mx-12 sm:px-12 lg:mx-0 lg:px-0" aria-label="Seven-stage business lifecycle">
        {lifecycleStages.map((s, i) => (
          <li key={s.id} className="flex shrink-0 snap-start items-stretch gap-4">
            <Card onClick={() => ov.open(s.id)} className="flex w-72 flex-col sm:w-80">
              <span className="t-mono-sm text-muted">Stage {String(s.index).padStart(2, "0")}</span>
              <span className="mt-3 block t-body-lg text-on-surface">{s.name}</span>
              <span className="mt-2 block t-body-sm text-body">{s.plain}</span>
              <ol className="mt-6 flex flex-col gap-2 border-t border-border pt-4">
                {s.steps.map((step, k) => (
                  <li key={step} className="flex items-center gap-3 t-body-sm text-on-surface">
                    <span className={cn("size-2 shrink-0 rounded-full border", k === s.steps.length - 1 ? "border-primary bg-primary" : "border-chart-mid")} />
                    {step}
                  </li>
                ))}
              </ol>
              <span className="mt-auto pt-6 t-mono-sm text-muted">{s.workflowIds.join(" · ")}</span>
            </Card>
            {i < lifecycleStages.length - 1 && <ArrowRight aria-hidden className="size-5 shrink-0 self-center text-chart-mid" strokeWidth={1.5} />}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ConfidenceTag confidence="rules" />
        <Cite ids={["INFO", "RULES"]} />
      </div>

      <DetailOverlay
        open={!!st}
        onOpenChange={ov.onOpenChange}
        eyebrow={st ? `Lifecycle stage ${String(st.index).padStart(2, "0")}` : undefined}
        title={st?.name ?? ""}
        description={st?.plain}
        index={ov.index}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      >
        {st && (
          <div className="flex flex-col gap-8">
            <ol className="flex flex-wrap items-center gap-2">
              {st.steps.map((step, k) => (
                <li key={step} className="flex items-center gap-2">
                  <Chip>{step}</Chip>
                  {k < st.steps.length - 1 && <ArrowRight aria-hidden className="size-4 text-chart-mid" strokeWidth={1.5} />}
                </li>
              ))}
            </ol>
            <div>
              <p className="t-label-caps text-muted">Workflows in this stage</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {st.workflowIds.map((id) => {
                  const w = workflows.find((x) => x.id === id);
                  return w ? (
                    <Chip key={id} marker={<span aria-hidden className={cn("h-4 w-0.75 rounded-full", dataBg[PHASE_COLOR[w.phase]])} />} onClick={() => openWorkflow(id)}>
                      <span className="t-mono-sm text-muted">{id}</span> {w.name}
                    </Chip>
                  ) : null;
                })}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <ConfidenceTag confidence={st.confidence} />
              <Cite ids={st.sources} />
            </div>
          </div>
        )}
      </DetailOverlay>
    </div>
  );
}
