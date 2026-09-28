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
      title: "3D model",
      type: "file",
      description: "The 3D globe shown beside the contact form.",
      options: { accept: ".glb,.gltf" },
    }),
  ],
  preview: {
    select: { title: "sectionHeader.heading.0.text" },
    prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Contact hero" }),
  },
});
