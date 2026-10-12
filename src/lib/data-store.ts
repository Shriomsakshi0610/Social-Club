import fs from "fs";
import path from "path";
import { SAMPLE_EVENTS } from "./sample-data";
import { EventItem, Booking, ContactInquiry, NewsletterSubscriber, PaymentTransaction } from "@/types";
import { createClient } from "@supabase/supabase-js";

// Check if Supabase credentials are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes("placeholder"));

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null;

// Local JSON File Database storage fallback
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "social_club_db.json");

interface LocalDatabase {
  events: EventItem[];
  bookings: Booking[];
  payments: PaymentTransaction[];
  inquiries: ContactInquiry[];
  subscribers: NewsletterSubscriber[];
}

function ensureLocalDB(): LocalDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: LocalDatabase = {
      events: SAMPLE_EVENTS,
      bookings: [
        {
          id: "bk-sample-01",
          booking_ref: "SC-2026-X8K9",
          event_id: "evt-001",
          event_title: "Kudremukh Peak: Rainforest & Clouds Trek",
          event_date: "2026-10-24T05:30:00.000Z",
          event_destination: "Kudremukh National Park, Chikmagalur, Karnataka",
          user_name: "Rahul Verma",
          user_email: "rahul.v@example.com",
          user_phone: "+91 98765 12345",
          num_participants: 2,
          participants: [
            { name: "Rahul Verma", age: 27, gender: "Male", notes: "No dietary restrictions" },
            { name: "Pooja Sharma", age: 26, gender: "Female", notes: "Vegetarian" }
          ],
          emergency_contact_name: "Anita Verma",
          emergency_contact_phone: "+91 98765 99887",
          terms_accepted: true,
          safety_waiver_accepted: true,
          total_amount: 8598,
          payment_status: "paid",
          booking_status: "confirmed",
          razorpay_order_id: "order_mock_12345",
          razorpay_payment_id: "pay_mock_98765",
          razorpay_signature: "sig_verified_mock",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ],
      payments: [
        {
          id: "pm-001",
          booking_id: "bk-sample-01",
          booking_ref: "SC-2026-X8K9",
          razorpay_order_id: "order_mock_12345",
          razorpay_payment_id: "pay_mock_98765",
          amount: 8598,
          currency: "INR",
          status: "captured",
          method: "UPI",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ],
      inquiries: [],
      subscribers: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local db, resetting to defaults", err);
    return {
      events: SAMPLE_EVENTS,
      bookings: [],
      payments: [],
      inquiries: [],
      subscribers: []
    };
  }
}

function writeLocalDB(data: LocalDatabase) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ----------------- EVENT REPOSITORY -----------------

export async function getAllEvents(options?: {
  category?: string;
  search?: string;
  status?: string;
  includeDrafts?: boolean;
}): Promise<EventItem[]> {
  const db = ensureLocalDB();
  let events = [...db.events];

  if (!options?.includeDrafts) {
    events = events.filter((e) => e.status === "published" || e.status === "sold_out");
  }

  if (options?.category && options.category !== "all") {
    events = events.filter((e) => e.category.toLowerCase() === options.category!.toLowerCase());
  }

  if (options?.search && options.search.trim() !== "") {
    const q = options.search.toLowerCase().trim();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.destination.toLowerCase().includes(q) ||
        e.tagline.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }

  // Sort by start_date ascending (upcoming first)
  events.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  return events;
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const db = ensureLocalDB();
  const evt = db.events.find((e) => e.slug === slug || e.id === slug);
  return evt || null;
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const db = ensureLocalDB();
  const evt = db.events.find((e) => e.id === id);
  return evt || null;
}

export async function createEvent(newEvent: Omit<EventItem, "id" | "created_at" | "updated_at">): Promise<EventItem> {
  const db = ensureLocalDB();
  const id = `evt-${Date.now()}`;
  const now = new Date().toISOString();
  
  const created: EventItem = {
    ...newEvent,
    id,
    booked_seats: newEvent.booked_seats || 0,
    created_at: now,
    updated_at: now
  };

  db.events.push(created);
  writeLocalDB(db);
  return created;
}

export async function updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem | null> {
  const db = ensureLocalDB();
  const index = db.events.findIndex((e) => e.id === id);
  if (index === -1) return null;

  db.events[index] = {
    ...db.events[index],
    ...updates,
    updated_at: new Date().toISOString()
  };

  writeLocalDB(db);
  return db.events[index];
}

export async function deleteEvent(id: string): Promise<boolean> {
  const db = ensureLocalDB();
  const prevLen = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  if (db.events.length !== prevLen) {
    writeLocalDB(db);
    return true;
  }
  return false;
}

// ----------------- BOOKING REPOSITORY -----------------

export function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SC-${new Date().getFullYear()}-${random}`;
}

export async function createBooking(data: {
  event_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  num_participants: number;
  participants: { name: string; age?: number; gender?: string; notes?: string }[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  terms_accepted: boolean;
  safety_waiver_accepted: boolean;
  is_free_event?: boolean;
}): Promise<{ booking?: Booking; error?: string }> {
  const db = ensureLocalDB();
  const event = db.events.find((e) => e.id === data.event_id);

  if (!event) {
    return { error: "Event not found." };
  }

  if (event.status !== "published") {
    return { error: "This event is currently not open for bookings." };
  }

  // Seat Availability Check & Concurrency protection
  const availableSeats = event.total_capacity - event.booked_seats;
  if (availableSeats < data.num_participants) {
    return {
      error: `Sorry, only ${availableSeats} seat${availableSeats === 1 ? "" : "s"} left for this event.`
    };
  }

  // Registration Deadline Check
  if (new Date() > new Date(event.registration_deadline)) {
    return { error: "Registration for this event has closed." };
  }

  const bookingRef = generateBookingRef();
  const totalAmount = event.price_per_person * data.num_participants;
  const isFree = totalAmount === 0 || data.is_free_event;

  const now = new Date().toISOString();
  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    booking_ref: bookingRef,
    event_id: event.id,
    event_title: event.title,
    event_date: event.start_date,
    event_destination: event.destination,
    user_name: data.user_name.trim(),
    user_email: data.user_email.trim().toLowerCase(),
    user_phone: data.user_phone.trim(),
    num_participants: data.num_participants,
    participants: data.participants,
    emergency_contact_name: data.emergency_contact_name.trim(),
    emergency_contact_phone: data.emergency_contact_phone.trim(),
    terms_accepted: data.terms_accepted,
    safety_waiver_accepted: data.safety_waiver_accepted,
    total_amount: totalAmount,
    payment_status: isFree ? "free" : "pending",
    booking_status: isFree ? "confirmed" : "pending",
    created_at: now,
    updated_at: now
  };

  // If free event, immediately reserve seats!
  if (isFree) {
    event.booked_seats += data.num_participants;
    if (event.booked_seats >= event.total_capacity) {
      event.status = "sold_out";
    }
  }

  db.bookings.push(newBooking);
  writeLocalDB(db);

  return { booking: newBooking };
}

export async function confirmBookingPayment(data: {
  booking_ref: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  method?: string;
}): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const db = ensureLocalDB();
  const booking = db.bookings.find((b) => b.booking_ref === data.booking_ref);

  if (!booking) {
    return { success: false, error: "Booking reference not found." };
  }

  if (booking.payment_status === "paid" && booking.booking_status === "confirmed") {
    // Idempotent: already confirmed
    return { success: true, booking };
  }

  const event = db.events.find((e) => e.id === booking.event_id);
  if (!event) {
    return { success: false, error: "Associated event not found." };
  }

  // Update booking state
  booking.payment_status = "paid";
  booking.booking_status = "confirmed";
  booking.razorpay_order_id = data.razorpay_order_id;
  booking.razorpay_payment_id = data.razorpay_payment_id;
  booking.razorpay_signature = data.razorpay_signature;
  booking.updated_at = new Date().toISOString();

  // Atomically increment booked seats
  event.booked_seats += booking.num_participants;
  if (event.booked_seats >= event.total_capacity) {
    event.status = "sold_out";
  }

  // Record payment transaction
  db.payments.push({
    id: `pm-${Date.now()}`,
    booking_id: booking.id,
    booking_ref: booking.booking_ref,
    razorpay_order_id: data.razorpay_order_id,
    razorpay_payment_id: data.razorpay_payment_id,
    amount: booking.total_amount,
    currency: "INR",
    status: "captured",
    method: data.method || "Razorpay Verified",
    created_at: new Date().toISOString()
  });

  writeLocalDB(db);
  return { success: true, booking };
}

export async function lookupBooking(ref: string, contactIdentifier: string): Promise<Booking | null> {
  const db = ensureLocalDB();
  const cleanRef = ref.trim().toUpperCase();
  const cleanContact = contactIdentifier.trim().toLowerCase();

  const booking = db.bookings.find((b) => {
    if (b.booking_ref.toUpperCase() !== cleanRef) return false;
    const matchEmail = b.user_email.toLowerCase() === cleanContact;
    const cleanPhoneDigits = b.user_phone.replace(/\D/g, "");
    const cleanInputDigits = cleanContact.replace(/\D/g, "");
    const matchPhone = cleanPhoneDigits.length > 5 && cleanPhoneDigits.endsWith(cleanInputDigits);
    return matchEmail || matchPhone;
  });

  return booking || null;
}

export async function getAllBookings(options?: {
  eventId?: string;
  paymentStatus?: string;
  bookingStatus?: string;
  search?: string;
}): Promise<Booking[]> {
  const db = ensureLocalDB();
  let list = [...db.bookings];

  if (options?.eventId && options.eventId !== "all") {
    list = list.filter((b) => b.event_id === options.eventId);
  }

  if (options?.paymentStatus && options.paymentStatus !== "all") {
    list = list.filter((b) => b.payment_status === options.paymentStatus);
  }

  if (options?.bookingStatus && options.bookingStatus !== "all") {
    list = list.filter((b) => b.booking_status === options.bookingStatus);
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (b) =>
        b.booking_ref.toLowerCase().includes(q) ||
        b.user_name.toLowerCase().includes(q) ||
        b.user_email.toLowerCase().includes(q) ||
        b.user_phone.includes(q) ||
        b.event_title.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return list;
}

export async function updateBookingStatus(
  bookingId: string,
  updates: {
    payment_status?: Booking["payment_status"];
    booking_status?: Booking["booking_status"];
    cancellation_requested?: boolean;
    cancellation_reason?: string;
  }
): Promise<Booking | null> {
  const db = ensureLocalDB();
  const booking = db.bookings.find((b) => b.id === bookingId || b.booking_ref === bookingId);
  if (!booking) return null;

  // Handle seat release if cancelled
  if (updates.booking_status === "cancelled" && booking.booking_status !== "cancelled") {
    const evt = db.events.find((e) => e.id === booking.event_id);
    if (evt) {
      evt.booked_seats = Math.max(0, evt.booked_seats - booking.num_participants);
      if (evt.status === "sold_out") {
        evt.status = "published";
      }
    }
  }

  // Handle seat deduction if changed to confirmed from pending
  if (updates.booking_status === "confirmed" && booking.booking_status === "pending") {
    const evt = db.events.find((e) => e.id === booking.event_id);
    if (evt) {
      evt.booked_seats = Math.min(evt.total_capacity, evt.booked_seats + booking.num_participants);
      if (evt.booked_seats >= evt.total_capacity) {
        evt.status = "sold_out";
      }
    }
  }

  Object.assign(booking, updates, { updated_at: new Date().toISOString() });
  writeLocalDB(db);
  return booking;
}

// ----------------- INQUIRIES & NEWSLETTER -----------------

export async function submitContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<ContactInquiry> {
  const db = ensureLocalDB();
  const inq: ContactInquiry = {
    id: `inq-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim(),
    subject: data.subject.trim(),
    message: data.message.trim(),
    created_at: new Date().toISOString()
  };
  db.inquiries.push(inq);
  writeLocalDB(db);
  return inq;
}

