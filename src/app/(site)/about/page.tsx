import type { Metadata } from "next";
import AboutView from "./AboutView";
import { getAboutPage, getExperiences, getSettings, getTechnologies } from "@/sanity/lib/queries";
import { buildMetadata } from "@/sanity/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [aboutPage, settings] = await Promise.all([getAboutPage(), getSettings()]);
  return buildMetadata(aboutPage?.seo, settings?.seo, "/about");
}

export default async function Page() {
  const [aboutPage, experiences, technologies] = await Promise.all([
    getAboutPage(),
    getExperiences(),
    getTechnologies(),
  ]);

  return (
    <AboutView
      sections={aboutPage?.sections ?? []}
      experiences={experiences}
      technologies={technologies}
    />
  );
}
