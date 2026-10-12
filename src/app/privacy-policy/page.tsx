import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#86a394]">Last Updated: October 2026 • Social Club Expeditions</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-[#c2d7cc] leading-relaxed bg-[#0b2015] p-8 rounded-3xl border border-[#1b3d2c]">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              When you register for an expedition or create a booking with Social Club, we collect personal
              information essential to safety and trip coordination:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#9bb3a6]">
              <li>Identity & Contact: Full name, mobile number, email address, age, and emergency contact details.</li>
              <li>Operational details: Dietary preferences, basic medical or fitness notes relevant to the specific trek.</li>
              <li>Payment identifiers: Razorpay transaction IDs and timestamps (we NEVER collect or store raw card or UPI PINs).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. How Your Data Is Used</h2>
            <p>
              Your data is solely utilized to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#9bb3a6]">
              <li>Issue Forest Department permits and mandatory national park wilderness passes.</li>
              <li>Coordinate pickups, homestay allocations, and safety logistics.</li>
              <li>Send critical itinerary updates, weather advisories, and booking confirmations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Third-Party Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal data. Data is shared strictly with official forest departments
              where required by law and payment gateways (Razorpay) for authorized transactions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Data Security & Storage</h2>
            <p>
              All interactions are protected with 256-bit SSL encryption. Data is stored on secure servers with
              strict Row-Level Security (RLS) enforcement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Contact Us</h2>
            <p>
              For privacy inquiries, please reach out to our data compliance team at{" "}
              <a href="mailto:privacy@socialclub.org" className="text-[#bbf451] underline">
                privacy@socialclub.org
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
