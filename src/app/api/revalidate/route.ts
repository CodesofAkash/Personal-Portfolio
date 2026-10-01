import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Sanity calls this on every publish (a webhook configured in
// sanity.io/manage, not in code — see the setup steps below). This is what
// actually makes content edits go live for real visitors: the site's own
// cached Sanity data is fully time-based otherwise (next-sanity's Live
// Content API caches a query for up to a year, and only refreshes early for
// a browser tab that's already open and connected — not for a fresh visit,
// which is what matters here). revalidatePath('/', 'layout') clears the
// whole route tree, since every page shares layout.tsx's settings fetch and
// most content is reachable from nav anyway.
//
// One-time setup:
// 1. Generate any long random string as a secret.
// 2. Add it as SANITY_REVALIDATE_SECRET in .env.local, and in Vercel ->
//    Project -> Settings -> Environment Variables (then redeploy once so
//    the variable and this route are both live).
// 3. sanity.io/manage -> this project -> API -> Webhooks -> Create webhook:
//    URL: https://<your-domain>/api/revalidate
//    Dataset: production (or whichever)
//    Trigger on: Create, Update, Delete
//    HTTP method: POST
//    Secret: the same value as SANITY_REVALIDATE_SECRET
// 4. Test: publish an edit in Studio, then load the live site in a fresh
//    tab — it should show the change within a few seconds, no redeploy.
//    sanity.io/manage's webhook log shows every call and its response code
//    if it doesn't (401 = secret mismatch, 404 = route not deployed yet,
//    500 = env var missing on Vercel).
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not configured");
    return NextResponse.json({ message: "Revalidation secret not configured" }, { status: 500 });
  }

  const { isValidSignature } = await parseBody(request, secret, true);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  // Two separate caches: revalidatePath clears the page shell (Full Route
  // Cache), revalidateTag clears the Sanity fetch's own cached result
  // (Data Cache) — confirmed as genuinely separate in practice, not just
  // in theory: revalidatePath alone visibly forced the page to regenerate
  // every time, yet it kept re-reading the same stale tagged fetch result.
  revalidatePath("/", "layout");
  // Next 16 requires a profile as the second argument — { expire: 0 } asks
  // for the closest thing to immediate expiration available outside a
  // Server Action (updateTag is Server-Action-only).
  revalidateTag("sanity", { expire: 0 });
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
