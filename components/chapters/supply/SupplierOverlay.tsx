"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { getHarnessPart } from "@/content/materials";
import { supplierGroupOf, supplierGroups, type SupplierProfile } from "@/content/suppliers";
import { Button, Chip, Cite, ConfidenceTag, DetailOverlay, KeyValueRows } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import { GroupDot } from "./groups";

export function SupplierOverlay({
  supplier,
  index,
  total,
  onOpenChange,
  onPrev,
  onNext,
}: {
  supplier: SupplierProfile | null;
  index: number;
  total: number;
  onOpenChange: (o: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { goTo } = useJourney();
  const s = supplier;
  const group = s ? supplierGroups.find((g) => g.id === supplierGroupOf(s))! : null;

  // Harness parts live in chapter 09's 3D section; ?open= opens the part's overlay there after navigation.
  const openPart = (id: string) => {
    onOpenChange(false);
    goTo(`/anatomy/harness?open=harness-part:${id}`);
  };

  return (
    <DetailOverlay
      open={!!s}
      onOpenChange={onOpenChange}
      eyebrow={group ? `${group.label} · industry example` : undefined}
      title={s?.name ?? ""}
      index={index}
      total={total}
      onPrev={onPrev}
      onNext={onNext}
    >
      {s && group && (
        <div className="flex flex-col gap-8">
          <div>
            <p className="t-label-caps text-muted">Who they are and what they deal in</p>
            <p className="mt-3 t-body-lg text-on-surface">{s.makes}</p>
            <p className="mt-3 t-body-md text-muted">
              {group.label}: {group.plain.charAt(0).toLowerCase() + group.plain.slice(1)}
            </p>
          </div>
          <KeyValueRows
            rows={[
              { label: "Headquarters", value: <span className="block max-w-md text-left t-body-md">{s.hq}</span> },
              { label: "India presence", value: <span className="block max-w-md text-left t-body-md">{s.indiaPresence}</span> },
            ]}
          />
          <div>
            <p className="t-label-caps text-muted">Real example parts</p>
            <ul className="mt-4 divide-y divide-border">
              {s.exampleParts.map((p) => (
                <li key={p.part} className="py-4 first:pt-0">
                  <p className="t-body-lg text-on-surface">{p.part}</p>
                  <p className="mt-1 t-body-md text-body">{p.whatItDoes}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label-caps text-muted">Where it shows up in a harness</p>
            <p className="mt-3 t-body-md text-body">{s.usedIn}</p>
            {s.harnessPartIds.length > 0 && <p className="mt-3 t-body-sm text-muted">Select a part to open it in the harness anatomy.</p>}
            {s.harnessPartIds.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {s.harnessPartIds.map((id) => {
                  const part = getHarnessPart(id);
                  return part ? (
                    <Chip key={id} marker={<GroupDot group={supplierGroupOf(s)} />} onClick={() => openPart(id)}>
                      <span className="t-mono-sm text-muted">{part.index}</span> {part.name}
                    </Chip>
                  ) : null;
                })}
              </div>
            )}
          </div>
          {s.note && <p className="t-body-md text-muted">{s.note}</p>}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <ConfidenceTag confidence={s.confidence} />
            <Cite ids={s.sources} />
            {s.url && (
              <Button href={s.url} external size="sm" icon={<ArrowUpRight />} className="ml-auto">
                Website
              </Button>
            )}
          </div>
        </div>
      )}
    </DetailOverlay>
  );
}
