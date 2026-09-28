"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { AboutSection } from "@/sanity/lib/types";

gsap.registerPlugin(ScrollTrigger);

interface AboutViewProps {
  sections: AboutSection[];
}

const AboutView = ({ sections }: AboutViewProps) => {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div style={{ background: "#050816", color: "#f8fafc" }}>
      <SectionRenderer sections={sections} />
    </div>
  );
};

export default AboutView;
