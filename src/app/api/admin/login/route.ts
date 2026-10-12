import { NextRequest, NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    const adminKey = process.env.ADMIN_SECRET_KEY || "socialclub2026";

    if (!password || password.trim() !== adminKey) {
      return NextResponse.json({ error: "Invalid admin passcode" }, { status: 401 });
    }

    await setAdminSessionCookie();
    return NextResponse.json({ success: true, message: "Admin authenticated" });
  } catch (error) {
    console.error("POST /api/admin/login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
