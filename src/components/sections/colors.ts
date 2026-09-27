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

// violet and rose fail WCAG AA (4.5:1) as small text directly on C.bg —
// 3.50:1 and 4.25:1 respectively. These lightened variants pass (4.60:1,
// 4.69:1) and stay in the same hue. Use for small text (badges, eyebrow
// labels); backgrounds/borders/large headings can keep the saturated
// originals since contrast rules apply to text, not decoration.
export const TEXT_SAFE: Record<string, string> = {
  [C.violet]: "#9058f0",
  [C.rose]: "#e4345a",
};
export const textSafe = (color: string) => TEXT_SAFE[color] ?? color;
