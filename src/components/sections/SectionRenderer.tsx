import type { AboutSection, ContactSection, HomeSection, ProjectsSection, Testimonial } from "@/sanity/lib/types";
import dynamic from "next/dynamic";

// Every section dynamic, not a static import — a static import puts the
// whole chunk in SectionRenderer's module graph, and since every page
// (Home, About, Projects, Contact, Privacy, Terms) renders through this
// same SectionRenderer, every page paid to download and parse every
// section's dependencies, even sections it never renders a single
// instance of. First caught with Hero/ContactHero and Three.js
// (confirmed via a production Lighthouse run on /projects — the ~900KB
// chunk was a required <script> tag despite neither ever mounting
// there), but the same bug applied to every other section too: Home
// doesn't render ExperienceTimeline, ProjectsGrid or TechMarquee, but
// all three statically imported GSAP's ScrollTrigger plugin, so Home
// paid for it anyway — confirmed via a production trace showing
// ScrollTrigger as a required async chunk on Home's own page despite
// none of its own sections using it anymore (AK-PERF-019: a page-builder
// dispatcher must defer *every* heavy branch, not just the one that
// happened to get noticed first). ssr stays default (true) so every
// section still renders in the initial HTML, unchanged from before.
const Hero = dynamic(() => import("@/components/Hero"));
const ContactHero = dynamic(() => import("./ContactHero"));
const Stats = dynamic(() => import("./Stats"));
const FeaturedProjects = dynamic(() => import("./FeaturedProjects"));
const Testimonials = dynamic(() => import("./Testimonials"));
const AboutHero = dynamic(() => import("./AboutHero"));
const ExperienceTimeline = dynamic(() => import("./ExperienceTimeline"));
const TechMarquee = dynamic(() => import("./TechMarquee"));
const CtaPanel = dynamic(() => import("./CtaPanel"));
const ProjectsHero = dynamic(() => import("./ProjectsHero"));
const ProjectsGrid = dynamic(() => import("./ProjectsGrid"));

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
