"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LegalPage } from "@/sanity/lib/types";

gsap.registerPlugin(ScrollTrigger);

const C = {
  violet: "#7c3aed",
  teal: "#0d9488",
  amber: "#d97706",
  white: "#f8fafc",
  dim: "#94a3b8",
  bg: "#050816",
  card: "#0f172a",
  border: "rgba(148,163,184,0.08)",
};
const SECTION_COLORS = [C.violet, C.teal, C.amber];

interface TermsViewProps {
  content: LegalPage | null;
}

const TermsView = ({ content }: TermsViewProps) => {
  const heroRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const secs = sectionsRef.current;
    if (!hero || !secs) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(hero.querySelector(".t-line"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
        .fromTo(hero.querySelector(".t-tag"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(hero.querySelector(".t-h1"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
        .fromTo(hero.querySelector(".t-date"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");

      secs.querySelectorAll(".sec-card").forEach((card) => {
        gsap.fromTo(
          card,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          },
        );
      });
    });

    return () => ctx.revert();
  }, [content?.sections?.length]);

  const sections = content?.sections ?? [];

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh" }}>
      <section ref={heroRef} className="relative px-6 sm:px-16 pt-32 pb-16 max-w-4xl mx-auto">
        <div
          className="absolute top-1/3 left-0 w-64 h-64 pointer-events-none"
          style={{ background: `radial-gradient(circle,${C.teal}08,transparent 70%)` }}
        />

        <div
          className="t-line w-12 h-0.5 mb-6 rounded-full"
          style={{ background: `linear-gradient(90deg,${C.teal},${C.amber})` }}
        />
        <p className="t-tag text-xs uppercase tracking-widest mb-3" style={{ color: C.amber }}>
          Legal
        </p>
        {content?.heading && (
          <h1
            className="t-h1 font-black mb-4"
            style={{
              fontSize: "clamp(2.5rem,7vw,6rem)",
              color: C.white,
              fontFamily: "'Bebas Neue','Impact',sans-serif",
              lineHeight: 1.05,
            }}
          >
            {content.heading}
          </h1>
        )}
        {content?.lastUpdated && (
          <p className="t-date text-sm" style={{ color: C.dim }}>
            Last updated: {content.lastUpdated}
          </p>
        )}
      </section>

      <section ref={sectionsRef} className="px-6 sm:px-16 pb-24 max-w-4xl mx-auto space-y-4">
        {sections.map((s, i) => {
          const color = SECTION_COLORS[i % SECTION_COLORS.length];
          return (
            <div
              key={s.title}
              className="sec-card rounded-2xl p-8 transition-all duration-300"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              <div className="flex items-start gap-6">
                <span
                  className="flex-shrink-0 font-black text-3xl leading-none select-none"
                  style={{ color: `${color}35`, fontFamily: "'Bebas Neue',monospace" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                    <h2 className="font-bold text-lg" style={{ color: C.white }}>
                      {s.title}
                    </h2>
                  </div>
                  <p className="text-[15px] leading-relaxed" style={{ color: C.dim }}>
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-8 flex items-center gap-4">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105"
            style={{ background: `linear-gradient(135deg,${C.teal},${C.amber})` }}
          >
            Contact me with questions →
          </Link>
          <Link href="/privacy" className="text-sm hover:underline" style={{ color: C.dim }}>
            View Privacy Policy
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TermsView;
