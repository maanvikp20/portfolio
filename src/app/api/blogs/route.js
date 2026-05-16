import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/src/lib/verifyToken";
import Blog from "@/src/models/Blog";
import connectDB from "@/src/lib/mongodb";

// create blog post
export async function POST(req) {
  try {
    verifyAdminToken(req); // req admin
    await connectDB();
    const data = await req.json();
    
    // generate slug from title if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    
    // create post
    const doc = await Blog.create(data);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// Update post
export async function PUT(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing document parameter: id" }, { status: 400 });
    }

    if (data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    const updatedDoc = await Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: updatedDoc }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// delete post
export async function DELETE(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing document parameter: id" }, { status: 400 });
    }
    
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}