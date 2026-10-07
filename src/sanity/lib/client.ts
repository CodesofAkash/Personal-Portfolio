import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Public dataset, published content only — the CDN is safe and cheap here.
  useCdn: true,
  perspective: "published",
  // The studioUrl VisualEditing's click-to-edit overlay needs when stega
  // *is* turned on — actual activation happens per-fetch in sanityFetch
  // (live.ts), gated on draft mode. It must not be unconditionally on here:
  // stega works by injecting invisible zero-width Unicode characters into
  // every string field so the overlay can map rendered text back to its
  // source field, and with no gate those characters were going out to every
  // ordinary visitor on every page — confirmed via PSI showing the About
  // page's name, split one <span> per character for a stagger animation,
  // rendering 1028 spans for a 12-character name (AK-SAN-007 was the
  // intent; this wires it up for real).
  stega: {
    studioUrl,
    enabled: true,
  },
});
