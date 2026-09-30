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

// sanityFetch itself is NOT the library's version. defineLive's own
// sanityFetch tags every fetch via cacheTag()/cacheLife() from next/cache —
// APIs that next.config.ts's cacheComponents flag (off, and a significant
// app-wide toggle to turn on) is required for. Without it, those fetches
// still got cached somewhere Next's revalidatePath() couldn't reach:
// confirmed a webhook-triggered revalidatePath() visibly forced the page to
// regenerate (Vercel's cache header went STALE -> REVALIDATED), but the
// regenerated page still served the old Sanity content — a real content
// edit never showed up even minutes later, with Sanity's CDN propagation
// window (~60s) long since passed. This is a plain client.fetch() instead,
// which Next's ordinary, stable caching model governs — no surprise extra
// cache layer, nothing for revalidatePath()/revalidateTag() to miss.
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
