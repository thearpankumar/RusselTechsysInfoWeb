// Leadership, board, the people we work with, the designation ladder, departments and headcount.
// Merged from the research markdown, the working sessions and the people web research (research/people.json).
// No personal contact data. LinkedIn links only where the research matched the profile to Rossell Techsys
// ("verified") or matched it with one open caveat ("probable"); everything else links the company page.
import type { Confidence, Person } from "./types";
import type { Department, DesignationLevel, SeriesPoint } from "./types-extra";

export const LEADERSHIP_URL = "https://rosselltechsys.com/leadership/";
export const BOARD_URL = "https://rosselltechsys.com/investor-relations/board-of-directors/";
export const COMPANY_LINKEDIN_URL = "https://www.linkedin.com/company/rossell-techsys";

export type LinkedinConfidence = "verified" | "probable";

export interface PersonProfile extends Person {
  /** Which group the card sits in. */
  group: "board" | "leadership" | "contact";
  linkedinConfidence?: LinkedinConfidence;
  /** Where the title comes from (filings, website, sessions). */
  titleSource?: string;
  /** Previous employers, most relevant first. */
  previously?: string[];
  joined?: string;
  /** Discrepancies and caveats, shown in the overlay. */
  notes?: string[];
}

export const people: PersonProfile[] = [
  // Board / promoters
  {
    id: "harsh-mohan-gupta",
    name: "Harsh Mohan Gupta",
    title: "Executive Chairman",
    function: "Board",
    group: "leadership",
    background: "43+ years in manufacturing and services (tea, hospitality). Managing Director of Rossell India for 22 years; former FICCI and CII executive committees.",
    titleSource: "Board page · board composition PDF (17 Mar 2026) · Annual Report FY24-25",
    profileUrl: BOARD_URL,
    sources: ["R-ppl-2", "R-ppl-3", "R-ppl-4", "DECK-SC"],
    confidence: "reported",
    notes: ["No LinkedIn profile found that matches the name and Rossell.", "KMP since 3 Sep 2024 (the annual report prints 2025, apparently a typo)."],
  },
  {
    id: "rishab-mohan-gupta",
    name: "Rishab Mohan Gupta",
    title: "Managing Director",
    function: "Board / Management",
    group: "leadership",
    background: "Promoter and founding member of Rossell Techsys. Led the demerger and listing; heads the Management Council and speaks for the company on defence and space.",
    titleSource: "Board page · board composition PDF · Annual Report KMP · Q3 FY26 call",
    previously: ["Director, Rossell India Ltd"],
    linkedin: "https://www.linkedin.com/in/rishab-gupta-9a799689/",
    linkedinConfidence: "probable",
    profileUrl: BOARD_URL,
    reportsTo: "harsh-mohan-gupta",
    sources: ["R-ppl-2", "R-ppl-3", "R-ppl-4", "R-ppl-8", "R-ppl-10", "S33", "S77"],
    confidence: "reported",
    notes: ["LinkedIn profile is under 'Rishab Gupta' (Company Owner, Rossell Techsys, since Mar 2011). Matched from a search snippet; the profile itself could not be opened."],
  },

  // Leadership team
  {
    id: "senthil-balasubramanian",
    name: "Senthil Balasubramanian",
    title: "Chief Executive Officer",
    function: "Management",
    group: "leadership",
    background: "~30 years in global aerospace, defence and manufacturing. CEO from 18 Aug 2025.",
    titleSource: "NSE Reg. 30 intimation (18 Aug 2025) · Annual Report FY24-25 · Q3 FY26 call",
    previously: ["Blue Star (Group President, Manufacturing)", "Ultra Maritime (VP Global Operations)", "Collins Aerospace (Director of Operations)", "ITT Interconnect Solutions (Country GM)"],
    joined: "Aug 2025",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "rishab-mohan-gupta",
    isContact: true,
    sources: ["R-ppl-5", "R-ppl-6", "R-ppl-4", "S70", "S78", "WS"],
    confidence: "reported",
    notes: ["No LinkedIn profile found that shows Rossell Techsys; several same-name profiles exist. Company posts call him 'Senthil Bala'."],
  },
  {
    id: "zeena-philip",
    name: "Zeena Philip",
    title: "Chief Operating Officer, India Operations",
    function: "Operations",
    group: "leadership",
    background: "~3 decades in supply chain, manufacturing and operations. Designated Senior Management Personnel.",
    titleSource: "Leadership page · Annual Report FY24-25 · Q3 FY26 call",
    previously: ["GE Healthcare (18 years, last Operations Manager, Bengaluru)"],
    joined: "Sep 2021",
    linkedin: "https://www.linkedin.com/in/zeena-philip-75739216/",
    linkedinConfidence: "verified",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "senthil-balasubramanian",
    isContact: true,
    sources: ["R-ppl-1", "R-ppl-4", "R-ppl-11", "S70", "WS"],
    confidence: "reported",
  },
  {
    id: "jayanth-vishwanath",
    name: "Jayanth Vishwanath",
    title: "Chief Financial Officer",
    function: "Finance",
    group: "leadership",
    background: "Chartered Accountant. Key managerial personnel; filings name him 'Jayanth V'.",
    titleSource: "Leadership page · Annual Report KMP list · Q3 FY26 call",
    previously: ["Nandus Foods", "Pristine Organics", "HCG Group", "Caterpillar India"],
    joined: "Apr 2023",
    linkedin: "https://www.linkedin.com/in/jayanth-vishwanath-8a06b866/",
    linkedinConfidence: "verified",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "senthil-balasubramanian",
    sources: ["R-ppl-1", "R-ppl-4", "R-ppl-12", "S70"],
    confidence: "reported",
  },
  {
    id: "manian-rajaram",
    name: "Manian Rajaram",
    title: "Vice President, Supply Chain Management",
    function: "SCM & Logistics",
    group: "leadership",
    background: "Leads supply chain management; the sessions call the role VP, SCM & Logistics. Our project sponsor.",
    titleSource: "Leadership page (function) · Annual Report Annexure-6 ('Manian R', Vice President) · sessions",
    previously: ["Infosys", "Hitachi Terminal Solutions India", "Cyient DLM", "Centum Electronics", "Sanmina", "Solectron"],
    joined: "Mar 2025",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "zeena-philip",
    isContact: true,
    sources: ["R-ppl-1", "R-ppl-4", "S70", "WS", "DECK-SC"],
    confidence: "reported",
    notes: ["A same-name LinkedIn profile exists but its headline shows Hitachi, not Rossell Techsys, so it is not linked."],
  },
  {
    id: "daniel-m-varagunasingh",
    name: "Daniel M Varagunasingh",
    title: "Vice President, R&D and Information Systems",
    function: "IT / R&D",
    group: "leadership",
    background: "Owns IT and the IQMS and Crystal Reports landscape (sessions: 'Daniel, IT').",
    titleSource: "Leadership page (function) · Annual Report Annexure-6 (Vice President)",
    previously: ["Broadcom", "Larsen & Toubro", "NEC (USA)", "AT&T Paradyne"],
    joined: "Feb 2021",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "zeena-philip",
    isContact: true,
    sources: ["R-ppl-1", "R-ppl-4", "S70", "WS"],
    confidence: "reported",
  },
  {
    id: "ajosh-elias-mathew",
    name: "Ajosh Elias Mathew",
    title: "Assistant General Manager, PreSales",
    function: "PreSales",
    group: "leadership",
    background: "Leads pre-sales: RFPs and BOM costing for quotes.",
    titleSource: "Leadership page (function) · Annual Report Annexure-6 (Assistant General Manager) · sessions (General Manager)",
    previously: ["TE Connectivity", "GE (GE BE / GE Healthcare)", "Kaynes Interconnection (now Aaviza Electronics)", "Sasmos HET Technologies"],
    joined: "Feb 2024",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "senthil-balasubramanian",
    isContact: true,
    sources: ["R-ppl-1", "R-ppl-4", "S70", "WS"],
    confidence: "reported",
    notes: ["Title differs by source: Assistant General Manager in the FY24-25 annual report, General Manager in the working sessions. The GM title may reflect a later promotion; not confirmed."],
  },
  {
    id: "louis-pereira",
    name: "Louis Pereira",
    title: "Vice President, Shared Services · CISO",
    function: "Shared services / information security",
    group: "leadership",
    background: "Leads shared services; Organisational Management Representative and Chief Information Security Officer. With Rossell since Mar 2014.",
    titleSource: "Leadership page · Annual Report Annexure-6 (Vice President)",
    previously: ["Indian Air Force", "Victorian Government Business Office (India team)"],
    joined: "Mar 2014",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "senthil-balasubramanian",
    sources: ["R-ppl-1", "R-ppl-4", "S70"],
    confidence: "reported",
  },
  {
    id: "anand-dhandapani",
    name: "Anand Dhandapani",
    title: "Vice President, Quality Management System",
    function: "Quality",
    group: "leadership",
    titleSource: "Leadership page (function) · Annual Report Annexure-6 (Vice President)",
    previously: ["Pratt & Whitney Canada", "Safran Helicopter Engines", "HAL", "Aequs Aerostructures", "Azista Composites", "Sansbornes Aerospace"],
    joined: "Jan 2025",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "zeena-philip",
    sources: ["R-ppl-1", "R-ppl-4", "S70"],
    confidence: "reported",
    notes: ["A likely LinkedIn profile still shows Aequs as employer, so it is not linked."],
  },
  {
    id: "nagasundaram-narayanaswamy",
    name: "Nagasundaram Narayanaswamy",
    title: "Senior Vice President, Special Parts and Quality Systems",
    function: "Operations / quality",
    group: "leadership",
    background: "Leads development of special parts and quality systems. LinkedIn headline: Senior Vice President Operations.",
    titleSource: "Annual Report Annexure-6 (Senior Vice President) · leadership page (function)",
    previously: ["Boeing India (Head of Production Operations)", "Collins Aerospace", "Delphi Automotive Systems", "Lucas-TVS"],
    joined: "Aug 2020",
    linkedin: "https://www.linkedin.com/in/nagasundaram-narayanaswamy-a6495a264/",
    linkedinConfidence: "verified",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "zeena-philip",
    sources: ["R-ppl-1", "R-ppl-4", "R-ppl-13", "S70"],
    confidence: "reported",
  },
  {
    id: "rakesh-kumar",
    name: "Dr. Rakesh Kumar",
    title: "Vice President, R&D and Program Management",
    function: "R&D / Programs",
    group: "leadership",
    background: "10+ years of flight servicing and MRO in the Indian Navy. PhD/DBA, PMP.",
    titleSource: "Annual Report Annexure-6 (Vice President) · leadership page · LinkedIn",
    previously: ["Indian Navy", "Moog India Technology Center", "AvioHeliTronics InfoSystem", "VTI Instruments", "Cyient"],
    joined: "Feb 2025",
    linkedin: "https://www.linkedin.com/in/drrakeshk/",
    linkedinConfidence: "verified",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "senthil-balasubramanian",
    sources: ["R-ppl-1", "R-ppl-4", "R-ppl-14", "S70"],
    confidence: "reported",
  },
  {
    id: "roseanne-joseph",
    name: "Roseanne Joseph",
    title: "Head of Human Resources",
    function: "HR",
    group: "leadership",
    background: "Leads the HR function; exact title not published.",
    titleSource: "Leadership page",
    previously: ["Elohim Adonai Infotech", "Mobily Infotech", "Stovekraft India", "Nagarjuna Oil Corporation", "HCL Technologies"],
    linkedin: "https://www.linkedin.com/in/roseann-joseph-9201341b/",
    linkedinConfidence: "verified",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "senthil-balasubramanian",
    sources: ["R-ppl-1", "R-ppl-15", "S70"],
    confidence: "reported",
    notes: ["LinkedIn spells the name 'Roseann Joseph'."],
  },
  {
    id: "krishnappayya-desai",
    name: "Krishnappayya Desai",
    title: "Company Secretary & Compliance Officer",
    function: "Secretarial / compliance",
    group: "leadership",
    background: "Key managerial personnel since 27 May 2025; signs exchange filings.",
    titleSource: "Annual Report FY24-25 KMP list · NSE/BSE filings",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "rishab-mohan-gupta",
    sources: ["R-ppl-1", "R-ppl-4", "R-ppl-7", "R-ppl-8", "S70"],
    confidence: "reported",
    notes: ["Predecessors: Nirmal Khurana (to 31 Aug 2024), Komal Shrimankar (3 Sep 2024 to 7 Mar 2025)."],
  },
  {
    id: "vipina-vijayan",
    name: "Vipina Vijayan",
    title: "Secretary, Rossell Techsys Inc · Manager, Stakeholder Relationships",
    function: "US operations (Tempe)",
    group: "leadership",
    background: "Leads the Tempe, Arizona operation. Earlier Supplier Quality Manager at Rossell Techsys, Bengaluru.",
    titleSource: "Leadership page",
    previously: ["CM Envirosystems (Quality Control Engineer)"],
    linkedin: "https://www.linkedin.com/in/vipina-vijayan-2042431a/",
    linkedinConfidence: "verified",
    profileUrl: LEADERSHIP_URL,
    reportsTo: "senthil-balasubramanian",
    sources: ["R-ppl-1", "R-ppl-16", "S70", "S81"],
    confidence: "reported",
  },

  // Session-only contacts (not on the website)
  {
    id: "vinayak",
    name: "Vinayak",
    title: "Senior Manager, SCM",
    function: "SCM",
    group: "contact",
    background: "Our day-to-day contact. Full name and title to be confirmed.",
    reportsTo: "manian-rajaram",
    isContact: true,
    sources: ["WS", "DECK-SC"],
    confidence: "session",
    notes: ["Nearest public match is a procurement lead named Vinayaka Hegde at Rossell Techsys, but the name and title do not match unambiguously, so nothing is linked."],
  },
  {
    id: "purna",
    name: "Purna",
    title: "Buyer (Principal Engineer)",
    function: "Buying / SCM",
    group: "contact",
    background: "Buyer who works the morning reports. Full name and title to be confirmed.",
    reportsTo: "vinayak",
    isContact: true,
    sources: ["WS"],
    confidence: "session",
  },
];

