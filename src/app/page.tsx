import type { Metadata } from "next";
import HomeView from "./HomeView";

export const metadata: Metadata = {
  title: "Akash Sharma | Full-Stack Developer & 3D Web Specialist",
  description:
    "Full-stack developer specializing in React, Three.js, Node.js. 10+ projects shipped. Self-taught developer building real-time systems and 3D web experiences.",
  alternates: {
    canonical: "https://akashsharma.dev",
  },
  openGraph: {
    title: "Akash Sharma | Full-Stack Developer & 3D Web Specialist",
    description:
      "Full-stack developer specializing in React, Three.js, Node.js. 10+ projects shipped. Self-taught developer building real-time systems and 3D web experiences.",
    url: "https://akashsharma.dev",
  },
  twitter: {
    title: "Akash Sharma | Full-Stack Developer & 3D Web Specialist",
    description:
      "Full-stack developer specializing in React, Three.js, Node.js. 10+ projects shipped. Self-taught developer building real-time systems and 3D web experiences.",
  },
};

export default function Page() {
  return <HomeView />;
}
