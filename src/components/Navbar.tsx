"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationItem, SanityImageValue } from "@/sanity/lib/types";
import Icon from "@/components/Icon";

interface NavbarProps {
  brandName?: string;
  logo?: SanityImageValue;
  navigationItems: NavigationItem[];
}

const NavDropdown = ({ item, isActive }: { item: NavigationItem; isActive: (href: string) => boolean }) => {
  const [open, setOpen] = useState(false);
  const children = item.children ?? [];
  if (children.length === 0) return null;

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="relative px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 flex items-center gap-1"
        style={{ color: "#94a3b8" }}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        {item.label}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 min-w-45 rounded-xl overflow-hidden py-1.5"
          style={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.12)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
        >
          {children.map((child) => (
            <Link
              key={child._key}
              href={child.href || "#"}
              target={child.target === "_blank" ? "_blank" : undefined}
              rel={child.target === "_blank" ? "noreferrer" : undefined}
              className="block px-4 py-2.5 text-[14px] font-medium transition-colors duration-150 hover:bg-white/5"
              style={{ color: isActive(child.href) ? "#f8fafc" : "#94a3b8" }}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = ({ brandName, logo, navigationItems }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const navRef = useRef<HTMLElement>(null);

  // Publishes the navbar's real measured height as a CSS custom property —
  // layout.tsx's <main> padding and Hero.tsx's viewport-height calc both
  // read this instead of each guessing the same hardcoded pixel number.
  // Two places agreeing on a magic number is exactly how they drift out of
  // sync (a real gap showed up at 100% zoom from a few px of mismatch);
  // one measured source of truth can't drift. ResizeObserver also covers
  // the navbar wrapping to a second line on narrow screens.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const publish = () => document.documentElement.style.setProperty("--navbar-height", `${el.offsetHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    // Belt-and-suspenders alongside ResizeObserver — some browsers don't
    // reliably re-fire it purely from a browser zoom change.
    window.addEventListener("resize", publish);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", publish);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="w-full fixed top-0 z-20 px-6 sm:px-16 py-4"
      style={{
        background: "rgba(5,8,22,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(148,163,184,0.06)",
      }}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          onClick={() => {
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5 group"
        >
          <Icon
            image={logo}
            fallbackAlt={brandName ? `${brandName} logo` : "logo"}
            width={32}
            height={32}
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-12"
          />
          {brandName && (
            <span className="text-white text-[17px] font-bold tracking-tight">
              {brandName} <span className="hidden sm:inline text-[#7c3aed]">.</span>
            </span>
          )}
        </Link>

        <ul className="list-none hidden sm:flex flex-row items-center gap-1">
          {navigationItems.map((item) =>
            item.children && item.children.length > 0 ? (
              <li key={item._key}>
                <NavDropdown item={item} isActive={isActive} />
              </li>
            ) : (
              <li key={item._key}>
                <Link
                  href={item.href || "#"}
                  target={item.target === "_blank" ? "_blank" : undefined}
                  rel={item.target === "_blank" ? "noreferrer" : undefined}
                  className="relative px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 group"
                  style={{ color: isActive(item.href) ? "#f8fafc" : "#94a3b8" }}
                >
                  <span
                    className="absolute inset-0 rounded-lg transition-opacity duration-200"
                    style={{
                      background: isActive(item.href)
                        ? "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(13,148,136,0.15))"
                        : "rgba(148,163,184,0)",
                      opacity: isActive(item.href) ? 1 : 0,
                    }}
                  />
                  {isActive(item.href) && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#7c3aed" }}
                    />
                  )}
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(148,163,184,0.06)" }}
                  />
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            ),
          )}
        </ul>

        {navigationItems.length > 0 && (
          <button
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200"
            style={{ background: "rgba(148,163,184,0.08)" }}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5 text-white"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              )}
            </svg>
          </button>
        )}
      </div>

      <div
        className="sm:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: menuOpen ? "480px" : "0px",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div className="flex flex-col gap-1 pt-3 pb-2 px-1">
          {navigationItems.map((item) => (
            <div key={item._key}>
              <Link
                href={item.href || "#"}
                target={item.target === "_blank" ? "_blank" : undefined}
                rel={item.target === "_blank" ? "noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200"
                style={{
                  color: isActive(item.href) ? "#f8fafc" : "#94a3b8",
                  background: isActive(item.href)
                    ? "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(13,148,136,0.12))"
                    : "transparent",
                  borderLeft: isActive(item.href) ? "2px solid #7c3aed" : "2px solid transparent",
                }}
              >
                {item.label}
              </Link>
              {item.children && item.children.length > 0 && (
                <div className="flex flex-col gap-0.5 ml-4 border-l" style={{ borderColor: "rgba(148,163,184,0.15)" }}>
                  {item.children.map((child) => (
                    <Link
                      key={child._key}
                      href={child.href || "#"}
                      target={child.target === "_blank" ? "_blank" : undefined}
                      rel={child.target === "_blank" ? "noreferrer" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 text-[14px]"
                      style={{ color: "#94a3b8" }}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
