import type { AboutSection, ContactSection, HomeSection, ProjectsSection, Testimonial } from "@/sanity/lib/types";
import dynamic from "next/dynamic";
import Stats from "./Stats";
import FeaturedProjects from "./FeaturedProjects";
import Testimonials from "./Testimonials";
import AboutHero from "./AboutHero";
import ExperienceTimeline from "./ExperienceTimeline";
import TechMarquee from "./TechMarquee";
import CtaPanel from "./CtaPanel";
import ProjectsHero from "./ProjectsHero";
import ProjectsGrid from "./ProjectsGrid";

// Dynamic, not a static import like every other section here: both pull in
// Three.js (~900KB) transitively through their 3D canvases. A static import
// puts that whole chunk in SectionRenderer's module graph, and since every
// page (About, Projects, Privacy, Terms) renders through this same
// SectionRenderer, every page paid to download and parse Three.js even
// when it has no 3D section at all (confirmed via a production Lighthouse
// run on /projects — the chunk was a required <script> tag, ~1.4-1.8s of
// main-thread time, despite neither Hero nor ContactHero ever mounting
// there). Splitting them here means only Home and Contact's own bundles
// include it. ssr stays default (true) so the sections that do use these
// still render in the initial HTML, unchanged from before.
const Hero = dynamic(() => import("@/components/Hero"));
const ContactHero = dynamic(() => import("./ContactHero"));

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
