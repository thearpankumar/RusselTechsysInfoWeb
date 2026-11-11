// The four domains and the services catalogue.
import type { Domain, ServiceDef } from "./types-extra";

export const SERVICE_KEYS = [
  "btp",
  "bts",
  "ewis",
  "fibre-optic",
  "panels",
  "electro-mech",
  "avionics",
  "test-equipment",
  "aftermarket",
  "repair-mro",
] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const services: (ServiceDef & { key: ServiceKey })[] = [
  {
    key: "btp",
    label: "Build-to-print",
    short: "BTP",
    plain: "The customer owns the design. They send drawings and a parts list; Rossell buys exactly those parts and builds exactly what is drawn. No substitutions without the customer's approval.",
    sources: ["S76", "S73", "S46"],
    confidence: "reported",
  },
  {
    key: "bts",
    label: "Build-to-spec",
    short: "BTS",
    plain: "The customer says what the product must do; Rossell's engineers finish the detailed design (within approved rules) and then build it.",
    sources: ["S76", "S73"],
    confidence: "reported",
  },
  {
    key: "ewis",
    label: "Wire harnesses / EWIS",
    short: "EWIS",
    plain: "Electrical Wiring Interconnection System: the bundles of wires, connectors and protection that carry power and signals around an aircraft. Think of it as the aircraft's nervous system. High-complexity, low-volume.",
    sources: ["S76", "S33", "S36"],
    confidence: "reported",
  },
  {
    key: "fibre-optic",
    label: "Fibre-optic harnesses",
    short: "Fibre",
    plain: "Harnesses that carry data as light through glass fibre instead of electricity through copper: lighter, faster and immune to electrical interference.",
    sources: ["S76", "S73"],
    confidence: "reported",
  },
  {
    key: "panels",
    label: "Electrical & cockpit panels",
    short: "Panels",
    plain: "Boxes and panels full of switches, breakers, relays and wiring: the parts of the cockpit or equipment bay that pilots and systems interact with. Rossell builds T-7A electrical panel assemblies for Boeing.",
    sources: ["S76", "S89", "S33"],
    confidence: "reported",
  },
  {
    key: "electro-mech",
    label: "Electro-mechanical assemblies",
    short: "Electro-mech",
    plain: "Assemblies where wiring meets moving or mechanical parts: actuators, motor harnesses, enclosures with mechanisms. Targeted as a 21–30% margin business in FY28–29.",
    sources: ["S76", "S33", "S28"],
    confidence: "reported",
  },
  {
    key: "avionics",
    label: "Avionics & electronics assemblies",
    short: "Avionics",
    plain: "Electronic boxes for aircraft (bought-in circuit boards integrated with wiring and enclosures), done in a 'fabless' way: Rossell does not run its own board fab.",
    sources: ["S33", "S73"],
    confidence: "reported",
  },
  {
    key: "test-equipment",
    label: "Custom test equipment",
    short: "Test",
    plain: "Purpose-built rigs that plug into a harness or panel and check every circuit (continuity, insulation, function) before it ships.",
    sources: ["S33", "S76"],
    confidence: "reported",
  },
  {
    key: "aftermarket",
    label: "Aftermarket & obsolescence management",
    short: "Aftermarket",
    plain: "Keeping old aircraft flying: when a specified part is no longer made, find and qualify an alternate, and keep supplying spares.",
    sources: ["S76", "S73"],
    confidence: "reported",
  },
  {
    key: "repair-mro",
    label: "Repair, rework & MRO",
    short: "MRO",
    plain: "Repairing and reworking harnesses and assemblies already in service. AS9110 and a DPL licence are in place; the US subsidiary does repair and rework.",
    sources: ["S28", "S81", "S83"],
    confidence: "reported",
  },
];

export const serviceLabel = (key: string): string => services.find((s) => s.key === key)?.label ?? key;

export const domains: Domain[] = [
  {
    id: "aerospace",
    name: "Aerospace",
    orderingPattern: "One PO, many schedules",
    orderingDetail: "A single customer PO calls for deliveries over time: e.g. 200 in January, 500 in March, 300 in June. Demand follows schedule lines under each PO; long programs.",
    shape: "one-po-many-schedules",
    customers: ["boeing", "honeywell", "iai", "telair", "albatross", "knight", "interconnect-wiring"],
    notes: [
      "Programs: F/A-18, F-15, AH-64, CH-47, V-22, KC-46, P-8, T-7A.",
      "Commercial aerospace: shortlisted as a Tier-2 supplier; RFPs expected around Q2 FY27.",
      "Force: aircraft order backlog above 17,000 (IATA via WireMasters); 18,000+ per IATA Jun 2026 (deck).",
    ],
    sources: ["WS", "DECK-SC", "S28", "S47", "D-iata"],
    confidence: "session",
  },
  {
    id: "defence",
    name: "Defence",
    orderingPattern: "Scheduled deliveries",
    orderingDetail: "Deliveries are fixed in advance against program schedules. USA is the primary market (~80%), defence-led; strict traceability.",
    shape: "scheduled-deliveries",
    customers: ["lockheed-martin", "bae-systems", "thales", "indian-air-force", "hal", "ada", "bel", "drdo", "overseas-defence"],
    notes: [
      "MH-60R EWIS for Lockheed Martin (Indian Navy).",
      "Repeat overseas defence wire-harness order (May 2026).",
      "A&D supply disruptions +35% in 2024; defence-grade lead times stretched from weeks to months.",
      "India: defence production ₹1.78 lakh Cr in FY26 (+15.6%); draft DAP 2026 raises indigenous content.",
    ],
    sources: ["WS", "S80", "S90", "S48", "D-mod-pib", "S66"],
    confidence: "session",
  },
  {
    id: "semiconductor",
    name: "Semiconductor",
    orderingPattern: "Many POs, one schedule",
    orderingDetail: "No project layer: each dated quantity arrives as its own PO. Customer forecasts are downloaded daily and change every day; demand is fluctuating with an increasing trend.",
    shape: "many-pos-one-schedule",
    customers: ["lam-research", "applied-materials", "semi-oem-q1", "semi-oem-q2"],
    notes: [
      "Semiconductor work so far is all wire harnesses (Q4 FY26 call).",
      "LAM forecasts: the first 6 months are excluded from consolidation (2 months default).",
      "Ambition: ~US$200M semiconductor revenue in 3–5 years.",
      "WFE ≈ $150B in 2026, >$200B in 2027 (Lam Research outlook).",
    ],
    sources: ["WS", "DECK-SC", "S28", "S49", "S50"],
    confidence: "session",
  },
  {
    id: "space",
    name: "Space",
    orderingPattern: "Project-based",
    orderingDetail: "A multi-year program (~₹400 Cr) delivered as a project. Newer domain, moving into the new facility as volumes ramp.",
    shape: "project-based",
    customers: ["space-customer"],
    notes: [
      "Semiconductor + space were ~20% of FY26 revenue; targeted to grow 300–400% in FY27.",
      "The MD named Amazon as the space customer on the Q4 FY26 call; linking the ~₹400 Cr contract to Amazon is our inference.",
    ],
    sources: ["WS", "S28", "DECK-RESEARCH", "R-scl-14"],
    confidence: "session",
  },
];

export const domainOrderingNote = {
  text: "Planning must normalise all four patterns into one view of demand by part, plant and date.",
  sources: ["DECK-SC", "WS"],
  confidence: "session" as const,
};
