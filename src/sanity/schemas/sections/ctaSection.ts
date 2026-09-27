import { defineField, defineType } from "sanity";

// Shared by the About and Projects pages' closing CTA panel. sectionHeader's
// own `cta` field is the primary button; `secondaryCta` is optional for the
// two-button case (About has both, Projects only needs one). The two-line,
// two-tone heading (e.g. "Let's build something" / "remarkable.") is just a
// two-segment sectionHeader.heading now — the first segment's text ends in
// a newline, the second is styled "brand". No bespoke headingHighlight field.
export const ctaSection = defineType({
  name: "ctaSection",
  title: "CTA panel",
  type: "object",
  fields: [
    defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() }),
    defineField({ name: "secondaryCta", title: "Secondary button", type: "ctaBtn" }),
  ],
  preview: {
    select: { title: "sectionHeader.heading.0.text" },
    prepare: ({ title }) => ({ title: title || "CTA panel", subtitle: "CTA" }),
  },
});
