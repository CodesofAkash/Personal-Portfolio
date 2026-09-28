import { defineField, defineType } from "sanity";
import { linkFields } from "./link";
import { ACCENT_VARIANTS } from "./constants";

export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "variant",
      type: "string",
      options: { list: ACCENT_VARIANTS, layout: "radio", direction: "horizontal" },
      initialValue: "violet",
    }),
    ...linkFields,
  ],
  preview: { select: { title: "label", subtitle: "variant" } },
});
