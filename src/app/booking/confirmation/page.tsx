"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  Download,
  MessageCircle,
  Ticket,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { Booking } from "@/types";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ref = searchParams?.get("ref") || "";
  const email = searchParams?.get("email") || "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#bbf451", "#ffffff", "#25D366", "#143e29"]
      });
    } catch {
      // ignore
    }

    async function loadBooking() {
      if (!ref) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/bookings/lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_ref: ref, contact: email || ref })
        });
        const data = await res.json();
        if (res.ok) {
          setBooking(data.booking);
        } else {
          setError(data.error || "Booking details could not be retrieved.");
        }
      } catch {
        setError("Network error fetching booking.");
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [ref, email]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const generateGoogleCalendarUrl = () => {
    if (!booking) return "#";
    const title = encodeURIComponent(`Social Club: ${booking.event_title}`);
    const details = encodeURIComponent(
      `Trip Booking Ref: ${booking.booking_ref}\nMeeting Point: ${booking.event_destination}\nLead Traveler: ${booking.user_name}`
    );
    const location = encodeURIComponent(booking.event_destination);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#bbf451] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-[#9bb3a6]">Retrieving your confirmation pass...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="w-16 h-16 rounded-full bg-[#143e29] border-2 border-[#bbf451] text-[#bbf451] flex items-center justify-center mx-auto shadow-xl shadow-[#bbf451]/20">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-[#bbf451] block">
          Registration Confirmed
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          You&apos;re Going On An Adventure!
        </h1>
        <p className="text-sm text-[#c2d7cc] max-w-md mx-auto">
          We&apos;ve reserved your spot. A confirmation has been registered to your email.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs">
          Notice: {error}
        </div>
      )}

      {/* Printable Digital Boarding Pass */}
      <div
        id="ticket-pass"
        className="relative bg-[#0b2015] border-2 border-[#21573c] rounded-3xl overflow-hidden shadow-2xl print:border-black print:text-black print:bg-white"
      >
        {/* Pass Top Banner */}
        <div className="bg-[#06150e] p-6 border-b border-[#143e29] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#bbf451] text-[#06150e] flex items-center justify-center font-black">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-lg text-white block">SOCIAL CLUB EXPEDITION PASS</span>
              <span className="text-[11px] text-[#86a394] uppercase tracking-wider">
                Official Digital Boarding Voucher
              </span>
            </div>
          </div>

          <div className="bg-[#143e29] px-4 py-2 rounded-xl border border-[#21573c]">
            <span className="text-[10px] text-[#86a394] uppercase block">Booking Reference</span>
            <span className="text-lg font-mono font-black text-[#bbf451]">
              {booking?.booking_ref || ref || "SC-2026-X8K9"}
            </span>
          </div>
        </div>

        {/* Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#bbf451] uppercase tracking-wider">Selected Experience</span>
            <h2 className="text-2xl font-black text-white">
              {booking?.event_title || "Weekend Mountain Expedition"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-[#143e29]">
            <div className="space-y-1">
              <span className="text-[11px] text-[#86a394] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#bbf451]" /> Departure
              </span>
              <p className="text-sm font-bold text-white">
                {booking?.event_date
                  ? new Date(booking.event_date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  : "Upcoming Weekend"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#86a394] uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#bbf451]" /> Destination
              </span>
              <p className="text-sm font-bold text-white line-clamp-1">
                {booking?.event_destination || "Western Ghats, Karnataka"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#86a394] uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#bbf451]" /> Spots Reserved
              </span>
              <p className="text-sm font-bold text-white">
                {booking?.num_participants || 1} Explorer(s)
              </p>
            </div>
          </div>

          {/* Traveler Details */}
          <div className="p-4 rounded-2xl bg-[#06150e] border border-[#143e29] space-y-2">
            <span className="text-[11px] text-[#86a394] uppercase tracking-wider font-bold block">
              Traveler Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[#86a394] block">Lead Name</span>
                <span className="text-white font-bold">{booking?.user_name || "Adventurer"}</span>
              </div>
              <div>
                <span className="text-[#86a394] block">Email</span>
                <span className="text-white font-bold">{booking?.user_email || email}</span>
              </div>
              <div>
                <span className="text-[#86a394] block">Phone</span>
                <span className="text-white font-bold">{booking?.user_phone || "Verified"}</span>
              </div>
            </div>

            {booking?.participants && booking.participants.length > 0 && (
              <div className="pt-2 border-t border-[#143e29] text-xs">
                <span className="text-[#86a394] block mb-1">Participants:</span>
                <div className="flex flex-wrap gap-2">
                  {booking.participants.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-[#0b2015] border border-[#1b3d2c] text-white text-[11px]"
                    >
                      {p.name} {p.age ? `(${p.age}y)` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#143e29]/50 border border-[#21573c]">
            <div>
              <span className="text-[11px] text-[#86a394] uppercase block">Payment Status</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#bbf451] animate-pulse" />
                <span className="text-sm font-black text-[#bbf451] uppercase">
                  {booking?.payment_status === "paid"
                    ? "Verified & Paid"
                    : booking?.payment_status === "free"
                    ? "Free Community Spot"
                    : "Confirmed"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#86a394] uppercase block">Amount</span>
              <span className="text-xl font-black text-white">
                {booking?.total_amount === 0 ? "₹0 (FREE)" : `₹${booking?.total_amount.toLocaleString("en-IN")}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <a
          href="https://chat.whatsapp.com/demo-socialclub-community"
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Join Trip WhatsApp Group
        </a>

        <a
          href={generateGoogleCalendarUrl()}
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-xl bg-[#143e29] hover:bg-[#1f5c3d] text-white border border-[#21573c] font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Calendar className="w-4 h-4 text-[#bbf451]" />
          Add to Google Calendar
        </a>

        <button
          onClick={handlePrint}
          className="p-3.5 rounded-xl bg-[#0b2015] hover:bg-[#143e29] text-white border border-[#1b3d2c] font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-[#bbf451]" />
          Print / Save Pass
        </button>
      </div>

      {/* Link to Lookup portal */}
      <div className="text-center pt-4">
        <Link
          href={`/my-bookings?ref=${booking?.booking_ref || ref}&contact=${encodeURIComponent(booking?.user_email || email)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#bbf451] hover:underline"
        >
          <span>Access and manage this booking anytime in My Bookings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#06150e] text-[#cbdad1] py-16 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#bbf451] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
