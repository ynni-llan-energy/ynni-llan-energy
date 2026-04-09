import { redirect } from "next/navigation";
import { createClient, MissingSupabaseConfigError } from "@/lib/supabase/server";

/**
 * Protected layout for the member area.
 * Redirects unauthenticated users to the login page.
 * If Supabase isn't configured (e.g. a preview deploy without env vars),
 * redirects to login rather than crashing with a 500.
 */
export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/mewngofnodi");
    }
  } catch (err) {
    if (err instanceof MissingSupabaseConfigError) {
      // Supabase not configured — treat as unauthenticated
      redirect("/mewngofnodi");
    }
    // Re-throw redirect() calls (Next.js uses throw internally for redirect)
    throw err;
  }

  return <>{children}</>;
}
