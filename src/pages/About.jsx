import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { experiences, technologies } from "../constants"

gsap.registerPlugin(ScrollTrigger)

const C = {
  violet: "#7c3aed",
  teal:   "#0d9488",
  amber:  "#d97706",
  rose:   "#e11d48",
  white:  "#f8fafc",
  dim:    "#94a3b8",
  bg:     "#050816",
  card:   "#0f172a",
  border: "rgba(148,163,184,0.1)",
}

// ── Hero ─────────────────────────────────────────────────────────────────────
const AboutHero = () => {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const line   = el.querySelector(".hero-line")
    const chars  = el.querySelectorAll(".hero-char")
    const tags   = el.querySelectorAll(".hero-tag")
    const bio    = el.querySelector(".hero-bio")
    const ctas   = el.querySelectorAll(".hero-cta")

    if (!line || !chars.length) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(line,  { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
        .fromTo(chars, { y: 100, opacity: 0, rotateX: -80 },   { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.035 }, "-=0.3")
        .fromTo(tags,  { x: -20, opacity: 0 },                 { x: 0, opacity: 1, duration: 0.4, stagger: 0.08 }, "-=0.4")
        .fromTo(bio,   { y: 24, opacity: 0 },                  { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")
        .fromTo(ctas,  { y: 16, opacity: 0 },                  { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, "-=0.3")
    })

    return () => ctx.revert()
  }, [])

  const name = "Akash Sharma"

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-6 sm:px-16 py-32 max-w-7xl mx-auto overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${C.violet}04 1px,transparent 1px),linear-gradient(90deg,${C.violet}04 1px,transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Glow */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle,${C.violet}14 0%,transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle,${C.teal}10 0%,transparent 70%)` }} />

      <div className="hero-line w-20 h-1 mb-8 rounded-full" style={{ background: `linear-gradient(90deg,${C.violet},${C.teal})` }} />

      {/* Name */}
      <h1 className="font-black leading-none mb-6 overflow-hidden" style={{
        fontSize: "clamp(3rem,10vw,8rem)",
        fontFamily: "'Bebas Neue','Impact',sans-serif",
        color: C.white,
        perspective: "600px",
      }}>
        {name.split("").map((char, i) => (
          <span key={i} className="hero-char inline-block"
            style={{ whiteSpace: char === " " ? "pre" : "normal" }}>
            {char}
          </span>
        ))}
      </h1>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["Full-Stack Dev", "Real-Time Systems", "3D & Motion", "BCA Student"].map((tag, i) => {
          const cols = [C.violet, C.teal, C.amber, C.rose]
          return (
            <span key={tag} className="hero-tag px-4 py-1.5 rounded-full text-sm font-medium border"
              style={{ borderColor: cols[i], color: cols[i], background: `${cols[i]}18` }}>
              {tag}
            </span>
          )
        })}
      </div>

      <p className="hero-bio max-w-2xl text-[17px] leading-relaxed mb-10" style={{ color: C.dim }}>
        Third-year BCA student who went from zero to shipping production apps in under two years.
        I build across the full stack — React, Next.js, Node.js, MongoDB, WebRTC, and Three.js.
        I care about things being fast, beautiful, and real-time.
      </p>

      <div className="flex flex-wrap gap-4">
        <Link to="/projects" className="hero-cta px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
          style={{ background: `linear-gradient(135deg,${C.violet},${C.teal})` }}>
          See my work →
        </Link>
        <Link to="/contact" className="hero-cta px-8 py-3 rounded-xl font-semibold border transition-all duration-200 hover:scale-105"
          style={{ borderColor: C.border, color: C.white, background: "rgba(255,255,255,0.04)" }}>
          Get in touch
        </Link>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs tracking-widest uppercase" style={{ color: C.dim }}>scroll</span>
        <div className="w-px h-12 animate-pulse" style={{ background: `linear-gradient(${C.violet},transparent)` }} />
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const StatsBar = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll(".stat-item")
    if (!items.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%" } }
      )
    })
    return () => ctx.revert()
  }, [])

  const stats = [
    { value: "1.5+", label: "Years coding",   color: C.violet },
    { value: "15+",  label: "Projects built", color: C.teal   },
    { value: "7+",   label: "Tech stacks",    color: C.amber  },
    { value: "100%", label: "Self-taught",    color: C.rose   },
  ]

  return (
    <div ref={ref} className="px-6 sm:px-16 py-16"
      style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="stat-item flex flex-col items-center text-center">
            <span className="font-black text-5xl mb-1"
              style={{ color: s.color, fontFamily: "'Bebas Neue',monospace" }}>
              {s.value}
            </span>
            <span className="text-sm uppercase tracking-widest" style={{ color: C.dim }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Experience — vertical timeline (reliable, no containerAnimation) ───────────
const ExperienceSection = () => {
  const ref     = useRef(null)
  const headRef = useRef(null)

  useEffect(() => {
    const el   = ref.current
    const head = headRef.current
    if (!el || !head) return

    const cards = el.querySelectorAll(".exp-card")
    if (!cards.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(head,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: head, start: "top 85%" } }
      )
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  const accentColors = [C.violet, C.teal, C.amber, C.violet, C.rose, C.teal, C.amber]

  return (
    <section ref={ref} className="px-6 sm:px-16 py-24" style={{ background: C.bg }}>
      <div className="max-w-7xl mx-auto">
        <p className="text-sm uppercase tracking-widest mb-3" style={{ color: C.teal }}>
          How I got here
        </p>
        <h2 ref={headRef} className="font-black mb-16"
          style={{ fontSize: "clamp(2rem,6vw,5rem)", color: C.white, fontFamily: "'Bebas Neue',sans-serif" }}>
          My Journey.
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Centre line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(${C.violet},${C.teal},${C.amber})`, opacity: 0.3 }} />

          <div className="space-y-12">
            {experiences.map((exp, i) => {
              const accent = accentColors[i % accentColors.length]
              const isRight = i % 2 === 0

              return (
                <div key={exp.title} className={`exp-card relative flex flex-col sm:flex-row gap-6 ${isRight ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  {/* Dot on timeline */}
                  <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full -translate-x-1/2 mt-8 z-10 ring-4"
                    style={{ background: accent, ringColor: `${accent}30` }} />

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block flex-1" />

                  {/* Card */}
                  <div className="flex-1 ml-10 sm:ml-0 rounded-2xl p-6 sm:p-8"
                    style={{
                      background: C.card,
                      border: `1px solid ${accent}25`,
                      boxShadow: `0 0 30px ${accent}08`,
                    }}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ background: exp.iconBg || "#1e293b" }}>
                        {exp.icon
                          ? <img src={exp.icon} alt={exp.company_name} className="w-7 h-7 object-contain" />
                          : <span className="text-white font-bold">{exp.company_name.charAt(0)}</span>}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest" style={{ color: accent }}>
                          {exp.company_name}
                        </p>
                        <p className="text-xs" style={{ color: C.dim }}>{exp.date}</p>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-3 leading-snug" style={{ color: C.white }}>
                      {exp.title}
                    </h3>

                    <ul className="space-y-1.5">
                      {exp.points.map((pt, pi) => (
                        <li key={pi} className="flex gap-2 text-sm leading-relaxed" style={{ color: C.dim }}>
                          <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: accent }} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Tech Marquee ──────────────────────────────────────────────────────────────
const TechSection = () => {
  const ref     = useRef(null)
  const headRef = useRef(null)
  const row1Ref = useRef(null)
  const row2Ref = useRef(null)
  // Store tween refs for cleanup
  const tweens  = useRef([])

  useEffect(() => {
    const el   = ref.current
    const head = headRef.current
    const r1   = row1Ref.current
    const r2   = row2Ref.current
    if (!el || !head || !r1 || !r2) return

    const ctx = gsap.context(() => {
      gsap.fromTo(head,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: head, start: "top 80%" } }
      )

      const setupMarquee = (el, dir) => {
        const w = el.scrollWidth / 2
        const t = gsap.fromTo(el,
          { x: dir > 0 ? 0 : -w },
          { x: dir > 0 ? -w : 0, duration: 28, ease: "none", repeat: -1 }
        )
        tweens.current.push(t)
      }

      setupMarquee(r1, 1)
      setupMarquee(r2, -1)
    })

    return () => {
      tweens.current.forEach(t => t.kill())
      tweens.current = []
      ctx.revert()
    }
  }, [])

  const half = Math.ceil(technologies.length / 2)
  const row1 = [...technologies.slice(0, half), ...technologies.slice(0, half)]
  const row2 = [...technologies.slice(half),    ...technologies.slice(half)]

  const Pill = ({ name, icon }) => (
    <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-full mx-2"
      style={{ background: C.card, border: `1px solid ${C.border}` }}>
      {icon
        ? <img src={icon} alt={name} className="w-6 h-6 object-contain" />
        : <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: C.violet, color: "#fff" }}>{name.charAt(0)}</div>
      }
      <span className="text-sm font-medium whitespace-nowrap" style={{ color: C.white }}>{name}</span>
    </div>
  )

  return (
    <section ref={ref} className="py-24 overflow-hidden">
      <div className="px-6 sm:px-16 max-w-7xl mx-auto mb-12">
        <p className="text-sm uppercase tracking-widest mb-3" style={{ color: C.amber }}>
          Tools of the trade
        </p>
        <h2 ref={headRef} className="font-black"
          style={{ fontSize: "clamp(2rem,6vw,5rem)", color: C.white, fontFamily: "'Bebas Neue',sans-serif" }}>
          Tech Stack.
        </h2>
      </div>

      <div className="space-y-4">
        {[
          { rowRef: row1Ref, items: row1 },
          { rowRef: row2Ref, items: row2 },
        ].map(({ rowRef, items }, ri) => (
          <div key={ri} className="flex overflow-hidden"
            style={{ maskImage: "linear-gradient(90deg,transparent,black 10%,black 90%,transparent)" }}>
            <div ref={rowRef} className="flex">
              {items.map((tech, i) => <Pill key={`r${ri}-${i}`} {...tech} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── CTA ────────────────────────────────────────────────────────────────────────
const AboutCTA = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" } }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="px-6 sm:px-16 py-24" style={{ borderTop: `1px solid ${C.border}` }}>
      <div ref={ref} className="max-w-7xl mx-auto rounded-3xl p-12 sm:p-20 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg,${C.violet}20,${C.teal}15,${C.card})`,
          border: `1px solid ${C.violet}30`,
        }}>
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: `radial-gradient(circle at top right,${C.teal}20,transparent 70%)` }} />

        <p className="text-sm uppercase tracking-widest mb-4" style={{ color: C.teal }}>What's next</p>
        <h2 className="font-black mb-6"
          style={{ fontSize: "clamp(2rem,5vw,4rem)", color: C.white, fontFamily: "'Bebas Neue',sans-serif" }}>
          Let's build something<br />
          <span style={{ color: C.violet }}>remarkable.</span>
        </h2>
        <p className="max-w-lg mx-auto mb-10 text-[17px] leading-relaxed" style={{ color: C.dim }}>
          Always open to interesting projects, collaborations, and conversations.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/contact"
            className="px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:scale-105"
            style={{ background: `linear-gradient(135deg,${C.violet},${C.teal})` }}>
            Get in touch
          </Link>
          <Link to="/projects"
            className="px-10 py-4 rounded-xl font-bold text-lg border transition-all duration-200 hover:scale-105"
            style={{ borderColor: `${C.violet}50`, color: C.white, background: `${C.violet}08` }}>
            See projects
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
const AboutPage = () => {
  useEffect(() => {
    return () => ScrollTrigger.getAll().forEach(st => st.kill())
  }, [])

  return (
    <div style={{ background: C.bg, color: C.white }}>
      <AboutHero />
      <StatsBar />
      <ExperienceSection />
      <TechSection />
      <AboutCTA />
    </div>
  )
}

export default AboutPage