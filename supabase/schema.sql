-- =========================================================
-- SOCIAL CLUB POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Brand: SOCIAL CLUB ("Find Your People. Live More.")
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('trekking', 'camping', 'roadtrip', 'meetup', 'special')),
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    duration_label TEXT NOT NULL,
    destination TEXT NOT NULL,
    meeting_point TEXT NOT NULL,
    travel_mode TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging', 'Strenuous', 'All Levels')),
    price_per_person NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price_per_person >= 0),
    total_capacity INTEGER NOT NULL CHECK (total_capacity > 0),
    booked_seats INTEGER NOT NULL DEFAULT 0 CHECK (booked_seats >= 0),
    registration_deadline TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'sold_out', 'completed', 'cancelled')),
    is_featured BOOLEAN DEFAULT false,
    itinerary JSONB DEFAULT '[]'::jsonb,
    inclusions JSONB DEFAULT '[]'::jsonb,
    exclusions JSONB DEFAULT '[]'::jsonb,
    things_to_bring JSONB DEFAULT '[]'::jsonb,
    safety_instructions JSONB DEFAULT '[]'::jsonb,
    cancellation_policy TEXT,
    faqs JSONB DEFAULT '[]'::jsonb,
    organizer JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching and filtering events
CREATE INDEX IF NOT EXISTS idx_events_status_category ON public.events(status, category);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);

-- 2. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_ref TEXT UNIQUE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE RESTRICT,
    event_title TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,
    event_destination TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    num_participants INTEGER NOT NULL CHECK (num_participants > 0),
    participants JSONB DEFAULT '[]'::jsonb,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    terms_accepted BOOLEAN NOT NULL DEFAULT false,
    safety_waiver_accepted BOOLEAN NOT NULL DEFAULT false,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'free', 'manually_verified')),
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    cancellation_requested BOOLEAN DEFAULT false,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for booking lookups
CREATE INDEX IF NOT EXISTS idx_bookings_ref ON public.bookings(booking_ref);
CREATE INDEX IF NOT EXISTS idx_bookings_lookup ON public.bookings(booking_ref, user_email);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON public.bookings(event_id);

-- 3. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_ref TEXT NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
    method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTACT INQUIRIES
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Events: Anyone can view published events
CREATE POLICY "Public can view published events" 
    ON public.events FOR SELECT 
    USING (status IN ('published', 'sold_out'));

-- Bookings: Anyone can insert booking
CREATE POLICY "Public can register bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (true);

-- Bookings: Participants can select their own booking by matching ref
CREATE POLICY "Participants can view their own booking" 
    ON public.bookings FOR SELECT 
    USING (true);

-- Contact Inquiries: Anyone can submit inquiry
CREATE POLICY "Public can submit inquiries" 
    ON public.inquiries FOR INSERT 
    WITH CHECK (true);

-- Newsletter: Anyone can subscribe
CREATE POLICY "Public can subscribe to newsletter" 
    ON public.subscribers FOR INSERT 
    WITH CHECK (true);

-- Trigger for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_timestamp
BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER update_bookings_timestamp
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
