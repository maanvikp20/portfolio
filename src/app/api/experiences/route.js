import { NextResponse } from "next/server";
import { 
  getAllExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience 
} from "@/src/controllers/experienceController";

export async function GET() {
  try {
    const data = await getAllExperiences();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const normalizedData = {
      title: body.role,
      startDate: body.duration,
      company: body.company,
      description: body.description,
      type: body.type || "job",
      order: Number(body.order) || 0
    };

    const newExp = await createExperience(normalizedData);
    return NextResponse.json({ data: newExp }, { status: 201 });
  } catch (error) {
    console.error("Mongoose Save Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save experience asset" }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Document ID is required." }, { status: 400 });

    const body = await request.json();

    const normalizedData = {
      title: body.role,
      startDate: body.duration,
      company: body.company,
      description: body.description,
      type: body.type,
      order: Number(body.order) || 0
    };

    const updatedExp = await updateExperience(id, normalizedData);
    return NextResponse.json({ data: updatedExp }, { status: 200 });
  } catch (error) {
    console.error("Mongoose Update Error:", error);
    return NextResponse.json({ error: error.message || "Failed to modify experience" }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Document ID is required." }, { status: 400 });

    await deleteExperience(id);
    return NextResponse.json({ success: true, message: "Asset purged from database." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete experience" }, { status: 400 });
  }
}