import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CancellationPolicyPage() {
  return (
    <div className="bg-[#06150e] text-[#cbdad1] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#86a394] hover:text-[#bbf451] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-2 border-b border-[#143e29] pb-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
            Transparency & Refunds
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-[#86a394]">Clear, Fair, and Community-First</p>
        </div>

        <div className="space-y-6 text-sm text-[#c2d7cc] leading-relaxed bg-[#0b2015] p-8 rounded-3xl border border-[#1b3d2c]">
          <div className="p-4 rounded-2xl bg-[#06150e] border border-[#143e29] space-y-2">
            <h3 className="font-extrabold text-white text-base">Standard Weekend Expedition Policy</h3>
            <p className="text-xs text-[#9bb3a6]">
              Because we commit homestay rooms, tempo traveller seating, and forest entry permits well in advance,
              the following refund slabs apply to all bookings:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#06150e] border border-[#143e29] space-y-2 text-center">
              <span className="text-xs font-bold text-[#86a394] uppercase block">7+ Days Prior</span>
              <span className="text-2xl font-black text-[#bbf451]">85% Refund</span>
              <p className="text-[11px] text-[#9bb3a6]">or 100% Social Club trip voucher</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#06150e] border border-[#143e29] space-y-2 text-center">
              <span className="text-xs font-bold text-[#86a394] uppercase block">3 - 6 Days Prior</span>
              <span className="text-2xl font-black text-amber-400">50% Refund</span>
              <p className="text-[11px] text-[#9bb3a6]">or 60% Social Club trip voucher</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#06150e] border border-[#143e29] space-y-2 text-center">
              <span className="text-xs font-bold text-[#86a394] uppercase block">&lt; 48 Hours Prior</span>
              <span className="text-2xl font-black text-rose-400">No Refund</span>
              <p className="text-[11px] text-[#9bb3a6]">Permits & transport already locked</p>
            </div>
          </div>

          <section className="space-y-3 pt-4">
            <h3 className="text-lg font-bold text-white">How to Initiate a Cancellation</h3>
            <p>
              You can initiate a cancellation at any time directly through the{" "}
              <Link href="/my-bookings" className="text-[#bbf451] underline font-bold">
                My Bookings Portal
              </Link>{" "}
              using your Booking Reference and registered email/phone.
            </p>
            <p>
              Refunds will be processed back to the original payment source (via Razorpay) within 5 to 7 business days.
            </p>
          </section>

          <section className="space-y-3 pt-4">
            <h3 className="text-lg font-bold text-white">Trip Cancellations by Social Club</h3>
            <p>
              In rare instances where a trip is cancelled by Social Club due to extreme weather warnings or forest department bans,
              participants will receive an option of either a <strong>100% full financial refund</strong> or a seamless transfer to any future trip date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
