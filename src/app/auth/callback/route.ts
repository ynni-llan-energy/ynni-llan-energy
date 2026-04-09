import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the OAuth and magic-link callback.
 * Supabase redirects here with a `code` query param after the user
 * authenticates with an external provider (e.g. Google).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/aelodau";

  // `next` must be a relative path to prevent open-redirect attacks
  const safeNext = next.startsWith("/") ? next : "/aelodau";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Something went wrong — redirect to login with an error flag
  return NextResponse.redirect(`${origin}/mewngofnodi?error=auth_callback_failed`);
}
