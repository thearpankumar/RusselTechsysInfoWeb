import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, GATE_MAX_AGE, gateSecret, passcodeMatches, safeNext, signGateToken } from "@/lib/gate";

/** POST { passcode } (JSON or form) → sets the signed httpOnly gate cookie. */
export async function POST(request: NextRequest) {
  const expected = process.env.SITE_PASSCODE;
  const secret = gateSecret();
  if (!expected || !secret) {
    return NextResponse.json({ ok: false, error: "Site passcode is not configured." }, { status: 500 });
  }

  let passcode = "";
  let next = "/";
  const type = request.headers.get("content-type") ?? "";
  // Plain HTML form posts (before hydration) get redirects instead of JSON.
  const isForm = !type.includes("application/json");
  try {
    if (type.includes("application/json")) {
      const body = (await request.json()) as { passcode?: unknown };
      passcode = typeof body.passcode === "string" ? body.passcode : "";
    } else {
      const form = await request.formData();
      passcode = String(form.get("passcode") ?? "");
      next = safeNext(String(form.get("next") ?? "/"));
    }
  } catch {
    passcode = "";
  }

  if (!(await passcodeMatches(passcode.trim(), expected))) {
    await new Promise((r) => setTimeout(r, 400)); // slow down guessing
    if (isForm) {
      const back = new URL("/gate", request.url);
      back.searchParams.set("error", "1");
      if (next !== "/") back.searchParams.set("next", next);
      return NextResponse.redirect(back, 303);
    }
    return NextResponse.json({ ok: false, error: "That passcode did not match." }, { status: 401 });
  }

  const res = isForm ? NextResponse.redirect(new URL(next, request.url), 303) : NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, await signGateToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE,
  });
  return res;
}

/** DELETE → clears the gate cookie (sign out). */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(GATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
