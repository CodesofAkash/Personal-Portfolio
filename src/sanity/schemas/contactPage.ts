import { defineField, defineType } from "sanity";

// The info cards (email / GitHub / location) are not modelled here — they
// are derived from Site settings (email, location, socials), so the same
// values are not duplicated and edited in two places.
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      group: "hero",
      description: "e.g. 'Get in touch'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading",
      type: "string",
      group: "hero",
      description: "e.g. 'Let's Talk.'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subheading",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (r) => r.required(),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});
