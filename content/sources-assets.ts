// Image credits (IMG-*): one Source per photo in content/assets.ts. Merged into the registry via researchSourceLists.
import type { Source } from "./types";
import { photoAssets } from "./assets";

export const assetSources: Source[] = photoAssets.map((a) => ({
  id: a.sourceId,
  title: `Photo: ${a.title}`,
  publisher: `${a.author} · ${a.licence}${a.licenceUrl ? ` (${a.licenceUrl})` : ""} · Wikimedia Commons`,
  url: a.sourceUrl,
  accessed: "11 Nov 2026",
  group: "imagery",
}));
