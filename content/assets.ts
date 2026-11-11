// Photo assets: metadata, credits and intended placement.
// Every photo is public domain (US federal government work) or openly licensed (CC BY / CC BY-SA)
// and comes from Wikimedia Commons. Files in public/images/ are pre-processed by us:
// cropped to 3:2, 1600px wide, converted to a warm monochrome duotone (#121111 → #D6D4CE, highlights held below warm white so photos never glare) and saved as WebP.
// None of these photos shows Rossell's own facility or product: captions say how each relates.
// Credits are listed in the Sources chapter through content/sources-assets.ts (group "imagery").

export type Licence = "Public domain" | "CC BY 2.0" | "CC BY-SA 2.0" | "CC BY-SA 3.0";

export interface Placement {
  /** Chapter id from lib/chapters.ts. */
  chapter: string;
  /** Suggested section within the chapter. */
  section: string;
  /** What the photo stands for in that section. */
  subject: string;
}

export interface PhotoAsset {
  id: string;
  /** Path under /public. */
  src: string;
  width: number;
  height: number;
  /** Screen-reader description of what is visible. */
  alt: string;
  /** Short name shown on the photo (body-lg 500). */
  title: string;
  /** Short role line under the name on the photo (body-sm), e.g. "Boeing · EWIS harnesses". */
  caption: string;
  /** One sentence saying how the subject relates to Rossell (for overlays and figure captions). */
  context: string;
  /** Mono credit line shown under the photo. */
  credit: string;
  author: string;
  licence: Licence;
  licenceUrl?: string;
  /** Wikimedia Commons file page (the source of record). */
  sourceUrl: string;
  /** Source id in content/sources-assets.ts (for <Cite>). */
  sourceId: string;
  /** Where the photo is meant to go (the content/UX agent places it). */
  intendedPlacement: Placement[];
}

const W = 1600;
const H = 1067;

