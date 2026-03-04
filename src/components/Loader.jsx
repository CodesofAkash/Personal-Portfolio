import { Html, useProgress } from "@react-three/drei"

const CanvasLoader = () => {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        {/* Minimal ring spinner */}
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: "#7c3aed",
            borderRightColor: "rgba(124,58,237,0.3)",
          }}
        />
        {/* Progress number */}
        <p
          className="text-xs font-medium tabular-nums"
          style={{ color: "#94a3b8" }}
        >
          {progress.toFixed(0)}%
        </p>
      </div>
    </Html>
  )
}

export default CanvasLoader