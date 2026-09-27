import Link from "next/link";
import { Poppins } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/sanity/lib/queries";

// An unmatched URL belongs to no route group, so it reaches no root layout
// and this file has to supply <html> and <body> itself.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const C = {
  violet: "#7c3aed",
  teal: "#0d9488",
  white: "#f8fafc",
  dim: "#94a3b8",
  bg: "#050816",
};

export default async function NotFound() {
  const settings = await getSettings();
  const copy = settings?.notFound;

  return (
    <html lang="en" className={poppins.variable}>
      <body style={{ background: C.bg }}>
        <div
          className="flex flex-col items-center justify-center text-center px-6"
          style={{ background: C.bg, color: C.white, minHeight: "100vh" }}
        >
          <span
            className="font-black leading-none mb-4"
            style={{
              fontSize: "clamp(4rem,12vw,10rem)",
              fontFamily: "'Bebas Neue','Impact',sans-serif",
              color: C.violet,
            }}
          >
            404
          </span>
          <h1 className="font-bold text-2xl mb-3" style={{ color: C.white }}>
            {copy?.heading || "Page not found."}
          </h1>
          {copy?.message && (
            <p className="max-w-md mb-8" style={{ color: C.dim }}>
              {copy.message}
            </p>
          )}
          <Link
            href="/"
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{ background: `linear-gradient(135deg,${C.violet},${C.teal})` }}
          >
            {copy?.linkLabel || "Back to home"}
          </Link>
        </div>
      </body>
    </html>
  );
}
