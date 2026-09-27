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

// Reused on every query that returns SEO — AK-SAN-011.
const SEO_FIELDS = /* groq */ `seo{ title, description, ogImage }`;

const SETTINGS_QUERY = /* groq */ `*[_id == "settings"][0]{
  name, tagline, logo, favicon, navLinks, socials, email, location,
  analytics, verification, scripts, cookieConsent, maintenance, notFound,
  ${SEO_FIELDS}
}`;

const HOME_PAGE_QUERY = /* groq */ `*[_id == "homePage"][0]{
  heroEyebrow, heroGreeting, heroName, heroSubheadLine1, heroSubheadLine2,
  heroCtaPrimaryLabel, heroCtaSecondaryLabel,
  aboutEyebrow, aboutHeading, aboutBody, aboutCtaLabel, aboutStats,
  featuredProjectsEyebrow, featuredProjectsHeading, featuredProjectsViewAllLabel,
  testimonialsEyebrow, testimonialsHeading,
  ${SEO_FIELDS}
}`;

const ABOUT_PAGE_QUERY = /* groq */ `*[_id == "aboutPage"][0]{
  heroName, heroTags, heroBio, heroCtaPrimaryLabel, heroCtaSecondaryLabel,
  stats, experienceEyebrow, experienceHeading, techEyebrow, techHeading,
  ctaEyebrow, ctaHeadingLine1, ctaHeadingHighlight, ctaBody, ctaPrimaryLabel, ctaSecondaryLabel,
  ${SEO_FIELDS}
}`;

const PROJECTS_PAGE_QUERY = /* groq */ `*[_id == "projectsPage"][0]{
  heroHeadingLine1, heroHeadingHighlight, heroSubheading,
  ctaEyebrow, ctaHeading, ctaBody, ctaLabel,
  ${SEO_FIELDS}
}`;

const CONTACT_PAGE_QUERY = /* groq */ `*[_id == "contactPage"][0]{
  eyebrow, heading, subheading,
  ${SEO_FIELDS}
}`;

const LEGAL_PAGE_QUERY = /* groq */ `*[_type == "legalPage" && slug == $slug][0]{
  slug, heading, lastUpdated, sections, ${SEO_FIELDS}
}`;

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
