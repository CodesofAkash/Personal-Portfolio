"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import type { FeaturedProjectsSection, Project } from "@/sanity/lib/types";
import Heading from "./Heading";
import { C, textSafe } from "./colors";

const ACCENTS = [C.violet, C.teal, C.amber];

const ProjectCard = ({
  name,
  description,
  tags,
  image,
  sourceCodeLink,
  link,
  index,
}: Project & { index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const accent = ACCENTS[index % ACCENTS.length];

  // IntersectionObserver, not ScrollTrigger — see Stats.tsx for why.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let tween: gsap.core.Tween | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        tween = gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: index * 0.1 });
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [index]);

  return (
    <div
      ref={ref}
      className="group rounded-2xl overflow-hidden flex flex-col w-full sm:w-[340px]"
      style={{ background: C.card, border: `1px solid ${C.border}`, transition: "border-color 0.3s, box-shadow 0.3s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}40`;
        e.currentTarget.style.boxShadow = `0 20px 60px ${accent}12`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="relative w-full h-[200px] overflow-hidden">
        {image ? (
          <Image src={image} alt={name} fill sizes="340px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${accent}20,${C.bg})` }}>
            <span className="font-black text-6xl select-none" style={{ color: `${accent}30` }}>{name.charAt(0)}</span>
          </div>
        )}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)` }}
        />
        <a
          href={sourceCodeLink}
          target="_blank"
          rel="noreferrer"
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <Image src="/assets/github.png" alt="github" width={16} height={16} className="w-4 h-4 object-contain" />
        </a>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2" style={{ color: C.white }}>{name}</h3>
        <p className="text-sm leading-relaxed flex-1 line-clamp-3 mb-4" style={{ color: C.dim }}>{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag.name} className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: `${accent}15`, color: textSafe(accent), border: `1px solid ${accent}25` }}>
              #{tag.name}
            </span>
          ))}
        </div>
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02]" style={{ background: `${accent}20`, color: textSafe(accent), border: `1px solid ${accent}30` }}>
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
};

const FeaturedProjects = ({ section }: { section: FeaturedProjectsSection }) => {
  const headRef = useRef<HTMLDivElement>(null);
  const featured = section.projects;

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    let tween: gsap.core.Tween | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        tween = gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
        observer.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, []);

  if (featured.length === 0) return null;
  const h = section.sectionHeader;

  return (
    <section className="px-6 sm:px-16 py-24" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} className="mb-12">
          {h?.eyebrow && (
            <p className="text-sm uppercase tracking-widest mb-3" style={{ color: textSafe(C.rose) }}>{h.eyebrow}</p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {h?.heading && h.heading.length > 0 && (
              <Heading
                segments={h.heading}
                className="font-black"
                style={{ fontSize: "clamp(2rem,6vw,5rem)", color: C.white, fontFamily: "'Bebas Neue','Impact',sans-serif" }}
              />
            )}
            {h?.ctas?.map((cta) => (
              <Link
                key={cta.text}
                href={cta.href}
                className="flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-105"
                style={{ borderColor: `${C.violet}40`, color: textSafe(C.violet), background: `${C.violet}10` }}
              >
                {cta.text}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {featured.map((project, i) => (
            <ProjectCard key={project._id} {...project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
