// Cloudinary can resize and re-encode images on the fly. Adding "f_auto,q_auto,w_N"
// to the URL serves a right-sized WebP/AVIF instead of the full original upload.
// Non-Cloudinary URLs are returned unchanged.
export function optimizeImage(url, width = 800) {
  if (typeof url !== "string") return url;
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1 || !url.includes("res.cloudinary.com")) return url;
  const rest = url.slice(i + marker.length);
  // already has transformations (anything before the version "v123/"): leave it alone
  if (/^[a-z]_|^[a-z]+_[^/]+,/.test(rest)) return url;
  return `${url.slice(0, i + marker.length)}f_auto,q_auto,w_${width}/${rest}`;
}