"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import ModelErrorBoundary from "@/components/ModelErrorBoundary";
import ModelFallback from "@/components/ModelFallback";
import { useSafeGLTF } from "@/lib/useSafeGLTF";
import { MODELS } from "@/lib/cdn";
import FrameRateCap from "./FrameRateCap";

// Rotation driven here, not OrbitControls' own autoRotate — autoRotate
// calls invalidate() internally on every single frame regardless of the
// Canvas's frameloop setting, which silently made frameloop="demand"
// below a no-op: this canvas was rendering at the display's full native
// rate the whole time despite looking capped. Confirmed as the dominant
// cost on PageSpeed Insights' /contact run — Total Blocking Time 29.78s,
// with "Minimize main-thread work" showing 40.6s almost entirely
// unattributed ("Other"), the signature of continuous WebGL rendering.
// Driving the rotation here instead means it only advances on the frames
// FrameRateCap actually requests.
const Earth = ({ scene }: { scene: Group }) => {
  const ref = useRef<Group>(null);
  useFrame((_state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return <primitive ref={ref} object={scene} scale={2.5} position-y={0} rotation-y={0} />;
};

const EarthCanvas = ({ modelUrl }: { modelUrl?: string }) => {
  const { scene, progress, failed } = useSafeGLTF(modelUrl || MODELS.planet);

  if (!scene) {
    return <ModelFallback label="3D Earth" loading={!failed} progress={progress} />;
  }

  return (
    <ModelErrorBoundary label="3D Earth">
      {/* No `shadows` — there are no lights in this scene at all (the
          model's material is unlit, same reasoning as Hero's), so the
          shadow map renderer it switches on was pure dead weight. No
          `preserveDrawingBuffer` either — nothing in the codebase ever
          reads this canvas's buffer back. dpr={[1,2]} matters even with
          the frame-rate cap in place — capping *how often* a frame
          renders doesn't cap *how expensive each one is*, and PSI emulates
          a Moto G Power (devicePixelRatio up to ~2.6–3.5), so an uncapped
          canvas rasterizes up to ~9x the pixels of a capped one, every
          single frame, regardless of how infrequently those frames fire. */}
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
      >
        <FrameRateCap fps={24} />
        {/* enableRotate stays at its default (true) — only the ambient
            autoRotate is gone, not the user's own drag-to-look. A manual
            drag still calls invalidate() itself under demand mode, same
            as Hero's OrbitControls. */}
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth scene={scene} />
      </Canvas>
    </ModelErrorBoundary>
  );
};

export default EarthCanvas;
