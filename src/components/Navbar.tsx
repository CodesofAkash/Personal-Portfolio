"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/sanity/lib/types";

interface NavbarProps {
  brandName?: string;
  logoUrl?: string;
  navLinks: NavLink[];
}

const Navbar = ({ brandName, logoUrl, navLinks }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
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
          {logoUrl && (
            <img
              src={logoUrl}
              alt={brandName ? `${brandName} logo` : "logo"}
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-12"
            />
          )}
          {brandName && (
            <span className="text-white text-[17px] font-bold tracking-tight">
              {brandName} <span className="hidden sm:inline text-[#7c3aed]">.</span>
            </span>
          )}
        </Link>

        <ul className="list-none hidden sm:flex flex-row items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 group"
                  style={{ color: isActive ? "#f8fafc" : "#94a3b8" }}
                >
                  <span
                    className="absolute inset-0 rounded-lg transition-opacity duration-200"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(13,148,136,0.15))"
                        : "rgba(148,163,184,0)",
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#7c3aed" }}
                    />
                  )}
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(148,163,184,0.06)" }}
                  />
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {navLinks.length > 0 && (
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
          maxHeight: menuOpen ? "300px" : "0px",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div className="flex flex-col gap-1 pt-3 pb-2 px-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200"
                style={{
                  color: isActive ? "#f8fafc" : "#94a3b8",
                  background: isActive
                    ? "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(13,148,136,0.12))"
                    : "transparent",
                  borderLeft: isActive
                    ? "2px solid #7c3aed"
                    : "2px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
