// /**
//  * AWS CloudFront CDN utility for 3D model assets
//  * Replace CLOUDFRONT_DOMAIN with your actual CloudFront domain
//  *
//  * Your CloudFront domain looks like: d1234abcd5678.cloudfront.net
//  */

// const CLOUDFRONT_DOMAIN = "YOUR_CLOUDFRONT_DOMAIN"; // 👈 Replace e.g. "d1234abcd5678.cloudfront.net"
// const CDN_BASE = `https://${CLOUDFRONT_DOMAIN}`;

// /**
//  * Get a CloudFront URL for a 3D model file
//  * @param {string} path - Path to the file as stored in S3 (e.g. "desktop_pc/scene.gltf")
//  * @returns {string} Full CloudFront URL
//  *
//  * @example
//  * cdnUrl("desktop_pc/scene.gltf")
//  * // → "https://d1234abcd5678.cloudfront.net/desktop_pc/scene.gltf"
//  *
//  * cdnUrl("planet/scene.gltf")
//  * // → "https://d1234abcd5678.cloudfront.net/planet/scene.gltf"
//  */
// export const cdnUrl = (path) => `${CDN_BASE}/${path}`;

// /**
//  * Prebuilt model URL helpers
//  * These match the folder structure you uploaded to S3
//  */
// export const MODELS = {
//   desktopPc: cdnUrl("desktop_pc/scene.gltf"),
//   planet: cdnUrl("planet/scene.gltf"),
// };


/**
 * AWS CloudFront CDN utility for 3D model assets
 *
 * Falls back to local public/ folder automatically if CloudFront
 * domain isn't configured yet — so the app never breaks during development.
 */

const CLOUDFRONT_DOMAIN = null; // 👈 Replace with "d1234abcd5678.cloudfront.net" once AWS verifies

export const cdnUrl = (path) => {
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${path}`;
  }
  return `/${path}`; // Local fallback — uses public/ folder
};

export const MODELS = {
  desktopPc: cdnUrl("desktop_pc/scene.gltf"),
  planet:    cdnUrl("planet/scene.gltf"),
};