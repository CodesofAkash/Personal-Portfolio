import Link from "next/link";

const C = {
  violet: "#7c3aed",
  teal: "#0d9488",
  white: "#f8fafc",
  dim: "#94a3b8",
  bg: "#050816",
};

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6"
      style={{ background: C.bg, color: C.white, minHeight: "calc(100vh - 68px)" }}
    >
      <span
        className="font-black leading-none mb-4"
        style={{ fontSize: "clamp(4rem,12vw,10rem)", fontFamily: "'Bebas Neue','Impact',sans-serif", color: C.violet }}
      >
        404
      </span>
      <h1 className="font-bold text-2xl mb-3" style={{ color: C.white }}>
        Page not found.
      </h1>
      <p className="max-w-md mb-8" style={{ color: C.dim }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
        style={{ background: `linear-gradient(135deg,${C.violet},${C.teal})` }}
      >
        Back to home
      </Link>
    </div>
  );
}
