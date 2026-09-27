import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionsFor } from "./sections/registry";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      type: "array",
      of: sectionsFor("aboutPage").map((s) => defineArrayMember({ type: s.type })),
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});
