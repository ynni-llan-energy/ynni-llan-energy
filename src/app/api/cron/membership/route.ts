import { NextRequest, NextResponse } from "next/server";
import * as React from "react";
import { and, eq, gt, isNull, inArray, lt, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { getResend, FROM_ADDRESS } from "@/lib/resend";
import { RenewalReminderEmail } from "@/emails/RenewalReminderEmail";

/**
 * Membership maintenance cron endpoint.
 * Scheduling moves to the host (systemd timer / OS cron curling this
 * endpoint) in the Hetzner deploy — Vercel Cron is no longer configured.
 *
 * Responsibilities:
 *   1. Expire memberships whose membership_expires_at has passed.
 *   2. Send a 30-day renewal reminder to members expiring within 30 days
 *      who have not yet been notified.
 *   3. Send a 7-day final reminder to members expiring within 7 days
 *      whose last notification was sent more than 7 days ago.
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
  try {
    const toExpire = await db.query.members.findMany({
      where: and(eq(members.status, "active"), lt(members.membershipExpiresAt, now)),
      columns: { id: true },
    });

    if (toExpire.length > 0) {
      const ids = toExpire.map((m) => m.id);
      await db
        .update(members)
        .set({ status: "expired" })
        .where(inArray(members.id, ids));
      results.expired = ids.length;
    }
  } catch (err) {
    results.errors.push(
      `Expire: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // ── 2. Send 30-day reminder ───────────────────────────────────────────
  // Members expiring in 7–30 days who haven't been notified yet.
  try {
    const remind30 = await db.query.members.findMany({
      where: and(
        eq(members.status, "active"),
        gt(members.membershipExpiresAt, in7Days),
        lte(members.membershipExpiresAt, in30Days),
        isNull(members.renewalNotifiedAt)
      ),
      columns: { id: true, email: true, fullName: true, membershipExpiresAt: true },
    });

    for (const member of remind30) {
      const expiresAt = member.membershipExpiresAt!;
      const daysRemaining = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const expiryDate = expiresAt.toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      try {
        await getResend().emails.send({
          from: FROM_ADDRESS,
          to: member.email,
          subject:
            "Atgoffa am adnewyddu aelodaeth / Membership renewal reminder",
          react: React.createElement(RenewalReminderEmail, {
            name: member.fullName ?? "Aelod",
            expiryDate,
            daysRemaining,
            dashboardUrl,
          }),
        });

        await db
          .update(members)
          .set({ renewalNotifiedAt: now })
          .where(eq(members.id, member.id));

        results.reminded30d++;
      } catch (err) {
        results.errors.push(
          `Remind-30d email ${member.id}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  } catch (err) {
    results.errors.push(
      `Remind-30d query: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // ── 3. Send 7-day final reminder ─────────────────────────────────────
  // Members expiring within 7 days whose last notification was > 7 days ago
  // (i.e. they received the 30-day notice but need the final nudge).
  try {
    const remind7 = await db.query.members.findMany({
      where: and(
        eq(members.status, "active"),
        gt(members.membershipExpiresAt, now),
        lte(members.membershipExpiresAt, in7Days),
        lt(members.renewalNotifiedAt, sevenDaysAgo)
      ),
      columns: { id: true, email: true, fullName: true, membershipExpiresAt: true },
    });

    for (const member of remind7) {
      const expiresAt = member.membershipExpiresAt!;
      const daysRemaining = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const expiryDate = expiresAt.toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      try {
        await getResend().emails.send({
          from: FROM_ADDRESS,
          to: member.email,
          subject:
            "Nodyn terfynol: aelodaeth yn dod i ben / Final notice: membership expiring",
          react: React.createElement(RenewalReminderEmail, {
            name: member.fullName ?? "Aelod",
            expiryDate,
            daysRemaining,
            dashboardUrl,
          }),
        });

        await db
          .update(members)
          .set({ renewalNotifiedAt: now })
          .where(eq(members.id, member.id));

        results.reminded7d++;
      } catch (err) {
        results.errors.push(
          `Remind-7d email ${member.id}: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }
  } catch (err) {
    results.errors.push(
      `Remind-7d query: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const status = results.errors.length > 0 ? 207 : 200;
  return NextResponse.json(results, { status });
}
