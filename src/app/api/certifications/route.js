import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/src/lib/verifyToken";
import Certification from "@/src/models/Certification";
import connectDB from "@/src/lib/mongodb";

// create certification
export async function POST(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    const data = await req.json();
    
    const doc = await Certification.create(data);
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// update certification
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

    const updatedDoc = await Certification.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: updatedDoc }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// delete certification
export async function DELETE(req) {
  try {
    verifyAdminToken(req);
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing document parameter: id" }, { status: 400 });
    }
    
    await Certification.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}