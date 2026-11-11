// Competitive landscape. From research/competitors.json (web research, Nov 2026).
// Money in ₹ Cr. Fields with no reliable dated figure are left out (render "—").
import type { Competitor, Confidence, Fact } from "./types";
import { fact } from "./types-extra";

export type CompetitorGroup = "indian" | "global";

export interface CompetitorX extends Competitor {
  group: CompetitorGroup;
  /** Short name for chart labels. */
  short: string;
}

const CR = "₹ Cr";
const PCT = "%";

/** Service columns used in the competition matrix (adds PCBA and box build to the Rossell catalogue). */
export const COMPETITOR_SERVICES: { key: string; label: string; short: string }[] = [
  { key: "btp", label: "Build-to-print", short: "BTP" },
  { key: "bts", label: "Build-to-spec", short: "BTS" },
  { key: "ewis", label: "Wire harness / EWIS", short: "EWIS" },
  { key: "panels", label: "Electrical panels", short: "Panels" },
  { key: "electro-mech", label: "Electro-mechanical", short: "E-mech" },
  { key: "test-equipment", label: "Test equipment", short: "Test" },
  { key: "fibre-optic", label: "Fibre optic", short: "Fibre" },
  { key: "pcba", label: "PCB assembly", short: "PCBA" },
  { key: "box-build", label: "Box build", short: "Box" },
  { key: "avionics", label: "Avionics", short: "Avionics" },
  { key: "aftermarket", label: "Aftermarket", short: "Aftmkt" },
  { key: "repair-mro", label: "Repair / MRO", short: "MRO" },
];

export const rossell: CompetitorX = {
  id: "rossell",
  name: "Rossell Techsys Ltd",
  short: "Rossell",
  group: "indian",
  hq: "Bengaluru, India",
  listed: "NSE: ROSSTECH",
  revenueCr: fact(485.2, ["R-comp-1", "R-comp-2"], "reported", { unit: CR, asOf: "FY26", note: "Revenue from operations ₹485.23 Cr, +87% YoY. Q4 FY26 ₹142.35 Cr." }),
  ebitdaMarginPct: fact(13.7, ["R-comp-1", "R-comp-2"], "calc", { unit: PCT, asOf: "FY26", note: "EBITDA ₹66.6 Cr ÷ revenue ₹485.2 Cr. Q4 FY26 margin 14.65% per the company release. FY27 guidance 17–22%." }),
  adSharePct: fact(70, ["R-comp-3", "R-comp-4"], "reported", { unit: PCT, asOf: "FY26 (approx.)", note: "Management: mix shifting from ~70% A&D / 30% non-A&D to ~50/50 in FY27. Semiconductor + space ≈ 20% of FY26 revenue." }),
  services: ["btp", "bts", "ewis", "panels", "electro-mech", "test-equipment", "fibre-optic", "aftermarket"],
  focus: "Export build-to-print and build-to-spec wire harness / EWIS, electrical panels, electro-mechanical assemblies and test equipment for aerospace, defence, semiconductor equipment and space OEMs.",
  relevance: "Subject company. Fibre optic is added from the company's EWIS page (2,000 sq ft fibre-optic lab).",
  sources: ["R-comp-1", "R-comp-2", "R-comp-3", "R-comp-4", "R-scl-32"],
};

