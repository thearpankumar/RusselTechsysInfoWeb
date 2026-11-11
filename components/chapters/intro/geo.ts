// Shared globe geometry: Fibonacci-sphere sampling, land-mask decoding and projections.
// Pure functions; safe in server and client modules.

export const GLOBE_POINTS = 14000;

/** Devanahalli, Bengaluru (Hi-Tech Defence & Aerospace Park). */
export const BENGALURU = { lat: 13.24, lng: 77.71 } as const;

export interface ArcTarget {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

/** Export markets the arcs fly to (see content/footprint.ts for shares and sources). */
export const ARC_TARGETS: ArcTarget[] = [
  { id: "tempe", label: "USA · Tempe, AZ", lat: 33.43, lng: -111.94 },
  { id: "israel", label: "Israel", lat: 32.0, lng: 34.8 },
  { id: "europe", label: "Europe", lat: 50.5, lng: 4.5 },
  { id: "se-asia", label: "SE Asia", lat: 3.1, lng: 101.7 },
];

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const DEG = Math.PI / 180;

/** Lat/lng (degrees) of the i-th of n evenly spread Fibonacci-sphere points. */
export function fibonacciLatLng(i: number, n: number): [number, number] {
  const y = 1 - ((i + 0.5) / n) * 2;
  const lat = Math.asin(y) / DEG;
  let lng = ((i * GOLDEN) / DEG) % 360;
  if (lng > 180) lng -= 360;
  return [lat, lng];
}

/** Unit vector for lat/lng: lng 0 faces +z, east is +x, north is +y. */
export function latLngToXYZ(lat: number, lng: number, r = 1): [number, number, number] {
  const la = lat * DEG;
  const lo = lng * DEG;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
}

/** Decode a base64 bitmask into the land point indices. */
export function decodeMask(b64: string): number[] {
  const bin = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const out: number[] = [];
  for (let byte = 0; byte < bin.length; byte++) {
    const v = bin.charCodeAt(byte);
    if (!v) continue;
    for (let bit = 0; bit < 8; bit++) if (v & (1 << bit)) out.push(byte * 8 + bit);
  }
  return out;
}

/** Orthographic projection centred on (lat0, lng0). Returns [x, y, visible] in unit-disc coordinates (y down). */
export function orthographic(lat: number, lng: number, lat0: number, lng0: number): [number, number, boolean] {
  const la = lat * DEG;
  const lo = lng * DEG;
  const la0 = lat0 * DEG;
  const lo0 = lng0 * DEG;
  const cosc = Math.sin(la0) * Math.sin(la) + Math.cos(la0) * Math.cos(la) * Math.cos(lo - lo0);
  const x = Math.cos(la) * Math.sin(lo - lo0);
  const y = Math.cos(la0) * Math.sin(la) - Math.sin(la0) * Math.cos(la) * Math.cos(lo - lo0);
  return [x, -y, cosc > 0];
}
