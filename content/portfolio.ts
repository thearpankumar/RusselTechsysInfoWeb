// Portfolio chapter data: the curated journey timeline, the awards wall and the business-model comparison.
// Draws on content/company.ts and the scale research (research/scale-clients.json, R-scl-*).
//
// Conflict resolved: the deck dates a Lockheed Martin award "Nov 2025" while the ANI release is Dec 2024.
// The scale research shows both are real: Outstanding Supplier Recognition (10 Dec 2024, R-scl-34) and
// Outstanding Supplier Performance (3 Nov 2025, R-scl-10). Both appear on the wall.
import type { Confidence } from "./types";

export interface JourneyStop {
  id: string;
  /** Short label under the dot ("2011"). */
  when: string;
  label: string;
  detail: string;
  kind: "founding" | "contract" | "award" | "facility" | "corporate" | "listing" | "people" | "finance" | "milestone";
  sources: string[];
  confidence: Confidence;
  note?: string;
}

export const journey: JourneyStop[] = [
  { id: "j-2011", when: "2011", label: "Founded", detail: "Starts early 2011 as the aerospace & defence division of Rossell India, on 4,000 sq ft with 25 people.", kind: "founding", sources: ["S35", "S71", "S72", "R-scl-17"], confidence: "reported" },
  { id: "j-2013", when: "2013", label: "Boeing partnership", detail: "The Boeing relationship begins: AH-64 Apache harnesses and panels came first. Boeing was the only customer until 2018–19.", kind: "contract", sources: ["S28", "R-scl-27", "S79"], confidence: "reported" },
  { id: "j-2015-2019", when: "2015 · 2019", label: "Boeing Supplier of the Year", detail: "Boeing Global Supplier of the Year twice, chosen from 12,000+ Boeing suppliers worldwide.", kind: "award", sources: ["S37"], confidence: "reported" },
  { id: "j-2020", when: "2020", label: "RTI opens in Tempe", detail: "Rossell Techsys Inc, a Delaware C-Corp in Tempe, Arizona: repair, rework, limited manufacturing and supplier management for the Americas.", kind: "facility", sources: ["S81"], confidence: "reported" },
  { id: "j-2021", when: "Nov 2021", label: "MH-60R EWIS", detail: "Build-to-print EWIS for Lockheed Martin's MH-60R Seahawk helicopters for the Indian Navy, from a dedicated centre of excellence.", kind: "contract", sources: ["S80", "R-scl-39"], confidence: "reported" },
  { id: "j-2022", when: "Feb 2022", label: "T-7A harness IDIQ", detail: "10-year Boeing IDIQ for T-7A Red Hawk wire harnesses: 84 unique part numbers.", kind: "contract", sources: ["S80", "S89", "R-scl-22"], confidence: "reported" },
  { id: "j-2023", when: "1 Apr 2023", label: "Demerger appointed date", detail: "The aerospace & defence business is carved out of Rossell India with effect from 1 Apr 2023.", kind: "corporate", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "j-2024-nclt", when: "Apr 2024", label: "NCLT sanction", detail: "The National Company Law Tribunal sanctions the demerger on 25 Apr 2024.", kind: "corporate", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "j-2024-effective", when: "30 Aug 2024", label: "Demerger effective", detail: "Rossell Techsys Ltd becomes a separate company; record date for shares 20 Sep 2024.", kind: "corporate", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "j-2024-listing", when: "9 Dec 2024", label: "Listed on NSE and BSE", detail: "Shares list as NSE: ROSSTECH and BSE: 544294.", kind: "listing", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "j-2025-ceo", when: "Aug 2025", label: "Senthil Balasubramanian, CEO", detail: "Appointed CEO effective 18 Aug 2025, after Blue Star, Ultra Maritime, Collins Aerospace and ITT.", kind: "people", sources: ["S70", "S78", "R-ppl-5"], confidence: "reported" },
  { id: "j-2025-t7a", when: "Sep 2025", label: "T-7A panel assemblies", detail: "Long-term Boeing IDIQ for T-7A electrical panel assemblies: up to 1,200 shipsets through 2033.", kind: "contract", sources: ["S89", "R-scl-20", "R-scl-21"], confidence: "reported" },
  { id: "j-2026-raise", when: "Nov 2026", label: "₹300 Cr raised", detail: "25,72,898 shares at ₹1,166 allotted, mostly to SBI Mutual Fund. At least ₹230 Cr repays debt.", kind: "finance", sources: ["S86", "S42", "R-scl-3"], confidence: "reported" },
  { id: "j-2026-15y", when: "3 Nov 2026", label: "15 years · new facility", detail: "15-year anniversary; the 210,000 sq ft Aerospace Park unit for space and semiconductor work is inaugurated.", kind: "milestone", sources: ["R-scl-24", "S72"], confidence: "reported" },
];

