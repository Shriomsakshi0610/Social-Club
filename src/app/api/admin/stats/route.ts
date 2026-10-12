import { NextResponse } from "next/server";
import { getAdminDashboardStats } from "@/lib/data-store";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const stats = await getAdminDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
