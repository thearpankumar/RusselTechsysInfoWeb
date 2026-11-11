// Shared helpers for chapter 13 (files & data dictionary).
import type { DataFile, DictionaryEntry } from "@/content/types";
import { dataDictionary, dictionaryEntityGroups, entityGroupOf } from "@/content/dataDictionary";
import { dataColorAt, type DataColor } from "@/lib/dataColors";

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const STATUS_LABEL: Record<DataFile["status"], string> = {
  "in-scope": "In scope",
  "out-of-scope": "Out of scope",
  "not-available": "Not yet available",
};

/** Status by shape, not hue: solid white = in scope, hollow = out of scope, grey = waiting on Rossell. */
export const STATUS_MARKER: Record<DataFile["status"], { tone: "primary" | "past"; shape: "dot" | "hollow" }> = {
  "in-scope": { tone: "primary", shape: "dot" },
  "out-of-scope": { tone: "past", shape: "hollow" },
  "not-available": { tone: "past", shape: "dot" },
};

/** The five teams that read the reports. */
export const CONSUMERS = ["Buyer", "PPC", "Engineering", "Sourcing", "SCM"] as const;
export type ConsumerKey = (typeof CONSUMERS)[number];

/** Normalise the free-text consumer cells ("PPC (Production Planning & Control)", "Buyer (per research deck…)"). */
export function consumerKeys(f: DataFile): ConsumerKey[] {
  const out = new Set<ConsumerKey>();
  for (const c of f.consumers) {
    const k = CONSUMERS.find((key) => c.startsWith(key));
    if (k) out.add(k);
  }
  return [...out];
}

/** Short consumer text for rows, keeping the qualifiers out of the dense list. */
export const consumerText = (f: DataFile) => {
  const keys = consumerKeys(f);
  return keys.length ? keys.join(" · ") : "";
};

/** Consumer cells that carry a caveat (blank in the session sheet, filled from the deck). */
export const consumerCaveat = (f: DataFile) => f.consumers.find((c) => c.includes("("))?.match(/\(([^)]*)\)/)?.[1];

/** Colour per entity group (DESIGN.md order); a group keeps its colour everywhere. */
export const groupColor: Record<string, DataColor> = Object.fromEntries(dictionaryEntityGroups.map((g, i) => [g.id, dataColorAt(i)]));

export const entityColor = (entity: string): DataColor => groupColor[entityGroupOf(entity)?.id ?? ""] ?? "sage";

/** Dictionary entities a file feeds (in dictionary order). */
export function entitiesForFile(fileId: string): { entity: string; fields: DictionaryEntry[] }[] {
  const map = new Map<string, DictionaryEntry[]>();
  for (const d of dataDictionary) {
    if (!d.files.includes(fileId)) continue;
    if (!map.has(d.entity)) map.set(d.entity, []);
    map.get(d.entity)!.push(d);
  }
  return [...map.entries()].map(([entity, fields]) => ({ entity, fields }));
}

/** Count of dictionary fields per file id. */
export const fieldCountByFile: Record<string, number> = dataDictionary.reduce<Record<string, number>>((acc, d) => {
  for (const f of d.files) acc[f] = (acc[f] ?? 0) + 1;
  return acc;
}, {});
