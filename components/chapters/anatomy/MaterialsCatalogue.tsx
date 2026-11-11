"use client";

import * as React from "react";
import { illustrativeBom, materialGroups, materials } from "@/content/materials";
import type { Material } from "@/content/types-extra";
import { CardNested, Cite, ConfidenceTag, DetailOverlay, Eyebrow, KeyValueRows } from "@/components/ui-rt";
import { dataBg, dataColorAt } from "@/lib/dataColors";
import type { useIndexOverlay } from "./shared";

const groupOf = (m: Material) => materialGroups.find((g) => g.categories.includes(m.category))!;
const groupColor = (id: string) => dataColorAt(materialGroups.findIndex((g) => g.id === id));
const bomLines = (id: string) => illustrativeBom.lines.filter((l) => l.materialId === id);

/** Materials in family order (the order the catalogue shows them and the overlay steps through them). */
export const orderedMaterials: Material[] = materialGroups.flatMap((g) => materials.filter((m) => g.categories.includes(m.category)));

export function MaterialsCatalogue({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-16">
      <div className="max-w-3xl">
        <Eyebrow>Materials · {materials.length} kinds in {materialGroups.length} families</Eyebrow>
        <p className="mt-4 t-body-lg text-body">
          These are the raw materials bought in and built into the finished goods: wire, connectors, protection and the small parts that hold a harness together. Each card says what the material is for in plain English, with the specification it is usually bought to.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="t-body-sm text-muted">Rossell&apos;s own material categories are not public, so each family is an industry example.</span>
          <ConfidenceTag confidence="industry-example" />
          <Cite ids={["S76", "DECK-SC"]} />
        </div>
      </div>

      {materialGroups.map((g) => {
        const list = materials.filter((m) => g.categories.includes(m.category));
        if (!list.length) return null;
        return (
          <section key={g.id} aria-labelledby={`mat-family-${g.id}`}>
            <div className="flex items-baseline gap-4 border-b border-border pb-4">
              <span aria-hidden className={`size-2.5 shrink-0 self-center rounded-full ${dataBg[groupColor(g.id)]}`} />
              <h3 id={`mat-family-${g.id}`} className="t-headline-md text-on-surface">
                {g.label}
              </h3>
              <span className="ml-auto t-mono-sm text-muted tnum">{list.length}</span>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((mat) => (
                <li key={mat.id}>
                  <CardNested onClick={() => onOpen(mat.id)} className="flex h-full flex-col">
                    <span className="block t-body-lg text-on-surface">{mat.name}</span>
                    <span className="mt-2 block t-body-md text-body">{mat.whatItDoes}</span>
                    <span className="mt-auto block pt-4 t-mono-sm text-muted">{mat.typicalSpec[0]}</span>
                  </CardNested>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/** Detail overlay for one material (mounted outside the sections so ⌘K can open it anywhere). */
export function MaterialOverlay({ overlay }: { overlay: ReturnType<typeof useIndexOverlay<Material>> }) {
  const m = overlay.current;
  const lines = m ? bomLines(m.id) : [];
  return (
    <DetailOverlay
      open={!!m}
      onOpenChange={overlay.onOpenChange}
      eyebrow={m ? `Material · ${groupOf(m).label}` : undefined}
      title={m?.name ?? ""}
      description={m?.whatItIs}
      index={overlay.index}
      total={overlay.total}
      onPrev={overlay.prev}
      onNext={overlay.next}
    >
      {m && (
        <div className="flex flex-col gap-8">
          <div>
            <p className="t-label-caps text-muted">What it does</p>
            <p className="mt-3 t-body-lg text-on-surface">{m.whatItDoes}</p>
          </div>
          <KeyValueRows
            rows={[
              ...m.typicalSpec.map((s, i) => ({ label: i === 0 ? "Typical spec" : "Also seen", value: <span className="t-mono-sm">{s}</span> })),
              { label: "Example makers", value: m.exampleMakers?.join(" · ") },
              { label: "Unit of measure", value: m.uom },
              { label: "Lines in the illustrative 96-line bill of materials", value: lines.length || undefined },
              { label: "Quantity per bundle across those lines", value: lines.length ? `${lines.reduce((a, l) => a + l.qtyPerFg, 0).toLocaleString("en-IN")} ${lines[0].uom}` : undefined },
            ]}
          />
          {m.note && <p className="t-body-md text-muted">{m.note}</p>}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <ConfidenceTag confidence={m.confidence} />
            <Cite ids={m.sources} />
          </div>
        </div>
      )}
    </DetailOverlay>
  );
}
