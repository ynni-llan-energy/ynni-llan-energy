import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Protected layout for the member area.
 * The middleware handles the redirect in most cases; this is a second
 * layer of defence for Server Component rendering.
 */
export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/mewngofnodi");
  }

  return <>{children}</>;
}
