"use client";

import { Fragment, Suspense, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import CanvasLoader from "@/components/Loader";
import type { PanelPosition } from "@/components/canvas/HeroSceneExperience";
import type { HeroSection } from "@/sanity/lib/types";

// Three.js/R3F/drei is a large client bundle with no SSR value (WebGL needs
// the browser) — loading it off the initial JS payload cuts unused JS and
// render-blocking work on every other page that doesn't need it.
const HeroSceneExperience = dynamic(() => import("@/components/canvas/HeroSceneExperience"), {
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
  // Font sizes are em-based (not Tailwind's rem-based text-xs/text-xl/etc)
  // so they scale with the panel container's own responsive font-size (set
  // in HeroSceneExperience.tsx's MarkerOverlay) instead of staying a fixed
  // pixel size while everything else on screen grows on bigger displays.
  const panelContents: ReactNode[] = [
    <Fragment key="identity">
      <p className="text-[0.75em] uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>{section.eyebrow}</p>
      <h1 className="text-[1.25em] font-bold" style={{ color: "#f8fafc" }}>{section.name}</h1>
    </Fragment>,
    <Fragment key="what">
      <p className="text-[0.75em] uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>What I build</p>
      <p className="text-[0.875em]" style={{ color: "#cbd5e1" }}>{section.subheadLine1}</p>
    </Fragment>,
    <Fragment key="how">
      <p className="text-[0.75em] uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>How I build it</p>
      <p className="text-[0.875em]" style={{ color: "#cbd5e1" }}>{section.subheadLine2}</p>
    </Fragment>,
    ...(section.stats ?? []).map((stat) => (
      <Fragment key={`stat-${stat.label}`}>
        <p className="text-[0.75em] uppercase tracking-widest mb-1" style={{ color: "#0d9488" }}>By the numbers</p>
        <p style={{ color: "#f8fafc" }}>
          <span className="text-[1.875em] font-bold">{stat.value}</span>
        </p>
        <p className="text-[0.875em]" style={{ color: "#cbd5e1" }}>{stat.label}</p>
      </Fragment>
    )),
  ];
  const panels = panelContents.map((content, i) => ({ position: PANEL_POSITIONS[i % PANEL_POSITIONS.length], content }));

  return (
    // No scroll-snap here — every variant of it (mandatory/proximity, with/
    // without scroll-snap-stop) fought the fixed navbar: without
    // scroll-padding-top telling the browser's snap mechanism to account
    // for the navbar, it auto-corrected scroll position on load and on
    // scroll-past in a way that both recreated a gap and bounced scrolling
    // back. Confirmed via a live rect measurement showing the page sitting
    // auto-scrolled by exactly the navbar's height with it enabled.
    // No overflow-x-hidden here, deliberately — the scroll button below
    // sits half outside hero's own box, straddling the boundary with the
    // next section, and ANY non-visible overflow-x forces overflow-y to
    // compute as 'auto' instead of 'visible' per the CSS overflow spec
    // (confirmed via DevTools' Computed panel: overflow-y showed 'auto'
    // despite an explicit overflow-y-visible class declaring otherwise —
    // the spec converts a declared 'visible' on one axis to 'auto' the
    // moment the other axis isn't 'visible' or 'clip', with no way to
    // override it short of making both axes visible). 'auto' still clips
    // unscrolled content exactly like 'hidden' does, which is what was
    // silently cutting the button off at this box's edge. Global
    // horizontal-scrollbar protection still exists — html/body's own
    // overflow-x:hidden in globals.css — so this element doesn't need its
    // own local copy; it was redundant and is what caused this.
    // zIndex:2 — without an explicit stacking level, the next section
    // (later in the DOM, default z-index:auto) would paint over that
    // straddling half by normal DOM-order stacking; this lifts hero above
    // it. Still well under the navbar's z-20.
    <section className="relative w-full" style={{ background: "#050816", zIndex: 2 }}>
      {/* Exactly the visible viewport, never more/less — reads the same
          measured --navbar-height custom property <main>'s padding uses
          (Navbar.tsx publishes it via ResizeObserver), so navbar + this
          always add up to precisely 100dvh with nothing left over. dvh
          (not vh) so mobile browser chrome showing/hiding doesn't leave a
          gap or force scroll. Full viewport width, not just the
          background — the model and its reveal points go beyond the
          navbar's max-w-7xl content column too, unlike every other
          section on the site. */}
      <div className="relative w-full" style={{ height: "calc(100dvh - var(--navbar-height))" }}>
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 35%, #7c1d1d 0%, #2a0a0a 45%, #000000 85%)" }}
        />
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <Suspense fallback={<CanvasLoader />}>
            <HeroSceneExperience modelUrl={section.model} panels={panels} />
          </Suspense>
        </div>

        {/* Half straddling the boundary with the next section (negative
            bottom = -height/2) instead of sitting fully inside hero — needs
            overflow-x-hidden (not overflow-hidden) on the ancestors above,
            or this half would just get clipped away. Every size here is a
            multiple of the shared --hero-ui-unit (globals.css) the hero's
            markers/panel/navigator also use — one calibrated curve grown
            proportionally everywhere, instead of each element's own
            independently-tuned clamp() saturating at a different,
            too-narrow viewport width (the actual cause of the "not
            responsive, too big on small screens, still small on big
            screens" report). */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ bottom: "calc(var(--hero-ui-unit) * -1.7)", zIndex: 10 }}
        >
          <a href="#about" aria-label="Scroll to About section" className="cursor-pointer">
            <div
              className="rounded-full border-2 flex justify-center items-start shadow-lg"
              style={{
                width: "calc(var(--hero-ui-unit) * 1.9)",
                height: "calc(var(--hero-ui-unit) * 3.4)",
                padding: "calc(var(--hero-ui-unit) * 0.5)",
                borderColor: "rgba(226,232,240,0.85)",
                background: "rgba(5,8,22,0.55)",
              }}
            >
              <motion.div
                animate={{ y: [0, 26, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                className="rounded-full"
                style={{ width: "calc(var(--hero-ui-unit) * 0.65)", height: "calc(var(--hero-ui-unit) * 0.65)", background: "#7c3aed" }}
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
