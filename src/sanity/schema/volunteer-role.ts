import { defineType, defineField } from "sanity";
import { UsersIcon } from "@sanity/icons";

const ROLE_STATUS = [
  { title: "Actif / Active", value: "active" },
  { title: "Wedi llenwi / Filled", value: "filled" },
  { title: "Ar gau / Closed", value: "closed" },
];

export const volunteerRole = defineType({
  name: "volunteerRole",
  title: "Rolau Gwirfoddol / Volunteer Roles",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "title_cy",
      title: "Teitl y rôl (Cymraeg)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title_en",
      title: "Role title (English)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title_cy", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Statws / Status",
      type: "string",
      options: { list: ROLE_STATUS, layout: "radio" },
      initialValue: "active",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary_cy",
      title: "Crynodeb (Cymraeg)",
      type: "text",
      rows: 3,
      description: "Crynodeb byr ar gyfer y rhestr rolau / Short summary for the roles list",
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: "summary_en",
      title: "Summary (English)",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: "body_cy",
      title: "Disgrifiad llawn (Cymraeg)",
      type: "array",
      of: [{ type: "block" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body_en",
      title: "Full description (English)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "timeCommitment_cy",
      title: "Ymrwymiad amser (Cymraeg)",
      type: "string",
      description: "e.e. 2–4 awr yr wythnos",
    }),
    defineField({
      name: "timeCommitment_en",
      title: "Time commitment (English)",
      type: "string",
      description: "e.g. 2–4 hours per week",
    }),
    defineField({
      name: "skills",
      title: "Sgiliau defnyddiol / Useful skills",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Tagiau sgiliau — dim gofynion caeth / Skill tags — not strict requirements",
    }),
    defineField({
      name: "coverImage",
      title: "Delwedd / Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (r) =>
            r.warning("Alt text is required for accessibility"),
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "title_cy",
      subtitle: "status",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      const statusLabel =
        ROLE_STATUS.find((s) => s.value === subtitle)?.title ?? subtitle;
      return { title, subtitle: statusLabel, media };
    },
  },
});
