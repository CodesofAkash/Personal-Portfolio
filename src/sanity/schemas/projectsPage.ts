import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionsFor } from "./sections/registry";

export const projectsPage = defineType({
  name: "projectsPage",
  title: "Projects page",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      type: "array",
      of: sectionsFor("projectsPage").map((s) => defineArrayMember({ type: s.type })),
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Projects page" }) },
});
