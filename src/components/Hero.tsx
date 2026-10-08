"use client";

import { Fragment, Suspense, useState, type ReactNode } from "react";
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
  const [sceneReady, setSceneReady] = useState(false);

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
    // No overflow set on this outer section — it doesn't need to clip
    // anything itself (the inner box below does that for the 3D scene),
    // and it's what lets the scroll button straddle the boundary below.
    // Global horizontal-scrollbar protection still exists regardless —
    // html/body's own overflow-x:hidden in globals.css.
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
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "calc(100dvh - var(--navbar-height))" }}
      >
        {/* overflow-hidden here, deliberately, on both axes — this box
            holds the 3D scene, and its on-screen markers (projected from
            3D world positions, so their screen coordinates aren't bounded
            the way ordinary layout is) must never render past hero's own
            box into the next section. The scroll button below needs the
            opposite — it's designed to straddle that same boundary — so
            it's no longer a child of this clipped box at all; it moved out
            to be this div's own sibling, positioned against the outer
            section instead. Splitting it out this way sidesteps the CSS
            overflow-x/overflow-y spec quirk entirely, rather than fighting
            it: when one axis is non-visible, the other's declared
            'visible' computes to 'auto' instead (confirmed via DevTools'
            Computed panel) — so a single element can't cleanly clip one
            axis while leaving the other genuinely open regardless of which
            values are set. */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at 30% 35%, #7c1d1d 0%, #2a0a0a 45%, #000000 85%)" }}
        />
        {/* Real content, rendered unconditionally — not gated behind the 3D
            scene the way the identical text inside `panels` is. That
            gating turned out to be the actual cause of the hero's
            catastrophic LCP: `panels` only reaches the DOM once
            HeroSceneExperience has a loaded model (it's used by
            MarkerOverlay, which doesn't exist until then), so there was
            genuinely no text content anywhere on the page for the browser
            to paint until the ~1.7MB model had fetched, decoded and
            parsed — confirmed via a PSI LCP breakdown showing the "element
            render delay" phase alone accounting for the full multi-second
            gap, with no separate resource-load phase, the signature of an
            LCP candidate that simply isn't in the DOM yet rather than one
            still downloading. This duplicates the identity panel's own
            copy so there's always something real to paint immediately;
            once the interactive scene is ready, its own panel naturally
            takes over the same information in its proper 3D-projected
            position — once `sceneReady` fires (via HeroSceneExperience's
            onReady), this fades out instead of sitting underneath the real
            panel forever. The real panel opens by default on load
            (panelOpen starts true), not on click, so without this both
            were visible at once. */}
        <div
          className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 transition-opacity duration-500"
          style={{ zIndex: 1, opacity: sceneReady ? 0 : 1, pointerEvents: sceneReady ? "none" : undefined }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "#0d9488" }}>{section.eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "#f8fafc" }}>{section.name}</h1>
          </div>
        </div>
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <Suspense fallback={<CanvasLoader />}>
            <HeroSceneExperience modelUrl={section.model} panels={panels} onReady={() => setSceneReady(true)} />
          </Suspense>
        </div>
      </div>

      {/* Sibling of the clipped box above, not a child of it — see that
          box's own comment for why. Half straddling the boundary with the
          next section (negative bottom = -height/2) is the whole point
          here, and this position is relative to the outer <section>, whose
          own bottom edge lines up exactly with the clipped box's (nothing
          else in the section adds height), so the math is unchanged from
          when this lived inside it. Every size here is a multiple of the
          shared --hero-ui-unit (globals.css) the hero's markers/panel/
          navigator also use — one calibrated curve grown proportionally
          everywhere, instead of each element's own independently-tuned
          clamp() saturating at a different, too-narrow viewport width (the
          actual cause of the "not responsive, too big on small screens,
          still small on big screens" report). */}
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
    </section>
  );
};

export default Hero;
