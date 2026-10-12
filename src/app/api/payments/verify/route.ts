import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { confirmBookingPayment } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking_ref, razorpay_order_id, razorpay_payment_id, razorpay_signature, method } = body;

    if (!booking_ref || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters" },
        { status: 400 }
      );
    }

    // Cryptographic / Test signature validation on backend
    const isValid = verifyPaymentSignature({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      console.warn("Payment signature verification failed for ref:", booking_ref);
      return NextResponse.json(
        { error: "Payment verification failed: invalid signature" },
        { status: 400 }
      );
    }

    // Confirm the booking and allocate seats
    const confirmResult = await confirmBookingPayment({
      booking_ref,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      method: method || "Verified Razorpay"
    });

    if (!confirmResult.success) {
      return NextResponse.json({ error: confirmResult.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and booking confirmed!",
      booking: confirmResult.booking
    });
  } catch (error) {
    console.error("POST /api/payments/verify error:", error);
    return NextResponse.json({ error: "Internal payment processing error" }, { status: 500 });
  }
}
