import { draftMode } from "next/headers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftModeBanner } from "@/components/ui/draft-mode-banner";
import { getNewsPosts } from "@/sanity/queries";
import { sanityDraftClient } from "@/sanity/client";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newyddion / News — Ynni Cymunedol Llanfairfechan",
};

export default async function NewsIndexPage() {
  const { isEnabled: isDraftMode } = await draftMode();
  const posts = await getNewsPosts(isDraftMode ? sanityDraftClient : undefined);

  return (
    <>
      {isDraftMode && <DraftModeBanner />}
      <Header />
      <main id="main-content" className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68]">Newyddion</h1>
            <p lang="en" className="italic text-[#0A4B68]/60 mt-2 pl-4 border-l-2 border-[#C07E00]">News</p>
          </div>
          {posts.length === 0 ? (
            <p className="text-[#0A4B68]/60 italic">
              <span lang="cy">Dim newyddion ar hyn o bryd.</span>{" "}
              <span lang="en">No news yet.</span>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/newyddion/${post.slug.current}`}
                  className="group flex flex-col gap-3 p-6 bg-white/50 border border-[#0A4B68]/10 rounded-sm hover:border-[#0A4B68]/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
                >
                  <time dateTime={post.publishedAt} className="text-xs text-[#C07E00] font-medium tracking-wide">
                    {new Date(post.publishedAt).toLocaleDateString("cy-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </time>
                  <h2 lang="cy" className="font-display font-semibold text-[#0A4B68] group-hover:text-[#C07E00] transition-colors leading-snug">{post.title_cy}</h2>
                  {post.title_en && <p lang="en" className="text-sm italic text-[#0A4B68]/50">{post.title_en}</p>}
                  {post.excerpt_cy && <p lang="cy" className="text-sm text-[#0A4B68]/70 leading-relaxed line-clamp-3">{post.excerpt_cy}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
