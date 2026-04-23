import { renderToBuffer } from "@react-pdf/renderer";
import type { VolunteerRole } from "@/sanity/queries";
import { RoleDocument } from "@/components/volunteer/role-pdf";

export async function createRolePdf(
  role: VolunteerRole,
  generatedDate: string
): Promise<Buffer> {
  return renderToBuffer(
    <RoleDocument role={role} generatedDate={generatedDate} />
  );
}
