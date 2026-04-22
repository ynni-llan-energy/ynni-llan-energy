import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftModeBanner } from "@/components/ui/draft-mode-banner";
import { getVolunteerRole, getVolunteerRoles } from "@/sanity/queries";
import { sanityDraftClient } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import { InterestForm } from "@/components/volunteer/interest-form";
import { createClient } from "@/lib/supabase/server";
import { ScrollToEnglish } from "@/components/ui/scroll-to-english";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const roles = await getVolunteerRoles();
    return roles.map((r) => ({ slug: r.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const role = await getVolunteerRole(slug);
  if (!role) return {};
  return {
    title: `${role.title_cy} / ${role.title_en} — Ynni Cymunedol Llanfairfechan`,
  };
}

export default async function VolunteerRolePage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? sanityDraftClient : undefined;
  const role = await getVolunteerRole(slug, client);

  if (!role) notFound();

  // Check auth status to decide what the interest form shows
  let isAuthenticated = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isAuthenticated = !!user;
  } catch {
    // Supabase not configured — treat as unauthenticated
  }

  return (
    <>
      {isDraftMode && <DraftModeBanner />}
      <Header />
      <main id="main-content" className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="flex items-center justify-between mb-8">
            <a
              href="/cyfrannu"
              className="text-sm text-[#C07E00] hover:text-[#0A4B68] underline underline-offset-2 transition-colors inline-block"
            >
              ← <span lang="cy">Cyfrannu</span>{" "}
              <span lang="en" className="italic opacity-60">/ Volunteer</span>
            </a>
            {role.body_en && role.body_en.length > 0 && <ScrollToEnglish />}
          </div>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="text-xs font-medium text-[#2B8050] uppercase tracking-wide">
                <span lang="cy">Ar gael</span>{" "}
                <span lang="en" className="italic opacity-60">/ Available</span>
              </span>
              {role.timeCommitment_en && (
                <span className="text-xs text-[#C07E00] font-medium">
                  {role.timeCommitment_en}
                </span>
              )}
            </div>

            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68] leading-tight mb-3">
              {role.title_cy}
            </h1>
            <p lang="en" className="text-xl italic text-[#0A4B68]/60 pl-4 border-l-2 border-[#C07E00]">
              {role.title_en}
            </p>

            {role.summary_cy && (
              <p lang="cy" className="mt-6 text-lg text-[#0A4B68]/80 leading-relaxed">
                {role.summary_cy}
              </p>
            )}
          </header>

          {/* Skills tags */}
          {role.skills && role.skills.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2 items-center">
              <span className="text-xs uppercase tracking-widest text-[#0A4B68]/40 font-medium mr-1">
                <span lang="cy">Sgiliau</span>{" "}
                <span lang="en" className="italic">/ Skills</span>
              </span>
              {role.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex px-2.5 py-1 rounded-full bg-[#EEE8D8] border border-[#0A4B68]/10 text-[#0A4B68]/70 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Time commitment detail */}
          {(role.timeCommitment_cy || role.timeCommitment_en) && (
            <div className="mb-8 p-4 rounded-sm bg-[#EEE8D8] border-l-2 border-[#C07E00]">
              <span className="text-xs uppercase tracking-widest text-[#0A4B68]/40 font-medium block mb-1">
                <span lang="cy">Ymrwymiad amser</span>{" "}
                <span lang="en" className="italic">/ Time commitment</span>
              </span>
              {role.timeCommitment_cy && (
                <p lang="cy" className="text-sm text-[#0A4B68]">{role.timeCommitment_cy}</p>
              )}
              {role.timeCommitment_en && (
                <p lang="en" className="text-xs italic text-[#0A4B68]/60">{role.timeCommitment_en}</p>
              )}
            </div>
          )}

          {/* Welsh full description */}
          {role.body_cy && role.body_cy.length > 0 && (
            <div
              lang="cy"
              className="prose prose-slate max-w-none mb-10 [&>p]:text-[#0A4B68]/80 [&>h2]:font-display [&>h2]:text-[#0A4B68] [&>h3]:font-display [&>h3]:text-[#0A4B68] [&>ul]:text-[#0A4B68]/80 [&>ol]:text-[#0A4B68]/80"
            >
              <PortableText value={role.body_cy as Parameters<typeof PortableText>[0]["value"]} />
            </div>
          )}

          {/* English full description */}
          {role.body_en && role.body_en.length > 0 && (
            <div id="en" lang="en" className="border-t border-[#0A4B68]/10 pt-8 mt-8">
              <p className="text-xs uppercase tracking-widest text-[#C07E00] mb-4 font-medium">English</p>
              <h2 lang="en" className="font-display text-2xl sm:text-3xl font-bold text-[#0A4B68] leading-tight mb-3">{role.title_en}</h2>
              {role.summary_en && <p lang="en" className="text-lg text-[#0A4B68]/80 leading-relaxed mb-6">{role.summary_en}</p>}
              <div className="prose prose-slate max-w-none italic [&>p]:text-[#0A4B68]/60 [&>h2]:font-display [&>h2]:text-[#0A4B68] [&>h3]:font-display [&>h3]:text-[#0A4B68]">
                <PortableText value={role.body_en as Parameters<typeof PortableText>[0]["value"]} />
              </div>
            </div>
          )}

          {/* PDF download */}
          <div className="mt-8 pt-6 border-t border-[#0A4B68]/10">
            <a
              href={`/cyfrannu/${role.slug.current}/pdf`}
              download={`${role.slug.current}-disgrifiad-rol.pdf`}
              className="inline-flex items-center gap-2 text-sm text-[#0A4B68]/60 hover:text-[#C07E00] transition-colors underline underline-offset-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span lang="cy">Lawrlwytho disgrifiad rôl (PDF)</span>
              <span lang="en" className="italic opacity-60">/ Download role description (PDF)</span>
            </a>
          </div>

          {/* Interest form */}
          <InterestForm
            roleSlug={role.slug.current}
            roleTitle={role.title_en}
            isAuthenticated={isAuthenticated}
          />

        </article>
      </main>
      <Footer />
    </>
  );
}
