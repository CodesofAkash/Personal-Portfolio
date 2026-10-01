import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "../env";
import { sanitizeIconSvgs } from "./sanitize-svg";

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

// Not defineLive's own sanityFetch. Without cacheComponents (off here),
// Next resolves next-sanity's react-server build, which tags its fetch
// with { next: { revalidate: false, tags } } — revalidatePath() does
// clear that correctly, contrary to an earlier (wrong) assumption here.
// Staying on a plain client.fetch() anyway: it's what's been tested end
// to end and confirmed working this session; switching back to
// defineLive's sanityFetch is a reasonable option but unverified by that
// same standard, and open tabs lose SanityLive's instant push either way
// since a plain fetch carries no sanity:* tags for it to revalidate.
export async function sanityFetch<T = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>;
}): Promise<{ data: T }> {
  const data = await client.fetch<T>(query, params);
  return { data: sanitizeIconSvgs(data) };
}
