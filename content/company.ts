// Company profile, timeline, model, certifications, awards, markets.
import type { Fact } from "./types";
import {
  fact,
  type Award,
  type BusinessModelItem,
  type Certification,
  type CompanyProfile,
  type TimelineEvent,
} from "./types-extra";

export const company: CompanyProfile = {
  legalName: "Rossell Techsys Limited",
  shortName: "Rossell Techsys",
  tagline: "Build-to-print wire harnesses and EWIS for aerospace, defence, semiconductor and space",
  description:
    "A Bengaluru-based contract manufacturer. Customers send drawings and a bill of materials; Rossell buys every part, builds the wire harness, panel or assembly, tests it and delivers it. Most of what it builds flies on US defence aircraft; semiconductor-equipment and space work is growing fast.",
  founded: fact("Early 2011, as the aerospace & defence division of Rossell India; grew from a greenfield entity", ["S35", "S71", "S72"], "reported"),
  headquarters: fact("Hi-Tech Defence & Aerospace Park, Devanahalli, near Kempegowda International Airport, Bengaluru", ["S74", "S77", "DECK-SC"], "reported"),
  registeredOffice: fact("Kolkata, West Bengal", ["S74", "S77"], "reported"),
  listing: {
    bse: fact("544294", ["S33", "S34", "S75"], "reported"),
    nse: fact("ROSSTECH", ["S28", "S34", "S36"], "reported"),
    listedOn: fact("2024-12-09", ["S33", "S34", "S75"], "reported", { label: "Listed on NSE and BSE" }),
  },
  parent: fact("Demerged from Rossell India Ltd (appointed date 1 Apr 2023; effective 30 Aug 2024)", ["S33", "S34", "S75"], "reported"),
  managingDirector: fact("Rishab Mohan Gupta", ["S33", "S77"], "reported"),
  chairman: fact("Harsh Mohan Gupta", ["R-ppl-2", "R-ppl-3", "DECK-SC"], "reported", {
    note: "Executive Chairman per the board page and board-composition filing. Not in the research markdown's leadership list.",
  }),
  ceo: fact("Senthil Balasubramanian (effective 18 Aug 2025)", ["S70", "S78"], "reported"),
  segments: fact("Single reporting segment", ["S76", "S73"], "reported"),
  headcount: fact(1281, ["R-scl-11"], "reported", { unit: "people", asOf: "2026-06", note: "Total workforce incl. contract staff and trainees (Q1 FY27). Aug 2025: ~950–960, up from 680 (S84, R-scl-19)." }),
  website: "https://rosselltechsys.com/",
};

