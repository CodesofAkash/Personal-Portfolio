import { defineArrayMember, defineField, defineType } from "sanity";

// A small collection (privacy, terms) rather than two singletons — same
// shape, filtered by slug in the query. Section numbers ("01", "02"...) are
// derived from array position in the frontend, not stored, so reordering a
// section never requires renumbering the rest by hand.
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      type: "string",
      options: {
        list: [
          { title: "Privacy Policy", value: "privacy" },
          { title: "Terms of Service", value: "terms" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading",
      type: "string",
      description: "e.g. 'Privacy Policy.'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "lastUpdated",
      type: "string",
      description: "Free text, e.g. 'March 2026'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "legalSection",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "body",
              type: "text",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "heading", subtitle: "slug" } },
});
