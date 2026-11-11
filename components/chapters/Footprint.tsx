// 04 · Footprint: plants and offices on a dot-matrix world map, export lanes, floor-area growth.
import { ChapterShell } from "@/components/journey/ChapterShell";
import { markets, sites } from "@/content/footprint";
import { getWorldMap } from "./footprint/worldMap";
import { FootprintBody } from "./footprint/FootprintBody";

export default function Footprint() {
  const map = getWorldMap([
    ...sites.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng })),
    ...markets.map((m) => ({ id: `market-${m.id}`, lat: m.lat, lng: m.lng })),
  ]);
  return (
    <ChapterShell
      id="footprint"
      statement="One airport-side campus, a small US arm, and customers on three continents."
      lead="Everything is built in Devanahalli, beside Bengaluru's airport, and almost all of it is exported by air. The campus has grown from a 4,000 sq ft start to more than 450,000 sq ft with the unit opened this month."
    >
      <FootprintBody map={map} />
    </ChapterShell>
  );
}
