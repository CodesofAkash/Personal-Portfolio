export const C = {
  violet: "#7c3aed",
  teal: "#0d9488",
  amber: "#d97706",
  rose: "#e11d48",
  white: "#f8fafc",
  dim: "#94a3b8",
  bg: "#050816",
  card: "#0f172a",
  border: "rgba(148,163,184,0.08)",
};

// Text using these accents never sits directly on C.bg — it's always inside
// a badge/card whose actual background is a translucent accent tint (up to
// 25% alpha, see ProjectsGrid's "Click to expand" pill) composited over
// C.card, which is LIGHTER than C.bg. That composite is the worst case for
// contrast, so every value here is picked to clear 4.5:1 (AA, small text)
// against accent-at-25%-over-C.card, not against the raw page background —
// an earlier pass only checked against C.bg and still failed in production.
export const TEXT_SAFE: Record<string, string> = {
  [C.violet]: "#a67af3",
  [C.teal]: "#3faaa1",
  [C.amber]: "#de8824",
  [C.rose]: "#ea6280",
};
export const textSafe = (color: string) => TEXT_SAFE[color] ?? color;
