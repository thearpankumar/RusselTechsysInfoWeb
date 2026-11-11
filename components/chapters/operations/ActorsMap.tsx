"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import { actorGroups } from "@/content/lifecycle";
import type { ActorGroup } from "@/content/types-extra";
import { ChipCount, Cite, ConfidenceTag, DetailOverlay, Legend } from "@/components/ui-rt";
import { dataBg, type DataColor } from "@/lib/dataColors";
import { cn } from "@/lib/utils";
import { useIndexOverlay } from "../anatomy/shared";

const SIDE: Record<ActorGroup["side"], DataColor> = { customer: "sage", internal: "slate", supply: "tan", systems: "lavender" };

/** Who is involved: customers ↔ Rossell teams ↔ suppliers, with systems & government around them. */
export function ActorsMap() {
  const ov = useIndexOverlay(actorGroups);
  const g = ov.current;
  return (
    <div>
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actorGroups.map((grp, i) => (
          <li key={grp.id} className="relative">
            <button type="button" onClick={() => ov.open(grp.id)} className="flex h-full w-full cursor-pointer flex-col rounded-lg border border-transparent bg-surface p-6 text-left transition-colors duration-150 hover:border-chart-past">
              <span className="flex items-center gap-2">
                <span aria-hidden className={cn("size-2.5 rounded-full", dataBg[SIDE[grp.side]])} />
                <span className="t-body-lg text-on-surface">{grp.name}</span>
                <ChipCount className="ml-auto h-7 px-2 t-mono-sm">{grp.members.length}</ChipCount>
              </span>
              <ul className="mt-4 flex flex-col divide-y divide-border">
                {grp.members.slice(0, 6).map((m) => (
                  <li key={m.name} className="flex items-center gap-2 py-2 t-body-sm text-body">
                    <span className="min-w-0 flex-1 truncate">{m.name}</span>
                    {m.basis !== "session" && <span className="t-mono-sm text-muted">{m.basis === "estimate" ? "est." : m.basis}</span>}
                  </li>
                ))}
                {grp.members.length > 6 && <li className="py-2 t-body-sm text-muted">+{grp.members.length - 6} more</li>}
              </ul>
            </button>
            {i < actorGroups.length - 1 && <ArrowLeftRight aria-hidden className="absolute top-1/2 -right-3.5 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-background p-0.5 text-chart-mid xl:block" strokeWidth={1.5} />}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Legend items={actorGroups.map((grp) => ({ label: grp.name, tone: SIDE[grp.side], count: grp.members.length }))} />
        <span className="ml-auto flex min-w-0 flex-wrap items-center gap-2">
          <span className="t-body-sm text-muted">est. = our model, to be confirmed</span>
          <ConfidenceTag confidence="session" />
          <Cite ids={["WS", "DECK-SC", "DECK-RESEARCH"]} />
        </span>
      </div>

      <DetailOverlay
        open={!!g}
        onOpenChange={ov.onOpenChange}
        eyebrow="Actors"
        title={g?.name ?? ""}
        description={g?.note}
        index={ov.index}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      >
        {g && (
          <div className="flex flex-col gap-6">
            <ul className="divide-y divide-border">
              {g.members.map((m) => (
                <li key={m.name} className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[14rem_1fr_auto] sm:items-center sm:gap-4">
                  <span className="t-body-md text-on-surface">{m.name}</span>
                  <span className="t-body-sm text-body">{m.role}</span>
                  <ConfidenceTag confidence={m.basis} />
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <ConfidenceTag confidence={g.confidence} />
              <Cite ids={g.sources} />
            </div>
          </div>
        )}
      </DetailOverlay>
    </div>
  );
}
