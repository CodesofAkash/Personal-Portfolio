import { defineField, defineType } from "sanity";

export const projectsHeroSection = defineType({
  name: "projectsHeroSection",
  title: "Hero (Projects)",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "headingSegments",
      description: "e.g. two segments on separate lines: 'What I've' (default, text ending in a newline) + 'Built.' (outline).",
      validation: (r) => r.required(),
    }),
    defineField({ name: "subheading", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "heading.0.text" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Projects hero" }) },
});
