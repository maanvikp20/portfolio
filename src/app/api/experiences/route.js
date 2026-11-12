import { NextResponse } from "next/server";
import {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/src/controllers/experienceController";
import { requireAdmin, errorResponse } from "@/src/lib/routeHelpers";

const NOT_FOUND = "Experience record not found.";

// the admin form sends role/duration; the model stores title/startDate.
// only fields that were actually sent are included, so edits never reset the rest.
function normalize(body) {
  const data = {};
  if (body?.role !== undefined) data.title = body.role;
  if (body?.duration !== undefined) data.startDate = body.duration;
  if (body?.company !== undefined) data.company = body.company;
  if (body?.location !== undefined) data.location = body.location;
  if (body?.description !== undefined) data.description = body.description;
  if (body?.type !== undefined) data.type = body.type;
  if (body?.order !== undefined && body.order !== "")
    data.order = Number(body.order) || 0;
  return data;
}

// public: anyone can read the experience list
export async function GET() {
  try {
    const data = await getAllExperiences();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Experiences fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const newExp = await createExperience(normalize(body));
    return NextResponse.json({ data: newExp }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Document ID is required." },
        { status: 400 },
      );

    const body = await request.json();
    const updatedExp = await updateExperience(id, normalize(body));
    return NextResponse.json({ data: updatedExp }, { status: 200 });
  } catch (error) {
    if (error.message === NOT_FOUND)
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
    return errorResponse(error);
  }
}

export async function DELETE(request) {
  const auth = requireAdmin(request);
  if (auth.response) return auth.response;

  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Document ID is required." },
        { status: 400 },
      );

    await deleteExperience(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error.message === NOT_FOUND)
      return NextResponse.json({ error: NOT_FOUND }, { status: 404 });
    return errorResponse(error);
  }
}
