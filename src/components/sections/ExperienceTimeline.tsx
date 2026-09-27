"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Experience, ExperienceSection } from "@/sanity/lib/types";
import { C } from "./colors";

gsap.registerPlugin(ScrollTrigger);

const ACCENTS = [C.violet, C.teal, C.amber, C.violet, C.rose, C.teal, C.amber];

const ExperienceTimeline = ({ section, experiences }: { section: ExperienceSection; experiences: Experience[] }) => {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    const head = headRef.current;
    if (!el || !head) return;
    const cards = el.querySelectorAll(".exp-card");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(head, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: head, start: "top 85%" } });
      cards.forEach((card, i) => {
        gsap.fromTo(card, { x: i % 2 === 0 ? -60 : 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } });
      });
    });
    return () => ctx.revert();
  }, [experiences.length]);

  if (experiences.length === 0) return null;
  const h = section.sectionHeader;

  return (
    <section ref={ref} className="px-6 sm:px-16 py-24" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto">
        {h?.eyebrow && <p className="text-sm uppercase tracking-widest mb-3" style={{ color: C.teal }}>{h.eyebrow}</p>}
        {h?.heading && (
          <h2 ref={headRef} className="font-black mb-16" style={{ fontSize: "clamp(2rem,6vw,5rem)", color: C.white, fontFamily: "'Bebas Neue',sans-serif" }}>
            {h.heading}
          </h2>
        )}

        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px" style={{ background: `linear-gradient(${C.violet},${C.teal},${C.amber})`, opacity: 0.3 }} />
          <div className="space-y-12">
            {experiences.map((exp, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const isRight = i % 2 === 0;
              return (
                <div key={exp._id} className={`exp-card relative flex flex-col sm:flex-row gap-6 ${isRight ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-8 z-10 ring-4" style={{ background: accent }} />
                  <div className="hidden sm:block flex-1" />
                  <div className="flex-1 ml-10 sm:ml-0 rounded-2xl p-6 sm:p-8" style={{ background: C.card, border: `1px solid ${accent}25`, boxShadow: `0 0 30px ${accent}08` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: exp.iconBg || "#1e293b" }}>
                        {exp.icon ? (
                          <Image src={exp.icon} alt={exp.companyName} width={28} height={28} className="w-7 h-7 object-contain" />
                        ) : (
                          <span className="text-white font-bold">{exp.companyName.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest" style={{ color: accent }}>{exp.companyName}</p>
                        <p className="text-xs" style={{ color: C.dim }}>{exp.date}</p>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-3 leading-snug" style={{ color: C.white }}>{exp.title}</h3>
                    <ul className="space-y-1.5">
                      {exp.points.map((pt, pi) => (
                        <li key={pi} className="flex gap-2 text-sm leading-relaxed" style={{ color: C.dim }}>
                          <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
