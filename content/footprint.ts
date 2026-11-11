// Footprint chapter data: the sites shown on the map, floor-area history and export-market shares.
// Builds on content/locations.ts and adds the scale research (research/scale-clients.json, R-scl-*).
//
// Conflict resolved: locations.ts lists the "leased ~210,000 sq ft block" and the "Aerospace Park facility"
// separately. The 15-year release (R-scl-24) and the lease filing (R-scl-7) describe one site: leased
// Unit IA in the Aerospace Park, Devanahalli, 210,000 sq ft, inaugurated 3 Nov 2026. We show it once.
import type { Confidence } from "./types";

export interface FootprintSite {
  id: string;
  name: string;
  short: string;
  kind: "plant" | "facility" | "office" | "subsidiary";
  city: string;
  country: string;
  lat: number;
  lng: number;
  /** Floor area in sq ft, if disclosed. */
  areaSqFt?: number;
  areaNote?: string;
  status: "operating" | "ramping";
  whatHappens: string;
  certifications: string[];
  history: { date: string; label: string; sources: string[] }[];
  sources: string[];
  confidence: Confidence;
  note?: string;
}

export const sites: FootprintSite[] = [
  {
    id: "blr-plant-1",
    name: "Bengaluru Plant 1",
    short: "Plant 1",
    kind: "plant",
    city: "Devanahalli, Bengaluru",
    country: "India",
    lat: 13.24,
    lng: 77.71,
    areaSqFt: 255000,
    areaNote: "Built-up capacity on the Devanahalli campus: 225,000 (Aug 2025) → 240,000 (Nov 2025) → 255,000 sq ft (May 2026). About 175,000 sq ft was in use in May 2026.",
    status: "operating",
    whatHappens: "Main manufacturing campus in the Hi-Tech Defence & Aerospace Park near Kempegowda International Airport. Harness, EWIS, panel and electro-mechanical lines; calibration and metrology lab; a 2,000 sq ft fibre-optic lab. Plant 1 in IQMS.",
    certifications: ["AS9100D", "AS9110", "NADCAP (AC7121)", "ISO 9001", "ISO 14001", "ISO 45001", "ISO 27001", "ISO 17025", "ISO 37001", "IGBC Gold"],
    history: [
      { date: "2011", label: "Started with 4,000 sq ft and 25 people", sources: ["R-scl-17"] },
      { date: "Aug 2025", label: "+15,000 sq ft and a second shift (~₹1.5 Cr)", sources: ["R-scl-9", "S84"] },
      { date: "Nov 2025", label: "+150,000 sq ft planned within the campus (₹70 Cr, 18 months)", sources: ["R-scl-8", "S91"] },
      { date: "May 2026", label: "255,000 sq ft built-up; ~175,000 sq ft in use", sources: ["R-scl-7"] },
    ],
    sources: ["R-scl-9", "R-scl-8", "R-scl-7", "S74", "S80", "S83", "WS"],
    confidence: "reported",
  },
  {
    id: "blr-plant-2",
    name: "Bengaluru Plant 2",
    short: "Plant 2",
    kind: "plant",
    city: "Devanahalli, Bengaluru",
    country: "India",
    lat: 13.243,
    lng: 77.714,
    status: "operating",
    whatHappens: "A second Bengaluru plant, named as a separate plant in IQMS in the working sessions. Exact site and size are not public.",
    certifications: [],
    history: [{ date: "—", label: "Named in the working sessions; no public filing", sources: ["WS"] }],
    sources: ["WS"],
    confidence: "session",
    note: "Whether Plant 2 is the new Aerospace Park unit or the DTA unit is an open question.",
  },
  {
    id: "blr-aerospace-park",
    name: "Aerospace Park facility (Unit IA)",
    short: "Aerospace Park",
    kind: "facility",
    city: "Devanahalli, Bengaluru",
    country: "India",
    lat: 13.236,
    lng: 77.705,
    areaSqFt: 210000,
    areaNote: "Leased from 1 Apr 2026 for ~₹30 Cr: 140,000 sq ft fitted out in 4–5 months, the remaining 70,000 sq ft in 8–12 months.",
    status: "ramping",
    whatHappens: "New space and semiconductor capacity. Expected to earn revenue comparable to the existing facility once full. Operational from Q3 FY27.",
    certifications: [],
    history: [
      { date: "Feb 2026", label: "210,000 sq ft capacity addition announced", sources: ["S88"] },
      { date: "1 Apr 2026", label: "Lease starts", sources: ["R-scl-7", "S92"] },
      { date: "3 Nov 2026", label: "Inaugurated at the 15-year anniversary", sources: ["R-scl-24", "S72"] },
    ],
    sources: ["R-scl-7", "R-scl-24", "R-scl-1", "R-scl-14", "S88", "S92"],
    confidence: "reported",
    note: "Q2 FY27 reporting said 'expected to start operations shortly'; the company release dates the inauguration 3 Nov 2026.",
  },
  {
    id: "kolkata-ro",
    name: "Registered office, Kolkata",
    short: "Kolkata",
    kind: "office",
    city: "Kolkata",
    country: "India",
    lat: 22.57,
    lng: 88.36,
    status: "operating",
    whatHappens: "Legal registered office inherited from the Rossell group (Rossell India). No manufacturing.",
    certifications: [],
    history: [{ date: "Aug 2024", label: "Registered office of the demerged company", sources: ["S74", "S77"] }],
    sources: ["S74", "S77"],
    confidence: "reported",
  },
  {
    id: "tempe-rti",
    name: "Rossell Techsys Inc (RTI), Tempe",
    short: "Tempe, AZ",
    kind: "subsidiary",
    city: "Tempe, Arizona",
    country: "USA",
    lat: 33.4255,
    lng: -111.94,
    areaSqFt: 4100,
    areaNote: "Rented; about 5 employees (Dec 2025). The company page says 4,000+ sq ft.",
    status: "operating",
    whatHappens: "US subsidiary (Delaware C-Corp, 2020): repair, rework, limited manufacturing and supplier management for the Americas. Received a letter of intent from an international defence company and joined a global satcom programme in Q1 FY27.",
    certifications: ["AS9100D", "ISO 9001 (valid to Feb 2029)"],
    history: [
      { date: "2020", label: "Set up in Tempe, Arizona", sources: ["S81"] },
      { date: "Jul 2026", label: "LOI from an international defence company; satcom programme", sources: ["R-scl-11"] },
    ],
    sources: ["S81", "R-scl-1", "R-scl-16", "WS"],
    confidence: "reported",
  },
];

