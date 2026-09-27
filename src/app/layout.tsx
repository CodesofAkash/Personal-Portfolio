import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = "https://akashsharma.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Akash Sharma | Full-Stack Developer & 3D Web Specialist",
  description:
    "Akash Sharma - Full-stack developer specializing in React, Three.js, Node.js, and real-time systems. Portfolio showcasing production-ready projects.",
  keywords: [
    "full-stack developer",
    "React",
    "Three.js",
    "Node.js",
    "JavaScript",
    "web development",
  ],
  authors: [{ name: "Akash Sharma" }],
  icons: {
    icon: "/assets/logo.svg",
    apple: "/assets/logo.svg",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    title: "Akash Sharma | Full-Stack Developer",
    description:
      "Portfolio of Akash Sharma - self-taught full-stack developer building 3D web experiences and production apps.",
    url: SITE_URL,
    images: ["https://res.cloudinary.com/ddawd3kp5/image/upload/v1/og-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Sharma | Full-Stack Developer",
    description: "Portfolio of Akash Sharma - self-taught full-stack developer",
    creator: "@codesofakash",
  },
  other: {
    "theme-color": "#050816",
  },
};

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Akash Sharma",
  url: SITE_URL,
  jobTitle: "Full-Stack Developer",
  sameAs: [
    "https://github.com/CodesofAkash",
    "https://www.linkedin.com/in/codesofakash",
  ],
  knowsAbout: [
    "JavaScript",
    "React",
    "Node.js",
    "Three.js",
    "Web Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        <div className="relative z-0 bg-primary min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-[68px]">{children}</main>
          <Footer />
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