export const photoAssets: PhotoAsset[] = [
  {
    id: "t7a-red-hawk",
    src: "/images/t7a-red-hawk.webp",
    width: W,
    height: H,
    alt: "A T-7A Red Hawk jet trainer in flight over the desert at Edwards Air Force Base.",
    title: "Boeing T-7A Red Hawk",
    caption: "Boeing · T-7A harnesses and panels",
    context: "Trainer jet. Rossell builds T-7A wire harnesses and electrical panel assemblies for Boeing.",
    credit: "U.S. Air Force photo by Bryce Bennett · Public domain · via Wikimedia Commons",
    author: "Bryce Bennett, U.S. Air Force",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:T-7A_Red_Hawk_over_Edwards_Air_Force_Base.jpg",
    sourceId: "IMG-t7a",
    intendedPlacement: [
      { chapter: "clients", section: "programs", subject: "T-7A Red Hawk (Boeing)" },
      { chapter: "what-they-do", section: "domains", subject: "Aerospace domain (alternative)" },
      { chapter: "growth", section: "orders", subject: "T-7A panels IDIQ (up to 1,200 shipsets to 2033)" },
    ],
  },
  {
    id: "ah64e-apache",
    src: "/images/ah64e-apache.webp",
    width: W,
    height: H,
    alt: "A U.S. Army AH-64E Apache attack helicopter rising over a hillside during training.",
    title: "Boeing AH-64E Apache",
    caption: "Boeing · harnesses and panels",
    context: "Attack helicopter. Rossell supplies wire harnesses and electrical panels for the AH-64.",
    credit: "U.S. Army photo by Capt. Jesse Paulsboe · Public domain · via Wikimedia Commons",
    author: "Capt. Jesse Paulsboe, U.S. Army",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:AH-64E_Apache_of_16th_CAB_in_flight_at_Yakima_Training_Center_in_2012.jpg",
    sourceId: "IMG-ah64",
    intendedPlacement: [
      { chapter: "clients", section: "programs", subject: "AH-64 Apache (Boeing)" },
      { chapter: "what-they-do", section: "domains", subject: "Defence domain (alternative)" },
    ],
  },
  {
    id: "mh60r-seahawk",
    src: "/images/mh60r-seahawk.webp",
    width: W,
    height: H,
    alt: "A U.S. Navy MH-60R Seahawk helicopter flying low over the sea.",
    title: "Sikorsky MH-60R Seahawk",
    caption: "Lockheed Martin · MH-60R EWIS",
    context: "Naval helicopter. Rossell builds MH-60R EWIS for Lockheed Martin, for the Indian Navy's aircraft.",
    credit: "U.S. Navy photo by MC3 Chris Bartlett · Public domain · via Wikimedia Commons",
    author: "Mass Communication Specialist 3rd Class Chris Bartlett, U.S. Navy",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:MH-60R_Seahawk_of_HSM-75_in_flight_2013.JPG",
    sourceId: "IMG-mh60r",
    intendedPlacement: [
      { chapter: "clients", section: "programs", subject: "MH-60R Seahawk (Lockheed Martin)" },
      { chapter: "what-they-do", section: "domains", subject: "Defence domain (alternative)" },
    ],
  },
  {
    id: "p8a-poseidon",
    src: "/images/p8a-poseidon.webp",
    width: W,
    height: H,
    alt: "A U.S. Navy P-8A Poseidon maritime patrol aircraft taxiing on a runway.",
    title: "Boeing P-8A Poseidon",
    caption: "Boeing · EWIS harnesses",
    context: "Maritime patrol aircraft, one of the Boeing programs Rossell supplies EWIS harnesses for.",
    credit: "U.S. Navy photo by Lt. Sara Wedemeyer · Public domain · via Wikimedia Commons",
    author: "Lt. Sara Wedemeyer, U.S. Navy",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:P-8A_Poseidon_Executes_Training_Flight_(9341127).jpg",
    sourceId: "IMG-p8a",
    intendedPlacement: [{ chapter: "clients", section: "programs", subject: "P-8 Poseidon (Boeing)" }],
  },
  {
    id: "fa18-harness-install",
    src: "/images/fa18-harness-install.webp",
    width: W,
    height: H,
    alt: "A U.S. Navy aviation mechanic installing a wire harness inside the canopy of an F/A-18E Super Hornet.",
    title: "A harness going into an F/A-18E",
    caption: "Industry example · not Rossell's part",
    context: "A wire harness being installed on an F/A-18E Super Hornet canopy: the kind of part Rossell builds.",
    credit: "U.S. Navy photo by MC3 Bradley Evans · Public domain · via Wikimedia Commons",
    author: "Mass Communication Specialist 3rd Class Bradley Evans, U.S. Navy",
    licence: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:US_Navy_100622-N-6604E-025_Aviation_Structural_Mechanic_(Equipment)_2nd_Class_Stephen_Bessette_installs_a_wire_harness_on_a_replacement_canopy_for_an_F-A-18E_Super_Hornet.jpg",
    sourceId: "IMG-fa18",
    intendedPlacement: [
      { chapter: "anatomy", section: "finished-goods", subject: "EWIS harness in its aircraft" },
      { chapter: "clients", section: "programs", subject: "F/A-18 Super Hornet (Boeing)" },
    ],
  },
  {
    id: "harness-board",
    src: "/images/harness-board.webp",
    width: W,
    height: H,
    alt: "A black-and-white archive photo of an aircraft wiring harness laid out and laced on an assembly board.",
    title: "A harness on its board",
    caption: "Industry example · archive photo",
    context: "An aircraft wiring harness laid out on its assembly board, with connectors at the branch ends.",
    credit: "San Diego Air & Space Museum Archives (Convair) · No known copyright restrictions · via Wikimedia Commons",
    author: "San Diego Air & Space Museum Archives",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:23_0073628_Convair_Negative_Image_-_Wiring_harness_(54267303647).jpg",
    sourceId: "IMG-board",
    intendedPlacement: [{ chapter: "anatomy", section: "intro", subject: "What a harness is: wires routed and laced on a board" }],
  },
  {
    id: "d38999-connector",
    src: "/images/d38999-connector.webp",
    width: W,
    height: H,
    alt: "A MIL-DTL-38999 circular connector plug and its mating receptacle.",
    title: "MIL-DTL-38999 connector",
    caption: "Industry example · plug and receptacle",
    context: "A MIL-DTL-38999 circular connector, the mil-spec workhorse at the ends of aerospace harnesses.",
    credit: "Photo by Abaillieul · CC BY-SA 3.0 · via Wikimedia Commons",
    author: "Abaillieul",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:38999_connector_nickel-teflon.jpg",
    sourceId: "IMG-38999",
    intendedPlacement: [{ chapter: "anatomy", section: "parts", subject: "Connector part (part overlay)" }],
  },
  {
    id: "semiconductor-cleanroom",
    src: "/images/semiconductor-cleanroom.webp",
    width: W,
    height: H,
    alt: "Technicians in cleanroom suits working at process tools inside a semiconductor cleanroom.",
    title: "Inside a semiconductor cleanroom",
    caption: "Illustrative · chip-making tools",
    context: "Chip-making tools like these carry the harnesses Rossell builds for semiconductor equipment makers.",
    credit: "Photo uploaded by Duk · Public domain · via Wikimedia Commons",
    author: "Wikimedia Commons user Duk",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Clean_room.jpg",
    sourceId: "IMG-fab",
    intendedPlacement: [
      { chapter: "what-they-do", section: "domains", subject: "Semiconductor domain (alternative)" },
      { chapter: "clients", section: "semiconductor", subject: "Semiconductor equipment OEMs" },
    ],
  },
  {
    id: "spacecraft-cleanroom",
    src: "/images/spacecraft-cleanroom.webp",
    width: W,
    height: H,
    alt: "Technicians in cleanroom suits preparing NASA's CloudSat spacecraft for launch.",
    title: "A satellite in final preparation",
    caption: "Illustrative · NASA CloudSat",
    context: "A satellite in a cleanroom. Illustrative of space work; not Rossell's customer or harness.",
    credit: "NASA photo · Public domain · via Wikimedia Commons",
    author: "NASA",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:CloudSat_at_Vandenberg_AFB.jpg",
    sourceId: "IMG-space",
    intendedPlacement: [{ chapter: "what-they-do", section: "domains", subject: "Space domain (alternative)" }],
  },
  {
    id: "aircraft-wiring-a320",
    src: "/images/aircraft-wiring-a320.webp",
    width: W,
    height: H,
    alt: "Bundles of laced aircraft wiring and connector blocks running behind the cockpit of an Airbus A320, opened up during heavy maintenance.",
    title: "Wiring behind an airliner cockpit",
    caption: "Industry example · not Rossell's part",
    context: "EWIS in place: harness bundles and connectors behind an A320 cockpit. Illustrative of what an aerospace harness becomes; not a Rossell part or customer.",
    credit: "Photo by Ikiwaner · CC BY-SA 3.0 · via Wikimedia Commons (cropped, toned)",
    author: "Ikiwaner",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Kabelbaum_A320.jpeg",
    sourceId: "IMG-a320-wiring",
    intendedPlacement: [{ chapter: "what-they-do", section: "overview", subject: "Aerospace domain card" }],
  },
  {
    id: "mh60r-avionics-tech",
    src: "/images/mh60r-avionics-tech.webp",
    width: W,
    height: H,
    alt: "A U.S. Navy aviation electronics technician connecting cables while installing an amplifier on an MH-60R Seahawk in a ship's hangar bay.",
    title: "Avionics work on an MH-60R",
    caption: "Industry example · U.S. Navy",
    context: "A technician connecting cables on an MH-60R, the helicopter Rossell builds EWIS for (via Lockheed Martin). The aircraft shown is a U.S. Navy one, not Rossell's work.",
    credit: "U.S. Navy photo by MC1 Ryre Arciaga · Public domain · via Wikimedia Commons",
    author: "Mass Communication Specialist 1st Class Ryre Arciaga, U.S. Navy",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:USS_Preble_(DDG_88)_MH-60R_Sea_Hawk_Maintenance_(8833673).jpg",
    sourceId: "IMG-mh60r-avionics",
    intendedPlacement: [{ chapter: "what-they-do", section: "overview", subject: "Defence domain card" }],
  },
  {
    id: "wafer-fab-tool",
    src: "/images/wafer-fab-tool.webp",
    width: W,
    height: H,
    alt: "A wafer-processing tool in a semiconductor cleanroom, its frame crowded with cables, gas lines and vacuum hoses, with a technician in a cleanroom suit beside it.",
    title: "A process tool in a cleanroom",
    caption: "Illustrative · wafer-fab equipment",
    context: "Wafer-processing tools carry dense internal cabling: the kind of harness Rossell builds for semiconductor equipment makers. Not a Rossell customer's tool.",
    credit: "Photo by Esquilo · CC BY-SA 3.0 · via Wikimedia Commons (cropped, toned)",
    author: "Esquilo",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Electrumlab_Maskin01.jpg",
    sourceId: "IMG-fab-tool",
    intendedPlacement: [{ chapter: "what-they-do", section: "overview", subject: "Semiconductor domain card" }],
  },
  {
    id: "spacecraft-harness-osam",
    src: "/images/spacecraft-harness-osam.webp",
    width: W,
    height: H,
    alt: "A NASA electrical engineer in cleanroom garb working among bundles of spacecraft wiring on the OSAM-1 servicing payload.",
    title: "Harness work on a spacecraft",
    caption: "Illustrative · NASA OSAM-1",
    context: "Spacecraft harnessing in a NASA cleanroom. Illustrative of space work; not Rossell's customer or harness.",
    credit: "NASA photo by Mike Guinto · Public domain · via Wikimedia Commons",
    author: "Michael Guinto, NASA Goddard Space Flight Center",
    licence: "Public domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:NASA_Goddard_Space_Flight_Center_(GSFC_20240819_OSAM1_064439).jpg",
    sourceId: "IMG-space-harness",
    intendedPlacement: [{ chapter: "what-they-do", section: "overview", subject: "Space domain card" }],
  },
];

export function getPhoto(id: string): PhotoAsset | undefined {
  return photoAssets.find((p) => p.id === id);
}

/** Domain → photo, for domain cards and overlays. */
export const DOMAIN_PHOTO: Record<"aerospace" | "defence" | "semiconductor" | "space", string> = {
  aerospace: "aircraft-wiring-a320",
  defence: "mh60r-avionics-tech",
  semiconductor: "wafer-fab-tool",
  space: "spacecraft-harness-osam",
};

/** Program strip for the Clients chapter, in order. */
export const PROGRAM_PHOTOS: string[] = ["t7a-red-hawk", "ah64e-apache", "mh60r-seahawk", "p8a-poseidon"];
