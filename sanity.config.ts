import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Personal Portfolio",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Vision runs GROQ queries against the dataset from inside the Studio —
    // the fastest way to check a query before wiring it into the app.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
