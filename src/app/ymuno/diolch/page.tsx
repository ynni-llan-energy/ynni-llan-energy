import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diolch am ymuno | Ynni Cymunedol Llanfairfechan",
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">✉️</div>
          <h1 className="font-display text-3xl font-bold text-[#0A4B68] mb-3" lang="cy">
            Diolch am ymuno!
          </h1>
          <p className="italic text-[#0A4B68]/60 text-sm mb-6" lang="en">
            Thank you for joining!
          </p>
          <div className="bg-white/60 border border-[#0A4B68]/10 rounded-sm p-6 text-sm text-[#0A4B68]/80 space-y-3">
            <p lang="cy">
              Anfonwyd e-bost atoch i gadarnhau eich cyfeiriad. Cliciwch y ddolen yn yr e-bost i actifadu eich cyfrif.
            </p>
            <p className="italic text-[#0A4B68]/50 text-xs" lang="en">
              We&apos;ve sent you a confirmation email. Click the link in the email to activate your account.
            </p>
          </div>
          <p className="mt-8 text-sm text-[#0A4B68]/60">
            <Link
              href="/"
              className="text-[#C07E00] hover:text-[#0A4B68] underline underline-offset-2 transition-colors"
            >
              <span lang="cy">Yn ôl i&apos;r hafan</span>
              <span className="italic opacity-70" lang="en"> / Back to home</span>
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
