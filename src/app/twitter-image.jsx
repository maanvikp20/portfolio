import { renderOgImage } from "@/src/lib/ogImage";

export const alt = "Maanvik Poddar — portfolio and blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
