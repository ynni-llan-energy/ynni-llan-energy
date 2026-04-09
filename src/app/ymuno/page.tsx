import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SignupForm } from "@/components/auth/signup-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ymuno | Ynni Cymunedol Llanfairfechan",
  description:
    "Ymunwch â Ynni Cymunedol Llanfairfechan. Join Ynni Cymunedol Llanfairfechan.",
};

export default function SignupPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-[#0A4B68]" lang="cy">
              Ymunwch â ni
            </h1>
            <p className="italic text-[#0A4B68]/60 text-sm mt-2" lang="en">
              Become a member
            </p>
            <p className="mt-4 text-sm text-[#0A4B68]/70" lang="cy">
              Mae aelodaeth am ddim ac yn agored i bawb.
            </p>
            <p className="text-xs italic text-[#0A4B68]/50 mt-1" lang="en">
              Membership is free and open to everyone.
            </p>
          </div>

          <div className="bg-white/60 border border-[#0A4B68]/10 rounded-sm p-8">
            <SignupForm />
          </div>

          <p className="text-center text-sm text-[#0A4B68]/60 mt-6">
            <span lang="cy">Eisoes yn aelod?</span>{" "}
            <span className="italic opacity-70" lang="en">Already a member?</span>{" "}
            <Link
              href="/mewngofnodi"
              className="text-[#C07E00] hover:text-[#0A4B68] underline underline-offset-2 transition-colors"
            >
              <span lang="cy">Mewngofnodwch</span>
              <span className="italic opacity-70" lang="en"> / Log in</span>
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
