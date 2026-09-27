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
  white: "#f8fafc",
  dim: "#94a3b8",
  bg: "#050816",
  card: "#0f172a",
  border: "rgba(148,163,184,0.08)",
};

interface PrivacyViewProps {
  content: LegalPage | null;
}

const PrivacyView = ({ content }: PrivacyViewProps) => {
  const heroRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const secs = sectionsRef.current;
    if (!hero || !secs) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(hero.querySelector(".p-line"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
        .fromTo(hero.querySelector(".p-tag"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(hero.querySelector(".p-h1"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
        .fromTo(hero.querySelector(".p-date"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");

      secs.querySelectorAll(".sec-card").forEach((card) => {
        gsap.fromTo(
          card,
          { x: -30, opacity: 0 },
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
      <section ref={heroRef} className="relative px-6 sm:px-16 pt-16 pb-16 max-w-4xl mx-auto">
        <div
          className="absolute top-1/3 right-0 w-64 h-64 pointer-events-none"
          style={{ background: `radial-gradient(circle,${C.violet}08,transparent 70%)` }}
        />

        <div
          className="p-line w-12 h-0.5 mb-6 rounded-full"
          style={{ background: `linear-gradient(90deg,${C.violet},${C.teal})` }}
        />
        <p className="p-tag text-xs uppercase tracking-widest mb-3" style={{ color: C.teal }}>
          Legal
        </p>
        {content?.heading && (
          <h1
            className="p-h1 font-black mb-4"
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
          <p className="p-date text-sm" style={{ color: C.dim }}>
            Last updated: {content.lastUpdated}
          </p>
        )}
      </section>

      <section ref={sectionsRef} className="px-6 sm:px-16 pb-24 max-w-4xl mx-auto space-y-4">
        {sections.map((s, i) => (
          <div
            key={s.title}
            className="sec-card group rounded-2xl p-8 transition-all duration-300"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${C.violet}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
            }}
          >
            <div className="flex items-start gap-6">
              <span
                aria-hidden="true"
                className="flex-shrink-0 font-black text-3xl leading-none select-none"
                style={{ color: `${C.violet}30`, fontFamily: "'Bebas Neue',monospace" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-bold text-lg mb-3" style={{ color: C.white }}>
                  {s.title}
                </h2>
                <p className="text-[15px] leading-relaxed" style={{ color: C.dim }}>
                  {s.body}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-8 flex items-center gap-4">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105"
            style={{ background: `linear-gradient(135deg,${C.violet},${C.teal})` }}
          >
            Contact me with questions →
          </Link>
          <Link href="/terms" className="text-sm hover:underline" style={{ color: C.dim }}>
            View Terms of Service
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyView;
