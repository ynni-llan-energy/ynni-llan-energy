import { createClient } from "next-sanity";

const sharedConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-04-07",
};

/** Public read client — CDN in production, direct in dev for instant updates */
export const sanityClient = createClient({
  ...sharedConfig,
  useCdn: process.env.NODE_ENV === "production",
});

/**
 * Draft-aware client — used when Next.js Draft Mode is enabled.
 * Fetches unpublished draft documents directly from Sanity's API.
 * Requires a valid API token with read access.
 */
export const sanityDraftClient = createClient({
  ...sharedConfig,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: "previewDrafts",
});

/** Write client — for server-side mutations (admin actions, email audit log) */
export const sanityWriteClient = createClient({
  ...sharedConfig,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
