import { defineField, defineType } from "sanity";

export const techSection = defineType({
  name: "techSection",
  title: "Tech stack marquee",
  type: "object",
  fields: [defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() })],
  preview: {
    select: { title: "sectionHeader.heading" },
    prepare: ({ title }) => ({ title: title || "Tech stack", subtitle: "Pulls from Technologies collection" }),
  },
});
