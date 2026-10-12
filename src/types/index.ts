export type EventCategory = 'trekking' | 'camping' | 'roadtrip' | 'meetup' | 'special';

export type EventDifficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Strenuous' | 'All Levels';

export type EventStatus = 'draft' | 'published' | 'sold_out' | 'completed' | 'cancelled';

export interface ItineraryItem {
  day: string;
  time?: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface OrganizerContact {
  name: string;
  phone: string;
  email: string;
  whatsapp_group_link?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: EventCategory;
  description: string;
  cover_image: string;
  gallery_images: string[];
  start_date: string; // ISO string
  end_date: string; // ISO string
  duration_label: string; // e.g. "2 Days, 1 Night"
  destination: string;
  meeting_point: string;
  travel_mode: string;
  difficulty: EventDifficulty;
  price_per_person: number; // in INR
  total_capacity: number;
  booked_seats: number;
  registration_deadline: string; // ISO string
  status: EventStatus;
  is_featured: boolean;
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  things_to_bring: string[];
  safety_instructions: string[];
  cancellation_policy: string;
  faqs: FAQItem[];
  organizer: OrganizerContact;
  created_at: string;
  updated_at: string;
}

export interface ParticipantInfo {
  name: string;
  age?: number;
  gender?: string;
  notes?: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'free' | 'manually_verified';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Booking {
  id: string;
  booking_ref: string; // Unique human reference: SC-2026-XXXX
  event_id: string;
  event_title: string;
  event_date: string;
  event_destination: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  num_participants: number;
  participants: ParticipantInfo[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  terms_accepted: boolean;
  safety_waiver_accepted: boolean;
  total_amount: number; // in INR
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  cancellation_requested?: boolean;
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  booking_id: string;
  booking_ref: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  method?: string;
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source?: string;
  created_at: string;
}
