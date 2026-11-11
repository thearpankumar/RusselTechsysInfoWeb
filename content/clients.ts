// Clients, programs and values. Names are text wordmarks only; no logos.
// Merged with research/scale-clients.json (clients). Existing ids are kept (domains.ts references them).
import type { Client, Confidence } from "./types";
import { fact } from "./types-extra";
import type { DataColor } from "@/lib/dataColors";

export type DomainId = Client["domain"][number];

/** The single domain → data colour map. Use it everywhere a domain is encoded. */
export const DOMAIN_COLOR: Record<DomainId, DataColor> = {
  aerospace: "sage",
  defence: "slate",
  semiconductor: "tan",
  space: "lavender",
};

export const DOMAIN_LABEL: Record<DomainId, string> = {
  aerospace: "Aerospace",
  defence: "Defence",
  semiconductor: "Semiconductor",
  space: "Space",
};

export const DOMAIN_ORDER: DomainId[] = ["aerospace", "defence", "semiconductor", "space"];

export type ClientStatus =
  | "active" // named customer, publicly confirmed
  | "named" // named in working sessions / by inference, not in filings
  | "undisclosed" // confirmed customer whose name is not public
  | "unconfirmed"; // cited once, not confirmed by Rossell

export interface ClientX extends Client {
  /** Short wordmark for the logo tile. */
  wordmark: string;
  status: ClientStatus;
  /** What Rossell supplies, in plain English. */
  supplies?: string;
  awards?: string[];
  /** True when the service mapping is our reading (scope not public). */
  servicesInferred?: boolean;
  /** Services pitched / in discussion, not yet confirmed as delivered. */
  servicesPitched?: string[];
  /** Hide from the logo wall (duplicate placeholder of a named client). */
  hideOnWall?: boolean;
  note?: string;
}

