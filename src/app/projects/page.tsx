import type { Metadata } from "next";
import ProjectsView from "./ProjectsView";

export const metadata: Metadata = {
  title: "Projects | Akash Sharma - Full-Stack Developer",
  description:
    "Explore my portfolio of production-ready projects including real-time systems, 3D web experiences, and full-stack applications.",
  alternates: {
    canonical: "https://akashsharma.dev/projects",
  },
  openGraph: {
    title: "Projects | Akash Sharma - Full-Stack Developer",
    description:
      "Explore my portfolio of production-ready projects including real-time systems, 3D web experiences, and full-stack applications.",
    url: "https://akashsharma.dev/projects",
  },
  twitter: {
    title: "Projects | Akash Sharma - Full-Stack Developer",
    description:
      "Explore my portfolio of production-ready projects including real-time systems, 3D web experiences, and full-stack applications.",
  },
};

export default function Page() {
  return <ProjectsView />;
}
