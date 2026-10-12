import { NextRequest, NextResponse } from "next/server";
import { createBooking, getAllBookings } from "@/lib/data-store";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.event_id || !body.user_name || !body.user_email || !body.user_phone) {
      return NextResponse.json(
        { error: "Please fill in all mandatory personal details." },
        { status: 400 }
      );
    }

    if (!body.num_participants || body.num_participants < 1) {
      return NextResponse.json(
        { error: "At least 1 participant is required." },
        { status: 400 }
      );
    }

    if (!body.emergency_contact_name || !body.emergency_contact_phone) {
      return NextResponse.json(
        { error: "Emergency contact name and phone number are required." },
        { status: 400 }
      );
    }

    if (!body.terms_accepted || !body.safety_waiver_accepted) {
      return NextResponse.json(
        { error: "You must accept the Social Club terms and safety waiver." },
        { status: 400 }
      );
    }

    const result = await createBooking(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, booking: result.booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const bookingStatus = searchParams.get("bookingStatus") || undefined;
    const search = searchParams.get("search") || undefined;

    const bookings = await getAllBookings({ eventId, paymentStatus, bookingStatus, search });
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
