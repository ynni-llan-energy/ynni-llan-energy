import { type StructureResolver } from "sanity/structure";
import { CogIcon, DocumentTextIcon, DocumentIcon, SunIcon, UserIcon } from "@sanity/icons";

/**
 * Custom Studio sidebar structure.
 * - Pins "Site Settings" as a singleton (no list view, just the document).
 * - Groups News and Projects cleanly.
 * - Exposes generic content pages (Membership, Accessibility, Privacy) as
 *   singleton-style entries so editors cannot accidentally create extras.
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

      // Generic content pages — each is a singleton identified by a fixed document ID
      S.listItem()
        .title("Tudalennau / Pages")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Tudalennau / Pages")
            .items([
              S.listItem()
                .title("Aelodaeth / Membership")
                .icon(DocumentIcon)
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("page-aelodaeth")
                    .title("Aelodaeth / Membership")
                ),
              S.listItem()
                .title("Hygyrchedd / Accessibility")
                .icon(DocumentIcon)
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("page-hygyrchedd")
                    .title("Hygyrchedd / Accessibility")
                ),
              S.listItem()
                .title("Preifatrwydd / Privacy")
                .icon(DocumentIcon)
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("page-preifatrwydd")
                    .title("Preifatrwydd / Privacy")
                ),
            ])
        ),

      S.divider(),

      // People (for news post authors, committee page etc.)
      S.listItem()
        .title("Pobl / People")
        .icon(UserIcon)
        .child(S.documentTypeList("person").title("Pobl / People")),
    ]);
