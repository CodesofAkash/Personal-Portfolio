import { defineField, defineType } from "sanity";

// Home page hero. Distinct from aboutHeroSection/projectsHeroSection/
// contactHeroSection — each hero's fields genuinely differ, so they are
// separate section types rather than one kitchen-sink hero (AK-CMS-006).
export const heroSection = defineType({
  name: "heroSection",
  title: "Hero (Home)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string", description: "e.g. 'Full-Stack Developer · Available for hire'.", validation: (r) => r.required() }),
    defineField({
      name: "heading",
      type: "headingSegments",
      description: "e.g. two segments: 'Hi, I'm ' (default) + 'Akash.' (brand).",
      validation: (r) => r.required(),
    }),
    defineField({ name: "subheadLine1", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subheadLine2", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "primaryCta", title: "Primary button", type: "ctaBtn" }),
    defineField({ name: "secondaryCta", title: "Secondary button", type: "ctaBtn" }),
  ],
  preview: { select: { title: "heading.0.text" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Home hero" }) },
});
