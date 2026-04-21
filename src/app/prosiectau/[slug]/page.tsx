import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftModeBanner } from "@/components/ui/draft-mode-banner";
import { getProject, getProjects } from "@/sanity/queries";
import { sanityDraftClient } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/portable-text-components";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return { title: `${project.title_cy} / ${project.title_en} — Ynni Cymunedol Llanfairfechan` };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? sanityDraftClient : undefined;
  const project = await getProject(slug, client);

  if (!project) notFound();

  return (
    <>
      {isDraftMode && <DraftModeBanner />}
      <Header />
      <main id="main-content" className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <a href="/prosiectau" className="text-sm text-[#C07E00] hover:text-[#0A4B68] underline underline-offset-2 transition-colors mb-8 inline-block">
            ← <span lang="cy">Prosiectau</span> <span lang="en" className="italic opacity-60">/ Projects</span>
          </a>
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="text-xs font-medium text-[#2B8050] uppercase tracking-wide">{project.status.replace("_", " ")}</span>
              {project.capacityKw && <span className="text-xs text-[#C07E00] font-medium">{project.capacityKw} kW</span>}
              {project.location && <span className="text-xs text-[#0A4B68]/50">{project.location}</span>}
            </div>
            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68] leading-tight mb-3">{project.title_cy}</h1>
            <p lang="en" className="text-xl italic text-[#0A4B68]/60 pl-4 border-l-2 border-[#C07E00]">{project.title_en}</p>
            {project.summary_cy && <p lang="cy" className="mt-6 text-lg text-[#0A4B68]/80 leading-relaxed">{project.summary_cy}</p>}
          </header>
          {project.body_cy && project.body_cy.length > 0 && (
            <div lang="cy" className="text-[#0A4B68]/80 mb-10">
              <PortableText value={project.body_cy as Parameters<typeof PortableText>[0]["value"]} components={portableTextComponents} />
            </div>
          )}
          {project.body_en && project.body_en.length > 0 && (
            <div lang="en" className="border-t border-[#0A4B68]/10 pt-8 mt-8">
              <p className="text-xs uppercase tracking-widest text-[#C07E00] mb-4 font-medium">English</p>
              <div className="italic text-[#0A4B68]/60">
                <PortableText value={project.body_en as Parameters<typeof PortableText>[0]["value"]} components={portableTextComponents} />
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
