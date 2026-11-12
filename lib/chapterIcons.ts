// One lucide line icon per chapter (rail, collapsed rail, hub doors). 1.5px stroke, inherits text colour.
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookMarked,
  Building2,
  Cable,
  Database,
  Factory,
  Globe2,
  Layers,
  LayoutGrid,
  PackageSearch,
  ScrollText,
  Swords,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";

export const MAP_ICON: LucideIcon = LayoutGrid;

export const CHAPTER_ICON: Record<string, LucideIcon> = {
  portfolio: Award, // approvals, awards, identity
  financials: Wallet,
  growth: TrendingUp,
  footprint: Globe2,
  people: Users,
  "what-they-do": Layers, // domains & services
  clients: Building2,
  competition: Swords,
  anatomy: Cable, // the harness
  scale: Factory,
  "supply-base": PackageSearch,
  operations: Workflow,
  data: Database,
  rules: ScrollText, // the rule register
  sources: BookMarked,
};

export function chapterIcon(id: string): LucideIcon {
  return CHAPTER_ICON[id] ?? LayoutGrid;
}
