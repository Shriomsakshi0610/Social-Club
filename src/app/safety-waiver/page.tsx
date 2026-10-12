import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, HeartPulse } from "lucide-react";

export default function SafetyWaiverPage() {
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
            Outdoor Safety Standard
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Event Participation & Safety Disclaimer
          </h1>
          <p className="text-xs text-[#86a394]">Mandatory Waiver Acknowledgment</p>
        </div>

        <div className="space-y-6 text-sm text-[#c2d7cc] leading-relaxed bg-[#0b2015] p-8 rounded-3xl border border-[#1b3d2c]">
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Outdoor exploration, trekking in rainforest terrains, lake swimming, and road adventures carry inherent
              natural risks including sudden weather shifts, uneven terrain, wildlife proximity, and physical exertion.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#bbf451]" /> 1. Physical Fitness & Medical Declaration
            </h2>
            <p>
              By registering for any Social Club trip, you confirm that you are medically fit and possess the baseline
              stamina required for the chosen expedition difficulty rating. You agree to disclose any serious chronic
              conditions (e.g. cardiac conditions, severe asthma, epilepsy, recent joint surgeries) to the trek leads in advance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Following Lead Instructions</h2>
            <p>
              Certified trek leaders are in command of the safety decisions on trail. Participants must strictly comply with:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#9bb3a6]">
              <li>Never wandering off marked paths or hiking ahead of the trail scout.</li>
              <li>Wearing mandatory life jackets during all boating, kayaking, or designated water crossings.</li>
              <li>Adhering to turn-around times dictated by mountain weather or daylight.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Assumption of Risk</h2>
            <p>
              Participants voluntarily assume all typical risks associated with wilderness travel. While Social Club
              maintains comprehensive first-aid kits and emergency evacuation protocols, Social Club and its organizers
              cannot be held liable for personal injury, property loss, or illness resulting from natural hazards or
              disregard of safety guidelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Personal Gear Responsibility</h2>
            <p>
              You are responsible for carrying the mandatory packing checklist specified on the event page,
              including proper footwear with adequate traction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
