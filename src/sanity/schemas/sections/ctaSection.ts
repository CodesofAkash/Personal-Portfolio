import { defineField, defineType } from "sanity";

// Shared by the About and Projects pages' closing CTA panel. sectionHeader's
// own `cta` field is the primary button; `secondaryCta` is optional for the
// two-button case (About has both, Projects only needs one).
export const ctaSection = defineType({
  name: "ctaSection",
  title: "CTA panel",
  type: "object",
  fields: [
    defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() }),
    defineField({
      name: "headingHighlight",
      title: "Highlighted second line",
      type: "string",
      description: "Optional — shown on its own line under the heading, in the accent color, e.g. 'remarkable.'.",
    }),
    defineField({ name: "secondaryCta", title: "Secondary button", type: "ctaBtn" }),
  ],
  preview: {
    select: { title: "sectionHeader.heading" },
    prepare: ({ title }) => ({ title: title || "CTA panel", subtitle: "CTA" }),
  },
});
