import { defineField, defineType } from "sanity";

export const experienceSection = defineType({
  name: "experienceSection",
  title: "Experience timeline",
  type: "object",
  fields: [defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() })],
  preview: {
    select: { title: "sectionHeader.heading" },
    prepare: ({ title }) => ({ title: title || "Experience", subtitle: "Pulls from Experience collection" }),
  },
});
