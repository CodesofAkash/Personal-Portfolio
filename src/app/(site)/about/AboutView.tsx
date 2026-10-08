"use client";

import SectionRenderer from "@/components/sections/SectionRenderer";
import type { AboutSection } from "@/sanity/lib/types";

interface AboutViewProps {
  sections: AboutSection[];
}

// No ScrollTrigger cleanup here anymore — nothing on this page registers
// a ScrollTrigger instance any more (every section now uses
// IntersectionObserver instead; see sections/Stats.tsx for why).
const AboutView = ({ sections }: AboutViewProps) => {
  return (
    <div style={{ background: "#050816", color: "#f8fafc" }}>
      <SectionRenderer sections={sections} />
    </div>
  );
};

export default AboutView;
