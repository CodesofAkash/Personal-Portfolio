import { defineArrayMember, defineField, defineType } from "sanity";

// Shared between Home's About section (header + stats side-by-side) and
// About's stand-alone stats bar (stats only, no header) — sectionHeader is
// optional so the same type serves both layouts.
export const statsSection = defineType({
  name: "statsSection",
  title: "Stats",
  type: "object",
  fields: [
    defineField({
      name: "sectionHeader",
      type: "sectionHeader",
      description: "Optional — leave empty for a stats-only bar with no heading.",
    }),
    defineField({
      name: "stats",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: { title: "sectionHeader.heading" },
    prepare: ({ title }) => ({ title: title || "Stats", subtitle: "Stats" }),
  },
});
