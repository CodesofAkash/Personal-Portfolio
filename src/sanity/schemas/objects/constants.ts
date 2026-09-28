// Every route this site actually has. There is no page-builder "pages"
// collection — every route is a fixed singleton — so this list covers the
// entire internal-link space instead of a page reference.
export const FIXED_ROUTE_OPTIONS = [
  { title: "Home", value: "/" },
  { title: "About", value: "/about" },
  { title: "Projects", value: "/projects" },
  { title: "Contact", value: "/contact" },
  { title: "Privacy Policy", value: "/privacy" },
  { title: "Terms of Service", value: "/terms" },
];

export const LINK_TARGET_OPTIONS = [
  { title: "Same tab", value: "_self" },
  { title: "New tab", value: "_blank" },
];

export const CTA_VARIANTS = [
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
];

// "outline" = stroked/transparent-fill text (the Projects hero's "Built." treatment).
// Contrast-safe variants of violet/rose are applied at render time, not here —
// see src/components/sections/colors.ts.
export const HEADING_STYLES = [
  { title: "Default (white)", value: "default" },
  { title: "Muted", value: "muted" },
  { title: "Brand (violet)", value: "brand" },
  { title: "Outline", value: "outline" },
];

export const HEADING_TAGS = [
  { title: "H1", value: "h1" },
  { title: "H2", value: "h2" },
  { title: "H3", value: "h3" },
  { title: "H4", value: "h4" },
  { title: "H5", value: "h5" },
  { title: "H6", value: "h6" },
];

export const SELECTION_MODES = [
  { title: "All (their own order)", value: "all" },
  { title: "Choose manually", value: "manual" },
];

// Hex values live in src/components/sections/colors.ts.
export const ACCENT_VARIANTS = [
  { title: "Violet", value: "violet" },
  { title: "Teal", value: "teal" },
  { title: "Amber", value: "amber" },
  { title: "Rose", value: "rose" },
];
