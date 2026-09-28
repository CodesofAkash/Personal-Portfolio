import { defineArrayMember, defineField, defineType } from "sanity";
import { SELECTION_MODES } from "../objects/constants";

interface ExperienceSectionParent {
  mode?: "all" | "manual";
}

export const experienceSection = defineType({
  name: "experienceSection",
  title: "Experience timeline",
  type: "object",
  fields: [
    defineField({ name: "sectionHeader", type: "sectionHeader", validation: (r) => r.required() }),
    defineField({
      name: "mode",
      title: "Which entries to show",
      type: "string",
      options: { list: SELECTION_MODES, layout: "radio" },
      initialValue: "all",
    }),
    defineField({
      name: "items",
      title: "Chosen entries",
      description: "Shown in this order, regardless of each entry's own order value.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "experience" }] })],
      hidden: ({ parent }: { parent?: ExperienceSectionParent }) => parent?.mode !== "manual",
      validation: (r) => r.unique(),
    }),
  ],
  preview: {
    select: { title: "sectionHeader.heading.0.text" },
    prepare: ({ title }) => ({ title: title || "Experience", subtitle: "Pulls from Experience collection" }),
  },
});
