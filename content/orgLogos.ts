// Issuer logos for the approvals & awards section (components/chapters/portfolio/). Same shape and
// treatment as content/clientLogos.ts: each file in public/images/orgs/ is the body's own mark, recoloured
// to a single tone (SVG: currentColor; PNG: one dark tone on transparency) and trimmed, never redrawn.
// Credits (LOGO-*) merge into the registry via researchSourceLists.
//
// Bodies deliberately left without a mark (the card keeps its shield icon):
// - DSIR and the Defence Production Licence (DPIIT, with the Ministry of Defence): their only identity is the State
//   Emblem of India, whose use is restricted by the State Emblem of India (Prohibition of Improper Use) Act, 2005.
// - CMMC: the DoD CIO site refuses automated requests; no official mark was obtained.
import type { Source } from "./types";
import { clientLogos, type ClientLogo } from "./clientLogos";

export type OrgLogo = ClientLogo;

const MONO_SVG = "Recoloured to a single tone (currentColor); metadata and whitespace removed.";
const MONO_PNG = "Recoloured to a single dark tone on transparency (tone follows the original's lightness); trimmed.";

export const orgLogos: Record<string, OrgLogo> = {
  iaqg: { src: "/images/orgs/iaqg.png", width: 421, height: 240, title: "International Aerospace Quality Group (IAQG)", sourceUrl: "https://iaqg.org/wp-content/uploads/2024/07/IAQG_Logo_RGB.png", note: MONO_PNG },
  pri: { src: "/images/orgs/pri.svg", width: 179.59, height: 56.06, title: "Performance Review Institute (PRI)", sourceUrl: "https://brxd.fullsight.org/site/binaries/content/gallery/p-r-i-org/logo/svg-logos/pri/prilogoblue.svg", note: `Header logo of p-r-i.org, the Nadcap administrator (the Nadcap pages carry the PRI mark). ${MONO_SVG}` },
  iso: { src: "/images/orgs/iso.png", width: 226, height: 240, title: "International Organization for Standardization (ISO)", sourceUrl: "https://commons.wikimedia.org/wiki/File:ISO_logo_red.svg", note: `Rendered from the SVG; the globe and letters stay knocked out of the square, as in the original. ${MONO_PNG}` },
  nist: { src: "/images/orgs/nist.svg", width: 645.3, height: 170.53, title: "National Institute of Standards and Technology (NIST)", sourceUrl: "https://commons.wikimedia.org/wiki/File:NIST_logo.svg", note: MONO_SVG },
  igbc: { src: "/images/orgs/igbc.png", width: 151, height: 240, title: "Indian Green Building Council (IGBC)", sourceUrl: "https://d1owjfc1d3lv0e.cloudfront.net/website-assets/frontend-assets/images/logo/logo.png", note: `Header logo of igbc.in. ${MONO_PNG}`, caption: true },
  "et-edge": { src: "/images/orgs/et-edge.png", width: 215, height: 240, title: "ET Edge", sourceUrl: "https://et-edge.com/wp-content/uploads/2026/10/ET-Edge-Logo-with-Times-Insignia_Red-of-Color-BG-copy.png", note: `ET Edge mark only (the Times Group insignia beside it is not used). ${MONO_PNG}` },
};

/** An issuer's logo id resolves to its own mark here, or to an existing client logo (Boeing, DRDO, …). */
export const getIssuerLogo = (id: string): OrgLogo | undefined => orgLogos[id] ?? clientLogos[id];

/** Image credits for the issuer logos (group "imagery"). Client logos already carry their own LOGO-* entry. */
export const orgLogoSources: Source[] = Object.entries(orgLogos).map(([id, l]) => ({
  id: `LOGO-${id}`,
  title: `Logo: ${l.title}`,
  publisher: `trademark of ${l.title}; used to identify the issuer`,
  url: l.sourceUrl,
  accessed: "11 Nov 2026",
  group: "imagery",
}));
