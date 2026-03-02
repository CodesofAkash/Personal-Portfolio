// /**
//  * Cloudinary utility for optimized image delivery
//  * Replace CLOUD_NAME with your actual Cloudinary cloud name
//  */

// const CLOUD_NAME = "YOUR_CLOUD_NAME"; // 👈 Replace this with your cloud name e.g. "dxxxxxxxx"
// const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// /**
//  * Generate an optimized Cloudinary image URL
//  * @param {string} publicId - The public ID of the image in Cloudinary (e.g. "portfolio/hero-bg")
//  * @param {object} options - Transformation options
//  * @param {number} options.width - Target width in pixels
//  * @param {number} options.height - Target height in pixels
//  * @param {string} options.crop - Crop mode: "fill" | "fit" | "scale" | "thumb" (default: "fill")
//  * @param {string} options.quality - Quality: "auto" | "auto:best" | "auto:low" | 1-100 (default: "auto")
//  * @param {string} options.format - Format: "auto" | "webp" | "avif" | "png" (default: "auto")
//  * @param {string} options.gravity - Gravity for crop: "auto" | "face" | "center" (default: "auto")
//  * @returns {string} Optimized Cloudinary URL
//  *
//  * @example
//  * // Hero background - full width, auto format/quality
//  * cloudinaryUrl("portfolio/hero-bg", { width: 1920, height: 1080 })
//  *
//  * // Tech icon - small square
//  * cloudinaryUrl("portfolio/tech/reactjs", { width: 64, height: 64, crop: "fit" })
//  *
//  * // Project screenshot - card size
//  * cloudinaryUrl("portfolio/projects/twitch-clone", { width: 600, height: 400 })
//  */
// export const cloudinaryUrl = (publicId, options = {}) => {
//   const {
//     width,
//     height,
//     crop = "fill",
//     quality = "auto",
//     format = "auto",
//     gravity = "auto",
//   } = options;

//   const transforms = [
//     `f_${format}`,           // Auto-convert to WebP/AVIF based on browser support
//     `q_${quality}`,          // Auto compress without visible quality loss
//     width && `w_${width}`,
//     height && `h_${height}`,
//     (width || height) && `c_${crop}`,
//     gravity && `g_${gravity}`,
//   ]
//     .filter(Boolean)
//     .join(",");

//   return `${BASE_URL}/${transforms}/${publicId}`;
// };

// /**
//  * Prebuilt helpers for common use cases in this portfolio
//  */

// // Hero background image - large, full width
// export const heroImage = (publicId) =>
//   cloudinaryUrl(publicId, { width: 1920, height: 1080, quality: "auto:best" });

// // Service/role icons - small square icons
// export const serviceIcon = (publicId) =>
//   cloudinaryUrl(publicId, { width: 200, height: 200, crop: "fit", format: "auto" });

// // Tech stack icons - small square, transparent-friendly
// export const techIcon = (publicId) =>
//   cloudinaryUrl(publicId, { width: 128, height: 128, crop: "fit", format: "auto" });

// // Project screenshots - card thumbnails
// export const projectImage = (publicId) =>
//   cloudinaryUrl(publicId, { width: 600, height: 400, crop: "fill" });

// // Profile/avatar photo
// export const avatarImage = (publicId) =>
//   cloudinaryUrl(publicId, { width: 400, height: 400, crop: "fill", gravity: "face" });

// // Experience / company logos - square logos
// export const logoImage = (publicId) =>
//   cloudinaryUrl(publicId, { width: 100, height: 100, crop: "fit", format: "auto" });



/**
 * Cloudinary utility for optimized image delivery
 * Falls back to a placeholder if cloud name isn't set or image fails to load
 */

const CLOUD_NAME = null; // 👈 Replace with your Cloudinary cloud name e.g. "dxxxxxxxx"

const BASE_URL = CLOUD_NAME
  ? `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`
  : null;

/**
 * Generate an optimized Cloudinary URL, or null if not configured
 */
export const cloudinaryUrl = (publicId, options = {}) => {
  if (!BASE_URL) return null; // triggers fallback in <CloudImage>

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
  } = options;

  const transforms = [
    `f_${format}`,
    `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    (width || height) && `c_${crop}`,
    gravity && `g_${gravity}`,
  ]
    .filter(Boolean)
    .join(",");

  return `${BASE_URL}/${transforms}/${publicId}`;
};

// Prebuilt helpers
export const heroImage    = (id) => cloudinaryUrl(id, { width: 1920, height: 1080, quality: "auto:best" });
export const serviceIcon  = (id) => cloudinaryUrl(id, { width: 200,  height: 200,  crop: "fit" });
export const techIcon     = (id) => cloudinaryUrl(id, { width: 128,  height: 128,  crop: "fit" });
export const projectImage = (id) => cloudinaryUrl(id, { width: 600,  height: 400,  crop: "fill" });
export const avatarImage  = (id) => cloudinaryUrl(id, { width: 400,  height: 400,  crop: "fill", gravity: "face" });
export const logoImage    = (id) => cloudinaryUrl(id, { width: 100,  height: 100,  crop: "fit" });