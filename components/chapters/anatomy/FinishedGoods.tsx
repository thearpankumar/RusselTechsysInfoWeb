"use client";

import * as React from "react";
import { products, productContexts } from "@/content/products";
import { serviceLabel } from "@/content/domains";
import type { Product } from "@/content/types-extra";
import { Card, Chip, Cite, ConfidenceTag, DetailOverlay, Eyebrow, KeyValueRows, PhotoCard } from "@/components/ui-rt";
import { dataBg } from "@/lib/dataColors";
import { DOMAIN_COLOR } from "@/content/clients";
import type { useIndexOverlay } from "./shared";

const domainColor = (d: keyof typeof DOMAIN_COLOR) => DOMAIN_COLOR[d];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Finished goods grouped by type (harnesses first: they are most of what Rossell ships). */
export const goodsTypes: { id: string; label: string; plain: string; ids: string[] }[] = [
  {
    id: "harnesses",
    label: "Harnesses",
    plain: "Bundles of wire with connectors at the ends: the bulk of what Rossell builds.",
    ids: ["ewis-harness", "wire-bundle", "engine-harness", "fibre-optic-harness", "semi-harness", "space-harness"],
  },
  { id: "panels", label: "Panels", plain: "Flat assemblies of switches, breakers, relays and wiring mounted on a plate.", ids: ["electrical-panel", "cockpit-panel"] },
  { id: "assemblies", label: "Assemblies and boxes", plain: "Mechanical and electronic units with wiring built in.", ids: ["electro-mech", "avionics-assembly"] },
  { id: "test", label: "Test equipment", plain: "Rigs that test the parts above; they stay on the ground.", ids: ["test-equipment"] },
];

const byId = (id: string) => products.find((p) => p.id === id);
export const orderedProducts: Product[] = goodsTypes.flatMap((t) => t.ids.map(byId)).filter((p): p is Product => !!p);
const typeOf = (id: string) => goodsTypes.find((t) => t.ids.includes(id));

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block t-mono-sm text-muted">{children}</span>;
}

export function FinishedGoods({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow>Finished goods · {orderedProducts.length} types</Eyebrow>
          <p className="mt-4 max-w-2xl t-body-lg text-body">
            A finished good is the part number Rossell ships to a customer. Each card says what it is in plain English and where it sits once fitted: in an aircraft, a chip-making tool or a satellite. Select one for the programmes, services and sources.
          </p>
        </div>
        <PhotoCard asset="fa18-harness-install" priority className="lg:col-span-5" sizes="(min-width: 1024px) 480px, 100vw" />
      </div>

      {goodsTypes.map((t) => {
        const list = t.ids.map(byId).filter((p): p is Product => !!p);
        return (
          <section key={t.id} aria-labelledby={`fg-type-${t.id}`}>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-4">
              <h3 id={`fg-type-${t.id}`} className="t-headline-md text-on-surface">
                {t.label}
              </h3>
              <span className="t-mono-sm text-muted tnum">{list.length}</span>
              <p className="w-full t-body-md text-muted sm:ml-auto sm:w-auto">{t.plain}</p>
            </div>
            <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {list.map((prod) => {
                return (
                  <li key={prod.id}>
                    <Card onClick={() => onOpen(prod.id)} className="flex h-full flex-col">
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="t-label-caps text-muted">{prod.nickname}</span>
                      </span>
                      <span className="mt-3 block t-body-lg font-medium text-on-surface">{prod.name}</span>
                      <span className="mt-4 block">
                        <Label>What it is</Label>
                        <span className="mt-1 block t-body-md text-body">{prod.whatItIs}</span>
                      </span>
                      <span className="mt-4 block border-t border-border pt-4">
                        <Label>Where it sits</Label>
                        <span className="mt-1 block t-body-md text-on-surface">{prod.whereItSits}</span>
                      </span>
                      <span className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
                        {prod.domains.map((d) => (
                          <span key={d} className="inline-flex items-center gap-2 t-body-sm text-muted">
                            <span aria-hidden className={`size-2 rounded-full ${dataBg[domainColor(d)]}`} />
                            {cap(d)}
                          </span>
                        ))}
                      </span>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/** Detail overlay for one finished good (mounted outside the sections so ⌘K can open it anywhere). */
export function FinishedGoodOverlay({ overlay }: { overlay: ReturnType<typeof useIndexOverlay<Product>> }) {
  const p = overlay.current;
  const ctx = p ? productContexts[p.id] : undefined;
  const type = p ? typeOf(p.id) : undefined;
  return (
    <DetailOverlay
      open={!!p}
      onOpenChange={overlay.onOpenChange}
      eyebrow={p ? `Finished good${type ? ` · ${type.label}` : ""}${p.nickname ? ` · ${p.nickname}` : ""}` : undefined}
      title={p?.name ?? ""}
      description={p?.whatItIs}
      index={overlay.index}
      total={overlay.total}
      onPrev={overlay.prev}
      onNext={overlay.next}
    >
      {p && (
        <div className="flex flex-col gap-8">
          <KeyValueRows
            rows={[
              { label: "In real life", value: <span className="block max-w-md text-left t-body-md">{p.realLife}</span> },
              { label: "Where it sits", value: <span className="block max-w-md text-left t-body-md">{p.whereItSits}</span> },
              ...(ctx
                ? [
                    {
                      label: "Where you would find it",
                      value: <span className="block max-w-md text-left t-body-md">{ctx.text}</span>,
                      meta: (
                        <>
                          <ConfidenceTag confidence={ctx.confidence} />
                          <Cite ids={ctx.sources} />
                        </>
                      ),
                    },
                  ]
                : []),
              { label: "Programmes", value: p.programs?.join(" · ") },
            ]}
          />
          <div>
            <p className="t-label-caps text-muted">Services involved</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.services.map((s) => (
                <Chip key={s}>{serviceLabel(s)}</Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="t-label-caps text-muted">Domains</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.domains.map((d) => (
                <Chip key={d} marker={domainColor(d)}>
                  {cap(d)}
                </Chip>
              ))}
            </div>
          </div>
          {p.note && <p className="t-body-md text-muted">{p.note}</p>}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <ConfidenceTag confidence={p.confidence} showReported />
            <Cite ids={p.sources} />
          </div>
        </div>
      )}
    </DetailOverlay>
  );
}
