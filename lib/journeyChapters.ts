// Journey chapter registry: order, routes, acts, mono indices, labels and hub-card copy.
// `label` is the full chapter name (headings, eyebrows, search); `rail` is the short form that fits the rail.
// `figure` is the one key number on the hub card; values must match the chapter (same metric = same number).
// Sections and sub-sections live in lib/structure/ (one file per chapter).
// `covers` lists the topics a reader may look for (search keywords + hub card "covers" line).

export type ActId = "company" | "business" | "make-buy" | "runs" | "sources";

export const acts: { id: ActId; index: string; label: string; blurb: string }[] = [
  { id: "company", index: "01", label: "The company", blurb: "Who Rossell is, what it earns, where it is going, where it sits and who runs it." },
  { id: "business", index: "02", label: "The business", blurb: "What it sells, to whom, and against whom." },
  { id: "make-buy", index: "03", label: "What they make and buy", blurb: "The finished goods, the materials inside them, the volumes and the suppliers." },
  { id: "runs", index: "04", label: "How it runs", blurb: "From a customer drawing to a shipped harness, and the files that run the floor." },
  { id: "sources", index: "05", label: "Sources", blurb: "Where every figure comes from, and what is still open." },
];

export interface ChapterDef {
  index: string;
  id: string;
  label: string;
  rail?: string;
  act: ActId;
  /** Hub card one-liner (the chapter's statement, short form). */
  teaser: string;
  figure: { value: string; unit?: string; label: string };
  covers: string[];
  /** "What this means": the plain-English takeaway shown at the end of the chapter. */
  takeaway: string;
}

