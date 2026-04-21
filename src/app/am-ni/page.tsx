import { draftMode } from "next/headers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftModeBanner } from "@/components/ui/draft-mode-banner";
import { getSiteSettings } from "@/sanity/queries";
import { sanityDraftClient } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/portable-text-components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Amdanom Ni / About — Ynni Cymunedol Llanfairfechan",
};

// Fallback principles shown when the CMS document has no principles yet.
// These match the initialValue in the siteSettings schema so editors see the
// same text whether they have set the field or not.
const FALLBACK_PRINCIPLES = [
  { _key: "p1", cy: "Cymraeg yn gyntaf", en: "Welsh first" },
  { _key: "p2", cy: "Cymunedol cyn corfforaethol", en: "Community before corporate" },
  { _key: "p3", cy: "Hygyrch fel rhagosodiad", en: "Accessible by default" },
  { _key: "p4", cy: "Cost gweithredu isel", en: "Low operational cost" },
];

export default async function AboutPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? sanityDraftClient : undefined;
  const settings = await getSiteSettings(client);

  const principles =
    settings?.principles && settings.principles.length > 0
      ? settings.principles
      : FALLBACK_PRINCIPLES;

  return (
    <>
      {isDraftMode && <DraftModeBanner />}
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
            {settings?.aboutSummary_cy && settings.aboutSummary_cy.length > 0 ? (
              <>
                <div lang="cy" className="text-[#0A4B68]/80">
                  <PortableText value={settings.aboutSummary_cy as Parameters<typeof PortableText>[0]["value"]} components={portableTextComponents} />
                </div>
                {settings.aboutSummary_en && settings.aboutSummary_en.length > 0 && (
                  <div lang="en" className="italic text-[#0A4B68]/50 pl-4 border-l-2 border-[#C07E00]/40">
                    <PortableText value={settings.aboutSummary_en as Parameters<typeof PortableText>[0]["value"]} components={portableTextComponents} />
                  </div>
                )}
              </>
            ) : (
              <p className="text-[#0A4B68]/60 italic">
                <span lang="cy">Yn dod yn fuan.</span>{" "}
                <span lang="en">Coming soon.</span>
              </p>
            )}

            {/* CIC principles — managed in Sanity under Site Settings → Principles */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map(({ _key, cy, en }) => (
                <div key={_key} className="flex flex-col gap-1 p-4 bg-[#0A4B68]/5 rounded-sm border-l-2 border-[#C07E00]">
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
