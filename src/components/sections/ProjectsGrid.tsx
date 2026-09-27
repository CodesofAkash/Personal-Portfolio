"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/sanity/lib/types";
import { C, textSafe } from "./colors";

gsap.registerPlugin(ScrollTrigger);

const ACCENTS = [C.violet, C.teal, C.amber, C.rose];
type EnrichedProject = Project & { accent: string };

const VideoPreview = ({ src, accent }: { src?: string; accent: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const keepMuted = () => { v.muted = true; };
    v.addEventListener("volumechange", keepMuted);
    return () => v.removeEventListener("volumechange", keepMuted);
  }, []);

  if (!src) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg,${accent}15,${C.bg})` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg,${accent} 0,${accent} 1px,transparent 0,transparent 50%)`, backgroundSize: "20px 20px" }} />
        <div className="text-center z-10">
          <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center mx-auto mb-3" style={{ borderColor: `${accent}60` }}>
            <span className="text-2xl">▶</span>
          </div>
          <p className="text-sm font-medium" style={{ color: textSafe(accent) }}>Video preview</p>
          <p className="text-xs mt-1" style={{ color: C.dim }}>Coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden" style={{ background: "#0a0f1e" }}>
      <video ref={videoRef} src={src} muted loop playsInline controls controlsList="novolume nodownload nofullscreen" disablePictureInPicture className="w-full h-full portfolio-video" style={{ objectFit: "contain" }} />
    </div>
  );
};

const ScreenshotsCarousel = ({ screenshots, accent, name }: { screenshots: string[]; accent: string; name: string }) => {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [animating, setAnimating] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    screenshots.forEach((src, i) => {
      if (!src) return;
      const img = new window.Image();
      img.onload = () => setLoaded((prev) => ({ ...prev, [i]: true }));
      img.src = src;
    });
  }, [screenshots]);

  const allLoaded = screenshots.every((src, i) => !src || loaded[i]);

  const go = useCallback((rawIdx: number) => {
    if (animating) return;
    const total = screenshots.length;
    const next = ((rawIdx % total) + total) % total;
    if (next === active) return;
    setAnimating(true);
    const dir = next > active ? 1 : -1;
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        x: -dir * 40, opacity: 0, duration: 0.18, ease: "power2.in",
        onComplete: () => {
          setActive(next);
          gsap.fromTo(imgRef.current, { x: dir * 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25, ease: "power2.out", onComplete: () => setAnimating(false) });
        },
      });
    } else {
      setActive(next);
      setAnimating(false);
    }
  }, [active, animating, screenshots.length]);

  const total = screenshots.length;

  if (!allLoaded) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: "4/3", background: `linear-gradient(135deg,${accent}10,#0f172a)` }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: accent, borderRightColor: `${accent}40` }} />
          <p className="text-xs" style={{ color: textSafe(accent) }}>
            Loading {screenshots.filter((s, i) => s && loaded[i]).length} / {screenshots.filter((s) => s).length}
          </p>
        </div>
      </div>
    );
  }

  const src = screenshots[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: "4/3", background: "#0f172a" }}>
        <div ref={imgRef} className="w-full h-full">
          {src ? (
            <Image src={src} alt={`${name} screenshot ${active + 1}`} fill sizes="(max-width: 640px) 90vw, 400px" style={{ objectFit: "contain" }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs" style={{ color: "#64748b" }}>No image</p>
            </div>
          )}
        </div>
        {total > 1 && (
          <button onClick={() => go(active - 1)} aria-label="Previous screenshot" className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 hover:scale-110" style={{ background: "rgba(5,8,22,0.75)", border: `1px solid ${accent}50`, color: "#fff" }}>‹</button>
        )}
        {total > 1 && (
          <button onClick={() => go(active + 1)} aria-label="Next screenshot" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 hover:scale-110" style={{ background: "rgba(5,8,22,0.75)", border: `1px solid ${accent}50`, color: "#fff" }}>›</button>
        )}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(5,8,22,0.8)", color: "#94a3b8" }}>{active + 1} / {total}</div>
      </div>
      <div className="flex items-center gap-1.5 justify-center flex-wrap">
        {screenshots.map((_, i) => (
          <button key={i} onClick={() => go(i)} aria-label={`Go to screenshot ${i + 1}`} className="flex-shrink-0 transition-all duration-200" style={{ width: i === active ? "20px" : "7px", height: "7px", borderRadius: "4px", background: i === active ? accent : `${accent}35` }} />
        ))}
      </div>
    </div>
  );
};

