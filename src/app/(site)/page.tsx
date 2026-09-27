import type { Metadata } from "next";
import HomeView from "./HomeView";
import { getHomePage, getProjects, getSettings, getTestimonials } from "@/sanity/lib/queries";
import { buildMetadata } from "@/sanity/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [homePage, settings] = await Promise.all([getHomePage(), getSettings()]);
  return buildMetadata(homePage?.seo, settings?.seo, "/");
}

export default async function Page() {
  const [homePage, projects, testimonials] = await Promise.all([
    getHomePage(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <HomeView
      content={homePage}
      featuredProjects={projects.slice(0, 3)}
      testimonials={testimonials}
    />
  );
}
