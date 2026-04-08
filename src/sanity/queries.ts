import { groq, type SanityClient } from "next-sanity";
import { sanityClient } from "./client";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SanityImageAsset {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
  alt?: string;
}

export interface NewsPostSummary {
  _id: string;
  title_cy: string;
  title_en: string;
  slug: { current: string };
  publishedAt: string;
  excerpt_cy: string | null;
  excerpt_en: string | null;
  coverImage: SanityImageAsset | null;
}

export interface NewsPost extends NewsPostSummary {
  body_cy: unknown[];
  body_en: unknown[];
  author: { name: string; role_cy: string | null; role_en: string | null; image: SanityImageAsset | null } | null;
}

export interface ProjectSummary {
  _id: string;
  title_cy: string;
  title_en: string;
  slug: { current: string };
  status: string;
  summary_cy: string;
  summary_en: string;
  coverImage: SanityImageAsset | null;
  capacityKw: number | null;
}

export interface SiteSettings {
  heroHeading_cy: string;
  heroHeading_en: string;
  heroBody_cy: string | null;
  heroBody_en: string | null;
  aboutSummary_cy: string | null;
  aboutSummary_en: string | null;
  contactEmail: string | null;
  socialLinks: { platform: string; url: string }[];
}

// ─── Cache options ────────────────────────────────────────────────────────────
//
// In dev: bypass Next.js fetch cache so Studio changes appear immediately on reload.
// In production: use ISR revalidation. Draft client always bypasses cache.

const fetchOptions = (revalidate: number) =>
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" as const }
    : { next: { revalidate } };

// Draft mode always fetches fresh, uncached content
const draftFetchOptions = { cache: "no-store" as const };

// ─── Queries ─────────────────────────────────────────────────────────────────

const newsPostSummaryFragment = groq`
  _id,
  title_cy,
  title_en,
  slug,
  publishedAt,
  excerpt_cy,
  excerpt_en,
  coverImage { ..., asset-> }
`;

export async function getNewsPosts(client: SanityClient = sanityClient): Promise<NewsPostSummary[]> {
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "newsPost"] | order(publishedAt desc) {
      ${newsPostSummaryFragment}
    }`,
    {},
    isDraft ? draftFetchOptions : fetchOptions(60)
  );
}

export async function getNewsPost(slug: string, client: SanityClient = sanityClient): Promise<NewsPost | null> {
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "newsPost" && slug.current == $slug][0] {
      ${newsPostSummaryFragment},
      body_cy,
      body_en,
      author-> { name, role_cy, role_en, image { ..., asset-> } }
    }`,
    { slug },
    isDraft ? draftFetchOptions : fetchOptions(60)
  );
}

export async function getProjects(client: SanityClient = sanityClient): Promise<ProjectSummary[]> {
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "project"] | order(startDate desc) {
      _id,
      title_cy,
      title_en,
      slug,
      status,
      summary_cy,
      summary_en,
      coverImage { ..., asset-> },
      capacityKw
    }`,
    {},
    isDraft ? draftFetchOptions : fetchOptions(60)
  );
}

export async function getProject(slug: string, client: SanityClient = sanityClient) {
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "project" && slug.current == $slug][0] {
      _id,
      title_cy,
      title_en,
      slug,
      status,
      summary_cy,
      summary_en,
      body_cy,
      body_en,
      coverImage { ..., asset-> },
      capacityKw,
      location,
      startDate
    }`,
    { slug },
    isDraft ? draftFetchOptions : fetchOptions(60)
  );
}

export async function getSiteSettings(client: SanityClient = sanityClient): Promise<SiteSettings | null> {
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "siteSettings"][0] {
      heroHeading_cy,
      heroHeading_en,
      heroBody_cy,
      heroBody_en,
      aboutSummary_cy,
      aboutSummary_en,
      contactEmail,
      socialLinks
    }`,
    {},
    isDraft ? draftFetchOptions : fetchOptions(300)
  );
}
