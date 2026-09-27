"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "@/components/Contact";
import StarsCanvas from "@/components/canvas/Stars";
import type { ContactPage, Settings } from "@/sanity/lib/types";

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

interface ContactViewProps {
  content: ContactPage | null;
  settings: Settings | null;
}

const ContactView = ({ content, settings }: ContactViewProps) => {
  const heroRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const cards = cardsRef.current;
    if (!hero || !cards) return;

    const ctx = gsap.context(() => {
      const line = hero.querySelector(".c-line");
      const label = hero.querySelector(".c-label");
      const h1 = hero.querySelector(".c-h1");
      const sub = hero.querySelector(".c-sub");

      if (line && label && h1 && sub) {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(line, { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
          .fromTo(label, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
          .fromTo(h1, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
          .fromTo(sub, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3");
      }

      gsap.fromTo(
        cards.querySelectorAll(".info-card"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: cards, start: "top 85%" },
        },
      );
    });

    return () => ctx.revert();
  }, [content?.heading]);

  const github = settings?.socials?.find((s) => s.label.toLowerCase() === "github");

  const infoCards = [
    settings?.email && {
      icon: "📧",
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
      color: C.violet,
    },
    github && {
      icon: "🐙",
      label: "GitHub",
      value: github.url.replace(/^https?:\/\//, ""),
      href: github.url,
      color: C.teal,
    },
    settings?.location && {
      icon: "🌐",
      label: "Location",
      value: settings.location,
      href: null,
      color: C.amber,
    },
  ].filter((c): c is { icon: string; label: string; value: string; href: string | null; color: string } => Boolean(c));

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh" }}>
      <section
        ref={heroRef}
        className="relative px-6 sm:px-16 pt-16 pb-16 max-w-7xl mx-auto overflow-hidden"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle,${C.violet}10 0%,transparent 70%)` }}
        />

        <div
          className="c-line w-16 h-1 mb-6 rounded-full"
          style={{ background: `linear-gradient(90deg,${C.teal},${C.violet})` }}
        />
        {content?.eyebrow && (
          <p className="c-label text-sm uppercase tracking-widest mb-3" style={{ color: C.teal }}>
            {content.eyebrow}
          </p>
        )}
        {content?.heading && (
          <h1
            className="c-h1 font-black mb-4"
            style={{
              fontSize: "clamp(3rem,9vw,7rem)",
              color: C.white,
              fontFamily: "'Bebas Neue','Impact',sans-serif",
              lineHeight: 1.05,
            }}
          >
            {content.heading}
          </h1>
        )}
        {content?.subheading && (
          <p className="c-sub max-w-xl text-[17px] leading-relaxed" style={{ color: C.dim }}>
            {content.subheading}
          </p>
        )}
      </section>

      {infoCards.length > 0 && (
        <section ref={cardsRef} className="px-6 sm:px-16 pb-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 mb-16">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className="info-card flex items-center gap-4 px-6 py-4 rounded-2xl"
                style={{ background: C.card, border: `1px solid ${card.color}20` }}
              >
                <span className="text-2xl">{card.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: card.color }}>
                    {card.label}
                  </p>
                  {card.href ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium hover:underline"
                      style={{ color: C.white }}
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium" style={{ color: C.white }}>
                      {card.value}
                    </p>
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
