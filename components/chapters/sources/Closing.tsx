"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui-rt";
import { useJourney } from "@/components/journey/JourneyProvider";

/** Quiet close of the journey: a statement, the sign-off and a way back to the start. Knowledge only, no pitch. */
export function Closing() {
  const { goTo } = useJourney();
  return (
    <div id="sources-close" className="scroll-mt-24 border-t border-border pt-16">
      <p className="max-w-4xl t-headline-lg text-on-surface">
        Fifteen years, four domains, sixteen reports and one chain from customer PO to kitted wire bundle. This is Rossell Techsys as we understand it today, and every line of it is open to correction.
      </p>
      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-mono-sm text-muted">Prepared by Talencia Global for Rossell Techsys · November 2026</p>
        <Button variant="secondary" onClick={() => goTo("/")} icon={<ArrowUp aria-hidden />}>
          Back to the map
        </Button>
      </div>
    </div>
  );
}
