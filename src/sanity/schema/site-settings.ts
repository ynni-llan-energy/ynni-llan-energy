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
    // ─── Hero section ─────────────────────────────────────────────────────────
    defineField({
      name: "heroHeading_cy",
      title: "Pennawd arwr (Cymraeg)",
      type: "string",
      description: "Main hero headline in Welsh",
      initialValue: "Ynni i\u2019r Gymuned, gan y Gymuned",
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
      // initialValue matches the fallback in hero.tsx so new documents show
      // the same text that the site currently displays — making it truly editable.
      initialValue:
        "Rydym yn gwmni buddiant cymunedol sy\u2019n datblygu prosiectau ynni adnewyddadwy er budd pobl Llanfairfechan a\u2019r ardal gyfagos.",
    }),
    defineField({
      name: "heroBody_en",
      title: "Hero body text (English)",
      type: "text",
      rows: 3,
      initialValue:
        "We are a community interest company developing renewable energy projects for the benefit of Llanfairfechan and the surrounding area.",
    }),

    // ─── About section ────────────────────────────────────────────────────────
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

    // ─── CIC Principles (About page) ─────────────────────────────────────────
    defineField({
      name: "principles",
      title: "Egwyddorion / Principles",
      type: "array",
      description: "Displayed as a grid on the About Us page. Add, remove, or reorder these freely.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "cy",
              title: "Cymraeg",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "en",
              title: "English",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "cy", subtitle: "en" },
          },
        },
      ],
      initialValue: [
        { _key: "p1", cy: "Cymraeg yn gyntaf", en: "Welsh first" },
        { _key: "p2", cy: "Cymunedol cyn corfforaethol", en: "Community before corporate" },
        { _key: "p3", cy: "Hygyrch fel rhagosodiad", en: "Accessible by default" },
        { _key: "p4", cy: "Cost gweithredu isel", en: "Low operational cost" },
      ],
    }),

    // ─── Contact section ──────────────────────────────────────────────────────
    defineField({
      name: "contactIntro_cy",
      title: "Cyflwyniad cysylltu (Cymraeg)",
      type: "text",
      rows: 3,
      description: "Introductory paragraph at the top of the Contact page",
      initialValue:
        "Mae croeso i chi gysylltu \u00e2 ni gydag unrhyw gwestiynau am ein gwaith neu am aelodaeth.",
    }),
    defineField({
      name: "contactIntro_en",
      title: "Contact intro (English)",
      type: "text",
      rows: 3,
      initialValue: "We welcome enquiries about our work or membership.",
    }),
    defineField({
      name: "contactEmail",
      title: "E-bost cyswllt / Contact email",
      type: "string",
      validation: (r) => r.email(),
    }),

    // ─── Social links ─────────────────────────────────────────────────────────
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
