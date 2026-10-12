import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            Terms of Service
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#86a394]">Effective Date: October 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-[#c2d7cc] leading-relaxed bg-[#0b2015] p-8 rounded-3xl border border-[#1b3d2c]">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Community Code of Conduct</h2>
            <p>
              Social Club is an inclusive outdoor community. All participants must treat fellow explorers,
              local guides, homestay hosts, and forest staff with respect and dignity. Harassment, discrimination,
              or disruptive behavior will lead to immediate expulsion from the trip without refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Substance & Alcohol Policy</h2>
            <p>
              Strict zero-tolerance on forest trails, vehicle transit, and during activities. Alcohol consumption
              is never permitted prior to or during hiking expeditions. Any violation forfeits your booking.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Punctuality & Pickups</h2>
            <p>
              Trips adhere to coordinated group timetables. Participants must arrive at designated assembly points
              at least 15 minutes before scheduled departure. Social Club cannot delay departures for late arrivals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Force Majeure & Weather Changes</h2>
            <p>
              Mountain trails and waterways are subject to unexpected weather, forest department closures, or road landslides.
              Trek leaders reserve the authority to alter routes or itineraries in real time to prioritize group safety.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Governing Jurisdiction</h2>
            <p>
              These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the
              courts in Bengaluru, Karnataka.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
