// Hand-written next to the queries below and kept honest by hand — no
// typegen wired up yet (AK-SAN, client-setup.md "Types"). A type here is a
// promise about the shape, not a guarantee: every field is still optional at
// read time (AK-CMS-021) regardless of what the schema requires.

export interface SanityImageValue {
  asset?: { _ref?: string; _id?: string; url?: string };
  alt?: string;
}

export interface Seo {
  title?: string;
  description?: string;
  ogImage?: SanityImageValue;
}

export interface NavLink {
  id: string;
  title: string;
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

export interface HomePage {
  heroEyebrow?: string;
  heroGreeting?: string;
  heroName?: string;
  heroSubheadLine1?: string;
  heroSubheadLine2?: string;
  heroCtaPrimaryLabel?: string;
  heroCtaSecondaryLabel?: string;
  aboutEyebrow?: string;
  aboutHeading?: string;
  aboutBody?: string;
  aboutCtaLabel?: string;
  aboutStats?: Stat[];
  featuredProjectsEyebrow?: string;
  featuredProjectsHeading?: string;
  featuredProjectsViewAllLabel?: string;
  testimonialsEyebrow?: string;
  testimonialsHeading?: string;
  seo?: Seo;
}

export interface AboutPage {
  heroName?: string;
  heroTags?: string[];
  heroBio?: string;
  heroCtaPrimaryLabel?: string;
  heroCtaSecondaryLabel?: string;
  stats?: Stat[];
  experienceEyebrow?: string;
  experienceHeading?: string;
  techEyebrow?: string;
  techHeading?: string;
  ctaEyebrow?: string;
  ctaHeadingLine1?: string;
  ctaHeadingHighlight?: string;
  ctaBody?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  seo?: Seo;
}

export interface ProjectsPage {
  heroHeadingLine1?: string;
  heroHeadingHighlight?: string;
  heroSubheading?: string;
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaBody?: string;
  ctaLabel?: string;
  seo?: Seo;
}

export interface ContactPage {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
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
