import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gweinyddu: Diddordeb Gwirfoddoli | Ynni Cymunedol Llanfairfechan",
};

export default async function AdminVolunteerInterestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/mewngofnodi");

  const { data: member } = await supabase
    .from("members")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!member?.is_admin) redirect("/aelodau");

  const serviceClient = createServiceClient();

  const { data: interests, error } = await serviceClient
    .from("role_interest")
    .select("id, created_at, role_slug, role_title, statement, member_id")
    .order("created_at", { ascending: false });

  const memberIds = [...new Set((interests ?? []).map((i) => i.member_id))];
  const { data: members } = memberIds.length
    ? await serviceClient
        .from("members")
        .select("id, full_name, email")
        .in("id", memberIds)
    : { data: [] };

  const memberMap = new Map(
    (members ?? []).map((m) => [m.id, m])
  );

  const byRole = new Map<string, { title: string; items: typeof interests }>();
  for (const item of interests ?? []) {
    if (!byRole.has(item.role_slug)) {
      byRole.set(item.role_slug, { title: item.role_title, items: [] });
    }
    byRole.get(item.role_slug)!.items!.push(item);
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <nav className="text-xs text-[#0A4B68]/50 mb-3">
                <Link href="/gweinyddu" className="hover:text-[#C07E00] transition-colors">
                  <span lang="cy">Gweinyddu</span>
                  <span className="italic ml-1 opacity-70" lang="en">/ Admin</span>
                </Link>
                {" / "}
                <span lang="cy">Cyfrannu</span>
              </nav>
              <h1 className="font-display text-3xl font-bold text-[#0A4B68]" lang="cy">
                Diddordeb Gwirfoddoli
              </h1>
              <p className="italic text-[#0A4B68]/60 text-sm mt-1" lang="en">
                Volunteer Interest Submissions
              </p>
            </div>
            <Link
              href="/cyfrannu"
              className="text-sm text-[#C07E00] hover:text-[#0A4B68] underline underline-offset-2 transition-colors"
            >
              ← <span lang="cy">Gweld rolau ar y wefan</span>
              <span className="italic ml-1" lang="en">/ View live roles</span>
            </Link>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-sm bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
              <span lang="cy">Methwyd llwytho</span>
              <span className="italic ml-1" lang="en">/ Failed to load:</span>{" "}
              {error.message}
            </div>
          )}

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            <div className="p-5 bg-[#EEE8D8] border border-[#0A4B68]/10 rounded-sm">
              <div className="text-3xl font-display font-bold text-[#0A4B68]">
                {interests?.length ?? 0}
              </div>
              <div className="text-xs text-[#0A4B68]/60 mt-1">
                <span lang="cy">Cyfanswm ceisiadau</span>
                <span className="block italic" lang="en">Total submissions</span>
              </div>
            </div>
            <div className="p-5 bg-[#EEE8D8] border border-[#0A4B68]/10 rounded-sm">
              <div className="text-3xl font-display font-bold text-[#0A4B68]">
                {byRole.size}
              </div>
              <div className="text-xs text-[#0A4B68]/60 mt-1">
                <span lang="cy">Rolau â diddordeb</span>
                <span className="block italic" lang="en">Roles with interest</span>
              </div>
            </div>
            <div className="p-5 bg-[#EEE8D8] border border-[#0A4B68]/10 rounded-sm">
              <div className="text-3xl font-display font-bold text-[#0A4B68]">
                {memberIds.length}
              </div>
              <div className="text-xs text-[#0A4B68]/60 mt-1">
                <span lang="cy">Aelodau â diddordeb</span>
                <span className="block italic" lang="en">Interested members</span>
              </div>
            </div>
          </div>

          {byRole.size === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[#0A4B68]/50 italic" lang="cy">
                Dim diddordeb wedi&apos;i gyflwyno eto.
              </p>
              <p className="text-sm text-[#0A4B68]/40 italic mt-1" lang="en">
                No interest submissions yet.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {Array.from(byRole.entries()).map(([slug, { title, items }]) => (
                <section key={slug} aria-labelledby={`role-${slug}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2
                        id={`role-${slug}`}
                        className="font-display text-lg font-bold text-[#0A4B68]"
                      >
                        {title}
                      </h2>
                      <Link
                        href={`/cyfrannu/${slug}`}
                        className="text-xs text-[#C07E00] hover:text-[#0A4B68] underline underline-offset-2 transition-colors"
                      >
                        /cyfrannu/{slug}
                      </Link>
                    </div>
                    <span className="text-xs font-medium text-[#0A4B68]/50">
                      {items?.length ?? 0}{" "}
                      <span lang="cy">ymateb</span>
                    </span>
                  </div>

                  <div className="divide-y divide-[#0A4B68]/8 border border-[#0A4B68]/10 rounded-sm overflow-hidden">
                    {(items ?? []).map((item) => {
                      const m = memberMap.get(item.member_id);
                      const date = new Date(item.created_at).toLocaleDateString("cy-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                      return (
                        <div key={item.id} className="p-5 bg-white">
                          <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                            <div>
                              <p className="font-medium text-sm text-[#0A4B68]">
                                {m?.full_name ?? "—"}
                              </p>
                              <p className="text-xs text-[#0A4B68]/50">{m?.email ?? "—"}</p>
                            </div>
                            <time
                              dateTime={item.created_at}
                              className="text-xs text-[#0A4B68]/40 shrink-0"
                            >
                              {date}
                            </time>
                          </div>
                          {item.statement ? (
                            <blockquote className="mt-3 pl-3 border-l-2 border-[#C07E00]/40 text-sm text-[#0A4B68]/70 italic leading-relaxed">
                              {item.statement}
                            </blockquote>
                          ) : (
                            <p className="mt-2 text-xs text-[#0A4B68]/30 italic" lang="en">
                              No statement provided.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
