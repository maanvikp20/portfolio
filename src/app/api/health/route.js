import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/src/lib/mongodb";

export async function GET() {
    try {
        await connectDB();
        
        // debug testing stuff since mongo kinda weird
        const dbStatus = mongoose.connection.readyState;
        const statusLabels = ["Disconnected", "Connected", "Connecting", "Disconnecting"];

        // connected
        if (dbStatus === 1) {
            return NextResponse.json({
                status: "healthy",
                database: statusLabels[dbStatus],
                timestamp: new Date().toISOString()
            }, { status: 200 });
        } else {
            // not connected
            return NextResponse.json({
                status: "unhealthy",
                database: statusLabels[dbStatus]
            }, { status: 500 });
        }

    // very bad connection error
    } catch (error) {
        return NextResponse.json({
            status: "error",
            database: "Connection Failed",
            error: error.message
        }, { status: 500 });
    }
}