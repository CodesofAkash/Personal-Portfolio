interface ModelFallbackProps {
  label: string;
  loading?: boolean;
  progress?: number;
}

// Plain HTML, deliberately rendered instead of the <Canvas> — used both while
// a model is still loading and when it failed, so a broken/unreachable asset
// never gets as far as mounting a WebGL context at all.
const ModelFallback = ({ label, loading, progress = 0 }: ModelFallbackProps) => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-40">
    <div className="w-16 h-16 border-2 border-secondary rounded-lg flex items-center justify-center animate-pulse">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="w-8 h-8 text-secondary"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
    </div>
    <p className="text-secondary text-sm tabular-nums">
      {loading ? `${label} loading… ${progress}%` : `${label} unavailable`}
    </p>
  </div>
);

export default ModelFallback;
