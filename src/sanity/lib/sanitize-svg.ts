import "server-only";
import sanitizeHtml from "sanitize-html";

const TAGS = [
  "svg", "g", "defs", "symbol", "use", "title", "desc", "path", "circle", "ellipse", "line",
  "polyline", "polygon", "rect", "text", "tspan", "marker", "linearGradient", "radialGradient",
  "stop", "clipPath", "mask", "pattern", "filter", "feBlend", "feColorMatrix",
  "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting",
  "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB",
  "feFuncG", "feFuncR", "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology", "feOffset",
  "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence",
]; // no script, style, foreignObject, a, image, feImage, animate/set

// Geometry and presentation only — no on* handlers, no `style`.
const ATTRIBUTES = [
  "id", "class", "xmlns", "xmlns:xlink", "viewBox", "preserveAspectRatio", "width", "height",
  "x", "y", "x1", "x2", "y1", "y2", "cx", "cy", "r", "rx", "ry", "d", "points", "transform",
  "href", "xlink:href", "role", "aria-hidden", "aria-label", "fill", "fill-rule",
  "fill-opacity", "clip-rule", "clip-path", "mask", "filter", "stroke", "stroke-width",
  "stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-opacity", "opacity",
  "offset", "stop-color", "stop-opacity", "gradientUnits", "gradientTransform", "in", "in2",
  "result", "stdDeviation", "flood-color", "flood-opacity",
];

// References may only point inside the SVG: an external href/url() fetches, javascript: runs.
function keepLocalReferences(tagName: string, attribs: sanitizeHtml.Attributes) {
  const kept: sanitizeHtml.Attributes = {};
  for (const [name, value] of Object.entries(attribs)) {
    if ((name === "href" || name === "xlink:href") && !value.trim().startsWith("#")) continue;
    if (/url\s*\(/i.test(value) && !/url\s*\(\s*['"]?#/i.test(value)) continue;
    kept[name] = value;
  }
  return { tagName, attribs: kept };
}

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: TAGS,
  allowedAttributes: { "*": ATTRIBUTES },
  allowedSchemes: [],
  transformTags: { "*": keepLocalReferences },
  // Keep camelCase (viewBox, linearGradient) — lowercased, the SVG breaks.
  parser: { lowerCaseTags: false, lowerCaseAttributeNames: false },
};

// Every `iconSvg` in a query result, sanitised once; called from sanityFetch on every fetch's
// result, so no individual query helper can forget it (AK-SAN-072: isomorphic-dompurify crashed
// Vercel's regeneration; dompurify+linkedom silently stopped sanitising at all — this replaced
// both, verified against real XSS probes, not assumed).
export function sanitizeIconSvgs<T>(value: T): T {
  if (Array.isArray(value)) return value.map(sanitizeIconSvgs) as T;
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      key === "iconSvg" && typeof entry === "string"
        ? sanitizeHtml(entry, OPTIONS)
        : sanitizeIconSvgs(entry),
    ]),
  ) as T;
}
