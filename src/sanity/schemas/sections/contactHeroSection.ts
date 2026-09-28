import { defineArrayMember, defineField, defineType } from "sanity";

export const contactHeroSection = defineType({
  name: "contactHeroSection",
  title: "Hero (Contact)",
  type: "object",
  fields: [
    defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() }),
    defineField({
      name: "items",
      title: "Contact info",
      description: "e.g. email, GitHub, location.",
      type: "array",
      of: [defineArrayMember({ type: "contactItem" })],
    }),
    defineField({
      name: "model",
      title: "3D model URL",
      type: "url",
      description: "The .glb/.gltf shown beside the contact form, hosted on Cloudinary (or any CDN) — paste the fetch URL here, not an upload. Leave empty to keep the built-in default.",
    }),
  ],
  preview: {
    select: { title: "sectionHeader.heading.0.text" },
    prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Contact hero" }),
  },
});
