import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, Sparkles, ShieldCheck, TreePine, Users, ArrowRight, MessageCircle } from "lucide-react";
import { COMMUNITY_STATS } from "@/lib/sample-data";

export default function AboutPage() {
  return (
    <div className="bg-[#06150e] text-[#cbdad1] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#143e29] border border-[#bbf451]/30 text-[#bbf451] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-4 h-4 stroke-[2.5]" />
            Our Mission & Story
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            We built this to cure modern city loneliness.
          </h1>
          <p className="text-base sm:text-lg text-[#c2d7cc] leading-relaxed">
            In an era of relentless algorithmic scrolling and endless group chats where plans never happen, 
            <strong className="text-white font-bold"> SOCIAL CLUB</strong> was born out of a simple rebellion: 
            to get people outdoors, together, living fully in the real world.
          </p>
        </div>

        {/* Feature Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#1b3d2c] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
              alt="Hiker sitting on mountain ridge at sunrise"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#1b3d2c] shadow-xl md:translate-y-6">
            <Image
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80"
              alt="Campers laughing around bonfire"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#1b3d2c] shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80"
              alt="Friends watching stars by the tent"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
              The Four Non-Negotiables
            </span>
            <h2 className="text-3xl font-black text-white">How We Operate</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#143e29] text-[#bbf451] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Solo Traveler Sanctuary</h3>
              <p className="text-xs sm:text-sm text-[#9bb3a6] leading-relaxed">
                65% of our explorers sign up completely on their own. We deliberately design our itineraries 
                and icebreakers so you never feel out of place. No awkward cliquish behavior; everyone belongs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#143e29] text-[#bbf451] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Rigorous Safety & Female-Friendly</h3>
              <p className="text-xs sm:text-sm text-[#9bb3a6] leading-relaxed">
                Every mountain trek has accredited wilderness first-aid responders, satellite/emergency check-ins, 
                and women co-leaders on every trip. Zero tolerance for harassment or unsafe behavior.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#143e29] text-[#bbf451] flex items-center justify-center font-bold">
                <TreePine className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Strict Zero-Litter Ethos</h3>
              <p className="text-xs sm:text-sm text-[#9bb3a6] leading-relaxed">
                We believe in leaving the wilderness cleaner than we found it. We provide eco-pouches for 
                every hiker, avoid single-use plastics, and conduct trail clean-ups on every descent.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#143e29] text-[#bbf451] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Curated Small Groups</h3>
              <p className="text-xs sm:text-sm text-[#9bb3a6] leading-relaxed">
                We cap trips between 15 and 20 explorers. We reject mass tourism buses so that every 
                participant has space, quality time, and genuine connection with nature and each other.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="p-8 rounded-3xl bg-[#0b2015] border border-[#1b3d2c] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {COMMUNITY_STATS.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-xs text-[#86a394] font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-6 pt-4">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Find Your People. Live More.
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/events"
              className="px-8 py-3.5 rounded-full bg-[#bbf451] text-[#06150e] font-black text-sm hover:bg-[#cdf879] transition-all flex items-center gap-2 shadow-lg shadow-[#bbf451]/20"
            >
              Explore Upcoming Departures <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://chat.whatsapp.com/demo-socialclub-community"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#143e29] hover:bg-[#1f5c3d] text-white border border-[#21573c] font-bold text-sm transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#bbf451]" />
              Join WhatsApp Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
