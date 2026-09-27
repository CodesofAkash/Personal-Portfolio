import { defineArrayMember, defineField, defineType } from "sanity";
import { HEADING_STYLES, HEADING_TAGS } from "./constants";

const headingSegment = defineArrayMember({
  name: "headingSegment",
  title: "Segment",
  type: "object",
  fields: [
    defineField({
      name: "text",
      type: "string",
      description: "A literal newline inside this text starts a new line when rendered.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "style",
      type: "string",
      description: "Color treatment for this segment only.",
      options: { list: HEADING_STYLES, layout: "radio", direction: "horizontal" },
      initialValue: "default",
    }),
    defineField({
      name: "tag",
      title: "Heading level",
      type: "string",
      description: "Only the FIRST segment's tag sets the semantic level for the whole heading.",
      options: { list: HEADING_TAGS },
      initialValue: "h2",
    }),
  ],
  preview: {
    select: { text: "text", style: "style", tag: "tag" },
    prepare: ({ text, style, tag }) => ({ title: text, subtitle: `${tag?.toUpperCase()} · ${style}` }),
  },
});

// AK-SAN-064 — every heading is an array of styled segments, never a plain
// string. Segments render joined by a single space; a literal "\n" inside a
// segment's text is the line break (used instead of a one-off
// "headingHighlight" field for a two-tone, two-line heading).
export const headingSegments = defineType({
  name: "headingSegments",
  title: "Heading",
  type: "array",
  of: [headingSegment],
  validation: (r) => r.min(1).warning("A heading should have at least one segment."),
});
