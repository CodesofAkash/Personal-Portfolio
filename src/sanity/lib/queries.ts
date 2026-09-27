import { sanityFetch } from "./live";
import type {
  AboutPage,
  ContactPage,
  Experience,
  HomePage,
  LegalPage,
  Project,
  ProjectsPage,
  Settings,
  Technology,
  Testimonial,
} from "./types";

// ── Shared fragments — resolved once, reused everywhere a link-shaped field
// appears (AK-SAN-062/063). Components never see linkType/fixedRoute/email/
// phone/url, only the finished { href, target }.
const hrefFragment = /* groq */ `select(
  linkType == "email" => "mailto:" + email,
  linkType == "phone" => "tel:" + phone,
  linkType == "fixedRoute" => fixedRoute,
  url
)`;

const linkFragment = /* groq */ `{
  "label": label,
  "href": ${hrefFragment},
  target
}`;

const ctaBtnFragment = /* groq */ `{
  text,
  "href": ${hrefFragment},
  target,
  variant
}`;

const sectionHeaderFragment = /* groq */ `{
  eyebrow,
  heading,
  paragraph,
  cta${ctaBtnFragment}
}`;

const SEO_FIELDS = /* groq */ `seo{ title, description, ogImage }`;

// ── Site settings ────────────────────────────────────────────────────────

const SETTINGS_QUERY = /* groq */ `*[_id == "settings"][0]{
  name, tagline, "logo": logo{asset->{_id,url}, alt, iconSvg}, favicon,
  "navLinks": navLinks[]${linkFragment},
  socials, email, location,
  analytics, verification, scripts, cookieConsent, maintenance, notFound,
  ${SEO_FIELDS}
}`;

// ── Page-builder pages — one query per page, per-section-type branches
// (AK-SAN-013), sections fetched in their editor-defined order.

const HOME_PAGE_QUERY = /* groq */ `*[_id == "homePage"][0]{
  sections[]{
    _key, _type,
    _type == "heroSection" => {
      eyebrow, heading, subheadLine1, subheadLine2,
      primaryCta${ctaBtnFragment}, secondaryCta${ctaBtnFragment}
    },
    _type == "statsSection" => { sectionHeader${sectionHeaderFragment}, stats },
    _type == "featuredProjectsSection" => { sectionHeader${sectionHeaderFragment} },
    _type == "testimonialsSection" => { sectionHeader${sectionHeaderFragment} }
  },
  ${SEO_FIELDS}
}`;

const ABOUT_PAGE_QUERY = /* groq */ `*[_id == "aboutPage"][0]{
  sections[]{
    _key, _type,
    _type == "aboutHeroSection" => {
      name, tags, bio,
      primaryCta${ctaBtnFragment}, secondaryCta${ctaBtnFragment}
    },
    _type == "statsSection" => { sectionHeader${sectionHeaderFragment}, stats },
    _type == "experienceSection" => { sectionHeader${sectionHeaderFragment} },
    _type == "techSection" => { sectionHeader${sectionHeaderFragment} },
    _type == "ctaSection" => { sectionHeader${sectionHeaderFragment}, secondaryCta${ctaBtnFragment} }
  },
  ${SEO_FIELDS}
}`;

const PROJECTS_PAGE_QUERY = /* groq */ `*[_id == "projectsPage"][0]{
  sections[]{
    _key, _type,
    _type == "projectsHeroSection" => { heading, subheading },
    _type == "ctaSection" => { sectionHeader${sectionHeaderFragment}, secondaryCta${ctaBtnFragment} }
  },
  ${SEO_FIELDS}
}`;

const CONTACT_PAGE_QUERY = /* groq */ `*[_id == "contactPage"][0]{
  sections[]{
    _key, _type,
    _type == "contactHeroSection" => { eyebrow, heading, subheading }
  },
  ${SEO_FIELDS}
}`;

