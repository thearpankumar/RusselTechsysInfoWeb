// Harness materials and the illustrative 96-line BOM.
// Rossell's actual BOM categories and suppliers are NOT public (research gap G2). Everything typed
// "industry-example" is a typical aerospace-harness example, not confirmed as Rossell's.
import type { BomLine, IllustrativeBom, Material } from "./types-extra";

const IND = "industry-example" as const;
const C6 = ["S76", "DECK-SC"]; // C6 "Likely BOM profile" in the research doc is [Inference]; deck shows the BOM shape

export const materials: Material[] = [
  {
    id: "wire-mil",
    name: "Mil-spec hook-up wire",
    category: "wire",
    whatItIs: "Single copper conductor (usually silver- or nickel-plated) with a thin, tough insulation such as cross-linked ETFE or PTFE/polyimide.",
    whatItDoes: "Carries power or a signal from one connector to another. Hundreds of individually numbered wires make up one harness.",
    typicalSpec: ["SAE AS22759 / M22759 (e.g. M22759/16, /32, /34)", "MIL-W-81381 (legacy polyimide)"],
    exampleMakers: ["TE Connectivity (Raychem)", "Carlisle Interconnect", "Harbour Industries"],
    uom: "FT",
    harnessPart: "wire",
    sources: C6,
    confidence: IND,
  },
  {
    id: "cable-shielded",
    name: "Shielded & jacketed multi-conductor cable",
    category: "wire",
    whatItIs: "Two or more insulated wires twisted together, wrapped in a metal braid shield and an outer jacket. Includes coaxial cable for RF.",
    whatItDoes: "Carries sensitive signals (data buses, sensors) while blocking electrical noise from nearby wires and radar.",
    typicalSpec: ["SAE AS27500 / M27500", "MIL-DTL-17 (coax)"],
    exampleMakers: ["TE Connectivity", "Carlisle Interconnect", "Gore"],
    uom: "FT",
    harnessPart: "cable",
    sources: C6,
    confidence: IND,
  },
  {
    id: "connector-38999",
    name: "Circular connector",
    category: "connector",
    whatItIs: "A round, metal-shelled plug or receptacle holding a pattern of pins or sockets; locks with a threaded or bayonet coupling ring.",
    whatItDoes: "Lets a harness plug into an avionics box, a panel or another harness, and be unplugged for maintenance. Sealed against fuel, water and vibration.",
    typicalSpec: ["MIL-DTL-38999 Series I–IV", "MIL-DTL-26482", "MIL-DTL-5015"],
    exampleMakers: ["Amphenol", "TE Connectivity (Deutsch)", "Glenair", "ITT Cannon", "Souriau-Sunbank (Eaton)"],
    uom: "EA",
    harnessPart: "connector",
    sources: C6,
    confidence: IND,
  },
  {
    id: "connector-rect",
    name: "Rectangular connector (D-sub, micro-D, rack-and-panel)",
    category: "connector",
    whatItIs: "Flat, rectangular connectors with rows of contacts; micro-D versions are tiny.",
    whatItDoes: "Connects harnesses to circuit boards and LRUs (line-replaceable units) where space is tight.",
    typicalSpec: ["MIL-DTL-24308 (D-sub)", "MIL-DTL-83513 (micro-D)", "ARINC 600 / MIL-DTL-83527 (rack & panel)"],
    exampleMakers: ["Glenair", "ITT Cannon", "Amphenol", "Omnetics"],
    uom: "EA",
    harnessPart: "connector-rect",
    sources: C6,
    confidence: IND,
  },
  {
    id: "contact",
    name: "Crimp contacts (pins & sockets), sealing plugs",
    category: "contact",
    whatItIs: "Small gold-plated metal pins and sockets crimped onto each wire end and pushed into the connector insert. Sealing plugs fill unused holes.",
    whatItDoes: "Makes the actual electrical joint. A big connector can hold 100+ contacts: these are the highest-count line items in most harness BOMs.",
    typicalSpec: ["SAE AS39029 / M39029", "MS27488 (sealing plugs)"],
    exampleMakers: ["TE Connectivity", "Amphenol", "Glenair", "Radiall"],
    uom: "EA",
    harnessPart: "contact",
    sources: C6,
    confidence: IND,
  },
  {
    id: "terminal",
    name: "Ring terminals & ground lugs",
    category: "contact",
    whatItIs: "Crimped metal rings or lugs on wire ends.",
    whatItDoes: "Bolts a wire to a stud or to the airframe for grounding and bonding.",
    typicalSpec: ["SAE AS7928 / MS25036", "NAS1836 (ground studs)"],
    exampleMakers: ["TE Connectivity (AMP)", "Panduit"],
    uom: "EA",
    harnessPart: "terminal",
    sources: C6,
    confidence: IND,
  },
  {
    id: "backshell",
    name: "Backshells, strain reliefs, dust caps",
    category: "backshell",
    whatItIs: "Machined metal fittings that screw onto the back of a connector, plus protective caps for the front.",
    whatItDoes: "Grips the wire bundle so pulling it does not damage contacts, terminates the cable shield for EMI protection, and turns the bundle (straight, 45°, 90°).",
    typicalSpec: ["SAE AS85049", "MIL-DTL-38999 accessories"],
    exampleMakers: ["Glenair", "Amphenol", "Souriau-Sunbank (Eaton)", "Tri-Star"],
    uom: "EA",
    harnessPart: "backshell",
    sources: C6,
    confidence: IND,
  },
  {
    id: "heatshrink",
    name: "Heat-shrink sleeving & moulded boots",
    category: "protection",
    whatItIs: "Plastic tubing (and pre-shaped boots) that shrinks tight when heated.",
    whatItDoes: "Seals and insulates joints, splices and connector backs; boots give a watertight transition from connector to bundle.",
    typicalSpec: ["AMS-DTL-23053", "SAE AS81765 (moulded parts)"],
    exampleMakers: ["TE Connectivity (Raychem)", "HellermannTyton", "Hellermann (DR-25)"],
    uom: "FT",
    harnessPart: "heatshrink",
    sources: C6,
    confidence: IND,
  },
  {
    id: "sleeving",
    name: "Braided & convoluted protective sleeving",
    category: "protection",
    whatItIs: "Expandable braided or ribbed tubing slid over the bundle.",
    whatItDoes: "Protects the wires from rubbing (chafing) against structure, heat and fluids: chafing is a leading cause of wiring faults in aircraft.",
    typicalSpec: ["SAE AS23190 / MIL-DTL-81914 type", "Nomex / PEEK braids"],
    exampleMakers: ["Federal-Mogul (Tenneco)", "Glenair", "Techflex"],
    uom: "FT",
    harnessPart: "sleeving",
    sources: C6,
    confidence: IND,
  },
  {
    id: "clamp",
    name: "Cushioned loop clamps & ties",
    category: "clamp",
    whatItIs: "Metal loops with a rubber cushion, bolted to the airframe; high-temperature cable ties.",
    whatItDoes: "Hold the harness on its route through the aircraft every few inches so it does not vibrate or sag.",
    typicalSpec: ["SAE AS21919 (formerly MS21919)", "SAE AS33671 (ties)"],
    exampleMakers: ["Eaton", "HellermannTyton", "Panduit"],
    uom: "EA",
    harnessPart: "clamp",
    sources: C6,
    confidence: IND,
  },
  {
    id: "splice",
    name: "Splices & solder sleeves",
    category: "splice",
    whatItIs: "Environment-resistant crimp splices and heat-shrink solder sleeves.",
    whatItDoes: "Joins two or more wires in the middle of a run, or connects a cable's shield to a ground wire.",
    typicalSpec: ["SAE AS81824 (splices)", "SAE AS83519 (solder sleeves)"],
    exampleMakers: ["TE Connectivity (Raychem)", "Daburn"],
    uom: "EA",
    harnessPart: "splice",
    sources: C6,
    confidence: IND,
  },
  {
    id: "marker",
    name: "Wire markers, sleeves & identification labels",
    category: "identification",
    whatItIs: "Printable heat-shrink sleeves and labels carrying wire numbers and harness IDs.",
    whatItDoes: "Lets a mechanic find a single wire among thousands, years later; required for traceability.",
    typicalSpec: ["SAE AS5942 / AS81531 (marking)", "AMS-DTL-23053 based marker sleeves"],
    exampleMakers: ["TE Connectivity (Raychem)", "HellermannTyton", "Brady"],
    uom: "EA",
    harnessPart: "marker",
    sources: C6,
    confidence: IND,
  },
  {
    id: "shield-braid",
    name: "Overall shielding braid",
    category: "shielding",
    whatItIs: "Woven tinned- or nickel-plated copper mesh over a whole bundle.",
    whatItDoes: "A Faraday cage for the wires: protects against lightning-induced currents and electromagnetic interference.",
    typicalSpec: ["A-A-59569 (QQ-B-575 legacy)", "Nickel-plated copper per customer spec"],
    exampleMakers: ["Glenair", "Alpha Wire"],
    uom: "FT",
    harnessPart: "braid",
    sources: C6,
    confidence: IND,
  },
  {
    id: "lacing",
    name: "Lacing tape & spot ties",
    category: "lacing",
    whatItIs: "Flat waxed polyester or Nomex tape tied in knots around the bundle.",
    whatItDoes: "Holds the wires together in a neat, round bundle and forms the branch points; the traditional aircraft alternative to cable ties.",
    typicalSpec: ["A-A-52080 / A-A-52081 (lacing tape)"],
    exampleMakers: ["Gudebrod", "Western Filament"],
    uom: "FT",
    harnessPart: "lacing",
    sources: C6,
    confidence: IND,
  },
  {
    id: "grommet",
    name: "Grommets & edging",
    category: "grommet",
    whatItIs: "Rubber or nylon rings and edge strips.",
    whatItDoes: "Line the holes in bulkheads and panels so the harness can pass through without being cut by a metal edge.",
    typicalSpec: ["NAS1368 / MS35489 type", "SAE AS21266 (edging)"],
    exampleMakers: ["Essentra", "HellermannTyton"],
    uom: "EA",
    harnessPart: "grommet",
    sources: C6,
    confidence: IND,
  },
  {
    id: "fibre-terminus",
    name: "Fibre-optic termini",
    category: "fibre",
    whatItIs: "Precision ceramic-ferrule contacts that hold the end of a glass fibre inside a connector.",
    whatItDoes: "Align two fibres to within microns so light passes across the connector with minimal loss.",
    typicalSpec: ["MIL-PRF-29504", "ARINC 801", "MIL-PRF-64266 (expanded beam)"],
    exampleMakers: ["Glenair", "Amphenol", "TE Connectivity", "Radiall"],
    uom: "EA",
    harnessPart: "fibre-terminus",
    sources: ["S76", "S73"],
    confidence: IND,
    note: "Rossell does fibre-optic harnesses (reported); the specific termini are industry examples.",
  },
  {
    id: "fibre-cable",
    name: "Aerospace fibre-optic cable",
    category: "fibre",
    whatItIs: "Glass fibre with buffer, strength members and a tough jacket.",
    whatItDoes: "Carries high-speed data as light: lighter than copper and immune to EMI.",
    typicalSpec: ["MIL-PRF-85045", "ARINC 802"],
    exampleMakers: ["Gore", "Carlisle Interconnect", "TE Connectivity"],
    uom: "FT",
    harnessPart: "fibre",
    sources: ["S76", "S73"],
    confidence: IND,
  },
  {
    id: "electronics",
    name: "PCBs & electronic parts for assemblies",
    category: "electronics",
    whatItIs: "Bought-in circuit boards, relays, diodes, resistors, switches and breakers.",
    whatItDoes: "The 'brains' inside panels, electro-mechanical and avionics assemblies; in-line diodes/resistors sometimes sit inside a harness.",
    typicalSpec: ["IPC-A-610 Class 3 (assembly)", "MIL-PRF-39016 / MIL-PRF-83536 (relays)", "AS5553 counterfeit avoidance"],
    exampleMakers: ["TE Connectivity (relays)", "Sensata", "Vishay", "Eaton (breakers)"],
    uom: "EA",
    harnessPart: "electronics",
    sources: ["S33", "S73"],
    confidence: IND,
  },
  {
    id: "consumable",
    name: "Process consumables",
    category: "consumable",
    whatItIs: "Solder, potting compounds, adhesives, thread-lock, Kapton tape.",
    whatItDoes: "Used up during assembly; still controlled and lot-traced in aerospace.",
    typicalSpec: ["J-STD-006 (solder)", "Customer process specs"],
    exampleMakers: ["Henkel (Loctite)", "3M", "Kester"],
    uom: "EA",
    sources: C6,
    confidence: IND,
  },
];