export interface BoardMember {
  id: string;
  name: string;
  designation: string;
  category: string;
  committees: string[];
  background?: string;
  /** Person id when the director is also in the leadership grid. */
  personId?: string;
  sources: string[];
  confidence: Confidence;
}

export const board: BoardMember[] = [
  { id: "board-harsh", name: "Harsh Mohan Gupta", designation: "Executive Chairman", category: "Executive · Promoter", committees: [], personId: "harsh-mohan-gupta", sources: ["R-ppl-2", "R-ppl-3"], confidence: "reported" },
  { id: "board-rishab", name: "Rishab Mohan Gupta", designation: "Managing Director", category: "Executive · Promoter", committees: ["CSR (member)"], personId: "rishab-mohan-gupta", sources: ["R-ppl-2", "R-ppl-3"], confidence: "reported" },
  { id: "board-arvind-ghei", name: "Arvind Ghei", designation: "Independent Director", category: "Independent", committees: ["Audit (chair)", "NRC (member)", "SRC (member)"], background: "38+ years in hospitality finance; former Joint MD, Asia Pacific Hotels.", sources: ["R-ppl-2", "R-ppl-3"], confidence: "reported" },
  { id: "board-talari-suvarna-raju", name: "Talari Suvarna Raju", designation: "Independent Director", category: "Independent", committees: ["NRC (chair)", "Audit (member)", "SRC (member)"], background: "Former Chairman & MD, Hindustan Aeronautics Ltd (HAL).", sources: ["R-ppl-2", "R-ppl-3"], confidence: "reported" },
  { id: "board-shobhana-joshi", name: "Shobhana Joshi", designation: "Woman Independent Director", category: "Independent", committees: ["CSR (chair)", "Audit (member)"], background: "37 years in government, including Secretary (Defence Finance).", sources: ["R-ppl-2", "R-ppl-3"], confidence: "reported" },
  { id: "board-digant-parikh", name: "Digant Parikh", designation: "Non-Executive Director", category: "Non-executive · non-independent", committees: ["SRC (chair)", "Audit (member)", "NRC (member)", "CSR (member)"], background: "VP Finance, Rossell India Ltd; Independent Director, Marksans Pharma.", sources: ["R-ppl-2", "R-ppl-3"], confidence: "reported" },
];

