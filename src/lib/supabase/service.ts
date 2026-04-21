import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

/**
 * Creates a Supabase client using the service role key.
 * This bypasses Row Level Security entirely — use only server-side for
 * privileged operations such as admin actions and cron jobs.
 * Never expose to the client or import from client components.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
