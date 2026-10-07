import { draftMode } from "next/headers";
import { client } from "./client";
import { sanitizeIconSvgs } from "./sanitize-svg";

// No SanityLive here, deliberately. Its EventSource connection was already
// non-functional in this architecture — it only has anything to revalidate
// when paired with defineLive's own sanityFetch (tagged fetches it can
// invalidate on a live event), and this project uses a plain client.fetch()
// instead, which carries no sanity:* tags for it to act on. On top of
// providing no real benefit, a dropped/blocked SSE connection (confirmed
// happening in PageSpeed Insights' test environment specifically) logs
// console errors — "<SanityLive> is attempting to reconnect" plus the
// underlying failed resource load — which directly cost Best Practices
// points. Webhook-triggered on-demand revalidation (/api/revalidate,
// AK-SAN-071) is the real, reliable correctness mechanism and is
// completely independent of this.
export async function sanityFetch<T = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: T }> {
  // stega only for draft-mode requests — see client.ts for why an
  // unconditional stega:true was corrupting every page's text content.
  const { isEnabled } = await draftMode();
  const data = await client.fetch<T>(query, params, { stega: isEnabled });
  return { data: sanitizeIconSvgs(data) };
}
