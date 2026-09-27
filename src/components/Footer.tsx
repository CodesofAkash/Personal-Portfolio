"use client";

import Link from "next/link";
import type { Social } from "@/sanity/lib/types";
import { textSafe } from "@/components/sections/colors";

const C = {
  violet: "#7c3aed",
  teal: "#0d9488",
  white: "#f8fafc",
  dim: "#94a3b8",
  border: "rgba(148,163,184,0.08)",
};

interface FooterProps {
  brandName?: string;
  logoUrl?: string;
  tagline?: string;
  socials: Social[];
}

const Footer = ({ brandName, logoUrl, tagline, socials }: FooterProps) => {
  return (
    <footer
      style={{ background: "#050816", borderTop: `1px solid ${C.border}` }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-16 py-16">
        <div className="flex flex-col sm:flex-row justify-between gap-12 mb-12">
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={brandName ? `${brandName} logo` : "logo"}
                  className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-12"
                />
              )}
              {brandName && (
                <span
                  className="font-bold text-[17px] tracking-tight"
                  style={{ color: C.white }}
                >
                  {brandName}<span style={{ color: textSafe(C.violet) }}>.</span>
                </span>
              )}
            </Link>
            {tagline && (
              <p className="text-[14px] leading-relaxed" style={{ color: C.dim }}>
                {tagline}
              </p>
            )}
            {socials.length > 0 && (
              <div className="flex items-center gap-3 mt-1">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      color: textSafe(C.violet),
                      border: `1px solid rgba(124,58,237,0.2)`,
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: C.teal }}
              >
                Pages
              </p>
              {[
                { to: "/about", label: "About" },
                { to: "/projects", label: "Projects" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  className="text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  style={{ color: C.dim }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.white;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.dim;
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: C.teal }}
              >
                Legal
              </p>
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
              ].map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  className="text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  style={{ color: C.dim }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.white;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.dim;
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="w-full h-px mb-8"
          style={{
            background: `linear-gradient(90deg, transparent, ${C.violet}40, ${C.teal}30, transparent)`,
          }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: C.dim }}>
            © {new Date().getFullYear()} {brandName ?? "Akash Sharma"} — Built with Next.js,
            Three.js & GSAP
          </p>
          <p className="text-xs" style={{ color: `${C.dim}80` }}>
            Designed & developed by {brandName ?? "Akash"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
