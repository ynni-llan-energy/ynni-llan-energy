import { createClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client using the service-role key so tests can create
 * and delete auth users without going through the public API.
 *
 * LOCAL  — defaults to local Supabase (supabase start) on port 54321.
 *          The service-role key is deterministic for local dev; override via env.
 * CI     — the workflow exports SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *          after `supabase start`.
 */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL ?? "http://localhost:54321";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set.\n" +
        "Run `supabase start` then export the Secret key:\n" +
        "  export SUPABASE_SERVICE_ROLE_KEY=$(supabase status 2>&1 | grep -oP 'Secret\\s+│\\s+\\K[^\\s│]+')"
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface TestUserRecord {
  id: string;
  email: string;
  fullName: string;
}

/**
 * Create a confirmed auth user via the admin API.
 * `email_confirm: true` skips the email confirmation step so the test can
 * log in immediately via generateMagicLink.
 */
export async function createTestUser(
  email: string,
  fullName: string
): Promise<TestUserRecord> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    throw new Error(`Failed to create test user: ${error?.message}`);
  }

  return { id: data.user.id, email, fullName };
}

/**
 * Generate a magic link URL for a user via the admin API.
 * Use this in tests to establish an authenticated session without email.
 */
export async function generateMagicLink(email: string): Promise<string> {
  const admin = createAdminClient();
  const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error || !data.properties?.action_link) {
    throw new Error(`Failed to generate magic link: ${error?.message}`);
  }

  return data.properties.action_link;
}

/**
 * Hard-delete the auth user and their associated members row (cascade handles
 * the FK, but deleting from auth.users is sufficient with our trigger).
 */
export async function deleteTestUser(userId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    // Log but don't throw — we still want other teardown steps to run.
    console.warn(`Could not delete test user ${userId}: ${error.message}`);
  }
}

/**
 * Find and delete a test user by email address.
 * Used for cleanup in tests that create users through the signup UI.
 */
export async function deleteTestUserByEmail(email: string): Promise<void> {
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const user = data?.users.find((u) => u.email === email);
  if (user?.id) await deleteTestUser(user.id);
}
