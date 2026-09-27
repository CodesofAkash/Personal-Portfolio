import { createElement, forwardRef, type CSSProperties } from "react";
import type { HeadingSegment } from "@/sanity/lib/types";
import { C } from "./colors";

const SEGMENT_STYLE: Record<NonNullable<HeadingSegment["style"]>, CSSProperties> = {
  default: {},
  muted: { color: C.dim },
  brand: { color: C.violet },
  outline: { WebkitTextStroke: `2px ${C.violet}`, color: "transparent" },
};

interface HeadingProps {
  segments?: HeadingSegment[];
  className?: string;
  style?: CSSProperties;
}

// Renders a headingSegments field (AK-SAN-064): segments join with a single
// space, a literal "\n" inside a segment's text becomes a line break, and
// only the first segment's tag picks the semantic element — later segments
// only ever change color treatment, never the heading level.
const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({ segments, className, style }, ref) => {
  if (!segments || segments.length === 0) return null;
  const tag = segments[0].tag ?? "h2";

  return createElement(
    tag,
    { ref, className, style },
    segments.map((seg, i) => (
      <span key={seg._key ?? i} style={SEGMENT_STYLE[seg.style ?? "default"]}>
        {i > 0 ? " " : ""}
        {seg.text.split("\n").map((line, li) => (
          <span key={li}>
            {li > 0 && <br />}
            {line}
          </span>
        ))}
      </span>
    )),
  );
});

Heading.displayName = "Heading";

export default Heading;
