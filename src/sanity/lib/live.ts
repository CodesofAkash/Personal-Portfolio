import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken, projectId, dataset, apiVersion } from "../env";

// SanityLive still comes from the library — it's a self-contained client
// component (its own EventSource connection) that pushes instant updates
// to a browser tab that's already open, independent of how server-side
// data gets fetched. That part was never the problem.
const { SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: false,
});
export { SanityLive };

// Deliberately NOT client.fetch(). @sanity/client's Node transport
// (get-it) imports fetch directly from the `undici` package rather than
// calling globalThis.fetch, which is what Next.js actually patches and
// tracks for on-demand invalidation. The observed symptom confirmed this
// precisely: a webhook-triggered revalidatePath() reported success and
// even flipped Vercel's cache header to REVALIDATED (proving the page
// really did regenerate), yet the content stayed pinned to whatever value
// this fetch first returned — unresponsive to every later revalidatePath
// call. Calling the real, Next-patched fetch() directly against Sanity's
// HTTP API puts this fetch in the same cache/invalidation graph
// revalidatePath() actually walks.
const queryUrl = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`;

export async function sanityFetch<T = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: T }> {
  const search = new URLSearchParams({ query });
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value));
  }
  const res = await fetch(`${queryUrl}?${search.toString()}`, {
    headers: readToken ? { Authorization: `Bearer ${readToken}` } : undefined,
    // Full Route Cache (the page shell) and Data Cache (this fetch's own
    // result) are separate caches. revalidatePath() reliably invalidates
    // the former — confirmed via Vercel's cache header flipping to
    // REVALIDATED — but a plain untagged fetch's Data Cache entry wasn't
    // actually being cleared by it: the page regenerated on every webhook
    // call, yet kept re-reading this same stale cached result each time.
    // Tagging it lets /api/revalidate target this exact entry directly
    // with revalidateTag(), the mechanism Next documents for this. The
    // revalidate window matches the page's own 60s fallback in layout.tsx
    // deliberately: if this were long (e.g. a year) while the page
    // revalidates every 60s, a regenerated page would still just re-read
    // this same long-lived cached fetch result on every regeneration,
    // silently defeating the 60s safety net entirely.
    next: { tags: ["sanity"], revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`[sanity] query failed: ${res.status} ${res.statusText}`);
  }
  const { result } = (await res.json()) as { result: T };
  return { data: result };
}
