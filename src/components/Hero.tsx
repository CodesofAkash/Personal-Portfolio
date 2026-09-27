"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { styles } from "@/styles";
import CanvasLoader from "@/components/Loader";
import Cta from "@/components/sections/Cta";
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
    <section className="relative w-full h-screen mx-auto overflow-hidden">
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Suspense fallback={<CanvasLoader />}>
          <ComputersCanvas />
        </Suspense>
      </div>

      <div
        className={`${styles.paddingX} absolute inset-0 top-[20px] max-w-7xl mx-auto flex items-start gap-5`}
        style={{ zIndex: 10, pointerEvents: "none" }}
      >
        <div className="flex flex-col justify-center items-center mt-1">
          <div
            className="w-5 h-5 rounded-full"
            style={{ background: "#7c3aed" }}
          />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        <div style={{ maxWidth: "520px", pointerEvents: "auto" }}>
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-widest mb-4 font-semibold"
            style={{ color: "#0d9488", letterSpacing: "0.18em" }}
          >
            {section.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${styles.heroHeadText} text-white`}
          >
            {section.greeting} <span style={{ color: "#7c3aed" }}>{section.name}</span>
          </motion.h1>

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
                color: "#d6d6d6",
                maxWidth: "480px",
              }}
            >
              {section.subheadLine2}
            </p>
          </motion.div>

          {(section.primaryCta || section.secondaryCta) && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-8"
            >
              <Cta cta={section.primaryCta} />
              <Cta cta={section.secondaryCta} />
            </motion.div>
          )}
        </div>
      </div>

      <div
        className="absolute xs:bottom-24 bottom-32 w-full flex justify-center items-center"
        style={{ zIndex: 10 }}
      >
        <a href="#about" aria-label="Scroll to About section">
          <div
            className="w-[35px] h-[64px] rounded-3xl border-4 flex justify-center items-start p-2"
            style={{ borderColor: "#475569" }}
          >
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full mb-1"
              style={{ background: "#7c3aed" }}
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
