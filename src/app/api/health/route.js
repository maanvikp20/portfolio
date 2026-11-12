import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/src/lib/mongodb";

// public health check: reports up/down only, never internal details
export async function GET() {
  try {
    await connectDB();

    // 1 = connected
    if (mongoose.connection.readyState === 1) {
      return NextResponse.json({ status: "healthy" }, { status: 200 });
    }

    return NextResponse.json({ status: "unhealthy" }, { status: 503 });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ status: "unhealthy" }, { status: 503 });
  }
}
