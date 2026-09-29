"use client";

import { Fragment, Suspense, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import CanvasLoader from "@/components/Loader";
import type { PanelPosition } from "@/components/canvas/HeroCarExperience";
import type { HeroSection } from "@/sanity/lib/types";

// Three.js/R3F/drei is a large client bundle with no SSR value (WebGL needs
// the browser) — loading it off the initial JS payload cuts unused JS and
// render-blocking work on every other page that doesn't need it.
const HeroCarExperience = dynamic(() => import("@/components/canvas/HeroCarExperience"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: "#7c3aed", borderRightColor: "rgba(124,58,237,0.3)" }}
      />
    </div>
  ),
});

interface HeroProps {
  section: HeroSection | undefined;
}

// Six fixed screen slots instead of the previous two (always left/right,
// vertically centered) — spreads panels across the frame as they rotate in.
const PANEL_POSITIONS: PanelPosition[] = ["top-left", "center-right", "bottom-left", "top-right", "bottom-right", "center-left"];

const Hero = ({ section }: HeroProps) => {
  if (!section) return null;

  // Everything the hero says lives in the reveal panels — there's no
  // separate static copy anywhere else on screen. The identity panel still
  // renders a real <h1>, styled identically to the rest, so the page keeps
  // one semantic heading even though it's inside the interactive layer.
  const panelContents: ReactNode[] = [
    <Fragment key="identity">
      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>{section.eyebrow}</p>
      <h1 className="text-xl font-bold" style={{ color: "#f8fafc" }}>{section.name}</h1>
    </Fragment>,
    <Fragment key="what">
      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>What I build</p>
      <p className="text-sm" style={{ color: "#cbd5e1" }}>{section.subheadLine1}</p>
    </Fragment>,
    <Fragment key="how">
      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>How I build it</p>
      <p className="text-sm" style={{ color: "#cbd5e1" }}>{section.subheadLine2}</p>
    </Fragment>,
    ...(section.stats ?? []).map((stat) => (
      <Fragment key={`stat-${stat.label}`}>
        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>By the numbers</p>
        <p style={{ color: "#f8fafc" }}>
          <span className="text-3xl font-bold">{stat.value}</span>
        </p>
        <p className="text-sm" style={{ color: "#cbd5e1" }}>{stat.label}</p>
      </Fragment>
    )),
  ];
  const panels = panelContents.map((content, i) => ({ position: PANEL_POSITIONS[i % PANEL_POSITIONS.length], content }));

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "#050816" }}>
      {/* Everything below — background image, car, panels, scroll arrow —
          is nested inside the same max-w-7xl content width the navbar and
          every other section use, instead of spanning the full viewport.
          max-h caps it so browser zoom-out (which inflates 100vh in CSS px)
          can't balloon the section's height; min-h keeps it from collapsing
          on short viewports. */}
      <div className="relative max-w-7xl mx-auto h-screen max-h-[850px] min-h-[560px] overflow-hidden">
        {section.bgImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- consistent with the site's existing deferred next/image migration */}
            <img src={section.bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#050816cc 0%,#05081699 40%,#050816cc 100%)" }} />
          </>
        ) : (
          <>
            {/* Visible grid + four-color glow — an original background, not a template image. */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#7c3aed22 1px,transparent 1px),linear-gradient(90deg,#7c3aed22 1px,transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%,black 40%,transparent 90%)",
              }}
            />
            <div className="absolute -top-32 -left-24 w-[42rem] h-[42rem] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#7c3aed33 0%,transparent 70%)" }} />
            <div className="absolute top-1/4 -right-32 w-[36rem] h-[36rem] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#0d948833 0%,transparent 70%)" }} />
            <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#d9770626 0%,transparent 70%)" }} />
            <div className="absolute -bottom-24 right-1/4 w-[28rem] h-[28rem] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#e11d4826 0%,transparent 70%)" }} />
          </>
        )}

        {/* The 3D model — big, centered, filling the hero. The up-right
            nudge lives inside HeroCarExperience itself, scoped to just its
            canvas, so this wrapper stays plain and the panels/reset button
            inside it position against this container's normal box instead
            of a shifted one. */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <Suspense fallback={<CanvasLoader />}>
            <HeroCarExperience modelUrl={section.model} panels={panels} />
          </Suspense>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10 }}>
          <a href="#about" aria-label="Scroll to About section">
            <div
              className="w-[30px] h-[54px] rounded-full border-2 flex justify-center items-start p-1.5 shadow-lg"
              style={{ borderColor: "rgba(226,232,240,0.85)", background: "rgba(5,8,22,0.55)" }}
            >
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                className="w-2 h-2 rounded-full"
                style={{ background: "#7c3aed" }}
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
