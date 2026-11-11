// What we are still confirming with Rossell (G1), research gaps (G2), and where our documents disagree.
import type { Contradiction, OpenQuestion, ResearchGap } from "./types-extra";

export const openQuestions: OpenQuestion[] = [
  { id: "Q1", question: "Which IQMS version, and what API access is available for writing back promise dates?", affects: ["Integration", "Module B"], status: "open", sources: ["RESEARCH", "DECK-RESEARCH"], confidence: "session" },
  { id: "Q2", question: "Buffer length and forecast exclusion window per customer (2 months default, 6 for LAM): are these configurable per customer?", affects: ["Module A"], status: "partly-answered", sources: ["RESEARCH", "WS"], confidence: "session", note: "Defaults (2 months; 6 for LAM) are known from the sessions." },
  { id: "Q3", question: "How should need date, order value, project and customer be weighted in allocation?", affects: ["Module C"], status: "open", sources: ["RESEARCH", "WS"], confidence: "session" },
  { id: "Q4", question: "Does stock on QA hold count as supply? Are realignments automatic or approved?", affects: ["Net demand rule", "Module C"], status: "open", sources: ["RESEARCH"], confidence: "session" },
  { id: "Q5", question: "Which suppliers will use the portal, and which hold VMI stock for Rossell?", affects: ["Module B"], status: "open", sources: ["RESEARCH", "WS"], confidence: "session" },
  { id: "Q6", question: "Is the USA plant in the same IQMS instance as Bengaluru Plants 1 and 2?", affects: ["Rule 2.1", "Multi-plant"], status: "open", sources: ["RESEARCH"], confidence: "session" },
  { id: "Q7", question: "Are revision effective dates set by date, by serial / lot, or by contract?", affects: ["Rule 2.2"], status: "open", sources: ["RESEARCH", "RULES"], confidence: "session" },
  { id: "Q8", question: "Who owns the canonical material master; is customer PN → material one-to-many?", affects: ["Rule 2.1", "W2"], status: "open", sources: ["RESEARCH", "RULES"], confidence: "session" },
  { id: "Q9", question: "Is customer-furnished material planned in the same net demand as purchased parts?", affects: ["W6–W7"], status: "open", sources: ["RESEARCH"], confidence: "session" },
  { id: "Q10", question: "Do forecasts drive purchasing broadly, or only long-lead parts?", affects: ["W6", "W8"], status: "open", sources: ["RESEARCH"], confidence: "session" },
  { id: "Q11", question: "Confirm the titles of Vinayak and Purna (not on the website), and Manian's VP title.", affects: ["Stakeholder map"], status: "open", sources: ["RESEARCH", "WS", "S70"], confidence: "session" },
  { id: "Q12", question: "Confirm the ~4-month inventory target, and whether the new DTA unit is a separate plant in IQMS.", affects: ["Outcomes", "Rule 2.1"], status: "open", sources: ["RESEARCH", "S28", "S45"], confidence: "session" },
];

export const howToClose = {
  text: "One working session with SCM, PPC and IT, walking one live project from customer forecast to kitted wire bundle. Each answer becomes a numbered business rule alongside 2.1 and 2.2.",
  sources: ["RESEARCH", "DECK-RESEARCH"],
  confidence: "session" as const,
};

export const researchGaps: ResearchGap[] = [
  { id: "G2.1", gap: "Material cost detail", why: "H1 FY27 materials were ~63% of revenue; the FY26 annual report should still give inventory value (₹) and key suppliers.", sources: ["RESEARCH", "S41"], confidence: "calc" },
  { id: "G2.2", gap: "Supplier list", why: "The actual BOM categories and suppliers are not public. The connector / wire makers listed are industry examples only.", sources: ["RESEARCH"], confidence: "industry-example" },
  { id: "G2.3", gap: "Segment split", why: "A revenue split by aerospace / defence / semiconductor / space for FY27 has not been disclosed.", sources: ["RESEARCH"], confidence: "reported" },
  { id: "G2.4", gap: "Bottom-up target-segment model", why: "Number of mid-size Indian EMS / OEM companies × annual BOM spend not yet built.", sources: ["RESEARCH"], confidence: "estimate" },
  { id: "G2.5", gap: "Q2 FY27 call transcript", why: "Only an audio recording (posted 7 Nov 2026) is available; the transcript is not yet published.", sources: ["RESEARCH", "S43"], confidence: "reported" },
  { id: "G2.6", gap: "India aerospace wire-harness market size", why: "No credible figure found; only automotive harness proxies exist.", sources: ["RESEARCH"], confidence: "reported" },
  { id: "G2.7", gap: "Per-client revenue", why: "No client-level revenue is disclosed beyond program values (T-7, space) and concentration comments.", sources: ["S28"], confidence: "reported" },
  { id: "G2.8", gap: "Counts of materials, suppliers and orders", why: "Sessions describe 'thousands of materials, hundreds of suppliers'; exact counts not shared yet.", sources: ["WS", "DECK-SC"], confidence: "session" },
];

