import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { members, users, verificationTokens } from "@/lib/db/schema";

export interface TestUserRecord {
  id: string;
  email: string;
  fullName: string;
}

/**
 * Create a verified user + members row directly via Drizzle, bypassing the
 * signup flow entirely (no email, no Auth.js round-trip needed for setup).
 */
export async function createTestUser(
  email: string,
  fullName: string
): Promise<TestUserRecord> {
  const [user] = await db
    .insert(users)
    .values({ email, name: fullName, emailVerified: new Date() })
    .returning();

  await db.insert(members).values({
    id: user.id,
    email,
    fullName,
    status: "pending",
    eligibleToVote: false,
    joinedAt: new Date(),
  });

  return { id: user.id, email, fullName };
}

/**
 * Generate a callback URL that authenticates a user via Auth.js's email
 * (Resend) provider verification flow, bypassing email delivery entirely.
 * Navigating to this URL in Playwright establishes a real server-side
 * session via /api/auth/callback/resend, exercising the same token-hash
 * lookup a real magic-link click goes through.
 *
 * Mirrors @auth/core's own token handling exactly (see
 * lib/actions/signin/send-token.js and lib/actions/callback/index.js):
 * the plaintext token goes in the URL, and `sha256(token + AUTH_SECRET)` is
 * what's stored in verificationToken.token for lookup on verification.
 */
export async function generateMagicLink(email: string): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set — export it in the shell running Playwright, " +
        "matching the value the Next.js server was started with."
    );
  }

  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const token = randomBytes(32).toString("hex");
  const hashedToken = createHash("sha256").update(`${token}${secret}`).digest("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await db.insert(verificationTokens).values({
    identifier: email,
    token: hashedToken,
    expires,
  });

  const params = new URLSearchParams({
    callbackUrl: `${baseUrl}/aelodau`,
    token,
    email,
  });
  return `${baseUrl}/api/auth/callback/resend?${params}`;
}

/**
 * Hard-delete the user; the members row cascades via its FK to users.id.
 */
export async function deleteTestUser(userId: string): Promise<void> {
  try {
    await db.delete(users).where(eq(users.id, userId));
  } catch (err) {
    // Log but don't throw — we still want other teardown steps to run.
    console.warn(`Could not delete test user ${userId}:`, err);
  }
}

/**
 * Find and delete a test user by email address.
 * Used for cleanup in tests that create users through the signup UI.
 */
export async function deleteTestUserByEmail(email: string): Promise<void> {
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (user) await deleteTestUser(user.id);
}
