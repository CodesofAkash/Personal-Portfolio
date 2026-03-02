import { Component } from "react";

/**
 * ModelErrorBoundary — wraps 3D canvas components so a failed
 * model load doesn't crash the whole page.
 *
 * Shows a friendly fallback UI instead of a blank/broken section.
 *
 * Usage:
 *   <ModelErrorBoundary label="3D Computer">
 *     <ComputersCanvas />
 *   </ModelErrorBoundary>
 */
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log for debugging — remove in production if desired
    console.warn(`[ModelErrorBoundary] ${this.props.label || "3D model"} failed to load:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-40">
          {/* Simple animated 3D cube placeholder */}
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
          <p className="text-secondary text-sm">
            {this.props.label || "3D model"} loading...
          </p>
          {/* Retry button */}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs text-secondary border border-secondary/30 px-3 py-1 rounded hover:border-secondary/60 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ModelErrorBoundary;