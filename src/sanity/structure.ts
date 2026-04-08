import { type StructureResolver } from "sanity/structure";
import { CogIcon, DocumentTextIcon, SunIcon, UserIcon } from "@sanity/icons";

/**
 * Custom Studio sidebar structure.
 * - Pins "Site Settings" as a singleton (no list view, just the document).
 * - Groups News and Projects cleanly.
 * - Hides siteSettings from the default document list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Cynnwys / Content")
    .items([
      // Singleton — Site Settings
      S.listItem()
        .title("Gosodiadau'r Wefan / Site Settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),

      S.divider(),

      // News posts
      S.listItem()
        .title("Newyddion / News")
        .icon(DocumentTextIcon)
        .child(S.documentTypeList("newsPost").title("Newyddion / News")),

      // Projects
      S.listItem()
        .title("Prosiectau / Projects")
        .icon(SunIcon)
        .child(S.documentTypeList("project").title("Prosiectau / Projects")),

      S.divider(),

      // People (for news post authors, committee page etc.)
      S.listItem()
        .title("Pobl / People")
        .icon(UserIcon)
        .child(S.documentTypeList("person").title("Pobl / People")),
    ]);