export interface AwardTile {
  id: string;
  by: string;
  name: string;
  year: string;
  detail?: string;
  sources: string[];
  confidence: Confidence;
}

export const awardsWall: AwardTile[] = [
  { id: "aw-boeing-soy-2015", by: "Boeing", name: "Global Supplier of the Year", year: "2015", detail: "Among 12,000+ Boeing suppliers worldwide.", sources: ["S37", "R-scl-30"], confidence: "reported" },
  { id: "aw-boeing-soy-2019", by: "Boeing", name: "Global Supplier of the Year", year: "2019", detail: "Second win.", sources: ["S37", "R-scl-30"], confidence: "reported" },
  { id: "aw-boeing-pe", by: "Boeing", name: "Performance Excellence Award", year: "2015 · 2016 · 2019", sources: ["R-scl-30"], confidence: "reported" },
  { id: "aw-boeing-sa", by: "Boeing", name: "Supplier Appreciation Award", year: "2015 · 2016", sources: ["R-scl-30"], confidence: "reported" },
  { id: "aw-boeing-itar", by: "Boeing", name: "Gold rating, ITAR audit", year: "—", detail: "Gold rating in Boeing's ITAR compliance audit.", sources: ["R-scl-30"], confidence: "reported" },
  { id: "aw-iaf-2016", by: "Indian Air Force", name: "Best Indigenization Award", year: "2016", detail: "Per the company timeline.", sources: ["R-scl-29", "R-scl-17"], confidence: "reported" },
  { id: "aw-expleo-2020", by: "Expleo", name: "Supplier Excellence Award", year: "2020", sources: ["R-scl-1"], confidence: "reported" },
  { id: "aw-tlmal-2021", by: "Tata Lockheed Martin Aerostructures", name: "Certificate of Appreciation", year: "2021", detail: "For industrialising the fighter wing.", sources: ["R-scl-1"], confidence: "reported" },
  { id: "aw-honeywell-2023", by: "Honeywell", name: "Supplier Excellence Award", year: "2023", detail: "Honeywell Supplier Conference, Bengaluru (3 Aug 2023).", sources: ["R-scl-26", "S72"], confidence: "reported" },
  { id: "aw-honeywell-2024", by: "Honeywell", name: "Supplier Excellence Award, Faster Execution", year: "2024", sources: ["R-scl-1"], confidence: "reported" },
  { id: "aw-lm-2024", by: "Lockheed Martin", name: "Outstanding Supplier Recognition", year: "2024", detail: "10th Lockheed Martin Suppliers Conference, Bengaluru (10 Dec 2024).", sources: ["R-scl-34", "S82", "S38"], confidence: "reported" },
  { id: "aw-lm-2025", by: "Lockheed Martin", name: "Outstanding Supplier Performance", year: "2025", detail: "Lockheed Martin Annual Suppliers Conference 2025, Bengaluru (3 Nov 2025).", sources: ["R-scl-10"], confidence: "reported" },
  { id: "aw-bae-2025", by: "BAE Systems", name: "Special Recognition Award", year: "2025", sources: ["R-scl-1", "R-scl-31"], confidence: "reported" },
  { id: "aw-etedge-2026", by: "ET Edge", name: "Best Manufacturing Brand · Best Organisations to Work", year: "2026", sources: ["R-scl-24", "R-scl-1"], confidence: "reported" },
];

