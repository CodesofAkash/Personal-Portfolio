import type { Metadata } from "next";
import ProjectsView from "./ProjectsView";
import { getProjects, getProjectsPage, getSettings } from "@/sanity/lib/queries";
import { buildMetadata } from "@/sanity/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [projectsPage, settings] = await Promise.all([getProjectsPage(), getSettings()]);
  return buildMetadata(projectsPage?.seo, settings?.seo, "/projects");
}

export default async function Page() {
  const [content, projects] = await Promise.all([getProjectsPage(), getProjects()]);
  return <ProjectsView content={content} projects={projects} />;
}
