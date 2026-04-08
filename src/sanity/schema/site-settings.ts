import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons";

/**
 * Singleton document — one set of site-wide settings.
 * Editors access this via a pinned "Settings" entry in the structure.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Gosodiadau'r Wefan / Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    // Hero section
    defineField({
      name: "heroHeading_cy",
      title: "Pennawd arwr (Cymraeg)",
      type: "string",
      description: "Main hero headline in Welsh",
      initialValue: "Ynni i'r Gymuned, gan y Gymuned",
    }),
    defineField({
      name: "heroHeading_en",
      title: "Hero heading (English)",
      type: "string",
      initialValue: "Energy for the community, by the community",
    }),
    defineField({
      name: "heroBody_cy",
      title: "Testun arwr (Cymraeg)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroBody_en",
      title: "Hero body text (English)",
      type: "text",
      rows: 3,
    }),

    // About section (used on homepage and about page)
    defineField({
      name: "aboutSummary_cy",
      title: "Crynodeb amdanom ni (Cymraeg)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "aboutSummary_en",
      title: "About summary (English)",
      type: "text",
      rows: 4,
    }),

    // Contact
    defineField({
      name: "contactEmail",
      title: "E-bost cyswllt / Contact email",
      type: "string",
      validation: (r) => r.email(),
    }),

    // Social links
    defineField({
      name: "socialLinks",
      title: "Dolenni cymdeithasol / Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Gosodiadau'r Wefan / Site Settings" };
    },
  },
});
