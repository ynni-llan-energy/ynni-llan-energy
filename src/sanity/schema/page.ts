import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

/**
 * Generic content page — used for standalone informational pages such as:
 *   - Aelodaeth / Membership  (documentId: "page-aelodaeth")
 *   - Hygyrchedd / Accessibility  (documentId: "page-hygyrchedd")
 *   - Preifatrwydd / Privacy  (documentId: "page-preifatrwydd")
 *
 * Pages are surfaced as singleton documents in the Studio structure so editors
 * cannot accidentally create extra documents or change the URL-facing identity.
 */
export const page = defineType({
  name: "page",
  title: "Tudalennau / Pages",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "heading_cy",
      title: "Pennawd (Cymraeg)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading_en",
      title: "Heading (English)",
      type: "string",
    }),
    defineField({
      name: "body_cy",
      title: "Cynnwys (Cymraeg)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "body_en",
      title: "Content (English)",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],

  preview: {
    select: {
      title: "heading_cy",
      subtitle: "heading_en",
    },
  },
});