export const competitors: CompetitorX[] = [
  {
    id: "cyient-dlm",
    name: "Cyient DLM Ltd",
    short: "Cyient DLM",
    group: "indian",
    hq: "Hyderabad, India",
    listed: "NSE: CYIENTDLM / BSE: 543933",
    revenueCr: fact(1261.5, ["R-comp-5"], "reported", { unit: CR, asOf: "FY26", note: "Revenue down 17% YoY; order book ₹2,416.6 Cr." }),
    ebitdaMarginPct: fact(10.3, ["R-comp-5"], "reported", { unit: PCT, asOf: "FY26", note: "Normalised EBITDA ₹130.2 Cr." }),
    adSharePct: fact(48, ["R-comp-6"], "reported", { unit: PCT, asOf: "FY26", note: "Aerospace + defence per ICICI Direct; aerospace alone ~38%. Defence fell sharply in FY26 after large order completions." }),
    services: ["btp", "bts", "pcba", "box-build", "ewis", "panels", "electro-mech", "test-equipment"],
    focus: "Indian EMS/DLM with a high A&D mix: PCBA, box build, cable and wire harness assemblies for global aerospace, defence, medtech and industrial OEMs. Mostly export.",
    relevance: "The closest listed Indian peer. It exports cables, harnesses and box builds to North American aerospace and defence primes, the same customer base as Rossell.",
    sources: ["R-comp-5", "R-comp-6"],
  },
  {
    id: "kaynes",
    name: "Kaynes Technology India Ltd",
    short: "Kaynes",
    group: "indian",
    hq: "Mysuru, Karnataka, India",
    listed: "NSE: KAYNES / BSE: 543664",
    revenueCr: fact(3626.4, ["R-comp-7", "R-comp-8"], "reported", { unit: CR, asOf: "FY26", note: "Consolidated; +33.2% YoY. Missed revised guidance of ₹4,100 Cr." }),
    ebitdaMarginPct: fact(15.8, ["R-comp-7"], "reported", { unit: PCT, asOf: "FY26", note: "EBITDA ₹574.1 Cr." }),
    services: ["btp", "bts", "pcba", "box-build", "ewis", "electro-mech", "test-equipment"],
    focus: "Diversified ESDM and OSAT player across automotive, industrial, railways, smart metering, aerospace and defence. Makes cable and harness assemblies alongside PCBA and box build.",
    relevance: "A Karnataka peer with an aerospace vertical and harness capability. Much larger, but more domestic and broadly diversified. No FY26 A&D share found in a primary source.",
    sources: ["R-comp-7", "R-comp-8"],
  },
  {
    id: "sfo",
    name: "SFO Technologies Pvt Ltd (NeST Group)",
    short: "SFO",
    group: "indian",
    hq: "Kochi, Kerala, India",
    listed: "Unlisted (raised ~$82M / ₹750+ Cr in Mar 2026; IPO planned)",
    services: ["btp", "bts", "pcba", "box-build", "ewis", "electro-mech", "aftermarket"],
    focus: "Vertically integrated EMS/ODM with 24 plants in Kochi, Bengaluru and Pune, serving aerospace and defence, medical, industrial and communications customers.",
    relevance: "A private Indian EMS that has served A&D for 20+ years and offers harness and box build to global aerospace OEMs. No dated revenue found in a reliable source, so financials are left out.",
    sources: ["R-comp-17", "R-comp-18"],
  },
  {
    id: "syrma-sgs",
    name: "Syrma SGS Technology Ltd",
    short: "Syrma SGS",
    group: "indian",
    hq: "Chennai, India (corporate office Gurugram)",
    listed: "NSE: SYRMA / BSE: 543573",
    revenueCr: fact(4856.9, ["R-comp-9", "R-comp-10"], "reported", { unit: CR, asOf: "FY26", note: "Total revenue ~₹4,857 Cr, +26.6% YoY." }),
    ebitdaMarginPct: fact(12.0, ["R-comp-9", "R-comp-10"], "reported", { unit: PCT, asOf: "FY26", note: "Operating EBITDA ₹582.3 Cr. Broker-defined EBITDA gives ~11.1%." }),
    services: ["btp", "bts", "pcba", "box-build", "electro-mech"],
    focus: "High-mix EMS and ODM for industrial, automotive, consumer, healthcare and IT/railways, plus RFID and magnetics. Defence is a small, emerging vertical.",
    relevance: "Indirect competitor for semiconductor-equipment and industrial build-to-print work. Little head-on EWIS overlap today.",
    sources: ["R-comp-9", "R-comp-10"],
  },
  {
    id: "avalon",
    name: "Avalon Technologies Ltd",
    short: "Avalon",
    group: "indian",
    hq: "Chennai, India (US operations in Fremont, CA)",
    listed: "NSE: AVALON / BSE: 543896",
    revenueCr: fact(1603, ["R-comp-11", "R-comp-12"], "reported", { unit: CR, asOf: "FY26", note: "+46% YoY. ~62% of revenue from US customers." }),
    ebitdaMarginPct: fact(10.8, ["R-comp-11", "R-comp-12"], "reported", { unit: PCT, asOf: "FY26", note: "EBITDA ~₹173 Cr." }),
    adSharePct: fact(8, ["R-comp-13"], "reported", { unit: PCT, asOf: "9M FY26", note: "Aerospace only, ~8% of 9M FY26 revenue (one secondary source says ~9% for FY26). Defence is small." }),
    services: ["btp", "bts", "pcba", "box-build", "ewis", "electro-mech", "panels"],
    focus: "Box build, PCBA, cable and wire harness, sheet metal and magnetics for US and Indian OEMs in clean energy, industrial, mobility/rail and aerospace.",
    relevance: "The most similar export model to Rossell: US-focused, India–US dual-shore manufacturing, cable and harness assemblies, a growing aerospace vertical.",
    sources: ["R-comp-11", "R-comp-12", "R-comp-13"],
  },
  {
    id: "data-patterns",
    name: "Data Patterns (India) Ltd",
    short: "Data Patterns",
    group: "indian",
    hq: "Chennai, India",
    listed: "NSE: DATAPATTNS / BSE: 543428",
    revenueCr: fact(924.8, ["R-comp-14"], "reported", { unit: CR, asOf: "FY26", note: "Consolidated revenue from operations, +30.6% YoY." }),
    ebitdaMarginPct: fact(40.1, ["R-comp-15"], "reported", { unit: PCT, asOf: "FY26", note: "EBITDA ~₹371 Cr. Guided range 38–40%." }),
    services: ["bts", "avionics", "test-equipment", "electro-mech", "box-build", "repair-mro"],
    focus: "Vertically integrated defence and aerospace electronics: radars, EW, avionics, communication, ATE/test systems and space electronics, mainly for Indian defence PSUs and DRDO.",
    relevance: "An A&D electronics benchmark with very high, IP-led margins. Competes with Rossell's test-equipment and electro-mechanical work in the domestic market, not US build-to-print EWIS. A&D pure play; no numeric share disclosed.",
    sources: ["R-comp-14", "R-comp-15"],
  },
  {
    id: "centum",
    name: "Centum Electronics Ltd",
    short: "Centum",
    group: "indian",
    hq: "Bengaluru, India",
    listed: "NSE: CENTUM / BSE: 517544",
    revenueCr: fact(953, ["R-comp-16"], "reported", { unit: CR, asOf: "FY26", note: "Consolidated, +29% YoY (standalone ~₹973 Cr)." }),
    ebitdaMarginPct: fact(14.2, ["R-comp-16"], "reported", { unit: PCT, asOf: "FY26", note: "Consolidated EBITDA ₹135 Cr." }),
    adSharePct: fact(56, ["R-comp-19"], "reported", { unit: PCT, asOf: "FY25", note: "Defence, space and aerospace share of FY25 revenue. FY26 split not found." }),
    services: ["btp", "bts", "pcba", "box-build", "avionics", "electro-mech", "test-equipment"],
    focus: "Build-to-spec and EMS for defence, space (ISRO), aerospace, industrial and medical, with engineering services through its French subsidiary.",
    relevance: "A Bengaluru A&D electronics peer competing for talent and strategic-electronics programmes; more domestic and space-focused, PCBA and modules rather than harnesses.",
    sources: ["R-comp-16", "R-comp-19"],
  },
  {
    id: "apollo-micro",
    name: "Apollo Micro Systems Ltd",
    short: "Apollo Micro",
    group: "indian",
    hq: "Hyderabad, India",
    listed: "NSE: APOLLO / BSE: 540879",
    revenueCr: fact(904.3, ["R-comp-20"], "reported", { unit: CR, asOf: "FY26", note: "Revenue from operations, +61% YoY (FY25 ₹562.1 Cr)." }),
    ebitdaMarginPct: fact(24.1, ["R-comp-20"], "reported", { unit: PCT, asOf: "FY26", note: "Consolidated, excluding other income. EBITDA ~₹218 Cr." }),
    services: ["bts", "avionics", "electro-mech", "test-equipment", "box-build"],
    focus: "Indian defence electronics and electro-mechanical subsystems for missiles, torpedoes, avionics and underwater systems; serves DRDO, DPSUs and BDL.",
    relevance: "Domestic defence electronics peer. Overlaps on electro-mechanical and test equipment; does not compete in export build-to-print EWIS.",
    sources: ["R-comp-20"],
  },
  {
    id: "ducommun",
    name: "Ducommun Inc (Electronic Systems)",
    short: "Ducommun",
    group: "global",
    hq: "Costa Mesa, California, USA",
    listed: "NYSE: DCO",
    revenueCr: fact(7174.9, ["R-comp-21", "R-comp-22", "R-comp-32"], "calc", { unit: CR, asOf: "CY2025", note: "Group net revenue US$824.7M × ₹87/US$ (approx. CY2025 average). Electronic Systems Q4-2025 revenue was US$119.6M." }),
    ebitdaMarginPct: fact(16.4, ["R-comp-21", "R-comp-22"], "reported", { unit: PCT, asOf: "CY2025", note: "Adjusted EBITDA US$135.6M." }),
    services: ["btp", "bts", "ewis", "panels", "electro-mech", "box-build", "pcba", "test-equipment"],
    focus: "US build-to-print supplier of wire harnesses, cable assemblies, interconnect systems and electronic and structural assemblies for defence and commercial aerospace.",
    relevance: "A direct competitor for US defence harness and cable build-to-print with the same primes; the onshore US alternative to offshore suppliers such as Rossell.",
    sources: ["R-comp-21", "R-comp-22"],
  },
  {
    id: "latecoere",
    name: "Latecoère – Interconnection Systems",
    short: "Latecoère LIS",
    group: "global",
    hq: "Toulouse, France",
    listed: "Euronext Paris: LAT (majority-owned by Searchlight Capital)",
    revenueCr: fact(2309.5, ["R-comp-23", "R-comp-33"], "calc", { unit: CR, asOf: "CY2025", note: "Interconnection Systems segment €234.3M (new segment basis) × ₹98.57/€ (approx. 2025 average). Group revenue €756.7M ≈ ₹7,459 Cr." }),
    ebitdaMarginPct: fact(9.6, ["R-comp-23"], "calc", { unit: PCT, asOf: "CY2025", note: "Segment recurring EBITDA €22.5M ÷ €234.3M. Old basis: 9.1% reported." }),
    services: ["btp", "ewis", "fibre-optic", "panels", "electro-mech", "avionics", "aftermarket"],
    focus: "Aircraft EWIS, electrical cabinets, avionics racks and embedded systems for Airbus, Boeing, Dassault and Bombardier, from plants in Mexico, Tunisia, Morocco and Czechia.",
    relevance: "A pure-play EWIS contract maker. Its best-cost-country model is the direct analogue to Rossell's India model.",
    sources: ["R-comp-23"],
  },
  {
    id: "safran-ep",
    name: "Safran Electrical & Power",
    short: "Safran E&P",
    group: "global",
    hq: "Blagnac (Toulouse), France",
    listed: "Division of Safran SA (Euronext Paris: SAF); division revenue not disclosed",
    services: ["btp", "bts", "ewis", "fibre-optic", "panels", "electro-mech", "aftermarket", "repair-mro"],
    focus: "Aircraft electrical power generation and distribution, and EWIS. 16,500+ employees in 12 countries; opened a new wiring plant in Chihuahua, Mexico in July 2026.",
    relevance: "One of the world's largest EWIS makers. Primes award build-to-print harness work to it or use its best-cost plants, which compete with Indian suppliers.",
    sources: ["R-comp-24"],
  },
  {
    id: "gkn-fokker-elmo",
    name: "GKN Aerospace – Fokker Elmo",
    short: "GKN Fokker Elmo",
    group: "global",
    hq: "Woensdrecht / Hoeven, Netherlands",
    listed: "Part of GKN Aerospace (Melrose Industries plc, LSE: MRO); EWIS revenue not disclosed",
    services: ["btp", "bts", "ewis", "fibre-optic", "electro-mech", "aftermarket"],
    focus: "EWIS design and build for Boeing (777X, 787), Airbus, F-35 and business jets, with plants in the Netherlands, Mexico, China, India, Turkey and elsewhere. Self-described No. 3 in EWIS.",
    relevance: "A top-3 global EWIS supplier with a best-cost footprint, including India. Competes for the same Boeing and US defence harness packages Rossell wins.",
    sources: ["R-comp-25", "R-comp-26"],
  },
];

