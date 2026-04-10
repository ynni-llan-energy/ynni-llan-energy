import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Handles Supabase auth callbacks. Two flows land here:
 *
 * 1. PKCE / OAuth — `?code=xxx` — exchangeCodeForSession
 *    Used by OAuth providers and some Supabase client configurations.
 *
 * 2. Email OTP / magic link — `?token_hash=xxx&type=magiclink` — verifyOtp
 *    Used by Supabase's email magic link flow. The token_hash is embedded in
 *    the email link and verified here without a separate round-trip to the
 *    Supabase verify endpoint.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
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

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Something went wrong — redirect to login with an error flag
  return NextResponse.redirect(`${origin}/mewngofnodi?error=auth_callback_failed`);
}
