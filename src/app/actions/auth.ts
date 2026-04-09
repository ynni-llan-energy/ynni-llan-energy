"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  SignUpSchema,
  MagicLinkSchema,
  UpdateProfileSchema,
  type AuthFormState,
} from "@/lib/auth/schemas";

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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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
