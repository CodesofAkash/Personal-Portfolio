"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

// Drives a frameloop="demand" canvas at a fixed rate via a plain
// setInterval — deliberately not requestAnimationFrame — so the render
// rate is actually capped rather than merely following whatever the
// display's native refresh rate is. invalidate() asks R3F to render
// exactly one frame; any ongoing animation (rotation, reflections, camera
// transitions) keeps working unchanged since it's still driven by
// useFrame — it just fires at this capped rate instead of uncapped.
// Originally local to HeroSceneExperience.tsx; extracted once Earth and
// Stars needed the identical pattern (AK-PERF — a 3D canvas with
// frameloop="demand" but no rate cap, or with OrbitControls'
// autoRotate still calling invalidate() every frame, renders exactly as
// often as frameloop="always" despite "demand" being set).
//
// settleAfterMs matters even with a rate cap in place. Capping the rate
// was not enough on its own: real production PageSpeed Insights still
// showed 28-34s of Total Blocking Time after the cap (and after a dpr
// cap on top of it) because a canvas that invalidates forever, however
// slowly, never actually goes idle — and Lighthouse's quiet-detection
// (the same "checkForQuiet" step referenced elsewhere in this codebase)
// can't conclude the page is settled while something keeps asking for
// renders, so its trace window just keeps extending, accumulating more
// "long task" time the whole time it stays open. A ~40s page-load trace
// with a steady drip of ~700-1500ms tasks was the actual signature in
// the real data, not a single expensive operation.
// settleAfterMs, when passed, stops the interval permanently after that
// many ms — enough to show the ambient motion is alive, then let the
// canvas genuinely rest so the page can be considered quiet. Only safe
// for a canvas with no feature that depends on the timer still running
// (a real user interaction that calls invalidate() itself, e.g. an
// OrbitControls drag, still renders on demand afterward) — Hero's
// click-to-navigate camera transitions are driven *only* by this timer
// having no other invalidate() source, so it is not given one.
const FrameRateCap = ({ fps, settleAfterMs }: { fps: number; settleAfterMs?: number }) => {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const id = setInterval(invalidate, 1000 / fps);
    const settleId = settleAfterMs ? setTimeout(() => clearInterval(id), settleAfterMs) : undefined;
    return () => {
      clearInterval(id);
      if (settleId) clearTimeout(settleId);
    };
  }, [invalidate, fps, settleAfterMs]);
  return null;
};

export default FrameRateCap;
