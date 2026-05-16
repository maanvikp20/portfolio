import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/src/lib/verifyToken";
import connectDB from "@/src/lib/mongodb";
import Blog from "@/src/models/Blog";
import User from "@/src/models/User";

// create a blog post
export async function POST(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    const data = await req.json();

    const adminUser =
      (await User.findOne({ email: "maanvik@uiuc.edu" })) ||
      (await User.findOne());
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin profile user registry missing." },
        { status: 500 },
      );
    }
    data.author = adminUser._id;

    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    }

    const doc = await Blog.create(data);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// update a blog post by id
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

    const adminUser =
      (await User.findOne({ email: "maanvik@uiuc.edu" })) ||
      (await User.findOne());
    if (adminUser) data.author = adminUser._id;

    if (data.title) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
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

    return NextResponse.json(
      { success: true, data: updatedDoc },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// delete a blog post by id
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

    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
