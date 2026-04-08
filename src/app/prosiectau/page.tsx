import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getProjects } from "@/sanity/queries";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prosiectau / Projects — Ynni Cymunedol Llanfairfechan",
};

const statusLabel: Record<string, { cy: string; en: string; colour: string }> = {
  proposed:       { cy: "Arfaethedig",    en: "Proposed",       colour: "text-[#0A4B68]" },
  in_development: { cy: "Yn datblygu",    en: "In development", colour: "text-[#E09800]" },
  active:         { cy: "Actif",          en: "Active",         colour: "text-[#2B8050]" },
  completed:      { cy: "Wedi cwblhau",   en: "Completed",      colour: "text-[#0A4B68]/50" },
};

export default async function ProjectsIndexPage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="mb-12">
            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68]">
              Prosiectau
            </h1>
            <p lang="en" className="italic text-[#0A4B68]/60 mt-2 pl-4 border-l-2 border-[#C07E00]">
              Projects
            </p>
          </div>

          {projects.length === 0 ? (
            <p className="text-[#0A4B68]/60 italic">
              <span lang="cy">Dim prosiectau ar hyn o bryd.</span>{" "}
              <span lang="en">No projects yet.</span>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => {
                const status = statusLabel[project.status] ?? { cy: project.status, en: project.status, colour: "text-[#0A4B68]" };
                return (
                  <Link
                    key={project._id}
                    href={`/prosiectau/${project.slug.current}`}
                    className="group flex flex-col gap-4 p-8 bg-[#EEE8D8] border border-[#0A4B68]/10 rounded-sm hover:border-[#0A4B68]/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium uppercase tracking-wide ${status.colour}`}>
                        <span lang="cy">{status.cy}</span>
                        <span className="opacity-50 mx-1">/</span>
                        <span lang="en" className="italic">{status.en}</span>
                      </span>
                      {project.capacityKw && (
                        <span className="text-xs text-[#C07E00] font-medium">{project.capacityKw} kW</span>
                      )}
                    </div>

                    <div>
                      <h2 lang="cy" className="font-display text-xl font-bold text-[#0A4B68] group-hover:text-[#C07E00] transition-colors leading-snug">
                        {project.title_cy}
                      </h2>
                      <p lang="en" className="text-sm italic text-[#0A4B68]/50 mt-1">
                        {project.title_en}
                      </p>
                    </div>

                    {project.summary_cy && (
                      <p lang="cy" className="text-sm text-[#0A4B68]/70 leading-relaxed">
                        {project.summary_cy}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
