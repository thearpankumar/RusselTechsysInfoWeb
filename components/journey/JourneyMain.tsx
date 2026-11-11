"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useJourney } from "./JourneyProvider";

/** <main> offset by the desktop rail: 288px expanded, 72px collapsed, 0 while presenting. Animates 200ms ease-out. */
export function JourneyMain({ children }: { children: React.ReactNode }) {
  const { railCollapsed, presenting } = useJourney();
  return (
    <main
      id="main"
      className={cn(
        "pt-16 transition-[padding] duration-200 ease-out motion-reduce:transition-none lg:pt-0 print:pt-0 print:pl-0",
        presenting ? "lg:pl-0" : railCollapsed ? "lg:pl-18" : "lg:pl-64"
      )}
    >
      {children}
    </main>
  );
}
