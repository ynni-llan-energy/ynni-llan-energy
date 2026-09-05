"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as React from "react";
import { and, eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { emailSends, members } from "@/lib/db/schema";
import { getResend, FROM_ADDRESS } from "@/lib/resend";
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
  const session = await auth();

  if (!session?.user?.id) redirect("/mewngofnodi");

  const member = await db.query.members.findFirst({
    where: eq(members.id, session.user.id),
    columns: { isAdmin: true },
  });

  if (!member?.isAdmin) redirect("/aelodau");

  return session.user.id;
}

/**
 * Approves a pending or expired member: sets status to 'active', records
 * approval metadata, sets membership_expires_at to 12 months from now, and
 * sends a confirmation email.
 */
export async function verifyMember(memberId: string) {
  const adminId = await requireAdmin();

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const [member] = await db
    .update(members)
    .set({
      status: "active",
      approvedAt: now,
      approvedBy: adminId,
      membershipExpiresAt: expiresAt,
      renewalNotifiedAt: null,
    })
    .where(
      and(eq(members.id, memberId), inArray(members.status, ["pending", "expired"]))
    )
    .returning({
      email: members.email,
      fullName: members.fullName,
      membershipExpiresAt: members.membershipExpiresAt,
    });

  if (!member) {
    console.error("[verifyMember] Update matched no row for", memberId);
    revalidatePath("/gweinyddu");
    return;
  }

  const name = member.fullName ?? "Aelod";
  const expiryDate = member.membershipExpiresAt!.toLocaleDateString("cy-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    await getResend().emails.send({
      from: FROM_ADDRESS,
      to: member.email,
      subject: "Aelodaeth wedi ei chadarnhau / Membership confirmed",
      react: React.createElement(MemberVerifiedEmail, {
        name,
        dashboardUrl: `${getSiteUrl()}/aelodau`,
        expiryDate,
      }),
    });

    await db.insert(emailSends).values({
      template: "member_verified",
      subject: "Aelodaeth wedi ei chadarnhau / Membership confirmed",
      recipientCount: 1,
      triggeredBy: adminId,
    });
  } catch (emailError) {
    // Log but don't fail — the member is verified; the email is best-effort.
    console.error("[verifyMember] Email send failed:", emailError);
  }

  revalidatePath("/gweinyddu");
}

/**
 * Revokes an active membership by setting status to 'suspended'.
 */
export async function revokeMembership(memberId: string) {
  await requireAdmin();

  await db
    .update(members)
    .set({ status: "suspended" })
    .where(and(eq(members.id, memberId), eq(members.status, "active")));

  revalidatePath("/gweinyddu");
}