export const chapters = [
  {
    index: "01",
    id: "portfolio",
    label: "Portfolio",
    act: "company",
    teaser: "A build-to-print specialist Boeing has twice named supplier of the year.",
    figure: { value: "15", unit: "years", label: "Founded early 2011" },
    covers: ["About", "Portfolio", "Certifications", "Awards", "Listing"],
    takeaway: "Rossell builds to other people's designs, so its reputation rests on approvals, delivery and quality, not on owning products.",
  },
  {
    index: "02",
    id: "financials",
    label: "Financials",
    act: "company",
    teaser: "Revenue nearly doubled in a year, and margins widened while it did.",
    figure: { value: "₹485", unit: "Cr", label: "FY26 revenue, up 87%" },
    covers: ["Revenue", "Profit", "Margins", "Cost of materials", "Balance sheet"],
    takeaway: "Growth is real but cash-hungry: most of every rupee earned goes back into materials and stock.",
  },
  {
    index: "03",
    id: "growth",
    label: "Growth",
    act: "company",
    teaser: "The order book is back at ₹900 Cr, and half of it is no longer aerospace.",
    figure: { value: "₹900", unit: "Cr", label: "Order book, Sep 2026" },
    covers: ["Order book", "Revenue mix", "Inventory months", "Ambitions"],
    takeaway: "The mix is moving to faster-turning semiconductor and space work, which changes how material has to be planned.",
  },
  {
    index: "04",
    id: "footprint",
    label: "Footprint",
    rail: "Footprint",
    act: "company",
    teaser: "One airport-side campus, a small US arm, and customers on three continents.",
    figure: { value: "~98", unit: "%", label: "Of revenue exported" },
    covers: ["Offices", "Locations", "Plants", "Export markets"],
    takeaway: "Everything is built in one Bengaluru cluster and flown out, so lead times and logistics shape every promise date.",
  },
  {
    index: "05",
    id: "people",
    label: "People",
    act: "company",
    teaser: "A promoter-led board, a new operating team, and a workforce growing faster than its floor space.",
    figure: { value: "1,281", unit: "people", label: "Workforce, Jun 2026" },
    covers: ["Team", "Hierarchy", "LinkedIn", "Employee count", "Board", "Departments"],
    takeaway: "A small leadership bench runs a fast-growing floor; the buying team carries much of the daily load.",
  },
  {
    index: "06",
    id: "what-they-do",
    label: "What they do",
    act: "business",
    teaser: "Four domains, four ways of ordering.",
    figure: { value: "4", unit: "domains", label: "Aerospace, defence, semiconductor, space" },
    covers: ["Verticals", "Domains", "Services"],
    takeaway: "Each domain orders differently, so one planning method cannot fit all four.",
  },
  {
    index: "07",
    id: "clients",
    label: "Clients",
    act: "business",
    teaser: "One anchor customer became thirty, across four domains.",
    figure: { value: "~40", unit: "%", label: "Of FY26 revenue from Boeing" },
    covers: ["Clients", "Clients × services", "Clients × services × financials"],
    takeaway: "Boeing still anchors revenue, but new semiconductor and space customers are where the growth comes from.",
  },
  {
    index: "08",
    id: "competition",
    label: "Competitive landscape",
    rail: "Competition",
    act: "business",
    teaser: "A small, focused player among much larger electronics makers.",
    figure: { value: "~0.5–0.8", unit: "%", label: "Share of the global harness market (estimate)" },
    covers: ["Competitors", "Where Rossell sits", "Market share", "Revenues", "Services"],
    takeaway: "Rossell is smaller than its Indian peers but far more focused on aerospace and defence harnesses.",
  },
  {
    index: "09",
    id: "anatomy",
    label: "Finished goods & materials",
    rail: "Goods & materials",
    act: "make-buy",
    teaser: "Anatomy of a harness: the finished goods Rossell ships and the materials inside them.",
    figure: { value: "19", unit: "material types", label: "Explained in plain English" },
    covers: ["Finished goods (FGs)", "Materials", "Harness parts", "FG types explained"],
    takeaway: "Every finished good is a stack of small bought-in parts; if one is missing, nothing ships.",
  },
  {
    index: "10",
    id: "scale",
    label: "Scale",
    act: "make-buy",
    teaser: "Hundreds of thousands of assemblies, built one complete kit at a time.",
    figure: { value: "175,000+", unit: "units", label: "Delivered to all customers by Jan 2024" },
    covers: ["Order count", "Order value", "FGs delivered", "Materials procured"],
    takeaway: "The volume is not the hard part; having every one of thousands of parts on the shelf at the same time is.",
  },
  {
    index: "11",
    id: "supply-base",
    label: "Supply base",
    rail: "Suppliers",
    act: "make-buy",
    teaser: "Thousands of materials. Hundreds of suppliers.",
    figure: { value: "27", unit: "suppliers", label: "Profiled: who, what, examples, location" },
    covers: ["Suppliers", "Supplier count", "Supplier list", "Supplier profiles"],
    takeaway: "Most of the parts come from a few global makers through distributors, so supplier follow-up decides delivery.",
  },
  {
    index: "12",
    id: "operations",
    label: "How Rossell runs",
    rail: "How it runs",
    act: "runs",
    teaser: "How Rossell runs, from a drawing to a delivered wire bundle.",
    figure: { value: "20", unit: "workflows", label: "In five phases" },
    covers: ["Lifecycle", "BOM rules", "Net demand", "Workflows", "Systems", "Glossary"],
    takeaway: "Planning runs on one ERP, a morning report and a lot of Excel and email in between.",
  },
  {
    index: "13",
    id: "data",
    label: "Files & data dictionary",
    rail: "Files & data",
    act: "runs",
    teaser: "Sixteen reports feed the planning floor. Seven arrived as Rossell's own column sheets.",
    figure: { value: "16", unit: "files", label: "Each with a template view" },
    covers: ["Files", "Template view", "Data dictionary", "Column names", "Clarification questions"],
    takeaway: "Sixteen files and one shared vocabulary describe everything planning needs to know.",
  },
  {
    index: "14",
    id: "rules",
    label: "Business rules",
    rail: "Business rules",
    act: "runs",
    teaser: "Every rule in one register: what applies, to what, and since when.",
    figure: { value: "122", unit: "rules", label: "With state history, status and context" },
    covers: ["Business rules", "Rule register", "Active rules", "Inactive rules", "State history", "Effective dates", "Context", "Supplier order", "Contractor", "Excel download"],
    takeaway: "Most rules can switch on as written; the open questions decide the few that cannot, and every rule keeps the dates it applied.",
  },
  {
    index: "15",
    id: "sources",
    label: "Sources",
    act: "sources",
    teaser: "Every figure on this site traces back to a source.",
    figure: { value: "271", unit: "sources", label: "Public, research and working-session" },
    covers: ["Sources", "Open questions", "Confidence"],
    takeaway: "Where a figure is an estimate or an inference, it says so; the open questions are what we will confirm with you.",
  },
] as const satisfies readonly ChapterDef[];

export type Chapter = (typeof chapters)[number];
export type ChapterId = Chapter["id"];

export const chapterHref = (id: string) => `/${id}`;

export function getChapter(id: ChapterId): Chapter {
  return chapters.find((c) => c.id === id)!;
}

export function isChapterId(id: string): id is ChapterId {
  return chapters.some((c) => c.id === id);
}

export function chapterPosition(id: string): number {
  return chapters.findIndex((c) => c.id === id);
}

/** Chapter id for a pathname ("/clients" → "clients"); null on the hub. */
export function chapterFromPath(pathname: string | null): ChapterId | null {
  const seg = (pathname ?? "/").split("/")[1] ?? "";
  return isChapterId(seg) ? seg : null;
}

export function getAct(id: ActId) {
  return acts.find((a) => a.id === id)!;
}