export const clients: ClientX[] = [
  {
    id: "boeing",
    name: "Boeing",
    wordmark: "Boeing",
    status: "active",
    domain: ["aerospace", "defence"],
    country: "USA",
    services: ["btp", "ewis", "panels", "electro-mech"],
    servicesPitched: ["aftermarket"],
    programs: ["AH-64 Apache", "CH-47 Chinook", "V-22 Osprey", "F-15", "F/A-18 Super Hornet", "KC-46", "P-8 Poseidon", "MQ-25", "T-7A Red Hawk"],
    since: "2013–2014",
    supplies:
      "EWIS wire harnesses on all listed platforms; harnesses and electrical panels on the AH-64; T-7A harnesses (2022 IDIQ) and electrical panel assemblies (2025 IDIQ). Defence only, no commercial-aircraft work (Aug 2025). MRO / aftermarket support pitched to Boeing (Q2 FY27 call).",
    value: fact("~40% of FY26 revenue (≈ ₹194 Cr); T-7 strategic agreements ~US$200M; T-7A panels up to 1,200 shipsets through 2033", ["R-scl-19", "R-scl-15", "R-scl-14", "R-scl-20"], "calc", {
      note: "Boeing share 40% is reported (R-scl-19, R-scl-15); ₹194 Cr = 40% × ₹485.2 Cr is our calculation.",
    }),
    awards: [
      "Supplier of the Year 2015 and 2019",
      "Performance Excellence Award 2015, 2016, 2019",
      "Supplier Appreciation Award 2015, 2016",
      "Gold rating in Boeing ITAR audit",
      "Boeing Kaushal skilling partner since 2014 (new cohort 26 Oct 2026)",
    ],
    highlights: [
      "100,000+ EWIS parts by Jun 2022 (50,000 for the Apache); 160,000+ assemblies by Sep 2025.",
      "Feb 2022 IDIQ: 84 unique T-7A EWIS parts over 10 years. Sep 2025 IDIQ: T-7A panels, up to 1,200 shipsets through 2033.",
      "Only customer in 2018–19; still the anchor account (~40% of FY26 revenue).",
      "One legacy program is loss-making: ~₹75 Cr executed in FY26, ~₹70 Cr left, front-loaded into Q1–Q2 FY27.",
      "Boeing agreed to level-load future schedules (FY26). Ordering pattern: one PO, many schedules.",
    ],
    sources: ["R-scl-14", "R-scl-15", "R-scl-19", "R-scl-20", "R-scl-21", "R-scl-22", "R-scl-27", "R-scl-25", "S37", "S76", "S28", "WS"],
    confidence: "reported",
    note: "Since: 'since 2013' on the Q4 FY26 call; 'since 2014' for the Boeing Kaushal partnership.",
  },
  {
    id: "lockheed-martin",
    name: "Lockheed Martin (incl. Sikorsky)",
    wordmark: "Lockheed Martin",
    status: "active",
    domain: ["defence", "aerospace"],
    country: "USA",
    services: ["btp", "ewis"],
    programs: ["MH-60R Seahawk", "F-16", "C-130J", "Arrowhead", "Sonobuoy"],
    since: "By Nov 2021",
    supplies: "Cable and wire harness assemblies, build-to-print, from a dedicated Center of Excellence. MH-60R EWIS for the Indian Navy helicopters (offset-linked).",
    value: fact("Not disclosed", ["R-scl-39", "R-scl-18"], "reported", { note: "MD (Nov 2025) expected more work from LM by end-2025." }),
    awards: ["Outstanding Supplier Recognition, 10th LM Suppliers Conference, Bengaluru (Dec 2024)", "Outstanding Supplier Performance, LM Annual Suppliers Conference 2025 (Nov 2025)"],
    highlights: ["MH-60R EWIS contract, Nov 2021.", "Programs across Aeronautics, Rotary & Mission Systems and Missiles & Fire Control.", "Ordering pattern: scheduled deliveries."],
    sources: ["R-scl-39", "R-scl-34", "R-scl-10", "R-scl-18", "S80", "S82", "WS"],
    confidence: "reported",
  },
  {
    id: "honeywell",
    name: "Honeywell",
    wordmark: "Honeywell",
    status: "active",
    domain: ["aerospace"],
    country: "USA",
    services: ["btp", "ewis"],
    servicesInferred: true,
    since: "By 2023",
    supplies: "Not stated publicly.",
    value: fact("Not disclosed", ["R-scl-26"], "reported"),
    awards: ["Supplier Excellence Award, Honeywell Supplier Conference, Bengaluru (Aug 2023)", "Supplier Excellence Award, Faster Execution (2024)"],
    sources: ["R-scl-26", "R-scl-1", "R-scl-35", "S76"],
    confidence: "reported",
  },
  {
    id: "iai",
    name: "Israel Aerospace Industries (IAI)",
    wordmark: "IAI",
    status: "active",
    domain: ["aerospace", "defence"],
    country: "Israel",
    services: ["btp", "ewis"],
    servicesInferred: true,
    since: "Named by Dec 2024",
    supplies: "Not stated publicly.",
    value: fact("Not disclosed. Israel is within the ~20% non-US revenue (Aug 2025 call).", ["R-scl-19"], "reported"),
    highlights: ["Whether the May 2026 'overseas defence' repeat order is IAI is not disclosed."],
    sources: ["R-scl-35", "R-scl-29", "R-scl-19", "S79", "WS"],
    confidence: "reported",
  },
  {
    id: "bae-systems",
    name: "BAE Systems",
    wordmark: "BAE Systems",
    status: "active",
    domain: ["defence"],
    country: "UK",
    services: ["btp", "ewis"],
    servicesInferred: true,
    supplies: "Not stated publicly (logo on the company website).",
    awards: ["Special Recognition Award (2025)"],
    sources: ["R-scl-31", "R-scl-1", "S76"],
    confidence: "reported",
  },
  {
    id: "thales",
    name: "Thales",
    wordmark: "Thales",
    status: "active",
    domain: ["defence", "aerospace"],
    country: "France",
    services: ["btp", "ewis"],
    servicesInferred: true,
    supplies: "Not stated publicly (logo on the company website).",
    sources: ["R-scl-31", "R-scl-29", "S76"],
    confidence: "reported",
  },
  {
    id: "telair",
    name: "Telair",
    wordmark: "Telair",
    status: "active",
    domain: ["aerospace"],
    country: "Germany / USA (not verified)",
    services: ["btp", "ewis"],
    servicesInferred: true,
    supplies: "Cargo-handling systems maker. Logo on the website only; nothing else found.",
    sources: ["R-scl-31", "S76"],
    confidence: "reported",
  },
  {
    id: "albatross",
    name: "Albatross Aerospace",
    wordmark: "Albatross",
    status: "active",
    domain: ["aerospace"],
    services: ["btp"],
    servicesInferred: true,
    supplies: "Not stated (logo on the client strip).",
    sources: ["R-scl-31", "S76"],
    confidence: "reported",
  },
  {
    id: "knight",
    name: "Knight Aerospace",
    wordmark: "Knight Aerospace",
    status: "active",
    domain: ["aerospace", "defence"],
    country: "USA",
    services: ["btp"],
    servicesInferred: true,
    since: "2022",
    supplies: "Teaming partnership to serve the Indian aerospace market (May 2022); logo on the client strip.",
    sources: ["R-scl-28", "R-scl-31", "S76"],
    confidence: "reported",
  },
  {
    id: "interconnect-wiring",
    name: "Interconnect Wiring",
    wordmark: "Interconnect Wiring",
    status: "active",
    domain: ["aerospace"],
    country: "USA",
    services: ["btp", "ewis"],
    servicesInferred: true,
    supplies: "Not stated (logo on the client strip).",
    sources: ["R-scl-31", "S76"],
    confidence: "reported",
  },
  {
    id: "expleo",
    name: "Expleo",
    wordmark: "Expleo",
    status: "active",
    domain: ["aerospace"],
    country: "France",
    services: ["btp"],
    servicesInferred: true,
    since: "By 2020",
    supplies: "Not stated. Aerospace engineering-services group.",
    awards: ["Supplier Excellence Award (2020)"],
    sources: ["R-scl-1"],
    confidence: "reported",
  },
  {
    id: "tata-lm-aero",
    name: "Tata Lockheed Martin Aerostructures",
    wordmark: "TLMAL",
    status: "active",
    domain: ["aerospace", "defence"],
    country: "India",
    services: ["btp"],
    servicesInferred: true,
    since: "By 2021",
    supplies: "Not stated; the award was for 'industrializing the fighter wing'.",
    awards: ["Certificate of Appreciation for industrializing the fighter wing (2021)"],
    sources: ["R-scl-1"],
    confidence: "reported",
  },
  {
    id: "indian-air-force",
    name: "Indian Air Force",
    wordmark: "Indian Air Force",
    status: "active",
    domain: ["defence"],
    country: "India",
    services: ["btp", "repair-mro"],
    servicesInferred: true,
    supplies: "Indigenisation work (Best Indigenization Award, 2016, per company timeline).",
    awards: ["Best Indigenization Award, IAF (2016)"],
    sources: ["R-scl-17", "S76", "S34"],
    confidence: "reported",
  },
  {
    id: "hal",
    name: "Hindustan Aeronautics Ltd (HAL)",
    wordmark: "HAL",
    status: "active",
    domain: ["defence", "aerospace"],
    country: "India",
    services: ["btp"],
    servicesInferred: true,
    supplies: "Part of the Indian defence ecosystem the website says Rossell has delivered to. No specific order announced.",
    sources: ["S76", "DECK-SC", "R-scl-29"],
    confidence: "reported",
  },
  {
    id: "ada",
    name: "Aeronautical Development Agency (ADA)",
    wordmark: "ADA",
    status: "active",
    domain: ["defence"],
    country: "India",
    services: ["btp", "bts"],
    servicesInferred: true,
    supplies: "Named in the supply-chain deck. No specific order announced.",
    sources: ["DECK-SC", "D-muthoot"],
    confidence: "reported",
  },
  {
    id: "bel",
    name: "Bharat Electronics (BEL)",
    wordmark: "BEL",
    status: "active",
    domain: ["defence"],
    country: "India",
    services: ["btp"],
    servicesInferred: true,
    supplies: "Cited as a customer in public coverage. No specific order announced.",
    sources: ["S34", "S77", "DECK-SC"],
    confidence: "reported",
  },
  {
    id: "drdo",
    name: "DRDO labs",
    wordmark: "DRDO",
    status: "active",
    domain: ["defence"],
    country: "India",
    services: ["btp", "bts"],
    servicesInferred: true,
    supplies: "The website says solutions were delivered to defence PSUs, GoI bodies and DRDO labs.",
    sources: ["S34", "S77", "R-scl-31"],
    confidence: "reported",
  },
  {
    id: "tata",
    name: "Tata (group company)",
    wordmark: "Tata",
    status: "unconfirmed",
    domain: ["aerospace", "defence"],
    country: "India",
    services: ["btp"],
    servicesInferred: true,
    supplies: "Cited as a customer in public coverage; entity not specified. May be the same as TLMAL.",
    sources: ["S34", "S77"],
    confidence: "estimate",
  },
  {
    id: "lt",
    name: "Larsen & Toubro (L&T)",
    wordmark: "L&T",
    status: "unconfirmed",
    domain: ["defence"],
    country: "India",
    services: ["btp"],
    servicesInferred: true,
    supplies: "Cited as a customer in one public profile; not in company materials.",
    sources: ["S34", "S77"],
    confidence: "estimate",
  },
  {
    id: "ge",
    name: "GE",
    wordmark: "GE",
    status: "unconfirmed",
    domain: ["aerospace"],
    country: "USA",
    services: [],
    supplies: "Not confirmed. Named by one market-data profile only; not in company materials.",
    sources: ["S34"],
    confidence: "estimate",
  },
  {
    id: "overseas-defence",
    name: "International defence client (undisclosed)",
    wordmark: "Overseas defence",
    status: "undisclosed",
    domain: ["defence"],
    services: ["btp", "ewis"],
    supplies: "Electrical wire harnesses (repeat order, 6 May 2026; 8–12 months execution).",
    value: fact("Value undisclosed; 8–12 months execution", ["S90", "R-scl-6"], "reported"),
    sources: ["S90", "R-scl-6", "R-scl-45"],
    confidence: "reported",
  },
  {
    id: "amazon",
    name: "Amazon (space)",
    wordmark: "Amazon",
    status: "active",
    domain: ["space"],
    country: "USA",
    services: ["btp", "ewis"],
    programs: ["LEO broadband constellation (inferred: Kuiper / Leo)"],
    since: "FY26",
    supplies:
      "Satellite wire harnesses. The MD on 12 May 2026: 'Today we're not dealing with Blue Origin; we're dealing with Amazon for all our space requirements.' Qualification and source inspection by Sep 2025; volume production in FY26.",
    value: fact("~₹400 Cr multi-year space contract (customer not named in the filing)", ["R-scl-14", "R-scl-13"], "estimate", {
      note: "The contract value is reported; tying it to Amazon is our inference from the same call. 'Kuiper' is never named.",
    }),
    highlights: ["Space was guided at ~8–10% of FY26 revenue (Aug 2025).", "One space customer asked Rossell's US subsidiary to expand in the US."],
    sources: ["R-scl-14", "R-scl-18", "R-scl-19", "R-scl-11", "S34"],
    confidence: "reported",
    note: "Upgraded from 'estimate': Amazon is named by the MD on the Q4 FY26 call (R-scl-14).",
  },
  {
    id: "space-customer",
    name: "Space program customer (undisclosed)",
    wordmark: "Space customer",
    status: "undisclosed",
    hideOnWall: true,
    domain: ["space"],
    services: ["btp", "ewis"],
    value: fact("~₹400 Cr multi-year contract", ["S28", "DECK-SC", "R-scl-14"], "reported", { note: "Deck: awarded FY26. Probably Amazon (inference)." }),
    highlights: ["Project-based ordering; moving into the new facility as volumes ramp."],
    sources: ["S28", "DECK-SC", "DECK-RESEARCH"],
    confidence: "reported",
  },
  {
    id: "lam-research",
    name: "Lam Research",
    wordmark: "Lam Research",
    status: "named",
    domain: ["semiconductor"],
    country: "USA (uses a South Korea supply base, building an Indian one)",
    services: ["btp", "ewis"],
    since: "Qualified Q2 FY26 (Jul–Sep 2025)",
    supplies: "Wire harnesses for semiconductor equipment.",
    value: fact(">₹10 Cr revenue in Q3 FY26, the first quarter after qualification", ["R-scl-15"], "estimate", {
      note: "The figure is reported for 'semiconductor customer #1'; that this is Lam is our inference.",
    }),
    highlights: [
      "Named in working sessions only; public filings say 'a leading global semiconductor equipment OEM'.",
      "Forecast rule from sessions: the first 6 months of a Lam forecast are excluded from consolidation.",
      "Many POs, one schedule; forecasts change daily.",
    ],
    sources: ["WS", "R-scl-15", "R-scl-14", "R-scl-18", "R-scl-19"],
    confidence: "session",
    note: "Session-named, not public. The MD described 'one large company and a lot of their other subsidiaries'; the Korea supply-base comment fits Lam.",
  },
  {
    id: "applied-materials",
    name: "Applied Materials",
    wordmark: "Applied Materials",
    status: "named",
    domain: ["semiconductor"],
    country: "USA",
    services: ["btp", "ewis"],
    since: "Onboarded Q1 FY27; first order 7 Aug 2026",
    supplies: "Electrical wire harnesses; first order 7 Aug 2026, 12-month execution.",
    value: fact("Not disclosed (confidential)", ["R-scl-5"], "reported"),
    highlights: [
      "Named in working sessions. The 7 Aug 2026 order filing's file name ends in 'AMAT'; the text does not name the customer.",
      "Described in May 2026 as 'one of the largest semiconductor manufacturers in the world'.",
    ],
    sources: ["WS", "R-scl-5", "R-scl-11", "R-scl-12", "R-scl-14"],
    confidence: "session",
    note: "The Aug 2026 order is linked to Applied Materials by inference.",
  },
  {
    id: "semi-oem-q1",
    name: "Major global semiconductor OEM (onboarded Q1 FY27)",
    wordmark: "Semiconductor OEM",
    status: "undisclosed",
    hideOnWall: true,
    domain: ["semiconductor"],
    services: ["btp"],
    highlights: ["Public filings: onboarded in Q1 FY27. Most likely Applied Materials (inference)."],
    sources: ["S73", "R-scl-11"],
    confidence: "reported",
  },
  {
    id: "semi-oem-q2",
    name: "Semiconductor equipment OEM (onboarded Q2 FY27)",
    wordmark: "Semiconductor OEM",
    status: "undisclosed",
    domain: ["semiconductor"],
    services: ["btp"],
    supplies: "Not stated.",
    highlights: ["Deck: 'Onboarded another leading global semiconductor equipment OEM'. Could be the same company as the Q1 onboarding (order placed in Q2) or a third one; the deck does not say."],
    sources: ["S42", "DECK-SC", "R-scl-1"],
    confidence: "reported",
  },
];

