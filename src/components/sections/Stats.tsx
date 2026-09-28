"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StatsSection } from "@/sanity/lib/types";
import Heading from "./Heading";
import Cta from "./Cta";
import { C } from "./colors";

gsap.registerPlugin(ScrollTrigger);

const VARIANT_COLOR: Record<string, string> = { violet: C.violet, teal: C.teal, amber: C.amber, rose: C.rose };
const statColor = (variant?: string) => VARIANT_COLOR[variant ?? "violet"] ?? C.violet;

// Renders two ways depending on whether a sectionHeader is set: Home's
// "About" panel (header + text on the left, stats on the right) or About's
// stand-alone stats bar (stats only) — same statsSection schema either way.
const Stats = ({ section }: { section: StatsSection }) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasHeader = Boolean(section.sectionHeader?.heading?.length);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll(".stat-item");
    if (!items.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        },
      );
    });
    return () => ctx.revert();
  }, [section.stats.length]);

  if (hasHeader) {
    const h = section.sectionHeader!;
    return (
      <section id="about" className="px-6 sm:px-16 py-24 max-w-7xl mx-auto">
        <div ref={ref} className="flex flex-col lg:flex-row items-start gap-16">
          <div className="stat-item flex-1">
            <div
              className="w-12 h-0.5 mb-6 rounded-full"
              style={{ background: `linear-gradient(90deg,${C.violet},${C.teal})` }}
            />
            {h.eyebrow && (
              <p className="text-sm uppercase tracking-widest mb-3" style={{ color: C.teal }}>
                {h.eyebrow}
              </p>
            )}
            <Heading
              segments={h.heading}
              className="font-black mb-6 leading-tight"
              style={{
                fontSize: "clamp(2rem,5vw,4rem)",
                color: C.white,
                fontFamily: "'Bebas Neue','Impact',sans-serif",
              }}
            />
            {h.paragraph && (
              <p className="text-[17px] leading-relaxed mb-8 max-w-xl" style={{ color: C.dim }}>
                {h.paragraph}
              </p>
            )}
            {h.ctas && h.ctas.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {h.ctas.map((cta) => (
                  <Cta key={cta.text} cta={cta} />
                ))}
              </div>
            )}
          </div>

          <div className="stat-item flex flex-row lg:flex-col gap-4">
            {section.stats.map((s) => (
              <div
                key={s.label}
                className="flex-1 lg:flex-none flex flex-col items-center text-center rounded-2xl px-8 py-6"
                style={{ background: C.card, border: `1px solid ${statColor(s.variant)}20` }}
              >
                <span
                  className="font-black text-4xl"
                  style={{ color: statColor(s.variant), fontFamily: "'Bebas Neue',monospace" }}
                >
                  {s.value}
                </span>
                <span className="text-xs uppercase tracking-wider mt-1" style={{ color: C.dim }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={ref}
      className="px-6 sm:px-16 py-16"
      style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
        {section.stats.map((s) => (
          <div key={s.label} className="stat-item flex flex-col items-center text-center">
            <span
              className="font-black text-5xl mb-1"
              style={{ color: statColor(s.variant), fontFamily: "'Bebas Neue',monospace" }}
            >
              {s.value}
            </span>
            <span className="text-sm uppercase tracking-widest" style={{ color: C.dim }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
