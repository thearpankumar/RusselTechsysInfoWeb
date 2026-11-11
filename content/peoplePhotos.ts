// Leadership and board portraits, taken from Rossell Techsys' own website (leadership and board pages),
// cropped to 4:5, toned to the site's warm monochrome and served from /public/images/people/.
// Keys are person ids (content/people.ts) or board ids (board-*) for directors without a person record.
import type { Source } from "./types";

export const PEOPLE_PHOTO_SOURCE = { leadership: "IMG-RT-LEADERSHIP", board: "IMG-RT-BOARD" } as const;

const leadershipIds = [
  "rishab-mohan-gupta",
  "senthil-balasubramanian",
  "zeena-philip",
  "nagasundaram-narayanaswamy",
  "louis-pereira",
  "jayanth-vishwanath",
  "daniel-m-varagunasingh",
  "anand-dhandapani",
  "rakesh-kumar",
  "manian-rajaram",
  "roseanne-joseph",
  "ajosh-elias-mathew",
  "vipina-vijayan",
  "krishnappayya-desai",
] as const;

const boardIds = ["harsh-mohan-gupta", "board-arvind-ghei", "board-talari-suvarna-raju", "board-shobhana-joshi", "board-digant-parikh"] as const;

export interface PersonPhoto {
  src: string;
  width: number;
  height: number;
  sourceId: string;
}

export const peoplePhotos: Record<string, PersonPhoto> = Object.fromEntries([
  ...leadershipIds.map((id) => [id, { src: `/images/people/${id}.webp`, width: 480, height: 600, sourceId: PEOPLE_PHOTO_SOURCE.leadership }]),
  ...boardIds.map((id) => [id, { src: `/images/people/${id}.webp`, width: 480, height: 600, sourceId: PEOPLE_PHOTO_SOURCE.board }]),
]);

export function photoFor(...ids: (string | undefined)[]): PersonPhoto | undefined {
  for (const id of ids) if (id && peoplePhotos[id]) return peoplePhotos[id];
  return undefined;
}

export const peoplePhotoSources: Source[] = [
  {
    id: PEOPLE_PHOTO_SOURCE.leadership,
    title: "Portraits: leadership team",
    publisher: "Rossell Techsys Ltd · company website, leadership page",
    url: "https://rosselltechsys.com/leadership/",
    accessed: "11 Nov 2026",
    group: "imagery",
  },
  {
    id: PEOPLE_PHOTO_SOURCE.board,
    title: "Portraits: board of directors",
    publisher: "Rossell Techsys Ltd · company website, board of directors page",
    url: "https://rosselltechsys.com/investor-relations/board-of-directors/",
    accessed: "11 Nov 2026",
    group: "imagery",
  },
];
