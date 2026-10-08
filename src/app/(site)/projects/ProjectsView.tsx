"use client";

import SectionRenderer from "@/components/sections/SectionRenderer";
import type { ProjectsSection } from "@/sanity/lib/types";

interface ProjectsViewProps {
  sections: ProjectsSection[];
}

// No ScrollTrigger cleanup here anymore — nothing on this page registers
// a ScrollTrigger instance any more (every section now uses
// IntersectionObserver instead; see sections/Stats.tsx for why).
const ProjectsView = ({ sections }: ProjectsViewProps) => {
  return (
    <div style={{ background: "#050816", color: "#f8fafc" }}>
      <SectionRenderer sections={sections} />
    </div>
  );
};

export default ProjectsView;
