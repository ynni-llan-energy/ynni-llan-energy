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
function createAdminClient() {
  const url =
    process.env.SUPABASE_URL ?? "http://localhost:54321";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    // Default local dev service-role key produced by supabase CLI
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hj04zWl196z2-SBc0";

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface TestUserRecord {
  id: string;
  email: string;
  password: string;
  fullName: string;
}

/**
 * Create a confirmed auth user via the admin API.
 * `email_confirm: true` skips the email confirmation step even when
 * `enable_confirmations` is on, so the test can log in immediately.
 */
export async function createTestUser(
  email: string,
  password: string,
  fullName: string
): Promise<TestUserRecord> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    throw new Error(`Failed to create test user: ${error?.message}`);
  }

  return { id: data.user.id, email, password, fullName };
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
