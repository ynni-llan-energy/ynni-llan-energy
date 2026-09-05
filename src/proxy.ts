import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { NextAuthRequest } from "next-auth";
import { wholeSiteFlag } from "./flags";

// Routes that require a valid session
const PROTECTED_PREFIXES = ["/aelodau", "/gweinyddu"];
// Routes that should redirect authenticated users to the dashboard
const AUTH_ROUTES = ["/ymuno", "/mewngofnodi"];

const WIP_PAGE = "/coming-soon";
const WIP_BYPASS_PREFIXES = [WIP_PAGE, "/api"];

// Wrapped in Auth.js's `auth()` (rather than calling it with no arguments,
// which relies on next/headers' cookies() and only works inside the App
// Router request context, not Proxy) so `request.auth` is populated from a
// database session lookup keyed off the request's own cookie header before
// this callback runs — the direct equivalent of the old Supabase
// getUser() round-trip.
export default auth(async (request: NextAuthRequest) => {
  const { pathname } = request.nextUrl;

  // WIP mode: show coming-soon page until the 'whole-site' flag is on.
  if (!WIP_BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    const siteOpen = await wholeSiteFlag();
    if (!siteOpen) {
      return NextResponse.redirect(new URL(WIP_PAGE, request.url));
    }
  }

  const isAuthed = !!request.auth?.user;

  // Protect member-area routes
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!isAuthed) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/mewngofnodi";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect already-authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthed) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/aelodau";
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Exclude static assets, images, and the Sanity Studio route
    "/((?!_next/static|_next/image|favicon.ico|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
