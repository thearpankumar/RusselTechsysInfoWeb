// All sources. S1–S92 keep the numbering of Appendix B in
// docs/Rossell_BOM_Supply_Chain_Research.md ([n] there = "S<n>" here).
// Internal inputs: WS, RULES, DECK-SC, DECK-RESEARCH.
// D-<slug> = sources named only in the two decks (no URL given in our docs).
import type { Source, SourceGroup } from "./types";
// Web-research source lists (R-<topic>-<n>). To add another topic: create content/sources-<topic>.ts
// exporting a Source[] and append it to `researchSourceLists` below.
import { peopleSources } from "./sources-people";
import { competitorsSources } from "./sources-competitors";
import { scaleSources } from "./sources-scale";
import { suppliersSources } from "./sources-suppliers";
import { assetSources } from "./sources-assets";
import { peoplePhotoSources } from "./peoplePhotos";
import { clientLogoSources } from "./clientLogos";
import { orgLogoSources } from "./orgLogos";

export const appendixBSources: Source[] = [
  { id: "S1", title: "Electronics manufacturing bottlenecks", publisher: "Accuris", url: "https://accuristech.com/blog/blog-electronics-manufacturing-bottlenecks/", date: "Mar 2026", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S2", title: "The engineer and the electronic component sourcing process", publisher: "Siemens EDA blog", url: "https://blogs.sw.siemens.com/electronic-systems-design/2022/08/31/electronic-component-sourcing-2/", date: "Aug 2022", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S3", title: "Real-Time BOM Decision-Making Made Simple", publisher: "Octopart Pulse", url: "https://octopart.com/pulse/p/real-time-bom-decision-making-made-simple", date: "Feb 2026", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S4", title: "Comparing BOM tools", publisher: "Altium Resources", url: "https://resources.altium.com/p/bom-tools-comparision", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S5", title: "BOM management software", publisher: "Z2Data", url: "https://www.z2data.com/it/landing/lpa/bom-management-software/", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S6", title: "Are You Missing These 5 Critical BOM Scrubbing Steps?", publisher: "Z2Data", url: "https://www.z2data.com/insights/are-you-missing-these-critical-bom-scrubbing-steps-", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S7", title: "Are You Missing These 5 Critical BOM Scrubbing Steps? (Italian edition)", publisher: "Z2Data", url: "https://www.z2data.com/it/insights/are-you-missing-these-critical-bom-scrubbing-steps-", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S8", title: "Electronic component lifecycle management: plan beyond the BOM", publisher: "Sourceability", url: "https://sourceability.com/post/electronic-component-lifecycle-management-plan-beyond-the-bom", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S9", title: "Obsolescence feeds counterfeits", publisher: "Electronic Design", url: "https://www.electronicdesign.com/pai-asset/6ad23e16b65736f5c602b41d", date: "May 2026", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S10", title: "Interview: 1Buy.AI, AI procurement for the electronics supply chain", publisher: "CircuitDigest", url: "https://circuitdigest.com/interview/1buy-ai-ai-procurement-electronics-supply-chain-electronica-india-2026", date: "2026", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S11", title: "Serial unicorn founders raise ₹32.5 crore for 1Buy.AI", publisher: "Indian Startup Times", url: "https://indianstartuptimes.com/investment/serial-unicorn-founders-raise-%e2%82%b932-5-crore-for-1buy-ai-to-modernize-electronics-procurement", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S12", title: "Cofactr announcement", publisher: "Business Wire", url: "https://www.businesswire.com/news/home/20251030380894/en", date: "Oct 2025", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S13", title: "1Buy.AI secures $3.9M to reinvent electronics procurement", publisher: "AI CERTs", url: "https://www.aicerts.ai/news/?p=16347", date: "Jan 2026", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S14", title: "API", publisher: "OEMsecrets", url: "https://legacy2022.oemsecrets.com/api", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S15", title: "Global Electronic Components Distribution Sales Market Report 2026–2032", publisher: "QYResearch", url: "https://www.qyresearch.com/reports/6064729/electronic-components-distribution", date: "Mar 2026", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S16", title: "Distributor API differences", publisher: "PartFuse", url: "https://partfuse-website.pages.dev/", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S17", title: "Open market distributors", publisher: "A2 Global Electronics", url: "https://a2globalelectronics.com/?p=21684", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S18", title: "Bill of Materials (BOM) Software Global Market Report", publisher: "The Business Research Company via GII", url: "https://www.giikorea.co.kr/report/tbrc1970314-bill-material-bom-software-global-market-report.html", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S19", title: "Bill of Materials (BOM) Software Market", publisher: "Credence Research", url: "https://www.credenceresearch.com/report/bill-of-materials-bom-software-market", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S20", title: "India's EMS market could cross $150 billion by FY30: KPMG report", publisher: "IANS", url: "https://ianslive.in/indias-electronics-manufacturing-services-market-could-cross-150-billion-by-fy30-report--20260608143353", date: "8 Jun 2026", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S21", title: "KPMG EMS report coverage (plus Multibagg summary)", publisher: "India Shipping News", url: "https://indiashippingnews.com/?p=87359", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S22", title: "Demand for electronic components expected to reach $240 billion", publisher: "Entrepreneur India", url: "https://www.entrepreneur.com/en-in/news-and-trends/demand-for-electronic-components-expected-to-reach-240/476022", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S23", title: "EMS economics: components are ~70% of cost", publisher: "Zerodha Daily Brief", url: "https://thedailybrief.zerodha.com/i/184331969/put-on-your-cash-straps", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S24", title: "Fact sheet", publisher: "Arrow Electronics", url: "https://s24.q4cdn.com/157877092/files/doc_downloads/2025/07/Arrow_Fact_Sheet_25-07-01.pdf", date: "Jul 2025", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S25", title: "India imports nearly $40 billion in electronic components in FY26", publisher: "India Sea Trade News", url: "https://indiaseatradenews.com/india-imports-nearly-40-billion-in-electronic-components-in-fy26/", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S26", title: "Defense electronics obsolescence market", publisher: "Fortune Business Insights", url: "https://www.fortunebusinessinsights.com/defense-electronics-obsolescence-market-112861", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S27", title: "Industrial spare parts risk & obsolescence management market", publisher: "Virtue Market Research", url: "https://virtuemarketresearch.com/report/industrial-spare-parts-risk-obsolescence-management-market", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S28", title: "Rossell Techsys Q4 FY26 earnings call transcript", publisher: "NSE", url: "https://nsearchives.nseindia.com/corporate/9886945009_14052026113521_Earnings_call_transcript_Signed.pdf", date: "May 2026", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S29", title: "Rossell Techsys revenue surges 87% to ₹485 crore", publisher: "Free Press Journal", url: "https://www.freepressjournal.in/business/rossell-techsys-revenue-surges-87-to-485-crore-q4-profit-rises-9", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S30", title: "Rossell Techsys posts record Q1 with 78% revenue surge", publisher: "TipRanks", url: "https://www.tipranks.com/news/company-announcements/rossell-techsys-posts-record-q1-with-78-revenue-surge-and-strong-order-pipeline", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S31", title: "Rossell Techsys Q1 revenue rises to ₹154 crore", publisher: "Sahi", url: "https://www.sahi.com/news/rossell-techsys-q1-revenue-rises-to-154-crore-vs-87-crore-yoy-1129506-PE1_", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S32", title: "Electronics Components Manufacturing Scheme", publisher: "Vision IAS", url: "https://visionias.in/current-affairs/monthly-magazine/2026-03-31/economy/electronics-components-manufacturing-scheme", date: "Mar 2026", accessed: "7–10 Nov 2026", group: "market" },
  { id: "S33", title: "Rossell Techsys company profile", publisher: "Dealroom", url: "https://app.dealroom.co/companies/rossell_techsys", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S34", title: "ROSSTECH.NS profile", publisher: "ROIC.ai", url: "https://www.roic.ai/quote/ROSSTECH.NS/classic", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S35", title: "Defying Limits", publisher: "Rossell Techsys", url: "https://rosselltechsys.com/defying-limits/", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S36", title: "Rossell Techsys (Reuters items)", publisher: "Zerodha Markets (Reuters items)", url: "https://zerodha.com/markets/stocks/NSE/ROSSTECH/", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S37", title: "Rossell Techsys receives Boeing Global Supplier of the Year award for 2019", publisher: "Business Wire", url: "https://www.businesswire.com/news/home/20200826005738/pt", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S38", title: "Lockheed Martin supplier recognition", publisher: "JM Financial", url: "https://www.jmfinancialservices.in/market-news-and-insights/1655044", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S39", title: "Rossell Techsys posts ₹185.5 Cr Q2 revenue, PBT rises 89%", publisher: "BW Businessworld", url: "https://www.businessworld.in/article/rossell-techsys-posts-rs-185-5-cr-q2-revenue-pbt-rises-89-632577", date: "7 Nov 2026", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S40", title: "Rossell Techsys Q2 profit jumps to ₹9.66 crore", publisher: "Whalesbook", url: "https://www.whalesbook.com/corporate-news/English/technology/Rossell-Techsys-Q2-Profit-Jumps-to-Rs-966-Crore-on-Rising-Revenue/6aed8ac9c6c6dccbb9168234", date: "6 Nov 2026", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S41", title: "H1 revenue rises 60% as EBITDA margin reaches 15.3%", publisher: "Multibagg", url: "https://www.multibagg.ai/market-pulse/articles/rossell-techsys-h1-margin-expansion-ppt-cmw4qwzzm001sxk2rj83s159e", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S42", title: "Rossell Techsys raises ₹300 crore; SBI joins shareholder base", publisher: "Multibagg", url: "https://www.multibagg.ai/market-pulse/articles/rossell-techsys-raises-300-crore-ppt-cmw4qx0zp001txk2r3iifsjjb", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S43", title: "Q2 FY27 earnings call recording available", publisher: "Multibagg", url: "https://www.multibagg.ai/market-pulse/articles/rossell-techsys-q2-call-recording-cmw7mgbgb001n2mpha6atujm0", date: "Nov 2026", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S44", title: "Rossell Techsys consolidated financials and announcements", publisher: "Screener.in", url: "https://www.screener.in/company/ROSSTECH/consolidated/", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S45", title: "Rossell Techsys reports consistent growth; Q4 strongest quarter", publisher: "Aviation & Defence Universe", url: "https://www.aviation-defence-universe.com/rossell-techsys-reports-consistent-growth-q4-emerges-as-strongest-quarter-in-company-history/", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S46", title: "AS9100 build-to-print and FAI triggers; build-to-print custom wire harnesses", publisher: "Fabcon; Cord Master Engineering (Plant Automation Technology)", url: "https://fabcon.com/articles/?p=1110", accessed: "7–10 Nov 2026", group: "domain" },
  { id: "S47", title: "Supply chain in aerospace", publisher: "Instrumentation (WireMasters, IATA data)", url: "https://instrumentation.co.uk/supply-chain-in-aerospace/", accessed: "7–10 Nov 2026", group: "industry-forces" },
  { id: "S48", title: "The impact of supply chain disruptions on defense electronics manufacturing", publisher: "Altium", url: "https://resources.altium.com/p/supply-chain-disruptions-defense-electronics-manufacturing", date: "Apr 2026", accessed: "7–10 Nov 2026", group: "industry-forces" },
  { id: "S49", title: "Lam Research: strong numbers, limited upside surprise", publisher: "XTB", url: "https://www.xtb.com/int/market-analysis/news-and-research/lam-research-strong-numbers-limited-upside-surprise", date: "22 Oct 2026", accessed: "7–10 Nov 2026", group: "industry-forces" },
  { id: "S50", title: "Lam Research: CY27 WFE outlook exceeds $200bn; CY26 ~$150bn", publisher: "Newsquawk", url: "https://www.newsquawk.com/headlines/earnings-call-lam-research-lrcx-says-its-preliminary-cy27-wafer-fabrication-equipment-outlook-exceeds-usd-200bln-exp-cy26-usd-150bln-driven-by-dram-nand-and-foundrylogic-demand", accessed: "7–10 Nov 2026", group: "industry-forces" },
  { id: "S51", title: "Status of the Wafer Fab Equipment Industry 2026", publisher: "Yole Group", url: "https://www.yolegroup.com/product/report/status-of-the-wafer-fab-equipment-industry-2026/", accessed: "7–10 Nov 2026", group: "industry-forces" },
  { id: "S52", title: "DELMIAworks (formerly IQMS) software review 2026", publisher: "Capterra", url: "https://www.capterra.com/p/103908/IQMS-ERP-Software/", accessed: "7–10 Nov 2026", group: "systems" },
  { id: "S53", title: "DELMIAworks Manufacturing ERP reviews", publisher: "G2", url: "https://www.g2.com/products/delmiaworks-formerly-iqms/reviews", accessed: "7–10 Nov 2026", group: "systems" },
  { id: "S54", title: "API Report Card: IQMS (DELMIAworks)", publisher: "Supergood", url: "https://supergood.ai/api-report-card/iqms-delmiaworks", date: "Jul 2026", accessed: "7–10 Nov 2026", group: "systems" },
  { id: "S55", title: "DELMIAworks reviews", publisher: "GetApp", url: "https://www.getapp.fr/software/103011/iqms-erp-software", accessed: "7–10 Nov 2026", group: "systems" },
  { id: "S56", title: "Clear to Build reporting", publisher: "LeanDNA", url: "https://www.leandna.com/?p=22701", accessed: "7–10 Nov 2026", group: "systems" },
  { id: "S57", title: "Overview of Work Order Material Availability", publisher: "Oracle Docs", url: "https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/25a/faumm/overview-of-work-order-material-availability.html", accessed: "7–10 Nov 2026", group: "systems" },
  { id: "S58", title: "Production Shortage Report", publisher: "Cin7 Help", url: "https://help.core.cin7.com/hc/en-us/articles/9034521051535-Production-Shortage-Report", accessed: "7–10 Nov 2026", group: "systems" },
  { id: "S59", title: "Rossell Techsys FY26 revenue surges 86.84%; debt jumps 67%", publisher: "Whalesbook", url: "https://www.whalesbook.com/corporate-news/English/industrial-goodsservices/Rossell-Techsys-FY26-Revenue-Surges-8684percent-on-Strong-Orders-Debt-Jumps-67percent/6a01dba8707d23e8444f5a27", accessed: "7–10 Nov 2026", group: "rossell" },
  { id: "S60", title: "2024 Annual Report", publisher: "ERAI", url: "https://www.erai.com/erai_blog/3187/2024_annual_report", accessed: "10 Nov 2026", group: "domain" },
  { id: "S61", title: "Compare plans", publisher: "Nexar", url: "https://nexar.com/compare-plans", accessed: "10 Nov 2026", group: "domain" },
  { id: "S62", title: "Aerospace Wiring Harness Market", publisher: "Global Market Insights", url: "https://www.gminsights.com/industry-analysis/aerospace-wiring-harness-market", accessed: "10 Nov 2026", group: "market" },
  { id: "S63", title: "Aerospace & Defense Wire Harness Market", publisher: "The Insight Partners via GII", accessed: "10 Nov 2026", group: "market" },
  { id: "S64", title: "Centre clears 31 electronics components manufacturing proposals worth ₹7,877 crore", publisher: "ThePrint", url: "https://theprint.in/india/centre-clears-31-electronics-components-manufacturing-proposals-worth-7877-crore/3017631/", date: "Aug 2026", accessed: "10 Nov 2026", group: "market" },
  { id: "S65", title: "Govt proposes duty exemption on aircraft parts, raw materials for defence MRO sector", publisher: "Outlook Business", url: "https://www.outlookbusiness.com/budget/govt-proposes-duty-exemption-on-aircraft-parts-raw-materials-for-defence-mro-sector", date: "Feb 2026", accessed: "10 Nov 2026", group: "market" },
  { id: "S66", title: "India DAP 2026 release", publisher: "Airforce Technology", url: "https://www.airforce-technology.com/news/india-dap-2026-release/", accessed: "10 Nov 2026", group: "market" },
  { id: "S67", title: "DRAM memory shortage 2026: pricing, lead times", publisher: "Findchips (Supplyframe)", url: "https://blog.findchips.com/dram-memory-shortage-2026-pricing-lead-times-where-to-buy/", date: "Jun 2026", accessed: "10 Nov 2026", group: "industry-forces" },
  { id: "S68", title: "IQMS", publisher: "Wikipedia", url: "https://en.wikipedia.org/wiki/IQMS", date: "2019", accessed: "10 Nov 2026", group: "systems" },
  { id: "S69", title: "DELMIAworks 2026 update", publisher: "DELMIAworks blog", url: "https://blogs.solidworks.com/delmiaworks/delmiaworks-2026-update-precision-control-and-scalability-for-modern-manufacturing/", date: "16 Jan 2026", accessed: "10 Nov 2026", group: "systems" },
  { id: "S70", title: "Leadership Team", publisher: "Rossell Techsys", url: "https://rosselltechsys.com/leadership-team/", accessed: "10 Nov 2026", group: "people" },
  { id: "S71", title: "About Us", publisher: "Rossell Techsys", url: "https://rosselltechsys.com/about-us/", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S72", title: "News & Events", publisher: "Rossell Techsys", url: "https://rosselltechsys.com/news-events/", date: "3 Nov 2026", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S73", title: "Rossell Techsys Q1 results: PBT surges 139%", publisher: "ScanX", url: "https://scanx.trade/stock-market-news/companies/rossell-techsys-q1-results-pbt-surges-139-to-9-6-crore/46796211", date: "Jul 2026", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S74", title: "Rossell Techsys unveils Calibration and Metrology Lab", publisher: "Airframer", url: "https://www.airframer.com/news/release/88543", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S75", title: "Rossell India reply on demerger and listing", publisher: "NSE", url: "https://nsearchives.nseindia.com/corporate/ROSSELLIND_19122024150837_REPLY_NSE_17122024.pdf", date: "Dec 2024", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S76", title: "Company website (capabilities, platforms, client logos)", publisher: "Rossell Techsys", url: "https://rosselltechsys.com/", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S77", title: "Demerger boosts Rossell Techsys' defence, space ambitions", publisher: "Business Standard", url: "https://business-standard.com/external-affairs-defence-security/news/demerger-boosts-rossell-techsys-defence-space-ambitions-md-rishab-gupta-125010700823_1.html", date: "Jan 2025", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S78", title: "Rossell Techsys appoints Senthil Balasubramanian as CEO", publisher: "Machinist", url: "https://machinist.in/tag/karnataka/page/14/", date: "18 Aug 2025", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S79", title: "Rossell Techsys eyes bigger role in defence aircraft, targets 15% platform share", publisher: "Reuters via Stockopedia", url: "https://www.stockopedia.com/share-prices/rossell-techsys-NSI:ROSSTECH/news/india-apos-s-rossell-techsys-eyes-bigger-role-in-defence-aircraft-targets-15-platform-share-019e69d2-66c0-7336-bd12-15551ddabd93/", date: "Jul 2025", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S80", title: "MH-60R EWIS contract (Nov 2021); T-7A IDIQ (Feb 2022); The Week: Rossell bets big on India's defence boom (Mar 2026)", publisher: "Business Wire", url: "https://www.businesswire.com/news/home/20211110006132/en", date: "Nov 2021", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S81", title: "Rossell Techsys Inc", publisher: "Rossell Techsys", url: "https://rosselltechsys.com/rossell-techsys-inc/", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S82", title: "Outstanding Supplier Recognition from Lockheed Martin at the 10th Suppliers Conference", publisher: "ThePrint (ANI)", url: "https://theprint.in/ani-press-releases/rossell-techsys-ltd-receives-outstanding-supplier-recognition-from-lockheed-martin-at-the-10th-lockheed-martin-suppliers-conference/2396130", date: "Dec 2024", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S83", title: "Value / Certificates", publisher: "Rossell Techsys", url: "https://rosselltechsys.com/value/", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S84", title: "Rossell Techsys announces facility expansion in Bengaluru", publisher: "The Machine Maker", url: "https://themachinemaker.com/news/rossell-techsys-announces-facility-expansion-in-bengaluru-to-meet-growing-demand/", date: "Aug 2025", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S85", title: "₹300 crore fundraise plan", publisher: "DSIJ", url: "https://insights.dsij.in/dsijarticledetail/defence-tech-stock-alert-rs-300-crore-fundraise-plan-to-fuel-growth-push", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S86", title: "SBI Fund allotment", publisher: "Multibagg", url: "https://www.multibagg.ai/market-pulse/articles/rossell-techsys-sbi-fund-allotment-cmw4jka4c00382pp14grcxkf6", date: "3 Nov 2026", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S87", title: "Kotak Mahindra MF acquires 18,47,117 shares via bulk deal", publisher: "DSIJ", url: "https://insights.dsij.in/hi/dsijarticledetail/kotak-mahindra-mutual-fund-acquires-1847117-equity-shares-in-this-multibagger-defence-aerospace-company-promoters-sell-equivalent-stake-via-bulk-deal-58731", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S88", title: "Rossell Techsys plans 210,000 sq ft capacity addition", publisher: "Machinist", url: "https://machinist.in/2026/02/rossell-techsys-plans-210000-sq-ft-manufacturing-capacity-addition-as-semiconductor-and-space-orders-scale-up/", date: "Feb 2026", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S89", title: "Press release: Boeing IDIQ contract for T-7A electrical panel assemblies", publisher: "NSE", url: "https://nsearchives.nseindia.com/corporate/9886945009_22092025100807_press_release.pdf", date: "22 Sep 2025", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S90", title: "Repeat order for electrical wire harness from international defence client", publisher: "WireNet", url: "https://wirenet.org/industry-news/rossell-techsys-receives-repeat-order-for-electrical-wire-harness-manufacturing-from-international-defence-client/", date: "6 May 2026", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S91", title: "Rossell Techsys initiates ₹70 cr capacity expansion", publisher: "Arihant Capital", url: "https://www.arihantcapital.com/company-information/companynewsdetails/24315010096", date: "Nov 2025", accessed: "10 Nov 2026", group: "rossell" },
  { id: "S92", title: "Q4 revenue surges 61% amid ₹30 Cr facility expansion plan", publisher: "Sahi", url: "https://www.sahi.com/news/rossell-techsys-q4-revenue-surges-61-to-1-42b-amid-30cr-facility-expansion-plan-1129506-PE1_", date: "May 2026", accessed: "10 Nov 2026", group: "rossell" },
];

export const internalSources: Source[] = [
  {
    id: "WS",
    title: "Notes – RMIG.xlsx: working-session notes on Rossell (report inventory, domains, organisation, plants, regions, requirements, allocation rules)",
    publisher: "Project team (working sessions with Rossell SCM, planning and IT teams)",
    date: "9 Nov 2026",
    accessed: "9 Nov 2026",
    group: "internal",
  },
  {
    id: "FILES",
    title: "RossellTechSys File Catalogue & Business Meaning (working reference: availability, direction, scope and meaning of the 16 reports) and Rossell's column-clarification workbooks for seven reports (column names, meanings, review priorities, questions and answers)",
    publisher: "Project team with Rossell (column sheets from Rossell, extracts dated 12 and 15 Oct 2026)",
    date: "Nov 2026",
    accessed: "12 Nov 2026",
    group: "internal",
  },
  {
    id: "RULES",
    title: "Engineering, BOM and Demand Processing — Business Rules & Logical Design (§1–§12: BOM identity, revisions, upload, consolidation, customer mapping, demand sources, forecast exclusion, consolidation, net demand, auditability), working design specification",
    publisher: "Project team",
    date: "7 Nov 2026",
    accessed: "7 Nov 2026",
    group: "internal",
  },
  {
    id: "DECK-SC",
    title: "Rossell Techsys – Supply Chain Research Deck (domain, industry, company, actors & workflows, opportunities)",
    publisher: "Project team",
    date: "Nov 2026",
    accessed: "11 Nov 2026",
    group: "internal",
  },
  {
    id: "DECK-RESEARCH",
    title: "Your supply chain, from BOM to clear-to-build (BOM-to-Component Sourcing research deck, prepared for Rossell leadership)",
    publisher: "Project team",
    date: "Nov 2026",
    accessed: "11 Nov 2026",
    group: "internal",
  },
  {
    id: "RESEARCH",
    title: "BOM-to-Component Sourcing — Domain, Market, Rossell Techsys, Actors & Workflows (detailed research document, incl. Appendix A glossary)",
    publisher: "Project team",
    date: "10 Nov 2026",
    accessed: "11 Nov 2026",
    group: "internal",
  },
  {
    id: "INFO",
    title: "Rossell business lifecycle (7 stages) with Net Demand and Engineering & BOM rules (docs/info.md)",
    publisher: "Project team",
    date: "Nov 2026",
    accessed: "11 Nov 2026",
    group: "internal",
  },
];

/** Sources cited only inside the decks (deck p. 9–12, 14–17, 28). No URLs in our documents. */
export const deckSources: Source[] = [
  { id: "D-iata", title: "Aircraft order backlog (18,000+) and supply-chain outlook; supply gap lasting to 2031–34", publisher: "IATA", date: "Jun 2026", group: "industry-forces" },
  { id: "D-semi", title: "SEMI Year-End Equipment Forecast; 300mm fab equipment outlook ($145B 2026F → $156B 2027; 300mm $149B 2026 → $227B 2029)", publisher: "SEMI", date: "Dec 2025", group: "market" },
  { id: "D-mod-pib", title: "India defence production ₹1.78 lakh Cr in FY26 (+15.6%); defence exports ₹38,424 Cr (+62.7%)", publisher: "PIB / Ministry of Defence", date: "Apr–Jun 2026", group: "market" },
  { id: "D-og-analysis", title: "Aerospace wiring harness market: US$8.1B (2026), 5.8% CAGR to US$12.7B by 2034", publisher: "OG Analysis", group: "market" },
  { id: "D-insight-partners", title: "A&D wire harness market: US$12.68B by 2034", publisher: "The Insight Partners", group: "market" },
  { id: "D-wherefour", title: "Manufacturers name inventory management (59%) and scheduling (46%) as top bottlenecks", publisher: "Wherefour", date: "2026", group: "industry-forces" },
  { id: "D-talking-logistics", title: "Half of supply-chain leaders cite poor forecasting and planning as the main cause of excess stock", publisher: "Talking Logistics", date: "Jun 2026", group: "industry-forces" },
  { id: "D-quess", title: "India defence tech: US$7.6B (2025) → US$19B by 2030", publisher: "Quess Corp", group: "market" },
  { id: "D-gea", title: "India A&D electronics demand: US$70–72B over a decade", publisher: "Global Electronics Association", group: "market" },
  { id: "D-cyient-dlm-ipo", title: "Cyient DLM IPO notes (competitor set incl. SFO Technologies)", publisher: "Cyient DLM IPO documents / notes", group: "competitors" },
  { id: "D-emsnow", title: "EMS company profiles (Cyient DLM, Kaynes, SFO, Syrma SGS, Avalon)", publisher: "EMSNow", group: "competitors" },
  { id: "D-univest", title: "Peer comparison notes", publisher: "Univest", group: "competitors" },
  { id: "D-reuters-2025", title: "Global aerospace players increasingly source parts from India", publisher: "Reuters", date: "2025", group: "industry-forces" },
  { id: "D-gurufocus", title: "Rossell Techsys Q2 FY27 earnings call coverage", publisher: "GuruFocus", date: "Nov 2026", group: "rossell" },
  { id: "D-tickertape", title: "Rossell Techsys Q4 FY26 call coverage", publisher: "Tickertape", date: "2026", group: "rossell" },
  { id: "D-muthoot", title: "Rossell Techsys note (customers and programs)", publisher: "Muthoot Securities", group: "rossell" },
  { id: "D-askfuzz", title: "Rossell Techsys Q1 FY26 revenue (₹87.0 Cr)", publisher: "askfuzz", group: "rossell" },
  { id: "D-tijori", title: "Rossell Techsys quarterly results", publisher: "Zerodha / Tijori", group: "rossell" },
  { id: "D-nclt", title: "Rossell demerger filings (NCLT order, cost of acquisition)", publisher: "NSE / BSE filings", group: "rossell" },
];

/** The hand-curated base list (research markdown, internal inputs, deck-only sources). */
export const baseSources: Source[] = [...appendixBSources, ...internalSources, ...deckSources];

/** Every content/sources-<topic>.ts list, merged after the base list. */
export const researchSourceLists: Source[][] = [peopleSources, competitorsSources, scaleSources, suppliersSources, assetSources, peoplePhotoSources, clientLogoSources, orgLogoSources];

/** Union of lists, de-duplicated by id (the first occurrence wins). */
export function mergeSources(...lists: Source[][]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const list of lists) {
    for (const s of list ?? []) {
      if (!s?.id || seen.has(s.id)) continue;
      seen.add(s.id);
      out.push(s);
    }
  }
  return out;
}

/** The registry: base list + all web-research lists. Cite / SourcePopover / the Sources chapter read this. */
export const sources: Source[] = mergeSources(baseSources, ...researchSourceLists);

/** Display order and labels for source groups (Sources chapter). */
export const sourceGroupOrder: SourceGroup[] = [
  "rossell",
  "market",
  "domain",
  "industry-forces",
  "systems",
  "competitors",
  "suppliers",
  "people",
  "internal",
  "imagery",
];

export const sourceGroupLabel: Record<SourceGroup, string> = {
  rossell: "Rossell filings & coverage",
  market: "Market",
  domain: "Domain & tools",
  "industry-forces": "Industry forces",
  systems: "Systems",
  competitors: "Competitors",
  suppliers: "Suppliers",
  people: "People",
  internal: "Internal inputs",
  imagery: "Image credits",
};

/** Secondary URLs cited inside the same Appendix B entry. */
export const sourceExtraUrls: Record<string, string[]> = {
  S21: ["https://www.multibagg.ai/market-pulse/articles/india-ems-market-150bn-fy30-cmq8e3m4e5iburv0jwsavq067"],
  S46: ["https://www.plantautomation-technology.com/products/cord-master-engineering/custom-wire-harness"],
  S64: ["https://www.onmanorama.com/upsc/current-affairs/2026/08/18/explained-electronics-component-manufacturing-scheme-ecms.html"],
  S65: ["https://www.grantthornton.in/en/insights/articles/beyond-rate-changes-real-indirect-tax-story-union-budget-2026/"],
  S79: ["https://www.theweek.in/wire-updates/business/2024/12/12/dcm56-rossell-techsys-ltd..html"],
  S80: ["https://www.businesswire.com/news/home/20220222006323/it", "https://www.theweek.in/news/defence/2026/03/30/rossell-techsys-bets-big-on-indias-defence-boom-targets-rapid-scale-up.html"],
  S86: ["https://nsearchives.nseindia.com/corporate/9886945009_26102026185253_corp_announcement.pdf", "https://nsearchives.nseindia.com/corporate/9886945009_10112025101941_press_release_fundraise.pdf"],
  S88: ["https://machinist.in/?p=8222"],
};

/** Caveats attached to a source in the research markdown. */
export const sourceNotes: Record<string, string> = {
  S1: "Vendor-sponsored survey: Fuld & Co / Accuris Electronic Parts Intelligence Survey, Mar 2026, N=439.",
  S2: "2022 Lifecycle Insights EDfR study (41%); the sourcing link is Siemens' framing.",
  S3: "The 4 → 16 week lead-time jump is an illustrative example, not a measured statistic.",
  S5: "Risk score 0–100.",
  S9: "Page blocks automated fetching; see S60 for the primary data.",
  S10: "Unaudited company claims.",
  S11: "Unaudited company claims.",
  S13: "Unaudited company claims.",
  S15: "Page could not be re-loaded to re-verify the figures.",
  S17: "Broker's own article, undated and unsourced.",
  S22: "CII report, via Entrepreneur (Jun 2024).",
  S25: "CRISIL data.",
  S27: "Figures not visible on the public page; unverified.",
  S40: "Total financial indebtedness ₹450.23 Cr at 30 Sep 2026 is indicative only.",
  S42: "Inventory 7.98 → 6.7 months; Aerospace Park facility 'expected to start operations shortly'.",
  S43: "Only an audio recording of the Q2 FY27 call (posted 7 Nov 2026) is available; no transcript yet.",
  S44: "Borrowings ~₹495 Cr at Sep-26 are indicative only.",
  S45: "New DTA unit: single source, not re-confirmed.",
  S53: "Individual reviews; treat as anecdotal.",
  S63: "Report code TIP2123901 (giiresearch.com); no direct URL in our notes.",
  S64: "106 approvals, ₹69,548 Cr investment (Aug 2026); ECMS notified 8 Apr 2025.",
  S66: "Draft DAP 2026; DAP 2020 still in force as of Sep 2026.",
  S72: "15-year anniversary and new facility, 3 Nov 2026; Honeywell award 2023; 100,000 Boeing deliveries 2022.",
  S73: "Order book ₹800 Cr at 30 Jun 2026; semiconductor OEM onboarded in Q1 FY27.",
  S84: "Headcount 680 → ~950 (Aug 2025).",
  S85: "FY26 balance sheet and cash flow.",
  WS: "Internal working-session material. Names and titles to be confirmed with Rossell.",
  RULES: "Internal draft; agreed so far but still to be formalised.",
};

const byId = new Map(sources.map((s) => [s.id, s]));

export function getSource(id: string): Source | undefined {
  return byId.get(id);
}

/** Every source id that some content module cites must resolve here. */
export function hasSource(id: string): boolean {
  return byId.has(id);
}
