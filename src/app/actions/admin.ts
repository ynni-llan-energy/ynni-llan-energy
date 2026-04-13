"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { resend, FROM_ADDRESS } from "@/lib/resend";
import { MemberVerifiedEmail } from "@/emails/MemberVerifiedEmail";

function getSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/**
 * Verifies that the current session belongs to an admin member.
 * Redirects away if not authenticated or not an admin.
 * Returns the admin's user ID for use in audit fields.
 */
async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/mewngofnodi");

  const { data: member } = await supabase
    .from("members")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!member?.is_admin) redirect("/aelodau");

  return user.id;
}

/**
 * Approves a pending or expired member: sets status to 'active', records
 * approval metadata, sets membership_expires_at to 12 months from now, and
 * sends a confirmation email.
 */
export async function verifyMember(memberId: string) {
  const adminId = await requireAdmin();
  const service = createServiceClient();

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const { data: member, error } = await service
    .from("members")
    .update({
      status: "active",
      approved_at: now.toISOString(),
      approved_by: adminId,
      membership_expires_at: expiresAt.toISOString(),
      renewal_notified_at: null,
    })
    .eq("id", memberId)
    .in("status", ["pending", "expired"])
    .select("email, full_name, membership_expires_at")
    .single();

  if (error) {
    console.error("[verifyMember] Update failed:", error.message);
    revalidatePath("/gweinyddu");
    return;
  }

  if (member) {
    const name = member.full_name ?? "Aelod";
    const expiryDate = new Date(member.membership_expires_at!).toLocaleDateString(
      "cy-GB",
      { day: "numeric", month: "long", year: "numeric" }
    );

    try {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: member.email,
        subject: "Aelodaeth wedi ei chadarnhau / Membership confirmed",
        react: React.createElement(MemberVerifiedEmail, {
          name,
          dashboardUrl: `${getSiteUrl()}/aelodau`,
          expiryDate,
        }),
      });

      await service.from("email_sends").insert({
        template: "member_verified",
        subject: "Aelodaeth wedi ei chadarnhau / Membership confirmed",
        recipient_count: 1,
        triggered_by: adminId,
      });
    } catch (emailError) {
      // Log but don't fail — the member is verified; the email is best-effort.
      console.error("[verifyMember] Email send failed:", emailError);
    }
  }

  revalidatePath("/gweinyddu");
}

/**
 * Revokes an active membership by setting status to 'suspended'.
 */
export async function revokeMembership(memberId: string) {
  const adminId = await requireAdmin();
  const service = createServiceClient();

  const { error } = await service
    .from("members")
    .update({ status: "suspended" })
    .eq("id", memberId)
    .eq("status", "active");

  if (error) {
    console.error("[revokeMembership] Update failed:", error.message);
  }

  // Suppress unused variable warning — adminId used for the requireAdmin check
  void adminId;

  revalidatePath("/gweinyddu");
}
