import { defineArrayMember, defineField, defineType } from "sanity";

// Single-locale project: identity, navigation, SEO, analytics and switches
// all live in one document. The site/global split other projects in this
// portfolio set use exists only to stop per-locale drift (AK-SAN-058) — with
// one language there is nothing to drift, so splitting it here would just be
// two documents for no reason.
export const settings = defineType({
  name: "settings",
  title: "Site settings",
  type: "document",
  description: "Everything outside the page content: brand, navigation, SEO defaults, analytics, and site-wide switches.",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "navigation", title: "Navigation" },
    { name: "seo", title: "SEO" },
    { name: "analytics", title: "Analytics" },
    { name: "scripts", title: "Scripts & consent" },
    { name: "status", title: "Site status" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Brand name",
      type: "string",
      group: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      group: "identity",
      description: "Short line shown near the brand name.",
    }),
    defineField({
      name: "logo",
      type: "image",
      group: "identity",
      description: "Shown in the navbar and footer.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) =>
        r.custom((value) =>
          value && !value.alt ? "Alt text is required once a logo is set." : true,
        ),
    }),
    defineField({
      name: "favicon",
      type: "image",
      group: "identity",
      description: "Browser tab icon. Falls back to the logo if left empty.",
    }),
    defineField({
      name: "navLinks",
      title: "Header navigation",
      type: "array",
      group: "navigation",
      description: "Links shown in the navbar. Each id is a route path, e.g. /about.",
      of: [
        defineArrayMember({
          type: "object",
          name: "navLink",
          fields: [
            defineField({
              name: "id",
              title: "Path",
              type: "string",
              description: "Route path starting with /, e.g. /about, /projects, /contact.",
              validation: (r) => r.required(),
            }),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title", subtitle: "id" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "navigation",
      description: "Rendered in the footer and on the contact page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({ name: "label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", type: "url", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      group: "navigation",
      description: "Shown on the contact page and used for the 'mailto:' link.",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "location",
      type: "string",
      group: "navigation",
      description: "Shown on the contact page, e.g. 'India · Open to Remote'.",
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "object",
      group: "seo",
      description: "Used for any page that has not set its own SEO. A page missing only an OG image still inherits this one field-by-field.",
      fields: [
        defineField({
          name: "title",
          title: "Default title",
          type: "string",
          description: "Shown in the browser tab and search results when a page sets none of its own.",
          validation: (r) => r.required().max(70).warning("Longer titles get truncated in search results."),
        }),
        defineField({
          name: "description",
          title: "Default description",
          type: "text",
          rows: 2,
          validation: (r) => r.required().max(160).warning("Longer descriptions get truncated in search results."),
        }),
        defineField({
          name: "ogImage",
          title: "Default share image",
          type: "image",
          description: "Shown when the site is shared on social platforms if a page sets no image of its own. A blank card is the first thing anyone sees of a share without this.",
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "analytics",
      title: "Analytics and tracking",
      type: "object",
      group: "analytics",
      description: "Leave a field empty and that tool never loads — no script, no request, no cost. Nothing here runs until a visitor accepts cookies below.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "googleAnalyticsId",
          title: "Google Analytics 4 measurement ID",
          type: "string",
          description: "Looks like G-XXXXXXXXXX. GA4 > Admin > Data streams > your web stream.",
          validation: (r) =>
            r.regex(/^G-[A-Z0-9]{6,12}$/, { name: "GA4 ID" }).error("Must look like G-XXXXXXXXXX."),
        }),
        defineField({
          name: "googleTagManagerId",
          title: "Google Tag Manager container ID",
          type: "string",
          description: "Looks like GTM-XXXXXX. Use this OR the GA4 ID above — filling both counts every page view twice.",
          validation: (r) =>
            r.regex(/^GTM-[A-Z0-9]{6,8}$/, { name: "GTM ID" }).error("Must look like GTM-XXXXXX."),
        }),
      ],
    }),
    defineField({
      name: "verification",
      title: "Search engine verification",
      type: "object",
      group: "seo",
      description: "Proves you own the site so you can see its search traffic. Renders as meta tags and sets no cookies, so it loads for everyone.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "google",
          title: "Google Search Console",
          type: "string",
          description: "Search Console > URL prefix > HTML tag. Paste only the content value, not the whole tag.",
        }),
        defineField({
          name: "bing",
          title: "Bing Webmaster Tools",
          type: "string",
          description: "Optional. Bing also feeds some AI answer engines.",
        }),
      ],
    }),
    defineField({
      name: "scripts",
      title: "Custom scripts",
      type: "object",
      group: "scripts",
      description: "Raw markup pasted from a third party. Runs on every page, so only paste what you trust.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "head",
          title: "In <head>",
          type: "text",
          rows: 4,
          description: "Only for something that must load before the page renders.",
        }),
        defineField({
          name: "bodyEnd",
          title: "End of <body>",
          type: "text",
          rows: 4,
          description: "Prefer this. It cannot delay the page appearing.",
        }),
        defineField({
          name: "requiresConsent",
          title: "Wait for cookie consent",
          type: "boolean",
          description: "On by default. Turn off only for a script that sets no cookies.",
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: "cookieConsent",
      title: "Cookie consent banner",
      type: "object",
      group: "scripts",
      description: "When disabled, nothing in Analytics above (or a consent-gated script) will ever load — consent cannot be assumed from an absent banner.",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "enabled",
          title: "Ask for cookie consent",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "message",
          type: "text",
          rows: 2,
          description: "Say plainly what is collected and why.",
        }),
        defineField({ name: "acceptLabel", type: "string", description: "e.g. 'Accept'." }),
        defineField({ name: "declineLabel", type: "string", description: "e.g. 'Decline'." }),
        defineField({
          name: "policyUrl",
          title: "Privacy policy link",
          type: "string",
          description: "Usually /privacy.",
        }),
      ],
    }),
    defineField({
      name: "maintenance",
      title: "Maintenance mode",
      type: "object",
      group: "status",
      description: "Takes the whole site down and shows a holding page instead. The Studio itself stays reachable.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "enabled",
          title: "Site is in maintenance",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "heading",
          type: "string",
          description: "Shown large on the holding page, e.g. 'Back shortly'.",
        }),
        defineField({
          name: "message",
          type: "text",
          rows: 3,
          description: "One or two sentences telling a visitor when to come back.",
        }),
      ],
    }),
    defineField({
      name: "notFound",
      title: "404 page",
      type: "object",
      group: "status",
      description: "Shown when a visitor reaches a URL that does not exist.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "heading",
          type: "string",
          description: "e.g. 'Page not found.'",
        }),
        defineField({
          name: "message",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "linkLabel",
          type: "string",
          description: "Wording of the link home, e.g. 'Back to home'.",
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
