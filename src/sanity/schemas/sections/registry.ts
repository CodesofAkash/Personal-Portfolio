// Single source of truth for which page-builder section types exist and
// which page(s) they are allowed on — drives each page document's
// `sections` array `of:` list. AK-CMS-022, schema-authoring.md's
// registration checklist.
export interface SectionRegistryEntry {
  type: string;
  pages: ("homePage" | "aboutPage" | "projectsPage" | "contactPage")[];
}

export const SECTION_REGISTRY: SectionRegistryEntry[] = [
  { type: "heroSection", pages: ["homePage"] },
  { type: "statsSection", pages: ["homePage", "aboutPage"] },
  { type: "featuredProjectsSection", pages: ["homePage"] },
  { type: "testimonialsSection", pages: ["homePage"] },
  { type: "aboutHeroSection", pages: ["aboutPage"] },
  { type: "experienceSection", pages: ["aboutPage"] },
  { type: "techSection", pages: ["aboutPage"] },
  { type: "ctaSection", pages: ["aboutPage", "projectsPage"] },
  { type: "projectsHeroSection", pages: ["projectsPage"] },
  { type: "projectsGridSection", pages: ["projectsPage"] },
  { type: "contactHeroSection", pages: ["contactPage"] },
  { type: "contactFormSection", pages: ["contactPage"] },
];

export function sectionsFor(page: SectionRegistryEntry["pages"][number]) {
  return SECTION_REGISTRY.filter((s) => s.pages.includes(page)).map((s) => ({ type: s.type }));
}

// Preview thumbnail convention for the Studio insert menu. No thumbnails
// exist yet (design assets, not something to fabricate) — each section
// falls back to Studio's default block icon until one is added at this path.
export function getSectionPreviewImage(schemaTypeName: string): string {
  const kebabName = schemaTypeName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return `/sanity/section-previews/${kebabName}.webp`;
}
