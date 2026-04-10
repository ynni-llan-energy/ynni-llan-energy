import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftModeBanner } from "@/components/ui/draft-mode-banner";
import { getNewsPost, getNewsPosts } from "@/sanity/queries";
import { sanityDraftClient } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getNewsPosts();
    return posts.map((post) => ({ slug: post.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return {};
  return { title: `${post.title_cy} / ${post.title_en} — Ynni Cymunedol Llanfairfechan` };
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const client = isDraftMode ? sanityDraftClient : undefined;
  const post = await getNewsPost(slug, client);

  if (!post) notFound();

  return (
    <>
      {isDraftMode && <DraftModeBanner />}
      <Header />
      <main id="main-content" className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <a href="/newyddion" className="text-sm text-[#C07E00] hover:text-[#0A4B68] underline underline-offset-2 transition-colors mb-8 inline-block">
            ← <span lang="cy">Newyddion</span> <span lang="en" className="italic opacity-60">/ News</span>
          </a>
          <header className="mb-10">
            <time dateTime={post.publishedAt} className="text-xs text-[#C07E00] font-medium tracking-wide block mb-4">
              {new Date(post.publishedAt).toLocaleDateString("cy-GB", { day: "numeric", month: "long", year: "numeric" })}
            </time>
            <h1 lang="cy" className="font-display text-4xl sm:text-5xl font-bold text-[#0A4B68] leading-tight mb-3">{post.title_cy}</h1>
            <p lang="en" className="text-xl italic text-[#0A4B68]/60 pl-4 border-l-2 border-[#C07E00]">{post.title_en}</p>
            {post.author && (
              <p className="mt-4 text-sm text-[#0A4B68]/60">
                <span lang="cy">{post.author.name}</span>
                {post.author.role_cy && <span className="ml-2 opacity-60">— {post.author.role_cy}</span>}
              </p>
            )}
          </header>
          {post.body_cy && post.body_cy.length > 0 && (
            <div lang="cy" className="prose prose-slate max-w-none mb-10 [&>p]:text-[#0A4B68]/80 [&>h2]:font-display [&>h2]:text-[#0A4B68] [&>h3]:font-display [&>h3]:text-[#0A4B68]">
              <PortableText value={post.body_cy as Parameters<typeof PortableText>[0]["value"]} />
            </div>
          )}
          {post.body_en && post.body_en.length > 0 && (
            <div lang="en" className="border-t border-[#0A4B68]/10 pt-8 mt-8">
              <p className="text-xs uppercase tracking-widest text-[#C07E00] mb-4 font-medium">English</p>
              <div className="prose prose-slate max-w-none italic [&>p]:text-[#0A4B68]/60 [&>h2]:font-display [&>h2]:text-[#0A4B68] [&>h3]:font-display [&>h3]:text-[#0A4B68]">
                <PortableText value={post.body_en as Parameters<typeof PortableText>[0]["value"]} />
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
