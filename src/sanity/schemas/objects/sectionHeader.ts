import { defineField, defineType } from "sanity";

// Reused by every section that has an eyebrow/heading/paragraph/CTA slot —
// AK-SAN-042. Every field is optional: not every section's layout uses all
// four (e.g. a testimonials section has no paragraph or CTA).
export const sectionHeader = defineType({
  name: "sectionHeader",
  title: "Section header",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string", description: "Small label above the heading." }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "paragraph", type: "text", rows: 3 }),
    defineField({
      name: "cta",
      title: "CTA button",
      type: "ctaBtn",
      description: "Optional — leave empty if this section's layout has no button slot.",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow" },
  },
});
