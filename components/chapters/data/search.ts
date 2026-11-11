// ⌘K items for chapter "data". Content-only imports (this module is lazy-loaded by the palette on every page).
// hrefs: "#<anchor>" (resolved to the owning section by lib/searchCatalog) or a full "/data/<section>#x".
import type { SearchItem } from "@/lib/searchIndex";
import { files } from "@/content/files";
import { dataDictionary, dictionaryEntities, fieldId } from "@/content/dataDictionary";

const STATUS_LABEL: Record<string, string> = { "in-scope": "In scope", "out-of-scope": "Out of scope", "not-available": "Not yet available" };
const pad2 = (n: number) => String(n).padStart(2, "0");
const entitySlug = (e: string) => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const searchItems: SearchItem[] = [
  ...files.map((f) => ({
    id: `file:${f.id}`,
    label: f.name,
    group: "Files",
    hint: `${pad2(f.index)} · ${STATUS_LABEL[f.status]}`,
    keywords: [f.what, f.sourceSystem ?? "", f.direction, ...f.consumers, ...f.columns.map((c) => c.name)],
    href: "#data-templates",
    open: { type: "file", id: f.id },
  })),
  ...dictionaryEntities.map((e) => ({
    id: `entity:${entitySlug(e)}`,
    label: e,
    group: "Data dictionary",
    hint: `Entity · ${dataDictionary.filter((d) => d.entity === e).length} fields`,
    keywords: ["entity", "table"],
    href: "#data-dictionary",
    open: { type: "entity", id: e },
  })),
  ...dataDictionary.map((d) => ({
    id: `field:${fieldId(d)}`,
    label: d.field,
    group: "Data dictionary",
    hint: d.entity,
    keywords: [d.entity, d.type, d.definition],
    href: "#data-dictionary",
    open: { type: "field", id: fieldId(d) },
  })),
];
