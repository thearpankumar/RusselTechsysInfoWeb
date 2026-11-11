// Server-side (build / first request) land sampling for the dot-matrix globe.
// Uses dotted-map's country shapes once, then ships only a ~2 KB bitmask to the client.
// Import only from server components (app/gate/page.tsx, components/chapters/Intro.tsx).
import DottedMap from "dotted-map";
import { GLOBE_POINTS, fibonacciLatLng } from "./geo";

let cached: string | null = null;

/** Base64 bitmask: bit i set = Fibonacci point i (of GLOBE_POINTS) falls on land. */
export function getLandMask(): string {
  if (cached) return cached;
  const map = new DottedMap({ height: 120, grid: "vertical", projection: { name: "equirectangular" } });
  const land = new Set(map.getPoints().map((p) => `${p.x},${p.y}`));
  const bytes = new Uint8Array(Math.ceil(GLOBE_POINTS / 8));
  for (let i = 0; i < GLOBE_POINTS; i++) {
    const [lat, lng] = fibonacciLatLng(i, GLOBE_POINTS);
    const pin = map.getPin({ lat, lng });
    if (pin && land.has(`${pin.x},${pin.y}`)) bytes[i >> 3] |= 1 << (i & 7);
  }
  cached = Buffer.from(bytes).toString("base64");
  return cached;
}
