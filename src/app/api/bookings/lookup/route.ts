import { NextRequest, NextResponse } from "next/server";
import { lookupBooking } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking_ref, contact } = body;

    if (!booking_ref || !contact) {
      return NextResponse.json(
        { error: "Booking reference and email or phone number are required." },
        { status: 400 }
      );
    }

    const booking = await lookupBooking(booking_ref, contact);

    if (!booking) {
      return NextResponse.json(
        { error: "No matching booking found. Please check your reference code and email/phone." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("POST /api/bookings/lookup error:", error);
    return NextResponse.json({ error: "Failed to look up booking" }, { status: 500 });
  }
}
