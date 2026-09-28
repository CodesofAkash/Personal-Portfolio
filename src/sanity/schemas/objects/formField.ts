import { defineField, defineType } from "sanity";

const FIELD_TYPES = [
  { title: "Text", value: "text" },
  { title: "Email", value: "email" },
  { title: "Phone", value: "tel" },
  { title: "Text area (multi-line)", value: "textarea" },
];

// The contact form's actual submission stays mapped to fixed keys
// (name/email/message, per the EmailJS template) — this array controls
// which fields render, their labels/placeholders/order, not arbitrary
// new submitted keys.
export const formField = defineType({
  name: "formField",
  title: "Form field",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Field key",
      type: "string",
      description: "Must be 'name', 'email', or 'message' — the only keys the form actually submits.",
      options: { list: ["name", "email", "message"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "placeholder", type: "string" }),
    defineField({
      name: "type",
      type: "string",
      options: { list: FIELD_TYPES },
      initialValue: "text",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "name" } },
});
