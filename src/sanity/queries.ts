import { groq, type SanityClient } from "next-sanity";
import { sanityClient } from "./client";

// Returns true only when a real Sanity project ID has been provided.
// Without it, all query functions return empty/null results immediately so
// that `next build` succeeds before environment variables are configured
// (e.g. the first Vercel deployment before env vars have been set up).
const isSanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);

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

export interface VolunteerRoleSummary {
  _id: string;
  title_cy: string;
  title_en: string;
  slug: { current: string };
  status: "active" | "filled" | "closed";
  summary_cy: string;
  summary_en: string;
  timeCommitment_cy: string | null;
  timeCommitment_en: string | null;
  skills: string[] | null;
}

export interface VolunteerRole extends VolunteerRoleSummary {
  body_cy: unknown[];
  body_en: unknown[] | null;
  coverImage: SanityImageAsset | null;
}

export interface Principle {
  _key: string;
  cy: string;
  en: string;
}

export interface SiteSettings {
  heroHeading_cy: string;
  heroHeading_en: string;
  heroBody_cy: string | null;
  heroBody_en: string | null;
  aboutSummary_cy: unknown[] | null;
  aboutSummary_en: unknown[] | null;
  principles: Principle[] | null;
  contactIntro_cy: string | null;
  contactIntro_en: string | null;
  contactEmail: string | null;
  socialLinks: { platform: string; url: string }[];
}

export interface Page {
  _id: string;
  heading_cy: string;
  heading_en: string | null;
  body_cy: unknown[] | null;
  body_en: unknown[] | null;
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
  if (!isSanityConfigured) return [];
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
  if (!isSanityConfigured) return null;
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
  if (!isSanityConfigured) return [];
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
  if (!isSanityConfigured) return null;
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

const volunteerRoleSummaryFragment = groq`
  _id,
  title_cy,
  title_en,
  slug,
  status,
  summary_cy,
  summary_en,
  timeCommitment_cy,
  timeCommitment_en,
  skills
`;

export async function getVolunteerRoles(client: SanityClient = sanityClient): Promise<VolunteerRoleSummary[]> {
  if (!isSanityConfigured) return [];
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "volunteerRole" && status == "active"] | order(_createdAt asc) {
      ${volunteerRoleSummaryFragment}
    }`,
    {},
    isDraft ? draftFetchOptions : fetchOptions(60)
  );
}

export async function getVolunteerRole(slug: string, client: SanityClient = sanityClient): Promise<VolunteerRole | null> {
  if (!isSanityConfigured) return null;
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "volunteerRole" && slug.current == $slug][0] {
      ${volunteerRoleSummaryFragment},
      body_cy,
      body_en,
      coverImage { ..., asset-> }
    }`,
    { slug },
    isDraft ? draftFetchOptions : fetchOptions(60)
  );
}

export async function getSiteSettings(client: SanityClient = sanityClient): Promise<SiteSettings | null> {
  if (!isSanityConfigured) return null;
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "siteSettings"][0] {
      heroHeading_cy,
      heroHeading_en,
      heroBody_cy,
      heroBody_en,
      aboutSummary_cy,
      aboutSummary_en,
      principles[] { _key, cy, en },
      contactIntro_cy,
      contactIntro_en,
      contactEmail,
      socialLinks
    }`,
    {},
    isDraft ? draftFetchOptions : fetchOptions(300)
  );
}

/**
 * Fetch a generic content page by its Sanity document ID.
 * Known IDs: "page-aelodaeth", "page-hygyrchedd", "page-preifatrwydd"
 */
export async function getPage(id: string, client: SanityClient = sanityClient): Promise<Page | null> {
  if (!isSanityConfigured) return null;
  const isDraft = client !== sanityClient;
  return client.fetch(
    groq`*[_type == "page" && _id == $id][0] {
      _id,
      heading_cy,
      heading_en,
      body_cy,
      body_en
    }`,
    { id },
    isDraft ? draftFetchOptions : fetchOptions(300)
  );
}
