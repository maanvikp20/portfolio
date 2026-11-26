import { NextResponse } from "next/server";
import { revalidateContent } from "@/src/lib/cache";
import connectDB from "@/src/lib/mongodb";
import Blog from "@/src/models/Blog";
import {
  pick,
  slugify,
  uniqueSlug,
  requireAdmin,
  errorResponse,
} from "@/src/lib/routeHelpers";

// the only fields a client is allowed to set
const BLOG_FIELDS = [
  "title",
  "slug",
  "content",
  "excerpt",
  "category",
  "status",
  "coverImage",
  "tags",
];

// create a blog post
export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    await connectDB();
    const data = pick(await req.json(), BLOG_FIELDS);

    // slug comes from the title unless one was given, and is always unique
    data.slug = await uniqueSlug(Blog, slugify(data.slug || data.title || ""));

    // author is whoever is logged in
    data.author = auth.admin.userId;

    const doc = await Blog.create(data);
    revalidateContent();
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

// update a blog post by id
export async function PUT(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Missing parameter: id" },
        { status: 400 },
      );

    const data = pick(await req.json(), BLOG_FIELDS);

    // the slug (and so the post's URL) only changes if one is sent explicitly
    if (data.slug) {
      data.slug = await uniqueSlug(Blog, slugify(data.slug), id);
    } else {
      delete data.slug;
    }

    const updatedDoc = await Blog.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc)
      return NextResponse.json(
        { error: "No document matched that ID" },
        { status: 404 },
      );

    revalidateContent();
    return NextResponse.json(
      { success: true, data: updatedDoc },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

// delete a blog post by id
export async function DELETE(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Missing parameter: id" },
        { status: 400 },
      );

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { error: "No document matched that ID" },
        { status: 404 },
      );

    revalidateContent();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
