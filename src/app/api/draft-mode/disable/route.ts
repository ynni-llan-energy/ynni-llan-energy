import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Disables Draft Mode and redirects to the homepage.
 * Linked from the DraftModeBanner — editors click "Exit preview" to leave.
 */
export async function GET() {
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}
