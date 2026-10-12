"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Menu, X, Ticket, Shield } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0a1c13]/90 backdrop-blur-md border-b border-[#1b3d2c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#bbf451] text-[#06150e] flex items-center justify-center font-black transition-transform group-hover:scale-105 shadow-md shadow-[#bbf451]/20">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-white flex items-center gap-1.5 font-sans">
                SOCIAL CLUB
                <span className="w-2 h-2 rounded-full bg-[#bbf451] inline-block animate-pulse"></span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#a8c2b3] font-medium">
                Find Your People. Live More.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/events"
              className="text-sm font-semibold text-[#e1eee7] hover:text-[#bbf451] transition-colors"
            >
              Explore Events
            </Link>
            <Link
              href="/events?category=trekking"
              className="text-sm font-semibold text-[#a8c2b3] hover:text-white transition-colors"
            >
              Treks & Hikes
            </Link>
            <Link
              href="/events?category=camping"
              className="text-sm font-semibold text-[#a8c2b3] hover:text-white transition-colors"
            >
              Camping
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-[#a8c2b3] hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/my-bookings"
              className="text-sm font-semibold text-[#a8c2b3] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Ticket className="w-4 h-4 text-[#bbf451]" />
              My Bookings
            </Link>
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-full bg-[#bbf451] text-[#06150e] text-sm font-bold tracking-tight hover:bg-[#cdf879] active:scale-95 transition-all shadow-md shadow-[#bbf451]/20"
            >
              Join Next Adventure
            </Link>
            <Link
              href="/admin"
              title="Admin Portal"
              className="p-2 text-[#7f998a] hover:text-[#bbf451] transition-colors"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/my-bookings"
              className="p-2 text-[#bbf451] hover:text-white"
              title="My Bookings"
            >
              <Ticket className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#e1eee7] hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d281a] border-b border-[#1b3d2c] px-6 pt-4 pb-8 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 font-semibold text-base">
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#bbf451] py-2 border-b border-[#1b3d2c]"
            >
              Explore All Events
            </Link>
            <Link
              href="/events?category=trekking"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white py-2 border-b border-[#1b3d2c]"
            >
              Mountain Treks
            </Link>
            <Link
              href="/events?category=camping"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white py-2 border-b border-[#1b3d2c]"
            >
              Overnight Camps
            </Link>
            <Link
              href="/events?category=roadtrip"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white py-2 border-b border-[#1b3d2c]"
            >
              Road Trips
            </Link>
            <Link
              href="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white py-2 border-b border-[#1b3d2c] flex items-center justify-between"
            >
              <span>My Bookings Lookup</span>
              <Ticket className="w-4 h-4 text-[#bbf451]" />
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white py-2 border-b border-[#1b3d2c]"
            >
              About Social Club
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white py-2 border-b border-[#1b3d2c]"
            >
              Contact & WhatsApp
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-zinc-400 py-2 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" /> Admin Management
            </Link>
          </div>
          <div className="pt-2">
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-xl bg-[#bbf451] text-[#06150e] font-bold text-sm"
            >
              Book an Experience
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