export const getClient = (id: string) => clients.find((c) => c.id === id);
export const primaryDomain = (c: Client): DomainId => c.domain[0];

export const programs: { id: string; name: string; what: string; customer: string; services: string[]; sources: string[]; confidence: "reported" | "estimate" }[] = [
  { id: "fa-18", name: "F/A-18", what: "Super Hornet carrier-based fighter", customer: "boeing", services: ["ewis"], sources: ["S37", "S76"], confidence: "reported" },
  { id: "f-15", name: "F-15", what: "Twin-engine air-superiority / strike fighter", customer: "boeing", services: ["ewis"], sources: ["S37", "S76"], confidence: "reported" },
  { id: "ah-64", name: "AH-64", what: "Apache attack helicopter", customer: "boeing", services: ["ewis", "panels"], sources: ["S37", "S76", "R-scl-27"], confidence: "reported" },
  { id: "ch-47", name: "CH-47", what: "Chinook heavy-lift helicopter", customer: "boeing", services: ["ewis"], sources: ["S37", "S76"], confidence: "reported" },
  { id: "v-22", name: "V-22", what: "Osprey tilt-rotor aircraft", customer: "boeing", services: ["ewis"], sources: ["S37", "S76"], confidence: "reported" },
  { id: "kc-46", name: "KC-46", what: "Pegasus aerial refuelling tanker", customer: "boeing", services: ["ewis"], sources: ["S37", "S76"], confidence: "reported" },
  { id: "p-8", name: "P-8", what: "Poseidon maritime patrol aircraft", customer: "boeing", services: ["ewis"], sources: ["S37", "S76"], confidence: "reported" },
  { id: "t-7a", name: "T-7A", what: "Red Hawk advanced jet trainer", customer: "boeing", services: ["ewis", "panels"], sources: ["S80", "S89", "S28", "R-scl-22", "R-scl-20"], confidence: "reported" },
  { id: "mh-60r", name: "MH-60R", what: "Seahawk multi-mission naval helicopter (Indian Navy)", customer: "lockheed-martin", services: ["ewis"], sources: ["S80", "R-scl-39"], confidence: "reported" },
  { id: "f-16", name: "F-16", what: "Fighting Falcon multirole fighter", customer: "lockheed-martin", services: ["ewis"], sources: ["S76"], confidence: "estimate" },
  { id: "mq-25", name: "MQ-25", what: "Stingray unmanned carrier-based tanker", customer: "boeing", services: ["ewis"], sources: ["S76"], confidence: "estimate" },
  { id: "c-130j", name: "C-130J", what: "Super Hercules military transport", customer: "lockheed-martin", services: ["ewis"], sources: ["S76"], confidence: "estimate" },
];
// Note: F-16, MQ-25 and C-130J are listed among platforms on the company website (S76) without naming the prime;
// the customer mapping for MQ-25 (Boeing) and C-130J (Lockheed Martin) is ours from the OEM of each aircraft.

