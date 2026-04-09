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
 * Priority: explicit env var > Vercel deployment URL > localhost fallback.
 * VERCEL_URL is set automatically by Vercel on every deployment (preview + prod).
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
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
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { full_name, email } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: { full_name },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
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

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
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
