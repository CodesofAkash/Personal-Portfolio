import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Public dataset, published content only — the CDN is safe and cheap here.
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl,
    // Draft mode only: stega's invisible chars would leak into JSON-LD.
    enabled: false,
  },
});
