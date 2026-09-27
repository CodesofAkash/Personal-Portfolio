import type { StructureResolver } from "sanity/structure";

// Fixed-documentId singleton (AK-SAN-036) — there is exactly one settings
// document, so it is opened directly rather than listed as a collection.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("settings")
        .child(S.document().schemaType("settings").documentId("settings").title("Site settings")),
    ]);
