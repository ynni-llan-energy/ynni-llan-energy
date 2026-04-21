import { draftMode } from "next/headers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftModeBanner } from "@/components/ui/draft-mode-banner";
import { getSiteSettings } from "@/sanity/queries";
import { sanityDraftClient } from "@/sanity/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cysylltu / Contact — Ynni Cymunedol Llanfairfechan",
};

export default async function ContactPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? sanityDraftClient : undefined;
  const settings = await getSiteSettings(client);

  // Fallback intro text matches the initialValue in the CMS schema
  const introCy =
    settings?.contactIntro_cy ??
    "Mae croeso i chi gysylltu \u00e2 ni gydag unrhyw gwestiynau am ein gwaith neu am aelodaeth.";
  const introEn =
    settings?.contactIntro_en ?? "We welcome enquiries about our work or membership.";

  return (
    <>
      {isDraftMode && <DraftModeBanner />}
      <Header />
      <main id="main-content" className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="mb-12">
            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68]">
              Cysylltu
            </h1>
            <p lang="en" className="italic text-[#0A4B68]/60 mt-2 pl-4 border-l-2 border-[#C07E00]">
              Contact
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p lang="cy" className="text-lg text-[#0A4B68]/80 leading-relaxed">
                {introCy}
              </p>
              <p lang="en" className="text-sm italic text-[#0A4B68]/50 mt-2 pl-3 border-l border-[#C07E00]/40 leading-relaxed">
                {introEn}
              </p>
            </div>

            {settings?.contactEmail && (
              <div className="flex flex-col gap-1">
                <p className="text-xs uppercase tracking-widest text-[#C07E00] font-medium">
                  E-bost / Email
                </p>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-lg text-[#0A4B68] hover:text-[#C07E00] underline underline-offset-2 transition-colors font-display"
                >
                  {settings.contactEmail}
                </a>
              </div>
            )}

            {/* Membership CTA */}
            <div className="mt-4 p-6 bg-[#0A4B68]/5 border border-[#0A4B68]/10 rounded-sm">
              <p lang="cy" className="font-display font-semibold text-[#0A4B68] mb-1">
                Ymuno fel aelod?
              </p>
              <p lang="en" className="text-sm italic text-[#0A4B68]/60 mb-4">
                Interested in becoming a member?
              </p>
              <a
                href="/aelodaeth"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A4B68] text-[#EEE8D8] text-sm font-medium rounded-sm hover:bg-[#083a52] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A4B68]"
              >
                <span lang="cy">Ymunwch â ni</span>
                <span lang="en" className="italic opacity-60">/ Join us</span>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
