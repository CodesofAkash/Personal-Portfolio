import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  // isomorphic-dompurify (Icon.tsx's SVG sanitizer) pulls in jsdom, whose
  // own dependency tree (html-encoding-sniffer -> @exodus/bytes, an
  // ESM-only package) fails CommonJS interop when Turbopack bundles it
  // into the deployed serverless function — confirmed via Vercel's
  // runtime logs: every background ISR/on-demand regeneration of "/"
  // threw "Failed to load external module jsdom... ERR_REQUIRE_ESM" and
  // silently kept serving the last successfully-built page forever. This
  // is what actually caused every prior content-staleness symptom this
  // session, not the revalidation/caching code itself, which was already
  // correct by this point. Excluding it from bundling makes Next require()
  // it natively at runtime instead, avoiding the broken bundled interop.
  serverExternalPackages: ["jsdom"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
