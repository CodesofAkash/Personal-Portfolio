import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutHeroSection = defineType({
  name: "aboutHeroSection",
  title: "Hero (About)",
  type: "object",
  fields: [
    defineField({
      name: "name",
      type: "string",
      description:
        "Large heading, animated in one character at a time — deliberately a plain string rather than headingSegments, since the per-character GSAP animation needs one continuous string, e.g. 'Akash Sharma'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      description: "Short badges under the name.",
      of: [defineArrayMember({ type: "string" })],
      validation: (r) => r.min(1).max(4).warning("More than 4 tags starts to wrap awkwardly."),
    }),
    defineField({ name: "bio", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "primaryCta", title: "Primary button", type: "ctaBtn" }),
    defineField({ name: "secondaryCta", title: "Secondary button", type: "ctaBtn" }),
  ],
  preview: { select: { title: "name" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "About hero" }) },
});
