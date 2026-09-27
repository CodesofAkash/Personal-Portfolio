"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { AboutHeroSection } from "@/sanity/lib/types";
import Cta from "./Cta";
import { C } from "./colors";

const TAG_COLORS = [C.violet, C.teal, C.amber, C.rose];

const AboutHero = ({ section }: { section: AboutHeroSection }) => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const line = el.querySelector(".hero-line");
    const chars = el.querySelectorAll(".hero-char");
    const tags = el.querySelectorAll(".hero-tag");
    const bio = el.querySelector(".hero-bio");
    const ctas = el.querySelectorAll(".hero-cta");
    if (!line || !chars.length) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(line, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
        .fromTo(chars, { y: 100, opacity: 0, rotateX: -80 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.035 }, "-=0.3")
        .fromTo(tags, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.08 }, "-=0.4")
        .fromTo(bio, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(ctas, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.3");
    });

    return () => ctx.revert();
  }, [section.name]);

  const tags = section.tags ?? [];

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-6 sm:px-16 pt-16 pb-16 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${C.violet}04 1px,transparent 1px),linear-gradient(90deg,${C.violet}04 1px,transparent 1px)`, backgroundSize: "60px 60px" }} />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle,${C.violet}14 0%,transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle,${C.teal}10 0%,transparent 70%)` }} />

      <div className="hero-line w-20 h-1 mb-8 rounded-full" style={{ background: `linear-gradient(90deg,${C.violet},${C.teal})` }} />

      <h1 className="font-black leading-none mb-6 overflow-hidden" style={{ fontSize: "clamp(3rem,10vw,8rem)", fontFamily: "'Bebas Neue','Impact',sans-serif", color: C.white, perspective: "600px" }}>
        {section.name.split("").map((char, i) => (
          <span key={i} className="hero-char inline-block" style={{ whiteSpace: char === " " ? "pre" : "normal" }}>
            {char}
          </span>
        ))}
      </h1>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {tags.map((tag, i) => (
            <span key={tag} className="hero-tag px-4 py-1.5 rounded-full text-sm font-medium border" style={{ borderColor: TAG_COLORS[i % TAG_COLORS.length], color: TAG_COLORS[i % TAG_COLORS.length], background: `${TAG_COLORS[i % TAG_COLORS.length]}18` }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="hero-bio max-w-2xl text-[17px] leading-relaxed mb-10" style={{ color: C.dim }}>
        {section.bio}
      </p>

      {(section.primaryCta || section.secondaryCta) && (
        <div className="flex flex-wrap gap-4">
          <span className="hero-cta"><Cta cta={section.primaryCta} /></span>
          <span className="hero-cta"><Cta cta={section.secondaryCta} /></span>
        </div>
      )}

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs tracking-widest uppercase" style={{ color: C.dim }}>scroll</span>
        <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(${C.violet},transparent)` }} />
      </div>
    </section>
  );
};

export default AboutHero;
