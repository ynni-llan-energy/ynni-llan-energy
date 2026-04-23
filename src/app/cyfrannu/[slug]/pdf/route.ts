import { notFound } from "next/navigation";
import { getVolunteerRole } from "@/sanity/queries";
import { createRolePdf } from "./create-pdf";

// Ensure Node.js runtime — @react-pdf/renderer requires Node APIs
export const runtime = "nodejs";

// Revalidate in line with role content (matches the Sanity query cache)
export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const role = await getVolunteerRole(slug);

  if (!role || role.status !== "active") {
    notFound();
  }

  const generatedDate = new Date().toLocaleDateString("cy-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const buffer = await createRolePdf(role, generatedDate);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-disgrifiad-rol.pdf"`,
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
