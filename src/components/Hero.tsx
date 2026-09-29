"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { styles } from "@/styles";
import CanvasLoader from "@/components/Loader";
import Cta from "@/components/sections/Cta";
import Heading from "@/components/sections/Heading";
import type { HeroRevealPanel } from "@/components/canvas/HeroCarExperience";
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

const STAT_SIDES: Array<"left" | "right"> = ["right", "left"];

const Hero = ({ section }: HeroProps) => {
  if (!section) return null;

  // The reveal panels are a decorative bonus on the model, not a second
  // source of information — everything they show (name, eyebrow, the two
  // subhead lines, the stats) already exists statically below, so nothing
  // is ever hidden behind rotate-the-model-to-read-it.
  const panels: HeroRevealPanel[] = [
    {
      side: "left",
      content: (
        <>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>{section.eyebrow}</p>
          <p className="text-xl font-bold" style={{ color: "#f8fafc" }}>{section.name}</p>
        </>
      ),
    },
    {
      side: "right",
      content: (
        <>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>What I build</p>
          <p className="text-sm" style={{ color: "#cbd5e1" }}>{section.subheadLine1}</p>
        </>
      ),
    },
    {
      side: "left",
      content: (
        <>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>How I build it</p>
          <p className="text-sm" style={{ color: "#cbd5e1" }}>{section.subheadLine2}</p>
        </>
      ),
    },
    ...(section.stats ?? []).map((stat, i) => ({
      side: STAT_SIDES[i % 2],
      content: (
        <>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>By the numbers</p>
          <p style={{ color: "#f8fafc" }}>
            <span className="text-3xl font-bold">{stat.value}</span>
          </p>
          <p className="text-sm" style={{ color: "#cbd5e1" }}>{stat.label}</p>
        </>
      ),
    })),
  ];

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ background: "#050816" }}>
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

      {/* The 3D model — big, centered, filling the hero, not confined to a corner. */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Suspense fallback={<CanvasLoader />}>
          <HeroCarExperience modelUrl={section.model} panels={panels} />
        </Suspense>
      </div>

      {/* Text scattered around the model — top-left, center, bottom split
          left/right — rather than one static left-aligned column.
          pointer-events-none on this wrapper so the empty space between
          blocks still lets drag-to-rotate reach the canvas underneath;
          each interactive block opts back in with pointer-events-auto. */}
      <div className="relative z-10 h-full flex flex-col justify-between py-24 sm:py-28 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${styles.paddingX} self-start`}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.3)" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#0d9488" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#0d9488" }} />
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#0d9488", letterSpacing: "0.14em" }}>
              {section.eyebrow}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`${styles.paddingX} text-center lg:self-center`}
        >
          <Heading segments={section.heading} className={`${styles.heroHeadText} text-white`} />
        </motion.div>

        <div className={`${styles.paddingX} flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6`}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-sm"
          >
            <p className={`${styles.heroSubText}`} style={{ color: "#e2e8f0", marginBottom: "10px" }}>
              {section.subheadLine1}
            </p>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#94a3b8" }}>
              {section.subheadLine2}
            </p>
          </motion.div>

          {section.ctas && section.ctas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4 sm:justify-end pointer-events-auto"
            >
              {section.ctas.map((cta) => (
                <Cta key={cta.text} cta={cta} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 10 }}>
        <a href="#about" aria-label="Scroll to About section">
          <div className="w-[30px] h-[54px] rounded-full border-2 flex justify-center items-start p-1.5" style={{ borderColor: "rgba(148,163,184,0.4)" }}>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className="w-2 h-2 rounded-full"
              style={{ background: "#7c3aed" }}
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
