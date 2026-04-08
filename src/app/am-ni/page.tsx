import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amdanom Ni / About — Ynni Cymunedol Llanfairfechan",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="mb-12">
            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68]">
              Amdanom Ni
            </h1>
            <p lang="en" className="italic text-[#0A4B68]/60 mt-2 pl-4 border-l-2 border-[#C07E00]">
              About Us
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {settings?.aboutSummary_cy ? (
              <>
                <p lang="cy" className="text-lg text-[#0A4B68]/80 leading-relaxed">
                  {settings.aboutSummary_cy}
                </p>
                {settings.aboutSummary_en && (
                  <p lang="en" className="text-base italic text-[#0A4B68]/50 pl-4 border-l-2 border-[#C07E00]/40 leading-relaxed">
                    {settings.aboutSummary_en}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[#0A4B68]/60 italic">
                <span lang="cy">Yn dod yn fuan.</span>{" "}
                <span lang="en">Coming soon.</span>
              </p>
            )}

            {/* CIC principles */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { cy: "Cymraeg yn gyntaf", en: "Welsh first" },
                { cy: "Cymunedol cyn corfforaethol", en: "Community before corporate" },
                { cy: "Hygyrch fel rhagosodiad", en: "Accessible by default" },
                { cy: "Cost gweithredu isel", en: "Low operational cost" },
              ].map(({ cy, en }) => (
                <div key={cy} className="flex flex-col gap-1 p-4 bg-[#0A4B68]/5 rounded-sm border-l-2 border-[#C07E00]">
                  <span lang="cy" className="font-display font-semibold text-[#0A4B68]">{cy}</span>
                  <span lang="en" className="text-sm italic text-[#0A4B68]/60">{en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
