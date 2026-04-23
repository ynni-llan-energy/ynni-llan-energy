import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getVolunteerRoles } from "@/sanity/queries";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cyfrannu / Volunteer — Ynni Cymunedol Llanfairfechan",
  description:
    "Rolau gwirfoddol sydd ar gael yn Ynni Cymunedol Llanfairfechan. Volunteer roles available with Llanfairfechan Community Energy.",
};

export default async function VolunteerIndexPage() {
  const roles = await getVolunteerRoles();

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="mb-12">
            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68]">
              Cyfrannu
            </h1>
            <p lang="en" className="italic text-[#0A4B68]/60 mt-2 pl-4 border-l-2 border-[#C07E00]">
              Volunteer with us
            </p>
            <p className="mt-6 text-base text-[#0A4B68]/80 max-w-2xl leading-relaxed" lang="cy">
              Fel grŵp cymunedol gwirfoddol, rydym yn dibynnu ar gefnogaeth aelodau&apos;r gymuned.
              Dyma&apos;r rolau rydym yn ceisio eu llenwi ar hyn o bryd — os oes gennych ddiddordeb,
              cysylltwch â ni.
            </p>
            <p className="mt-2 text-sm italic text-[#0A4B68]/50 max-w-2xl leading-relaxed" lang="en">
              As a volunteer-based community group, we rely on the support of community members.
              These are the roles we are currently looking to fill — if you&apos;re interested,
              please get in touch.
            </p>
          </div>

          {roles.length === 0 ? (
            <p className="text-[#0A4B68]/60 italic">
              <span lang="cy">Dim rolau ar gael ar hyn o bryd.</span>{" "}
              <span lang="en">No roles available at present.</span>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <Link
                  key={role._id}
                  href={`/cyfrannu/${role.slug.current}`}
                  className="group flex flex-col gap-4 p-8 bg-[#EEE8D8] border border-[#0A4B68]/10 rounded-sm hover:border-[#0A4B68]/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-[#2B8050]">
                      <span lang="cy">Ar gael</span>
                      <span className="opacity-50 mx-1">/</span>
                      <span lang="en" className="italic">Available</span>
                    </span>
                    {role.timeCommitment_en && (
                      <span className="text-xs text-[#C07E00] font-medium">
                        {role.timeCommitment_en}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 lang="cy" className="font-display text-xl font-bold text-[#0A4B68] group-hover:text-[#C07E00] transition-colors leading-snug">
                      {role.title_cy}
                    </h2>
                    <p lang="en" className="text-sm italic text-[#0A4B68]/50 mt-1">
                      {role.title_en}
                    </p>
                  </div>

                  {role.summary_cy && (
                    <p lang="cy" className="text-sm text-[#0A4B68]/70 leading-relaxed">
                      {role.summary_cy}
                    </p>
                  )}

                  {role.skills && role.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      {role.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex px-2 py-0.5 rounded-full bg-[#0A4B68]/8 text-[#0A4B68]/70 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
