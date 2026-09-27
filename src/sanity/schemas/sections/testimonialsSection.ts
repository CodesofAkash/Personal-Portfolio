import { defineField, defineType } from "sanity";

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  fields: [defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() })],
  preview: {
    select: { title: "sectionHeader.heading" },
    prepare: ({ title }) => ({ title: title || "Testimonials", subtitle: "Pulls from Testimonials collection" }),
  },
});
