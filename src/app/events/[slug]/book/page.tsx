"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  MapPin,
  ArrowLeft,
  Users,
  AlertCircle,
  Lock
} from "lucide-react";
import { EventItem } from "@/types";
import RazorpayCheckoutModal from "@/components/RazorpayCheckoutModal";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Booking Form State
  const [numParticipants, setNumParticipants] = useState<number>(1);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [safetyWaiverAccepted, setSafetyWaiverAccepted] = useState(false);

  // Attendees list
  const [attendees, setAttendees] = useState<
    { name: string; age: string; gender: string; notes: string }[]
  >([{ name: "", age: "", gender: "Prefer not to say", notes: "" }]);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeBookingRef, setActiveBookingRef] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await fetch(`/api/events/${slug}`);
        const data = await res.json();
        if (res.ok) {
          setEvent(data.event);
        } else {
          setErrorMessage(data.error || "Event not found");
        }
      } catch {
        setErrorMessage("Network error fetching event details");
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchEvent();
  }, [slug]);

  // Sync attendees array length when participant count changes
  const handleParticipantCountChange = (count: number) => {
    if (!event) return;
    const maxAvailable = Math.max(0, event.total_capacity - event.booked_seats);
    const clamped = Math.max(1, Math.min(count, Math.min(10, maxAvailable)));
    setNumParticipants(clamped);

    setAttendees((prev) => {
      const next = [...prev];
      while (next.length < clamped) {
        next.push({ name: "", age: "", gender: "Prefer not to say", notes: "" });
      }
      return next.slice(0, clamped);
    });
  };

  const updateAttendee = (index: number, field: string, value: string) => {
    setAttendees((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!event) return;

    // Validation
    if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
      setErrorMessage("Please fill in your primary contact information (Name, Email, Phone).");
      return;
    }

    if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) {
      setErrorMessage("Please provide an emergency contact person and phone number.");
      return;
    }

    if (!termsAccepted || !safetyWaiverAccepted) {
      setErrorMessage("Please accept the terms of participation and safety waiver.");
      return;
    }

    // Auto-fill primary attendee if first is empty
    const preparedAttendees = attendees.map((att, idx) => {
      if (idx === 0 && !att.name.trim()) {
        return { ...att, name: userName.trim() };
      }
      return {
        name: att.name.trim() || `Participant ${idx + 1}`,
        age: att.age ? parseInt(att.age, 10) : undefined,
        gender: att.gender,
        notes: att.notes.trim()
      };
    });

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: event.id,
          user_name: userName,
          user_email: userEmail,
          user_phone: userPhone,
          num_participants: numParticipants,
          participants: preparedAttendees,
          emergency_contact_name: emergencyContactName,
          emergency_contact_phone: emergencyContactPhone,
          terms_accepted: termsAccepted,
          safety_waiver_accepted: safetyWaiverAccepted,
          is_free_event: event.price_per_person === 0
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create booking registration.");
        setSubmitting(false);
        return;
      }

      const booking = data.booking;

      // If FREE event, it is automatically confirmed!
      if (booking.payment_status === "free" || booking.total_amount === 0) {
        router.push(`/booking/confirmation?ref=${booking.booking_ref}&email=${encodeURIComponent(booking.user_email)}`);
        return;
      }

      // If PAID event, open Razorpay Checkout Modal
      setActiveBookingRef(booking.booking_ref);
      setIsPaymentModalOpen(true);
      setSubmitting(false);
    } catch {
      setErrorMessage("Network error while submitting booking. Please try again.");
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setIsPaymentModalOpen(false);
    router.push(
      `/booking/confirmation?ref=${activeBookingRef}&email=${encodeURIComponent(userEmail)}&paymentId=${paymentId}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06150e] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#bbf451] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#9bb3a6]">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#06150e] flex items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Event not found</h2>
          <Link href="/events" className="text-[#bbf451] text-sm hover:underline">
            Return to events list
          </Link>
        </div>
      </div>
    );
  }

  const seatsLeft = Math.max(0, event.total_capacity - event.booked_seats);
  const totalAmount = event.price_per_person * numParticipants;

  return (
    <div className="min-h-screen bg-[#06150e] text-[#cbdad1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#86a394] hover:text-[#bbf451] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event Details
        </Link>

        {/* Page Header */}
        <div className="space-y-2 border-b border-[#143e29] pb-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
            Expedition Spot Reservation
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Register for {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#9bb3a6] pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#bbf451]" /> {event.duration_label}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#bbf451]" /> {event.destination}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#bbf451]" /> {seatsLeft} Spots Available
            </span>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: FORM STEPS */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. SEATS SELECTOR */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">1. Number of Spots</h3>
                  <p className="text-xs text-[#86a394]">How many people are joining this trip?</p>
                </div>
                <div className="flex items-center gap-3 bg-[#06150e] border border-[#143e29] p-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleParticipantCountChange(numParticipants - 1)}
                    disabled={numParticipants <= 1}
                    className="w-8 h-8 rounded-lg bg-[#143e29] text-white hover:bg-[#1f5c3d] flex items-center justify-center font-bold text-sm disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-black text-sm text-[#bbf451]">
                    {numParticipants}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleParticipantCountChange(numParticipants + 1)}
                    disabled={numParticipants >= Math.min(10, seatsLeft)}
                    className="w-8 h-8 rounded-lg bg-[#143e29] text-white hover:bg-[#1f5c3d] flex items-center justify-center font-bold text-sm disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 2. PRIMARY CONTACT */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
              <h3 className="text-base font-extrabold text-white">2. Lead Traveler Contact</h3>
              <p className="text-xs text-[#86a394]">
                Booking confirmation, receipt, and meeting GPS coordinates will be sent here.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-[#c2d7cc]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-sm text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#c2d7cc]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. arjun@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-sm text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#c2d7cc]">WhatsApp / Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-sm text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>
              </div>
            </div>

            {/* 3. INDIVIDUAL PARTICIPANTS DETAILS */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
              <h3 className="text-base font-extrabold text-white">3. Participant Information</h3>
              <p className="text-xs text-[#86a394]">
                Required for forest department permits and medical preparedness.
              </p>

              <div className="space-y-4">
                {attendees.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#06150e] border border-[#143e29] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#bbf451]">
                      <span>Participant #{idx + 1} {idx === 0 ? "(Lead)" : ""}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[11px] text-[#86a394]">Full Legal Name</label>
                        <input
                          type="text"
                          value={idx === 0 && !att.name ? userName : att.name}
                          onChange={(e) => updateAttendee(idx, "name", e.target.value)}
                          placeholder={idx === 0 ? userName || "Name" : `Participant ${idx + 1}`}
                          className="w-full px-3 py-2 bg-[#0b2015] border border-[#143e29] rounded-lg text-xs text-white focus:outline-none focus:border-[#bbf451]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-[#86a394]">Age</label>
                        <input
                          type="number"
                          value={att.age}
                          onChange={(e) => updateAttendee(idx, "age", e.target.value)}
                          placeholder="e.g. 26"
                          className="w-full px-3 py-2 bg-[#0b2015] border border-[#143e29] rounded-lg text-xs text-white focus:outline-none focus:border-[#bbf451]"
                        />
                      </div>

                      <div className="space-y-1 sm:col-span-3">
                        <label className="text-[11px] text-[#86a394]">Dietary / Health Notes (Optional)</label>
                        <input
                          type="text"
                          value={att.notes}
                          onChange={(e) => updateAttendee(idx, "notes", e.target.value)}
                          placeholder="e.g. Pure Veg / Mild Asthma / None"
                          className="w-full px-3 py-2 bg-[#0b2015] border border-[#143e29] rounded-lg text-xs text-white focus:outline-none focus:border-[#bbf451]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. EMERGENCY CONTACT */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
              <h3 className="text-base font-extrabold text-white">4. Emergency Contact</h3>
              <p className="text-xs text-[#86a394]">
                A family member or friend not traveling with you on this trip.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#c2d7cc]">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="e.g. Sunita Verma (Mother)"
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-sm text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#c2d7cc]">Emergency Phone *</label>
                  <input
                    type="tel"
                    required
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-sm text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>
              </div>
            </div>

            {/* 5. WAIVER & TERMS */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
              <h3 className="text-base font-extrabold text-white">5. Safety Waiver & Guidelines</h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#21573c] bg-[#06150e] text-[#bbf451] focus:ring-0"
                  />
                  <span className="text-xs text-[#9bb3a6] leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-[#bbf451] underline">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/cancellation-refund-policy" target="_blank" className="text-[#bbf451] underline">
                      Cancellation Policy
                    </Link>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyWaiverAccepted}
                    onChange={(e) => setSafetyWaiverAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#21573c] bg-[#06150e] text-[#bbf451] focus:ring-0"
                  />
                  <span className="text-xs text-[#9bb3a6] leading-relaxed">
                    I have read the{" "}
                    <Link href="/safety-waiver" target="_blank" className="text-[#bbf451] underline">
                      Outdoor Participation & Safety Disclaimer
                    </Link>
                    . I confirm I am physically fit to participate and agree to follow the instructions of the lead guides.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: ORDER SUMMARY & SUBMIT */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] shadow-xl space-y-6 sticky top-28">
              <h3 className="text-lg font-extrabold text-white border-b border-[#143e29] pb-4">
                Summary of Registration
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#86a394]">Trip</span>
                  <span className="text-white font-bold text-right line-clamp-1">{event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86a394]">Price per spot</span>
                  <span className="text-white font-bold">
                    {event.price_per_person === 0 ? "FREE" : `₹${event.price_per_person.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#86a394]">Spots reserved</span>
                  <span className="text-[#bbf451] font-bold">{numParticipants} spot(s)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#143e29] space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-black text-[#bbf451]">
                    {totalAmount === 0 ? "FREE" : `₹${totalAmount.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <p className="text-[11px] text-[#86a394]">
                  Zero payment gateway surcharges. Taxes and permits included.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#bbf451] hover:bg-[#cdf879] active:scale-95 text-[#06150e] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#bbf451]/20 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#06150e] border-t-transparent rounded-full animate-spin"></span>
                    Securing Spots...
                  </span>
                ) : event.price_per_person === 0 ? (
                  <span>Confirm Free Registration</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4" /> Proceed to Payment
                  </span>
                )}
              </button>

              <div className="text-[11px] text-[#6f8a7c] text-center space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#bbf451]" /> Secure Razorpay Checkout
                </p>
                <p>Instant SMS/Email confirmation on booking</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* RAZORPAY CHECKOUT MODAL */}
      <RazorpayCheckoutModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingRef={activeBookingRef}
        totalAmount={totalAmount}
        customerName={userName}
        customerEmail={userEmail}
        customerPhone={userPhone}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
