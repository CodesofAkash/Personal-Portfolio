import { defineField, defineType } from "sanity";

export const technology = defineType({
  name: "technology",
  title: "Technology",
  type: "document",
  description: "One pill in the About page's scrolling tech-stack marquee.",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "icon",
      title: "Icon URL",
      type: "url",
      description: "Leave empty and the pill falls back to the first letter of the name.",
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers show first, and earlier in the marquee's first row.",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name" } },
});