/** Who reports to whom, with how sure we are about each line. */
export const reportingLines: { from: string; to: string; sources: string[]; confidence: Confidence; note?: string }[] = [
  { from: "rishab-mohan-gupta", to: "harsh-mohan-gupta", sources: ["DECK-SC", "R-ppl-2"], confidence: "estimate", note: "Board structure; MD and Chairman roles reported, reporting line assumed." },
  { from: "senthil-balasubramanian", to: "rishab-mohan-gupta", sources: ["S70", "S78"], confidence: "estimate" },
  { from: "zeena-philip", to: "senthil-balasubramanian", sources: ["WS", "DECK-SC"], confidence: "session", note: "Deck p.20 chain: CEO → COO → VP SCM & Logistics → Senior Manager." },
  { from: "manian-rajaram", to: "zeena-philip", sources: ["WS", "DECK-SC"], confidence: "session" },
  { from: "vinayak", to: "manian-rajaram", sources: ["WS", "DECK-SC"], confidence: "session" },
  { from: "purna", to: "vinayak", sources: ["WS", "DECK-SC"], confidence: "estimate", note: "Deck shows 'Managers, Assistant Managers' then 'Buyers, Principal Engineers' under the Senior Manager." },
  { from: "daniel-m-varagunasingh", to: "zeena-philip", sources: ["WS"], confidence: "estimate", note: "Sessions place Daniel at VP level beside Manian; direct line not stated." },
  { from: "ajosh-elias-mathew", to: "senthil-balasubramanian", sources: ["WS"], confidence: "estimate" },
  { from: "jayanth-vishwanath", to: "senthil-balasubramanian", sources: ["S70"], confidence: "estimate" },
  { from: "anand-dhandapani", to: "zeena-philip", sources: ["S70"], confidence: "estimate" },
  { from: "nagasundaram-narayanaswamy", to: "zeena-philip", sources: ["S70"], confidence: "estimate" },
  { from: "louis-pereira", to: "senthil-balasubramanian", sources: ["S70"], confidence: "estimate" },
  { from: "rakesh-kumar", to: "senthil-balasubramanian", sources: ["S70"], confidence: "estimate" },
  { from: "roseanne-joseph", to: "senthil-balasubramanian", sources: ["S70"], confidence: "estimate" },
  { from: "krishnappayya-desai", to: "rishab-mohan-gupta", sources: ["S70"], confidence: "estimate" },
  { from: "vipina-vijayan", to: "senthil-balasubramanian", sources: ["S70"], confidence: "estimate" },
];

