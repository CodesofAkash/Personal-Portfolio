"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import ModelErrorBoundary from "@/components/ModelErrorBoundary";
import ModelFallback from "@/components/ModelFallback";
import { useSafeGLTF } from "@/lib/useSafeGLTF";
import { MODELS } from "@/lib/cdn";

const Earth = ({ scene }: { scene: Group }) => (
  <primitive object={scene} scale={2.5} position-y={0} rotation-y={0} />
);

const EarthCanvas = () => {
  const { scene, progress, failed } = useSafeGLTF(MODELS.planet);

  if (!scene) {
    return <ModelFallback label="3D Earth" loading={!failed} progress={progress} />;
  }

  return (
    <ModelErrorBoundary label="3D Earth">
      <Canvas
        shadows
        frameloop="demand"
        gl={{ preserveDrawingBuffer: true }}
        camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
      >
        <OrbitControls
          autoRotate
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
