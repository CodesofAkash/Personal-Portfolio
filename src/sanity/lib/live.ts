import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "../env";

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

// Not defineLive's own sanityFetch — that one tags every fetch via
// cacheTag()/cacheLife() from next/cache, APIs that require
// next.config.ts's cacheComponents flag (off here) to function as real
// cache boundaries. This is a plain client.fetch() instead, governed by
// the page's own ISR config (layout.tsx's revalidate + the webhook's
// revalidatePath) rather than a separate per-fetch caching layer.
export async function sanityFetch<T = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: T }> {
  const data = await client.fetch<T>(query, params);
  return { data };
}