const ExpandedCard = ({ project, onClose }: { project: EnrichedProject; onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { accent } = project;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: -20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    gsap.fromTo(el.querySelectorAll(".exp-section"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out", delay: 0.2 });
  }, [project.name]);

  return (
    <div ref={ref} className="rounded-3xl overflow-hidden mb-8" style={{ background: C.card, border: `1px solid ${accent}35`, boxShadow: `0 0 80px ${accent}12, 0 30px 60px rgba(0,0,0,0.4)` }}>
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,${accent},${accent}60,transparent)` }} />
      <div className="p-6 sm:p-10">
        <div className="exp-section flex items-start justify-between gap-4 mb-8">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: textSafe(accent) }}>Featured Project</p>
            <h2 className="font-black leading-tight mb-3" style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", color: C.white, fontFamily: "'Bebas Neue','Impact',sans-serif" }}>{project.name}</h2>
            <p className="text-[16px] leading-relaxed max-w-2xl" style={{ color: C.dim }}>{project.description}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ background: `${accent}20`, border: `1px solid ${accent}30`, color: C.white }} aria-label="Close">✕</button>
        </div>

        <div className="exp-section grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.dim }}>Preview</p>
            <div style={{ aspectRatio: "16/9", width: "100%", background: "#0a0f1e", borderRadius: "12px", overflow: "hidden", marginTop: "55px" }}>
              <VideoPreview src={project.video} accent={accent} />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.dim }}>Screenshots</p>
            <ScreenshotsCarousel screenshots={project.screenshots} accent={accent} name={project.name} />
          </div>
        </div>

        <div className="exp-section grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-1">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.dim }}>Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag.name} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: `${accent}18`, color: textSafe(accent), border: `1px solid ${accent}30` }}>{tag.name}</span>
              ))}
            </div>
          </div>
          <div className="sm:col-span-1">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.dim }}>What I Learned</p>
            <div className="flex gap-2">
              <div className="w-0.5 rounded-full flex-shrink-0 mt-1" style={{ background: `${accent}50`, minHeight: "40px" }} />
              <p className="text-sm leading-relaxed" style={{ color: C.dim }}>{project.learning}</p>
            </div>
          </div>
          <div className="sm:col-span-1 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest mb-0" style={{ color: C.dim }}>Links</p>
            <a href={project.sourceCodeLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, color: C.white }}>
              <Image src="/assets/github.png" alt="" width={16} height={16} className="w-4 h-4 object-contain" />
              View Source
            </a>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]" style={{ background: `linear-gradient(135deg,${accent},${accent}cc)` }}>
                <span aria-hidden>↗</span>
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompactCard = ({ project, isActive, onClick, index }: { project: EnrichedProject; isActive: boolean; onClick: () => void; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);
  const { accent } = project;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" }, delay: (index % 3) * 0.1 });
    });
    return () => ctx.revert();
  }, [index]);

  useEffect(() => {
    const v = vidRef.current;
    if (!v || !project.video) return;
    if (hovering) v.play().catch(() => {});
    else { v.pause(); v.currentTime = 0; }
  }, [hovering, project.video]);

  return (
    <button
      ref={ref as unknown as React.RefObject<HTMLButtonElement>}
      type="button"
      className="group relative rounded-2xl overflow-hidden flex flex-col cursor-pointer select-none text-left"
      style={{ background: C.card, border: `1px solid ${isActive ? accent + "50" : hovering ? accent + "30" : C.border}`, boxShadow: isActive ? `0 0 40px ${accent}20` : hovering ? `0 8px 30px ${accent}10` : "none", transition: "border-color 0.3s, box-shadow 0.3s" }}
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label={`${project.name} — ${isActive ? "collapse" : "expand"} details`}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", background: "#0a0f1e" }}>
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={index === 0}
            className="transition-transform duration-700"
            style={{ objectFit: "cover", transform: hovering ? "scale(1.06)" : "scale(1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg,${accent}18,${C.bg})` }}>
            <span className="font-black text-6xl select-none" style={{ color: `${accent}30`, fontFamily: "'Bebas Neue',monospace" }}>{project.name.charAt(0)}</span>
          </div>
        )}
        {project.video && (
          <video ref={vidRef} src={project.video} muted loop playsInline className="absolute inset-0 w-full h-full transition-opacity duration-500" style={{ objectFit: "cover", opacity: hovering ? 1 : 0 }} />
        )}
        {!project.video && (
          <div className="absolute inset-0 transition-opacity duration-500 flex items-center justify-center" style={{ opacity: hovering ? 1 : 0, background: `rgba(5,8,22,0.65)` }}>
            <span className="text-sm font-medium px-4 py-2 rounded-full" style={{ background: `${accent}25`, color: textSafe(accent), border: `1px solid ${accent}40` }}>Click to expand</span>
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300" style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)`, opacity: hovering || isActive ? 1 : 0 }} />
        {isActive && <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: accent, color: "#fff" }}>Expanded ↑</div>}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="font-bold text-[17px] leading-tight" style={{ color: C.white }}>{project.name}</h2>
          <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 transition-all duration-300" style={{ background: accent, boxShadow: hovering ? `0 0 8px ${accent}` : "none" }} />
        </div>
        <p className="text-sm leading-relaxed flex-1 mb-4 line-clamp-2" style={{ color: C.dim }}>{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag.name} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium" style={{ background: `${accent}14`, color: textSafe(accent), border: `1px solid ${accent}22` }}>{tag.name}</span>
          ))}
        </div>
      </div>
    </button>
  );
};

const ProjectsGrid = ({ projects }: { projects: Project[] }) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const enriched: EnrichedProject[] = projects.map((p, i) => ({ ...p, accent: ACCENTS[i % ACCENTS.length] }));

  const handleCardClick = (idx: number) => {
    if (activeIdx === idx) { setActiveIdx(null); return; }
    setActiveIdx(idx);
    setTimeout(() => { expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
  };

  if (enriched.length === 0) return null;

  const activeProject = activeIdx !== null ? enriched[activeIdx] : null;
  const activeRow = activeIdx !== null ? Math.floor(activeIdx / 3) : null;
  const numRows = Math.ceil(enriched.length / 3);

  return (
    <section className="px-6 sm:px-16 pb-24 max-w-7xl mx-auto">
      {Array.from({ length: numRows }, (_, rowIdx) => {
        const rowProjects = enriched.slice(rowIdx * 3, rowIdx * 3 + 3);
        return (
          <div key={rowIdx}>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${rowIdx > 0 ? "mt-6" : ""}`}>
              {rowProjects.map((project, j) => {
                const realIdx = rowIdx * 3 + j;
                return <CompactCard key={project._id} project={project} index={realIdx} isActive={activeIdx === realIdx} onClick={() => handleCardClick(realIdx)} />;
              })}
            </div>
            {activeRow === rowIdx && activeProject && (
              <div ref={expandedRef} className="mt-6">
                <ExpandedCard project={activeProject} onClose={() => setActiveIdx(null)} />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ProjectsGrid;