export const buildSplit = {
  btpPct: 90,
  btsPct: 10,
  sources: ["R-scl-15"],
  confidence: "reported" as Confidence,
  note: "Approximate split stated on the Q3 FY26 call (4 Feb 2026).",
};

/** Contract manufacturer vs distributor: why a missing part stops the build. */
export const cmVsDistributor: { aspect: string; cm: string; distributor: string }[] = [
  { aspect: "What they sell", cm: "A finished harness, panel or assembly built to the customer's drawing", distributor: "The part itself, exactly as the maker shipped it" },
  { aspect: "Who owns the design", cm: "The customer (build-to-print) or Rossell within approved rules (build-to-spec)", distributor: "The part maker" },
  { aspect: "A missing part", cm: "Stops the whole build: every BOM line must arrive first", distributor: "Short-ships one line; the rest goes out" },
  { aspect: "Inventory", cm: "Raw parts for many BOMs, held months ahead (6.67 months in Q2 FY27)", distributor: "Finished catalogue stock" },
  { aspect: "Value added", cm: "Buying, kitting, assembly, test, documentation and traceability", distributor: "Availability, logistics and credit" },
];

export const cmVsDistributorSources = { sources: ["DECK-SC", "WS", "R-scl-1"], confidence: "session" as Confidence };

/**
 * Who stands behind each certification (keyed by content/company.ts certification id). `role` keeps the
 * wording honest: ISO, IAQG and NIST write the standard while an accredited registrar issues the certificate,
 * so those read "Standard by"; bodies that grant the approval themselves read "Issued by".
 * `logo` is an id for getIssuerLogo (content/orgLogos.ts, falling back to content/clientLogos.ts).
 */
export interface CertIssuer {
  role: "Issued by" | "Standard by" | "Accredited by" | "Rated by" | "Model by";
  body: string;
  logo?: string;
}

const ISO: CertIssuer = { role: "Standard by", body: "ISO", logo: "iso" };

export const certIssuers: Record<string, CertIssuer> = {
  as9100d: { role: "Standard by", body: "IAQG", logo: "iaqg" },
  as9110: { role: "Standard by", body: "IAQG", logo: "iaqg" },
  nadcap: { role: "Accredited by", body: "PRI (Nadcap)", logo: "pri" },
  iso9001: ISO,
  iso14001: ISO,
  iso45001: ISO,
  iso27001: ISO,
  iso17025: ISO,
  iso37001: ISO,
  "nist-800-171": { role: "Standard by", body: "NIST", logo: "nist" },
  cmmc: { role: "Model by", body: "US Department of Defense" },
  cemilac: { role: "Issued by", body: "CEMILAC (DRDO)", logo: "drdo" },
  dpl: { role: "Issued by", body: "DPIIT, Government of India" },
  dsir: { role: "Issued by", body: "DSIR, Government of India" },
  "igbc-gold": { role: "Rated by", body: "IGBC", logo: "igbc" },
};

/**
 * Logo per awarding company (AwardTile.by). TLMAL has no mark of its own online (tlmal.com redirects to
 * Tata Advanced Systems), so it shows the Tata group mark it trades under, with its name as a caption.
 */
export const awarderLogos: Record<string, string> = {
  Boeing: "boeing",
  "Indian Air Force": "indian-air-force",
  Expleo: "expleo",
  "Tata Lockheed Martin Aerostructures": "tata",
  Honeywell: "honeywell",
  "Lockheed Martin": "lockheed-martin",
  "BAE Systems": "bae-systems",
  "ET Edge": "et-edge",
};
