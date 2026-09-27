// Hand-written next to the queries below and kept honest by hand — no
// typegen wired up yet (AK-SAN, client-setup.md "Types"). A type here is a
// promise about the shape, not a guarantee: every field is still optional at
// read time (AK-CMS-021) regardless of what the schema requires.

export interface SanityImageValue {
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string;
  iconSvg?: string;
}

// AK-SAN-064 — only the first segment's tag sets the semantic heading level;
// later segments only ever change color treatment. Segments render joined
// by a single space; a literal "\n" inside a segment's text is a line break.
export interface HeadingSegment {
  _key?: string;
  text: string;
  style?: "default" | "muted" | "brand" | "outline";
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface Seo {
  title?: string;
  description?: string;
  ogImage?: SanityImageValue;
}

export interface NavLink extends ResolvedLink {
  label: string;
}

export interface Social {
  label: string;
  url: string;
}

export interface Settings {
  name?: string;
  tagline?: string;
  logo?: SanityImageValue;
  favicon?: SanityImageValue;
  navLinks?: NavLink[];
  socials?: Social[];
  email?: string;
  location?: string;
  seo?: Seo;
  analytics?: { googleAnalyticsId?: string; googleTagManagerId?: string };
  verification?: { google?: string; bing?: string };
  scripts?: { head?: string; bodyEnd?: string; requiresConsent?: boolean };
  cookieConsent?: {
    enabled?: boolean;
    message?: string;
    acceptLabel?: string;
    declineLabel?: string;
    policyUrl?: string;
  };
  maintenance?: { enabled?: boolean; heading?: string; message?: string };
  notFound?: { heading?: string; message?: string; linkLabel?: string };
}

export interface Stat {
  value: string;
  label: string;
}

// Resolved at the data layer (AK-CMS-025) — components never see linkType,
// fixedRoute, email, phone or url, only the finished destination.
export interface ResolvedLink {
  href: string;
  target: "_self" | "_blank";
}

export interface ResolvedCtaBtn extends ResolvedLink {
  text: string;
  variant: "primary" | "secondary";
}

export interface SectionHeader {
  eyebrow?: string;
  heading?: HeadingSegment[];
  paragraph?: string;
  cta?: ResolvedCtaBtn;
}

export interface HeroSection {
  _key: string;
  _type: "heroSection";
  eyebrow: string;
  heading: HeadingSegment[];
  subheadLine1: string;
  subheadLine2: string;
  primaryCta?: ResolvedCtaBtn;
  secondaryCta?: ResolvedCtaBtn;
}

export interface AboutHeroSection {
  _key: string;
  _type: "aboutHeroSection";
  name: string;
  tags?: string[];
  bio: string;
  primaryCta?: ResolvedCtaBtn;
  secondaryCta?: ResolvedCtaBtn;
}

export interface ProjectsHeroSection {
  _key: string;
  _type: "projectsHeroSection";
  heading: HeadingSegment[];
  subheading: string;
}

export interface ContactHeroSection {
  _key: string;
  _type: "contactHeroSection";
  eyebrow: string;
  heading: HeadingSegment[];
  subheading: string;
}

export interface StatsSection {
  _key: string;
  _type: "statsSection";
  sectionHeader?: SectionHeader;
  stats: Stat[];
}

export interface FeaturedProjectsSection {
  _key: string;
  _type: "featuredProjectsSection";
  sectionHeader: SectionHeader;
}

export interface TestimonialsSection {
  _key: string;
  _type: "testimonialsSection";
  sectionHeader: SectionHeader;
}

export interface ExperienceSection {
  _key: string;
  _type: "experienceSection";
  sectionHeader: SectionHeader;
}

export interface TechSection {
  _key: string;
  _type: "techSection";
  sectionHeader: SectionHeader;
}

export interface CtaSection {
  _key: string;
  _type: "ctaSection";
  sectionHeader: SectionHeader;
  secondaryCta?: ResolvedCtaBtn;
}

export type HomeSection =
  | HeroSection
  | StatsSection
  | FeaturedProjectsSection
  | TestimonialsSection;

export type AboutSection =
  | AboutHeroSection
  | StatsSection
  | ExperienceSection
  | TechSection
  | CtaSection;

export type ProjectsSection = ProjectsHeroSection | CtaSection;

export type ContactSection = ContactHeroSection;

export interface HomePage {
  sections?: HomeSection[];
  seo?: Seo;
}

export interface AboutPage {
  sections?: AboutSection[];
  seo?: Seo;
}

export interface ProjectsPage {
  sections?: ProjectsSection[];
  seo?: Seo;
}

export interface ContactPage {
  sections?: ContactSection[];
  seo?: Seo;
}

export interface LegalSection {
  title: string;
  body: string;
}

export interface LegalPage {
  slug: "privacy" | "terms";
  heading?: string;
  lastUpdated?: string;
  sections?: LegalSection[];
  seo?: Seo;
}

export interface ProjectTag {
  name: string;
  color: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  tags: ProjectTag[];
  image: string;
  video?: string;
  screenshots: string[];
  sourceCodeLink: string;
  link?: string;
  learning: string;
  order: number;
}

export interface Experience {
  _id: string;
  title: string;
  companyName: string;
  icon?: string;
  iconBg?: string;
  date: string;
  points: string[];
  order: number;
}

export interface Technology {
  _id: string;
  name: string;
  icon?: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  image: string;
  order: number;
}
