import { NextRequest, NextResponse } from "next/server";
import * as React from "react";
import { and, asc, desc, eq, gt, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { emailSends, members } from "@/lib/db/schema";
import { getResend, FROM_ADDRESS } from "@/lib/resend";
import { AdminWeeklyDigestEmail } from "@/emails/AdminWeeklyDigestEmail";
import type { DigestMember, ExpiringMember } from "@/emails/AdminWeeklyDigestEmail";

/**
 * Weekly admin digest cron endpoint.
 * Scheduling moves to the host (systemd timer / OS cron curling this
 * endpoint) in the Hetzner deploy — Vercel Cron is no longer configured.
 *
 * Sends a summary email to all active admins containing:
 *   - New member registrations in the past 7 days
 *   - Members currently awaiting approval
 *   - Total membership counts by status
 *   - Memberships expiring within the next 30 days
 *
 * Protected by Bearer token (CRON_SECRET env var).
 */
export async function GET(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const adminUrl = `${siteUrl}/gweinyddu`;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const errors: string[] = [];
  const formatDate = (d: Date) =>
    d.toLocaleDateString("cy-GB", { day: "numeric", month: "long", year: "numeric" });

  // ── 1. New registrations this week ──────────────────────────────────────
  let newMembersCount = 0;
  let newMembers: DigestMember[] = [];
  try {
    const newMembersRaw = await db.query.members.findMany({
      where: gte(members.createdAt, sevenDaysAgo),
      orderBy: desc(members.createdAt),
      columns: { fullName: true, email: true, createdAt: true },
    });
    newMembersCount = newMembersRaw.length;
    newMembers = newMembersRaw.slice(0, 10).map((m) => ({
      fullName: m.fullName ?? "Aelod",
      email: m.email,
      date: formatDate(m.createdAt),
    }));
  } catch (err) {
    errors.push(`New members query: ${err instanceof Error ? err.message : String(err)}`);
  }

  // ── 2. Members awaiting approval ────────────────────────────────────────
  let pendingCount = 0;
  let pendingMembers: DigestMember[] = [];
  try {
    const pendingRaw = await db.query.members.findMany({
      where: eq(members.status, "pending"),
      orderBy: asc(members.createdAt),
      columns: { fullName: true, email: true, createdAt: true },
    });
    pendingCount = pendingRaw.length;
    pendingMembers = pendingRaw.slice(0, 10).map((m) => ({
      fullName: m.fullName ?? "Aelod",
      email: m.email,
      date: formatDate(m.createdAt),
    }));
  } catch (err) {
    errors.push(`Pending members query: ${err instanceof Error ? err.message : String(err)}`);
  }

  // ── 3. Membership totals by status ──────────────────────────────────────
  let totalActive = 0;
  let totalExpired = 0;
  let totalSuspended = 0;
  try {
    const allMembers = await db.query.members.findMany({ columns: { status: true } });
    const counts = allMembers.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    totalActive = counts["active"] ?? 0;
    totalExpired = counts["expired"] ?? 0;
    totalSuspended = counts["suspended"] ?? 0;
  } catch (err) {
    errors.push(`Totals query: ${err instanceof Error ? err.message : String(err)}`);
  }

  // ── 4. Memberships expiring within 30 days ──────────────────────────────
  let expiringCount = 0;
  let expiringMembers: ExpiringMember[] = [];
  try {
    const expiringRaw = await db.query.members.findMany({
      where: and(
        eq(members.status, "active"),
        gt(members.membershipExpiresAt, now),
        lte(members.membershipExpiresAt, in30Days)
      ),
      orderBy: asc(members.membershipExpiresAt),
      columns: { fullName: true, membershipExpiresAt: true },
    });
    expiringCount = expiringRaw.length;
    expiringMembers = expiringRaw.slice(0, 10).map((m) => {
      const expiresAt = m.membershipExpiresAt!;
      const daysRemaining = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { fullName: m.fullName ?? "Aelod", daysRemaining };
    });
  } catch (err) {
    errors.push(`Expiring query: ${err instanceof Error ? err.message : String(err)}`);
  }

  // ── 5. Fetch admin recipients ────────────────────────────────────────────
  let adminEmails: string[] = [];
  try {
    const admins = await db.query.members.findMany({
      where: and(eq(members.isAdmin, true), eq(members.status, "active")),
      columns: { email: true },
    });
    adminEmails = admins.map((a) => a.email);
  } catch (err) {
    errors.push(`Admins query: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (adminEmails.length === 0) {
    return NextResponse.json(
      { sent: 0, errors: [...errors, "No active admins found"] },
      { status: errors.length > 0 ? 207 : 200 }
    );
  }

  // ── 6. Build date strings for email ─────────────────────────────────────
  const weekStart = formatDate(sevenDaysAgo);
  const weekEnd = formatDate(now);

  // ── 7. Send digest to all admins ─────────────────────────────────────────
  let sent = 0;

  for (const email of adminEmails) {
    try {
      await getResend().emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: `Crynodeb Wythnosol: Aelodaeth / Weekly Digest: Membership — ${weekEnd}`,
        react: React.createElement(AdminWeeklyDigestEmail, {
          weekStart,
          weekEnd,
          adminUrl,
          newMembers,
          newMembersCount,
          pendingMembers,
          pendingCount,
          totalActive,
          totalExpired,
          totalSuspended,
          expiringMembers,
          expiringCount,
        }),
      });
      sent++;
    } catch (err) {
      errors.push(
        `Send to ${email}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  // ── 8. Audit log ─────────────────────────────────────────────────────────
  if (sent > 0) {
    try {
      await db.insert(emailSends).values({
        template: "admin_weekly_digest",
        subject: `Crynodeb Wythnosol: Aelodaeth / Weekly Digest: Membership — ${weekEnd}`,
        recipientCount: sent,
        triggeredBy: null,
      });
    } catch (err) {
      errors.push(`Audit log: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const status = errors.length > 0 ? 207 : 200;
  return NextResponse.json({ sent, errors }, { status });
}
