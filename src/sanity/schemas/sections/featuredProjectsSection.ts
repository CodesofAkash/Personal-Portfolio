import { defineField, defineType } from "sanity";

// Content-less beyond its header — the project cards themselves come from
// the `project` collection (first 3 by `order`), not from this section.
export const featuredProjectsSection = defineType({
  name: "featuredProjectsSection",
  title: "Featured projects",
  type: "object",
  fields: [defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() })],
  preview: {
    select: { title: "sectionHeader.heading" },
    prepare: ({ title }) => ({ title: title || "Featured projects", subtitle: "Pulls from Projects collection" }),
  },
});