/** Where our own documents disagree. The site shows the version noted in `resolution`. */
export const contradictions: Contradiction[] = [
  { id: "C1", topic: "H1 FY27 revenue", versions: [{ value: "₹340.2 Cr", sources: ["S41", "S42", "DECK-RESEARCH"] }, { value: "~₹345 Cr", sources: ["DECK-SC"] }], resolution: "Use ₹340.2 Cr (company presentation); deck p.17 rounds." },
  { id: "C2", topic: "Q2 FY27 PAT", versions: [{ value: "₹9.66 Cr (consolidated)", sources: ["S40"] }, { value: "₹9.4 Cr (standalone, +88%)", sources: ["DECK-SC"] }], resolution: "Both valid on different bases; label the basis." },
  { id: "C3", topic: "H1 FY27 PAT", versions: [{ value: "₹16.4 Cr (company)", sources: ["S41"] }, { value: "₹16.80 Cr (sum of consolidated quarters)", sources: ["S30", "S40"] }], resolution: "Use ₹16.4 Cr." },
  { id: "C4", topic: "Lockheed Martin Outstanding Supplier Recognition date", versions: [{ value: "Dec 2024 (10th Suppliers Conference)", sources: ["S82", "S38"] }, { value: "Nov 2025", sources: ["DECK-SC"] }], resolution: "Both are real, separate awards: Outstanding Supplier Recognition (10 Dec 2024) and Outstanding Supplier Performance (3 Nov 2025, R-scl-10). Show both." },
  { id: "C5", topic: "Bengaluru campus area", versions: [{ value: "~225,000 sq ft (Aug 2025)", sources: ["S80", "S84", "R-scl-9"] }, { value: "~2.55 lakh sq ft (255,000)", sources: ["DECK-SC", "R-scl-7"] }], resolution: "Different dates. Filings show 225,000 (Aug 2025) → 240,000 (Nov 2025) → 255,000 sq ft (May 2026); show 255,000 as the latest." },
  { id: "C6", topic: "Aerospace Park facility status", versions: [{ value: "Expected to start operations shortly (Q2 FY27 reporting)", sources: ["S42"] }, { value: "Inaugurated Q2 FY27", sources: ["DECK-RESEARCH"] }, { value: "New facility (Q2 FY27)", sources: ["DECK-SC"] }, { value: "Inaugurated 3 Nov 2026 at the 15-year anniversary", sources: ["S72"] }], resolution: "Use 'inaugurated 3 Nov 2026' (company news)." },
  { id: "C7", topic: "Inventory target", versions: [{ value: "~4 months, not re-confirmed: indicative", sources: ["RESEARCH", "S28"] }, { value: "Target 4 months in 24 months", sources: ["DECK-SC"] }, { value: "~4-month target (stated as target)", sources: ["DECK-RESEARCH"] }], resolution: "Show ~4 months as indicative; open question Q12." },
  { id: "C8", topic: "Inventory months, FY26 / Q2 FY27", versions: [{ value: "7.67 (FY26) → 6.7 (Q2 FY27)", sources: ["S28", "S42"] }, { value: "~7.7 → ~4 (research deck p.34)", sources: ["DECK-RESEARCH"] }, { value: "6.67 (deck)", sources: ["DECK-SC"] }], resolution: "Series: ~10 → 7.98 (Q2 FY26) → 7.67 (FY26) → 6.67 (Q2 FY27). Note 7.98 at Q2 FY26 is higher than the FY26 7.67, so the series is not monotonic." },
  { id: "C9", topic: "Aircraft order backlog", versions: [{ value: "Above 17,000 (IATA via WireMasters)", sources: ["S47"] }, { value: "18,000+ / 17,000–18,000+ (IATA, Jun 2026)", sources: ["D-iata"] }], resolution: "Different dates; show '17,000–18,000+'." },
  { id: "C10", topic: "Aerospace wiring harness market", versions: [{ value: "~$7.0B (2025) → $7.46B (2026) → $11.84B (2035), 5.3% CAGR (GMI)", sources: ["S62"] }, { value: "US$8.1B (2026), 5.8% CAGR to US$12.7B by 2034 (OG Analysis)", sources: ["D-og-analysis"] }, { value: "A&D wire harness $8.35B (2025) → $12.68B (2034)", sources: ["S63"] }, { value: "US$6.8B (2025), US$6.5B (2024); 5.5% CAGR to US$10.9B by 2034 (GMI, same report page as S62)", sources: ["R-comp-27"] }], resolution: "Market definitions differ (deck notes a US$1.6B–8.1B range for 2026); show as a range. The two GMI readings disagree (~$7.0B vs $6.8B for 2025); the page has likely been updated between reads." },
  { id: "C11", topic: "Semiconductor equipment market", versions: [{ value: "WFE ≈ $150B (2026), >$200B (2027) — Lam Research", sources: ["S49", "S50"] }, { value: "$145B (2026F) → $156B (2027) — SEMI", sources: ["D-semi"] }], resolution: "Different scopes (WFE vs total equipment) and dates; cite each separately." },
  { id: "C12", topic: "Revenue mix", versions: [{ value: "~70% A&D / 30% non-defence", sources: ["S88"] }, { value: "Semiconductor + space ~20% of FY26 revenue", sources: ["S28"] }, { value: "Non-A&D ~₹140–150 Cr of H1 FY27 (~41–44%)", sources: ["DECK-SC"] }], resolution: "Not strictly contradictory (non-A&D includes industrial; mix is shifting fast); show each with its period." },
  { id: "C13", topic: "Counterfeit statistic wording", versions: [{ value: "9-year high; over 25% active parts", sources: ["DECK-RESEARCH"] }, { value: "1,055 parts in 2024, +25% YoY, highest since 2015; 27.2% active; one 248-part batch drives most of the rise", sources: ["S60"] }], resolution: "Use the fact-checked ERAI wording." },
  { id: "C14", topic: "Demerger date shorthand", versions: [{ value: "Demerged Aug 2024 (effective 30 Aug 2024)", sources: ["DECK-RESEARCH"] }, { value: "Appointed date 1 Apr 2023", sources: ["DECK-SC", "S33"] }], resolution: "Both true: show the full sequence (appointed 1 Apr 2023 → NCLT 25 Apr 2024 → effective 30 Aug 2024 → record 20 Sep 2024 → listed 9 Dec 2024)." },
  { id: "C15", topic: "CTB naming in session notes", versions: [{ value: "'CTB – Clear to Bill' / 'CTM report'", sources: ["WS"] }, { value: "Clear-to-Build", sources: ["RESEARCH", "S56"] }], resolution: "Use Clear-to-Build; the notes contain typos." },
  { id: "C16", topic: "Net demand worked example", versions: [{ value: "'100 − 20 + whatever I have'", sources: ["WS"] }, { value: "100 − 20 = 80, then compared with free stock", sources: ["DECK-RESEARCH"] }, { value: "100 − 20 − 80 = 0", sources: ["DECK-SC"] }], resolution: "Show the full chain 100 − 20 = 80 net demand; − 80 free stock = 0 to buy." },
  { id: "C17", topic: "GRN / Promise Date Upload consumers", versions: [{ value: "Blank in the session sheet", sources: ["WS"] }, { value: "GRN: SCM; Promise Date Upload: SCM, Buyer", sources: ["DECK-RESEARCH"] }], resolution: "Use the deck's consumers, noting the sheet is blank." },
];
