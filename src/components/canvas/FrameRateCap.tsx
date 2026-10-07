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
const FrameRateCap = ({ fps }: { fps: number }) => {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const id = setInterval(invalidate, 1000 / fps);
    return () => clearInterval(id);
  }, [invalidate, fps]);
  return null;
};

export default FrameRateCap;
