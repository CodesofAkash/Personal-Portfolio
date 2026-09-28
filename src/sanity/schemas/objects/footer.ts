import { defineArrayMember, defineField, defineType } from "sanity";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "object",
  fields: [
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "linkLists",
      title: "Link lists",
      description: "e.g. 'Pages' (About, Projects, Contact) and 'Legal' (Privacy Policy, Terms).",
      type: "array",
      of: [defineArrayMember({ type: "linkList" })],
    }),
    defineField({ name: "copyrightText", type: "string", description: "e.g. '© 2026 Akash Sharma'." }),
    defineField({ name: "creditText", type: "string", description: "e.g. 'Designed & developed by Akash Sharma'." }),
  ],
});
