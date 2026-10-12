import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, ArrowUpRight } from "lucide-react";
import { EventItem } from "@/types";

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  const seatsLeft = Math.max(0, event.total_capacity - event.booked_seats);
  const isSoldOut = event.status === "sold_out" || seatsLeft === 0;
  const isAlmostFull = seatsLeft > 0 && seatsLeft <= 5;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "trekking":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-700/50";
      case "camping":
        return "bg-amber-950/80 text-amber-300 border-amber-700/50";
      case "roadtrip":
        return "bg-sky-950/80 text-sky-300 border-sky-700/50";
      case "meetup":
        return "bg-purple-950/80 text-purple-300 border-purple-700/50";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="group relative bg-[#0b2015] border border-[#1a442d] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#bbf451]/50 transition-all duration-300 flex flex-col justify-between">
      {/* Top Image & Overlays */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#06150e]">
          <Image
            src={event.cover_image}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b2015] via-transparent to-black/30" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-[#d8ebd0] backdrop-blur-md border border-white/10">
                {event.difficulty}
              </span>
            </div>
          </div>

          {/* Availability Badge */}
          <div className="absolute bottom-3 left-3">
            {isSoldOut ? (
              <span className="px-2.5 py-1 rounded-md bg-rose-600/90 text-white text-xs font-black tracking-wider uppercase shadow-md">
                Sold Out
              </span>
            ) : isAlmostFull ? (
              <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black text-xs font-black tracking-wide shadow-md animate-pulse">
                Only {seatsLeft} spots left!
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-md bg-[#0d281a]/90 text-[#bbf451] text-xs font-bold border border-[#bbf451]/30 backdrop-blur-md">
                {seatsLeft} spots open
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg sm:text-xl text-white group-hover:text-[#bbf451] transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="text-xs text-[#9bb3a6] line-clamp-2 leading-relaxed">
              {event.tagline}
            </p>
          </div>

          {/* Meta Details */}
          <div className="pt-2 border-t border-[#143e29] space-y-2 text-xs text-[#c2d7cc]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#bbf451]" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#bbf451]" />
                <span>{event.duration_label}</span>
              </div>
            </div>

            <div className="flex items-start gap-1.5 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-[#bbf451] shrink-0 mt-0.5" />
              <span className="truncate">{event.destination}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer with Price & Actions */}
      <div className="p-5 pt-0">
        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-[#86a394] mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#bbf451]" /> Total Capacity
            </span>
            <span>
              {event.booked_seats} / {event.total_capacity} booked
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#06150e] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isSoldOut
                  ? "bg-rose-500"
                  : isAlmostFull
                  ? "bg-amber-400"
                  : "bg-[#bbf451]"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  Math.round((event.booked_seats / event.total_capacity) * 100)
                )}%`
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#143e29]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#86a394] block">
              Price per person
            </span>
            <div className="text-lg font-black text-white">
              {event.price_per_person === 0 ? (
                <span className="text-[#bbf451] uppercase tracking-wide">Free</span>
              ) : (
                <span>₹{event.price_per_person.toLocaleString("en-IN")}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/events/${event.slug}`}
              className="px-3.5 py-2 rounded-xl bg-[#143e29] hover:bg-[#1f5c3d] text-white text-xs font-bold transition-all"
            >
              Details
            </Link>
            {!isSoldOut ? (
              <Link
                href={`/events/${event.slug}/book`}
                className="px-4 py-2 rounded-xl bg-[#bbf451] hover:bg-[#cdf879] text-[#06150e] text-xs font-black transition-all flex items-center gap-1 shadow-md shadow-[#bbf451]/20 active:scale-95"
              >
                Book <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              </Link>
            ) : (
              <span className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-bold cursor-not-allowed">
                Waitlist
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
