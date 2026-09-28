import { defineArrayMember, defineField, defineType } from "sanity";

export const header = defineType({
  name: "header",
  title: "Header",
  type: "object",
  fields: [
    defineField({
      name: "navigationItems",
      title: "Navigation",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })],
      validation: (r) => r.required().min(1),
    }),
  ],
});
