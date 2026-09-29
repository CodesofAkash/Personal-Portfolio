"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { styles } from "@/styles";
import CanvasLoader from "@/components/Loader";
import Cta from "@/components/sections/Cta";
import Heading from "@/components/sections/Heading";
import type { HeroSection } from "@/sanity/lib/types";

// Three.js/R3F/drei is a large client bundle with no SSR value (WebGL needs
// the browser) — loading it off the initial JS payload cuts unused JS and
// render-blocking work on every other page that doesn't need it.
const ComputersCanvas = dynamic(() => import("@/components/canvas/Computers"), {
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

const Hero = ({ section }: HeroProps) => {
  if (!section) return null;

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden" style={{ background: "#050816" }}>
      {/* Custom background — a grid plus two soft glows, not a template image. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#7c3aed08 1px,transparent 1px),linear-gradient(90deg,#7c3aed08 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className="absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,#7c3aed1a 0%,transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,#0d94881a 0%,transparent 70%)" }}
      />

      <div className={`relative z-10 w-full max-w-7xl mx-auto ${styles.paddingX} grid lg:grid-cols-2 gap-12 items-center pt-28 pb-20 lg:py-20`}>
        <div style={{ maxWidth: "560px" }}>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.3)" }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#0d9488" }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#0d9488" }} />
            </span>
            <span
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "#0d9488", letterSpacing: "0.14em" }}
            >
              {section.eyebrow}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Heading segments={section.heading} className={`${styles.heroHeadText} text-white`} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4"
          >
            <p
              className={`${styles.heroSubText}`}
              style={{ color: "#e2e8f0", marginBottom: "10px" }}
            >
              {section.subheadLine1}
            </p>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "1.7",
                color: "#94a3b8",
                maxWidth: "480px",
              }}
            >
              {section.subheadLine2}
            </p>
          </motion.div>

          {section.ctas && section.ctas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              {section.ctas.map((cta) => (
                <Cta key={cta.text} cta={cta} />
              ))}
            </motion.div>
          )}
        </div>

        <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[560px]">
          <Suspense fallback={<CanvasLoader />}>
            <ComputersCanvas modelUrl={section.model} />
          </Suspense>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <a href="#about" aria-label="Scroll to About section">
          <div
            className="w-[30px] h-[54px] rounded-full border-2 flex justify-center items-start p-1.5"
            style={{ borderColor: "rgba(148,163,184,0.4)" }}
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
    </section>
  );
};

export default Hero;
