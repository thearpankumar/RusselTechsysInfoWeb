// Password-gate helpers (Web Crypto only, so they run in proxy, route handlers and any runtime).

export const GATE_COOKIE = "rt_gate";
export const GATE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const enc = new TextEncoder();

function b64url(buf: ArrayBuffer): string {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Secret used to sign the cookie: SITE_SECRET, falling back to SITE_PASSCODE. */
export function gateSecret(): string | undefined {
  return process.env.SITE_SECRET || process.env.SITE_PASSCODE || undefined;
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Token = "<issuedAtSeconds>.<hmac>". */
export async function signGateToken(secret: string, now = Date.now()): Promise<string> {
  const iat = Math.floor(now / 1000).toString();
  return `${iat}.${await hmac(secret, `rt-gate.v1.${iat}`)}`;
}

export async function verifyGateToken(token: string | undefined, secret: string | undefined, now = Date.now()): Promise<boolean> {
  if (!token || !secret) return false;
  const [iat, sig] = token.split(".");
  if (!iat || !sig || !/^\d+$/.test(iat)) return false;
  const age = now / 1000 - Number(iat);
  if (age < -60 || age > GATE_MAX_AGE) return false;
  return safeEqual(sig, await hmac(secret, `rt-gate.v1.${iat}`));
}

/** Compare a submitted passcode with SITE_PASSCODE without leaking length/timing (compares HMAC digests). */
export async function passcodeMatches(input: string, expected: string): Promise<boolean> {
  const k = "rt-gate-compare";
  return safeEqual(await hmac(k, input), await hmac(k, expected));
}

/** Only allow same-site relative redirect targets. */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  if (next.startsWith("/gate") || next.startsWith("/api/")) return "/";
  return next;
}
