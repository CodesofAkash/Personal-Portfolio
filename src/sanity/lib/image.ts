import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";
import type { SanityImageValue } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: Image) => builder.image(source);

// Null-safe passthrough for the plain "bake the URL" strategy used on brand
// assets (logo, favicon, OG image) — AK-SAN-015.
export function resolveImageUrl(
  value: SanityImageValue | undefined,
  opts?: { width?: number; height?: number },
): string | undefined {
  if (!value?.asset) return undefined;
  let img = urlFor(value as never);
  if (opts?.width) img = img.width(opts.width);
  if (opts?.height) img = img.height(opts.height);
  return img.url();
}