export const sponsorId = "manian-rajaram";
export const dayToDayContactId = "vinayak";

/** The SCM chain we work inside (deck p.20 + sessions), top to bottom. */
export const scmChain: { id: string; role: string; personId?: string; who?: string; contact?: "sponsor" | "day-to-day" | "working"; sources: string[]; confidence: Confidence }[] = [
  { id: "ceo", role: "Chief Executive Officer", personId: "senthil-balasubramanian", sources: ["S70", "DECK-SC"], confidence: "reported" },
  { id: "coo", role: "Chief Operating Officer", personId: "zeena-philip", sources: ["S70", "DECK-SC"], confidence: "reported" },
  { id: "vp-scm", role: "VP, SCM & Logistics", personId: "manian-rajaram", contact: "sponsor", sources: ["WS", "DECK-SC", "R-ppl-4"], confidence: "session" },
  { id: "sr-manager", role: "Senior Manager, SCM", personId: "vinayak", contact: "day-to-day", sources: ["WS", "DECK-SC"], confidence: "session" },
  { id: "managers", role: "Managers · Assistant Managers", who: "Buying, planning and stores leads", sources: ["DECK-SC"], confidence: "session" },
  { id: "buyers", role: "Buyers · Principal Engineers", personId: "purna", who: "Purna and the buying team", contact: "working", sources: ["WS", "DECK-SC"], confidence: "session" },
];

