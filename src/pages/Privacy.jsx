import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"

const C = {
  violet: "#7c3aed", teal: "#0d9488",
  white: "#f8fafc", dim: "#94a3b8", bg: "#050816", card: "#0f172a",
  border: "rgba(148,163,184,0.08)",
}

const sections = [
  {
    n: "01", title: "Overview",
    body: `This portfolio website ("Site") is operated by Akash Sharma ("I", "me", "my"). This Privacy Policy explains what information is collected when you visit the Site and how it is used. I am committed to protecting your privacy and handling any information you share with me responsibly.`,
  },
  {
    n: "02", title: "Information I Collect",
    body: `I collect only the minimum information necessary to operate the Site. This includes contact form submissions — your name, email address, and message content — and basic anonymous analytics such as page views and browser type if analytics are enabled. I do not collect payment information, create user accounts, or track you across other websites.`,
  },
  {
    n: "03", title: "How I Use Your Information",
    body: `Your information is used solely to respond to your messages and enquiries submitted via the contact form, and to understand how visitors interact with the Site so I can improve it. I will never sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    n: "04", title: "Third-Party Services",
    body: `The Site uses EmailJS to process contact form submissions (see emailjs.com/legal/privacy-policy), Cloudinary to serve optimised images via CDN (see cloudinary.com/privacy), and AWS CloudFront to serve 3D model assets (see aws.amazon.com/privacy). Each of these services has their own privacy policies governing how they handle data.`,
  },
  {
    n: "05", title: "Cookies",
    body: `This Site does not use tracking cookies or advertising cookies. Session-level browser storage may be used for technical functionality only and is not used to identify you personally.`,
  },
  {
    n: "06", title: "Data Retention",
    body: `Contact form messages are retained only as long as necessary to respond to your enquiry. You may request deletion of your data at any time by contacting me directly via the Contact page.`,
  },
  {
    n: "07", title: "Your Rights",
    body: `You have the right to request access to, correction of, or deletion of any personal information I hold about you. To exercise these rights, contact me at the email address provided on the Contact page.`,
  },
  {
    n: "08", title: "Changes to This Policy",
    body: `I may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. Continued use of the Site after changes constitutes acceptance of the updated policy.`,
  },
]

const Privacy = () => {
  const heroRef     = useRef(null)
  const sectionsRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    const secs = sectionsRef.current
    if (!hero || !secs) return

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(hero.querySelector(".p-line"), { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.7 })
        .fromTo(hero.querySelector(".p-tag"),  { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .fromTo(hero.querySelector(".p-h1"),   { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
        .fromTo(hero.querySelector(".p-date"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")

      secs.querySelectorAll(".sec-card").forEach((card) => {
        gsap.fromTo(card,
          { x: -30, opacity: 0 },
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
      <section ref={heroRef} className="relative px-6 sm:px-16 pt-16 pb-16 max-w-4xl mx-auto">
        <div className="absolute top-1/3 right-0 w-64 h-64 pointer-events-none"
          style={{ background: `radial-gradient(circle,${C.violet}08,transparent 70%)` }} />

        <div className="p-line w-12 h-0.5 mb-6 rounded-full"
          style={{ background: `linear-gradient(90deg,${C.violet},${C.teal})` }} />
        <p className="p-tag text-xs uppercase tracking-widest mb-3" style={{ color: C.teal }}>
          Legal
        </p>
        <h1 className="p-h1 font-black mb-4"
          style={{ fontSize: "clamp(2.5rem,7vw,6rem)", color: C.white,
                   fontFamily: "'Bebas Neue','Impact',sans-serif", lineHeight: 1.05 }}>
          Privacy Policy.
        </h1>
        <p className="p-date text-sm" style={{ color: C.dim }}>
          Last updated: March 2026
        </p>
      </section>

      {/* Sections */}
      <section ref={sectionsRef} className="px-6 sm:px-16 pb-24 max-w-4xl mx-auto space-y-4">
        {sections.map((s) => (
          <div key={s.n} className="sec-card group rounded-2xl p-8 transition-all duration-300"
            style={{ background: C.card, border: `1px solid ${C.border}` }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${C.violet}30`}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <div className="flex items-start gap-6">
              <span className="flex-shrink-0 font-black text-3xl leading-none select-none"
                style={{ color: `${C.violet}30`, fontFamily: "'Bebas Neue',monospace" }}>
                {s.n}
              </span>
              <div>
                <h2 className="font-bold text-lg mb-3" style={{ color: C.white }}>
                  {s.title}
                </h2>
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
            style={{ background: `linear-gradient(135deg,${C.violet},${C.teal})` }}>
            Contact me with questions →
          </Link>
          <Link to="/terms" className="text-sm hover:underline" style={{ color: C.dim }}>
            View Terms of Service
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Privacy