export const allCompetitors: CompetitorX[] = [rossell, ...competitors];

export const COMPETITOR_GROUP_LABEL: Record<CompetitorGroup, string> = {
  indian: "Indian peers",
  global: "Global harness specialists",
};

export interface MarketSize {
  id: string;
  label: string;
  publisher: string;
  value: number | string;
  /** Low end in US$ bn, for range strips. */
  low: number;
  high: number;
  unit: string;
  asOf: string;
  note: string;
  sources: string[];
  confidence: Confidence;
}

export const marketSizes: MarketSize[] = [
  { id: "gmi", label: "Global aerospace wiring harness", publisher: "Global Market Insights", value: 6.8, low: 6.8, high: 6.8, unit: "US$ bn", asOf: "2025", note: "US$6.5bn in 2024; 5.5% CAGR to US$10.9bn by 2034.", sources: ["R-comp-27"], confidence: "reported" },
  { id: "360i", label: "Global aerospace wiring harness", publisher: "360iResearch", value: 5.9, low: 5.9, high: 5.9, unit: "US$ bn", asOf: "2025", note: "5.67% CAGR to US$7.79bn by 2030.", sources: ["R-comp-28"], confidence: "reported" },
  { id: "tip", label: "Global aerospace & defence wire harness", publisher: "The Insight Partners", value: 8.35, low: 8.35, high: 8.35, unit: "US$ bn", asOf: "2025", note: "Wider A&D scope; 4.7% CAGR to US$12.68bn by 2034.", sources: ["R-comp-29"], confidence: "reported" },
  { id: "rnm", label: "Global aerospace wiring harness", publisher: "Research and Markets", value: 8.1, low: 8.1, high: 8.1, unit: "US$ bn", asOf: "2026", note: "5.8% CAGR to US$12.7bn by 2034.", sources: ["R-comp-30"], confidence: "reported" },
  { id: "india-ems", label: "India EMS market", publisher: "KPMG", value: "40–45", low: 40, high: 45, unit: "US$ bn", asOf: "FY25", note: "Up from US$10–12bn in FY20; could exceed US$150bn by FY30.", sources: ["R-comp-31"], confidence: "reported" },
];

