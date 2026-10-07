"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-expect-error - maath ships no type declarations for this subpath
import * as random from "maath/random/dist/maath-random.esm";
import type { Points as PointsImpl } from "three";
import FrameRateCap from "./FrameRateCap";

const Stars = (props: Record<string, unknown>) => {
  const ref = useRef<PointsImpl>(null);

  const sphere = useMemo(() => {
    // 5000 * 3, not 5000 — each point is an (x, y, z) triple and stride={3}
    // below reads this array in groups of 3. Length 5000 isn't a multiple
    // of 3 (1666.67 points), leaving the last point incomplete; drei's
    // <Points> reading past that boundary is the likely source of
    // THREE.BufferGeometry.computeBoundingSphere() computing a NaN radius
    // (confirmed showing up in production console errors). The existing
    // per-value NaN guard below is a different, narrower fix — it zeroes
    // individual NaN coordinates random.inSphere can occasionally produce,
    // but can't fix a structurally misaligned array.
    const positions = new Float32Array(5000 * 3);
    random.inSphere(positions, { radius: 1.2 });
    for (let i = 0; i < positions.length; i++) {
      if (isNaN(positions[i])) positions[i] = 0;
    }
    return positions;
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#f272c8"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="w-full h-auto absolute inset-0 z-[-1]">
      {/* frameloop="demand" + FrameRateCap — this canvas had neither, so it
          rendered this purely-ambient, non-interactive background at the
          display's full uncapped native refresh rate forever. Same pattern
          already proven on Hero and Earth; Stars' own rotation in useFrame
          above needs no change since it's driven by `delta`, not frame
          count, so it keeps the same visual speed regardless of how often
          it's actually invoked. dpr={[1,2]} too — capping how often a
          frame fires doesn't cap how expensive each one is, and PSI's
          emulated device can report a devicePixelRatio up to ~3.5x. */}
      <Canvas frameloop="demand" dpr={[1, 2]} camera={{ position: [0, 0, 1] }}>
        {/* settleAfterMs — purely decorative background with no
            interaction at all, so there's no reason for it to keep
            invalidating forever; see FrameRateCap's own comment for why
            that perpetual (if capped) ticking was still preventing PSI's
            quiet-detection from ever concluding the page had settled. */}
        <FrameRateCap fps={24} settleAfterMs={4000} />
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
