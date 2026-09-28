"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "@/components/Contact";
import SectionRenderer from "@/components/sections/SectionRenderer";
import Icon from "@/components/Icon";
import type { ContactSection, Settings } from "@/sanity/lib/types";
import { C, textSafe } from "@/components/sections/colors";

const StarsCanvas = dynamic(() => import("@/components/canvas/Stars"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const VARIANT_COLOR: Record<string, string> = { violet: C.violet, teal: C.teal, amber: C.amber, rose: C.rose };
const variantColor = (variant?: string) => VARIANT_COLOR[variant ?? "violet"] ?? C.violet;

interface ContactViewProps {
  sections: ContactSection[];
  settings: Settings | null;
}

const ContactView = ({ sections, settings }: ContactViewProps) => {
  const cardsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards.querySelectorAll(".info-card"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: cards, start: "top 85%" } },
      );
    });
    return () => ctx.revert();
  }, []);

  const hero = sections.find((s) => s._type === "contactHeroSection");
  const formSection = sections.find((s) => s._type === "contactFormSection");
  const items = hero?._type === "contactHeroSection" ? hero.items ?? [] : [];
  const modelUrl = hero?._type === "contactHeroSection" ? hero.model : undefined;

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh" }}>
      <SectionRenderer sections={sections} />

      {items.length > 0 && (
        <section ref={cardsRef} className="px-6 sm:px-16 pb-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 mb-16">
            {items.map((item) => {
              const color = variantColor(item.variant);
              return (
                <div key={item._key} className="info-card flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: C.card, border: `1px solid ${color}20` }}>
                  <Icon image={item.image} fallbackAlt={item.label} width={24} height={24} className="w-6 h-6 object-contain" />
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: textSafe(color) }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.target === "_blank" ? "_blank" : undefined} rel={item.target === "_blank" ? "noreferrer" : undefined} className="text-sm font-medium hover:underline" style={{ color: C.white }}>{item.value}</a>
                    ) : (
                      <p className="text-sm font-medium" style={{ color: C.white }}>{item.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="relative z-0">
        <ContactForm settings={settings} formSection={formSection?._type === "contactFormSection" ? formSection : undefined} modelUrl={modelUrl} />
        <StarsCanvas />
      </div>
    </div>
  );
};

export default ContactView;
