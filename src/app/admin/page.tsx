"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Shield,
  Lock,
  Plus,
  Trash2,
  Edit,
  Download,
  Search,
  LogOut,
  AlertCircle
} from "lucide-react";
import { EventItem, Booking } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "bookings">("overview");
  const [stats, setStats] = useState<{
    totalEvents: number;
    publishedEvents: number;
    totalBookingsCount: number;
    totalAttendeesCount: number;
    totalRevenue: number;
    recentBookings: Booking[];
  } | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Event modal state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    tagline: "",
    category: "trekking",
    difficulty: "Moderate",
    price_per_person: 3999,
    total_capacity: 18,
    destination: "",
    meeting_point: "",
    travel_mode: "Private AC Tempo Traveller",
    start_date: "2026-11-20T06:00:00.000Z",
    end_date: "2026-11-21T21:00:00.000Z",
    duration_label: "2 Days, 1 Night",
    registration_deadline: "2026-11-18T23:59:00.000Z",
    cover_image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    description: "Join us for an exhilarating outdoor adventure with fellow community members.",
    status: "published",
    is_featured: false
  });

  // Booking detail view modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filters for Bookings tab
  const [bookingFilterEvent, setBookingFilterEvent] = useState("all");
  const [bookingFilterPayment, setBookingFilterPayment] = useState("all");
  const [bookingSearch, setBookingSearch] = useState("");

  const loadEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events?includeDrafts=true");
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const checkAuthAndLoad = useCallback(async () => {
    try {
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        setIsAuthenticated(true);
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        loadEvents();
        loadBookings();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, [loadEvents, loadBookings]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/stats")
      .then((res) => {
        if (!isMounted) return;
        if (res.ok) {
          setIsAuthenticated(true);
          res.json().then((statsData) => {
            if (isMounted) {
              setStats(statsData.stats);
              loadEvents();
              loadBookings();
            }
          });
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      });

    return () => {
      isMounted = false;
    };
  }, [loadEvents, loadBookings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passcode })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        checkAuthAndLoad();
      } else {
        setLoginError(data.error || "Invalid passcode.");
      }
    } catch {
      setLoginError("Login failed. Check server connection.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setPasscode("");
  };

  // Event create / edit
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEventId) {
        // Update
        const res = await fetch(`/api/events/${editingEventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventFormData)
        });
        if (res.ok) {
          setShowEventModal(false);
          loadEvents();
        }
      } else {
        // Create
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...eventFormData,
            gallery_images: [eventFormData.cover_image],
            itinerary: [
              {
                day: "Day 1",
                title: "Departure & Trailhead",
                description: "Meetup, team briefing, and commencement of the expedition."
              }
            ],
            inclusions: ["Guided safety support", "Forest entry tickets", "Group meals"],
            exclusions: ["Personal gear", "Personal expenses"],
            things_to_bring: ["Sturdy footwear", "Water bottle", "ID proof"],
            safety_instructions: ["Follow lead instructions", "Zero alcohol on trails"],
            cancellation_policy: "Standard Social Club cancellation policy applies.",
            faqs: [{ question: "Is this suitable for beginners?", answer: "Yes, all fitness levels welcome." }],
            organizer: {
              name: "Expedition Team",
              phone: "+91 98765 43210",
              email: "support@socialclub.org"
            }
          })
        });
        if (res.ok) {
          setShowEventModal(false);
          loadEvents();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Manual payment verification
  const handleMarkPaymentStatus = async (bookingId: string, newStatus: Booking["payment_status"]) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_status: newStatus,
          booking_status: newStatus === "paid" || newStatus === "manually_verified" ? "confirmed" : undefined
        })
      });
      if (res.ok) {
        loadBookings();
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev) => (prev ? { ...prev, payment_status: newStatus, booking_status: "confirmed" } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export for Attendees
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      alert("No bookings to export.");
      return;
    }

    const headers = [
      "Booking Ref",
      "Event Title",
      "Lead Name",
      "Email",
      "Phone",
      "Total Participants",
      "Participants Detail",
      "Amount (INR)",
      "Payment Status",
      "Booking Status",
      "Emergency Contact",
      "Created At"
    ];

    const rows = bookings.map((b) => [
      b.booking_ref,
      `"${b.event_title.replace(/"/g, '""')}"`,
      `"${b.user_name.replace(/"/g, '""')}"`,
      b.user_email,
      b.user_phone,
      b.num_participants,
      `"${(b.participants || []).map((p) => p.name).join("; ")}"`,
      b.total_amount,
      b.payment_status,
      b.booking_status,
      `"${b.emergency_contact_name} (${b.emergency_contact_phone})"`,
      b.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `social_club_attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ------------------ LOGIN SCREEN ------------------
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#06150e] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0b2015] border border-[#1b3d2c] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#143e29] text-[#bbf451] flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Social Club Admin</h1>
            <p className="text-xs text-[#9bb3a6]">
              Authorized personnel only. Enter the master admin passcode.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#c2d7cc]">Admin Passcode</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter passcode (default: socialclub2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 bg-[#06150e] border border-[#143e29] rounded-xl text-sm text-white focus:outline-none focus:border-[#bbf451]"
                />
                <Lock className="w-4 h-4 text-[#86a394] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-[#bbf451] hover:bg-[#cdf879] active:scale-95 text-[#06150e] font-black text-sm transition-all disabled:opacity-50 shadow-lg shadow-[#bbf451]/20"
            >
              {loginLoading ? "Verifying..." : "Enter Control Panel"}
            </button>

            <div className="p-3 rounded-xl bg-[#06150e] border border-[#143e29] text-[11px] text-[#86a394] text-center">
              Default password in <code>.env</code> is: <strong className="text-[#bbf451]">socialclub2026</strong>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#06150e] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#bbf451] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ------------------ DASHBOARD VIEW ------------------
  return (
    <div className="min-h-screen bg-[#06150e] text-[#cbdad1] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Navbar Header */}
        <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-2xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#bbf451] text-[#06150e] flex items-center justify-center font-black">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                SOCIAL CLUB OPERATIONS
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#143e29] text-[#bbf451] border border-[#21573c]">
                  Admin
                </span>
              </h1>
              <p className="text-xs text-[#86a394]">Trip Management, Bookings, & Attendee Lists</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingEventId(null);
                setEventFormData({
                  title: "",
                  tagline: "",
                  category: "trekking",
                  difficulty: "Moderate",
                  price_per_person: 3999,
                  total_capacity: 18,
                  destination: "",
                  meeting_point: "",
                  travel_mode: "Private AC Tempo Traveller",
                  start_date: new Date(Date.now() + 86400000 * 7).toISOString(),
                  end_date: new Date(Date.now() + 86400000 * 9).toISOString(),
                  duration_label: "2 Days, 1 Night",
                  registration_deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
                  cover_image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
                  description: "Join us for an exhilarating outdoor adventure with fellow community members.",
                  status: "published",
                  is_featured: false
                });
                setShowEventModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#bbf451] hover:bg-[#cdf879] text-[#06150e] font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-[#bbf451]/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add New Event
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-[#86a394] hover:text-white rounded-xl hover:bg-[#143e29] transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#143e29] pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "overview"
                ? "bg-[#143e29] text-[#bbf451] border border-[#21573c]"
                : "text-[#86a394] hover:text-white"
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "events"
                ? "bg-[#143e29] text-[#bbf451] border border-[#21573c]"
                : "text-[#86a394] hover:text-white"
            }`}
          >
            Events Manager ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "bookings"
                ? "bg-[#143e29] text-[#bbf451] border border-[#21573c]"
                : "text-[#86a394] hover:text-white"
            }`}
          >
            Bookings & Attendees ({bookings.length})
          </button>
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#86a394]">
                  Total Revenue (INR)
                </span>
                <div className="text-3xl font-black text-[#bbf451] flex items-center">
                  ₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}
                </div>
                <p className="text-[11px] text-[#86a394]">From verified & paid bookings</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#86a394]">
                  Confirmed Bookings
                </span>
                <div className="text-3xl font-black text-white">
                  {stats?.totalBookingsCount || 0}
                </div>
                <p className="text-[11px] text-[#86a394]">Total reservations placed</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#86a394]">
                  Total Attendees
                </span>
                <div className="text-3xl font-black text-white">
                  {stats?.totalAttendeesCount || 0}
                </div>
                <p className="text-[11px] text-[#86a394]">Individual seats allocated</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#86a394]">
                  Active Expeditions
                </span>
                <div className="text-3xl font-black text-white">
                  {stats?.publishedEvents || 0} / {stats?.totalEvents || 0}
                </div>
                <p className="text-[11px] text-[#86a394]">Published departures</p>
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white">Recent Registrations</h3>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-bold text-[#bbf451] hover:underline"
                >
                  View All Bookings →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#06150e] text-[#86a394] uppercase tracking-wider border-b border-[#143e29]">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Lead Explorer</th>
                      <th className="p-3">Event</th>
                      <th className="p-3">Seats</th>
                      <th className="p-3">Total (₹)</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#143e29]">
                    {(stats?.recentBookings || []).map((b) => (
                      <tr key={b.id} className="hover:bg-[#06150e]/50">
                        <td className="p-3 font-mono font-bold text-[#bbf451]">{b.booking_ref}</td>
                        <td className="p-3 font-semibold text-white">{b.user_name}</td>
                        <td className="p-3 text-[#9bb3a6] line-clamp-1">{b.event_title}</td>
                        <td className="p-3">{b.num_participants}</td>
                        <td className="p-3 font-bold text-white">₹{b.total_amount.toLocaleString("en-IN")}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              b.payment_status === "paid" || b.payment_status === "free"
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-amber-950 text-amber-300 border border-amber-800"
                            }`}
                          >
                            {b.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EVENTS MANAGER ================= */}
        {activeTab === "events" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">All Events & Expeditions</h2>
              <span className="text-xs text-[#86a394]">{events.length} Total</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                      <Image src={evt.cover_image} alt={evt.title} fill className="object-cover" />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold uppercase text-[#bbf451]">
                          {evt.category}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white">
                          {evt.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-white text-base line-clamp-1">{evt.title}</h4>
                      <p className="text-xs text-[#86a394] line-clamp-1">{evt.destination}</p>
                    </div>

                    <div className="flex justify-between text-xs text-[#9bb3a6] pt-1">
                      <span>Seats: {evt.booked_seats} / {evt.total_capacity}</span>
                      <span className="font-bold text-white">
                        {evt.price_per_person === 0 ? "FREE" : `₹${evt.price_per_person.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#143e29] flex items-center justify-between">
                    <a
                      href={`/events/${evt.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-[#bbf451] hover:underline"
                    >
                      View Page ↗
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingEventId(evt.id);
                          setEventFormData({
                            title: evt.title,
                            tagline: evt.tagline,
                            category: evt.category,
                            difficulty: evt.difficulty,
                            price_per_person: evt.price_per_person,
                            total_capacity: evt.total_capacity,
                            destination: evt.destination,
                            meeting_point: evt.meeting_point,
                            travel_mode: evt.travel_mode,
                            start_date: evt.start_date,
                            end_date: evt.end_date,
                            duration_label: evt.duration_label,
                            registration_deadline: evt.registration_deadline,
                            cover_image: evt.cover_image,
                            description: evt.description,
                            status: evt.status,
                            is_featured: evt.is_featured
                          });
                          setShowEventModal(true);
                        }}
                        className="p-1.5 text-[#86a394] hover:text-white rounded-lg hover:bg-[#143e29]"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: BOOKINGS MANAGER ================= */}
        {activeTab === "bookings" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter & Actions Bar */}
            <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-3.5 h-3.5 text-[#86a394] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, ref, email..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-xs text-white placeholder-[#6f8a7c] focus:outline-none"
                  />
                </div>

                {/* Filter Event */}
                <select
                  value={bookingFilterEvent}
                  onChange={(e) => setBookingFilterEvent(e.target.value)}
                  className="bg-[#06150e] border border-[#143e29] text-white text-xs rounded-xl px-3 py-2 focus:outline-none max-w-xs"
                >
                  <option value="all">All Expeditions</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                    </option>
                  ))}
                </select>

                {/* Filter Payment */}
                <select
                  value={bookingFilterPayment}
                  onChange={(e) => setBookingFilterPayment(e.target.value)}
                  className="bg-[#06150e] border border-[#143e29] text-white text-xs rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="free">Free</option>
                  <option value="manually_verified">Manually Verified</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              {/* CSV Export Button */}
              <button
                onClick={handleExportCSV}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-[#143e29] hover:bg-[#1f5c3d] text-white border border-[#21573c] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-[#bbf451]" />
                Export Attendees (CSV)
              </button>
            </div>

            {/* Bookings Table */}
            <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#06150e] text-[#86a394] uppercase tracking-wider border-b border-[#143e29]">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Lead Traveler</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Event</th>
                      <th className="p-3">Spots</th>
                      <th className="p-3">Total (₹)</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Booking</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#143e29]">
                    {bookings
                      .filter((b) => {
                        if (bookingFilterEvent !== "all" && b.event_id !== bookingFilterEvent) return false;
                        if (bookingFilterPayment !== "all" && b.payment_status !== bookingFilterPayment) return false;
                        if (bookingSearch.trim()) {
                          const q = bookingSearch.toLowerCase();
                          return (
                            b.booking_ref.toLowerCase().includes(q) ||
                            b.user_name.toLowerCase().includes(q) ||
                            b.user_email.toLowerCase().includes(q) ||
                            b.user_phone.includes(q)
                          );
                        }
                        return true;
                      })
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-[#06150e]/50">
                          <td className="p-3 font-mono font-bold text-[#bbf451]">{b.booking_ref}</td>
                          <td className="p-3 font-bold text-white">{b.user_name}</td>
                          <td className="p-3 text-[#9bb3a6]">
                            <div>{b.user_email}</div>
                            <div className="text-[10px]">{b.user_phone}</div>
                          </td>
                          <td className="p-3 text-white max-w-xs truncate">{b.event_title}</td>
                          <td className="p-3 font-bold text-center">{b.num_participants}</td>
                          <td className="p-3 font-bold text-white">₹{b.total_amount.toLocaleString("en-IN")}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                b.payment_status === "paid" || b.payment_status === "manually_verified"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : b.payment_status === "free"
                                  ? "bg-purple-950 text-purple-300 border border-purple-800"
                                  : "bg-amber-950 text-amber-300 border border-amber-800"
                              }`}
                            >
                              {b.payment_status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                b.booking_status === "confirmed"
                                  ? "text-[#bbf451]"
                                  : b.booking_status === "cancelled"
                                  ? "text-rose-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {b.booking_status}
                            </span>
                            {b.cancellation_requested && (
                              <span className="block text-[9px] text-amber-300 font-bold">Cancel Req.</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="px-2.5 py-1 rounded bg-[#143e29] hover:bg-[#1f5c3d] text-white text-[11px] font-bold"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: EVENT CREATE / EDIT ================= */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 text-white shadow-2xl">
            <h3 className="text-xl font-black">{editingEventId ? "Edit Expedition" : "Add New Expedition"}</h3>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Tagline *</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.tagline}
                    onChange={(e) => setEventFormData({ ...eventFormData, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Category</label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  >
                    <option value="trekking">Trekking</option>
                    <option value="camping">Camping</option>
                    <option value="roadtrip">Road Trip</option>
                    <option value="meetup">Social Meetup</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Difficulty</label>
                  <select
                    value={eventFormData.difficulty}
                    onChange={(e) => setEventFormData({ ...eventFormData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Price per Person (₹)</label>
                  <input
                    type="number"
                    value={eventFormData.price_per_person}
                    onChange={(e) => setEventFormData({ ...eventFormData, price_per_person: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Total Capacity (Seats)</label>
                  <input
                    type="number"
                    value={eventFormData.total_capacity}
                    onChange={(e) => setEventFormData({ ...eventFormData, total_capacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Destination *</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.destination}
                    onChange={(e) => setEventFormData({ ...eventFormData, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Meeting Point *</label>
                  <input
                    type="text"
                    required
                    value={eventFormData.meeting_point}
                    onChange={(e) => setEventFormData({ ...eventFormData, meeting_point: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Cover Image URL</label>
                  <input
                    type="url"
                    value={eventFormData.cover_image}
                    onChange={(e) => setEventFormData({ ...eventFormData, cover_image: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Description</label>
                  <textarea
                    rows={4}
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#06150e] border border-[#143e29] rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#143e29]">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#06150e] hover:bg-[#143e29]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#bbf451] text-[#06150e] font-black hover:bg-[#cdf879]"
                >
                  Save Expedition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: BOOKING PARTICIPANT DETAILS ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b2015] border border-[#1b3d2c] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-white shadow-2xl">
            <div className="flex justify-between items-start border-b border-[#143e29] pb-4">
              <div>
                <span className="text-xs font-mono text-[#bbf451]">{selectedBooking.booking_ref}</span>
                <h3 className="text-lg font-black">{selectedBooking.user_name}</h3>
                <p className="text-xs text-[#86a394]">{selectedBooking.event_title}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-[#86a394] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#06150e] rounded-xl">
                <div>
                  <span className="text-[#86a394] block">Email</span>
                  <span className="font-bold">{selectedBooking.user_email}</span>
                </div>
                <div>
                  <span className="text-[#86a394] block">Phone</span>
                  <span className="font-bold">{selectedBooking.user_phone}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[#86a394] block">Emergency Name</span>
                  <span className="font-bold">{selectedBooking.emergency_contact_name}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[#86a394] block">Emergency Phone</span>
                  <span className="font-bold">{selectedBooking.emergency_contact_phone}</span>
                </div>
              </div>

              <div>
                <span className="text-[#86a394] font-bold block mb-1">
                  Participants ({selectedBooking.num_participants}):
                </span>
                <div className="space-y-1">
                  {selectedBooking.participants?.map((p, idx) => (
                    <div key={idx} className="p-2 bg-[#06150e] rounded-lg">
                      <strong>{p.name}</strong> {p.age ? `(${p.age}y)` : ""} {p.notes ? `• ${p.notes}` : ""}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#143e29] flex flex-wrap gap-2 justify-end">
                {selectedBooking.payment_status !== "paid" && (
                  <button
                    onClick={() => handleMarkPaymentStatus(selectedBooking.id, "manually_verified")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Mark Verified / Paid Offline
                  </button>
                )}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#143e29] text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
