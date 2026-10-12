import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Check,
  X as XIcon,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  Bus,
  Sparkles
} from "lucide-react";
import { getEventBySlug } from "@/lib/data-store";

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const seatsLeft = Math.max(0, event.total_capacity - event.booked_seats);
  const isSoldOut = event.status === "sold_out" || seatsLeft === 0;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#06150e] text-[#cbdad1] min-h-screen pb-24">
      {/* ================= HERO COVER SECTION ================= */}
      <section className="relative h-[60vh] min-h-[420px] w-full bg-[#04150c] overflow-hidden">
        <Image
          src={event.cover_image}
          alt={event.title}
          fill
          priority
          className="object-cover object-center brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06150e] via-[#06150e]/50 to-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#bbf451] text-[#06150e] text-xs font-black uppercase tracking-wider shadow-md">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold border border-white/20 backdrop-blur-md">
              {event.difficulty}
            </span>
            {isSoldOut ? (
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider">
                Sold Out
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-[#0d281a]/90 text-[#bbf451] text-xs font-bold border border-[#bbf451]/30">
                {seatsLeft} Spots Left
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-4xl leading-tight">
            {event.title}
          </h1>

          <p className="text-sm sm:text-lg text-[#c2d7cc] max-w-3xl font-medium">
            {event.tagline}
          </p>
        </div>
      </section>

      {/* ================= MAIN CONTENT & SIDEBAR ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* LEFT 2 COLUMNS: DETAILS */}
          <div className="lg:col-span-2 space-y-12">
            {/* Quick Facts Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0b2015] border border-[#1b3d2c]">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#86a394] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#bbf451]" /> Date
                </span>
                <p className="text-xs sm:text-sm font-bold text-white">{formatDate(event.start_date)}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#86a394] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#bbf451]" /> Duration
                </span>
                <p className="text-xs sm:text-sm font-bold text-white">{event.duration_label}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#86a394] flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-[#bbf451]" /> Travel
                </span>
                <p className="text-xs sm:text-sm font-bold text-white line-clamp-1">{event.travel_mode}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#86a394] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#bbf451]" /> Group Size
                </span>
                <p className="text-xs sm:text-sm font-bold text-white">Max {event.total_capacity} Adventurers</p>
              </div>
            </div>

            {/* Overview / Story */}
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#bbf451]" /> The Experience
              </h2>
              <div className="prose prose-invert max-w-none text-sm sm:text-base text-[#c2d7cc] leading-relaxed whitespace-pre-line bg-[#0b2015]/60 border border-[#163a26] p-6 rounded-2xl">
                {event.description}
              </div>
            </div>

            {/* Image Gallery */}
            {event.gallery_images && event.gallery_images.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Trail Visuals</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {event.gallery_images.map((imgUrl, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-[#1b3d2c]">
                      <Image src={imgUrl} alt={`Gallery ${i}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meeting Point & Destination */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#bbf451]" /> Destination & Meeting Details
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-white block font-semibold">Destination:</strong>
                  <span className="text-[#9bb3a6]">{event.destination}</span>
                </div>
                <div>
                  <strong className="text-white block font-semibold">Assembly / Pickup Point:</strong>
                  <span className="text-[#9bb3a6]">{event.meeting_point}</span>
                </div>
                <div>
                  <strong className="text-white block font-semibold">Transport Mode:</strong>
                  <span className="text-[#9bb3a6]">{event.travel_mode}</span>
                </div>
              </div>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white tracking-tight">Expedition Itinerary</h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#143e29]">
                {event.itinerary.map((item, idx) => (
                  <div key={idx} className="relative pl-10 space-y-1">
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#bbf451] border-4 border-[#06150e]" />
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#bbf451] uppercase tracking-wide">
                        {item.day} {item.time && `• ${item.time}`}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-white">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-[#9bb3a6] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions and Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#bbf451]" /> What&apos;s Included
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#c2d7cc]">
                  {event.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#bbf451] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <XIcon className="w-5 h-5 text-rose-400" /> What&apos;s Not Included
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#9bb3a6]">
                  {event.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XIcon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Things to Bring */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
              <h3 className="text-xl font-extrabold text-white">Packing List / Things to Carry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#c2d7cc]">
                {event.things_to_bring.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-[#06150e]/60 border border-[#143e29]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#bbf451] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety & Medical Guidelines */}
            <div className="p-6 rounded-2xl bg-[#12281b] border border-[#21573c] space-y-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#bbf451]" /> Safety Protocol & Standards
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#c2d7cc]">
                {event.safety_instructions.map((ins, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#bbf451] font-bold">•</span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancellation Policy */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
              <h3 className="text-base font-bold text-white">Cancellation & Refund Policy</h3>
              <p className="text-xs sm:text-sm text-[#9bb3a6] leading-relaxed">
                {event.cancellation_policy}
              </p>
              <Link href="/cancellation-refund-policy" className="text-xs font-bold text-[#bbf451] hover:underline inline-block pt-1">
                Read full cancellation terms →
              </Link>
            </div>

            {/* FAQs */}
            {event.faqs && event.faqs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#bbf451]" /> Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {event.faqs.map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                      <h5 className="font-extrabold text-white text-sm">{faq.question}</h5>
                      <p className="text-xs text-[#9bb3a6] leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer Contact Card */}
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#86a394]">Trip Curator</span>
                <h4 className="text-base font-black text-white">{event.organizer.name}</h4>
                <div className="flex flex-wrap gap-4 text-xs text-[#9bb3a6] pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#bbf451]" /> {event.organizer.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#bbf451]" /> {event.organizer.email}
                  </span>
                </div>
              </div>

              {event.organizer.whatsapp_group_link && (
                <a
                  href={event.organizer.whatsapp_group_link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#143e29] hover:bg-[#1f5c3d] text-[#bbf451] border border-[#21573c] text-xs font-bold flex items-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> Ask Organizer
                </a>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: STICKY BOOKING CARD */}
          <div className="lg:col-span-1 sticky top-28 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] shadow-2xl space-y-6">
              {/* Price */}
              <div className="border-b border-[#143e29] pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#86a394] block">
                  Price per explorer
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {event.price_per_person === 0 ? (
                    <span className="text-[#bbf451]">FREE</span>
                  ) : (
                    <span>₹{event.price_per_person.toLocaleString("en-IN")}</span>
                  )}
                  <span className="text-xs font-normal text-[#86a394] ml-2">all taxes & permits incl.</span>
                </div>
              </div>

              {/* Seat Capacity Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#9bb3a6]">
                  <span>Available Spots</span>
                  <span className="font-bold text-white">
                    {seatsLeft} of {event.total_capacity} remaining
                  </span>
                </div>
                <div className="w-full h-2 bg-[#06150e] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isSoldOut ? "bg-rose-500" : "bg-[#bbf451]"}`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((event.booked_seats / event.total_capacity) * 100)
                      )}%`
                    }}
                  />
                </div>
              </div>

              {/* Deadline & Policy bullet */}
              <div className="text-xs text-[#86a394] space-y-2 bg-[#06150e]/60 p-3.5 rounded-xl border border-[#143e29]">
                <div>
                  <strong className="text-white">Registration Closes:</strong>{" "}
                  {formatDate(event.registration_deadline)}
                </div>
                <div>
                  <strong className="text-white">Confirmation:</strong> Instant digital voucher & WhatsApp group access.
                </div>
              </div>

              {/* CTA Button */}
              {!isSoldOut ? (
                <Link
                  href={`/events/${event.slug}/book`}
                  className="w-full py-4 rounded-xl bg-[#bbf451] hover:bg-[#cdf879] active:scale-95 text-[#06150e] font-black text-base transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#bbf451]/20"
                >
                  <span>Book Your Spot Now</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </Link>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-center space-y-1">
                  <span className="text-sm font-bold text-rose-400">Sold Out</span>
                  <p className="text-xs text-zinc-500">
                    All spots filled. Join the waitlist on WhatsApp.
                  </p>
                </div>
              )}

              <p className="text-center text-[11px] text-[#6f8a7c]">
                100% transparent pricing • Verified Razorpay payments • Free cancellation options
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BOOKING BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06150e]/95 backdrop-blur-md border-t border-[#1b3d2c] p-4 px-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#86a394] uppercase tracking-wider block">Price</span>
          <span className="text-xl font-black text-white">
            {event.price_per_person === 0 ? "FREE" : `₹${event.price_per_person.toLocaleString("en-IN")}`}
          </span>
        </div>

        {!isSoldOut ? (
          <Link
            href={`/events/${event.slug}/book`}
            className="px-6 py-3 rounded-xl bg-[#bbf451] text-[#06150e] font-black text-sm active:scale-95 transition-all shadow-md shadow-[#bbf451]/20 flex items-center gap-1.5"
          >
            <span>Book Spot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 font-bold text-xs">
            Sold Out
          </span>
        )}
      </div>
    </div>
  );
}
