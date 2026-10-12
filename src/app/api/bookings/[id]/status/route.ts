import { NextRequest, NextResponse } from "next/server";
import { updateBookingStatus } from "@/lib/data-store";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // If updating payment_status or general booking_status, verify admin
    if (body.payment_status || (body.booking_status && !body.is_cancellation_request)) {
      const isAdmin = await verifyAdminSession();
      if (!isAdmin) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
      }
    }

    const updated = await updateBookingStatus(id, {
      payment_status: body.payment_status,
      booking_status: body.booking_status,
      cancellation_requested: body.cancellation_requested,
      cancellation_reason: body.cancellation_reason
    });

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("PATCH /api/bookings/[id]/status error:", error);
    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
  }
}
