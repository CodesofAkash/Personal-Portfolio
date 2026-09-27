import { defineField, defineType } from "sanity";

// Reused on every page singleton. A page missing only an OG image still
// inherits the site default while keeping its own title and description
// (AK-CMS-029) — the fallback happens field-by-field in the mapping
// function, not here.
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.max(70).warning("Longer titles get truncated in search results."),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      validation: (r) => r.max(160).warning("Longer descriptions get truncated in search results."),
    }),
    defineField({
      name: "ogImage",
      title: "Share image",
      type: "image",
      description: "Shown when this page is shared on social platforms. Falls back to the site default.",
    }),
  ],
});
