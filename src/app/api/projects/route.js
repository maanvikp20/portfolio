import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/src/lib/verifyToken";
import Project from "@/src/models/Project";
import connectDB from "@/src/lib/mongodb";

// create project
export async function POST(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    const data = await req.json();
    
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    
    const doc = await Project.create(data);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// update project
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

    const updatedDoc = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: updatedDoc }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// delete project
export async function DELETE(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing document parameter: id" }, { status: 400 });
    }
    
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}