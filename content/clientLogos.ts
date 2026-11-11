// Client logos for the logo wall (components/chapters/Clients.tsx). Each file in public/images/clients/
// is the company's own mark, recoloured to a single tone (SVG: currentColor; PNG: one dark tone on
// transparency) so the tile sets its colour. Shapes are unchanged; only colour, metadata and
// surrounding whitespace were removed. Credits (LOGO-*) merge into the registry via researchSourceLists.
// Clients without an entry (TLMAL, undisclosed customers) keep their text wordmark.
import type { Source } from "./types";

export interface ClientLogo {
  /** Path under /public. */
  src: string;
  /** Intrinsic size (SVG viewBox or PNG pixels); only the ratio matters for layout. */
  width: number;
  height: number;
  /** Company the mark belongs to (used in the credit title). */
  title: string;
  /** Where the file was obtained. */
  sourceUrl: string;
  /** What was done to the file. */
  note: string;
  /** Emblem-style marks with no legible name at tile size get a small caption under the logo. */
  caption?: boolean;
}

const MONO_SVG = "Recoloured to a single tone (currentColor); metadata and whitespace removed.";
const MONO_PNG = "Recoloured to a single dark tone on transparency; trimmed.";

export const clientLogos: Record<string, ClientLogo> = {
  boeing: { src: "/images/clients/boeing.svg", width: 169.54, height: 38.76, title: "Boeing", sourceUrl: "https://commons.wikimedia.org/wiki/File:Boeing_full_logo.svg", note: MONO_SVG },
  "lockheed-martin": { src: "/images/clients/lockheed-martin.svg", width: 2131.94, height: 322.04, title: "Lockheed Martin", sourceUrl: "https://www.lockheedmartin.com/content/dam/lockheed-martin/general/lm-logo.svg", note: MONO_SVG },
  honeywell: { src: "/images/clients/honeywell.svg", width: 677.88, height: 120.07, title: "Honeywell", sourceUrl: "https://commons.wikimedia.org/wiki/File:Honeywell_logo.svg", note: MONO_SVG },
  iai: { src: "/images/clients/iai.png", width: 386, height: 240, title: "Israel Aerospace Industries", sourceUrl: "https://en.wikipedia.org/wiki/File:Israel_Aerospace_Industries_logo.svg", note: `Rendered from the SVG (it embeds raster masks). ${MONO_PNG}` },
  "bae-systems": { src: "/images/clients/bae-systems.svg", width: 708.75, height: 109.75, title: "BAE Systems", sourceUrl: "https://commons.wikimedia.org/wiki/File:BAE_Systems_logo.svg", note: "Recoloured to a single tone (currentColor) with the lettering knocked out of the box, as in the original." },
  thales: { src: "/images/clients/thales.svg", width: 483.8, height: 57.4, title: "Thales", sourceUrl: "https://cpl.thalesgroup.com/sites/default/files/content/thales-logo-building-a-future-we-can-all-trust.svg", note: `Wordmark only (the tagline line of the lockup is not used). ${MONO_SVG}` },
  telair: { src: "/images/clients/telair.svg", width: 2012.6, height: 572.08, title: "Telair", sourceUrl: "https://telair.com/wp-content/uploads/2020/01/telair-logo-blue.svg", note: MONO_SVG },
  albatross: { src: "/images/clients/albatross.png", width: 259, height: 240, title: "Albatross Aerospace", sourceUrl: "https://albatrossaerospace.com/wp-content/uploads/2021/10/Albatross_logo-sheet-ai.png", note: MONO_PNG, caption: true },
  knight: { src: "/images/clients/knight.svg", width: 193.48, height: 47.16, title: "Knight Aerospace", sourceUrl: "https://knightaerospace.com/wp-content/uploads/2023/04/knight-logo-dark.svg", note: MONO_SVG },
  "interconnect-wiring": { src: "/images/clients/interconnect-wiring.png", width: 431, height: 118, title: "InterConnect Wiring", sourceUrl: "https://www.interconnect-wiring.com/wp-content/themes/interconnect-wiring/images/logo2019.jpg", note: MONO_PNG },
  expleo: { src: "/images/clients/expleo.svg", width: 180.5, height: 35.22, title: "Expleo", sourceUrl: "https://expleo.com/global/en/", note: `Header logo (inline SVG) from the company website. ${MONO_SVG}` },
  "indian-air-force": { src: "/images/clients/indian-air-force.png", width: 217, height: 240, title: "Indian Air Force", sourceUrl: "https://indianairforce.nic.in/admin/assets/images/outerimages/logo.png", note: MONO_PNG, caption: true },
  hal: { src: "/images/clients/hal.png", width: 613, height: 240, title: "Hindustan Aeronautics Limited", sourceUrl: "https://en.wikipedia.org/wiki/File:Hindustan_Aeronautics_Limited_Logo.svg", note: `Rendered from the SVG (it embeds raster gradients). ${MONO_PNG}` },
  ada: { src: "/images/clients/ada.png", width: 215, height: 215, title: "Aeronautical Development Agency", sourceUrl: "https://commons.wikimedia.org/wiki/File:Aeronautical_Development_Agency_logo.png", note: MONO_PNG, caption: true },
  bel: { src: "/images/clients/bel.svg", width: 300, height: 79.95, title: "Bharat Electronics", sourceUrl: "https://en.wikipedia.org/wiki/File:Bharat_Electronics_logo.svg", note: MONO_SVG },
  drdo: { src: "/images/clients/drdo.png", width: 240, height: 240, title: "DRDO", sourceUrl: "https://en.wikipedia.org/wiki/File:Defence_Research_and_Development_Organisation.svg", note: `Rendered from the SVG (it embeds a raster). ${MONO_PNG}`, caption: true },
  tata: { src: "/images/clients/tata.svg", width: 422.08, height: 369.46, title: "Tata", sourceUrl: "https://commons.wikimedia.org/wiki/File:Tata_logo.svg", note: MONO_SVG },
  lt: { src: "/images/clients/lt.svg", width: 302.74, height: 56, title: "Larsen & Toubro", sourceUrl: "https://2025prodstorageaccount-eqdyc8g8hpccdfez.a02.azurefd.net/ltprod/media/d44ph50r/lt.svg", note: `Header logo from larsentoubro.com. ${MONO_SVG}` },
  ge: { src: "/images/clients/ge.svg", width: 1262.18, height: 297.2, title: "GE Aerospace", sourceUrl: "https://commons.wikimedia.org/wiki/File:GE_Aerospace_logo.svg", note: MONO_SVG },
  amazon: { src: "/images/clients/amazon.svg", width: 602.28, height: 181.5, title: "Amazon", sourceUrl: "https://commons.wikimedia.org/wiki/File:Amazon_logo.svg", note: MONO_SVG },
  "lam-research": { src: "/images/clients/lam-research.svg", width: 586.53, height: 199.65, title: "Lam Research", sourceUrl: "https://www.lamresearch.com/etc.clientlibs/lamresearch/clientlibs/clientlib-site/resources/images/sprite.svg", note: `Logo symbol (#icon-logo) from the site sprite. ${MONO_SVG}` },
  "applied-materials": { src: "/images/clients/applied-materials.svg", width: 779.53, height: 196.57, title: "Applied Materials", sourceUrl: "https://commons.wikimedia.org/wiki/File:Applied_Materials_Logo.svg", note: MONO_SVG },
};

export const getClientLogo = (id: string): ClientLogo | undefined => clientLogos[id];

/** Image credits for the logos (group "imagery"). */
export const clientLogoSources: Source[] = Object.entries(clientLogos).map(([id, l]) => ({
  id: `LOGO-${id}`,
  title: `Logo: ${l.title}`,
  publisher: `trademark of ${l.title}; used to identify the customer`,
  url: l.sourceUrl,
  accessed: "11 Nov 2026",
  group: "imagery",
}));
