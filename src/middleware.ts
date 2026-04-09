import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WIP_PAGE = "/coming-soon";

// Paths that bypass the WIP redirect
const BYPASS_PREFIXES = [
  WIP_PAGE,
  "/studio",
  "/api",
  "/_next",
  "/favicon.ico",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(WIP_PAGE, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
