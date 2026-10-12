"use client";

import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Smartphone, CreditCard, Landmark, X } from "lucide-react";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onPaymentSuccess: (paymentId: string) => void;
}

export default function RazorpayCheckoutModal({
  isOpen,
  onClose,
  bookingRef,
  totalAmount,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess
}: RazorpayModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("traveler@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setErrorMsg("");

    try {
      // 1. Get or create order from backend
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_ref: bookingRef, contact: customerEmail })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize payment");
      }

      // Check if live Razorpay is active and Razorpay SDK is on window
      if (!orderData.isTestMode && typeof window !== "undefined" && (window as unknown as { Razorpay?: unknown }).Razorpay) {
        // Live Razorpay instance
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "SOCIAL CLUB",
          description: `Booking #${bookingRef}`,
          order_id: orderData.orderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone
          },
          theme: { color: "#143e29" },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                booking_ref: bookingRef,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                method: "Razorpay Live Checkout"
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              onPaymentSuccess(response.razorpay_payment_id);
            } else {
              setErrorMsg(verifyData.error || "Signature verification failed.");
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      }

      // Test Mode Simulator Flow
      const mockPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const mockSignature = `test_sig_${orderData.orderId}_${mockPaymentId}`;

      // Simulate a realistic 1.2s gateway delay
      await new Promise((r) => setTimeout(r, 1200));

      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_ref: bookingRef,
          razorpay_order_id: orderData.orderId,
          razorpay_payment_id: mockPaymentId,
          razorpay_signature: mockSignature,
          method: selectedMethod === "upi" ? `UPI (${upiId})` : selectedMethod === "card" ? "Debit Card" : "Net Banking"
        })
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Payment verification failed.");
      }

      onPaymentSuccess(mockPaymentId);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg((err as Error).message || "An error occurred during payment.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0b2015] border border-[#1b4d36] rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="bg-[#06150e] px-6 py-4 flex items-center justify-between border-b border-[#143e29]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#bbf451] text-[#06150e] flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Razorpay Secure Checkout</h3>
              <p className="text-[11px] text-[#86a394]">Official Gateway Simulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-[#86a394] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount & Order Summary */}
        <div className="p-6 bg-gradient-to-b from-[#0b2015] to-[#071710] space-y-4">
          <div className="p-4 rounded-xl bg-[#06150e] border border-[#143e29] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#86a394] uppercase tracking-wider block">Total Payable</span>
              <span className="text-2xl font-black text-[#bbf451]">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#86a394] uppercase tracking-wider block">Booking Reference</span>
              <span className="text-xs font-mono font-bold text-white bg-[#143e29] px-2 py-0.5 rounded">
                {bookingRef}
              </span>
            </div>
          </div>

          {/* Test Mode Note Banner */}
          <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#bbf451] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Interactive Test Sandbox:</strong> Live keys can be added to <code className="text-[#bbf451]">.env</code>. You can test the end-to-end checkout flow safely right now.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#86a394] block">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod("upi")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                  selectedMethod === "upi"
                    ? "bg-[#143e29] border-[#bbf451] text-[#bbf451] shadow-md shadow-[#bbf451]/10"
                    : "bg-[#06150e] border-[#143e29] text-[#86a394] hover:text-white"
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("card")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                  selectedMethod === "card"
                    ? "bg-[#143e29] border-[#bbf451] text-[#bbf451] shadow-md shadow-[#bbf451]/10"
                    : "bg-[#06150e] border-[#143e29] text-[#86a394] hover:text-white"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("netbanking")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-bold transition-all ${
                  selectedMethod === "netbanking"
                    ? "bg-[#143e29] border-[#bbf451] text-[#bbf451] shadow-md shadow-[#bbf451]/10"
                    : "bg-[#06150e] border-[#143e29] text-[#86a394] hover:text-white"
                }`}
              >
                <Landmark className="w-5 h-5" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* Method Details */}
          {selectedMethod === "upi" && (
            <div className="p-3.5 rounded-xl bg-[#06150e] border border-[#143e29] space-y-2">
              <span className="text-xs text-[#86a394] block">UPI ID / Virtual Payment Address:</span>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0b2015] border border-[#143e29] rounded-lg text-sm text-white focus:outline-none focus:border-[#bbf451]"
              />
              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#86a394]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#bbf451]" /> Supported: Google Pay, PhonePe, Paytm, BHIM
              </div>
            </div>
          )}

          {selectedMethod === "card" && (
            <div className="p-3.5 rounded-xl bg-[#06150e] border border-[#143e29] space-y-2 text-xs text-[#9bb3a6]">
              <div className="flex justify-between items-center text-white">
                <span>Card Number</span>
                <span className="font-mono">•••• •••• •••• 4242</span>
              </div>
              <p className="text-[11px] text-[#86a394]">Sandbox test card automatically authorized.</p>
            </div>
          )}

          {selectedMethod === "netbanking" && (
            <div className="p-3.5 rounded-xl bg-[#06150e] border border-[#143e29] space-y-2 text-xs text-[#9bb3a6]">
              <span>Select Bank: HDFC, ICICI, SBI, Axis, Kotak</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-700/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action button */}
          <button
            type="button"
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-[#bbf451] hover:bg-[#cdf879] active:scale-[0.98] text-[#06150e] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#bbf451]/20 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#06150e] border-t-transparent rounded-full animate-spin"></span>
                Processing Payment...
              </span>
            ) : (
              <span>Pay ₹{totalAmount.toLocaleString("en-IN")} & Confirm Spot</span>
            )}
          </button>

          <p className="text-center text-[11px] text-[#6f8a7c]">
            Encrypted with 256-bit SSL. Never stores sensitive card numbers.
          </p>
        </div>
      </div>
    </div>
  );
}
