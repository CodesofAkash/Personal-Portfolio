import type { Metadata } from "next";
import type { Seo, Settings } from "./types";
import { urlFor } from "./image";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// One mapping function, used by every page (AK-SAN-023). Fallback is
// field-by-field, not all-or-nothing (AK-SAN-024) — a page missing only an
// OG image still keeps its own title and description.
export function buildMetadata(
  pageSeo: Seo | undefined,
  siteSeo: Settings["seo"] | undefined,
  path: string,
): Metadata {
  const title = pageSeo?.title || siteSeo?.title;
  const description = pageSeo?.description || siteSeo?.description;
  const ogImageSource = pageSeo?.ogImage ?? siteSeo?.ogImage;
  const ogImageUrl = ogImageSource?.asset
    ? urlFor(ogImageSource as never).width(1200).height(630).url()
    : undefined;
  const canonical = path === "/" ? SITE_URL : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