const deckLines: BomLine[] = [
  { line: 1, partNo: "Wire", description: "Wire (as shown in the session BOM)", materialId: "wire-mil", uom: "FT", qtyPerFg: 200, sample: false, sources: ["DECK-SC", "WS"], confidence: "session" },
  { line: 2, partNo: "Component A", description: "Component A (as shown in the session BOM)", uom: "EA", qtyPerFg: 4000, sample: false, sources: ["DECK-SC", "WS"], confidence: "session" },
  { line: 3, partNo: "Component B", description: "Component B (as shown in the session BOM)", uom: "EA", qtyPerFg: 21500, sample: false, sources: ["DECK-SC", "WS"], confidence: "session" },
  { line: 4, partNo: "Component C", description: "Component C (as shown in the session BOM)", uom: "EA", qtyPerFg: 55000, sample: false, sources: ["DECK-SC", "WS"], confidence: "session" },
];

/** Lines 5–96: generated SAMPLE lines with generic, realistic harness descriptions. Not Rossell data. */
const sampleLines: BomLine[] = [
  { line: 5, partNo: "RM-SMPL-0005", description: "Wire, PTFE/polyimide, M22759/16 type, 24 AWG, white/red", materialId: "wire-mil", uom: "FT", qtyPerFg: 340, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 6, partNo: "RM-SMPL-0006", description: "Wire, PTFE/polyimide, M22759/16 type, 22 AWG, white/green", materialId: "wire-mil", uom: "FT", qtyPerFg: 335, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 7, partNo: "RM-SMPL-0007", description: "Wire, PTFE/polyimide, M22759/16 type, 20 AWG, white/red", materialId: "wire-mil", uom: "FT", qtyPerFg: 115, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 8, partNo: "RM-SMPL-0008", description: "Wire, PTFE/polyimide, M22759/16 type, 18 AWG, white/red", materialId: "wire-mil", uom: "FT", qtyPerFg: 70, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 9, partNo: "RM-SMPL-0009", description: "Wire, PTFE/polyimide, M22759/16 type, 16 AWG, white/green", materialId: "wire-mil", uom: "FT", qtyPerFg: 250, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 10, partNo: "RM-SMPL-0010", description: "Wire, PTFE/polyimide, M22759/16 type, 12 AWG, white/green", materialId: "wire-mil", uom: "FT", qtyPerFg: 175, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 11, partNo: "RM-SMPL-0011", description: "Wire, PTFE/polyimide, M22759/16 type, 22 AWG, white/blue", materialId: "wire-mil", uom: "FT", qtyPerFg: 90, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 12, partNo: "RM-SMPL-0012", description: "Wire, PTFE/polyimide, M22759/16 type, 20 AWG, white/blue", materialId: "wire-mil", uom: "FT", qtyPerFg: 65, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 13, partNo: "RM-SMPL-0013", description: "Wire, PTFE/polyimide, M22759/16 type, 24 AWG, white/green", materialId: "wire-mil", uom: "FT", qtyPerFg: 295, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 14, partNo: "RM-SMPL-0014", description: "Wire, PTFE/polyimide, M22759/16 type, 22 AWG, white/red", materialId: "wire-mil", uom: "FT", qtyPerFg: 375, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 15, partNo: "RM-SMPL-0015", description: "Cable, shielded jacketed, M27500 type, 22 AWG, 2 conductors", materialId: "cable-shielded", uom: "FT", qtyPerFg: 170, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 16, partNo: "RM-SMPL-0016", description: "Cable, shielded jacketed, M27500 type, 24 AWG, 2 conductors", materialId: "cable-shielded", uom: "FT", qtyPerFg: 20, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 17, partNo: "RM-SMPL-0017", description: "Cable, shielded jacketed, M27500 type, 22 AWG, 3 conductors", materialId: "cable-shielded", uom: "FT", qtyPerFg: 160, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 18, partNo: "RM-SMPL-0018", description: "Cable, shielded jacketed, M27500 type, 20 AWG, 2 conductors", materialId: "cable-shielded", uom: "FT", qtyPerFg: 110, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 19, partNo: "RM-SMPL-0019", description: "Cable, coaxial, M17 type, 50 ohm", materialId: "cable-shielded", uom: "FT", qtyPerFg: 35, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 20, partNo: "RM-SMPL-0020", description: "Connector, circular, MIL-DTL-38999 Series III type, shell 11, insert 35, plug", materialId: "connector-38999", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 21, partNo: "RM-SMPL-0021", description: "Connector, circular, MIL-DTL-38999 Series III type, shell 13, insert 98, plug", materialId: "connector-38999", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 22, partNo: "RM-SMPL-0022", description: "Connector, circular, MIL-DTL-38999 Series III type, shell 15, insert 19, plug", materialId: "connector-38999", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 23, partNo: "RM-SMPL-0023", description: "Connector, circular, MIL-DTL-38999 Series III type, shell 17, insert 26, plug", materialId: "connector-38999", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 24, partNo: "RM-SMPL-0024", description: "Connector, circular, MIL-DTL-38999 Series III type, shell 19, insert 35, plug", materialId: "connector-38999", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 25, partNo: "RM-SMPL-0025", description: "Connector, circular, MIL-DTL-38999 Series III type, shell 11, insert 98, plug", materialId: "connector-38999", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 26, partNo: "RM-SMPL-0026", description: "Connector, circular, MIL-DTL-38999 Series III type, shell 21, insert 41, plug", materialId: "connector-38999", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 27, partNo: "RM-SMPL-0027", description: "Connector, circular, MIL-DTL-38999 Series III type, shell 13, insert 35, plug", materialId: "connector-38999", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 28, partNo: "RM-SMPL-0028", description: "Connector, circular, MIL-DTL-38999 type, shell 11, receptacle, jam-nut", materialId: "connector-38999", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 29, partNo: "RM-SMPL-0029", description: "Connector, circular, MIL-DTL-38999 type, shell 15, receptacle, jam-nut", materialId: "connector-38999", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 30, partNo: "RM-SMPL-0030", description: "Connector, circular, MIL-DTL-38999 type, shell 17, receptacle, jam-nut", materialId: "connector-38999", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 31, partNo: "RM-SMPL-0031", description: "Connector, rectangular, MIL-DTL-24308 type (D-sub), 25 position", materialId: "connector-rect", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 32, partNo: "RM-SMPL-0032", description: "Connector, rectangular, MIL-DTL-83513 type (micro-D), 15 position", materialId: "connector-rect", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 33, partNo: "RM-SMPL-0033", description: "Contact, crimp, socket, size 22, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 17, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 34, partNo: "RM-SMPL-0034", description: "Contact, crimp, socket, size 20, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 128, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 35, partNo: "RM-SMPL-0035", description: "Contact, crimp, socket, size 16, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 93, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 36, partNo: "RM-SMPL-0036", description: "Contact, crimp, socket, size 12, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 122, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 37, partNo: "RM-SMPL-0037", description: "Contact, crimp, socket, size 24, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 60, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 38, partNo: "RM-SMPL-0038", description: "Contact, crimp, socket, size 20, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 69, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 39, partNo: "RM-SMPL-0039", description: "Contact, crimp, pin, size 22, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 47, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 40, partNo: "RM-SMPL-0040", description: "Contact, crimp, pin, size 20, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 73, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 41, partNo: "RM-SMPL-0041", description: "Contact, crimp, pin, size 16, gold plated, M39029 type", materialId: "contact", uom: "EA", qtyPerFg: 10, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 42, partNo: "RM-SMPL-0042", description: "Sealing plug, size 22, for unused cavities", materialId: "contact", uom: "EA", qtyPerFg: 10, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 43, partNo: "RM-SMPL-0043", description: "Sealing plug, size 20, for unused cavities", materialId: "contact", uom: "EA", qtyPerFg: 19, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 44, partNo: "RM-SMPL-0044", description: "Backshell, EMI/RFI, shield termination, AS85049 type, shell 11, straight", materialId: "backshell", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 45, partNo: "RM-SMPL-0045", description: "Backshell, EMI/RFI, shield termination, AS85049 type, shell 13, straight", materialId: "backshell", uom: "EA", qtyPerFg: 2, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 46, partNo: "RM-SMPL-0046", description: "Backshell, EMI/RFI, shield termination, AS85049 type, shell 15, straight", materialId: "backshell", uom: "EA", qtyPerFg: 2, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 47, partNo: "RM-SMPL-0047", description: "Backshell, EMI/RFI, shield termination, AS85049 type, shell 17, straight", materialId: "backshell", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 48, partNo: "RM-SMPL-0048", description: "Backshell, EMI/RFI, shield termination, AS85049 type, shell 19, straight", materialId: "backshell", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 49, partNo: "RM-SMPL-0049", description: "Backshell, strain relief, AS85049 type, shell 13, 90°", materialId: "backshell", uom: "EA", qtyPerFg: 2, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 50, partNo: "RM-SMPL-0050", description: "Dust cap, connector, shell 15, with lanyard", materialId: "backshell", uom: "EA", qtyPerFg: 2, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 51, partNo: "RM-SMPL-0051", description: "Heat-shrink sleeving, AMS-DTL-23053 type, 1/8\", black", materialId: "heatshrink", uom: "FT", qtyPerFg: 25, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 52, partNo: "RM-SMPL-0052", description: "Heat-shrink sleeving, AMS-DTL-23053 type, 3/16\", black", materialId: "heatshrink", uom: "FT", qtyPerFg: 10, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 53, partNo: "RM-SMPL-0053", description: "Heat-shrink sleeving, AMS-DTL-23053 type, 1/4\", black", materialId: "heatshrink", uom: "FT", qtyPerFg: 20, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 54, partNo: "RM-SMPL-0054", description: "Heat-shrink sleeving, AMS-DTL-23053 type, 3/8\", black", materialId: "heatshrink", uom: "FT", qtyPerFg: 10, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 55, partNo: "RM-SMPL-0055", description: "Heat-shrink sleeving, AMS-DTL-23053 type, 1/2\", black", materialId: "heatshrink", uom: "FT", qtyPerFg: 5, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 56, partNo: "RM-SMPL-0056", description: "Braided expandable sleeving, abrasion protection, 1/4\"", materialId: "sleeving", uom: "FT", qtyPerFg: 10, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 57, partNo: "RM-SMPL-0057", description: "Braided expandable sleeving, abrasion protection, 1/2\"", materialId: "sleeving", uom: "FT", qtyPerFg: 40, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 58, partNo: "RM-SMPL-0058", description: "Braided expandable sleeving, abrasion protection, 3/4\"", materialId: "sleeving", uom: "FT", qtyPerFg: 55, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 59, partNo: "RM-SMPL-0059", description: "Convoluted tubing, split, 1/2\"", materialId: "sleeving", uom: "FT", qtyPerFg: 5, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 60, partNo: "RM-SMPL-0060", description: "Heat-shrink moulded boot, straight, shell 15 size", materialId: "heatshrink", uom: "EA", qtyPerFg: 4, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 61, partNo: "RM-SMPL-0061", description: "Heat-shrink moulded boot, 90°, shell 13 size", materialId: "heatshrink", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 62, partNo: "RM-SMPL-0062", description: "Loop clamp, cushioned, AS21919 type, 1/4\"", materialId: "clamp", uom: "EA", qtyPerFg: 6, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 63, partNo: "RM-SMPL-0063", description: "Loop clamp, cushioned, AS21919 type, 3/8\"", materialId: "clamp", uom: "EA", qtyPerFg: 8, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 64, partNo: "RM-SMPL-0064", description: "Loop clamp, cushioned, AS21919 type, 1/2\"", materialId: "clamp", uom: "EA", qtyPerFg: 3, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 65, partNo: "RM-SMPL-0065", description: "Loop clamp, cushioned, AS21919 type, 5/8\"", materialId: "clamp", uom: "EA", qtyPerFg: 2, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 66, partNo: "RM-SMPL-0066", description: "Cable tie, high-temperature, 4\"", materialId: "clamp", uom: "EA", qtyPerFg: 107, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 67, partNo: "RM-SMPL-0067", description: "Splice, environment-resistant crimp, 26-24 AWG, AS81824 type", materialId: "splice", uom: "EA", qtyPerFg: 2, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 68, partNo: "RM-SMPL-0068", description: "Splice, environment-resistant crimp, 22-18 AWG, AS81824 type", materialId: "splice", uom: "EA", qtyPerFg: 8, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 69, partNo: "RM-SMPL-0069", description: "Splice, environment-resistant crimp, 16-14 AWG, AS81824 type", materialId: "splice", uom: "EA", qtyPerFg: 8, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 70, partNo: "RM-SMPL-0070", description: "Solder sleeve, shield termination, with ground lead", materialId: "splice", uom: "EA", qtyPerFg: 7, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 71, partNo: "RM-SMPL-0071", description: "Solder sleeve, shield termination, small", materialId: "splice", uom: "EA", qtyPerFg: 19, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 72, partNo: "RM-SMPL-0072", description: "Marker sleeve, heat-shrink, printable, white, 3/16\"", materialId: "marker", uom: "EA", qtyPerFg: 116, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 73, partNo: "RM-SMPL-0073", description: "Marker sleeve, heat-shrink, printable, white, 1/4\"", materialId: "marker", uom: "EA", qtyPerFg: 60, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 74, partNo: "RM-SMPL-0074", description: "Identification label, harness ID, polyolefin, printable", materialId: "marker", uom: "EA", qtyPerFg: 8, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 75, partNo: "RM-SMPL-0075", description: "Identification band, branch marker, yellow", materialId: "marker", uom: "EA", qtyPerFg: 6, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 76, partNo: "RM-SMPL-0076", description: "Shielding braid, tinned copper, flat, 1/4\"", materialId: "shield-braid", uom: "FT", qtyPerFg: 40, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 77, partNo: "RM-SMPL-0077", description: "Shielding braid, nickel-plated copper, tubular, 1/2\"", materialId: "shield-braid", uom: "FT", qtyPerFg: 20, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 78, partNo: "RM-SMPL-0078", description: "Lacing tape, polyester, finish D, flat", materialId: "lacing", uom: "FT", qtyPerFg: 35, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 79, partNo: "RM-SMPL-0079", description: "Lacing tape, Nomex, high-temperature", materialId: "lacing", uom: "FT", qtyPerFg: 20, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 80, partNo: "RM-SMPL-0080", description: "Grommet edging, nylon, for panel cut-outs", materialId: "grommet", uom: "FT", qtyPerFg: 5, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 81, partNo: "RM-SMPL-0081", description: "Grommet, rubber, 1/2\" ID", materialId: "grommet", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 82, partNo: "RM-SMPL-0082", description: "Ground lug, ring terminal, #10 stud, 16-14 AWG", materialId: "terminal", uom: "EA", qtyPerFg: 6, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 83, partNo: "RM-SMPL-0083", description: "Ring terminal, insulated, #8 stud, 22-18 AWG", materialId: "terminal", uom: "EA", qtyPerFg: 7, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 84, partNo: "RM-SMPL-0084", description: "Fibre-optic terminus, MIL-PRF-29504 type, multimode", materialId: "fibre-terminus", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 85, partNo: "RM-SMPL-0085", description: "Fibre-optic cable, simplex, 62.5/125 µm, aerospace grade", materialId: "fibre-cable", uom: "FT", qtyPerFg: 15, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 86, partNo: "RM-SMPL-0086", description: "Adhesive, potting compound, two-part (kit)", materialId: "consumable", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 87, partNo: "RM-SMPL-0087", description: "Thread-locking compound, connector coupling (ml)", materialId: "consumable", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 88, partNo: "RM-SMPL-0088", description: "Solder, Sn63/Pb37, flux core (g)", materialId: "consumable", uom: "EA", qtyPerFg: 20, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 89, partNo: "RM-SMPL-0089", description: "Shrink tubing, adhesive-lined, clear, 1/4\"", materialId: "heatshrink", uom: "FT", qtyPerFg: 5, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 90, partNo: "RM-SMPL-0090", description: "Spot tie / tie-wrap, lacing cord", materialId: "lacing", uom: "EA", qtyPerFg: 10, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 91, partNo: "RM-SMPL-0091", description: "Protective cap, receptacle, shell 17", materialId: "backshell", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 92, partNo: "RM-SMPL-0092", description: "Strain-relief clamp, saddle bar, shell 19", materialId: "backshell", uom: "EA", qtyPerFg: 2, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 93, partNo: "RM-SMPL-0093", description: "Diode assembly, in-line, encapsulated", materialId: "electronics", uom: "EA", qtyPerFg: 2, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 94, partNo: "RM-SMPL-0094", description: "Resistor assembly, in-line, encapsulated", materialId: "electronics", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 95, partNo: "RM-SMPL-0095", description: "Relay, hermetic, 28 V DC coil (for in-line module)", materialId: "electronics", uom: "EA", qtyPerFg: 1, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
  { line: 96, partNo: "RM-SMPL-0096", description: "Kapton tape, 1/2\", for spot protection", materialId: "consumable", uom: "FT", qtyPerFg: 10, sample: true, sources: ["DECK-SC"], confidence: "industry-example" },
];

export const illustrativeBom: IllustrativeBom = {
  fgPartNo: "001-0001-011",
  fgDescription: "Wire bundle 001-0001-011 (finished good)",
  lineCount: 96,
  lines: [...deckLines, ...sampleLines],
  rule: "All or nothing: the bundle can be built only when all 96 lines are in stock in full. 95 of 96 means zero builds, and the 95 sit idle.",
  sources: ["DECK-SC", "WS"],
  confidence: "session",
  note: "Line count, FG number and lines 1–4 are from the BOM master reviewed in working sessions (deck p.8, 'illustrative'; quantities as shown). Lines 5–96 are generated samples (sample: true), confidence industry-example.",
};

/** How many builds are possible given on-hand quantities: min over lines of floor(onHand / qtyPerFg). */
export function buildableCount(onHand: Record<number, number>, lines: BomLine[] = illustrativeBom.lines): number {
  let min = Infinity;
  for (const l of lines) {
    const have = onHand[l.line] ?? 0;
    min = Math.min(min, Math.floor(have / l.qtyPerFg));
  }
  return Number.isFinite(min) ? min : 0;
}

export const getMaterial = (id: string): Material | undefined => materials.find((m) => m.id === id);

/* ---------- Chapter 09: the twelve parts of the exploded harness ---------- */

export type HarnessPartId =
  | "wire"
  | "connector"
  | "contact"
  | "backshell"
  | "heatshrink"
  | "sleeving"
  | "braid"
  | "clamp"
  | "splice"
  | "marker"
  | "lacing"
  | "grommet";

export interface HarnessPart {
  id: HarnessPartId;
  /** Mono index "01".."12" used as the 3D label. */
  index: string;
  name: string;
  materialId: string;
  /** Plain-language "what it is". */
  whatItIs: string;
  /** What it does in the aircraft or tool. */
  whatItDoes: string;
  /** Headline spec (first of the material's typical specs). */
  spec: string;
  sources: string[];
  confidence: "industry-example";
}

const partDefs: { id: HarnessPartId; materialId: string; name: string; spec: string; whatItIs?: string; whatItDoes?: string }[] = [
  { id: "wire", materialId: "wire-mil", name: "Mil-spec wire", spec: "SAE AS22759 / M22759" },
  { id: "connector", materialId: "connector-38999", name: "Circular connector", spec: "MIL-DTL-38999 Series III" },
  { id: "contact", materialId: "contact", name: "Crimp contacts", spec: "SAE AS39029 / M39029" },
  { id: "backshell", materialId: "backshell", name: "Backshell", spec: "SAE AS85049" },
  { id: "heatshrink", materialId: "heatshrink", name: "Heat-shrink boot", spec: "AMS-DTL-23053 · SAE AS81765" },
  { id: "sleeving", materialId: "sleeving", name: "Protective sleeving", spec: "Nomex / PEEK braid, SAE AS23190 type" },
  { id: "braid", materialId: "shield-braid", name: "Shielding braid", spec: "A-A-59569 tinned / nickel-plated copper" },
  {
    id: "clamp",
    materialId: "clamp",
    name: "P-clamp",
    spec: "SAE AS21919 cushioned loop clamp",
    whatItIs: "A P-shaped metal loop lined with a rubber cushion, bolted to the airframe or tool frame.",
  },
  { id: "splice", materialId: "splice", name: "Splice", spec: "SAE AS81824 crimp splice" },
  { id: "marker", materialId: "marker", name: "ID marker sleeve", spec: "SAE AS5942 / AS81531 marking" },
  { id: "lacing", materialId: "lacing", name: "Lacing ties", spec: "A-A-52080 / A-A-52081 lacing tape" },
  { id: "grommet", materialId: "grommet", name: "Grommet", spec: "NAS1368 / MS35489 type" },
];

export const harnessParts: HarnessPart[] = partDefs.map((p, i) => {
  const m = materials.find((x) => x.id === p.materialId)!;
  return {
    id: p.id,
    index: String(i + 1).padStart(2, "0"),
    name: p.name,
    materialId: p.materialId,
    whatItIs: p.whatItIs ?? m.whatItIs,
    whatItDoes: p.whatItDoes ?? m.whatItDoes,
    spec: p.spec,
    sources: m.sources,
    confidence: "industry-example",
  };
});

export const getHarnessPart = (id: string): HarnessPart | undefined => harnessParts.find((p) => p.id === id);

/** Material catalogue filter groups (chapter 09 chips). */
export const materialGroups: { id: string; label: string; categories: Material["category"][] }[] = [
  { id: "conductors", label: "Wire & cable", categories: ["wire", "fibre"] },
  { id: "interconnect", label: "Connectors & contacts", categories: ["connector", "contact", "backshell"] },
  { id: "protection", label: "Protection & shielding", categories: ["protection", "shielding", "grommet"] },
  { id: "routing", label: "Routing & joining", categories: ["clamp", "splice", "lacing"] },
  { id: "id", label: "Identification", categories: ["identification"] },
  { id: "other", label: "Electronics & consumables", categories: ["electronics", "consumable"] },
];

export const getMaterialByHarnessPart = (part: HarnessPartId): Material | undefined =>
  materials.find((m) => m.harnessPart === part);
