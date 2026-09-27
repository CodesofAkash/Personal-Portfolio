"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import ModelErrorBoundary from "@/components/ModelErrorBoundary";
import ModelFallback from "@/components/ModelFallback";
import { useSafeGLTF } from "@/lib/useSafeGLTF";
import { MODELS } from "@/lib/cdn";

const Computers = ({ scene, isMobile }: { scene: Group; isMobile: boolean }) => (
  <mesh>
    <hemisphereLight intensity={2} groundColor="black" />
    <pointLight intensity={2} />
    <spotLight
      intensity={1}
      castShadow
      shadow-mapSize={1024}
      position={[-20, 50, 10]}
      angle={0.12}
      penumbra={1}
    />
    <primitive
      object={scene}
      scale={isMobile ? 0.5 : 0.75}
      position={isMobile ? [0, -1.4, -1.3] : [0, -2.3, -1.5]}
      rotation={[0, 0.1, -0.1]}
    />
  </mesh>
);

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 500px)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 500px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scene, progress, failed } = useSafeGLTF(MODELS.desktopPc);

  return (
    <div className="absolute inset-0">
      {!scene ? (
        <ModelFallback label="3D Computer" loading={!failed} progress={progress} />
      ) : (
        <ModelErrorBoundary label="3D Computer">
          <Canvas
            frameloop="demand"
            shadows
            camera={{ position: [20, 3, 5], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
            style={{ width: "100%", height: "100%" }}
          >
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
            <Computers scene={scene} isMobile={isMobile} />
          </Canvas>
        </ModelErrorBoundary>
      )}
    </div>
  );
};

export default ComputersCanvas;
