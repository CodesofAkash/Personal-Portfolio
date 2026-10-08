"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { CtaSection } from "@/sanity/lib/types";
import Cta from "./Cta";
import Heading from "./Heading";
import { C } from "./colors";

// Shared by About and Projects' closing CTA panel.
const CtaPanel = ({ section }: { section: CtaSection }) => {
  const ref = useRef<HTMLDivElement>(null);

  // IntersectionObserver, not ScrollTrigger — see Stats.tsx for why.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let tween: gsap.core.Tween | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        tween = gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" });
        observer.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, []);

  const h = section.sectionHeader;
  if (!h?.heading?.length) return null;

  return (
    <section className="px-6 sm:px-16 py-24" style={{ borderTop: `1px solid ${C.border}` }}>
      <div ref={ref} className="max-w-7xl mx-auto rounded-3xl p-12 sm:p-20 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg,${C.violet}20,${C.teal}15,${C.card})`, border: `1px solid ${C.violet}30` }}>
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: `radial-gradient(circle at top right,${C.teal}20,transparent 70%)` }} />

        {h.eyebrow && <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.teal }}>{h.eyebrow}</p>}
        <Heading
          segments={h.heading}
          className="font-black mb-6"
          style={{ fontSize: "clamp(2rem,5vw,4rem)", color: C.white, fontFamily: "'Bebas Neue',sans-serif" }}
        />
        {h.paragraph && (
          <p className="max-w-lg mx-auto mb-10 text-[17px] leading-relaxed" style={{ color: C.dim }}>
            {h.paragraph}
          </p>
        )}
        {h.ctas && h.ctas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {h.ctas.map((cta) => (
              <Cta key={cta.text} cta={cta} size="lg" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CtaPanel;
