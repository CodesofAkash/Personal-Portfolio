"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ContactHeroSection } from "@/sanity/lib/types";
import { C } from "./colors";

const ContactHero = ({ section }: { section: ContactHeroSection }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const line = el.querySelector(".c-line");
      const label = el.querySelector(".c-label");
      const h1 = el.querySelector(".c-h1");
      const sub = el.querySelector(".c-sub");
      if (line && label && h1 && sub) {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(line, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
          .fromTo(label, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
          .fromTo(h1, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
          .fromTo(sub, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");
      }
    });
    return () => ctx.revert();
  }, [section.heading]);

  return (
    <section ref={ref} className="relative px-6 sm:px-16 pt-16 pb-16 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle,${C.violet}10 0%,transparent 70%)` }} />
      <div className="c-line w-16 h-1 mb-6 rounded-full" style={{ background: `linear-gradient(90deg,${C.teal},${C.violet})` }} />
      <p className="c-label text-sm uppercase tracking-widest mb-3" style={{ color: C.teal }}>{section.eyebrow}</p>
      <h1 className="c-h1 font-black mb-4" style={{ fontSize: "clamp(3rem,9vw,7rem)", color: C.white, fontFamily: "'Bebas Neue','Impact',sans-serif", lineHeight: 1.05 }}>
        {section.heading}
      </h1>
      <p className="c-sub max-w-xl text-[17px] leading-relaxed" style={{ color: C.dim }}>
        {section.subheading}
      </p>
    </section>
  );
};

export default ContactHero;
