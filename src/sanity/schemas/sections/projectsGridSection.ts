import { defineArrayMember, defineField, defineType } from "sanity";
import { SELECTION_MODES } from "../objects/constants";

interface ProjectsGridSectionParent {
  mode?: "all" | "manual";
}

// The Projects page's main grid — was previously hardcoded to always show
// every project, with no Sanity-side control at all.
export const projectsGridSection = defineType({
  name: "projectsGridSection",
  title: "Projects grid",
  type: "object",
  fields: [
    defineField({
      name: "mode",
      title: "Which projects to show",
      type: "string",
      options: { list: SELECTION_MODES, layout: "radio" },
      initialValue: "all",
    }),
    defineField({
      name: "items",
      title: "Chosen projects",
      description: "Shown in this order, regardless of each project's own order value.",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      hidden: ({ parent }: { parent?: ProjectsGridSectionParent }) => parent?.mode !== "manual",
      validation: (r) => r.unique(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Projects grid", subtitle: "Pulls from Projects collection" }),
  },
});
