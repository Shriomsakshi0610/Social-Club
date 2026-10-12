import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  ArrowRight,
  Mountain,
  Tent,
  Car,
  Coffee,
  ShieldCheck,
  Users,
  Sparkles,
  MessageCircle,
  Star,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { InstagramIcon } from "@/components/Icons";
import { getAllEvents } from "@/lib/data-store";
import EventCard from "@/components/EventCard";
import { TESTIMONIALS, COMMUNITY_STATS } from "@/lib/sample-data";

export default async function HomePage() {
  const events = await getAllEvents();
  const featuredEvents = events.slice(0, 3);

  const categories = [
    {
      title: "Trekking & Hiking",
      tagline: "Rainforest peaks, cloud ridges & mountain summits",
      icon: Mountain,
      category: "trekking",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      count: "2 Upcoming"
    },
    {
      title: "Camping & Bonfires",
      tagline: "Lakeside tents, acoustic jam sessions & stargazing",
      icon: Tent,
      category: "camping",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
      count: "3 Upcoming"
    },
    {
      title: "Scenic Road Trips",
      tagline: "Coastal highways, ferry hops & hidden waterfall drives",
      icon: Car,
      category: "roadtrip",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      count: "1 Upcoming"
    },
    {
      title: "Social Meetups & Games",
      tagline: "Sunrise coffee, bouldering scrambles & board games",
      icon: Coffee,
      category: "meetup",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      count: "Weekly"
    }
  ];

  return (
    <div className="bg-[#06150e] text-[#cbdad1] overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background Image with Cinematic Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=85"
            alt="Hikers standing on mountain ridge overlooking clouds"
            fill
            priority
            className="object-cover object-center brightness-75 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06150e] via-[#06150e]/60 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#06150e_85%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#143e29]/90 border border-[#bbf451]/40 text-[#bbf451] text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-black/50">
            <Sparkles className="w-4 h-4 animate-spin duration-3000" />
            Find Your People. Live More.
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] font-sans">
              Less Scrolling. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bbf451] via-[#cdf879] to-[#84cc16]">
                More Living.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#c2d7cc] font-medium leading-relaxed">
              Real weekend adventures for friendly city dwellers. Escape screens, summit mist-veiled peaks,
              camp beside serene waters, and build genuine friendships around the campfire.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#bbf451] hover:bg-[#cdf879] active:scale-95 text-[#06150e] text-base font-black tracking-tight transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#bbf451]/20"
            >
              <Compass className="w-5 h-5 stroke-[2.5]" />
              Explore Upcoming Events
            </Link>
            <a
              href="https://chat.whatsapp.com/demo-socialclub-community"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0d281a]/90 hover:bg-[#143e29] border border-[#21573c] text-white text-base font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <MessageCircle className="w-5 h-5 text-[#bbf451]" />
              Join WhatsApp Community
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-left">
            {COMMUNITY_STATS.map((stat, i) => (
              <div key={i} className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/5">
                <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[11px] text-[#9bb3a6] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
              Curated Formats
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Experiences Tailored For You
            </h2>
          </div>
          <p className="text-sm text-[#9bb3a6] max-w-md">
            Whether you want a high-altitude climb or a chill lakeside sunset with music, we design every trip from scratch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={`/events?category=${cat.category}`}
                className="group relative h-80 rounded-2xl overflow-hidden border border-[#1b3d2c] hover:border-[#bbf451]/60 transition-all duration-300 shadow-lg flex flex-col justify-end p-6"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06150e] via-[#06150e]/60 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#bbf451] text-[#06150e] flex items-center justify-center font-bold shadow-md">
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-[#bbf451] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#9bb3a6] line-clamp-2">
                    {cat.tagline}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#bbf451]">
                    <span>View Departures</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= FEATURED UPCOMING EVENTS ================= */}
      <section className="py-20 bg-[#081a11] border-y border-[#123321]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#bbf451]">
                <Calendar className="w-3.5 h-3.5" /> Next Departures
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Featured Upcoming Experiences
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#bbf451] hover:text-[#cdf879] transition-colors"
            >
              <span>View All Departures ({events.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#143e29] hover:bg-[#1b5237] border border-[#21573c] text-white font-bold text-sm transition-all"
            >
              Browse Full Calendar & Filter by Category →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= THE SOCIAL CLUB DIFFERENCE ================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
              Why Social Club?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              We replace awkward small talk with unforgettable summits.
            </h2>
            <p className="text-sm sm:text-base text-[#9bb3a6] leading-relaxed">
              Most city outings revolve around crowded pubs, deafening noise, and fleeting interactions. 
              Social Club was built on a different belief: humans bond best when they walk together, 
              cook over campfires, spot shooting stars, and conquer physical challenges as a team.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#143e29] text-[#bbf451] flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold text-sm">65% Solo Explorers</h4>
                <p className="text-xs text-[#9bb3a6]">
                  Don&apos;t wait for your friends to agree on plans. Most of us sign up solo and leave as best friends.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#143e29] text-[#bbf451] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold text-sm">Certified Safety</h4>
                <p className="text-xs text-[#9bb3a6]">
                  WFR (Wilderness First Responder) certified leaders, medical kits, and vetted eco-stays.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#143e29] text-[#bbf451] flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold text-sm">Zero Hidden Fees</h4>
                <p className="text-xs text-[#9bb3a6]">
                  Forest permits, guided assistance, transport, and meals clearly itemized upfront.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#143e29] text-[#bbf451] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold text-sm">Zero-Litter Ethos</h4>
                <p className="text-xs text-[#9bb3a6]">
                  Strict Leave No Trace principles. We collect trash along every trail we traverse.
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden border border-[#1b3d2c] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=80"
              alt="Group of young adults laughing around campfire in the forest"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06150e] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#06150e]/90 backdrop-blur-md border border-[#1b3d2c]">
              <span className="text-[11px] font-bold text-[#bbf451] uppercase tracking-wider block">
                The Social Club Guarantee
              </span>
              <p className="text-xs text-white mt-1">
                &quot;You arrive as a stranger on Friday night; you return with lifelong trekking companions on Sunday.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY TESTIMONIALS ================= */}
      <section className="py-20 bg-[#081a11] border-t border-[#123321]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
              Stories from the Trail
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Real Experiences from Our Members
            </h2>
            <p className="text-sm text-[#9bb3a6] max-w-xl mx-auto">
              Over 4,500+ participants have shared mountain peaks and bonfires with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] flex flex-col justify-between space-y-4 shadow-lg hover:border-[#bbf451]/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#d4e4dc] leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#143e29] flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                    <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold text-white">{t.author}</h5>
                    <p className="text-[11px] text-[#86a394]">{t.role}</p>
                    <span className="text-[10px] text-[#bbf451] font-semibold block">{t.trip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY CONNECT BANNER ================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d281a] via-[#143e29] to-[#0d281a] border border-[#21573c] p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#bbf451] text-[#06150e] flex items-center justify-center font-black mx-auto shadow-lg shadow-[#bbf451]/20">
            <Compass className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Ready to leave the screen behind?
            </h2>
            <p className="text-sm sm:text-base text-[#c2d7cc]">
              Join our WhatsApp community for instant trip announcements, ride-shares, and gear swaps.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://chat.whatsapp.com/demo-socialclub-community"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              Join WhatsApp Community
            </a>
            <a
              href="https://instagram.com/socialclub.community"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1b4d36] hover:bg-[#256c4c] border border-[#2d815b] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <InstagramIcon className="w-5 h-5 text-[#ff5f8f]" />
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
