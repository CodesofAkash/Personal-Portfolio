"use client";

import { useState, type ImgHTMLAttributes } from "react";

interface CloudImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  src?: string | null;
  fallbackSrc?: string;
  alt?: string;
  placeholderClassName?: string;
}

const CloudImage = ({
  src,
  fallbackSrc,
  alt = "",
  className = "",
  placeholderClassName = "",
  style,
  ...rest
}: CloudImageProps) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading",
  );

  const effectiveSrc = src || fallbackSrc || null;

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
      {status === "loading" && (
        <span
          className={`absolute inset-0 animate-pulse bg-tertiary rounded ${placeholderClassName}`}
          aria-hidden="true"
        />
      )}

      <img
        src={
          status === "error" && fallbackSrc && effectiveSrc !== fallbackSrc
            ? fallbackSrc
            : effectiveSrc
        }
        alt={alt}
        className={`${className} ${status === "loading" ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        onLoad={() => setStatus("loaded")}
        onError={() => {
          if (status !== "error") {
            setStatus("error");
          }
        }}
        {...rest}
      />
    </span>
  );
};

export default CloudImage;
