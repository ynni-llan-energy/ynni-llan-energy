/**
 * One-time Supabase -> Postgres data migration.
 *
 * Moves `auth.users` (id, email, confirmation state only) into the new
 * `user` table, then copies `members`, `role_interest`, and `email_sends`
 * verbatim (their columns are identical to the Supabase originals by
 * design). Preserves every UUID exactly, so `members.id` keeps resolving
 * to the same identity it always has.
 *
 * This is a standalone script, not app code — it is meant to be run once
 * per environment (repeatedly during rehearsal against disposable scratch
 * databases, once for real at cutover), not imported or scheduled.
 *
 * ── Handling member data safely — read this before running ──────────────
 *
 * - Run this FROM the destination host (e.g. the Hetzner box itself, over
 *   SSH), not from a laptop. That way DATABASE_URL is just `localhost`, no
 *   destination firewall hole is needed, and the high-privilege Supabase
 *   credential only ever exists in one controlled place's environment.
 * - SUPABASE_DB_URL must be Supabase's *direct* Postgres connection string
 *   (Project Settings > Database > Connection string > "URI", not the
 *   pooled/PostgREST one) — a real Postgres role that bypasses RLS. It is
 *   used read-only here (SELECT only), but treat it as a high-privilege
 *   secret: never commit it, never let it linger in shell history longer
 *   than needed, and rotate the Supabase database password immediately
 *   after the real cutover run, since it was used outside the app's normal
 *   access pattern.
 * - Nothing is written to disk. Rows are streamed from the source
 *   connection straight into the destination transaction, in memory, for
 *   the lifetime of this process only.
 * - Only the columns actually needed are pulled from `auth.users` — not
 *   the full GoTrue row (no raw_user_meta_data, no provider tokens).
 * - The load is one destination transaction: either everything commits or
 *   nothing does. There is no partially-migrated state to clean up.
 * - Verification output below prints redacted emails (`sh***@example.com`),
 *   never full addresses — this script's own stdout may end up in a
 *   terminal scrollback or, if run under CI/automation, a log that
 *   outlives the run.
 * - A rehearsal database (a copy of real member data used to test this
 *   script before the real cutover) is not "just a test" — it holds every
 *   member's real name, email, and postcode, and needs the same
 *   encryption-at-rest and access restriction as production, then genuine
 *   deletion afterwards, not just an abandoned `dropdb`.
 *
 * ── Usage ─────────────────────────────────────────────────────────────
 *
 *   SUPABASE_DB_URL=postgres://...supabase.co:5432/postgres \
 *   DATABASE_URL=postgres://localhost:5432/ynni_llan \
 *   npx tsx scripts/migrate-from-supabase.ts
 *
 * Add DRY_RUN=true to extract and validate against the source only —
 * nothing is written to the destination, and the non-empty-destination
 * check is skipped since nothing will be written.
 *
 * Add CONFIRM=yes to skip the interactive confirmation prompt (for
 * scripted rehearsal runs against a disposable database).
 */

import * as readline from "node:readline/promises";
import postgres from "postgres";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

function redactEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(local.length - visible.length, 1))}@${domain}`;
}

function connectionIdentity(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}:${u.port || "5432"}${u.pathname}`;
  } catch {
    return url;
  }
}

async function confirm(question: string): Promise<boolean> {
  if (process.env.CONFIRM === "yes") return true;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await rl.question(`${question} [type "yes" to continue] `);
    return answer.trim().toLowerCase() === "yes";
  } finally {
    rl.close();
  }
}

interface AuthUserRow {
  id: string;
  email: string;
  email_confirmed_at: Date | null;
}

