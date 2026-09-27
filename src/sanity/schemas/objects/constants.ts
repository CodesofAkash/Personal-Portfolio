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
