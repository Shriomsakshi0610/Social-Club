"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Ticket,
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  XCircle
} from "lucide-react";
import { Booking } from "@/types";

function MyBookingsContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams?.get("ref") || "";
  const initialContact = searchParams?.get("contact") || "";

  const [bookingRef, setBookingRef] = useState(initialRef);
  const [contact, setContact] = useState(initialContact);
  const [loading, setLoading] = useState(Boolean(initialRef && initialContact));
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  // Cancellation request state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState("");

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setBooking(null);
    setCancelSuccessMsg("");

    if (!bookingRef.trim() || !contact.trim()) {
      setError("Please provide both your Booking Reference and Email/Phone.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_ref: bookingRef, contact })
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data.booking);
      } else {
        setError(data.error || "No booking found matching the provided details.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (initialRef && initialContact) {
      fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_ref: initialRef, contact: initialContact })
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) {
            if (data.booking) {
              setBooking(data.booking);
            } else {
              setError(data.error || "No booking found.");
            }
          }
        })
        .catch(() => {
          if (isMounted) setError("Network error.");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [initialRef, initialContact]);

  const handleRequestCancellation = async () => {
    if (!booking) return;
    setCancelSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_cancellation_request: true,
          cancellation_requested: true,
          cancellation_reason: cancelReason || "User requested cancellation via portal"
        })
      });
      const data = await res.json();
      if (res.ok) {
        setBooking(data.booking);
        setShowCancelModal(false);
        setCancelSuccessMsg(
          "Your cancellation request has been submitted to the team. We will review and process your refund according to the trip policy."
        );
      } else {
        setError(data.error || "Failed to submit cancellation request.");
      }
    } catch {
      setError("Network error while submitting cancellation request.");
    } finally {
      setCancelSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="w-12 h-12 rounded-2xl bg-[#143e29] text-[#bbf451] flex items-center justify-center mx-auto shadow-lg">
          <Ticket className="w-6 h-6" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
          Participant Self-Service Portal
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Find & Manage Your Bookings
        </h1>
        <p className="text-sm text-[#9bb3a6] max-w-lg mx-auto">
          Look up your spot confirmation, download boarding passes, or request schedule changes.
        </p>
      </div>

      {/* Lookup Search Form */}
      <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#c2d7cc]">Booking Reference Code</label>
            <input
              type="text"
              required
              placeholder="e.g. SC-2026-X8K9"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-sm font-mono text-white placeholder-[#6f8a7c] focus:outline-none focus:border-[#bbf451]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#c2d7cc]">Registered Email or Phone</label>
            <input
              type="text"
              required
              placeholder="e.g. rahul@example.com or 9876543210"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-sm text-white placeholder-[#6f8a7c] focus:outline-none focus:border-[#bbf451]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#bbf451] hover:bg-[#cdf879] active:scale-95 text-[#06150e] font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-[#bbf451]/20"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 stroke-[2.5]" /> Look Up Booking
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-[#6f8a7c] mt-3">
          Tip: You can find your booking reference code in your confirmation email or SMS.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Success cancellation alert */}
      {cancelSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#bbf451]" />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

      {/* Booking Result View */}
      {booking && (
        <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-3xl overflow-hidden shadow-2xl space-y-6 animate-in fade-in duration-300">
          {/* Header Strip */}
          <div className="bg-[#06150e] p-6 border-b border-[#143e29] flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#86a394] uppercase tracking-wider block">
                Booking Reference: <strong className="text-[#bbf451]">{booking.booking_ref}</strong>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{booking.event_title}</h2>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  booking.booking_status === "confirmed"
                    ? "bg-[#143e29] text-[#bbf451] border border-[#21573c]"
                    : booking.booking_status === "cancelled"
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : "bg-amber-950 text-amber-300 border border-amber-800"
                }`}
              >
                {booking.booking_status}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.payment_status === "paid" || booking.payment_status === "free"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                Payment: {booking.payment_status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <span className="text-[11px] text-[#86a394] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#bbf451]" /> Departure
                </span>
                <p className="text-sm font-bold text-white">
                  {new Date(booking.event_date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#86a394] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#bbf451]" /> Destination
                </span>
                <p className="text-sm font-bold text-white line-clamp-1">{booking.event_destination}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-[#86a394] uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#bbf451]" /> Travelers
                </span>
                <p className="text-sm font-bold text-white">{booking.num_participants} Person(s)</p>
              </div>
            </div>

            {/* Participants list */}
            <div className="p-4 rounded-xl bg-[#06150e] border border-[#143e29] space-y-2 text-xs">
              <span className="text-[#86a394] font-bold block">Registered Explorer(s):</span>
              <div className="flex flex-wrap gap-2">
                {booking.participants?.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#0b2015] border border-[#1b3d2c] text-white"
                  >
                    {p.name} {p.notes ? `• ${p.notes}` : ""}
                  </span>
                ))}
              </div>
            </div>

            {/* Cancellation Status Banner if requested */}
            {booking.cancellation_requested && (
              <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-200 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> Cancellation Request Under Review
                </span>
                <p>
                  Reason: &quot;{booking.cancellation_reason || "Cancellation initiated"}&quot;. Our operations team will process the reversal as per policy.
                </p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[#143e29] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-[#143e29] hover:bg-[#1f5c3d] text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-[#bbf451]" /> Print Pass
                </button>

                <Link
                  href={`/events`}
                  className="px-4 py-2.5 rounded-xl bg-[#06150e] hover:bg-[#143e29] text-[#cbdad1] text-xs font-bold transition-all"
                >
                  Explore More Trips
                </Link>
              </div>

              {booking.booking_status !== "cancelled" && !booking.cancellation_requested && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Request Cancellation
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION REQUEST MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-2xl p-6 max-w-md w-full space-y-4 text-white shadow-2xl">
            <h3 className="text-lg font-black">Request Booking Cancellation</h3>
            <p className="text-xs text-[#9bb3a6] leading-relaxed">
              Refunds are subject to the event cancellation policy (time before departure). Please tell us the reason for your cancellation.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#c2d7cc]">Reason for cancellation</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Health emergency / Schedule conflict / Personal reasons..."
                className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-xs text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-xl bg-[#06150e] hover:bg-[#143e29] text-xs font-bold"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleRequestCancellation}
                disabled={cancelSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
              >
                {cancelSubmitting ? "Submitting..." : "Confirm Cancellation Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen bg-[#06150e] text-[#cbdad1] py-16 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-[#bbf451] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        }
      >
        <MyBookingsContent />
      </Suspense>
    </div>
  );
}