const LEGAL_PAGE_QUERY = /* groq */ `*[_type == "legalPage" && slug == $slug][0]{
  slug, heading, lastUpdated, sections, ${SEO_FIELDS}
}`;

// ── Collections ──────────────────────────────────────────────────────────

const PROJECTS_QUERY = /* groq */ `*[_type == "project"] | order(order asc){
  _id, name, description, tags, image, video, screenshots,
  sourceCodeLink, link, learning, order
}`;

const EXPERIENCES_QUERY = /* groq */ `*[_type == "experience"] | order(order asc){
  _id, title, companyName, icon, iconBg, date, points, order
}`;

const TECHNOLOGIES_QUERY = /* groq */ `*[_type == "technology"] | order(order asc){
  _id, name, icon, order
}`;

const TESTIMONIALS_QUERY = /* groq */ `*[_type == "testimonial"] | order(order asc){
  _id, testimonial, name, designation, company, image, order
}`;

// Every helper catches, logs, and returns null/[] — AK-CMS-032. A CMS outage
// or a malformed query must never surface as an unhandled 500.

export async function getSettings(): Promise<Settings | null> {
  try {
    const { data } = await sanityFetch({ query: SETTINGS_QUERY });
    return (data as Settings) ?? null;
  } catch (err) {
    console.error("[sanity] getSettings failed:", err);
    return null;
  }
}

export async function getHomePage(): Promise<HomePage | null> {
  try {
    const { data } = await sanityFetch({ query: HOME_PAGE_QUERY });
    return (data as HomePage) ?? null;
  } catch (err) {
    console.error("[sanity] getHomePage failed:", err);
    return null;
  }
}

export async function getAboutPage(): Promise<AboutPage | null> {
  try {
    const { data } = await sanityFetch({ query: ABOUT_PAGE_QUERY });
    return (data as AboutPage) ?? null;
  } catch (err) {
    console.error("[sanity] getAboutPage failed:", err);
    return null;
  }
}

export async function getProjectsPage(): Promise<ProjectsPage | null> {
  try {
    const { data } = await sanityFetch({ query: PROJECTS_PAGE_QUERY });
    return (data as ProjectsPage) ?? null;
  } catch (err) {
    console.error("[sanity] getProjectsPage failed:", err);
    return null;
  }
}

export async function getContactPage(): Promise<ContactPage | null> {
  try {
    const { data } = await sanityFetch({ query: CONTACT_PAGE_QUERY });
    return (data as ContactPage) ?? null;
  } catch (err) {
    console.error("[sanity] getContactPage failed:", err);
    return null;
  }
}

export async function getLegalPage(slug: "privacy" | "terms"): Promise<LegalPage | null> {
  try {
    const { data } = await sanityFetch({ query: LEGAL_PAGE_QUERY, params: { slug } });
    return (data as LegalPage) ?? null;
  } catch (err) {
    console.error("[sanity] getLegalPage failed:", err);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const { data } = await sanityFetch({ query: PROJECTS_QUERY });
    return (data as Project[]) ?? [];
  } catch (err) {
    console.error("[sanity] getProjects failed:", err);
    return [];
  }
}

export async function getExperiences(): Promise<Experience[]> {
  try {
    const { data } = await sanityFetch({ query: EXPERIENCES_QUERY });
    return (data as Experience[]) ?? [];
  } catch (err) {
    console.error("[sanity] getExperiences failed:", err);
    return [];
  }
}

export async function getTechnologies(): Promise<Technology[]> {
  try {
    const { data } = await sanityFetch({ query: TECHNOLOGIES_QUERY });
    return (data as Technology[]) ?? [];
  } catch (err) {
    console.error("[sanity] getTechnologies failed:", err);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data } = await sanityFetch({ query: TESTIMONIALS_QUERY });
    return (data as Testimonial[]) ?? [];
  } catch (err) {
    console.error("[sanity] getTestimonials failed:", err);
    return [];
  }
}
