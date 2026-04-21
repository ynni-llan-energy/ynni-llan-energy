import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProfileForm } from "@/components/auth/profile-form";
import { signOut } from "@/app/actions/auth";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
    .select(
      "full_name, status, eligible_to_vote, postcode, joined_at, membership_expires_at, is_admin"
    )
    .eq("id", user.id)
    .single();

  const joinedAt = member?.joined_at
    ? new Date(member.joined_at).toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const expiresAt = member?.membership_expires_at
    ? new Date(member.membership_expires_at)
    : null;

  const expiryDateStr = expiresAt
    ? expiresAt.toLocaleDateString("cy-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const daysUntilExpiry = expiresAt
    ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const status = member?.status ?? "pending";

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

          {/* Status-specific notices */}
          {status === "expired" && (
            <div className="mb-8 p-5 rounded-sm border border-[#E09800]/40 bg-[#E09800]/10">
              <div className="flex gap-3">
                <span className="text-[#E09800] text-lg mt-0.5" aria-hidden>↻</span>
                <div>
                  <p className="text-sm font-medium text-[#0A4B68]" lang="cy">
                    Mae eich aelodaeth wedi dod i ben a bydd angen ei hadnewyddu.
                  </p>
                  <p className="text-xs italic text-[#0A4B68]/60 mt-1" lang="en">
                    Your membership has expired and will need to be renewed.
                  </p>
                  <p className="text-sm text-[#0A4B68]/80 mt-3" lang="cy">
                    Bydd ein tîm aelodaeth yn adolygu eich cais adnewyddu ac yn
                    cysylltu â chi. Yn y cyfamser, gwiriwch fod eich manylion
                    isod yn gywir ac yn gyfredol.
                  </p>
                  <p className="text-xs italic text-[#0A4B68]/50 mt-2" lang="en">
                    Our membership team will review your renewal and be in
                    touch. In the meantime, please check that your details below
                    are correct and up to date.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "pending" && (
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

          {status === "active" &&
            daysUntilExpiry !== null &&
            daysUntilExpiry <= 30 && (
              <div className="mb-8 p-5 rounded-sm border border-[#E09800]/40 bg-[#E09800]/10">
                <div className="flex gap-3">
                  <span className="text-[#E09800] text-lg mt-0.5" aria-hidden>⚠</span>
                  <div>
                    <p className="text-sm font-medium text-[#0A4B68]" lang="cy">
                      Mae eich aelodaeth yn dod i ben mewn {daysUntilExpiry} diwrnod.
                    </p>
                    <p className="text-xs italic text-[#0A4B68]/60 mt-1" lang="en">
                      Your membership expires in {daysUntilExpiry} days.
                    </p>
                    <p className="text-sm text-[#0A4B68]/80 mt-3" lang="cy">
                      Bydd angen dilysu eich aelodaeth eto. Sicrhewch fod eich
                      manylion isod yn gywir a bydd ein tîm aelodaeth yn cysylltu
                      â chi ar ôl i&apos;ch aelodaeth ddod i ben.
                    </p>
                    <p className="text-xs italic text-[#0A4B68]/50 mt-2" lang="en">
                      Your membership will need to be re-verified. Please ensure
                      your details below are correct and our membership team will
                      be in touch after your membership expires.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {status === "suspended" && (
            <div className="mb-8 p-5 rounded-sm border border-red-200 bg-red-50">
              <div className="flex gap-3">
                <span className="text-red-600 text-lg mt-0.5" aria-hidden>✕</span>
                <div>
                  <p className="text-sm font-medium text-red-800" lang="cy">
                    Mae eich aelodaeth wedi ei hatal.
                  </p>
                  <p className="text-xs italic text-red-600/70 mt-1" lang="en">
                    Your membership has been suspended.
                  </p>
                  <p className="text-sm text-red-700/80 mt-3" lang="cy">
                    Cysylltwch â ni i gael rhagor o wybodaeth.
                  </p>
                  <p className="text-xs italic text-red-600/60 mt-2" lang="en">
                    Please contact us for more information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Member status badge */}
          <div className="mb-8 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-[#0A4B68]/60" lang="cy">Statws:</span>
            <MemberStatusBadge status={status} />
            {member?.eligible_to_vote && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2B8050]/10 text-[#2B8050] text-xs font-medium">
                <span aria-hidden>✓</span>
                <span lang="cy">Dilysedig i bleidleisio</span>
              </span>
            )}
            {expiryDateStr && status === "active" && (
              <span
                className={`text-xs ${
                  daysUntilExpiry !== null && daysUntilExpiry <= 30
                    ? "text-[#E09800] font-medium"
                    : "text-[#0A4B68]/40"
                }`}
              >
                <span lang="cy">Yn dod i ben:</span>{" "}
                <span lang="en" className="italic">Expires:</span>{" "}
                <time dateTime={member!.membership_expires_at!}>
                  {expiryDateStr}
                </time>
              </span>
            )}
          </div>

          {/* Profile section — heading, view/edit toggle, and form are
               all managed inside ProfileForm itself */}
          <ProfileForm
            defaultValues={{
              full_name: member?.full_name ?? null,
              postcode: member?.postcode ?? null,
            }}
          />

          {/* Admin panel — only rendered for admin users */}
          {member?.is_admin && (
            <section
              className="mt-8 bg-[#0A4B68]/5 border border-[#0A4B68]/15 rounded-sm p-6"
              aria-labelledby="admin-heading"
            >
              <h2
                id="admin-heading"
                className="font-display text-lg font-bold text-[#0A4B68] mb-1"
                lang="cy"
              >
                Gweinyddu
                <span className="block font-sans font-normal italic text-sm text-[#0A4B68]/60 mt-0.5" lang="en">
                  Administration
                </span>
              </h2>
              <p className="text-xs text-[#0A4B68]/50 mb-5 mt-2" lang="cy">
                Adnoddau ar gyfer gweinyddwyr y grŵp.{" "}
                <span lang="en" className="italic">Group administration tools.</span>
              </p>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/gweinyddu"
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-sm bg-white border border-[#0A4B68]/10 hover:border-[#0A4B68]/30 transition-colors group"
                  >
                    <div>
                      <span className="text-sm font-medium text-[#0A4B68] group-hover:text-[#C07E00] transition-colors block" lang="cy">
                        Gweinyddu Aelodaeth
                      </span>
                      <span className="text-xs italic text-[#0A4B68]/50" lang="en">
                        Membership administration
                      </span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-[#0A4B68]/30 group-hover:text-[#C07E00] transition-colors shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="/gweinyddu/cyfrannu"
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-sm bg-white border border-[#0A4B68]/10 hover:border-[#0A4B68]/30 transition-colors group"
                  >
                    <div>
                      <span className="text-sm font-medium text-[#0A4B68] group-hover:text-[#C07E00] transition-colors block" lang="cy">
                        Diddordeb Gwirfoddoli
                      </span>
                      <span className="text-xs italic text-[#0A4B68]/50" lang="en">
                        Volunteer interest submissions
                      </span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-[#0A4B68]/30 group-hover:text-[#C07E00] transition-colors shrink-0">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </a>
                </li>
              </ul>
            </section>
          )}

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
    expired: {
      cy: "Wedi dod i ben",
      en: "Expired",
      className: "bg-orange-50 text-orange-700 border border-orange-200",
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
