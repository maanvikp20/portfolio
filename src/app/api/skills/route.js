import { NextResponse } from "next/server";
import { revalidateContent } from "@/src/lib/cache";
import connectDB from "@/src/lib/mongodb";
import Skill from "@/src/models/Skill";
import { pick, requireAdmin, errorResponse } from "@/src/lib/routeHelpers";

// the only fields a client is allowed to set
const SKILL_FIELDS = ["name", "percent", "order"];

// create a skill
export async function POST(req) {
  const auth = requireAdmin(req);
  if (auth.response) return auth.response;

  try {
    await connectDB();
    const data = pick(await req.json(), SKILL_FIELDS);

    const doc = await Skill.create(data);
    revalidateContent();
    return NextResponse.json({ success: true, data: doc }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

// update a skill by id
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

    const data = pick(await req.json(), SKILL_FIELDS);

    const updatedDoc = await Skill.findByIdAndUpdate(id, data, {
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

// delete a skill by id
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

    const deleted = await Skill.findByIdAndDelete(id);
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
