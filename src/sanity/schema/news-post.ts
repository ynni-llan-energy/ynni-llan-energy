import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const newsPost = defineType({
  name: "newsPost",
  title: "Newyddion / News",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    // Welsh title (primary)
    defineField({
      name: "title_cy",
      title: "Teitl (Cymraeg)",
      type: "string",
      validation: (r) => r.required(),
    }),
    // English title
    defineField({
      name: "title_en",
      title: "Title (English)",
      type: "string",
      validation: (r) => r.required(),
    }),
    // URL slug — derived from Welsh title
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title_cy", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    // Publication date
    defineField({
      name: "publishedAt",
      title: "Dyddiad cyhoeddi / Published",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    // Welsh body
    defineField({
      name: "body_cy",
      title: "Cynnwys (Cymraeg)",
      type: "array",
      of: [{ type: "block" }],
    }),
    // English body
    defineField({
      name: "body_en",
      title: "Content (English)",
      type: "array",
      of: [{ type: "block" }],
    }),
    // Cover image
    defineField({
      name: "coverImage",
      title: "Delwedd / Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text (describe the image for screen readers)",
          type: "string",
          validation: (r) => r.required().warning("Alt text is required for accessibility"),
        }),
      ],
    }),
    // Author
    defineField({
      name: "author",
      title: "Awdur / Author",
      type: "reference",
      to: [{ type: "person" }],
    }),
    // Excerpt for cards
    defineField({
      name: "excerpt_cy",
      title: "Crynodeb (Cymraeg)",
      type: "text",
      rows: 3,
      validation: (r) => r.max(200),
    }),
    defineField({
      name: "excerpt_en",
      title: "Excerpt (English)",
      type: "text",
      rows: 3,
      validation: (r) => r.max(200),
    }),
  ],

  preview: {
    select: {
      title: "title_cy",
      subtitle: "title_en",
      media: "coverImage",
    },
  },

  orderings: [
    {
      title: "Dyddiad cyhoeddi (newyddaf yn gyntaf)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
