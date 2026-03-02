import { useState } from "react";

/**
 * CloudImage — a drop-in <img> replacement that handles 3 states:
 *
 * 1. LOADING  → shows an animated skeleton placeholder
 * 2. ERROR    → shows a fallback (local src, or a grey placeholder box)
 * 3. LOADED   → shows the image normally
 *
 * Usage:
 *   <CloudImage src={techIcon("portfolio/tech/reactjs")} alt="React" className="w-16 h-16" />
 *   <CloudImage src={projectImage("portfolio/projects/twitch")} alt="Twitch Clone" fallbackSrc={twitchLocal} />
 *
 * Props:
 *   src         — Cloudinary URL (can be null if Cloudinary not configured yet)
 *   fallbackSrc — local import to use if src is null or fails to load
 *   alt         — alt text (required for accessibility)
 *   className   — CSS classes passed to the <img>
 *   placeholderClassName — CSS classes for the loading skeleton
 *   ...rest     — any other props passed straight to <img>
 */
const CloudImage = ({
  src,
  fallbackSrc,
  alt = "",
  className = "",
  placeholderClassName = "",
  style,
  ...rest
}) => {
  const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "error"

  // Resolve which src to actually use
  const effectiveSrc = src || fallbackSrc || null;

  // If we have no src at all, show a labelled placeholder box
  if (!effectiveSrc) {
    return (
      <div
        className={`bg-tertiary rounded flex items-center justify-center ${placeholderClassName || className}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <span className="text-secondary text-xs opacity-50 text-center px-1">
          {alt || "Image"}
        </span>
      </div>
    );
  }

  return (
    <span className="relative inline-block" style={style}>
      {/* Skeleton shown while loading */}
      {status === "loading" && (
        <span
          className={`absolute inset-0 animate-pulse bg-tertiary rounded ${placeholderClassName}`}
          aria-hidden="true"
        />
      )}

      <img
        src={effectiveSrc}
        alt={alt}
        className={`${className} ${status === "loading" ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setStatus("loaded")}
        onError={() => {
          // If Cloudinary URL failed AND we have a local fallback, try it
          if (status !== "error") {
            setStatus("error");
          }
        }}
        // If Cloudinary failed but we have a local fallback, use it
        {...(status === "error" && fallbackSrc && effectiveSrc !== fallbackSrc
          ? { src: fallbackSrc }
          : {})}
        {...rest}
      />
    </span>
  );
};

export default CloudImage;