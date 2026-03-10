import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LANDING_DOMAIN =
  process.env.NEXT_PUBLIC_LANDING_URL?.replace(/^https?:\/\//, "") ?? "";
const AUTH_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH_URL?.replace(/^https?:\/\//, "") ?? "";

function hasSessionCookie(request: NextRequest): boolean {
  return (
    request.cookies.has("__Secure-better-auth.session_token") ||
    request.cookies.has("better-auth.session_token")
  );
}

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

  // --- izeat.app.leopoldev.com → dashboard (guard) ---
  if (pathname.startsWith("/dashboard")) {
    if (!hasSessionCookie(request)) {
      const authBase = process.env.NEXT_PUBLIC_AUTH_URL ?? "";
      return NextResponse.redirect(new URL("/sign-in", authBase || request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|menu).*)"],
};