export const clientValues = {
  t7aStrategic: fact(200, ["S28"], "reported", { unit: "US$ M", label: "T-7 strategic agreements (~)" }),
  t7aShipsets: fact(1200, ["DECK-SC", "S89"], "reported", { unit: "shipsets", label: "T-7A panel IDIQ, through 2033 (up to)" }),
  spaceContract: fact(400, ["S28"], "reported", { unit: "₹ Cr", label: "Space multi-year contract (~)" }),
  boeingParts: fact(100000, ["S72"], "reported", { unit: "parts", label: "Parts delivered to Boeing (as of 2022, 100,000+)" }),
  boeingAssemblies: fact(160000, ["R-scl-21"], "reported", { unit: "assemblies", label: "High-value assemblies delivered to Boeing (Sep 2025, 160,000+)" }),
  boeingSharePct: fact(40, ["R-scl-19", "R-scl-15"], "reported", { unit: "%", label: "Boeing share of FY26 revenue" }),
  boeingRevenueCr: fact(194, ["R-scl-19", "R-scl-15", "R-scl-13"], "calc", { unit: "₹ Cr", label: "Boeing revenue FY26 (implied)", note: "40% × ₹485.2 Cr" }),
  semiSpaceSharePct: fact(20, ["R-scl-14"], "reported", { unit: "%", label: "Semiconductor + space share of FY26 revenue" }),
  clientCount: fact(36, ["S79", "S34"], "reported", { unit: "clients", asOf: "2025-07" }),
  oemCount: fact(30, ["S28", "S34", "R-scl-24"], "reported", { unit: "OEM / Tier-1 customers (30+)" }),
  exportCountries: fact(8, ["S28", "S34"], "reported", { unit: "countries" }),
  perClientValue: fact("Not disclosed for any client other than the program values above", ["S28"], "reported"),
};

