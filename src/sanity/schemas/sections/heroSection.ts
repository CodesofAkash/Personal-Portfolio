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
    defineField({ name: "ctas", title: "Buttons", type: "ctaBtns" }),
    defineField({
      name: "model",
      title: "3D model URL",
      type: "url",
      description: "The .glb/.gltf shown beside the hero text, hosted on Cloudinary (or any CDN) — paste the fetch URL here, not an upload. Leave empty to keep the built-in default.",
    }),
  ],
  preview: { select: { title: "heading.0.text" }, prepare: ({ title }) => ({ title: title || "Hero", subtitle: "Home hero" }) },
});
