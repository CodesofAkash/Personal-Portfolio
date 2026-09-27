import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionsFor } from "./sections/registry";

// Fixed-documentId singleton (AK-SAN-036) — one Home page, opened directly.
// Content lives entirely in the reorderable `sections` array; this document
// itself only adds page-level SEO (AK-CMS-022/023, page-builder.md).
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "sections",
      type: "array",
      of: sectionsFor("homePage").map((s) => defineArrayMember({ type: s.type })),
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
