"use client";

import * as React from "react";
import { requestToCash, requestToCashNotes } from "@/content/lifecycle";
import { CardNested, Cite, ConfidenceTag, DetailOverlay, Marker } from "@/components/ui-rt";
import { cn } from "@/lib/utils";
import { useIndexOverlay } from "../anatomy/shared";

const PO_STEPS = new Set(["Customer PO", "Supplier POs"]);
const INVOICES = [
  { label: "Invoice 1", cr: 1 },
  { label: "Invoice 2", cr: 2 },
  { label: "Invoice 3", cr: 5 },
  { label: "Still to bill", cr: 2 },
];
const items = requestToCash.map((s) => ({ ...s, id: String(s.index) }));

/** Request-to-cash ribbon: RFP → … → ship & invoice, with the two POs and the one-PO-many-invoices rule. */
export function RequestToCash() {
  const ov = useIndexOverlay(items);
  const st = ov.current;
  return (
    <div className="flex flex-col gap-8">
      <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4 lg:grid-cols-7" aria-label="Request to cash">
        {items.map((s) => {
          const po = PO_STEPS.has(s.name);
          return (
            <li key={s.id} className="bg-surface">
              <button type="button" onClick={() => ov.open(s.id)} className="flex h-full w-full cursor-pointer flex-col gap-2 p-4 text-left transition-colors duration-150 hover:bg-surface-raised">
                <span className="flex items-center gap-2 t-mono-sm text-muted">
                  {String(s.index).padStart(2, "0")}
                  {po && <Marker tone="primary" size={8} />}
                </span>
                <span className={cn("t-body-md", po ? "text-on-surface" : "text-body")}>{s.name}</span>
                <span className="t-body-sm text-muted">{s.what}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CardNested>
          <p className="flex items-center gap-2 t-label-caps text-muted">
            <Marker tone="primary" size={8} /> Two POs in play
          </p>
          <p className="mt-3 t-body-md text-body">{requestToCashNotes[0].text}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ConfidenceTag confidence={requestToCashNotes[0].confidence} />
            <Cite ids={requestToCashNotes[0].sources} />
          </div>
        </CardNested>
        <CardNested>
          <p className="t-label-caps text-muted">One PO, many invoices</p>
          <div className="mt-4 flex w-full gap-1" role="img" aria-label="A ₹10 Cr PO billed as ₹1, ₹2 and ₹5 Cr invoices with ₹2 Cr still to bill">
            {INVOICES.map((inv) => (
              <div
                key={inv.label}
                style={{ flexGrow: inv.cr, flexBasis: 0 }}
                className={cn("flex h-12 min-w-8 items-center rounded-md border px-3 t-mono-sm", inv.label === "Still to bill" ? "border-dashed border-border text-muted" : "border-border bg-surface text-on-surface")}
              >
                ₹{inv.cr}
              </div>
            ))}
          </div>
          <p className="mt-2 t-mono-sm text-muted">PO ₹10 Cr · illustrative amounts</p>
          <p className="mt-3 t-body-md text-body">{requestToCashNotes[1].text}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ConfidenceTag confidence={requestToCashNotes[1].confidence} />
            <Cite ids={requestToCashNotes[1].sources} />
          </div>
        </CardNested>
      </div>

      <DetailOverlay
        open={!!st}
        onOpenChange={ov.onOpenChange}
        eyebrow={st ? `Request to cash · step ${String(st.index).padStart(2, "0")}` : undefined}
        title={st?.name ?? ""}
        description={st?.what}
        index={ov.index}
        total={ov.total}
        onPrev={ov.prev}
        onNext={ov.next}
      >
        {st && (
          <div className="flex flex-col gap-6">
            <p className="t-body-md text-body">
              Document: <span className="text-on-surface">{st.supporting}</span>
            </p>
            {st.fileIds.length > 0 && <p className="t-mono-sm text-muted">Related files · {st.fileIds.join(" · ")}</p>}
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