export interface MarketShare {
  id: string;
  region: string;
  countries: string;
  lat: number;
  lng: number;
  /** Share of export revenue, if disclosed. */
  sharePct?: number;
  shareLabel: string;
  focus: string;
  sources: string[];
  confidence: Confidence;
}

export const markets: MarketShare[] = [
  { id: "north-america", region: "North America", countries: "United States", lat: 38.9, lng: -97.0, sharePct: 80, shareLabel: "~80% of exports", focus: "Defence-led: Boeing, Lockheed Martin, Honeywell; semiconductor-equipment OEMs.", sources: ["S28", "WS"], confidence: "reported" },
  { id: "israel", region: "Israel", countries: "Israel", lat: 32.0, lng: 34.8, shareLabel: "Share not disclosed", focus: "Israel Aerospace Industries (IAI).", sources: ["WS", "S79"], confidence: "session" },
  { id: "europe", region: "Europe", countries: "United Kingdom · France · Germany", lat: 50.5, lng: 4.5, shareLabel: "Share not disclosed", focus: "BAE Systems, Thales and Telair are named customers; the country list is our inference.", sources: ["WS", "S76"], confidence: "session" },
  { id: "se-asia", region: "South-East & East Asia", countries: "Malaysia · Korea · Singapore", lat: 3.1, lng: 101.7, shareLabel: "Share not disclosed", focus: "Named in the sessions; likely semiconductor-equipment supply chains (our inference).", sources: ["WS"], confidence: "session" },
  { id: "india", region: "India (domestic)", countries: "India", lat: 20.6, lng: 78.9, sharePct: 2, shareLabel: "~2% of revenue", focus: "HAL, ADA, BEL, DRDO and the Indian Air Force: initial India defence orders.", sources: ["S28", "WS", "S34"], confidence: "calc" },
];

export const exportFacts = {
  exportSharePct: { value: 98, sources: ["S28"], confidence: "reported" as Confidence, note: "One report says ~99%." },
  countries: { value: 8, sources: ["S28", "S34"], confidence: "reported" as Confidence },
};

/** Built-up floor area over time (sq ft). The last point adds the leased Aerospace Park unit. */
export const floorArea: { id: string; label: string; value: number; display: string; detail: string; sources: string[]; confidence: Confidence }[] = [
  { id: "fa-2011", label: "2011", value: 4000, display: "4k", detail: "Manufacturing area at founding, with 25 people.", sources: ["R-scl-17"], confidence: "reported" },
  { id: "fa-2025-08", label: "Aug 25", value: 225000, display: "225k", detail: "Built-up capacity in Bengaluru; 175,000 sq ft in use. +15,000 sq ft being added.", sources: ["R-scl-9"], confidence: "reported" },
  { id: "fa-2025-11", label: "Nov 25", value: 240000, display: "240k", detail: "Built-up capacity; 200,000 sq ft in use. +150,000 sq ft planned in-campus (₹70 Cr).", sources: ["R-scl-8"], confidence: "reported" },
  { id: "fa-2026-05", label: "May 26", value: 255000, display: "255k", detail: "Built-up capacity in Bengaluru; 175,000 sq ft in use.", sources: ["R-scl-7"], confidence: "reported" },
  { id: "fa-2026-11", label: "Nov 26", value: 465000, display: "465k", detail: "255,000 sq ft campus plus the 210,000 sq ft Aerospace Park unit inaugurated 3 Nov 2026. Our sum; Tempe (4,100 sq ft) excluded.", sources: ["R-scl-7", "R-scl-24"], confidence: "calc" },
];
