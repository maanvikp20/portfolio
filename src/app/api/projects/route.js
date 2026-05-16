import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/src/lib/verifyToken";
import connectDB from "@/src/lib/mongodb";
import Project from "@/src/models/Project";

// create a project
export async function POST(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    const data = await req.json();

    if (data.category) data.category = data.category.toLowerCase().trim();

    // create slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    }

    const doc = await Project.create(data);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// update a project by id
export async function PUT(req) {
  try {
    verifyAdminToken(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id)
      return NextResponse.json(
        { error: "Missing parameter: id" },
        { status: 400 },
      );
    if (data.category) data.category = data.category.toLowerCase().trim();

    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// delete a project by id
export async function DELETE(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Missing parameter: id" },
        { status: 400 },
      );

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
