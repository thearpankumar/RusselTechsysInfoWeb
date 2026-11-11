"use client";

// 09 · Finished goods & materials: the anatomy of a harness (3D, assembles on scroll), finished goods by type,
// and the materials catalogue by family. Overlays live outside the sections so ⌘K and ?open= work on every section.
import * as React from "react";
import { ChapterShell } from "@/components/journey/ChapterShell";
import { Section } from "@/components/journey/Section";
import { Cite, ConfidenceTag, Eyebrow, PhotoCard } from "@/components/ui-rt";
import { harnessParts } from "@/content/materials";
import { products } from "@/content/products";
import { useSearchOpen } from "@/lib/searchIndex";
import { AnatomyPinned } from "./anatomy/AnatomyPinned";
import { FinishedGoodOverlay, FinishedGoods, orderedProducts } from "./anatomy/FinishedGoods";
import { MaterialOverlay, MaterialsCatalogue, orderedMaterials } from "./anatomy/MaterialsCatalogue";
import { PartOverlay } from "./anatomy/PartOverlay";
import { useIndexOverlay } from "./anatomy/shared";

const ewis = products.find((p) => p.id === "ewis-harness");

function HarnessIntro() {
  return (
    <div id="anatomy-intro" className="grid scroll-mt-24 grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <Eyebrow>What a harness is</Eyebrow>
        {ewis && (
          <>
            <p className="mt-4 max-w-2xl t-body-lg text-on-surface">{ewis.realLife}</p>
            <p className="mt-4 max-w-2xl t-body-md text-body">
              Below, one harness is taken apart into the twelve kinds of part it is built from. The real thing is laid out on a board like the one in the photo, then fitted into the aircraft.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ConfidenceTag confidence={ewis.confidence} showReported />
              <Cite ids={ewis.sources} />
            </div>
          </>
        )}
      </div>
      <PhotoCard asset="harness-board" priority className="lg:col-span-5" sizes="(min-width: 1024px) 480px, 100vw" />
    </div>
  );
}

export default function Anatomy() {
  const parts = useIndexOverlay(harnessParts);
  const goods = useIndexOverlay(orderedProducts);
  const mats = useIndexOverlay(orderedMaterials);

  const openPart = parts.open;
  const openGood = goods.open;
  const openMat = mats.open;
  useSearchOpen("harness-part", React.useCallback((id: string) => openPart(id), [openPart]));
  useSearchOpen("product", React.useCallback((id: string) => openGood(id), [openGood]));
  useSearchOpen("material", React.useCallback((id: string) => openMat(id), [openMat]));

  return (
    <ChapterShell
      id="anatomy"
      statement="Anatomy of a harness."
      lead={
        <>
          A wire harness is hundreds of numbered wires, cut, routed, terminated, protected and tested as one part. Scroll to watch one assemble, one part at a time; select any part for what it is and what it does in the aircraft.{" "}
          <span className="inline-flex flex-wrap items-center gap-2 align-middle">
            <ConfidenceTag confidence="industry-example" />
            <Cite ids={["S76", "DECK-SC"]} />
          </span>
        </>
      }
    >
      <Section id="harness">
        <HarnessIntro />
        <div id="anatomy-harness" className="scroll-mt-24">
          <AnatomyPinned overlay={parts} />
        </div>
      </Section>

      <Section id="goods">
        <div id="anatomy-goods" className="scroll-mt-24">
          <FinishedGoods onOpen={goods.open} />
        </div>
      </Section>

      <Section id="materials">
        <div id="anatomy-materials" className="scroll-mt-24">
          <MaterialsCatalogue onOpen={mats.open} />
        </div>
      </Section>

      <PartOverlay part={parts.current} onOpenChange={parts.onOpenChange} onPrev={parts.prev} onNext={parts.next} />
      <FinishedGoodOverlay overlay={goods} />
      <MaterialOverlay overlay={mats} />
    </ChapterShell>
  );
}
