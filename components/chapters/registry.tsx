// Chapter id → page body component (each renders <ChapterShell> with its <Section>s).
import type { ComponentType } from "react";
import type { ChapterId } from "@/lib/journeyChapters";
import Portfolio from "./Portfolio";
import Financials from "./Financials";
import Growth from "./Growth";
import Footprint from "./Footprint";
import People from "./People";
import WhatTheyDo from "./WhatTheyDo";
import Clients from "./Clients";
import Competition from "./Competition";
import Anatomy from "./Anatomy";
import Scale from "./Scale";
import SupplyBase from "./SupplyBase";
import Operations from "./Operations";
import DataFiles from "./DataFiles";
import Sources from "./Sources";

export const chapterComponents: Record<ChapterId, ComponentType> = {
  portfolio: Portfolio,
  financials: Financials,
  growth: Growth,
  footprint: Footprint,
  people: People,
  "what-they-do": WhatTheyDo,
  clients: Clients,
  competition: Competition,
  anatomy: Anatomy,
  scale: Scale,
  "supply-base": SupplyBase,
  operations: Operations,
  data: DataFiles,
  sources: Sources,
};