export const timeline: TimelineEvent[] = [
  { id: "t-2011-founded", date: "2011", label: "Founded", detail: "Started early 2011 as the aerospace & defence division of Rossell India, from a greenfield entity.", kind: "founding", sources: ["S35", "S71", "S72"], confidence: "reported" },
  { id: "t-2013-boeing", date: "2013", label: "Boeing partnership begins", detail: "Boeing relationship dates from 2013 (per Q4 FY26 call).", kind: "contract", sources: ["S28"], confidence: "reported" },
  { id: "t-2015-boeing-award", date: "2015", label: "Boeing Global Supplier of the Year", detail: "First of two wins, among 12,000+ Boeing suppliers.", kind: "award", sources: ["S37"], confidence: "reported" },
  { id: "t-2019-boeing-award", date: "2019", label: "Boeing Global Supplier of the Year (second time)", kind: "award", sources: ["S37"], confidence: "reported" },
  { id: "t-2020-rti", date: "2020", label: "Rossell Techsys Inc set up in Tempe, Arizona", detail: "Delaware C-Corp; repair, rework, limited manufacturing and Americas supplier management.", kind: "facility", sources: ["S81"], confidence: "reported" },
  { id: "t-2021-11-mh60r", date: "2021-11", label: "MH-60R EWIS contract", detail: "EWIS for Lockheed Martin, build-to-print for the Indian Navy's MH-60R helicopters.", kind: "contract", sources: ["S80"], confidence: "reported" },
  { id: "t-2022-02-t7a", date: "2022-02", label: "Boeing IDIQ: T-7A wire harnesses / EWIS", kind: "contract", sources: ["S80", "S89"], confidence: "reported" },
  { id: "t-2022-boeing-100k", date: "2022", label: "100,000+ parts delivered to Boeing", kind: "milestone", sources: ["S72"], confidence: "reported" },
  { id: "t-2023-honeywell", date: "2023", label: "Honeywell Supplier Excellence Award", kind: "award", sources: ["S72"], confidence: "reported" },
  { id: "t-2023-04-appointed", date: "2023-04-01", label: "Demerger appointed date", detail: "The aerospace & defence business is carved out of Rossell India with effect from 1 Apr 2023.", kind: "corporate", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "t-2024-04-nclt", date: "2024-04-25", label: "NCLT sanctions the demerger", kind: "corporate", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "t-2024-08-effective", date: "2024-08-30", label: "Demerger effective", kind: "corporate", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "t-2024-09-record", date: "2024-09-20", label: "Record date for demerged shares", kind: "corporate", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "t-2024-12-listing", date: "2024-12-09", label: "Listed on NSE and BSE", detail: "BSE 544294 · NSE ROSSTECH.", kind: "listing", sources: ["S33", "S34", "S75"], confidence: "reported" },
  { id: "t-2024-12-lm", date: "2024-12", label: "Lockheed Martin Outstanding Supplier Recognition", detail: "At the 10th Lockheed Martin Suppliers Conference, Bengaluru.", kind: "award", sources: ["S38", "S82"], confidence: "reported" },
  { id: "t-2025-08-ceo", date: "2025-08-18", label: "Senthil Balasubramanian becomes CEO", kind: "people", sources: ["S70", "S78"], confidence: "reported" },
  { id: "t-2025-08-expansion", date: "2025-08", label: "+15,000 sq ft expansion; headcount ~950", detail: "~₹1.5 Cr; second shift; headcount up from 680.", kind: "facility", sources: ["S84"], confidence: "reported" },
  { id: "t-2025-09-t7a-panels", date: "2025-09-22", label: "Boeing IDIQ: T-7A electrical panel assemblies", detail: "Long-term IDIQ; deck: up to 1,200 shipsets through 2033.", kind: "contract", sources: ["S89", "DECK-SC"], confidence: "reported" },
  { id: "t-2025-11-lm", date: "2025-11-03", label: "Lockheed Martin Outstanding Supplier Performance", detail: "Lockheed Martin Annual Suppliers Conference 2025, Bengaluru. A second LM award, separate from Dec 2024.", kind: "award", sources: ["R-scl-10"], confidence: "reported" },
  { id: "t-2025-11-capex", date: "2025-11", label: "₹70 Cr capacity expansion within existing premises", kind: "facility", sources: ["S91"], confidence: "reported" },
  { id: "t-2025-11-qip", date: "2025-11-10", label: "Board approves raising up to ₹300 Cr via QIP", detail: "Later replaced by a preferential allotment.", kind: "finance", sources: ["S86"], confidence: "reported" },
  { id: "t-2026-02-210k", date: "2026-02", label: "210,000 sq ft capacity addition announced", detail: "Leased next to the existing plant from 1 Apr 2026, ~₹30 Cr.", kind: "facility", sources: ["S88", "S92"], confidence: "reported" },
  { id: "t-2026-04-lease", date: "2026-04-01", label: "~210,000 sq ft lease starts", kind: "facility", sources: ["S88", "S92"], confidence: "reported" },
  { id: "t-2026-05-repeat", date: "2026-05-06", label: "Repeat overseas defence wire-harness order", detail: "8–12 months execution, value undisclosed.", kind: "contract", sources: ["S90"], confidence: "reported" },
  { id: "t-2026-05-fy26", date: "2026-05", label: "FY26 results: revenue ₹485 Cr, +87%", kind: "finance", sources: ["S29", "S28"], confidence: "reported" },
  { id: "t-2026-q1-semi", date: "2026-06", label: "Major global semiconductor OEM onboarded (Q1 FY27)", kind: "contract", sources: ["S73"], confidence: "reported" },
  { id: "t-2026-09-board", date: "2026-09-18", label: "Board approves ₹300 Cr preferential issue", kind: "finance", sources: ["S42", "S86"], confidence: "reported" },
  { id: "t-2026-q2-semi2", date: "2026-09", label: "Second global semiconductor OEM onboarded (Q2 FY27)", kind: "contract", sources: ["S42", "DECK-SC"], confidence: "reported" },
  { id: "t-2026-10-egm", date: "2026-10-15", label: "EGM approves the preferential issue", kind: "finance", sources: ["S42", "S86"], confidence: "reported" },
  { id: "t-2026-11-allot", date: "2026-11-03", label: "₹300 Cr allotted, mostly to SBI Mutual Fund", detail: "25,72,898 shares at ₹1,166.", kind: "finance", sources: ["S86", "S42"], confidence: "reported" },
  { id: "t-2026-11-15y", date: "2026-11-03", label: "15 years; new facility inaugurated", detail: "15-year anniversary; new facility (Aerospace Park, Devanahalli) inaugurated.", kind: "milestone", sources: ["S72", "S42"], confidence: "reported", note: "Q2 FY27 reporting said Aerospace Park was 'expected to start operations shortly'; the leadership deck says 'inaugurated Q2 FY27'. Company news dates the inauguration 3 Nov 2026 (Q3 FY27)." },
  { id: "t-2026-11-q2", date: "2026-11-06", label: "Q2 FY27: record ₹185.5 Cr quarter", detail: "+48% YoY; first double-digit quarterly PBT.", kind: "finance", sources: ["S39", "S40"], confidence: "reported" },
];