export const harnessMarketRange: Fact<string> = fact("5.9–8.35", ["R-comp-27", "R-comp-28", "R-comp-29", "R-comp-30"], "reported", {
  unit: "US$ bn",
  asOf: "2025",
  label: "Global aerospace wiring harness market, four estimates",
  note: "Scopes differ: The Insight Partners includes all A&D wire harness.",
});

export const shareEstimate = {
  value: 0.8,
  low: 0.5,
  high: 0.95,
  unit: "% of the global aerospace wiring harness market",
  steps: [
    { label: "Rossell FY26 revenue", value: "₹485.2 Cr" },
    { label: "In US$ at ₹87 / US$", value: "≈ US$55.8M" },
    { label: "÷ GMI US$6.8bn", value: "0.82%" },
    { label: "÷ 360iResearch US$5.9bn", value: "0.95%" },
    { label: "÷ The Insight Partners US$8.35bn", value: "0.67%" },
    { label: "A&D portion only (~70%, ≈ US$39.0M)", value: "0.47–0.66%" },
  ],
  method:
    "Treats all FY26 revenue as harness / EWIS-related, so it is an upper bound: Rossell also sells panels, electro-mechanical assemblies and test equipment. Central estimate ~0.8% on total revenue; ~0.5–0.6% on the A&D-only basis.",
  sources: ["R-comp-1", "R-comp-3", "R-comp-27", "R-comp-28", "R-comp-29", "R-comp-32"],
  confidence: "estimate" as Confidence,
};
