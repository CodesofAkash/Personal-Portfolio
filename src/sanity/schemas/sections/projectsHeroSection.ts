import { defineField, defineType } from "sanity";

// Nothing beyond sectionHeader — eyebrow, heading, description.
export const projectsHeroSection = defineType({
  name: "projectsHeroSection",
  title: "Hero (Projects)",
  type: "object",
  fields: [
    defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "sectionHeader.heading.0.text" },
    prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Projects hero" }),
  },
});
