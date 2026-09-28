"use client";

import Link from "next/link";
import type { Footer as FooterData, SanityImageValue } from "@/sanity/lib/types";
import { textSafe } from "@/components/sections/colors";
import Icon from "@/components/Icon";

const C = {
  violet: "#7c3aed",
  teal: "#0d9488",
  amber: "#d97706",
  rose: "#e11d48",
  white: "#f8fafc",
  dim: "#94a3b8",
  border: "rgba(148,163,184,0.08)",
};

const VARIANT_COLOR: Record<string, string> = { violet: C.violet, teal: C.teal, amber: C.amber, rose: C.rose };
const variantColor = (variant?: string) => VARIANT_COLOR[variant ?? "violet"] ?? C.violet;

interface FooterProps {
  brandName?: string;
  logo?: SanityImageValue;
  footer?: FooterData;
}

const Footer = ({ brandName, logo, footer }: FooterProps) => {
  const socials = footer?.socials ?? [];
  const linkLists = footer?.linkLists ?? [];

  return (
    <footer
      style={{ background: "#050816", borderTop: `1px solid ${C.border}` }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-16 py-16">
        <div className="flex flex-col sm:flex-row justify-between gap-12 mb-12">
          <div className="flex flex-col gap-4 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <Icon
                image={logo}
                fallbackAlt={brandName ? `${brandName} logo` : "logo"}
                width={32}
                height={32}
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-12"
              />
              {brandName && (
                <span
                  className="font-bold text-[17px] tracking-tight"
                  style={{ color: C.white }}
                >
                  {brandName}<span style={{ color: textSafe(C.violet) }}>.</span>
                </span>
              )}
            </Link>
            {footer?.description && (
              <p className="text-[14px] leading-relaxed" style={{ color: C.dim }}>
                {footer.description}
              </p>
            )}
            {socials.length > 0 && (
              <div className="flex items-center gap-3 mt-1">
                {socials.map((s) => {
                  const color = variantColor(s.variant);
                  return (
                    <a
                      key={s._key}
                      href={s.href}
                      target={s.target === "_blank" ? "_blank" : undefined}
                      rel={s.target === "_blank" ? "noreferrer" : undefined}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105"
                      style={{
                        background: `${color}1f`,
                        color: textSafe(color),
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {s.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {linkLists.length > 0 && (
            <div className="flex gap-16">
              {linkLists.map((list) => (
                <div key={list.title} className="flex flex-col gap-3">
                  <p
                    className="text-xs uppercase tracking-widest mb-1"
                    style={{ color: C.teal }}
                  >
                    {list.title}
                  </p>
                  {list.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      target={l.target === "_blank" ? "_blank" : undefined}
                      rel={l.target === "_blank" ? "noreferrer" : undefined}
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
              ))}
            </div>
          )}
        </div>

        <div
          className="w-full h-px mb-8"
          style={{
            background: `linear-gradient(90deg, transparent, ${C.violet}40, ${C.teal}30, transparent)`,
          }}
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {footer?.copyrightText && (
            <p className="text-xs" style={{ color: C.dim }}>
              {footer.copyrightText}
            </p>
          )}
          {footer?.creditText && (
            <p className="text-xs" style={{ color: `${C.dim}cc` }}>
              {footer.creditText}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
