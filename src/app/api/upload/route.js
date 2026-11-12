import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/src/lib/routeHelpers";

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// no SVG on purpose: SVG files can carry scripts
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const MAX_BYTES = 4 * 1024 * 1024; // Vercel rejects request bodies over 4.5 MB

export async function POST(req) {
  // Ensure admin only access
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (
      !file ||
      typeof file === "string" ||
      typeof file.arrayBuffer !== "function"
    ) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, GIF or AVIF images are allowed." },
        { status: 415 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image is too large (max 4 MB)." },
        { status: 413 },
      );
    }

    // Convert file to buffer for Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary (it also rejects anything that isn't a real image)
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "portfolio_workspace", // creates/uses this folder in Cloudinary
            resource_type: "image",
            allowed_formats: ["jpg", "png", "webp", "gif", "avif"],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    // Return secure URL of uploaded image
    return NextResponse.json(
      {
        success: true,
        url: uploadResult.secure_url,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
