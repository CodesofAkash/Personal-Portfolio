"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionRenderer from "@/components/sections/SectionRenderer";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import type { Project, ProjectsSection } from "@/sanity/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface ProjectsViewProps {
  sections: ProjectsSection[];
  projects: Project[];
}

const ProjectsView = ({ sections, projects }: ProjectsViewProps) => {
  useEffect(() => () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  const heroSection = sections.find((s) => s._type === "projectsHeroSection");
  const ctaSection = sections.find((s) => s._type === "ctaSection");

  return (
    <div style={{ background: "#050816", color: "#f8fafc" }}>
      {heroSection && <SectionRenderer sections={[heroSection]} />}
      <ProjectsGrid projects={projects} />
      {ctaSection && <SectionRenderer sections={[ctaSection]} />}
    </div>
  );
};

export default ProjectsView;
