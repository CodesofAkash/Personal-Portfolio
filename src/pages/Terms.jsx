import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"

const C = {
  violet: "#7c3aed", teal: "#0d9488", amber: "#d97706",
  white: "#f8fafc", dim: "#94a3b8", bg: "#050816", card: "#0f172a",
  border: "rgba(148,163,184,0.08)",
}

const sections = [
  {
    n: "01", title: "Acceptance of Terms", color: C.violet,
    body: `By accessing and using this portfolio website ("Site"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site.`,
  },
  {
    n: "02", title: "Use of the Site", color: C.teal,
    body: `You agree to use this Site only for lawful purposes. You must not use the Site in any way that violates applicable laws, attempt to gain unauthorised access to any part of the Site or its infrastructure, transmit unsolicited advertising material, or scrape and systematically extract data without permission.`,
  },
  {
    n: "03", title: "Intellectual Property", color: C.amber,
    body: `All content on this Site — including text, code, design, graphics, and 3D assets — is the intellectual property of Akash Sharma unless otherwise stated. You may not reproduce, distribute, or create derivative works from any content on this Site without explicit written permission. Project source code linked from this Site may be subject to open-source licences as specified in their respective repositories.`,
  },
  {
    n: "04", title: "Disclaimer of Warranties", color: C.violet,
    body: `This Site is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. I do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.`,
  },
  {
    n: "05", title: "Limitation of Liability", color: C.teal,
    body: `To the fullest extent permitted by law, Akash Sharma shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use this Site.`,
  },
  {
    n: "06", title: "External Links", color: C.amber,
    body: `This Site may contain links to third-party websites including GitHub repositories and live project demos. These links are provided for your convenience only. I have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.`,
  },
  {
    n: "07", title: "Changes to Terms", color: C.violet,
    body: `I reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated date. Your continued use of the Site following any changes constitutes acceptance of the new terms.`,
  },
  {
    n: "08", title: "Governing Law", color: C.teal,
    body: `These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of India.`,
  },
]

const Terms = () => {
  const heroRef     = useRef(null)
  const sectionsRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const secs = sectionsRef.current
    if (!hero || !secs) return

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(hero.querySelector(".t-line"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
        .fromTo(hero.querySelector(".t-tag"),  { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(hero.querySelector(".t-h1"),   { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
        .fromTo(hero.querySelector(".t-date"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")

      secs.querySelectorAll(".sec-card").forEach((card) => {
        gsap.fromTo(card,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%" } }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: "100vh" }}>
      {/* Hero */}
      <section ref={heroRef} className="relative px-6 sm:px-16 pt-32 pb-16 max-w-4xl mx-auto">
        <div className="absolute top-1/3 left-0 w-64 h-64 pointer-events-none"
          style={{ background: `radial-gradient(circle,${C.teal}08,transparent 70%)` }} />

        <div className="t-line w-12 h-0.5 mb-6 rounded-full"
          style={{ background: `linear-gradient(90deg,${C.teal},${C.amber})` }} />
        <p className="t-tag text-xs uppercase tracking-widest mb-3" style={{ color: C.amber }}>
          Legal
        </p>
        <h1 className="t-h1 font-black mb-4"
          style={{ fontSize: "clamp(2.5rem,7vw,6rem)", color: C.white,
                   fontFamily: "'Bebas Neue','Impact',sans-serif", lineHeight: 1.05 }}>
          Terms of Service.
        </h1>
        <p className="t-date text-sm" style={{ color: C.dim }}>
          Last updated: March 2026
        </p>
      </section>

      {/* Sections */}
      <section ref={sectionsRef} className="px-6 sm:px-16 pb-24 max-w-4xl mx-auto space-y-4">
        {sections.map((s) => (
          <div key={s.n} className="sec-card rounded-2xl p-8 transition-all duration-300"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}30`}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <div className="flex items-start gap-6">
              <span className="flex-shrink-0 font-black text-3xl leading-none select-none"
                style={{ color: `${s.color}35`, fontFamily: "'Bebas Neue',monospace" }}>
                {s.n}
              </span>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <h2 className="font-bold text-lg" style={{ color: C.white }}>
                    {s.title}
                  </h2>
                </div>
                <p className="text-[15px] leading-relaxed" style={{ color: C.dim }}>
                  {s.body}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-8 flex items-center gap-4">
          <Link to="/contact"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105"
            style={{ background: `linear-gradient(135deg,${C.teal},${C.amber})` }}>
            Contact me with questions →
          </Link>
          <Link to="/privacy" className="text-sm hover:underline" style={{ color: C.dim }}>
            View Privacy Policy
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Terms