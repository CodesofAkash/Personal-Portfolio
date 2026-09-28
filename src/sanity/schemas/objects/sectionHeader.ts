import { defineField, defineType } from "sanity";

// Reused by every section that has an eyebrow/heading/paragraph/CTA slot —
// AK-SAN-042, and the compound pattern in heading-and-icon-pattern.md. Every
// field is independently optional: not every section's layout uses all
// four (e.g. a testimonials section has no paragraph or CTA), and the
// frontend renders exactly what is present.
export const sectionHeader = defineType({
  name: "sectionHeader",
  title: "Section header",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string", description: "Small label above the heading." }),
    defineField({ name: "heading", type: "headingSegments" }),
    defineField({ name: "paragraph", type: "text", rows: 3 }),
    defineField({
      name: "ctas",
      title: "Buttons",
      type: "ctaBtns",
      description: "Add as many buttons as this section needs — including none.",
    }),
  ],
  preview: {
    select: { title: "heading.0.text", subtitle: "eyebrow" },
  },
});