/** Customer count over time (as reported in different forums). */
export const customerCountSeries: { label: string; value: string; sources: string[] }[] = [
  { label: "2011", value: "1", sources: ["R-scl-17"] },
  { label: "2018–19", value: "1 (Boeing only)", sources: ["S79"] },
  { label: "Aug 2025", value: "30+ (26 active)", sources: ["R-scl-19"] },
  { label: "Sep 2025", value: "30+ in 8 countries", sources: ["R-scl-17"] },
  { label: "Feb 2026", value: "Over 27", sources: ["R-scl-15"] },
  { label: "Nov 2026", value: "30+", sources: ["R-scl-24", "R-scl-1"] },
];

/* ---------- client → program → value connection map ---------- */

export interface FlowNode {
  id: string;
  col: 0 | 1 | 2 | 3;
  label: string;
  sub?: string;
  clientId?: string;
  domain?: DomainId;
  detail: string;
  sources: string[];
  confidence: Confidence;
}

export interface FlowLink {
  from: string;
  to: string;
  domain: DomainId;
}

export const FLOW_COLUMNS = ["Domain", "Client", "Programs", "Value"] as const;

export const flowNodes: FlowNode[] = [
  { id: "d-aerospace", col: 0, label: "Aerospace", domain: "aerospace", detail: "Aircraft EWIS and panels for US and European primes.", sources: ["WS", "S76"], confidence: "session" },
  { id: "d-defence", col: 0, label: "Defence", domain: "defence", detail: "Military aircraft and helicopter programs; USA is the primary market.", sources: ["WS", "S80"], confidence: "session" },
  { id: "d-semiconductor", col: 0, label: "Semiconductor", domain: "semiconductor", detail: "Wire harnesses for semiconductor equipment OEMs; all harness work so far.", sources: ["S28", "WS"], confidence: "reported" },
  { id: "d-space", col: 0, label: "Space", domain: "space", detail: "Satellite wire harnesses under a multi-year program.", sources: ["S28", "R-scl-14"], confidence: "reported" },

  { id: "c-boeing", col: 1, label: "Boeing", clientId: "boeing", domain: "aerospace", detail: "Anchor customer since 2013–14; defence programs only.", sources: ["R-scl-14", "R-scl-19"], confidence: "reported" },
  { id: "c-lm", col: 1, label: "Lockheed Martin", clientId: "lockheed-martin", domain: "defence", detail: "Cable and harness assemblies from a dedicated Center of Excellence.", sources: ["R-scl-39", "S80"], confidence: "reported" },
  { id: "c-other-ad", col: 1, label: "Other A&D clients", sub: "IAI · Honeywell · BAE · Thales · Indian defence", domain: "defence", detail: "Named customers whose scope and value are not public.", sources: ["R-scl-31", "R-scl-35", "S76"], confidence: "reported" },
  { id: "c-amazon", col: 1, label: "Amazon", clientId: "amazon", domain: "space", detail: "Named by the MD as the space customer (May 2026).", sources: ["R-scl-14"], confidence: "reported" },
  { id: "c-lam", col: 1, label: "Lam Research", clientId: "lam-research", domain: "semiconductor", detail: "Named in working sessions only; public filings do not name it.", sources: ["WS", "R-scl-15"], confidence: "estimate" },
  { id: "c-amat", col: 1, label: "Applied Materials", clientId: "applied-materials", domain: "semiconductor", detail: "Named in working sessions; first order Aug 2026 linked by inference.", sources: ["WS", "R-scl-5"], confidence: "session" },

  { id: "p-t7a", col: 2, label: "T-7A Red Hawk", sub: "Harnesses + panels", domain: "aerospace", detail: "2022 IDIQ: 84 unique EWIS parts over 10 years. 2025 IDIQ: electrical panels, up to 1,200 shipsets through 2033.", sources: ["R-scl-22", "R-scl-20", "R-scl-21"], confidence: "reported" },
  { id: "p-boeing-legacy", col: 2, label: "Boeing platforms", sub: "AH-64 · CH-47 · V-22 · F-15 · F/A-18 · KC-46 · P-8", domain: "aerospace", detail: "EWIS on established military platforms; harnesses and panels on the Apache.", sources: ["S37", "S76", "R-scl-27"], confidence: "reported" },
  { id: "p-mh60r", col: 2, label: "MH-60R Seahawk", sub: "Indian Navy · offset-linked", domain: "defence", detail: "Build-to-print EWIS for 24 MH-60R helicopters bought by India via FMS.", sources: ["R-scl-39", "S80"], confidence: "reported" },
  { id: "p-ad-other", col: 2, label: "Scopes not public", domain: "defence", detail: "Programs and scope are not disclosed for these clients.", sources: ["R-scl-31"], confidence: "reported" },
  { id: "p-leo", col: 2, label: "LEO broadband constellation", sub: "Inferred: Kuiper / Leo", domain: "space", detail: "Satellite harnesses. The program name is never stated; Kuiper / Leo is our inference.", sources: ["R-scl-14"], confidence: "estimate" },
  { id: "p-semi", col: 2, label: "Semiconductor equipment harnesses", domain: "semiconductor", detail: "Wire harnesses for wafer-fab equipment; many POs on one schedule.", sources: ["S28", "WS"], confidence: "reported" },

  { id: "v-boeing", col: 3, label: "≈ ₹194 Cr in FY26", sub: "~40% of revenue", domain: "aerospace", detail: "Boeing was ~40% of FY26 revenue (reported); 40% × ₹485.2 Cr ≈ ₹194 Cr is our calculation.", sources: ["R-scl-19", "R-scl-15", "R-scl-13"], confidence: "calc" },
  { id: "v-t7", col: 3, label: "~US$200M agreements", sub: "Up to 1,200 shipsets", domain: "aerospace", detail: "T-7 strategic agreements (harnesses + panels) of ~US$200M; ramp from later FY27 over 5–7 years.", sources: ["R-scl-14", "R-scl-20"], confidence: "reported" },
  { id: "v-undisclosed", col: 3, label: "Not disclosed", domain: "defence", detail: "No value is published for Lockheed Martin or the other A&D clients.", sources: ["R-scl-39", "R-scl-31"], confidence: "reported" },
  { id: "v-space", col: 3, label: "~₹400 Cr multi-year", sub: "Customer link inferred", domain: "space", detail: "The ~₹400 Cr space contract is reported; the customer is not named in the filing. Linking it to Amazon is our inference.", sources: ["R-scl-14", "R-scl-13"], confidence: "estimate" },
  { id: "v-semi", col: 3, label: "Semi + space: 20% → ~41%", sub: "FY26 → H1 FY27", domain: "semiconductor", detail: "Semiconductor + space was ~20% of FY26 revenue (≈ ₹100 Cr) and >₹140 Cr in H1 FY27 (~41% of ₹340.2 Cr). The H1 figure comes from a secondary call summary; the transcript was not yet filed.", sources: ["R-scl-14", "R-scl-38"], confidence: "calc" },
  { id: "v-lam", col: 3, label: ">₹10 Cr in Q3 FY26", sub: "First quarter after qualification", domain: "semiconductor", detail: "Reported for 'semiconductor customer #1'. That this customer is Lam Research is our inference from the sessions.", sources: ["R-scl-15", "WS"], confidence: "estimate" },
];

