"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Testimonial, TestimonialsSection } from "@/sanity/lib/types";
import Heading from "./Heading";
import { C } from "./colors";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = ({ section, testimonials }: { section: TestimonialsSection; testimonials: Testimonial[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const head = headRef.current;
    if (!el || !head) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(head, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: head, start: "top 85%" } });
      gsap.fromTo(
        el.querySelectorAll(".t-card"),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } },
      );
    });
    return () => ctx.revert();
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const h = section.sectionHeader;

  return (
    <section className="px-6 sm:px-16 py-24" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} className="mb-12">
          {h?.eyebrow && <p className="text-sm uppercase tracking-widest mb-3" style={{ color: C.amber }}>{h.eyebrow}</p>}
          {h?.heading && h.heading.length > 0 && (
            <Heading
              segments={h.heading}
              className="font-black"
              style={{ fontSize: "clamp(2rem,6vw,5rem)", color: C.white, fontFamily: "'Bebas Neue','Impact',sans-serif" }}
            />
          )}
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="t-card flex flex-col rounded-2xl p-7 relative" style={{ background: C.card, border: `1px solid ${C.border}` }}>
              <span className="absolute top-5 right-6 text-5xl font-black leading-none select-none" style={{ color: `${C.violet}20`, fontFamily: "Georgia, serif" }}>
                &quot;
              </span>
              <p className="text-[15px] leading-relaxed flex-1 mb-6 relative z-10" style={{ color: C.dim }}>
                &quot;{t.testimonial}&quot;
              </p>
              <div className="w-full h-px mb-5" style={{ background: `linear-gradient(90deg,${C.violet}30,transparent)` }} />
              <div className="flex items-center gap-3">
                <Image src={t.image} alt={t.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover flex-shrink-0" style={{ border: `2px solid ${C.violet}40` }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: C.white }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.dim }}>{t.designation} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