async function main() {
  const supabaseDbUrl = requireEnv("SUPABASE_DB_URL");
  const databaseUrl = requireEnv("DATABASE_URL");
  const dryRun = process.env.DRY_RUN === "true";

  if (connectionIdentity(supabaseDbUrl) === connectionIdentity(databaseUrl)) {
    console.error(
      "SUPABASE_DB_URL and DATABASE_URL point at the same host/database. " +
        "These must be two different Postgres servers (source and destination)."
    );
    process.exit(1);
  }

  const source = postgres(supabaseDbUrl, { max: 1 });
  const destination = postgres(databaseUrl, { max: 1 });

  try {
    console.log(`Source (read-only):  ${connectionIdentity(supabaseDbUrl)}`);
    console.log(`Destination:         ${connectionIdentity(databaseUrl)}`);
    console.log(dryRun ? "Mode: DRY RUN (no writes)" : "Mode: LIVE (will write to destination)");

    // ── Safety: refuse a non-empty destination up front ───────────────────
    if (!dryRun) {
      const [{ count: existingUsers }] = await destination<{ count: number }[]>`
        SELECT count(*)::int AS count FROM "user"
      `;
      if (existingUsers > 0) {
        console.error(
          `Destination "user" table already has ${existingUsers} row(s). Refusing ` +
            `to run against a non-empty destination — this script is meant for a ` +
            `single migration onto a fresh schema. For a rehearsal re-run, point at ` +
            `a fresh scratch database instead of reusing one that already has data.`
        );
        process.exit(1);
      }
    }

    // ── Extract (read-only against Supabase) ───────────────────────────────
    const authUsers = await source<AuthUserRow[]>`
      SELECT id, email, email_confirmed_at FROM auth.users
    `;
    const members = await source`SELECT * FROM public.members`;
    const roleInterest = await source`SELECT * FROM public.role_interest`;
    const emailSends = await source`SELECT * FROM public.email_sends`;
    const [{ count: unusedRowCount }] = await source<{ count: number }[]>`
      SELECT
        (SELECT count(*) FROM public.ballots) +
        (SELECT count(*) FROM public.ballot_options) +
        (SELECT count(*) FROM public.votes) AS count
    `;

    console.log(
      `Source: ${authUsers.length} auth users, ${members.length} members, ` +
        `${roleInterest.length} role_interest rows, ${emailSends.length} email_sends rows.`
    );
    if (unusedRowCount > 0) {
      console.warn(
        `${unusedRowCount} row(s) exist across ballots/ballot_options/votes. ` +
          `These are not migrated by this script (no app code uses them) — reconcile ` +
          `manually if that data matters.`
      );
    }

    // ── Consistency check before writing anything ──────────────────────────
    const authIds = new Set(authUsers.map((u) => u.id));
    const orphanMembers = members.filter((m) => !authIds.has(m.id as string));
    if (orphanMembers.length > 0) {
      console.error(
        `${orphanMembers.length} members row(s) have no matching auth.users row. ` +
          `Aborting rather than migrating an inconsistent dataset — investigate these ` +
          `member ids first: ${orphanMembers.map((m) => m.id).join(", ")}`
      );
      process.exit(1);
    }
    const memberIds = new Set(members.map((m) => m.id as string));
    const usersWithoutMember = authUsers.filter((u) => !memberIds.has(u.id)).length;
    if (usersWithoutMember > 0) {
      console.warn(
        `${usersWithoutMember} auth user(s) have no matching members row — they'll ` +
          `migrate as a user with no membership record, same as on the source.`
      );
    }

    if (dryRun) {
      console.log("DRY_RUN=true — extraction and checks complete, no writes made.");
      return;
    }

    const proceed = await confirm(
      `About to write ${authUsers.length} users and ${members.length} members to the destination.`
    );
    if (!proceed) {
      console.log("Aborted — nothing was written.");
      return;
    }

    // ── Load: one transaction, all-or-nothing ──────────────────────────────
    await destination.begin(async (tx) => {
      if (authUsers.length > 0) {
        const userRows = authUsers.map((u) => ({
          id: u.id,
          email: u.email,
          emailVerified: u.email_confirmed_at,
        }));
        await tx`INSERT INTO "user" ${tx(userRows, "id", "email", "emailVerified")}`;
      }
      if (members.length > 0) {
        await tx`
          INSERT INTO members ${tx(
            members,
            "id",
            "created_at",
            "email",
            "full_name",
            "status",
            "eligible_to_vote",
            "postcode",
            "joined_at",
            "approved_at",
            "approved_by",
            "is_admin",
            "membership_expires_at",
            "renewal_notified_at",
            "policy_consent_at"
          )}
        `;
      }
      if (roleInterest.length > 0) {
        await tx`
          INSERT INTO role_interest ${tx(
            roleInterest,
            "id",
            "created_at",
            "role_slug",
            "role_title",
            "member_id",
            "statement"
          )}
        `;
      }
      if (emailSends.length > 0) {
        await tx`
          INSERT INTO email_sends ${tx(
            emailSends,
            "id",
            "created_at",
            "template",
            "subject",
            "recipient_count",
            "triggered_by",
            "sent_at"
          )}
        `;
      }
    });

    console.log("Migration transaction committed.");

    // ── Verify ──────────────────────────────────────────────────────────────
    const [{ count: destUsers }] = await destination<{ count: number }[]>`
      SELECT count(*)::int AS count FROM "user"
    `;
    const [{ count: destMembers }] = await destination<{ count: number }[]>`
      SELECT count(*)::int AS count FROM members
    `;
    const [{ count: destRoleInterest }] = await destination<{ count: number }[]>`
      SELECT count(*)::int AS count FROM role_interest
    `;
    const [{ count: destEmailSends }] = await destination<{ count: number }[]>`
      SELECT count(*)::int AS count FROM email_sends
    `;

    const mismatches: string[] = [];
    if (destUsers !== authUsers.length) mismatches.push(`user: ${destUsers} vs source ${authUsers.length}`);
    if (destMembers !== members.length) mismatches.push(`members: ${destMembers} vs source ${members.length}`);
    if (destRoleInterest !== roleInterest.length)
      mismatches.push(`role_interest: ${destRoleInterest} vs source ${roleInterest.length}`);
    if (destEmailSends !== emailSends.length)
      mismatches.push(`email_sends: ${destEmailSends} vs source ${emailSends.length}`);

    console.log(
      `Destination row counts — user: ${destUsers}, members: ${destMembers}, ` +
        `role_interest: ${destRoleInterest}, email_sends: ${destEmailSends}`
    );

    if (mismatches.length > 0) {
      console.error(`Row count mismatch after migration: ${mismatches.join("; ")}`);
      console.error("Do not proceed to cutover until this is investigated.");
      process.exit(1);
    }

    const sample = await destination`
      SELECT m.id, m.email, m.status, (u."emailVerified" IS NOT NULL) AS user_verified
      FROM members m
      JOIN "user" u ON u.id = m.id
      ORDER BY m.created_at DESC
      LIMIT 5
    `;
    console.log("Spot check (5 most recently joined members, emails redacted):");
    for (const row of sample) {
      console.log(
        `  ${row.id}  ${redactEmail(row.email)}  status=${row.status}  user_verified=${row.user_verified}`
      );
    }

    console.log("Migration complete and verified.");
    console.log(
      "Next: rotate the Supabase database password used above, since it was used " +
        "outside the app's normal access pattern."
    );
  } finally {
    await source.end();
    await destination.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
