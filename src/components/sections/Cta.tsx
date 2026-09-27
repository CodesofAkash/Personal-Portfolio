import Link from "next/link";
import type { ResolvedCtaBtn } from "@/sanity/lib/types";
import { C } from "./colors";

interface CtaProps {
  cta?: ResolvedCtaBtn;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "px-6 py-2.5 text-sm",
  md: "px-8 py-3 text-[15px]",
  lg: "px-10 py-4 text-lg",
};

// One shared button, both link variants resolved to { href, target } before
// this component ever sees them (AK-CMS-025).
const Cta = ({ cta, size = "md" }: CtaProps) => {
  if (!cta?.text) return null;

  const external = cta.target === "_blank";
  const className = `inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${SIZES[size]}`;
  const style =
    cta.variant === "secondary"
      ? { color: C.white, background: "rgba(124,58,237,0.1)", border: `1px solid ${C.violet}50` }
      : { color: "#fff", background: `linear-gradient(135deg,${C.violet},${C.teal})` };

  if (external) {
    return (
      <a href={cta.href} target="_blank" rel="noreferrer" className={className} style={style}>
        {cta.text}
      </a>
    );
  }

  return (
    <Link href={cta.href} className={className} style={style}>
      {cta.text}
    </Link>
  );
};

export default Cta;
