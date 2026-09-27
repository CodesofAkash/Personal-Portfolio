import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { draftMode } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import DraftModeBanner from "@/components/DraftModeBanner";
import VisualEditingLoader from "@/components/VisualEditingLoader";
import { SanityLive } from "@/sanity/lib/live";
import { getSettings } from "@/sanity/lib/queries";
import { buildMetadata } from "@/sanity/lib/seo";
import { resolveImageUrl } from "@/sanity/lib/image";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    ...buildMetadata(undefined, settings?.seo, "/"),
    icons: settings?.favicon
      ? { icon: resolveImageUrl(settings.favicon), apple: resolveImageUrl(settings.favicon) }
      : undefined,
    verification: {
      google: settings?.verification?.google,
      other: settings?.verification?.bing ? { "msvalidate.01": settings.verification.bing } : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const logoUrl = resolveImageUrl(settings?.logo);
  const { isEnabled: isDraft } = await draftMode();

  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings?.name,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    jobTitle: "Full-Stack Developer",
    sameAs: settings?.socials?.map((s) => s.url) ?? [],
  };

  if (settings?.maintenance?.enabled) {
    return (
      <html lang="en" className={poppins.variable}>
        <body>
          <div
            className="flex flex-col items-center justify-center text-center px-6"
            style={{ background: "#050816", color: "#f8fafc", minHeight: "100vh" }}
          >
            <h1 className="font-bold text-3xl mb-4">
              {settings.maintenance.heading || "Back shortly"}
            </h1>
            {settings.maintenance.message && (
              <p className="max-w-md" style={{ color: "#94a3b8" }}>
                {settings.maintenance.message}
              </p>
            )}
          </div>
          <SanityLive />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        <div className="relative z-0 bg-primary min-h-screen flex flex-col">
          <Navbar
            brandName={settings?.name}
            logoUrl={logoUrl}
            navLinks={settings?.navLinks ?? []}
          />
          <main className="flex-1 pt-[68px]">{children}</main>
          <Footer
            brandName={settings?.name}
            logoUrl={logoUrl}
            tagline={settings?.tagline}
            socials={settings?.socials ?? []}
          />
        </div>
        <ToastProvider />
        {/* Not draft-gated: defineLive only configures revalidation — nothing
            revalidates until the next deploy unless this is actually rendered. */}
        <SanityLive />
        {isDraft && <VisualEditingLoader />}
        {isDraft && <DraftModeBanner />}
      </body>
    </html>
  );
}
