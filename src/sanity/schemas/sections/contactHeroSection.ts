import { defineField, defineType } from "sanity";

export const contactHeroSection = defineType({
  name: "contactHeroSection",
  title: "Hero (Contact)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string", description: "e.g. 'Get in touch'.", validation: (r) => r.required() }),
    defineField({ name: "heading", type: "headingSegments", description: "e.g. 'Let's Talk.'.", validation: (r) => r.required() }),
    defineField({ name: "subheading", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "heading.0.text" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Contact hero" }) },
});
