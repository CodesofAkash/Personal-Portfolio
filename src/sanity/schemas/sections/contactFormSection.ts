import { defineArrayMember, defineField, defineType } from "sanity";

export const contactFormSection = defineType({
  name: "contactFormSection",
  title: "Contact form",
  type: "object",
  fields: [
    defineField({
      name: "fields",
      title: "Form fields",
      type: "array",
      of: [defineArrayMember({ type: "formField" })],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "submitButtonText",
      type: "string",
      initialValue: "Send",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact form" }),
  },
});
