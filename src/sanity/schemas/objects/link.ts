import { defineField, defineType, type ValidationContext } from "sanity";
import { FIXED_ROUTE_OPTIONS, LINK_TARGET_OPTIONS } from "./constants";

interface LinkParent {
  linkType?: "fixedRoute" | "external" | "email" | "phone";
  label?: string;
  text?: string;
}

// No "internal page reference" branch — this site has no page-builder
// "pages" collection to reference, every route is a fixed singleton, so
// fixedRoute covers the entire internal-link space (AK-SAN-062).
export const linkFields = [
  defineField({
    name: "linkType",
    title: "Link Type",
    type: "string",
    options: {
      layout: "radio",
      direction: "horizontal",
      list: [
        { title: "Page on this site", value: "fixedRoute" },
        { title: "External URL", value: "external" },
        { title: "Email", value: "email" },
        { title: "Phone", value: "phone" },
      ],
    },
    initialValue: "fixedRoute",
  }),
  defineField({
    name: "fixedRoute",
    title: "Page",
    type: "string",
    options: { list: FIXED_ROUTE_OPTIONS },
    hidden: ({ parent }: { parent?: LinkParent }) => parent?.linkType !== "fixedRoute",
    validation: (Rule) =>
      Rule.custom((value, context: ValidationContext) => {
        const parent = context.parent as LinkParent | undefined;
        if (!(parent?.label || parent?.text)) return true;
        if (parent?.linkType === "fixedRoute" && !value) return "Select a page.";
        return true;
      }),
  }),
  defineField({
    name: "url",
    title: "External URL",
    type: "string",
    description: "Must start with http:// or https://.",
    hidden: ({ parent }: { parent?: LinkParent }) => parent?.linkType !== "external",
    validation: (Rule) =>
      Rule.custom((value, context: ValidationContext) => {
        const parent = context.parent as LinkParent | undefined;
        if (!(parent?.label || parent?.text) || parent?.linkType !== "external") return true;
        if (!value) return "Enter a URL.";
        return /^https?:\/\//i.test(value) ? true : "Must start with http:// or https://.";
      }),
  }),
  defineField({
    name: "email",
    title: "Email address",
    type: "string",
    hidden: ({ parent }: { parent?: LinkParent }) => parent?.linkType !== "email",
    validation: (Rule) =>
      Rule.custom((value, context: ValidationContext) => {
        const parent = context.parent as LinkParent | undefined;
        if (!(parent?.label || parent?.text) || parent?.linkType !== "email") return true;
        return value ? true : "Enter an email address.";
      }),
  }),
  defineField({
    name: "phone",
    title: "Phone number",
    type: "string",
    hidden: ({ parent }: { parent?: LinkParent }) => parent?.linkType !== "phone",
    validation: (Rule) =>
      Rule.custom((value, context: ValidationContext) => {
        const parent = context.parent as LinkParent | undefined;
        if (!(parent?.label || parent?.text) || parent?.linkType !== "phone") return true;
        return value ? true : "Enter a phone number.";
      }),
  }),
  defineField({
    name: "target",
    title: "Open in",
    type: "string",
    options: { layout: "radio", direction: "horizontal", list: LINK_TARGET_OPTIONS },
    initialValue: "_self",
  }),
];

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [defineField({ name: "label", type: "string", validation: (r) => r.required() }), ...linkFields],
  preview: {
    select: { title: "label", linkType: "linkType", fixedRoute: "fixedRoute", url: "url" },
    prepare: ({ title, linkType, fixedRoute, url }) => ({
      title: title || "Link",
      subtitle: linkType === "fixedRoute" ? fixedRoute : url,
    }),
  },
});
