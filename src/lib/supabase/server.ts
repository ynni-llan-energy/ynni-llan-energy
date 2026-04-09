import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

/**
 * Creates a Supabase server client.
 * Throws a clear error at runtime if the required env vars are not set,
 * so the problem is immediately obvious in logs rather than producing a
 * cryptic "Invalid URL" crash deep inside the Supabase SDK.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new MissingSupabaseConfigError();
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — cookies can't be set.
          // The proxy handles session refresh instead.
        }
      },
    },
  });
}

export class MissingSupabaseConfigError extends Error {
  constructor() {
    super(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set. " +
        "Add them to your .env.local (local dev) or project environment variables (Vercel)."
    );
    this.name = "MissingSupabaseConfigError";
  }
}
