"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box3, MathUtils, Vector3, type Group } from "three";
import ModelErrorBoundary from "@/components/ModelErrorBoundary";
import ModelFallback from "@/components/ModelFallback";
import { useSafeGLTF } from "@/lib/useSafeGLTF";
import { MODELS } from "@/lib/cdn";

// Picked by hand against the real model (see hero-lab): the angle that reads
// best on load. Distance is separate and responsive (see responsiveDistance
// below) — the hero now sits inside max-w-7xl, so the same fixed distance
// that framed the car well at 1280px would overflow a phone-width container.
const DEFAULT_VIEW = { polarDeg: 83.5, azimuthDeg: 40.7 };

// First-pass breakpoints, not measured against the real container — pull
// the car back (larger distance = smaller on screen) as it narrows. Tell me
// if any tier still reads too big/small once you can see it.
function responsiveDistance(containerWidth: number) {
  if (containerWidth === 0) return 4;
  if (containerWidth < 480) return 6.5;
  if (containerWidth < 768) return 5.5;
  if (containerWidth < 1024) return 4.6;
  return 4;
}

// Tracks the rendered width of whatever it's attached to via ResizeObserver
// — window.innerWidth would be wrong above 1280px, since the hero's actual
// visible width caps at max-w-7xl regardless of how wide the browser is.
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export type PanelPosition = "top-left" | "top-right" | "center-left" | "center-right" | "bottom-left" | "bottom-right";

export interface HeroRevealPanel {
  position: PanelPosition;
  content: ReactNode;
}

const norm360 = (deg: number) => ((deg % 360) + 360) % 360;

function sphericalOffset(distance: number, polarDeg: number, azimuthDeg: number) {
  const polar = MathUtils.degToRad(polarDeg);
  const az = MathUtils.degToRad(azimuthDeg);
  const horizontal = distance * Math.sin(polar);
  return new Vector3(horizontal * Math.sin(az), distance * Math.cos(polar), horizontal * Math.cos(az));
}

// top-28/bottom-28 clear the fixed header and the scroll indicator; center-*
// still needs the translateY(-50%) that Tailwind's utility can't combine
// with the slide-in transform below, so it's computed inline instead.
const POSITION_CLASSES: Record<PanelPosition, string> = {
  "top-left": "top-28 left-6",
  "top-right": "top-28 right-6",
  "center-left": "top-1/2 left-6",
  "center-right": "top-1/2 right-6",
  "bottom-left": "bottom-28 left-6",
  "bottom-right": "bottom-28 right-6",
};

const RevealPanel = ({ active, position, children }: { active: boolean; position: PanelPosition; children: ReactNode }) => {
  const isLeft = position.endsWith("left");
  const isCentered = position.startsWith("center");
  return (
    <div
      className={`absolute ${POSITION_CLASSES[position]} w-[calc(100%-3rem)] max-w-75 rounded-2xl p-5 transition-all duration-500`}
      style={{
        background: "rgba(15,23,42,0.85)",
        border: "1px solid rgba(148,163,184,0.15)",
        opacity: active ? 1 : 0,
        transform: `${isCentered ? "translateY(-50%) " : ""}translateX(${active ? "0" : isLeft ? "-12px" : "12px"})`,
        // Active panels can carry real controls that need to be clickable;
        // inactive ones stay pass-through so they never block dragging the
        // model behind them.
        pointerEvents: active ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
};

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
  const [containerRef, containerWidth] = useContainerWidth();
  const distance = responsiveDistance(containerWidth);

  const box = useMemo(() => (scene ? new Box3().setFromObject(scene) : null), [scene]);
  const center = useMemo(() => box?.getCenter(new Vector3()) ?? new Vector3(), [box]);
  const size = useMemo(() => box?.getSize(new Vector3()) ?? new Vector3(1, 1, 1), [box]);
  const startPos = useMemo(() => {
    const offset = sphericalOffset(distance, DEFAULT_VIEW.polarDeg, DEFAULT_VIEW.azimuthDeg);
    return new Vector3(center.x + offset.x, center.y + offset.y, center.z + offset.z);
  }, [center, distance]);

  if (!scene) {
    return <ModelFallback label="Featured 3D model" loading={!failed} progress={progress} />;
  }

  const bandSize = 360 / panels.length;
  const bandIndex = Math.floor(norm360(azimuth - DEFAULT_VIEW.azimuthDeg + bandSize / 2) / bandSize);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Oversized and nudged up-right so the car reads centered in the
          visible frame — scoped to just the canvas, not this component's
          panels/button below, which must stay positioned against the
          normal, un-shifted viewport or they end up clipped off-screen. */}
      <div className="absolute" style={{ inset: "-8%", transform: "translate(4%, -5%)" }}>
        <ModelErrorBoundary label="Featured 3D model">
          {/* Keying on distance remounts (and re-frames) the canvas whenever
              the container crosses a responsive breakpoint, same mechanism
              "Reset view" already uses for resetNonce. */}
          <Canvas
            key={`${distance}-${resetNonce}`}
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
              minDistance={distance * 0.15}
              maxDistance={distance * 6}
              minPolarAngle={MathUtils.degToRad(2)}
              maxPolarAngle={MathUtils.degToRad(178)}
            />
            <SceneContent scene={scene} center={center} size={size} onAzimuthChange={setAzimuth} />
          </Canvas>
        </ModelErrorBoundary>
      </div>

      <button
        type="button"
        onClick={() => setResetNonce((n) => n + 1)}
        className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm shadow-lg"
        style={{ zIndex: 20, background: "rgba(124,58,237,0.9)", color: "#fff", border: "1px solid rgba(233,213,255,0.6)" }}
      >
        Reset view
      </button>

      {panels.map((panel, i) => (
        <RevealPanel key={i} active={bandIndex === i} position={panel.position}>
          {panel.content}
        </RevealPanel>
      ))}
    </div>
  );
};

export default HeroCarExperience;
