import { defineArrayMember, defineField, defineType } from "sanity";
import { linkFields } from "./link";

interface NavigationItemValue {
  children?: unknown[];
}

// Self-referencing: an item with children becomes a dropdown trigger instead
// of a plain link — no separate "type" field needed.
export const navigationItem = defineType({
  name: "navigationItem",
  title: "Navigation item",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    ...linkFields,
    defineField({
      name: "children",
      title: "Dropdown items",
      description: "Leave empty for a plain link. Add items to turn this into a dropdown.",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })],
    }),
  ],
  preview: {
    select: { title: "label", children: "children" },
    prepare: ({ title, children }: { title?: string; children?: NavigationItemValue["children"] }) => ({
      title: title || "Nav item",
      subtitle: children?.length ? `Dropdown · ${children.length} items` : undefined,
    }),
  },
});
