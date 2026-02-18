import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDashboardStatus } from "@/lib/get-dashboard-status";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/app/dashboard")) {
    return NextResponse.next();
  }

  try {
    const status = await getDashboardStatus();
    const { step, restaurantId, checks } = status;

    if (step === "NO_RESTAURANT") {
      if (pathname !== "/app/dashboard") {
        return NextResponse.redirect(new URL("/app/dashboard", request.url));
      }
      return NextResponse.next();
    }

    if (!checks.hasMenu) {
      const menusPath = `/app/dashboard/${restaurantId}/menus`;
      if (!pathname.startsWith(menusPath) && pathname !== "/app/dashboard") {
        return NextResponse.redirect(new URL(menusPath, request.url));
      }
      return NextResponse.next();
    }

    if (!checks.hasTable) {
      const tablesPath = `/app/dashboard/${restaurantId}/tables`;
      if (
        pathname !== tablesPath &&
        pathname !== "/app/dashboard" &&
        !pathname.startsWith(`/app/dashboard/${restaurantId}/menus`) &&
        !pathname.startsWith(`/app/dashboard/${restaurantId}/ingredients`)
      ) {
        return NextResponse.redirect(new URL(tablesPath, request.url));
      }
      return NextResponse.next();
    }

    if (checks.isServiceReady && pathname === "/app/dashboard") {
      return NextResponse.redirect(
        new URL(`/app/dashboard/${restaurantId}/service`, request.url),
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
