import { revalidatePath } from "next/cache";
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

  revalidatePath("/", "layout");

  // revalidatePath() only marks the page stale — Vercel's actual
  // regeneration runs lazily on whichever request happens to hit the page
  // next, which is what produces the 15s-2min variance seen in testing:
  // nothing forces it to run until some real visitor's request triggers
  // it. Fetching the page here, inside the webhook itself, forces that
  // regeneration to run immediately instead, so a real visitor lands on
  // an already-fresh cached page. Sanity doesn't care if this adds a
  // couple of seconds to the webhook's own response time. Awaited, not
  // fire-and-forget — an unawaited request risks being killed when this
  // function returns, since Vercel can tear down the runtime right after
  // the response is sent. request.url's origin (not a hardcoded site URL)
  // so this keeps working correctly against preview deployments too.
  const origin = new URL(request.url).origin;
  await fetch(origin, { cache: "no-store" }).catch(() => {});

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
