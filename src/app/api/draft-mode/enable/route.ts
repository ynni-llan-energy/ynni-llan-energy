import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Enables Next.js Draft Mode and redirects to the requested slug.
 *
 * Called by the Sanity Studio "Preview" button:
 *   /api/draft-mode/enable?secret=<NEXT_PUBLIC_SANITY_PREVIEW_SECRET>&slug=/newyddion/my-post
 *
 * The slug is validated against the document type so we never open-redirect
 * to an arbitrary URL.
 */

const VALID_SLUG_PREFIXES = [
  "/",
  "/newyddion/",
  "/prosiectau/",
  "/am-ni",
  "/cysylltu",
  "/aelodaeth",
  "/hygyrchedd",
  "/preifatrwydd",
];

function isValidSlug(slug: string): boolean {
  try {
    // Must be a relative path, not an external URL
    const url = new URL(slug, "http://localhost");
    if (url.origin !== "http://localhost") return false;
    return VALID_SLUG_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (secret !== process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  if (!slug || !isValidSlug(slug)) {
    return new Response("Missing or invalid slug", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(slug);
}
