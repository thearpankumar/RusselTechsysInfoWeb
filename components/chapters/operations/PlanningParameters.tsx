"use client";

import * as React from "react";
import { planningParameters } from "@/content/lifecycle";
import { Cite, ConfidenceTag, DetailOverlay, KeyValueRows } from "@/components/ui-rt";
import { useIndexOverlay } from "../anatomy/shared";

/** The eleven planning parameters (deck p.5) as a table; each row opens its detail. */
export function PlanningParameters() {
  const ov = useIndexOverlay(planningParameters);
  const p = ov.current;
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-3 pr-4 t-mono-sm text-muted">
                #
              </th>
              <th scope="col" className="py-3 pr-6 t-mono-sm text-muted">
                Parameter
              </th>
              <th scope="col" className="py-3 pr-6 t-mono-sm text-muted">
                What it means
              </th>
              <th scope="col" className="py-3 pr-6 t-mono-sm text-muted">
                Comes from
              </th>
              <th scope="col" className="py-3 t-mono-sm text-muted">
                Example
              </th>
            </tr>
          </thead>
          <tbody>
            {planningParameters.map((row, i) => (
              <tr key={row.id} onClick={() => ov.open(row.id)} className="cursor-pointer border-b border-border transition-colors duration-150 hover:bg-surface-raised">
                <td className="py-4 pr-4 align-top t-mono-sm text-muted">{String(i + 1).padStart(2, "0")}</td>
                <td className="py-4 pr-6 align-top">
                  <button type="button" onClick={(e) => (e.stopPropagation(), ov.open(row.id))} className="cursor-pointer text-left t-body-md text-on-surface underline-offset-4 hover:underline">
                    {row.name}
                  </button>
                </td>
                <td className="py-4 pr-6 align-top t-body-md text-body">{row.meaning}</td>
                <td className="py-4 pr-6 align-top t-body-sm text-muted">{row.from}</td>
                <td className="py-4 align-top t-mono-sm whitespace-nowrap text-on-surface">{row.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ConfidenceTag confidence="session" />
        <Cite ids={["DECK-SC", "WS", "RULES"]} />
      </div>
      <DetailOverlay
        open={!!p}
        onOpenChange={ov.onOpenChange}
        eyebrow="Planning parameter"
        title={p?.name ?? ""}
        description={p?.meaning}
        index={ov.index}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      >
        {p && (
          <div className="flex flex-col gap-6">
            <KeyValueRows
              rows={[
                { label: "Comes from", value: p.from },
                { label: "Example", value: <span className="t-mono-sm">{p.example}</span> },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
              <ConfidenceTag confidence={p.confidence} showReported />
              <Cite ids={p.sources} />
            </div>
          </div>
        )}
      </DetailOverlay>
    </div>
  );
}