export const businessModel: BusinessModelItem[] = [
  { id: "btp", name: "Build-to-print (BTP)", plain: "The customer owns the design and sends drawings and a BOM. Rossell buys exactly the parts specified and builds to the drawing.", sources: ["S76", "S73", "S46"], confidence: "reported" },
  { id: "bts", name: "Build-to-spec (BTS)", plain: "The customer gives a performance specification; Rossell completes the detailed design and then builds it.", sources: ["S76", "S73"], confidence: "reported" },
  { id: "ewis", name: "EWIS: high-complexity, low-volume harnesses", plain: "Aircraft wiring systems, including fibre optics, made in small batches with heavy documentation.", sources: ["S76", "S73"], confidence: "reported" },
  { id: "fabless-electronics", name: "Electronics assemblies (fabless)", plain: "Electronic assemblies delivered without owning a chip or PCB fab; boards are bought in and integrated.", sources: ["S76", "S73"], confidence: "reported" },
  { id: "aftermarket", name: "Aftermarket services", plain: "Obsolescence management and alternate sourcing for parts that are no longer made.", sources: ["S76", "S73"], confidence: "reported" },
  { id: "test", name: "Test solutions", plain: "Custom test equipment that checks harnesses and assemblies before they ship.", sources: ["S76", "S33"], confidence: "reported" },
  { id: "not-distributor", name: "Not a distributor", plain: "A distributor resells a part as-is and can short-ship one line. Rossell cannot build until every part has arrived.", sources: ["DECK-SC", "WS"], confidence: "session" },
  { id: "pass-through", name: "Materials are most of the cost", plain: "Materials were ₹213.4 Cr, ~63% of H1 FY27 revenue; industry-wide, components are ~70% of product cost.", sources: ["S41", "S23"], confidence: "calc" },
  { id: "back-to-back", name: "Back-to-back contracts", plain: "Supplier agreements mirror customer contracts (e.g. 5-year customer contract ↔ 5-year supplier contract); price escalation built into bids; EPA clauses accepted by some customers.", sources: ["S28"], confidence: "reported" },
  { id: "advance-payments", name: "Advance payments for long-lead parts", plain: "For long-lead or single-source materials, Rossell asks some customers to pay in advance.", sources: ["S28"], confidence: "reported" },
  { id: "air-freight", name: "Air-freighted exports", plain: "Shipments go by air; customers mostly pay the freight.", sources: ["S28"], confidence: "reported" },
];

