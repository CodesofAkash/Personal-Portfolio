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
  });
  if (!res.ok) {
    throw new Error(`[sanity] query failed: ${res.status} ${res.statusText}`);
  }
  const { result } = (await res.json()) as { result: T };
  return { data: result };
}
