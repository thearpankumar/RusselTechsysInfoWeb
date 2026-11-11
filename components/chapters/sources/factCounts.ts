// Server-side tally of every sourced fact in content/: how many carry each confidence label, and which source ids are cited.
// To include a new content module, add it to MODULES.
import type { Confidence } from "@/content/types";
import { sources } from "@/content/sources";
import * as company from "@/content/company";
import * as financials from "@/content/financials";
import * as locations from "@/content/locations";
import * as people from "@/content/people";
import * as domains from "@/content/domains";
import * as clients from "@/content/clients";
import * as products from "@/content/products";
import * as materials from "@/content/materials";
import * as scale from "@/content/scale";
import * as lifecycle from "@/content/lifecycle";
import * as glossary from "@/content/glossary";
import * as files from "@/content/files";
import * as dictionary from "@/content/dataDictionary";
import * as openQuestions from "@/content/openQuestions";
import * as competitors from "@/content/competitors";
import * as suppliers from "@/content/suppliers";
import * as orders from "@/content/orders";
import * as portfolio from "@/content/portfolio";
import * as footprint from "@/content/footprint";

const MODULES: Record<string, unknown>[] = [
  company,
  financials,
  locations,
  people,
  domains,
  clients,
  products,
  materials,
  scale,
  lifecycle,
  glossary,
  files,
  dictionary,
  openQuestions,
  competitors,
  suppliers,
  orders,
  portfolio,
  footprint,
];

export const CONFIDENCE_ORDER: Confidence[] = ["reported", "session", "rules", "calc", "estimate", "industry-example"];
const VALID = new Set<string>(CONFIDENCE_ORDER);

export interface FactTally {
  total: number;
  byConfidence: Record<Confidence, number>;
  /** Distinct source ids cited anywhere in content/. */
  cited: string[];
  /** Cited ids missing from the registry (should be empty). */
  unresolved: string[];
  /** How many sourced objects cite each id. */
  citeCounts: Record<string, number>;
}

function tally(): FactTally {
  const byConfidence = Object.fromEntries(CONFIDENCE_ORDER.map((c) => [c, 0])) as Record<Confidence, number>;
  const cited = new Set<string>();
  const citeCounts: Record<string, number> = {};
  const seen = new WeakSet<object>();
  let total = 0;

  const walk = (v: unknown, depth: number) => {
    if (!v || typeof v !== "object" || depth > 12) return;
    if (seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) {
      for (const x of v) walk(x, depth + 1);
      return;
    }
    const o = v as Record<string, unknown>;
    if (Array.isArray(o.sources) && o.sources.every((s) => typeof s === "string")) {
      for (const s of new Set(o.sources as string[])) {
        cited.add(s);
        citeCounts[s] = (citeCounts[s] ?? 0) + 1;
      }
      if (typeof o.confidence === "string" && VALID.has(o.confidence)) {
        byConfidence[o.confidence as Confidence] += 1;
        total += 1;
      }
    }
    for (const k of Object.keys(o)) if (k !== "sources") walk(o[k], depth + 1);
  };

  for (const m of MODULES) for (const k of Object.keys(m)) walk(m[k], 0);

  const known = new Set(sources.map((s) => s.id));
  return {
    total,
    byConfidence,
    cited: [...cited].sort(),
    unresolved: [...cited].filter((id) => !known.has(id)).sort(),
    citeCounts,
  };
}

export const factTally: FactTally = tally();
