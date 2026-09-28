import { defineField, defineType } from "sanity";
import { linkFields } from "./link";
import { ACCENT_VARIANTS } from "./constants";

// One entry in the contact page's info list (email, GitHub, location, ...).
export const contactItem = defineType({
  name: "contactItem",
  title: "Contact item",
  type: "object",
  fields: [
    defineField({ name: "image", type: "imageWithAlt" }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", title: "Displayed text", type: "string", validation: (r) => r.required() }),
    ...linkFields,
    defineField({
      name: "variant",
      type: "string",
      options: { list: ACCENT_VARIANTS, layout: "radio", direction: "horizontal" },
      initialValue: "violet",
    }),
  ],
  preview: { select: { title: "label", subtitle: "variant" } },
});
