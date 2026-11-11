"use client";

import * as React from "react";
import { harnessParts, getMaterial, illustrativeBom, type HarnessPart } from "@/content/materials";
import { supplierGroupOf, suppliers } from "@/content/suppliers";
import { Button, Chip, Cite, ConfidenceTag, DetailOverlay, KeyValueRows, PhotoCard } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";
import { GroupDot } from "../supply/groups";

/** Photo shown in the overlay of a harness part, when one exists (content/assets.ts placements). */
const PART_PHOTO: Partial<Record<string, string>> = { connector: "d38999-connector" };

const shortName = (n: string) => n.replace(/\s*\(.*\)\s*$/, "");

export function PartOverlay({
  part,
  onOpenChange,
  onPrev,
  onNext,
  onSupplier,
}: {
  part: HarnessPart | null;
  onOpenChange: (o: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
  /** Open a supplier in place (used inside the Supply base chapter). Defaults to navigating to its profile. */
  onSupplier?: (id: string) => void;
}) {
  const { goTo } = useJourney();
  const m = part ? getMaterial(part.materialId) : undefined;
  const makers = part ? suppliers.filter((s) => s.harnessPartIds.includes(part.id)) : [];
  const lines = part ? illustrativeBom.lines.filter((l) => l.materialId === part.materialId).length : 0;
  const idx = part ? harnessParts.findIndex((p) => p.id === part.id) : 0;
  const photo = part ? PART_PHOTO[part.id] : undefined;

  const openSupplier = (id: string) => {
    onOpenChange(false);
    if (onSupplier) onSupplier(id);
    else goTo(`/supply-base/universe?open=supplier:${id}`);
  };

  return (
    <DetailOverlay
      open={!!part}
      onOpenChange={onOpenChange}
      eyebrow={part ? `Harness part · ${part.index}` : undefined}
      title={part?.name ?? ""}
      description={part?.whatItIs}
      index={idx}
      total={harnessParts.length}
      onPrev={onPrev}
      onNext={onNext}
    >
      {part && (
        <div className="flex flex-col gap-8">
          {photo && <PhotoCard asset={photo} sizes="(min-width: 768px) 560px, 100vw" />}
          <div>
            <p className="t-label-caps text-muted">What it does in the aircraft or tool</p>
            <p className="mt-3 t-body-lg text-on-surface">{part.whatItDoes}</p>
          </div>
          <KeyValueRows
            rows={[
              { label: "Typical spec", value: <span className="t-mono-sm">{part.spec}</span> },
              ...(m?.typicalSpec.slice(1).map((s) => ({ label: "Also seen", value: <span className="t-mono-sm">{s}</span> })) ?? []),
              { label: "Unit of measure", value: m?.uom },
              { label: "Lines in the illustrative 96-line bill of materials", value: lines || undefined, meta: <ConfidenceTag confidence="industry-example" /> },
            ]}
          />
          <div>
            <p className="t-label-caps text-muted">Who typically supplies it · industry examples</p>
            {makers.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {makers.map((s) => (
                  <Chip key={s.id} marker={<GroupDot group={supplierGroupOf(s)} />} onClick={() => openSupplier(s.id)}>
                    {shortName(s.name)}
                  </Chip>
                ))}
              </div>
            ) : (
              <p className="mt-3 t-body-md text-muted">No supplier in the profiled set is mapped to this part.</p>
            )}
            {!onSupplier && (
              <Button href="/supply-base/universe" size="sm" arrow className="mt-4" onClick={() => onOpenChange(false)}>
                All supplier profiles
              </Button>
            )}
          </div>
          {m?.note && <p className="t-body-md text-muted">{m.note}</p>}
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6">
            <ConfidenceTag confidence={part.confidence} />
            <Cite ids={part.sources} />
          </div>
        </div>
      )}
    </DetailOverlay>
  );
}
