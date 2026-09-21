"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { auth, signIn as authSignIn, signOut as authSignOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { members, users } from "@/lib/db/schema";
import {
  SignUpSchema,
  MagicLinkSchema,
  UpdateProfileSchema,
  type AuthFormState,
} from "@/lib/auth/schemas";

const GENERIC_SEND_ERROR =
  "Methwyd anfon dolen fewngofnodi / Failed to send sign-in link. Please try again.";

/**
 * Finds or creates the `users` row for a signup email, then the matching
 * `members` row (status "pending"), mirroring what the old Supabase
 * `handle_new_auth_user()` trigger did on `auth.users` insert. Runs before
 * the magic link is sent, not on verification, so a signup that never
 * verifies still shows up in the admin queue as a real intent (matching
 * prior behaviour) rather than silently disappearing.
 */
async function upsertPendingMember(
  email: string,
  fullName: string,
  policyConsentAt: Date
) {
  const [inserted] = await db
    .insert(users)
    .values({ email })
    .onConflictDoNothing({ target: users.email })
    .returning();
  const user =
    inserted ?? (await db.query.users.findFirst({ where: eq(users.email, email) }));
  if (!user) throw new Error("Failed to resolve user row for signup email.");

  await db
    .insert(members)
    .values({
      id: user.id,
      email,
      fullName,
      policyConsentAt,
      joinedAt: new Date(),
    })
    .onConflictDoNothing({ target: members.id });

  return user;
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

  await upsertPendingMember(email, full_name, new Date());

  try {
    await authSignIn("resend", { email, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("[signUp] Auth.js sign-in error:", error.type);
      return { message: GENERIC_SEND_ERROR };
    }
    throw error;
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

  const { email } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!existingUser) {
    return {
      message:
        "Ni chanfuwyd cyfrif gyda'r cyfeiriad e-bost hwn / No account found with that email address.",
    };
  }

  try {
    await authSignIn("resend", { email, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("[requestMagicLink] Auth.js sign-in error:", error.type);
      return { message: GENERIC_SEND_ERROR };
    }
    throw error;
  }

  return { message: "sent" };
}

export async function signOut() {
  await authSignOut({ redirectTo: "/" });
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

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/mewngofnodi");
  }

  try {
    await db
      .update(members)
      .set({ fullName: parsed.data.full_name, postcode: parsed.data.postcode })
      .where(eq(members.id, session.user.id));
  } catch {
    return { message: "Methwyd diweddaru / Update failed. Please try again." };
  }

  return { message: "success" };
}
