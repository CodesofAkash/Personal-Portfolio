import { seo } from "./seo";
import { link } from "./objects/link";
import { ctaBtn } from "./objects/ctaBtn";
import { ctaBtns } from "./objects/ctaBtns";
import { sectionHeader } from "./objects/sectionHeader";
import { stat } from "./objects/stat";
import { headingSegments } from "./objects/headingSegments";
import { imageWithAlt } from "./objects/imageWithAlt";
import { socialLink } from "./objects/socialLink";
import { navigationItem } from "./objects/navigationItem";
import { linkList } from "./objects/linkList";
import { header } from "./objects/header";
import { footer } from "./objects/footer";
import { contactItem } from "./objects/contactItem";
import { formField } from "./objects/formField";
import { heroSection } from "./sections/heroSection";
import { aboutHeroSection } from "./sections/aboutHeroSection";
import { projectsHeroSection } from "./sections/projectsHeroSection";
import { projectsGridSection } from "./sections/projectsGridSection";
import { contactHeroSection } from "./sections/contactHeroSection";
import { contactFormSection } from "./sections/contactFormSection";
import { statsSection } from "./sections/statsSection";
import { featuredProjectsSection } from "./sections/featuredProjectsSection";
import { testimonialsSection } from "./sections/testimonialsSection";
import { experienceSection } from "./sections/experienceSection";
import { techSection } from "./sections/techSection";
import { ctaSection } from "./sections/ctaSection";
import { settings } from "./settings";
import { homePage } from "./homePage";
import { aboutPage } from "./aboutPage";
import { projectsPage } from "./projectsPage";
import { contactPage } from "./contactPage";
import { legalPage } from "./legalPage";
import { project } from "./project";
import { experience } from "./experience";
import { technology } from "./technology";
import { testimonial } from "./testimonial";

export const schemaTypes = [
  // Shared object types
  seo,
  link,
  ctaBtn,
  ctaBtns,
  sectionHeader,
  stat,
  headingSegments,
  imageWithAlt,
  socialLink,
  navigationItem,
  linkList,
  header,
  footer,
  contactItem,
  formField,
  // Page-builder sections
  heroSection,
  aboutHeroSection,
  projectsHeroSection,
  projectsGridSection,
  contactHeroSection,
  contactFormSection,
  statsSection,
  featuredProjectsSection,
  testimonialsSection,
  experienceSection,
  techSection,
  ctaSection,
  // Singletons
  settings,
  homePage,
  aboutPage,
  projectsPage,
  contactPage,
  // Collections
  legalPage,
  project,
  experience,
  technology,
  testimonial,
];
