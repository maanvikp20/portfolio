import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/src/lib/verifyToken";

// copy only the allowed keys from an object (blocks mass assignment)
export function pick(source, keys) {
  const out = {};
  for (const key of keys) {
    if (source && source[key] !== undefined) out[key] = source[key];
  }
  return out;
}

// "My First Post!" -> "my-first-post"
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// append -2, -3, ... until the slug is unused (ignoring the record being edited)
export async function uniqueSlug(Model, base, excludeId) {
  const root = base || "untitled";
  let slug = root;
  let n = 2;
  while (
    await Model.exists({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    slug = `${root}-${n++}`;
  }
  return slug;
}

// returns { admin } when logged in, or { response } with a 401 to send back
export function requireAdmin(req) {
  try {
    return { admin: verifyAdminToken(req) };
  } catch {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
}

// turns a thrown error into a sensible response without leaking internals
export function errorResponse(error) {
  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error?.code === 11000) {
    return NextResponse.json(
      { error: "A record with that unique value already exists." },
      { status: 409 },
    );
  }
  console.error("API error:", error);
  return NextResponse.json({ error: "Server error." }, { status: 500 });
}