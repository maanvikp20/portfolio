import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/src/lib/verifyToken";
import connectDB from "@/src/lib/mongodb";
import Skill from "@/src/models/Skill";

// create skill
export async function POST(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    const data = await req.json();
    
    const doc = await Skill.create(data);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// update skill
export async function PUT(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing skill parameter: id" }, { status: 400 });
    }

    const updatedDoc = await Skill.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: updatedDoc }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// delete skill
export async function DELETE(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing skill parameter: id" }, { status: 400 });
    }
    
    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}