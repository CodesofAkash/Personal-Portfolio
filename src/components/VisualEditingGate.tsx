"use client";

import { VisualEditing } from "next-sanity/visual-editing";

/**
 * Whether the page is inside Presentation's iframe has no server-side
 * answer, so this component is only ever loaded client-side (via
 * next/dynamic with ssr:false in the layout) — never hydrated, so reading
 * window directly during render carries no hydration-mismatch risk here.
 * The draft-mode cookie persists across tabs once enabled from Presentation,
 * so gating only on that cookie would still mount broken click-to-edit
 * overlays on an ordinary top-level visit (AK-CMS-034).
 */
export default function VisualEditingGate() {
  if (window.self === window.top) return null;
  return <VisualEditing />;
}
