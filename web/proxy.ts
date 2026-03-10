import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

const LANDING_DOMAIN =
  process.env.NEXT_PUBLIC_LANDING_URL?.replace(/^https?:\/\//, "") ?? "";
const AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH_URL?.replace(/^https?:\/\//, "") ?? "";

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;

  // --- izeat.leopoldev.com → landing ---
  if (LANDING_DOMAIN && hostname === LANDING_DOMAIN) {
    return NextResponse.rewrite(new URL(pathname, request.url));
  }

  // --- izeat.auth.leopoldev.com → auth ---
  if (AUTH_DOMAIN && hostname === AUTH_DOMAIN) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/sign-in", request.url));
    }
    return NextResponse.rewrite(new URL(pathname, request.url));
  }

  // --- izeat.app.leopoldev.com → dashboard (guard existant) ---
  if (pathname.startsWith("/dashboard")) {
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("[proxy]", pathname, "→ session:", session ? "✅" : "❌ null");
    if (!session) {
      const authBase = process.env.NEXT_PUBLIC_AUTH_URL ?? "/sign-in";
      return NextResponse.redirect(new URL("/sign-in", authBase));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|menu).*)"],
};
