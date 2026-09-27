"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/Hero";
import type { HomePage, Project, Testimonial } from "@/sanity/lib/types";

gsap.registerPlugin(ScrollTrigger);

const C = {
  violet: "#7c3aed",
  teal: "#0d9488",
  amber: "#d97706",
  rose: "#e11d48",
  white: "#f8fafc",
  dim: "#94a3b8",
  bg: "#050816",
  card: "#0f172a",
  border: "rgba(148,163,184,0.08)",
};

const HomeAbout = ({ content }: { content: HomePage | null }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".about-item"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  const stats = content?.aboutStats ?? [];
  const statColors = [C.violet, C.teal, C.amber];

  if (!content?.aboutHeading) return null;

  return (
    <section
      id="about"
      ref={ref}
      className="px-6 sm:px-16 py-24 max-w-7xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row items-start gap-16">
        <div className="about-item flex-1">
          <div
            className="w-12 h-0.5 mb-6 rounded-full"
            style={{ background: `linear-gradient(90deg,${C.violet},${C.teal})` }}
          />
          {content.aboutEyebrow && (
            <p
              className="text-sm uppercase tracking-widest mb-3"
              style={{ color: C.teal }}
            >
              {content.aboutEyebrow}
            </p>
          )}
          <h2
            className="font-black mb-6 leading-tight"
            style={{
              fontSize: "clamp(2rem,5vw,4rem)",
              color: C.white,
              fontFamily: "'Bebas Neue','Impact',sans-serif",
            }}
          >
            {content.aboutHeading}
          </h2>
          {content.aboutBody && (
            <p
              className="text-[17px] leading-relaxed mb-8 max-w-xl"
              style={{ color: C.dim }}
            >
              {content.aboutBody}
            </p>
          )}
          {content.aboutCtaLabel && (
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ background: `linear-gradient(135deg,${C.violet},${C.teal})` }}
            >
              {content.aboutCtaLabel}
            </Link>
          )}
        </div>

        {stats.length > 0 && (
          <div className="about-item flex flex-row lg:flex-col gap-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="flex-1 lg:flex-none flex flex-col items-center text-center rounded-2xl px-8 py-6"
                style={{
                  background: C.card,
                  border: `1px solid ${statColors[i % statColors.length]}20`,
                }}
              >
                <span
                  className="font-black text-4xl"
                  style={{
                    color: statColors[i % statColors.length],
                    fontFamily: "'Bebas Neue',monospace",
                  }}
                >
                  {s.value}
                </span>
                <span
                  className="text-xs uppercase tracking-wider mt-1"
                  style={{ color: C.dim }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          delay: index * 0.1,
        },
      );
    });
    return () => ctx.revert();
  }, [index]);

  const accents = [C.violet, C.teal, C.amber];
  const accent = accents[index % accents.length];

  return (
    <div
      ref={ref}
      className="group rounded-2xl overflow-hidden flex flex-col w-full sm:w-[340px]"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
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
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${accent}20,${C.bg})` }}
          >
            <span
              className="font-black text-6xl select-none"
              style={{ color: `${accent}30` }}
            >
              {name.charAt(0)}
            </span>
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
          style={{
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <img
            src="/assets/github.png"
            alt="github"
            className="w-4 h-4 object-contain"
          />
        </a>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2" style={{ color: C.white }}>
          {name}
        </h3>
        <p
          className="text-sm leading-relaxed flex-1 line-clamp-3 mb-4"
          style={{ color: C.dim }}
        >
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag.name}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                background: `${accent}15`,
                color: accent,
                border: `1px solid ${accent}25`,
              }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: `${accent}20`,
              color: accent,
              border: `1px solid ${accent}30`,
            }}
          >
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
};

const HomeFeaturedProjects = ({
  content,
  projects,
}: {
  content: HomePage | null;
  projects: Project[];
}) => {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section
      className="px-6 sm:px-16 py-24"
      style={{ borderTop: `1px solid ${C.border}` }}
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} className="mb-12">
          {content?.featuredProjectsEyebrow && (
            <p
              className="text-sm uppercase tracking-widest mb-3"
              style={{ color: C.rose }}
            >
              {content.featuredProjectsEyebrow}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {content?.featuredProjectsHeading && (
              <h2
                className="font-black"
                style={{
                  fontSize: "clamp(2rem,6vw,5rem)",
                  color: C.white,
                  fontFamily: "'Bebas Neue','Impact',sans-serif",
                }}
              >
                {content.featuredProjectsHeading}
              </h2>
            )}
            {content?.featuredProjectsViewAllLabel && (
              <Link
                href="/projects"
                className="flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-105"
                style={{
                  borderColor: `${C.violet}40`,
                  color: C.violet,
                  background: `${C.violet}10`,
                }}
              >
                {content.featuredProjectsViewAllLabel}
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {projects.map((project, i) => (
            <ProjectCard key={project._id} {...project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const HomeTestimonials = ({
  content,
  testimonials,
}: {
  content: HomePage | null;
  testimonials: Testimonial[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const head = headRef.current;
    if (!el || !head) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        head,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: head, start: "top 85%" },
        },
      );
      gsap.fromTo(
        el.querySelectorAll(".t-card"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section
      className="px-6 sm:px-16 py-24"
      style={{ borderTop: `1px solid ${C.border}` }}
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headRef} className="mb-12">
          {content?.testimonialsEyebrow && (
            <p
              className="text-sm uppercase tracking-widest mb-3"
              style={{ color: C.amber }}
            >
              {content.testimonialsEyebrow}
            </p>
          )}
          {content?.testimonialsHeading && (
            <h2
              className="font-black"
              style={{
                fontSize: "clamp(2rem,6vw,5rem)",
                color: C.white,
                fontFamily: "'Bebas Neue','Impact',sans-serif",
              }}
            >
              {content.testimonialsHeading}
            </h2>
          )}
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="t-card flex flex-col rounded-2xl p-7 relative"
              style={{ background: C.card, border: `1px solid ${C.border}` }}
            >
              <span
                className="absolute top-5 right-6 text-5xl font-black leading-none select-none"
                style={{ color: `${C.violet}20`, fontFamily: "Georgia, serif" }}
              >
                &quot;
              </span>

              <p
                className="text-[15px] leading-relaxed flex-1 mb-6 relative z-10"
                style={{ color: C.dim }}
              >
                &quot;{t.testimonial}&quot;
              </p>

              <div
                className="w-full h-px mb-5"
                style={{ background: `linear-gradient(90deg,${C.violet}30,transparent)` }}
              />

              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  style={{ border: `2px solid ${C.violet}40` }}
                />
                <div>
                  <p className="font-semibold text-sm" style={{ color: C.white }}>
                    {t.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: C.dim }}>
                    {t.designation} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface HomeViewProps {
  content: HomePage | null;
  featuredProjects: Project[];
  testimonials: Testimonial[];
}

const HomeView = ({ content, featuredProjects, testimonials }: HomeViewProps) => {
  useEffect(() => () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <div style={{ background: C.bg, color: C.white }}>
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Hero content={content} />
      </div>
      <HomeAbout content={content} />
      <HomeFeaturedProjects content={content} projects={featuredProjects} />
      <HomeTestimonials content={content} testimonials={testimonials} />
    </div>
  );
};

export default HomeView;
