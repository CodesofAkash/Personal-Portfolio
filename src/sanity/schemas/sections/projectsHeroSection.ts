import { defineField, defineType } from "sanity";

export const projectsHeroSection = defineType({
  name: "projectsHeroSection",
  title: "Hero (Projects)",
  type: "object",
  fields: [
    defineField({ name: "headingLine1", type: "string", description: "e.g. 'What I've'.", validation: (r) => r.required() }),
    defineField({ name: "headingHighlight", type: "string", description: "Outlined highlighted word on its own line, e.g. 'Built.'.", validation: (r) => r.required() }),
    defineField({ name: "subheading", type: "text", rows: 2, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "headingLine1" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Projects hero" }) },
});
