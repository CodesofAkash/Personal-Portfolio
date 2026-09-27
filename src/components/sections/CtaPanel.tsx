"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CtaSection } from "@/sanity/lib/types";
import Cta from "./Cta";
import { C } from "./colors";

gsap.registerPlugin(ScrollTrigger);

// Shared by About and Projects' closing CTA panel.
const CtaPanel = ({ section }: { section: CtaSection }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } });
    });
    return () => ctx.revert();
  }, []);

  const h = section.sectionHeader;
  if (!h?.heading) return null;

  return (
    <section className="px-6 sm:px-16 py-24" style={{ borderTop: `1px solid ${C.border}` }}>
      <div ref={ref} className="max-w-7xl mx-auto rounded-3xl p-12 sm:p-20 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg,${C.violet}20,${C.teal}15,${C.card})`, border: `1px solid ${C.violet}30` }}>
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: `radial-gradient(circle at top right,${C.teal}20,transparent 70%)` }} />

        {h.eyebrow && <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.teal }}>{h.eyebrow}</p>}
        <h2 className="font-black mb-6" style={{ fontSize: "clamp(2rem,5vw,4rem)", color: C.white, fontFamily: "'Bebas Neue',sans-serif" }}>
          {h.heading}
          {section.headingHighlight && (
            <>
              <br />
              <span style={{ color: C.violet }}>{section.headingHighlight}</span>
            </>
          )}
        </h2>
        {h.paragraph && (
          <p className="max-w-lg mx-auto mb-10 text-[17px] leading-relaxed" style={{ color: C.dim }}>
            {h.paragraph}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Cta cta={h.cta} size="lg" />
          <Cta cta={section.secondaryCta} size="lg" />
        </div>
      </div>
    </section>
  );
};

export default CtaPanel;
