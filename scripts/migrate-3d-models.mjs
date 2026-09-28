// One-off: checks whether the CloudFront-hosted 3D models are safe to move
// onto Sanity's own asset CDN, and does it if so.
//
// A .gltf file (as opposed to .glb) is JSON that can reference SEPARATE
// buffer/texture files by relative URI. Sanity's `file` field holds exactly
// one asset — uploading just the .gltf JSON would silently break the model
// if it points at sibling files that no longer sit next to it once hosted
// on Sanity's CDN. This script checks that before uploading anything.
//
// Usage: node --env-file=.env.local scripts/migrate-3d-models.mjs

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN.",
  );
}

const client = createClient({ projectId, dataset, apiVersion: "2026-09-27", token, useCdn: false });

const MODELS = [
  {
    label: "desktop_pc",
    url: "https://d1una6qv9iebr4.cloudfront.net/desktop_pc/scene.gltf",
    // homePage -> sections[] -> heroSection -> model
    patch: { documentId: "homePage", sectionType: "heroSection" },
  },
  {
    label: "planet",
    url: "https://d1una6qv9iebr4.cloudfront.net/planet/scene.gltf",
    // contactPage -> sections[] -> contactHeroSection -> model
    patch: { documentId: "contactPage", sectionType: "contactHeroSection" },
  },
];

function externalRefs(gltfJson) {
  const refs = [];
  for (const buf of gltfJson.buffers ?? []) {
    if (buf.uri && !buf.uri.startsWith("data:")) refs.push(buf.uri);
  }
  for (const img of gltfJson.images ?? []) {
    if (img.uri && !img.uri.startsWith("data:")) refs.push(img.uri);
  }
  return refs;
}

async function checkAndMigrate({ label, url, patch }) {
  console.log(`\n--- ${label} ---`);
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`  fetch failed: ${res.status} ${res.statusText}`);
    return;
  }
  const text = await res.text();
  let gltf;
  try {
    gltf = JSON.parse(text);
  } catch {
    console.log("  not valid JSON — is this actually a .glb? This script only handles .gltf JSON. Skipping.");
    return;
  }

  const refs = externalRefs(gltf);
  if (refs.length > 0) {
    console.log(`  NOT self-contained — references ${refs.length} external file(s), uploading just this .gltf would break it:`);
    refs.forEach((r) => console.log(`    - ${r}`));
    console.log("  Fix: re-export this model as a single self-contained .glb (embeds buffers/textures), then re-run this script, or upload the .glb by hand in Studio.");
    return;
  }

  console.log("  Self-contained (no external buffer/image URIs) — safe to upload.");
  const buffer = Buffer.from(text, "utf8");
  const asset = await client.assets.upload("file", buffer, { filename: `${label}.gltf` });
  console.log(`  Uploaded as asset ${asset._id}`);

  const doc = await client.getDocument(patch.documentId);
  if (!doc) {
    console.log(`  Could not find document "${patch.documentId}" to patch — upload succeeded, wire the model field manually in Studio.`);
    return;
  }
  const sections = doc.sections ?? [];
  const idx = sections.findIndex((s) => s._type === patch.sectionType);
  if (idx === -1) {
    console.log(`  Could not find a "${patch.sectionType}" section on "${patch.documentId}" — upload succeeded, wire the model field manually in Studio.`);
    return;
  }

  await client
    .patch(patch.documentId)
    .set({
      [`sections[${idx}].model`]: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
    })
    .commit();
  console.log(`  Patched sections[${idx}].model on "${patch.documentId}".`);
}

async function main() {
  for (const model of MODELS) {
    await checkAndMigrate(model);
  }
  console.log("\nDone. Re-deploy is not required — this only changed CMS content, the frontend already prefers the CMS model when set.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
