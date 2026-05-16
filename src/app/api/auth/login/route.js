import { NextResponse } from "next/server";
import { loginAdmin } from "@/src/controllers/authController";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const { user, token } = await loginAdmin(email, password);

    const response = NextResponse.json(
      { success: true, user },
      { status: 200 },
    );

    // Set token in HttpOnly cookie for secure storage
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