export const flowLinks: FlowLink[] = [
  { from: "d-aerospace", to: "c-boeing", domain: "aerospace" },
  { from: "d-defence", to: "c-boeing", domain: "defence" },
  { from: "d-defence", to: "c-lm", domain: "defence" },
  { from: "d-aerospace", to: "c-lm", domain: "aerospace" },
  { from: "d-aerospace", to: "c-other-ad", domain: "aerospace" },
  { from: "d-defence", to: "c-other-ad", domain: "defence" },
  { from: "d-space", to: "c-amazon", domain: "space" },
  { from: "d-semiconductor", to: "c-lam", domain: "semiconductor" },
  { from: "d-semiconductor", to: "c-amat", domain: "semiconductor" },

  { from: "c-boeing", to: "p-t7a", domain: "aerospace" },
  { from: "c-boeing", to: "p-boeing-legacy", domain: "aerospace" },
  { from: "c-lm", to: "p-mh60r", domain: "defence" },
  { from: "c-other-ad", to: "p-ad-other", domain: "defence" },
  { from: "c-amazon", to: "p-leo", domain: "space" },
  { from: "c-lam", to: "p-semi", domain: "semiconductor" },
  { from: "c-amat", to: "p-semi", domain: "semiconductor" },

  { from: "p-t7a", to: "v-t7", domain: "aerospace" },
  { from: "p-t7a", to: "v-boeing", domain: "aerospace" },
  { from: "p-boeing-legacy", to: "v-boeing", domain: "aerospace" },
  { from: "p-mh60r", to: "v-undisclosed", domain: "defence" },
  { from: "p-ad-other", to: "v-undisclosed", domain: "defence" },
  { from: "p-leo", to: "v-space", domain: "space" },
  { from: "p-leo", to: "v-semi", domain: "space" },
  { from: "p-semi", to: "v-semi", domain: "semiconductor" },
  { from: "p-semi", to: "v-lam", domain: "semiconductor" },
];

