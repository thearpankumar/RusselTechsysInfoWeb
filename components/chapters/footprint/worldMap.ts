// Server-side dot-matrix world map (dotted-map, Robinson projection). Computed once per server process,
// i.e. at build time for the static page. Import only from server components.
import DottedMap from "dotted-map";

export interface WorldMapData {
  width: number;
  height: number;
  /** Every land dot as a zero-length path segment ("Mx yh0"), drawn with round caps. */
  dotsPath: string;
  /** Snapped map positions for requested ids. */
  pins: Record<string, { x: number; y: number }>;
}

let cache: { map: DottedMap; dotsPath: string } | null = null;

export function getWorldMap(points: { id: string; lat: number; lng: number }[]): WorldMapData {
  if (!cache) {
    const map = new DottedMap({ height: 64, grid: "diagonal", projection: { name: "robinson" } });
    const dotsPath = map
      .getPoints()
      .map((p) => `M${+p.x.toFixed(2)} ${+p.y.toFixed(2)}h0`)
      .join("");
    cache = { map, dotsPath };
  }
  const { map, dotsPath } = cache;
  const pins: WorldMapData["pins"] = {};
  for (const p of points) {
    const pin = map.getPin({ lat: p.lat, lng: p.lng });
    if (pin) pins[p.id] = { x: pin.x, y: pin.y };
  }
  const anyMap = map as unknown as { width: number; height: number };
  return { width: anyMap.width, height: anyMap.height, dotsPath, pins };
}
