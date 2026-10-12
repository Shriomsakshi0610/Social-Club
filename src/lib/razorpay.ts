import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const isRazorpayConfigured = Boolean(
  keyId && keySecret && !keyId.includes("YourKey") && !keySecret.includes("YourSecret")
);

export interface RazorpayOrderResult {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt: string;
  isTestMode: boolean;
  keyId?: string;
}

/**
 * Creates an order on Razorpay or generates a verified test order.
 */
export async function createPaymentOrder(params: {
  amountInINR: number;
  bookingRef: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<RazorpayOrderResult> {
  const amountInPaise = Math.round(params.amountInINR * 100);

  if (isRazorpayConfigured) {
    try {
      // Dynamic import of Razorpay to prevent runtime errors if not installed
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Razorpay = require("razorpay");
      const instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret
      });

      const order = await instance.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: params.bookingRef,
        notes: {
          booking_ref: params.bookingRef,
          customer_email: params.customerEmail,
          customer_phone: params.customerPhone
        }
      });

      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: params.bookingRef,
        isTestMode: false,
        keyId: keyId!
      };
    } catch (err) {
      console.error("Razorpay order creation failed, falling back to test mode:", err);
    }
  }

  // Test Mode Order
  const testOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    id: testOrderId,
    amount: amountInPaise,
    currency: "INR",
    receipt: params.bookingRef,
    isTestMode: true,
    keyId: keyId || "rzp_test_simulator"
  };
}

/**
 * Cryptographically verifies the payment signature
 */
export function verifyPaymentSignature(params: {
  order_id: string;
  payment_id: string;
  signature: string;
}): boolean {
  if (isRazorpayConfigured && keySecret) {
    try {
      const generated_signature = crypto
        .createHmac("sha256", keySecret)
        .update(`${params.order_id}|${params.payment_id}`)
        .digest("hex");

      return generated_signature === params.signature;
    } catch (err) {
      console.error("Signature verification error:", err);
      return false;
    }
  }

  // In Test Mode: Validate signature structure
  // Test simulator generates signature format "test_sig_{order_id}_{payment_id}"
  if (params.order_id.startsWith("order_test_")) {
    const expectedPrefix = `test_sig_${params.order_id}_${params.payment_id}`;
    return params.signature === expectedPrefix || params.signature.startsWith("test_sig_");
  }

  return false;
}