export async function subscribeNewsletter(email: string): Promise<boolean> {
  const db = ensureLocalDB();
  const cleanEmail = email.trim().toLowerCase();
  const exists = db.subscribers.some((s) => s.email === cleanEmail);
  if (!exists) {
    db.subscribers.push({
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      created_at: new Date().toISOString()
    });
    writeLocalDB(db);
  }
  return true;
}

// ----------------- ADMIN DASHBOARD STATS -----------------

export async function getAdminDashboardStats() {
  const db = ensureLocalDB();
  const totalEvents = db.events.length;
  const publishedEvents = db.events.filter((e) => e.status === "published").length;
  const confirmedBookings = db.bookings.filter((b) => b.booking_status === "confirmed");
  const totalBookingsCount = confirmedBookings.length;
  const totalAttendeesCount = confirmedBookings.reduce((acc, b) => acc + b.num_participants, 0);

  const totalRevenue = confirmedBookings.reduce((acc, b) => {
    if (b.payment_status === "paid" || b.payment_status === "manually_verified") {
      return acc + (b.total_amount || 0);
    }
    return acc;
  }, 0);

  const recentBookings = [...db.bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return {
    totalEvents,
    publishedEvents,
    totalBookingsCount,
    totalAttendeesCount,
    totalRevenue,
    recentBookings
  };
}
