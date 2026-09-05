import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Protected layout for the member area. Redirects unauthenticated users to
 * the login page — belt-and-braces alongside proxy.ts's route protection,
 * per the Next.js auth guide's recommendation that proxy checks stay
 * optimistic and real pages verify the session themselves.
 */
export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/mewngofnodi");
  }

  return <>{children}</>;
}
