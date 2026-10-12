"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, MessageCircle, Mail, MapPin, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/Icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're on the list! Welcome to the tribe.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <footer className="bg-[#06150e] text-[#cbdad1] border-t border-[#123321] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#123321]">
          {/* Col 1: Brand story */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#bbf451] text-[#06150e] flex items-center justify-center font-black">
                <Compass className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-wider text-white">
                SOCIAL CLUB
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#9bb3a6] max-w-sm">
              We organize outdoor expeditions, mountain treks, lake camps, road trips, and curated social meetups.
              Our mission is simple: <strong className="text-white font-semibold">Less Scrolling. More Living.</strong>
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://chat.whatsapp.com/demo-socialclub-community"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#143e29] hover:bg-[#1f5c3d] text-[#bbf451] text-xs font-bold transition-all border border-[#21573c]"
              >
                <MessageCircle className="w-4 h-4" />
                Join WhatsApp Group
              </a>
              <a
                href="https://instagram.com/socialclub.community"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#143e29] hover:bg-[#1f5c3d] text-white text-xs font-bold transition-all border border-[#21573c]"
              >
                <InstagramIcon className="w-4 h-4 text-[#ff5f8f]" />
                @socialclub
              </a>
            </div>
          </div>

          {/* Col 2: Experiences */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Experiences</h4>
            <ul className="space-y-2 text-sm text-[#9bb3a6]">
              <li>
                <Link href="/events?category=trekking" className="hover:text-[#bbf451] transition-colors">
                  Rainforest & Mountain Treks
                </Link>
              </li>
              <li>
                <Link href="/events?category=camping" className="hover:text-[#bbf451] transition-colors">
                  Lakeside Camping & Bonfires
                </Link>
              </li>
              <li>
                <Link href="/events?category=roadtrip" className="hover:text-[#bbf451] transition-colors">
                  Coastal Highway Road Trips
                </Link>
              </li>
              <li>
                <Link href="/events?category=meetup" className="hover:text-[#bbf451] transition-colors">
                  Coffee & Bouldering Meetups
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#bbf451] transition-colors font-medium text-white">
                  All Upcoming Departures →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Community</h4>
            <ul className="space-y-2 text-sm text-[#9bb3a6]">
              <li>
                <Link href="/about" className="hover:text-[#bbf451] transition-colors">
                  About Our Ethos
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-[#bbf451] transition-colors">
                  Find My Bookings
                </Link>
              </li>
              <li>
                <Link href="/cancellation-refund-policy" className="hover:text-[#bbf451] transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/safety-waiver" className="hover:text-[#bbf451] transition-colors">
                  Safety Protocol & Waiver
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#bbf451] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#bbf451] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Trip Drops</h4>
            <p className="text-xs text-[#9bb3a6] leading-relaxed">
              Get notified 24 hours before trip spots go live. No spam, only adventures.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d281a] border border-[#21573c] text-white text-xs placeholder-[#668072] focus:outline-none focus:border-[#bbf451]"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#bbf451] text-[#06150e] rounded-md font-bold text-xs hover:bg-[#cdf879] flex items-center justify-center transition-all disabled:opacity-50"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {message && (
                <p
                  className={`text-xs ${
                    status === "success" ? "text-[#bbf451]" : "text-rose-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
            <div className="pt-2 text-xs text-[#6f8a7c] flex flex-col space-y-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#bbf451]" /> Chapters in Bengaluru, Mumbai, Pune & Goa
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#bbf451]" /> hello@socialclub.org
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#718b7e] gap-4">
          <p>© 2026 SOCIAL CLUB. Find Your People. Live More. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Crafted for outdoor explorers with <Heart className="w-3.5 h-3.5 text-[#bbf451] fill-current" />
            </span>
            <Link
              href="/admin"
              className="text-[#9bb3a6] hover:text-[#bbf451] flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
