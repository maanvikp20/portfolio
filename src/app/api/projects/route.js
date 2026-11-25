import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Project from "@/src/models/Project";
import {
  pick,
  slugify,
  uniqueSlug,
  requireAdmin,
  errorResponse,
} from "@/src/lib/routeHelpers";

// the only fields a client is allowed to set
const PROJECT_FIELDS = [
  "title",
  "slug",
  "description",
  "content",
  "category",
  "status",
  "repoLink",
  "liveLink",
  "coverImage",
  "tags",
];

// create a project
export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    await connectDB();
    const data = pick(await req.json(), PROJECT_FIELDS);

    if (typeof data.category === "string")
      data.category = data.category.toLowerCase().trim();

    // slug comes from the title unless one was given, and is always unique
    data.slug = await uniqueSlug(
      Project,
      slugify(data.slug || data.title || ""),
    );

    const doc = await Project.create(data);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

// update a project by id
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

    const data = pick(await req.json(), PROJECT_FIELDS);

    if (typeof data.category === "string")
      data.category = data.category.toLowerCase().trim();

    // the slug (and so the project's URL) only changes if one is sent explicitly
    if (data.slug) {
      data.slug = await uniqueSlug(Project, slugify(data.slug), id);
    } else {
      delete data.slug;
    }

    const updatedDoc = await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc)
      return NextResponse.json(
        { error: "No document matched that ID" },
        { status: 404 },
      );

    return NextResponse.json(
      { success: true, data: updatedDoc },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

// delete a project by id
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

    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json(
        { error: "No document matched that ID" },
        { status: 404 },
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
