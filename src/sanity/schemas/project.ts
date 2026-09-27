import { defineArrayMember, defineField, defineType } from "sanity";

// Media (image/video/screenshots) stays external URLs on the existing
// Cloudinary/CloudFront CDN rather than native Sanity image assets — those
// binaries already exist and re-uploading them was not part of this
// migration (AK-SAN-015: one strategy per codebase, documented here).
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  description: "A portfolio project shown on the Home and Projects pages.",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      description: "Tech-stack badges shown on the card.",
      of: [
        defineArrayMember({
          type: "object",
          name: "tag",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "color",
              type: "string",
              description: "Which gradient class the badge text uses.",
              options: {
                list: [
                  { title: "Blue", value: "blue-text-gradient" },
                  { title: "Green", value: "green-text-gradient" },
                  { title: "Pink", value: "pink-text-gradient" },
                  { title: "Orange", value: "orange-text-gradient" },
                ],
              },
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "name", subtitle: "color" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "image",
      title: "Card image URL",
      type: "url",
      description: "Shown on the compact project card, and as the Home page featured-project image.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "video",
      title: "Preview video URL",
      type: "url",
      description: "Looping preview shown on hover, and in the expanded project card. Leave empty for the 'coming soon' placeholder.",
    }),
    defineField({
      name: "screenshots",
      type: "array",
      description: "Carousel shown in the expanded project card.",
      of: [defineArrayMember({ type: "url" })],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "sourceCodeLink",
      title: "Source code URL",
      type: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "link",
      title: "Live demo URL",
      type: "url",
      description: "Leave empty if there is no live demo to link to.",
    }),
    defineField({
      name: "learning",
      title: "What I learned",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      type: "number",
      description: "Lower numbers show first. The first 3 (by this order) appear as Home's Featured Projects.",
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    { title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "name", subtitle: "description" } },
});
