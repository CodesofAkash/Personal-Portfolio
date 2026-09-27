import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Public dataset, published content only — the CDN is safe and cheap here.
  useCdn: true,
  perspective: "published",
  // Inert until draft mode is actually on, so enabling it costs nothing on
  // the public site — AK-SAN-007. Needed for VisualEditing's click-to-edit
  // overlays to bind to the right field.
  stega: {
    studioUrl,
    enabled: true,
  },
});
