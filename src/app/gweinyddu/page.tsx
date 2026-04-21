import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { verifyMember, revokeMembership } from "@/app/actions/admin";
import { ConfirmForm } from "@/components/admin/confirm-form";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gweinyddu Aelodaeth | Ynni Cymunedol Llanfairfechan",
};

export default async function AdminDashboard() {
  // ── Auth + admin guard ────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/mewngofnodi");

  const { data: currentMember } = await supabase
    .from("members")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  if (!currentMember?.is_admin) redirect("/aelodau");

  // ── Fetch all members (service role bypasses RLS) ─────────────────────────
  const service = createServiceClient();
  const { data: allMembers } = await service
    .from("members")
    .select(
      "id, full_name, email, postcode, status, joined_at, approved_at, membership_expires_at, is_admin"
    )
    .order("joined_at", { ascending: false });

  const members = allMembers ?? [];

  const queue = members.filter((m) =>
    m.status === "pending" || m.status === "expired"
  );
  const active = members.filter((m) => m.status === "active" && !m.is_admin);
  const suspended = members.filter((m) => m.status === "suspended");

  // ── Helpers ───────────────────────────────────────────────────────────────
  function fmtDate(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("cy-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* ── Page heading ─────────────────────────────────────────── */}
          <div className="mb-10">
            <h1
              className="font-display text-3xl font-bold text-[#0A4B68]"
              lang="cy"
            >
              Gweinyddu Aelodaeth
            </h1>
            <p className="italic text-[#0A4B68]/60 text-sm mt-1" lang="en">
              Membership Administration
            </p>
            <p className="text-xs text-[#0A4B68]/40 mt-2">
              <span lang="cy">Wedi mewngofnodi fel:</span>{" "}
              <span lang="en" className="italic">Signed in as:</span>{" "}
              {currentMember.full_name ?? user.email}
            </p>
          </div>

          {/* ── Summary counts ───────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <StatCard
              count={queue.length}
              labelCy="Yn Aros am Ddilysu"
              labelEn="Awaiting Verification"
              highlight={queue.length > 0}
            />
            <StatCard
              count={active.length}
              labelCy="Aelodau Actif"
              labelEn="Active Members"
            />
            <StatCard
              count={suspended.length}
              labelCy="Wedi eu Hatal"
              labelEn="Suspended"
              highlight={suspended.length > 0}
            />
          </div>

          {/* ── Verification queue ───────────────────────────────────── */}
          <Section
            id="ciw-dilysu"
            titleCy="Yn Aros am Ddilysu"
            titleEn="Awaiting Verification"
            empty={queue.length === 0}
            emptyCy="Dim ceisiadau ar y gweill."
            emptyEn="No pending applications."
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0A4B68]/10 text-left">
                  <Th cy="Enw" en="Name" />
                  <Th cy="E-bost" en="Email" />
                  <Th cy="Cod Post" en="Postcode" />
                  <Th cy="Statws" en="Status" />
                  <Th cy="Dyddiad" en="Date" />
                  <th className="py-2 px-3" />
                </tr>
              </thead>
              <tbody>
                {queue.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-[#0A4B68]/5 hover:bg-[#0A4B68]/5 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-[#0A4B68]">
                      {m.full_name ?? <span className="text-[#0A4B68]/40 italic">—</span>}
                    </td>
                    <td className="py-3 px-3 text-[#0A4B68]/70">{m.email}</td>
                    <td className="py-3 px-3 text-[#0A4B68]/70">
                      {m.postcode ?? <span className="text-[#0A4B68]/40 italic">—</span>}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="py-3 px-3 text-[#0A4B68]/60 text-xs">
                      {m.status === "expired"
                        ? fmtDate(m.membership_expires_at)
                        : fmtDate(m.joined_at)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <form action={verifyMember.bind(null, m.id)}>
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded text-xs font-semibold bg-[#2B8050] text-white hover:bg-[#236640] transition-colors"
                        >
                          <span lang="cy">Dilysu</span>
                          <span className="ml-1 opacity-70 italic" lang="en">/ Verify</span>
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* ── Active members ───────────────────────────────────────── */}
          <Section
            id="aelodau-actif"
            titleCy="Aelodau Actif"
            titleEn="Active Members"
            empty={active.length === 0}
            emptyCy="Dim aelodau actif."
            emptyEn="No active members."
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0A4B68]/10 text-left">
                  <Th cy="Enw" en="Name" />
                  <Th cy="E-bost" en="Email" />
                  <Th cy="Cod Post" en="Postcode" />
                  <Th cy="Cymeradwywyd" en="Approved" />
                  <Th cy="Yn Dod i Ben" en="Expires" />
                  <th className="py-2 px-3" />
                </tr>
              </thead>
              <tbody>
                {active.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-[#0A4B68]/5 hover:bg-[#0A4B68]/5 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-[#0A4B68]">
                      {m.full_name ?? <span className="text-[#0A4B68]/40 italic">—</span>}
                    </td>
                    <td className="py-3 px-3 text-[#0A4B68]/70">{m.email}</td>
                    <td className="py-3 px-3 text-[#0A4B68]/70">
                      {m.postcode ?? <span className="text-[#0A4B68]/40 italic">—</span>}
                    </td>
                    <td className="py-3 px-3 text-[#0A4B68]/60 text-xs">
                      {fmtDate(m.approved_at)}
                    </td>
                    <td className="py-3 px-3 text-xs">
                      <ExpiryCell expiresAt={m.membership_expires_at} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <ConfirmForm
                        action={revokeMembership.bind(null, m.id)}
                        confirmMessage={`Dirymu aelodaeth ${m.full_name ?? m.email}?\nRevoke membership for ${m.full_name ?? m.email}?`}
                      >
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                        >
                          <span lang="cy">Dirymu</span>
                          <span className="ml-1 opacity-70 italic" lang="en">/ Revoke</span>
                        </button>
                      </ConfirmForm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* ── Volunteer interest link ──────────────────────────────── */}
          <section
            className="mb-10 bg-white/60 border border-[#0A4B68]/10 rounded-sm overflow-hidden"
            aria-labelledby="cyfrannu-heading"
          >
            <div className="px-6 py-4 border-b border-[#0A4B68]/10 bg-[#0A4B68]/5">
              <h2
                id="cyfrannu-heading"
                className="font-display font-bold text-[#0A4B68]"
                lang="cy"
              >
                Diddordeb Gwirfoddoli
                <span
                  className="ml-2 font-sans font-normal italic text-sm text-[#0A4B68]/60"
                  lang="en"
                >
                  / Volunteer Interest
                </span>
              </h2>
            </div>
            <div className="px-6 py-5 flex items-center justify-between gap-4">
              <p className="text-sm text-[#0A4B68]/70">
                <span lang="cy">Gweld ceisiadau diddordeb mewn rolau gwirfoddoli.</span>{" "}
                <span className="italic text-[#0A4B68]/50" lang="en">
                  View volunteer role interest submissions.
                </span>
              </p>
              <a
                href="/gweinyddu/cyfrannu"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#0A4B68] text-[#EEE8D8] text-sm font-medium hover:bg-[#083a52] transition-colors"
              >
                <span lang="cy">Gweld</span>
                <span className="opacity-60 text-xs italic" lang="en">/ View</span>
              </a>
            </div>
          </section>

          {/* ── Suspended members ────────────────────────────────────── */}
          {suspended.length > 0 && (
            <Section
              id="wedi-hatal"
              titleCy="Wedi eu Hatal"
              titleEn="Suspended"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#0A4B68]/10 text-left">
                    <Th cy="Enw" en="Name" />
                    <Th cy="E-bost" en="Email" />
                    <Th cy="Cod Post" en="Postcode" />
                    <th className="py-2 px-3" />
                  </tr>
                </thead>
                <tbody>
                  {suspended.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-[#0A4B68]/5 hover:bg-[#0A4B68]/5 transition-colors"
                    >
                      <td className="py-3 px-3 font-medium text-[#0A4B68]">
                        {m.full_name ?? <span className="text-[#0A4B68]/40 italic">—</span>}
                      </td>
                      <td className="py-3 px-3 text-[#0A4B68]/70">{m.email}</td>
                      <td className="py-3 px-3 text-[#0A4B68]/70">
                        {m.postcode ?? <span className="text-[#0A4B68]/40 italic">—</span>}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {/* Reinstate by re-verifying through the normal queue:
                            update to pending so the admin can explicitly approve. */}
                        <form action={verifyMember.bind(null, m.id)}>
                          <input type="hidden" name="_fromSuspended" value="1" />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded text-xs font-semibold bg-[#0A4B68]/10 text-[#0A4B68] hover:bg-[#0A4B68]/20 transition-colors"
                          >
                            <span lang="cy">Ailadfer</span>
                            <span className="ml-1 opacity-70 italic" lang="en">/ Reinstate</span>
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  count,
  labelCy,
  labelEn,
  highlight = false,
}: {
  count: number;
  labelCy: string;
  labelEn: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-sm border text-center ${
        highlight && count > 0
          ? "border-[#E09800]/40 bg-[#E09800]/10"
          : "border-[#0A4B68]/10 bg-white/60"
      }`}
    >
      <p
        className={`text-3xl font-bold font-display ${
          highlight && count > 0 ? "text-[#E09800]" : "text-[#0A4B68]"
        }`}
      >
        {count}
      </p>
      <p className="text-xs font-medium text-[#0A4B68] mt-1" lang="cy">
        {labelCy}
      </p>
      <p className="text-xs italic text-[#0A4B68]/50" lang="en">
        {labelEn}
      </p>
    </div>
  );
}

function Section({
  id,
  titleCy,
  titleEn,
  children,
  empty,
  emptyCy,
  emptyEn,
}: {
  id?: string;
  titleCy: string;
  titleEn: string;
  children?: React.ReactNode;
  empty?: boolean;
  emptyCy?: string;
  emptyEn?: string;
}) {
  return (
    <section
      id={id}
      className="mb-10 bg-white/60 border border-[#0A4B68]/10 rounded-sm overflow-hidden"
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className="px-6 py-4 border-b border-[#0A4B68]/10 bg-[#0A4B68]/5">
        <h2
          id={id ? `${id}-heading` : undefined}
          className="font-display font-bold text-[#0A4B68]"
          lang="cy"
        >
          {titleCy}
          <span
            className="ml-2 font-sans font-normal italic text-sm text-[#0A4B68]/60"
            lang="en"
          >
            / {titleEn}
          </span>
        </h2>
      </div>
      <div className="px-6 py-4">
        {empty ? (
          <p className="text-sm text-[#0A4B68]/50 py-4 text-center">
            <span lang="cy">{emptyCy}</span>
            {emptyEn && (
              <span className="italic ml-1 opacity-70" lang="en">
                {emptyEn}
              </span>
            )}
          </p>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function Th({ cy, en }: { cy: string; en: string }) {
  return (
    <th className="py-2 px-3 text-xs font-semibold text-[#0A4B68]/60">
      <span lang="cy">{cy}</span>
      <span className="ml-1 italic opacity-70" lang="en">
        / {en}
      </span>
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { cy: string; en: string; className: string }> =
    {
      pending: {
        cy: "Yn aros",
        en: "Pending",
        className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      },
      expired: {
        cy: "Wedi dod i ben",
        en: "Expired",
        className: "bg-orange-50 text-orange-700 border border-orange-200",
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
      className={`inline-flex gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.className}`}
    >
      <span lang="cy">{c.cy}</span>
      <span className="italic opacity-60" lang="en">
        / {c.en}
      </span>
    </span>
  );
}

function ExpiryCell({ expiresAt }: { expiresAt: string | null }) {
  if (!expiresAt) return <span className="text-[#0A4B68]/40 italic">—</span>;

  const expires = new Date(expiresAt);
  const now = new Date();
  const daysLeft = Math.ceil(
    (expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const dateStr = expires.toLocaleDateString("cy-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (daysLeft <= 30) {
    return (
      <span className="text-[#E09800] font-medium">
        {dateStr}
        <span className="block text-xs font-normal opacity-80">
          ({daysLeft}d)
        </span>
      </span>
    );
  }

  return <span className="text-[#0A4B68]/60">{dateStr}</span>;
}
