import type { AboutSection, ContactSection, HomeSection, ProjectsSection, Testimonial } from "@/sanity/lib/types";
import Hero from "@/components/Hero";
import Stats from "./Stats";
import FeaturedProjects from "./FeaturedProjects";
import Testimonials from "./Testimonials";
import AboutHero from "./AboutHero";
import ExperienceTimeline from "./ExperienceTimeline";
import TechMarquee from "./TechMarquee";
import CtaPanel from "./CtaPanel";
import ProjectsHero from "./ProjectsHero";
import ProjectsGrid from "./ProjectsGrid";
import ContactHero from "./ContactHero";

type AnySection = HomeSection | AboutSection | ProjectsSection | ContactSection;

interface SectionRendererProps {
  sections: AnySection[];
  testimonials?: Testimonial[];
}

// One dispatch component reused by every page with a sections array
// (AK-CMS-023). An unmatched type renders null, never throws — a
// page-builder is allowed to contain types a given pass hasn't reached.
// Each section resolves its own collection data (projects/experiences/
// technologies) via GROQ — only testimonials still comes from a page-level
// fetch, since testimonialsSection has no all/manual selector.
const SectionRenderer = ({ sections, testimonials = [] }: SectionRendererProps) => {
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
          case "projectsGridSection":
            return <ProjectsGrid key={section._key} projects={section.projects} />;
          case "contactHeroSection":
            return <ContactHero key={section._key} section={section} />;
          case "statsSection":
            return <Stats key={section._key} section={section} />;
          case "featuredProjectsSection":
            return <FeaturedProjects key={section._key} section={section} />;
          case "testimonialsSection":
            return <Testimonials key={section._key} section={section} testimonials={testimonials} />;
          case "experienceSection":
            return <ExperienceTimeline key={section._key} section={section} />;
          case "techSection":
            return <TechMarquee key={section._key} section={section} />;
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
