import { NextResponse } from "next/server";
import { loginAdmin } from "@/src/controllers/authController";
import { rateLimit, getClientIp } from "@/src/lib/rateLimit";

// admin login route
export async function POST(req) {
  try {
    // 10 attempts per 15 minutes per IP
    const limit = rateLimit(`login:${getClientIp(req)}`, {
      limit: 10,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
      );
    }

    const body = await req.json().catch(() => null);
    const email = body?.email;
    const password = body?.password;

    // only plain strings allowed (blocks query-operator objects like {"$gt": ""})
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

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
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
