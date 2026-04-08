import { defineType, defineField } from "sanity";
import { SunIcon } from "@sanity/icons";

const PROJECT_STATUS = [
  { title: "Arfaethedig / Proposed", value: "proposed" },
  { title: "Yn datblygu / In development", value: "in_development" },
  { title: "Actif / Active", value: "active" },
  { title: "Wedi cwblhau / Completed", value: "completed" },
];

export const project = defineType({
  name: "project",
  title: "Prosiectau / Projects",
  type: "document",
  icon: SunIcon,
  fields: [
    defineField({
      name: "title_cy",
      title: "Enw'r prosiect (Cymraeg)",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title_en",
      title: "Project name (English)",
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
      options: {
        list: PROJECT_STATUS,
        layout: "radio",
      },
      initialValue: "proposed",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary_cy",
      title: "Crynodeb (Cymraeg)",
      type: "text",
      rows: 4,
      validation: (r) => r.required().max(400),
    }),
    defineField({
      name: "summary_en",
      title: "Summary (English)",
      type: "text",
      rows: 4,
      validation: (r) => r.required().max(400),
    }),
    defineField({
      name: "body_cy",
      title: "Disgrifiad llawn (Cymraeg)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "body_en",
      title: "Full description (English)",
      type: "array",
      of: [{ type: "block" }],
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
          validation: (r) => r.required().warning("Alt text is required for accessibility"),
        }),
      ],
    }),
    // Generation capacity — for Phase 3 stats
    defineField({
      name: "capacityKw",
      title: "Capasiti (kW)",
      type: "number",
      description: "Installed capacity in kilowatts — used in stats bar when live",
    }),
    defineField({
      name: "location",
      title: "Lleoliad / Location",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Dyddiad cychwyn / Start date",
      type: "date",
    }),
  ],

  preview: {
    select: {
      title: "title_cy",
      subtitle: "status",
      media: "coverImage",
    },
    prepare({ title, subtitle, media }) {
      const statusLabel = PROJECT_STATUS.find((s) => s.value === subtitle)?.title ?? subtitle;
      return { title, subtitle: statusLabel, media };
    },
  },
});
