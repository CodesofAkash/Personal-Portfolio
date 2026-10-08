import type { Metadata } from "next";
import Studio from "./Studio";
import { metadata as studioMetadata, viewport } from "next-sanity/studio";

// Importing sanity.config from a server component makes Next resolve swr's
// "react-server" entry, which exports no default — Sanity 6 imports one.
export const dynamic = "force-static";

export { viewport };

// next-sanity's own metadata sets no robots directive — this is the CMS
// admin, not public content, and has no reason to be indexable.
export const metadata: Metadata = { ...studioMetadata, robots: { index: false, follow: false } };

export default function StudioPage() {
  return <Studio />;
}
