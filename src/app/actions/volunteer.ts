"use server";

import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";

export type VolunteerFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

const RoleInterestSchema = z.object({
  role_slug: z.string().min(1),
  role_title: z.string().min(1),
  statement: z
    .string()
    .max(1000, "Uchafswm 1000 o gymeriadau / Maximum 1000 characters")
    .optional()
    .transform((v) => v?.trim() || null),
});

export async function submitRoleInterest(
  state: VolunteerFormState,
  formData: FormData
): Promise<VolunteerFormState> {
  const parsed = RoleInterestSchema.safeParse({
    role_slug: formData.get("role_slug"),
    role_title: formData.get("role_title"),
    statement: formData.get("statement"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/mewngofnodi");
  }

  const { error } = await supabase.from("role_interest").insert({
    role_slug: parsed.data.role_slug,
    role_title: parsed.data.role_title,
    member_id: user.id,
    statement: parsed.data.statement ?? null,
  });

  if (error) {
    // Unique constraint violation — already submitted interest for this role
    if (error.code === "23505") {
      return { message: "already_submitted" };
    }
    console.error("[submitRoleInterest] DB error:", error);
    return { message: "Methwyd cyflwyno / Submission failed. Please try again." };
  }

  return { message: "success" };
}
