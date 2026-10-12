import { NextRequest, NextResponse } from "next/server";
import { lookupBooking } from "@/lib/data-store";
import { createPaymentOrder, isRazorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking_ref, contact } = body;

    if (!booking_ref) {
      return NextResponse.json({ error: "Booking reference is required" }, { status: 400 });
    }

    // Lookup the booking
    const booking = await lookupBooking(booking_ref, contact || "");
    if (!booking) {
      return NextResponse.json({ error: "Booking not found or contact does not match" }, { status: 404 });
    }

    if (booking.booking_status === "confirmed" && booking.payment_status === "paid") {
      return NextResponse.json({ error: "This booking has already been paid and confirmed." }, { status: 400 });
    }

    if (booking.total_amount <= 0) {
      return NextResponse.json({ error: "This is a free event; no payment required." }, { status: 400 });
    }

    const order = await createPaymentOrder({
      amountInINR: booking.total_amount,
      bookingRef: booking.booking_ref,
      customerEmail: booking.user_email,
      customerPhone: booking.user_phone
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingRef: booking.booking_ref,
      isTestMode: order.isTestMode,
      isConfigured: isRazorpayConfigured,
      keyId: order.keyId
    });
  } catch (error) {
    console.error("POST /api/payments/create-order error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
