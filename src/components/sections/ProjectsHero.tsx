"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ProjectsHeroSection } from "@/sanity/lib/types";
import { C } from "./colors";

const ProjectsHero = ({ section }: { section: ProjectsHeroSection }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(el.querySelector(".ph-line"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
        .fromTo(el.querySelector(".ph-h1"), { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
        .fromTo(el.querySelector(".ph-sub"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
    });
    return () => ctx.revert();
  }, [section.headingLine1]);

  return (
    <section ref={ref} className="relative px-6 sm:px-16 pt-16 pb-12 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(ellipse at 20% 50%,${C.violet}08 0%,transparent 60%), radial-gradient(ellipse at 80% 20%,${C.teal}06 0%,transparent 50%)` }} />
      <div className="ph-line w-16 h-1 mb-6 rounded-full" style={{ background: `linear-gradient(90deg,${C.teal},${C.violet})` }} />
      <h1 className="ph-h1 font-black mb-4" style={{ fontSize: "clamp(3rem,9vw,7rem)", color: C.white, fontFamily: "'Bebas Neue','Impact',sans-serif", lineHeight: 1.05 }}>
        {section.headingLine1}
        <br />
        <span style={{ WebkitTextStroke: `2px ${C.violet}`, color: "transparent" }}>{section.headingHighlight}</span>
      </h1>
      <p className="ph-sub max-w-xl text-[17px] leading-relaxed" style={{ color: C.dim }}>
        {section.subheading}
      </p>
    </section>
  );
};

export default ProjectsHero;
