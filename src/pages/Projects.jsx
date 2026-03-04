import { useEffect, useRef, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { projects as baseProjects } from "../constants"
import { github } from "../assets"

// Inject CSS to hide mute button from video controls (controlsList doesn't work in Chrome)
const injectVideoStyles = () => {
  if (document.getElementById("video-controls-style")) return
  const style = document.createElement("style")
  style.id = "video-controls-style"
  style.textContent = `
    .portfolio-video::-webkit-media-controls-mute-button { display: none !important; }
    .portfolio-video::-webkit-media-controls-volume-slider { display: none !important; }
    .portfolio-video::-webkit-media-controls-volume-control-container { display: none !important; }
  `
  document.head.appendChild(style)
}
injectVideoStyles()


gsap.registerPlugin(ScrollTrigger)

const C = {
  violet: "#7c3aed", teal: "#0d9488", amber: "#d97706", rose: "#e11d48",
  white: "#f8fafc", dim: "#94a3b8", bg: "#050816", card: "#0f172a",
  border: "rgba(148,163,184,0.08)",
}
const ACCENTS = [C.violet, C.teal, C.amber, C.rose]

// ── Enrich projects — video / screenshots / learning come from constants
const enriched = baseProjects.map((p, i) => ({
  ...p,
  accent: ACCENTS[i % ACCENTS.length],
}))

// ── Hero section (page header) ────────────────────────────────────────────────
const ProjectsHero = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(el.querySelector(".ph-line"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
        .fromTo(el.querySelector(".ph-h1"),   { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
        .fromTo(el.querySelector(".ph-sub"),  { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative px-6 sm:px-16 pt-16 pb-12 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(ellipse at 20% 50%,${C.violet}08 0%,transparent 60%),
                          radial-gradient(ellipse at 80% 20%,${C.teal}06 0%,transparent 50%)`,
      }} />
      <div className="ph-line w-16 h-1 mb-6 rounded-full"
        style={{ background: `linear-gradient(90deg,${C.teal},${C.violet})` }} />
      <h1 className="ph-h1 font-black mb-4" style={{
        fontSize: "clamp(3rem,9vw,7rem)", color: C.white,
        fontFamily: "'Bebas Neue','Impact',sans-serif", lineHeight: 1.05,
      }}>
        What I've<br />
        <span style={{ WebkitTextStroke: `2px ${C.violet}`, color: "transparent" }}>Built.</span>
      </h1>
      <p className="ph-sub max-w-xl text-[17px] leading-relaxed" style={{ color: C.dim }}>
        Click any project to expand it. Every project ships to production.
      </p>
    </section>
  )
}

// ── Video player with placeholder ─────────────────────────────────────────────
const VideoPreview = ({ src, accent }) => {
  // Prevent unmuting — always re-mute if user somehow changes it
  const videoRef = useRef(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const keepMuted = () => { v.muted = true }
    v.addEventListener("volumechange", keepMuted)
    return () => v.removeEventListener("volumechange", keepMuted)
  }, [])

  if (!src) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl"
        style={{ background: `linear-gradient(135deg,${accent}15,${C.bg})` }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg,${accent} 0,${accent} 1px,transparent 0,transparent 50%)`,
          backgroundSize: "20px 20px",
        }} />
        <div className="text-center z-10">
          <div className="w-14 h-14 rounded-full border-2 flex items-center justify-center mx-auto mb-3"
            style={{ borderColor: `${accent}60` }}>
            <span className="text-2xl">▶</span>
          </div>
          <p className="text-sm font-medium" style={{ color: accent }}>Video preview</p>
          <p className="text-xs mt-1" style={{ color: C.dim }}>Coming soon</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden"
      style={{ background: "#0a0f1e" }}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        controls
        controlsList="novolume nodownload nofullscreen"
        disablePictureInPicture
        className="w-full h-full portfolio-video"
        style={{ objectFit: "contain" }}
      />
    </div>
  )
}

// ── Screenshots carousel ───────────────────────────────────────────────────────
const ScreenshotsCarousel = ({ screenshots, accent, name }) => {
  const [active, setActive]   = useState(0)
  const [loaded, setLoaded]   = useState({})   // track which imgs are loaded
  const [animating, setAnimating] = useState(false)
  const imgRef = useRef(null)

  // Preload all images upfront
  useEffect(() => {
    screenshots.forEach((src, i) => {
      if (!src) return
      const img = new Image()
      img.onload = () => setLoaded(prev => ({ ...prev, [i]: true }))
      img.src = src
    })
  }, [screenshots])

  const allLoaded = screenshots.every((src, i) => !src || loaded[i])

  const go = useCallback((rawIdx) => {
    if (animating) return
    const total = screenshots.length
    const next  = ((rawIdx % total) + total) % total
    if (next === active) return

    setAnimating(true)
    const dir = next > active ? 1 : -1

    if (imgRef.current) {
      // Slide out current
      gsap.to(imgRef.current, {
        x: -dir * 40, opacity: 0, duration: 0.18, ease: "power2.in",
        onComplete: () => {
          setActive(next)
          // Slide in next
          gsap.fromTo(imgRef.current,
            { x: dir * 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.25, ease: "power2.out",
              onComplete: () => setAnimating(false) }
          )
        }
      })
    } else {
      setActive(next)
      setAnimating(false)
    }
  }, [active, animating, screenshots.length])

  const total = screenshots.length

  // Show loader until all images are preloaded
  if (!allLoaded) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: "4/3", background: `linear-gradient(135deg,${accent}10,#0f172a)` }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: accent, borderRightColor: `${accent}40` }} />
          <p className="text-xs" style={{ color: accent }}>
            Loading {screenshots.filter((s,i) => s && loaded[i]).length} / {screenshots.filter(s=>s).length}
          </p>
        </div>
      </div>
    )
  }

  const src = screenshots[active]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full rounded-xl overflow-hidden"
        style={{ aspectRatio: "4/3", background: "#0f172a" }}>

        <div ref={imgRef} className="w-full h-full">
          {src ? (
            <img
              src={src}
              alt={`${name} screenshot ${active + 1}`}
              className="w-full h-full"
              style={{ objectFit: "contain" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-xs" style={{ color: "#64748b" }}>No image</p>
            </div>
          )}
        </div>

        {total > 1 && (
          <button onClick={() => go(active - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 hover:scale-110"
            style={{ background: "rgba(5,8,22,0.75)", border: `1px solid ${accent}50`, color: "#fff" }}>
            ‹
          </button>
        )}

        {total > 1 && (
          <button onClick={() => go(active + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-150 hover:scale-110"
            style={{ background: "rgba(5,8,22,0.75)", border: `1px solid ${accent}50`, color: "#fff" }}>
            ›
          </button>
        )}

        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: "rgba(5,8,22,0.8)", color: "#94a3b8" }}>
          {active + 1} / {total}
        </div>
      </div>

      <div className="flex items-center gap-1.5 justify-center flex-wrap">
        {screenshots.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className="flex-shrink-0 transition-all duration-200"
            style={{
              width:  i === active ? "20px" : "7px",
              height: "7px",
              borderRadius: "4px",
              background: i === active ? accent : `${accent}35`,
            }} />
        ))}
      </div>
    </div>
  )
}
// ── Expanded hero card ────────────────────────────────────────────────────────
const ExpandedCard = ({ project, onClose }) => {
  const ref = useRef(null)
  const { accent } = project

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(el,
      { opacity: 0, y: -20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
    )
    // Stagger inner sections
    gsap.fromTo(el.querySelectorAll(".exp-section"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out", delay: 0.2 }
    )
  }, [project.name])

  return (
    <div ref={ref} className="rounded-3xl overflow-hidden mb-8"
      style={{
        background: C.card,
        border: `1px solid ${accent}35`,
        boxShadow: `0 0 80px ${accent}12, 0 30px 60px rgba(0,0,0,0.4)`,
      }}>

      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg,${accent},${accent}60,transparent)` }} />

      <div className="p-6 sm:p-10">
        {/* Header row */}
        <div className="exp-section flex items-start justify-between gap-4 mb-8">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: accent }}>
              Featured Project
            </p>
            <h2 className="font-black leading-tight mb-3"
              style={{ fontSize: "clamp(1.8rem,4vw,3.5rem)", color: C.white,
                       fontFamily: "'Bebas Neue','Impact',sans-serif" }}>
              {project.name}
            </h2>
            <p className="text-[16px] leading-relaxed max-w-2xl" style={{ color: C.dim }}>
              {project.description}
            </p>
          </div>

          {/* Close */}
          <button onClick={onClose}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ background: `${accent}20`, border: `1px solid ${accent}30`, color: C.white }}>
            ✕
          </button>
        </div>

        {/* Main content grid */}
        <div className="exp-section grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Video */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.dim }}>
              Preview
            </p>
            <div style={{ aspectRatio: "16/9", width: "100%", background: "#0a0f1e", borderRadius: "12px", overflow: "hidden", marginTop: "55px" }}>
              <VideoPreview src={project.video} accent={accent} name={project.name} />
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.dim }}>
              Screenshots
            </p>
            <ScreenshotsCarousel screenshots={project.screenshots} accent={accent} name={project.name} />
          </div>
        </div>

        {/* Bottom row — tech + learning + links */}
        <div className="exp-section grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Tech stack */}
          <div className="sm:col-span-1">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.dim }}>
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag.name} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* What I learned */}
          <div className="sm:col-span-1">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.dim }}>
              What I Learned
            </p>
            <div className="flex gap-2">
              <div className="w-0.5 rounded-full flex-shrink-0 mt-1"
                style={{ background: `${accent}50`, minHeight: "40px" }} />
              <p className="text-sm leading-relaxed" style={{ color: C.dim }}>
                {project.learning}
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="sm:col-span-1 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest mb-0" style={{ color: C.dim }}>
              Links
            </p>
            <a href={project.source_code_link} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, color: C.white }}>
              <img src={github} alt="GitHub" className="w-4 h-4 object-contain" />
              View Source
            </a>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg,${accent},${accent}cc)` }}>
                <span>↗</span>
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Compact card (grid) ───────────────────────────────────────────────────────
const CompactCard = ({ project, isActive, onClick, index }) => {
  const ref     = useRef(null)
  const vidRef  = useRef(null)
  const [hovering, setHovering] = useState(false)
  const { accent } = project

  // Entrance animation
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          delay: (index % 3) * 0.1 }
      )
    })
    return () => ctx.revert()
  }, [index])

  // Video hover
  useEffect(() => {
    const v = vidRef.current
    if (!v || !project.video) return
    if (hovering) v.play().catch(() => {})
    else { v.pause(); v.currentTime = 0 }
  }, [hovering, project.video])

  return (
    <div ref={ref}
      className="group relative rounded-2xl overflow-hidden flex flex-col cursor-pointer select-none"
      style={{
        background: C.card,
        border: `1px solid ${isActive ? accent + "50" : hovering ? accent + "30" : C.border}`,
        boxShadow: isActive ? `0 0 40px ${accent}20` : hovering ? `0 8px 30px ${accent}10` : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Image / video area */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", background: "#0a0f1e" }}>
        {/* Static image */}
        {project.image ? (
          <img src={project.image} alt={project.name}
            className="w-full h-full transition-transform duration-700"
            style={{ objectFit: "cover", transform: hovering ? "scale(1.06)" : "scale(1)" }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${accent}18,${C.bg})` }}>
            <span className="font-black text-6xl select-none"
              style={{ color: `${accent}30`, fontFamily: "'Bebas Neue',monospace" }}>
              {project.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Video overlaid on hover */}
        {project.video && (
          <video ref={vidRef} src={project.video} muted loop playsInline
            className="absolute inset-0 w-full h-full transition-opacity duration-500"
            style={{ objectFit: "cover", opacity: hovering ? 1 : 0 }} />
        )}

        {/* No video — subtle animated gradient on hover */}
        {!project.video && (
          <div className="absolute inset-0 transition-opacity duration-500 flex items-center justify-center"
            style={{ opacity: hovering ? 1 : 0, background: `rgba(5,8,22,0.65)` }}>
            <span className="text-sm font-medium px-4 py-2 rounded-full"
              style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}>
              Click to expand
            </span>
          </div>
        )}

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg,transparent,${accent},transparent)`,
                   opacity: hovering || isActive ? 1 : 0 }} />

        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: accent, color: "#fff" }}>
            Expanded ↑
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-[17px] leading-tight" style={{ color: C.white }}>
            {project.name}
          </h3>
          <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 transition-all duration-300"
            style={{ background: accent, boxShadow: hovering ? `0 0 8px ${accent}` : "none" }} />
        </div>

        <p className="text-sm leading-relaxed flex-1 mb-4 line-clamp-2" style={{ color: C.dim }}>
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag.name} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium"
              style={{ background: `${accent}14`, color: accent, border: `1px solid ${accent}22` }}>
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Projects section ──────────────────────────────────────────────────────────
const ProjectsSection = () => {
  const [activeIdx, setActiveIdx] = useState(null)
  const expandedRef = useRef(null)

  const handleCardClick = (idx) => {
    if (activeIdx === idx) { setActiveIdx(null); return }
    setActiveIdx(idx)
    setTimeout(() => {
      expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  const activeProject = activeIdx !== null ? enriched[activeIdx] : null
  const activeRow     = activeIdx !== null ? Math.floor(activeIdx / 3) : null
  const numRows       = Math.ceil(enriched.length / 3)

  return (
    <section className="px-6 sm:px-16 pb-24 max-w-7xl mx-auto">
      {Array.from({ length: numRows }, (_, rowIdx) => {
        const rowProjects = enriched.slice(rowIdx * 3, rowIdx * 3 + 3)
        return (
          <div key={rowIdx}>
            {/* Card grid row */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${rowIdx > 0 ? "mt-6" : ""}`}>
              {rowProjects.map((project, j) => {
                const realIdx = rowIdx * 3 + j
                return (
                  <CompactCard
                    key={project.name}
                    project={project}
                    index={realIdx}
                    isActive={activeIdx === realIdx}
                    onClick={() => handleCardClick(realIdx)}
                  />
                )
              })}
            </div>

            {/* Expanded card injected after its row */}
            {activeRow === rowIdx && activeProject && (
              <div ref={expandedRef} className="mt-6">
                <ExpandedCard
                  project={activeProject}
                  onClose={() => setActiveIdx(null)}
                />
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

// ── CTA ────────────────────────────────────────────────────────────────────────
const ProjectsCTA = () => {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="px-6 sm:px-16 pb-24" style={{ borderTop: `1px solid ${C.border}` }}>
      <div ref={ref} className="max-w-7xl mx-auto mt-16 rounded-2xl p-12 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg,${C.teal}12,${C.violet}10,${C.card})`,
                 border: `1px solid ${C.teal}25` }}>
        <p className="text-sm uppercase tracking-widest mb-3" style={{ color: C.teal }}>
          Interested in collaborating?
        </p>
        <h2 className="font-black mb-4"
          style={{ fontSize: "clamp(1.5rem,4vw,3rem)", color: C.white,
                   fontFamily: "'Bebas Neue','Impact',sans-serif" }}>
          Let's build the next one together.
        </h2>
        <p className="max-w-md mx-auto mb-8" style={{ color: C.dim }}>
          Always looking for interesting problems to solve and great people to work with.
        </p>
        <Link to="/contact"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:scale-105"
          style={{ background: `linear-gradient(135deg,${C.teal},${C.violet})` }}>
          Start a conversation →
        </Link>
      </div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
const ProjectsPage = () => {
  useEffect(() => () => ScrollTrigger.getAll().forEach(st => st.kill()), [])
  return (
    <div style={{ background: C.bg, color: C.white }}>
      <ProjectsHero />
      <ProjectsSection />
      <ProjectsCTA />
    </div>
  )
}

export default ProjectsPage