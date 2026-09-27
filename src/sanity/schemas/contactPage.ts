import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionsFor } from "./sections/registry";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      type: "array",
      of: sectionsFor("contactPage").map((s) => defineArrayMember({ type: s.type })),
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});
