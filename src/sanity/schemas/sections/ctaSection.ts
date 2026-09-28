import { defineField, defineType } from "sanity";

// Nothing beyond sectionHeader — its ctas array covers however many buttons.
export const ctaSection = defineType({
  name: "ctaSection",
  title: "CTA panel",
  type: "object",
  fields: [
    defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "sectionHeader.heading.0.text" },
    prepare: ({ title }) => ({ title: title || "CTA panel", subtitle: "CTA" }),
  },
});
