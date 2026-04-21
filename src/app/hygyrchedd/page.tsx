import { draftMode } from "next/headers";
import { PortableText } from "@portabletext/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftModeBanner } from "@/components/ui/draft-mode-banner";
import { getPage } from "@/sanity/queries";
import { sanityDraftClient } from "@/sanity/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hygyrchedd / Accessibility — Ynni Cymunedol Llanfairfechan",
};

export default async function AccessibilityPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? sanityDraftClient : undefined;
  const page = await getPage("page-hygyrchedd", client);

  const headingCy = page?.heading_cy ?? "Hygyrchedd";
  const headingEn = page?.heading_en ?? "Accessibility";

  return (
    <>
      {isDraftMode && <DraftModeBanner />}
      <Header />
      <main id="main-content" className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="mb-12">
            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68]">
              {headingCy}
            </h1>
            <p lang="en" className="italic text-[#0A4B68]/60 mt-2 pl-4 border-l-2 border-[#C07E00]">
              {headingEn}
            </p>
          </div>

          {page?.body_cy ? (
            <div className="flex flex-col gap-8">
              <div lang="cy" className="prose prose-slate max-w-none text-[#0A4B68]/80 leading-relaxed">
                <PortableText value={page.body_cy as Parameters<typeof PortableText>[0]["value"]} />
              </div>
              {page.body_en && (
                <div
                  lang="en"
                  className="prose prose-slate max-w-none text-sm italic text-[#0A4B68]/50 pl-4 border-l-2 border-[#C07E00]/40 leading-relaxed"
                >
                  <PortableText value={page.body_en as Parameters<typeof PortableText>[0]["value"]} />
                </div>
              )}
            </div>
          ) : (
            <p className="text-[#0A4B68]/60 italic">
              <span lang="cy">Yn dod yn fuan.</span>{" "}
              <span lang="en">Coming soon.</span>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
