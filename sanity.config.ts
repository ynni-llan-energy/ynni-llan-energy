import { defineConfig, type ResolveProductionUrlContext } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schema } from "@/sanity/schema";
import { structure } from "@/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "unconfigured";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// NEXT_PUBLIC_ prefix required — sanity.config.ts runs in the browser (Studio is a client-side SPA)
const previewSecret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET ?? "";

// Resolve the slug for each document type into a preview URL
async function resolvePreviewUrl(
  _prev: string | undefined,
  ctx: ResolveProductionUrlContext
): Promise<string | undefined> {
  const doc = ctx.document as { _type: string; slug?: { current?: string } };
  const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const slug = doc.slug?.current;

  const paths: Record<string, string | undefined> = {
    newsPost: slug ? `/newyddion/${slug}` : "/newyddion",
    project: slug ? `/prosiectau/${slug}` : "/prosiectau",
    siteSettings: "/",
  };

  const path = paths[doc._type];
  if (!path) return undefined;

  return `${base}/api/draft-mode/enable?secret=${previewSecret}&slug=${path}`;
}

export default defineConfig({
  name: "ycl-studio",
  title: "Ynni Cymunedol Llanfairfechan",
  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2025-04-07" }),
  ],

  schema,

  document: {
    productionUrl: resolvePreviewUrl,
  },

  basePath: "/studio",
});