export const designationLadder: DesignationLevel[] = [
  { rank: 1, title: "VP", plain: "Heads a function (e.g. SCM & Logistics).", sources: ["WS"], confidence: "session" },
  { rank: 2, title: "Senior Manager", plain: "Runs a team within the function day to day.", sources: ["WS"], confidence: "session" },
  { rank: 3, title: "Manager", plain: "Owns a process area: buying, planning, stores.", sources: ["WS"], confidence: "session" },
  { rank: 4, title: "Assistant Manager", plain: "Supervises a group of engineers or buyers.", sources: ["WS"], confidence: "session" },
  { rank: 5, title: "Team Lead", plain: "Leads a small working team.", sources: ["WS"], confidence: "session" },
  { rank: 6, title: "Principal Engineer", plain: "Senior individual contributor; buyers sit here.", sources: ["WS"], confidence: "session" },
  { rank: 7, title: "Engineer", plain: "Individual contributor.", sources: ["WS"], confidence: "session" },
  { rank: 8, title: "Associate Engineer", plain: "Entry level.", sources: ["WS"], confidence: "session" },
];

export const departments: Department[] = [
  { id: "presales", name: "PreSales", does: "Answers RFPs; costs the BOM for quotes.", sources: ["WS"], confidence: "session" },
  { id: "sourcing", name: "Sourcing", does: "Bidding, costing and negotiation with suppliers.", usesFiles: ["rt-consolidated-bom", "forecast", "sourcing"], sources: ["WS"], confidence: "session" },
  { id: "engineering", name: "Engineering", does: "Turns customer drawings into engineering BOMs and routings; manages revisions and alternates.", usesFiles: ["rt-consolidated-bom"], sources: ["WS"], confidence: "session" },
  { id: "scm", name: "SCM", does: "Supplier dates, goods receipt, promise dates in IQMS, supplier follow-up.", usesFiles: ["grn", "promise-date-upload", "exception-mab"], sources: ["WS"], confidence: "session" },
  { id: "logistics", name: "Logistics", does: "Imports, customs, bonded/DTA rules, air freight out.", sources: ["WS", "S28"], confidence: "session" },
  { id: "planning", name: "Planning (PPC)", does: "Production planning and control: stock, work orders, kits, build dates.", usesFiles: ["active-stock", "rt-consolidated-bom"], sources: ["WS"], confidence: "session" },
  { id: "production", name: "Production", does: "Assembles and tests the finished good; raises shortages.", sources: ["WS"], confidence: "session" },
  { id: "quality", name: "Quality", does: "Incoming inspection, CoC, traceability, FAI, NCRs.", sources: ["WS"], confidence: "session" },
  { id: "it-support", name: "IT Support", does: "Runs IQMS and the morning Crystal Reports.", sources: ["WS"], confidence: "session" },
  { id: "software-dev", name: "Software Development", does: "Builds in-house reports such as the Reorder report.", usesFiles: ["reorder"], sources: ["WS"], confidence: "session" },
  { id: "finance", name: "Finance", does: "Working capital, advances, inventory valuation, duty reconciliation.", sources: ["WS", "S28"], confidence: "session" },
  { id: "operations", name: "Operations", does: "Runs the plants under the COO.", sources: ["WS"], confidence: "session" },
  { id: "management", name: "Management / Leadership", does: "Approvals, PO limits, early buys, write-offs.", sources: ["WS"], confidence: "session" },
  { id: "buying", name: "Buyers", does: "Read exceptions and must-arrive-by dates, raise reorders, chase promise dates. Sit inside SCM.", usesFiles: ["active-stock", "exception", "exception-mab", "rt-consolidated-bom", "rt-open-order", "reorder", "forecast"], sources: ["WS"], confidence: "session" },
];

