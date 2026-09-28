import { defineArrayMember, defineField, defineType } from "sanity";
import { SELECTION_MODES } from "../objects/constants";

interface TechSectionParent {
  mode?: "all" | "manual";
}

export const techSection = defineType({
  name: "techSection",
  title: "Tech stack marquee",
  type: "object",
  fields: [
    defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() }),
    defineField({
      name: "mode",
      title: "Which technologies to show",
      type: "string",
      options: { list: SELECTION_MODES, layout: "radio" },
      initialValue: "all",
    }),
    defineField({
      name: "items",
      title: "Chosen technologies",
      description: "Shown in this order, regardless of each entry's own order value.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "technology" }] })],
      hidden: ({ parent }: { parent?: TechSectionParent }) => parent?.mode !== "manual",
      validation: (r) => r.unique(),
    }),
  ],
  preview: {
    select: { title: "sectionHeader.heading.0.text" },
    prepare: ({ title }) => ({ title: title || "Tech stack", subtitle: "Pulls from Technologies collection" }),
  },
});
