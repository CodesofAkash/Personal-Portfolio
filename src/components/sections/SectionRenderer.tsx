import type {
  AboutSection,
  ContactSection,
  Experience,
  HomeSection,
  Project,
  ProjectsSection,
  Technology,
  Testimonial,
} from "@/sanity/lib/types";
import Hero from "@/components/Hero";
import Stats from "./Stats";
import FeaturedProjects from "./FeaturedProjects";
import Testimonials from "./Testimonials";
import AboutHero from "./AboutHero";
import ExperienceTimeline from "./ExperienceTimeline";
import TechMarquee from "./TechMarquee";
import CtaPanel from "./CtaPanel";
import ProjectsHero from "./ProjectsHero";
import ContactHero from "./ContactHero";

type AnySection = HomeSection | AboutSection | ProjectsSection | ContactSection;

interface SectionRendererProps {
  sections: AnySection[];
  projects?: Project[];
  testimonials?: Testimonial[];
  experiences?: Experience[];
  technologies?: Technology[];
}

// One dispatch component reused by every page with a sections array
// (AK-CMS-023). An unmatched type renders null, never throws — a
// page-builder is allowed to contain types a given pass hasn't reached.
const SectionRenderer = ({
  sections,
  projects = [],
  testimonials = [],
  experiences = [],
  technologies = [],
}: SectionRendererProps) => {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case "heroSection":
            return <Hero key={section._key} section={section} />;
          case "aboutHeroSection":
            return <AboutHero key={section._key} section={section} />;
          case "projectsHeroSection":
            return <ProjectsHero key={section._key} section={section} />;
          case "contactHeroSection":
            return <ContactHero key={section._key} section={section} />;
          case "statsSection":
            return <Stats key={section._key} section={section} />;
          case "featuredProjectsSection":
            return <FeaturedProjects key={section._key} section={section} projects={projects} />;
          case "testimonialsSection":
            return <Testimonials key={section._key} section={section} testimonials={testimonials} />;
          case "experienceSection":
            return <ExperienceTimeline key={section._key} section={section} experiences={experiences} />;
          case "techSection":
            return <TechMarquee key={section._key} section={section} technologies={technologies} />;
          case "ctaSection":
            return <CtaPanel key={section._key} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default SectionRenderer;
