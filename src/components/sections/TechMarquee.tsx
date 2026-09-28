"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TechSection } from "@/sanity/lib/types";
import Heading from "./Heading";
import { C } from "./colors";

gsap.registerPlugin(ScrollTrigger);

const Pill = ({ name, icon }: { name: string; icon?: string }) => (
  <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-full mx-2" style={{ background: C.card, border: `1px solid ${C.border}` }}>
    {icon ? (
      <Image src={icon} alt={name} width={24} height={24} className="w-6 h-6 object-contain" />
    ) : (
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: C.violet, color: "#fff" }}>
        {name.charAt(0)}
      </div>
    )}
    <span className="text-sm font-medium whitespace-nowrap" style={{ color: C.white }}>{name}</span>
  </div>
);

const TechMarquee = ({ section }: { section: TechSection }) => {
  const technologies = section.technologies;
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const tweens = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const el = ref.current;
    const head = headRef.current;
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!el || !head || !r1 || !r2) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(head, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: head, start: "top 80%" } });
      const setupMarquee = (rowEl: HTMLDivElement, dir: number) => {
        const w = rowEl.scrollWidth / 2;
        tweens.current.push(gsap.fromTo(rowEl, { x: dir > 0 ? 0 : -w }, { x: dir > 0 ? -w : 0, duration: 28, ease: "none", repeat: -1 }));
      };
      setupMarquee(r1, 1);
      setupMarquee(r2, -1);
    });

    return () => {
      tweens.current.forEach((t) => t.kill());
      tweens.current = [];
      ctx.revert();
    };
  }, [technologies.length]);

  if (technologies.length === 0) return null;
  const h = section.sectionHeader;
  const half = Math.ceil(technologies.length / 2);
  const row1 = [...technologies.slice(0, half), ...technologies.slice(0, half)];
  const row2 = [...technologies.slice(half), ...technologies.slice(half)];

  return (
    <section ref={ref} className="py-24 overflow-hidden">
      <div className="px-6 sm:px-16 max-w-7xl mx-auto mb-12">
        {h?.eyebrow && <p className="text-sm uppercase tracking-widest mb-3" style={{ color: C.amber }}>{h.eyebrow}</p>}
        {h?.heading && h.heading.length > 0 && (
          <Heading
            ref={headRef}
            segments={h.heading}
            className="font-black"
            style={{ fontSize: "clamp(2rem,6vw,5rem)", color: C.white, fontFamily: "'Bebas Neue',sans-serif" }}
          />
        )}
      </div>

      <div className="space-y-4">
        {[{ rowRef: row1Ref, items: row1 }, { rowRef: row2Ref, items: row2 }].map(({ rowRef, items }, ri) => (
          <div key={ri} className="flex overflow-hidden" style={{ maskImage: "linear-gradient(90deg,transparent,black 10%,black 90%,transparent)" }}>
            <div ref={rowRef} className="flex">
              {items.map((tech, i) => (
                <Pill key={`r${ri}-${i}`} name={tech.name} icon={tech.icon} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechMarquee;
