"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "@/components/Contact";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { ContactSection, Settings } from "@/sanity/lib/types";
import { C } from "@/components/sections/colors";

const StarsCanvas = dynamic(() => import("@/components/canvas/Stars"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

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

  const github = settings?.socials?.find((s) => s.label.toLowerCase() === "github");

  const infoCards = [
    settings?.email && { icon: "📧", label: "Email", value: settings.email, href: `mailto:${settings.email}`, color: C.violet },
    github && { icon: "🐙", label: "GitHub", value: github.url.replace(/^https?:\/\//, ""), href: github.url, color: C.teal },
    settings?.location && { icon: "🌐", label: "Location", value: settings.location, href: null, color: C.amber },
  ].filter((c): c is { icon: string; label: string; value: string; href: string | null; color: string } => Boolean(c));

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh" }}>
      <SectionRenderer sections={sections} />

      {infoCards.length > 0 && (
        <section ref={cardsRef} className="px-6 sm:px-16 pb-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 mb-16">
            {infoCards.map((card) => (
              <div key={card.label} className="info-card flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: C.card, border: `1px solid ${card.color}20` }}>
                <span className="text-2xl" aria-hidden>{card.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: card.color }}>{card.label}</p>
                  {card.href ? (
                    <a href={card.href} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline" style={{ color: C.white }}>{card.value}</a>
                  ) : (
                    <p className="text-sm font-medium" style={{ color: C.white }}>{card.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="relative z-0">
        <ContactForm settings={settings} />
        <StarsCanvas />
      </div>
    </div>
  );
};

export default ContactView;
