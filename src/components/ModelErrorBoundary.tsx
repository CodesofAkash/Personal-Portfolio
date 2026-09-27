"use client";

import { Component, type ReactNode } from "react";

interface ModelErrorBoundaryProps {
  label?: string;
  children: ReactNode;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  constructor(props: ModelErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ModelErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn(
      `[ModelErrorBoundary] ${this.props.label || "3D model"} failed to load:`,
      error,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
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
          <p className="text-secondary text-sm">
            {this.props.label || "3D model"} loading...
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
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
