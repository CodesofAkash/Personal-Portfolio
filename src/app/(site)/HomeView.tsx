"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { HomeSection, Project, Testimonial } from "@/sanity/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface HomeViewProps {
  sections: HomeSection[];
  projects: Project[];
  testimonials: Testimonial[];
}

const HomeView = ({ sections, projects, testimonials }: HomeViewProps) => {
  useEffect(() => () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  const heroSection = sections.find((s) => s._type === "heroSection");
  const restSections = sections.filter((s) => s._type !== "heroSection");

  return (
    <div style={{ background: "#050816", color: "#f8fafc" }}>
      {heroSection && (
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <SectionRenderer sections={[heroSection]} />
        </div>
      )}
      <SectionRenderer sections={restSections} projects={projects} testimonials={testimonials} />
    </div>
  );
};

export default HomeView;
