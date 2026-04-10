import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mewngofnodi | Ynni Cymunedol Llanfairfechan",
  description: "Mewngofnodwch i'ch cyfrif aelod. Log in to your member account.",
};

interface PageProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const callbackError = params.error;

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-[#0A4B68]" lang="cy">
              Mewngofnodi
            </h1>
            <p className="italic text-[#0A4B68]/60 text-sm mt-2" lang="en">
              Log in to your account
            </p>
          </div>

          <div className="bg-white/60 border border-[#0A4B68]/10 rounded-sm p-8">
            <LoginForm callbackError={callbackError} />
          </div>

          <p className="text-center text-sm text-[#0A4B68]/60 mt-6">
            <span lang="cy">Heb gyfrif eto?</span>{" "}
            <span className="italic opacity-70" lang="en">No account yet?</span>{" "}
            <Link
              href="/ymuno"
              className="text-[#C07E00] hover:text-[#0A4B68] underline underline-offset-2 transition-colors"
            >
              <span lang="cy">Ymunwch am ddim</span>
              <span className="italic opacity-70" lang="en"> / Join for free</span>
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
