import { defineField, defineType } from "sanity";
import { linkFields } from "./link";
import { CTA_VARIANTS } from "./constants";

export const ctaBtn = defineType({
  name: "ctaBtn",
  title: "Button",
  type: "object",
  fields: [
    defineField({ name: "text", title: "Button text", type: "string", validation: (r) => r.required() }),
    ...linkFields,
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      description: "Which visual style this button uses.",
      options: { list: CTA_VARIANTS, layout: "radio", direction: "horizontal" },
      initialValue: "primary",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "text", variant: "variant" },
    prepare: ({ title, variant }) => ({ title: title || "Button", subtitle: variant }),
  },
});