/** The 12 departments named in the sessions (Buyers sit inside SCM; Management is the approval layer above them). */
export const coreDepartmentIds = ["presales", "sourcing", "engineering", "scm", "logistics", "planning", "production", "quality", "it-support", "software-dev", "finance", "operations"] as const;

/* ---------- headcount ---------- */

export type WorkforceBasis = "total" | "permanent" | "target";

export interface WorkforcePoint extends SeriesPoint {
  id: string;
  basis: WorkforceBasis;
  definition: string;
}

/**
 * Workforce over time. Definitions differ: "total" counts employees, contract staff, consultants,
 * trainees and apprentices; "permanent" is the statutory on-roll count; "target" is a company estimate.
 */
export const workforce: WorkforcePoint[] = [
  { id: "wf-baseline", label: "Pre-ramp", asOf: "2025-07-31", value: 680, unit: "people", basis: "total", definition: "Total workforce before the 2025 ramp; the baseline date is not stated.", sources: ["R-ppl-7", "S84"], confidence: "reported", note: "Press release 14 Aug 2025: 'scaled from 680 to 950 employees'." },
  { id: "wf-2025-03-perm", label: "Mar 25", asOf: "2025-03-31", value: 253, unit: "people", basis: "permanent", definition: "Permanent employees on the rolls only (statutory disclosure). Excludes contract staff and trainees.", sources: ["R-ppl-4"], confidence: "reported", note: "The source of the '253 employees' shown on some data aggregators." },
  { id: "wf-2025-08", label: "Aug 25", asOf: "2025-08-14", value: 960, unit: "people", basis: "total", definition: "Total workforce stated on the Q1 FY26 call.", sources: ["R-scl-19", "R-ppl-7", "R-ppl-4"], confidence: "reported", note: "Same month, three versions: 960 (call), 950 (press release, 'scaled to'), 850 now and 950 by year-end (annual report MD message)." },
  { id: "wf-2025-09", label: "Sep 25", asOf: "2025-09-30", value: 1092, unit: "people", basis: "total", definition: "Total workforce; 856 on-roll plus contract workers and trainees.", sources: ["R-scl-18", "R-scl-17"], confidence: "reported" },
  { id: "wf-2025-12", label: "Dec 25", asOf: "2025-12-31", value: 1177, unit: "people", basis: "total", definition: "904 employees, contract staff and consultants plus 273 trainees and apprentices.", sources: ["R-ppl-8", "R-scl-15"], confidence: "reported" },
  { id: "wf-2026-06", label: "Jun 26", asOf: "2026-06-30", value: 1281, unit: "people", basis: "total", definition: "Total workforce reported with Q1 FY27 results; the latest figure.", sources: ["R-scl-11"], confidence: "reported", note: "The Q2 FY27 deck charts 1,196 employees for 2026 on a different basis." },
  { id: "wf-2027-target", label: "2027", asOf: "2027-12-31", value: 2000, unit: "people", basis: "target", definition: "Company estimate charted in the Q2 FY27 investor deck.", sources: ["R-scl-11", "R-scl-1"], confidence: "reported" },
  { id: "wf-2029-target", label: "2029", asOf: "2029-12-31", value: 2500, unit: "people", basis: "target", definition: "Company estimate charted in the Q2 FY27 investor deck.", sources: ["R-scl-11", "R-scl-1"], confidence: "reported" },
];

/** Latest total workforce. */
export const latestWorkforce = workforce.find((w) => w.id === "wf-2026-06")!;

/** Back-compat simple series (reported points only). */
export const headcount: SeriesPoint[] = workforce
  .filter((w) => w.basis !== "target")
  .map(({ label, asOf, value, unit, sources, confidence, note }) => ({ label, asOf, value, unit, sources, confidence, note }));

export const linkedinCompany = {
  employeesOnLinkedIn: { value: 436, sizeBand: "201–500", sources: ["R-ppl-9"], confidence: "reported" as Confidence, note: "From search-engine snippets read 11 Nov 2026; LinkedIn blocked a direct fetch. Counts only people who list Rossell on LinkedIn." },
  followers: { value: 7600, display: "~7,600", sources: ["R-ppl-9"], confidence: "reported" as Confidence, note: "7,587 to 7,700 across snippets." },
  url: COMPANY_LINKEDIN_URL,
  pageName: "Rossell Techsys (Division of Rossell India Limited)",
};
