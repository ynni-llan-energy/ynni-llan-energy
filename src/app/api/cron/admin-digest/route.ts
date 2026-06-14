import { NextRequest, NextResponse } from "next/server";
import * as React from "react";
import { createServiceClient } from "@/lib/supabase/service";
import { getResend, FROM_ADDRESS } from "@/lib/resend";
import { AdminWeeklyDigestEmail } from "@/emails/AdminWeeklyDigestEmail";
import type { DigestMember, ExpiringMember } from "@/emails/AdminWeeklyDigestEmail";

/**
 * Weekly admin digest cron endpoint.
 * Called every Monday at 08:00 UTC by Vercel Cron (see vercel.json).
 *
 * Sends a summary email to all active admins containing:
 *   - New member registrations in the past 7 days
 *   - Members currently awaiting approval
 *   - Total membership counts by status
 *   - Memberships expiring within the next 30 days
 *
 * Protected by Bearer token (CRON_SECRET env var).
 * Vercel automatically injects this header when running cron jobs.
 *
 * Also serves to keep the Supabase database active between low-traffic periods.
 */
export async function GET(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const adminUrl = `${siteUrl}/gweinyddu`;

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const errors: string[] = [];

  // ── 1. New registrations this week ──────────────────────────────────────
  const { data: newMembersRaw, error: newMembersError } = await service
    .from("members")
    .select("full_name, email, created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .order("created_at", { ascending: false });

  if (newMembersError) {
    errors.push(`New members query: ${newMembersError.message}`);
  }

  const newMembersCount = newMembersRaw?.length ?? 0;
  const newMembers: DigestMember[] = (newMembersRaw ?? [])
    .slice(0, 10)
    .map((m) => ({
      fullName: m.full_name ?? "Aelod",
      email: m.email,
      date: new Date(m.created_at).toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));

  // ── 2. Members awaiting approval ────────────────────────────────────────
  const { data: pendingRaw, error: pendingError } = await service
    .from("members")
    .select("full_name, email, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (pendingError) {
    errors.push(`Pending members query: ${pendingError.message}`);
  }

  const pendingCount = pendingRaw?.length ?? 0;
  const pendingMembers: DigestMember[] = (pendingRaw ?? [])
    .slice(0, 10)
    .map((m) => ({
      fullName: m.full_name ?? "Aelod",
      email: m.email,
      date: new Date(m.created_at).toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));

  // ── 3. Membership totals by status ──────────────────────────────────────
  const { data: allMembers, error: totalsError } = await service
    .from("members")
    .select("status");

  if (totalsError) {
    errors.push(`Totals query: ${totalsError.message}`);
  }

  const counts = (allMembers ?? []).reduce(
    (acc, m) => {
      const s = m.status as string;
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalActive = counts["active"] ?? 0;
  const totalExpired = counts["expired"] ?? 0;
  const totalSuspended = counts["suspended"] ?? 0;

  // ── 4. Memberships expiring within 30 days ──────────────────────────────
  const { data: expiringRaw, error: expiringError } = await service
    .from("members")
    .select("full_name, membership_expires_at")
    .eq("status", "active")
    .gt("membership_expires_at", now.toISOString())
    .lte("membership_expires_at", in30Days.toISOString())
    .order("membership_expires_at", { ascending: true });

  if (expiringError) {
    errors.push(`Expiring query: ${expiringError.message}`);
  }

  const expiringCount = expiringRaw?.length ?? 0;
  const expiringMembers: ExpiringMember[] = (expiringRaw ?? [])
    .slice(0, 10)
    .map((m) => {
      const expiresAt = new Date(m.membership_expires_at!);
      const daysRemaining = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        fullName: m.full_name ?? "Aelod",
        daysRemaining,
      };
    });

  // ── 5. Fetch admin recipients ────────────────────────────────────────────
  const { data: admins, error: adminsError } = await service
    .from("members")
    .select("email")
    .eq("is_admin", true)
    .eq("status", "active");

  if (adminsError) {
    errors.push(`Admins query: ${adminsError.message}`);
  }

  const adminEmails = (admins ?? []).map((a) => a.email);

  if (adminEmails.length === 0) {
    return NextResponse.json(
      { sent: 0, errors: [...errors, "No active admins found"] },
      { status: errors.length > 0 ? 207 : 200 }
    );
  }

  // ── 6. Build date strings for email ─────────────────────────────────────
  const formatDate = (d: Date) =>
    d.toLocaleDateString("cy-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
    await service.from("email_sends").insert({
      template: "admin_weekly_digest",
      subject: `Crynodeb Wythnosol: Aelodaeth / Weekly Digest: Membership — ${weekEnd}`,
      recipient_count: sent,
      triggered_by: null,
    });
  }

  const status = errors.length > 0 ? 207 : 200;
  return NextResponse.json({ sent, errors }, { status });
}
