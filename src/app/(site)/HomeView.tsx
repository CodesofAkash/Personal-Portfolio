"use client";

import SectionRenderer from "@/components/sections/SectionRenderer";
import type { HomeSection, Testimonial } from "@/sanity/lib/types";

interface HomeViewProps {
  sections: HomeSection[];
  testimonials: Testimonial[];
}

// No ScrollTrigger cleanup here anymore — nothing on this page registers
// a ScrollTrigger instance any more (every section now uses
// IntersectionObserver instead; see sections/Stats.tsx for why), so this
// was dead code that existed only to import the plugin, which is exactly
// what kept pulling its ~43KB chunk into Home's bundle regardless of
// SectionRenderer's own sections being deferred.
const HomeView = ({ sections, testimonials }: HomeViewProps) => {
  const heroSection = sections.find((s) => s._type === "heroSection");
  const restSections = sections.filter((s) => s._type !== "heroSection");

  return (
    <div style={{ background: "#050816", color: "#f8fafc" }}>
      {heroSection && <SectionRenderer sections={[heroSection]} />}
      <SectionRenderer sections={restSections} testimonials={testimonials} />
    </div>
  );
};

export default HomeView;
