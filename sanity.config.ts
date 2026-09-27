import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool, defineLocations } from "sanity/presentation";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    presentationTool({
      previewUrl: {
        origin: SITE_URL,
        previewMode: { enable: "/api/draft-mode/enable" },
      },
      resolve: {
        locations: {
          homePage: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: "Home", href: "/" }] }),
          }),
          aboutPage: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: "About", href: "/about" }] }),
          }),
          projectsPage: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: "Projects", href: "/projects" }] }),
          }),
          contactPage: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: "Contact", href: "/contact" }] }),
          }),
          settings: defineLocations({
            select: {},
            resolve: () => ({
              locations: [
                { title: "Home", href: "/" },
                { title: "About", href: "/about" },
                { title: "Projects", href: "/projects" },
                { title: "Contact", href: "/contact" },
              ],
            }),
          }),
          legalPage: defineLocations({
            select: { slug: "slug", heading: "heading" },
            resolve: (value) => ({
              locations: [{ title: value?.heading ?? "Legal page", href: `/${value?.slug}` }],
            }),
          }),
          project: defineLocations({
            select: {},
            resolve: () => ({
              locations: [
                { title: "Projects", href: "/projects" },
                { title: "Home", href: "/" },
              ],
            }),
          }),
          experience: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: "About", href: "/about" }] }),
          }),
          technology: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: "About", href: "/about" }] }),
          }),
          testimonial: defineLocations({
            select: {},
            resolve: () => ({ locations: [{ title: "Home", href: "/" }] }),
          }),
        },
      },
    }),
  ],
});
