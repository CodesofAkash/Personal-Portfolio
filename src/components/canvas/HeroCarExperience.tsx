"use client";

import { type ReactNode, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box3, MathUtils, Vector3, type Group } from "three";
import ModelErrorBoundary from "@/components/ModelErrorBoundary";
import ModelFallback from "@/components/ModelFallback";
import { useSafeGLTF } from "@/lib/useSafeGLTF";
import { MODELS } from "@/lib/cdn";

// Picked by hand against the real model (see hero-lab): the framing that
// reads best on load, and what "Reset view" below returns to. Not derived
// from the model's bounding box — "looks right" beat a formula here.
const DEFAULT_VIEW = { distance: 4, polarDeg: 83.5, azimuthDeg: 40.7 };

export interface HeroRevealPanel {
  side: "left" | "right";
  content: ReactNode;
}

const norm360 = (deg: number) => ((deg % 360) + 360) % 360;

function sphericalOffset(distance: number, polarDeg: number, azimuthDeg: number) {
  const polar = MathUtils.degToRad(polarDeg);
  const az = MathUtils.degToRad(azimuthDeg);
  const horizontal = distance * Math.sin(polar);
  return new Vector3(horizontal * Math.sin(az), distance * Math.cos(polar), horizontal * Math.cos(az));
}

const RevealPanel = ({ active, side, children }: { active: boolean; side: "left" | "right"; children: ReactNode }) => (
  <div
    className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-6" : "right-6"} max-w-75 rounded-2xl p-5 transition-all duration-500`}
    style={{
      background: "rgba(15,23,42,0.85)",
      border: "1px solid rgba(148,163,184,0.15)",
      opacity: active ? 1 : 0,
      transform: `translateY(-50%) translateX(${active ? "0" : side === "left" ? "-12px" : "12px"})`,
      pointerEvents: "none",
    }}
  >
    {children}
  </div>
);

const SceneContent = ({
  scene,
  center,
  size,
  onAzimuthChange,
}: {
  scene: Group;
  center: Vector3;
  size: Vector3;
  onAzimuthChange: (deg: number) => void;
}) => {
  const lastSent = useRef(0);

  useFrame(({ camera }) => {
    const azimuthDeg = norm360((Math.atan2(camera.position.x - center.x, camera.position.z - center.z) * 180) / Math.PI);
    const rounded = Math.round(azimuthDeg / 5) * 5;
    if (rounded !== lastSent.current) {
      lastSent.current = rounded;
      onAzimuthChange(rounded);
    }
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <hemisphereLight intensity={1.3} groundColor="#1a1a2e" />
      {/* Four plain directional lights ringing the model, not an HDRI
          Environment — Environment loads its map through Suspense, and this
          canvas deliberately has no Suspense boundary (see useSafeGLTF),
          after an earlier R3F/Suspense/ErrorBoundary unmount race crashed
          the hero. Directional lights have no distance falloff either, so
          they light correctly regardless of the model's real-world scale. */}
      <directionalLight intensity={4.5} position={[center.x + size.x + 4, center.y + size.y + 6, center.z + size.z + 4]} />
      <directionalLight intensity={2.2} position={[center.x - size.x - 4, center.y + size.y + 4, center.z - size.z - 4]} />
      <directionalLight intensity={3} position={[center.x, center.y + size.y + 3, center.z - size.z - 6]} />
      <directionalLight intensity={1.8} position={[center.x, center.y - size.y * 0.2, center.z + size.z + 3]} />
      <primitive object={scene} />
    </>
  );
};

const HeroCarExperience = ({ modelUrl, panels }: { modelUrl?: string; panels: HeroRevealPanel[] }) => {
  const { scene, progress, failed } = useSafeGLTF(modelUrl || MODELS.desktopPc);
  const [azimuth, setAzimuth] = useState(DEFAULT_VIEW.azimuthDeg);
  const [resetNonce, setResetNonce] = useState(0);

  const box = useMemo(() => (scene ? new Box3().setFromObject(scene) : null), [scene]);
  const center = useMemo(() => box?.getCenter(new Vector3()) ?? new Vector3(), [box]);
  const size = useMemo(() => box?.getSize(new Vector3()) ?? new Vector3(1, 1, 1), [box]);
  const startPos = useMemo(() => {
    const offset = sphericalOffset(DEFAULT_VIEW.distance, DEFAULT_VIEW.polarDeg, DEFAULT_VIEW.azimuthDeg);
    return new Vector3(center.x + offset.x, center.y + offset.y, center.z + offset.z);
  }, [center]);

  if (!scene) {
    return <ModelFallback label="Featured 3D model" loading={!failed} progress={progress} />;
  }

  const bandSize = 360 / panels.length;
  const bandIndex = Math.floor(norm360(azimuth - DEFAULT_VIEW.azimuthDeg + bandSize / 2) / bandSize);

  return (
    <div className="relative w-full h-full">
      <ModelErrorBoundary label="Featured 3D model">
        <Canvas
          key={resetNonce}
          shadows
          frameloop="demand"
          camera={{ fov: 40, position: [startPos.x, startPos.y, startPos.z] }}
          gl={{ preserveDrawingBuffer: true, toneMappingExposure: 1.3 }}
        >
          <OrbitControls
            makeDefault
            target={[center.x, center.y, center.z]}
            enableZoom
            enablePan={false}
            minDistance={DEFAULT_VIEW.distance * 0.15}
            maxDistance={DEFAULT_VIEW.distance * 6}
            minPolarAngle={MathUtils.degToRad(2)}
            maxPolarAngle={MathUtils.degToRad(178)}
          />
          <SceneContent scene={scene} center={center} size={size} onAzimuthChange={setAzimuth} />
        </Canvas>
      </ModelErrorBoundary>

      <button
        type="button"
        onClick={() => setResetNonce((n) => n + 1)}
        className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
        style={{ background: "rgba(124,58,237,0.25)", color: "#e9d5ff", border: "1px solid rgba(124,58,237,0.4)" }}
      >
        Reset view
      </button>

      {panels.map((panel, i) => (
        <RevealPanel key={i} active={bandIndex === i} side={panel.side}>
          {panel.content}
        </RevealPanel>
      ))}
    </div>
  );
};

export default HeroCarExperience;
