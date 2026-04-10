import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { wholeSiteFlag } from "./flags";

// Routes that require a valid session
const PROTECTED_PREFIXES = ["/aelodau"];
// Routes that should redirect authenticated users to the dashboard
const AUTH_ROUTES = ["/ymuno", "/mewngofnodi"];

const WIP_PAGE = "/coming-soon";
const WIP_BYPASS_PREFIXES = [WIP_PAGE, "/api"];

export async function proxy(request: NextRequest) {
  // WIP mode: show coming-soon page until the 'whole-site' flag is on.
  // Toggle the flag in the Vercel Flags dashboard — no deployment needed.
  const { pathname } = request.nextUrl;
  if (!WIP_BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    const siteOpen = await wholeSiteFlag();
    if (!siteOpen) {
      return NextResponse.redirect(new URL(WIP_PAGE, request.url));
    }
  }

  // If Supabase isn't configured yet, pass every request straight through.
  // This prevents a 500 on all routes (including the draft-mode preview
  // endpoint) when NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are not set.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  // If Supabase isn't configured (e.g. preview deploys without env vars set),
  // pass through without auth so the app still renders rather than 500-ing.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — must not call any other supabase.auth methods between
  // createServerClient and getUser() to avoid token-refresh races.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect member-area routes
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/mewngofnodi";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect already-authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (user) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/aelodau";
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Exclude static assets, images, and the Sanity Studio route
    "/((?!_next/static|_next/image|favicon.ico|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
