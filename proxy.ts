import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, gateSecret, safeNext, verifyGateToken } from "@/lib/gate";

// Password gate (Next 16 "proxy", formerly middleware): every page needs a valid signed cookie.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const ok = await verifyGateToken(request.cookies.get(GATE_COOKIE)?.value, gateSecret());

  if (pathname === "/gate") {
    if (ok) {
      const url = request.nextUrl.clone();
      url.pathname = safeNext(request.nextUrl.searchParams.get("next"));
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (ok) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/gate";
  url.search = "";
  if (pathname !== "/") url.searchParams.set("next", pathname + search);
  const res = NextResponse.redirect(url);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: [
    // Everything except Next internals, the gate API, and static metadata/public assets.
    "/((?!_next/static|_next/image|api/gate|favicon.ico|icon.svg|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|ttf|glb|gltf|json|txt)$).*)",
  ],
};
