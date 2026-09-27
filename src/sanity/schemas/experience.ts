import { defineArrayMember, defineField, defineType } from "sanity";

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  description: "One entry on the About page's journey timeline.",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "companyName",
      title: "Company / phase name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon URL",
      type: "url",
      description: "Small logo shown beside the entry.",
    }),
    defineField({
      name: "iconBg",
      title: "Icon background color",
      type: "string",
      description: "Hex color behind the icon, e.g. #E6DEDD.",
      validation: (r) =>
        r.regex(/^#[0-9A-Fa-f]{6}$/, { name: "hex color" }).error("Must be a hex color like #E6DEDD."),
    }),
    defineField({
      name: "date",
      type: "string",
      description: "e.g. 'Late 2025 – Early 2026'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "points",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 2 })],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers show first (chronological).",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "companyName" } },
});
