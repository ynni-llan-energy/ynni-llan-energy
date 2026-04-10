import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { wholeSiteFlag } from "./flags";

const PROTECTED_PREFIXES = ["/aelodaeth", "/members", "/pleidleisio", "/votes"];

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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/mewngofnodi"; // Welsh: "log in"
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Exclude static assets, images, and the Sanity Studio route
    "/((?!_next/static|_next/image|favicon.ico|studio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
