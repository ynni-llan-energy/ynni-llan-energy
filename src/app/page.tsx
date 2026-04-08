import { draftMode } from "next/headers";
import { Hero } from "@/components/home/hero";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftModeBanner } from "@/components/ui/draft-mode-banner";
import { WaveDivider } from "@/components/icons/wave-divider";
import { getSiteSettings, getProjects, getNewsPosts } from "@/sanity/queries";
import { sanityDraftClient } from "@/sanity/client";
import Link from "next/link";

export default async function HomePage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? sanityDraftClient : undefined;

  const [settings, projects, newsPosts] = await Promise.all([
    getSiteSettings(client),
    getProjects(client),
    getNewsPosts(client),
  ]);

  return (
    <>
      {isDraftMode && <DraftModeBanner />}
      <Header />

      <main id="main-content">
        <Hero
          heading_cy={settings?.heroHeading_cy}
          heading_en={settings?.heroHeading_en}
          body_cy={settings?.heroBody_cy ?? undefined}
          body_en={settings?.heroBody_en ?? undefined}
        />

        <WaveDivider lines={3} />

        {/* Stats bar */}
        <section className="bg-[#0A4B68] text-[#EEE8D8] py-12" aria-label="Ystadegau / Statistics">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col gap-1">
                <span className="font-display text-4xl font-bold text-[#E09800]">
                  {projects.length || "—"}
                </span>
                <span lang="cy" className="text-sm font-medium">Prosiectau</span>
                <span lang="en" className="text-xs italic text-[#EEE8D8]/50">Projects</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-4xl font-bold text-[#E09800]">—</span>
                <span lang="cy" className="text-sm font-medium">Aelodau</span>
                <span lang="en" className="text-xs italic text-[#EEE8D8]/50">Members</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-display text-4xl font-bold text-[#E09800]">—</span>
                <span lang="cy" className="text-sm font-medium">kWh a gynhyrchwyd</span>
                <span lang="en" className="text-xs italic text-[#EEE8D8]/50">kWh generated</span>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider lines={3} flip />

        {/* Latest news */}
        {newsPosts.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="news-heading">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between mb-10">
                <div>
                  <h2 id="news-heading" lang="cy" className="font-display text-3xl font-bold text-[#0A4B68]">
                    Newyddion Diweddar
                  </h2>
                  <p lang="en" className="italic text-[#0A4B68]/60 text-sm mt-1 pl-3 border-l border-[#C07E00]/40">
                    Latest News
                  </p>
                </div>
                <Link href="/newyddion" className="text-sm text-[#C07E00] hover:text-[#0A4B68] transition-colors underline underline-offset-2">
                  <span lang="cy">Gweld y cyfan</span>
                  <span lang="en" className="italic opacity-60"> / See all</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newsPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post._id}
                    href={`/newyddion/${post.slug.current}`}
                    className="group flex flex-col gap-3 p-6 bg-white/50 border border-[#0A4B68]/10 rounded-sm hover:border-[#0A4B68]/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
                  >
                    <time dateTime={post.publishedAt} className="text-xs text-[#C07E00] font-medium tracking-wide">
                      {new Date(post.publishedAt).toLocaleDateString("cy-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </time>
                    <h3 lang="cy" className="font-display font-semibold text-[#0A4B68] group-hover:text-[#C07E00] transition-colors leading-snug">
                      {post.title_cy}
                    </h3>
                    {post.title_en && <p lang="en" className="text-sm italic text-[#0A4B68]/50">{post.title_en}</p>}
                    {post.excerpt_cy && <p lang="cy" className="text-sm text-[#0A4B68]/70 leading-relaxed line-clamp-3">{post.excerpt_cy}</p>}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects preview */}
        {projects.length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A4B68]/5" aria-labelledby="projects-heading">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between mb-10">
                <div>
                  <h2 id="projects-heading" lang="cy" className="font-display text-3xl font-bold text-[#0A4B68]">
                    Ein Prosiectau
                  </h2>
                  <p lang="en" className="italic text-[#0A4B68]/60 text-sm mt-1 pl-3 border-l border-[#C07E00]/40">
                    Our Projects
                  </p>
                </div>
                <Link href="/prosiectau" className="text-sm text-[#C07E00] hover:text-[#0A4B68] transition-colors underline underline-offset-2">
                  <span lang="cy">Gweld y cyfan</span>
                  <span lang="en" className="italic opacity-60"> / See all</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 3).map((project) => (
                  <Link
                    key={project._id}
                    href={`/prosiectau/${project.slug.current}`}
                    className="group flex flex-col gap-3 p-6 bg-[#EEE8D8] border border-[#0A4B68]/10 rounded-sm hover:border-[#0A4B68]/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
                  >
                    <span className="text-xs font-medium text-[#2B8050] uppercase tracking-wide">{project.status.replace("_", " ")}</span>
                    <h3 lang="cy" className="font-display font-semibold text-[#0A4B68] group-hover:text-[#C07E00] transition-colors leading-snug">{project.title_cy}</h3>
                    {project.title_en && <p lang="en" className="text-sm italic text-[#0A4B68]/50">{project.title_en}</p>}
                    {project.summary_cy && <p lang="cy" className="text-sm text-[#0A4B68]/70 leading-relaxed line-clamp-3">{project.summary_cy}</p>}
                    {project.capacityKw && <p className="text-xs text-[#C07E00] font-medium mt-auto pt-2">{project.capacityKw} kW</p>}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
