import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import CanvasLoader from '../Loader';
import ModelErrorBoundary from '../ModelErrorBoundary';
import { MODELS } from '../../lib/cdn';

const Computers = ({ isMobile }) => {
  const computer = useGLTF(MODELS.desktopPc);
  return (
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
        object={computer.scene}
        scale={isMobile ? 0.5 : 0.7}
        position={isMobile ? [0, -1.4, -1.3] : [0, -2.3, -1.5]}
        rotation={isMobile ? [0, 0.4, -0.1] : [0, 0.1, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    setIsMobile(mediaQuery.matches);
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <ModelErrorBoundary label="3D Computer">
      <Canvas
        frameloop="demand"
        shadows
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Computers isMobile={isMobile} />
        </Suspense>
        {/* Preload removed — caused NaN bounding sphere errors when
            geometry wasn't ready. Model loads fine via useGLTF. */}
      </Canvas>
    </ModelErrorBoundary>
  );
};

export default ComputersCanvas;