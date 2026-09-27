import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import type { SanityImageValue } from "@/sanity/lib/types";
import { resolveImageUrl } from "@/sanity/lib/image";

interface IconProps {
  image?: SanityImageValue;
  fallbackAlt: string;
  width: number;
  height: number;
  className?: string;
}

// AK-SAN-065 — real asset, else a sanitized inline SVG override, else
// nothing. Never a hardcoded placeholder baked in here; a caller with no
// image and no SVG renders its own fallback (e.g. a first-letter avatar).
const Icon = ({ image, fallbackAlt, width, height, className }: IconProps) => {
  const url = resolveImageUrl(image, { width, height });
  if (url) {
    return (
      <Image
        src={url}
        alt={image?.alt || fallbackAlt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  if (image?.iconSvg) {
    const clean = DOMPurify.sanitize(image.iconSvg, { USE_PROFILES: { svg: true, svgFilters: true } });
    return (
      <span
        role="img"
        aria-label={image.alt || fallbackAlt}
        className={className}
        style={{ display: "inline-block", width, height }}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  return null;
};

export default Icon;