export const certifications: Certification[] = [
  { id: "as9100d", name: "AS9100D", scope: "Aerospace quality management system: the baseline licence to supply aircraft parts.", holder: "Rossell Techsys Ltd; Rossell Techsys Inc", sources: ["S83", "S81"], confidence: "reported" },
  { id: "as9110", name: "AS9110", scope: "Quality standard for maintenance, repair and overhaul (MRO) organisations.", sources: ["S83", "S28"], confidence: "reported" },
  { id: "nadcap", name: "NADCAP (AC7121)", scope: "Special-process accreditation for cable and harness assembly, audited by industry primes.", sources: ["S83"], confidence: "reported" },
  { id: "iso9001", name: "ISO 9001", scope: "General quality management.", holder: "Rossell Techsys Ltd; Rossell Techsys Inc (valid to Feb 2029)", validTo: "2029-02", sources: ["S83", "S81"], confidence: "reported" },
  { id: "iso14001", name: "ISO 14001", scope: "Environmental management.", sources: ["S83"], confidence: "reported" },
  { id: "iso45001", name: "ISO 45001", scope: "Occupational health and safety.", sources: ["S83"], confidence: "reported" },
  { id: "iso27001", name: "ISO 27001", scope: "Information security management.", sources: ["S83"], confidence: "reported" },
  { id: "iso17025", name: "ISO 17025", scope: "Competence of testing and calibration laboratories (calibration & metrology lab).", sources: ["S83", "S74"], confidence: "reported" },
  { id: "iso37001", name: "ISO 37001", scope: "Anti-bribery management.", sources: ["S83"], confidence: "reported" },
  { id: "nist-800-171", name: "NIST SP 800-171 (audited)", scope: "US controls for protecting controlled unclassified defence information.", sources: ["S83", "S28"], confidence: "reported" },
  { id: "cmmc", name: "CMMC 2.0 (readiness)", scope: "US DoD cybersecurity maturity model; preparation under way.", sources: ["S28", "DECK-SC"], confidence: "reported" },
  { id: "cemilac", name: "CEMILAC-approved design house", scope: "Indian military airworthiness approval for design work.", sources: ["S83"], confidence: "reported" },
  { id: "dpl", name: "Defence Production Licence (DPL)", scope: "Indian licence to manufacture defence items; also enables MRO work.", sources: ["S28", "S83"], confidence: "reported" },
  { id: "dsir", name: "DSIR licence (renewed to Mar 2027)", scope: "Recognition of in-house R&D by India's Department of Scientific and Industrial Research.", validTo: "2027-03", sources: ["DECK-SC"], confidence: "reported" },
  { id: "igbc-gold", name: "IGBC Gold (facility)", scope: "Green-building rating for the Devanahalli campus.", sources: ["S80", "S84"], confidence: "reported" },
];

export const certificationGaps: Fact<string>[] = [
  fact("ITAR registration status not found in public sources", ["S83", "S28"], "reported"),
];

export const awards: Award[] = [
  { id: "boeing-2015", name: "Boeing Global Supplier of the Year", by: "Boeing", year: "2015", detail: "Among 12,000+ Boeing suppliers worldwide.", sources: ["S37"], confidence: "reported" },
  { id: "boeing-2019", name: "Boeing Global Supplier of the Year", by: "Boeing", year: "2019", detail: "Second win.", sources: ["S37"], confidence: "reported" },
  { id: "honeywell-2023", name: "Supplier Excellence Award", by: "Honeywell", year: "2023", sources: ["S72"], confidence: "reported" },
  { id: "lm-2024", name: "Outstanding Supplier Recognition", by: "Lockheed Martin", year: "2024", detail: "10th Lockheed Martin Suppliers Conference, Bengaluru (Dec 2024).", sources: ["S82", "S38"], confidence: "reported" },
  { id: "lm-2025", name: "Outstanding Supplier Performance", by: "Lockheed Martin", year: "2025", detail: "Lockheed Martin Annual Suppliers Conference 2025, Bengaluru (3 Nov 2025). This is the 'Nov 2025' award in the supply-chain deck.", sources: ["R-scl-10"], confidence: "reported" },
];

export const recognition: Fact<string>[] = [
  fact("100,000+ parts delivered to Boeing", ["S72"], "reported", { asOf: "2022" }),
  fact("Customer base grew from Boeing only (2018–19) to 36 clients", ["S79", "S34"], "reported", { asOf: "2025-07" }),
  fact("30+ OEM / Tier-1 customers across 8 export countries", ["S28", "S34"], "reported"),
  fact("Aims to lift its share of a defence aircraft platform's value from ~7% to ~15% in 3–5 years", ["S79"], "reported", { asOf: "2025-07" }),
  fact("Shortlisted as a Tier-2 supplier in commercial aerospace; RFPs expected around Q2 FY27", ["S28"], "reported"),
];

export const markets = {
  exportSharePct: fact(98, ["S28"], "reported", { unit: "%", label: "Revenue exported", note: "One report says ~99%." }),
  northAmericaShareOfExportsPct: fact(80, ["S28", "WS"], "reported", { unit: "%", label: "North America share of exports", note: "Working sessions: 'USA primary – 80%, defence'." }),
  regions: fact("India · USA (primary) · SE Asia (Malaysia, Korea, Singapore) · Israel · Europe", ["WS"], "session"),
  exportCountries: fact(8, ["S28", "S34"], "reported", { unit: "countries" }),
};
