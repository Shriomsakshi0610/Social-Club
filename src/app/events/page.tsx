"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Mountain, Tent, Car, Coffee, Compass, RotateCcw } from "lucide-react";
import EventCard from "@/components/EventCard";
import { EventItem, EventCategory } from "@/types";

export default function EventsListingPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date_asc" | "price_asc" | "price_desc">("date_asc");

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const res = await fetch("/api/events");
        const data = await res.json();
        if (res.ok) {
          setEvents(data.events || []);
        } else {
          setError(data.error || "Failed to load events");
        }
      } catch {
        setError("Network connection error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const categories: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: "All Experiences", value: "all", icon: Compass },
    { label: "Trekking & Hikes", value: "trekking", icon: Mountain },
    { label: "Camping", value: "camping", icon: Tent },
    { label: "Road Trips", value: "roadtrip", icon: Car },
    { label: "Social Meetups", value: "meetup", icon: Coffee }
  ];

  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter(
        (e) => e.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.destination.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.price_per_person - b.price_per_person;
      if (sortBy === "price_desc") return b.price_per_person - a.price_per_person;
      // Default: date_asc
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });

    return result;
  }, [events, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("date_asc");
  };

  return (
    <div className="bg-[#06150e] text-[#cbdad1] min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
          Upcoming Departures
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Explore Adventures & Social Trips
        </h1>
        <p className="text-sm sm:text-base text-[#9bb3a6]">
          All trips include certified wilderness leaders, curated small groups, and full logistics.
          Solo travelers are warmly welcomed!
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#86a394] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mountains, lakes, road trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-sm text-white placeholder-[#6f8a7c] focus:outline-none focus:border-[#bbf451]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#86a394] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-[#86a394] flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#bbf451]" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date_asc" | "price_asc" | "price_desc")}
              className="bg-[#06150e] border border-[#143e29] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#bbf451]"
            >
              <option value="date_asc">Earliest Upcoming</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-[#143e29]">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value as EventCategory | "all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-tight whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#bbf451] text-[#06150e] shadow-md shadow-[#bbf451]/20 font-black"
                    : "bg-[#06150e] text-[#86a394] hover:text-white hover:bg-[#143e29] border border-[#143e29]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[#0b2015] border border-[#1a442d] rounded-2xl h-96 animate-pulse p-4 space-y-4"
            >
              <div className="w-full h-48 bg-[#06150e] rounded-xl" />
              <div className="h-6 bg-[#143e29] rounded w-3/4" />
              <div className="h-4 bg-[#143e29] rounded w-1/2" />
              <div className="h-8 bg-[#06150e] rounded w-full pt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-950/40 border border-rose-800 rounded-2xl space-y-3">
          <p className="text-rose-300 font-bold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : filteredEvents.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center bg-[#0b2015] border border-[#1b3d2c] rounded-2xl p-8 space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#143e29] text-[#bbf451] flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">No experiences match your criteria</h3>
          <p className="text-xs text-[#9bb3a6]">
            Try clearing your search term or exploring another adventure category.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bbf451] text-[#06150e] text-xs font-black hover:bg-[#cdf879] transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#86a394]">
            <span>
              Showing <strong className="text-white">{filteredEvents.length}</strong> outdoor experiences
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
