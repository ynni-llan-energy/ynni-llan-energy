import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProfileForm } from "@/components/auth/profile-form";
import { signOut } from "@/app/actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fy Nghyfrif | Ynni Cymunedol Llanfairfechan",
};

export default async function MemberDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/mewngofnodi");
  }

  const { data: member } = await supabase
    .from("members")
    .select("full_name, status, eligible_to_vote, postcode, joined_at")
    .eq("id", user.id)
    .single();

  const joinedAt = member?.joined_at
    ? new Date(member.joined_at).toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Page heading */}
          <div className="mb-10">
            <h1
              className="font-display text-3xl font-bold text-[#0A4B68]"
              lang="cy"
            >
              Fy Nghyfrif
            </h1>
            <p className="italic text-[#0A4B68]/60 text-sm mt-1" lang="en">
              My Account
            </p>
            {joinedAt && (
              <p className="text-xs text-[#0A4B68]/40 mt-2">
                <span lang="cy">Ymunwyd:</span>{" "}
                <span lang="en" className="italic">Joined:</span>{" "}
                <time>{joinedAt}</time>
              </p>
            )}
          </div>

          {/* Verification notice */}
          {!member?.eligible_to_vote && (
            <div className="mb-8 p-5 rounded-sm border border-[#E09800]/40 bg-[#E09800]/10">
              <div className="flex gap-3">
                <span className="text-[#E09800] text-lg mt-0.5" aria-hidden>⚠</span>
                <div>
                  <p className="text-sm font-medium text-[#0A4B68]" lang="cy">
                    Nid ydych wedi eich dilysu eto ar gyfer pleidleisio.
                  </p>
                  <p className="text-xs italic text-[#0A4B68]/60 mt-1" lang="en">
                    You have not yet been verified for voting.
                  </p>
                  <p className="text-sm text-[#0A4B68]/80 mt-3" lang="cy">
                    Er mwyn cymryd rhan mewn pleidleisiau, bydd angen i ni wirio
                    eich bod chi&apos;n breswylydd go iawn yn ardal Llanfairfechan.
                    Cysylltwch â ni i gael rhagor o wybodaeth.
                  </p>
                  <p className="text-xs italic text-[#0A4B68]/50 mt-2" lang="en">
                    To participate in votes, we need to verify that you are a
                    genuine resident of the Llanfairfechan area. Please contact
                    us for more information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Member status badge */}
          <div className="mb-8 flex items-center gap-3">
            <span className="text-sm text-[#0A4B68]/60" lang="cy">Statws:</span>
            <MemberStatusBadge status={member?.status ?? "pending"} />
            {member?.eligible_to_vote && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2B8050]/10 text-[#2B8050] text-xs font-medium">
                <span aria-hidden>✓</span>
                <span lang="cy">Dilysedig i bleidleisio</span>
              </span>
            )}
          </div>

          {/* Profile form */}
          <section
            className="bg-white/60 border border-[#0A4B68]/10 rounded-sm p-6"
            aria-labelledby="profile-heading"
          >
            <h2
              id="profile-heading"
              className="font-display text-lg font-bold text-[#0A4B68] mb-5"
              lang="cy"
            >
              Fy Manylion
              <span className="block font-sans font-normal italic text-sm text-[#0A4B68]/60 mt-0.5" lang="en">
                My Details
              </span>
            </h2>
            <ProfileForm
              defaultValues={{
                full_name: member?.full_name ?? null,
                postcode: member?.postcode ?? null,
              }}
            />
          </section>

          {/* Sign out */}
          <div className="mt-10 pt-6 border-t border-[#0A4B68]/10">
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-[#0A4B68]/50 hover:text-[#0A4B68] underline underline-offset-2 transition-colors"
              >
                <span lang="cy">Allgofnodi</span>
                <span className="italic opacity-70" lang="en"> / Sign out</span>
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function MemberStatusBadge({ status }: { status: string }) {
  const config: Record<string, { cy: string; en: string; className: string }> = {
    pending: {
      cy: "Yn aros",
      en: "Pending",
      className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    },
    active: {
      cy: "Actif",
      en: "Active",
      className: "bg-green-50 text-green-700 border border-green-200",
    },
    suspended: {
      cy: "Wedi atal",
      en: "Suspended",
      className: "bg-red-50 text-red-700 border border-red-200",
    },
  };
  const c = config[status] ?? config.pending;
  return (
    <span
      className={`inline-flex gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${c.className}`}
    >
      <span lang="cy">{c.cy}</span>
      <span className="italic opacity-60" lang="en">/ {c.en}</span>
    </span>
  );
}
