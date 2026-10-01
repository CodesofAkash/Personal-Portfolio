import createDOMPurify from "dompurify";
import { parseHTML } from "linkedom";
import Image from "next/image";
import type { SanityImageValue } from "@/sanity/lib/types";
import { resolveImageUrl } from "@/sanity/lib/image";

// Not isomorphic-dompurify — it pulls in jsdom, whose own dependency tree
// (html-encoding-sniffer -> an ESM-only package) breaks CommonJS interop
// when Turbopack bundles it into Vercel's deployed serverless function.
// Confirmed via production runtime logs: every page regeneration touching
// this component crashed before producing output, and even explicitly
// excluding jsdom via next.config.ts's serverExternalPackages didn't stop
// Turbopack from still inlining it — confirmed locally by grepping the
// built chunk afterward. linkedom is a much lighter, pure-JS DOM with no
// such dependency; this keeps DOMPurify's own well-tested SVG sanitization
// logic unchanged, just runs it on a DOM that actually bundles cleanly.
// This component only ever renders server-side, so one shared instance is
// enough — no browser-vs-Node branching needed.
const { window } = parseHTML("<!DOCTYPE html><html><body></body></html>");
const DOMPurify = createDOMPurify(window as unknown as Parameters<typeof createDOMPurify>[0]);

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
