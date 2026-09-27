import type { Metadata } from "next";
import AboutView from "./AboutView";

export const metadata: Metadata = {
  title: "About Akash Sharma | Full-Stack Developer",
  description:
    "Learn about my journey from self-taught developer to shipping production-ready apps. Experience with React, Node.js, Three.js, and modern web technologies.",
  alternates: {
    canonical: "https://akashsharma.dev/about",
  },
  openGraph: {
    title: "About Akash Sharma | Full-Stack Developer",
    description:
      "Learn about my journey from self-taught developer to shipping production-ready apps. Experience with React, Node.js, Three.js, and modern web technologies.",
    url: "https://akashsharma.dev/about",
  },
  twitter: {
    title: "About Akash Sharma | Full-Stack Developer",
    description:
      "Learn about my journey from self-taught developer to shipping production-ready apps. Experience with React, Node.js, Three.js, and modern web technologies.",
  },
};

export default function Page() {
  return <AboutView />;
}
