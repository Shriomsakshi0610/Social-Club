import { NextRequest, NextResponse } from "next/server";
import { getAllEvents, createEvent } from "@/lib/data-store";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    if (includeDrafts) {
      const isAdmin = await verifyAdminSession();
      if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
    }

    const events = await getAllEvents({ category, search, includeDrafts });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.destination || !body.category) {
      return NextResponse.json({ error: "Title, destination, and category are required" }, { status: 400 });
    }

    const created = await createEvent({
      ...body,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    });

    return NextResponse.json({ success: true, event: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
