import { defineArrayMember, defineField, defineType } from "sanity";

export const linkList = defineType({
  name: "linkList",
  title: "Link list",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", links: "links" },
    prepare: ({ title, links }: { title?: string; links?: unknown[] }) => ({
      title: title || "Link list",
      subtitle: `${links?.length ?? 0} links`,
    }),
  },
});
