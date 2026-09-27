import { seo } from "./seo";
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
