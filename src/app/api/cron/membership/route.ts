import { NextRequest, NextResponse } from "next/server";
import * as React from "react";
import { createServiceClient } from "@/lib/supabase/service";
import { resend, FROM_ADDRESS } from "@/lib/resend";
import { RenewalReminderEmail } from "@/emails/RenewalReminderEmail";

/**
 * Membership maintenance cron endpoint.
 * Called daily by Vercel Cron (see vercel.json).
 *
 * Responsibilities:
 *   1. Expire memberships whose membership_expires_at has passed.
 *   2. Send a 30-day renewal reminder to members expiring within 30 days
 *      who have not yet been notified.
 *   3. Send a 7-day final reminder to members expiring within 7 days
 *      whose last notification was sent more than 7 days ago.
 *
 * Protected by Bearer token (CRON_SECRET env var).
 * Vercel automatically injects this header when running cron jobs.
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
  const dashboardUrl = `${siteUrl}/aelodau`;

  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const results = {
    expired: 0,
    reminded30d: 0,
    reminded7d: 0,
    errors: [] as string[],
  };

  // ── 1. Expire overdue active memberships ──────────────────────────────
  const { data: toExpire, error: expireQueryError } = await service
    .from("members")
    .select("id, email, full_name")
    .eq("status", "active")
    .lt("membership_expires_at", now.toISOString());

  if (expireQueryError) {
    results.errors.push(`Expire query: ${expireQueryError.message}`);
  } else if (toExpire && toExpire.length > 0) {
    const ids = toExpire.map((m) => m.id);
    const { error: expireError } = await service
      .from("members")
      .update({ status: "expired" })
      .in("id", ids);

    if (expireError) {
      results.errors.push(`Expire update: ${expireError.message}`);
    } else {
      results.expired = ids.length;
    }
  }

  // ── 2. Send 30-day reminder ───────────────────────────────────────────
  // Members expiring in 7–30 days who haven't been notified yet.
  const { data: remind30, error: remind30Error } = await service
    .from("members")
    .select("id, email, full_name, membership_expires_at")
    .eq("status", "active")
    .gt("membership_expires_at", in7Days.toISOString())
    .lte("membership_expires_at", in30Days.toISOString())
    .is("renewal_notified_at", null);

  if (remind30Error) {
    results.errors.push(`Remind-30d query: ${remind30Error.message}`);
  } else if (remind30 && remind30.length > 0) {
    for (const member of remind30) {
      const expiresAt = new Date(member.membership_expires_at!);
      const daysRemaining = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const expiryDate = expiresAt.toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      try {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: member.email,
          subject:
            "Atgoffa am adnewyddu aelodaeth / Membership renewal reminder",
          react: React.createElement(RenewalReminderEmail, {
            name: member.full_name ?? "Aelod",
            expiryDate,
            daysRemaining,
            dashboardUrl,
          }),
        });

        await service
          .from("members")
          .update({ renewal_notified_at: now.toISOString() })
          .eq("id", member.id);

        results.reminded30d++;
      } catch (err) {
        results.errors.push(
          `Remind-30d email ${member.id}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  }

  // ── 3. Send 7-day final reminder ─────────────────────────────────────
  // Members expiring within 7 days whose last notification was > 7 days ago
  // (i.e. they received the 30-day notice but need the final nudge).
  const { data: remind7, error: remind7Error } = await service
    .from("members")
    .select("id, email, full_name, membership_expires_at")
    .eq("status", "active")
    .gt("membership_expires_at", now.toISOString())
    .lte("membership_expires_at", in7Days.toISOString())
    .lt("renewal_notified_at", sevenDaysAgo.toISOString());

  if (remind7Error) {
    results.errors.push(`Remind-7d query: ${remind7Error.message}`);
  } else if (remind7 && remind7.length > 0) {
    for (const member of remind7) {
      const expiresAt = new Date(member.membership_expires_at!);
      const daysRemaining = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const expiryDate = expiresAt.toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      try {
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: member.email,
          subject:
            "Nodyn terfynol: aelodaeth yn dod i ben / Final notice: membership expiring",
          react: React.createElement(RenewalReminderEmail, {
            name: member.full_name ?? "Aelod",
            expiryDate,
            daysRemaining,
            dashboardUrl,
          }),
        });

        await service
          .from("members")
          .update({ renewal_notified_at: now.toISOString() })
          .eq("id", member.id);

        results.reminded7d++;
      } catch (err) {
        results.errors.push(
          `Remind-7d email ${member.id}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  }

  const status = results.errors.length > 0 ? 207 : 200;
  return NextResponse.json(results, { status });
}
