import { defineField, defineType, type ValidationContext } from "sanity";

interface ImageWithAltParent {
  asset?: unknown;
}

// AK-SAN-065 — real asset, else a sanitized inline SVG override, else
// nothing. One type for every image an editor genuinely uploads through the
// CMS (identity assets: logo, favicon, default OG image) — not a retrofit
// for the project/tech/experience media that deliberately stays on external
// CDN URLs (AK-SAN-015).
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describes the image for screen readers and search engines.",
      validation: (Rule) =>
        Rule.custom((alt, context: ValidationContext) => {
          const parent = context.parent as ImageWithAltParent | undefined;
          if (parent?.asset && !alt) return "Alt text is required once an image is set.";
          return true;
        }),
    }),
    defineField({
      name: "iconSvg",
      title: "Inline SVG override",
      type: "text",
      rows: 3,
      description:
        "Optional raw SVG markup rendered instead of the image asset — only used if no image is set. Sanitized before rendering; only paste markup you trust.",
    }),
  ],
});
