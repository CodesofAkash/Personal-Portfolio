import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Public dataset, published content only — the CDN is safe and cheap here.
  useCdn: true,
  perspective: "published",
  // enabled deliberately left unset (AK-SAN-007) — a per-call `true` in
  // sanityFetch (live.ts) is what actually turns stega on, gated on draft
  // mode, and that alone is enough (verified: a per-call `stega: false`
  // correctly overrides a client-level `enabled: true`). But leaving
  // `enabled: true` here anyway would mean a future call site that forgets
  // the per-call gate silently re-enables stega for every visitor, instead
  // of just quietly staying off — stega injects invisible zero-width
  // Unicode characters into every string field for the Studio overlay to
  // read, and with no gate those characters went out to every ordinary
  // visitor on every page (confirmed via PSI: the About page's name,
  // split one <span> per character for a stagger animation, rendered 1028
  // spans for a 12-character name).
  stega: {
    studioUrl,
  },
});
