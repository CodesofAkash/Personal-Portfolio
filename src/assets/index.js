/**
 * Asset exports
 *
 * WHAT STAYS HERE (local imports — used in UI components directly):
 * - logo, github icon, menu/close icons → these are tiny SVGs, no point CDN-ing them
 *
 * WHAT MOVED TO CLOUDINARY (see src/constants/index.js):
 * - Tech stack icons    → techIcon("portfolio/tech/...")
 * - Service/role icons  → serviceIcon("portfolio/services/...")
 * - Project screenshots → projectImage("portfolio/projects/...")
 * - Hero background     → heroImage("portfolio/hero-bg")
 *
 * WHAT USES CLEARBIT (no upload needed):
 * - Institution logos in experience section → logo.clearbit.com/{domain}
 *
 * HOW TO ADD A NEW LOCAL ASSET:
 * 1. Drop the file in src/assets/
 * 2. Import it below
 * 3. Add it to the export block
 *
 * HOW TO ADD A NEW CLOUDINARY ASSET:
 * 1. Upload to Cloudinary
 * 2. Use the appropriate helper in src/lib/cloudinary.js
 * 3. Reference it directly in src/constants/index.js
 */

// UI chrome — stays local (tiny files, no benefit to CDN)
import logo  from "./logo.svg";
import github from "./github.png";
import menu  from "./menu.svg";
import close from "./close.svg";

export {
  logo,
  github,
  menu,
  close,
};