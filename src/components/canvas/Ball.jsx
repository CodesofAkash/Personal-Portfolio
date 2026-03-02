import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Decal, Float, OrbitControls, Preload, useTexture } from "@react-three/drei"
import CanvasLoader from '../Loader'
import ModelErrorBoundary from '../ModelErrorBoundary'

const FallbackBall = () => (
  <Float speed={0.75} rotationIntensity={1} floatIntensity={2}>
    <ambientLight intensity={0.25} />
    <directionalLight position={[0, 0, 0.5]} />
    <mesh castShadow receiveShadow scale={2.75}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#aaa6c3" polygonOffset polygonOffsetFactor={-5} flatShading />
    </mesh>
  </Float>
)

const Ball = ({ imgUrl }) => {
  const [decal] = useTexture([imgUrl])
  return (
    <Float speed={0.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.5]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
        <Decal map={decal} position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} flatShading />
      </mesh>
    </Float>
  )
}

/**
 * Single canvas per ball — but now wrapped in ModelErrorBoundary
 * and guarded against null icons to prevent WebGL context explosion.
 *
 * The real WebGL context fix is in Tech.jsx — we lazy-render balls
 * only when they scroll into view, so max ~4 contexts exist at once.
 */
const BallCanvas = ({ icon }) => {
  const hasIcon = typeof icon === "string" && icon.length > 0

  return (
    <ModelErrorBoundary label="Tech Ball">
      <Canvas frameloop="demand" gl={{ preserveDrawingBuffer: true }}>
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls enableZoom={false} />
          {hasIcon ? <Ball imgUrl={icon} /> : <FallbackBall />}
        </Suspense>
        <Preload all />
      </Canvas>
    </ModelErrorBoundary>
  )
}

export default BallCanvas