import { defineField, defineType } from "sanity";

export const projectsPage = defineType({
  name: "projectsPage",
  title: "Projects page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "cta", title: "CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroHeadingLine1",
      type: "string",
      group: "hero",
      description: "e.g. 'What I've'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroHeadingHighlight",
      type: "string",
      group: "hero",
      description: "Outlined highlighted word on its own line, e.g. 'Built.'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heroSubheading",
      type: "text",
      rows: 2,
      group: "hero",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctaEyebrow",
      type: "string",
      group: "cta",
      description: "e.g. 'Interested in collaborating?'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctaHeading",
      type: "string",
      group: "cta",
      description: "e.g. 'Let's build the next one together.'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctaBody",
      type: "text",
      rows: 2,
      group: "cta",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "ctaLabel",
      type: "string",
      group: "cta",
      description: "Links to /contact, e.g. 'Start a conversation →'.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "seo", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Projects page" }) },
});
