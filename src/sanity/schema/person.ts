import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

export const person = defineType({
  name: "person",
  title: "Pobl / People",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Enw / Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role_cy",
      title: "Rôl (Cymraeg)",
      type: "string",
    }),
    defineField({
      name: "role_en",
      title: "Role (English)",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Llun / Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "role_cy",
      media: "image",
    },
  },
});
