"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  SignUpSchema,
  MagicLinkSchema,
  UpdateProfileSchema,
  type AuthFormState,
} from "@/lib/auth/schemas";

/**
 * Resolves the site URL for magic link redirects.
 * Priority: SITE_URL (production override) > VERCEL_URL (auto-set by Vercel) > localhost.
 *
 * SITE_URL (no NEXT_PUBLIC_ prefix) is a runtime-only server var — set it in
 * Vercel for the Production environment only. Preview deployments skip it and
 * fall through to VERCEL_URL, which Vercel sets automatically per-deployment.
 */
function getSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function signUp(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = SignUpSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    policy_consent: formData.get("policy_consent") === "on",
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { full_name, email } = parsed.data;
  const policy_consent_at = new Date().toISOString();
  const supabase = await createClient();

  const emailRedirectTo = `${getSiteUrl()}/auth/callback`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: { full_name, policy_consent_at },
      emailRedirectTo,
    },
  });

  if (error) {
    console.error("[signUp] Supabase OTP error:", {
      message: error.message,
      status: error.status,
      emailRedirectTo,
    });
    return { message: error.message };
  }

  redirect("/ymuno/diolch");
}

export async function requestMagicLink(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = MagicLinkSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const emailRedirectTo = `${getSiteUrl()}/auth/callback`;
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo,
    },
  });

  if (error) {
    // Log full error server-side (visible in Vercel Functions logs)
    console.error("[requestMagicLink] Supabase OTP error:", {
      message: error.message,
      status: error.status,
      emailRedirectTo,
    });
    return { message: error.message };
  }

  return { message: "sent" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateProfile(
  state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = UpdateProfileSchema.safeParse({
    full_name: formData.get("full_name"),
    postcode: formData.get("postcode"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/mewngofnodi");
  }

  const { error } = await supabase
    .from("members")
    .update({ full_name: parsed.data.full_name, postcode: parsed.data.postcode })
    .eq("id", user.id);

  if (error) {
    return { message: "Methwyd diweddaru / Update failed. Please try again." };
  }

  return { message: "success" };
}
