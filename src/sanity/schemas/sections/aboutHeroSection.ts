import { defineArrayMember, defineField, defineType } from "sanity";
import { ACCENT_VARIANTS } from "../objects/constants";

// `name` stays a plain string, not headingSegments: the per-character GSAP
// split-text animation needs one continuous string.
export const aboutHeroSection = defineType({
  name: "aboutHeroSection",
  title: "Hero (About)",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({
      name: "name",
      type: "string",
      description: "Large animated heading, e.g. 'Akash Sharma'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "tag",
          fields: [
            defineField({ name: "text", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "variant",
              type: "string",
              options: { list: ACCENT_VARIANTS, layout: "radio", direction: "horizontal" },
              initialValue: "violet",
            }),
          ],
          preview: { select: { title: "text", subtitle: "variant" } },
        }),
      ],
      validation: (r) => r.max(4).warning("More than 4 tags starts to wrap awkwardly."),
    }),
    defineField({ name: "bio", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "ctas", title: "Buttons", type: "ctaBtns" }),
  ],
  preview: { select: { title: "name" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "About hero" }) },
});
