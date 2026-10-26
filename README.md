# 🌲 SOCIAL CLUB

> **"Less Scrolling. More Living."**  
> **"Find Your People. Live More."**

A full-stack, responsive web application for **SOCIAL CLUB**, an outdoor adventure and social experience organizing community. Built with Next.js (App Router), TypeScript, Tailwind CSS, dual-engine data persistence (local auto-initializing repository with seamless Supabase PostgreSQL integration), Razorpay payments, and an administrative control panel.

---

## 🌟 Key Highlights & Features

### 1. 🏔️ Public Experience & Discovery
- **Hero & Storytelling**: Editorial adventure brand aesthetic with forest green (`#06150e`), sand stone, and vibrant lime accents (`#bbf451`).
- **Curated Category Explorer**: Trekking & Hiking, Lakeside Camping, Coastal Road Trips, and Social Meetups & Bouldering.
- **Dynamic Events Catalog (`/events`)**: Search by name or location, category tabs, sort by earliest date or price, and real-time seat availability indicator.
- **Rich Event Detail Pages (`/events/[slug]`)**:
  - Full itineraries with day-by-day and hour-by-hour milestones
  - "What's Included" and "What's Not Included"
  - Mandatory packing checklists ("Things to Bring")
  - Safety instructions & medical notes
  - Organizer contacts & WhatsApp group links
  - Sticky mobile & desktop booking CTAs

### 2. 🎟️ Registration & Booking Flow (`/events/[slug]/book`)
- Real-time seat allocation and overbooking prevention
- Dynamic price calculation based on ticket count
- Lead explorer contact details with mobile and email validation
- Individual attendee records (age, gender, dietary and health notes)
- Emergency contact information
- Mandatory terms of service & safety waiver acceptance
- Support for both **Free Events** (instant confirmation) and **Paid Events** (via Razorpay)

### 3. 💳 Razorpay Indian Payment Gateway
- **Safe Test Simulator**: Out of the box, developers and evaluators can complete bookings using the built-in Sandbox Simulator (supports UPI, Card, and Netbanking simulations).
- **Live Gateway Ready**: When `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are added to `.env.local`, the app uses the Razorpay SDK to create orders server-side and cryptographically verifies webhook/client signatures via HMAC-SHA256 (`crypto.createHmac`).
- Prevents idempotency duplicates and deducts remaining event capacity atomically upon confirmed verification.

### 4. 🎫 Boarding Pass Confirmation (`/booking/confirmation`)
- Festive celebration confetti on booking confirmation
- Unique booking reference code (e.g. `SC-2026-X8K9`)
- Printable and downloadable digital boarding pass (`window.print()`)
- One-click Google Calendar event generator
- Direct WhatsApp trip group join link

### 5. 🔍 Participant Self-Service Portal (`/my-bookings`)
- Secure participant lookup by Booking Reference + registered Email/Phone
- Strictly displays only the traveler's own reservation without exposing other participants' data
- Cancellation request flow with reason submission according to event cancellation policy

### 6. 🛡️ Secure Admin Control Panel (`/admin`)
- Protected by master passcode (`ADMIN_SECRET_KEY`, default: `socialclub2026`) with secure HTTP-only cookies
- **Overview Dashboard**: Metrics for Total Revenue (₹), Total Bookings, Total Attendees, and Active Expeditions
- **Events Manager**: Create new events, edit prices/capacities/deadlines, publish/unpublish, and delete events
- **Bookings & Attendees Manager**:
  - Filter bookings by event and payment status
  - Search by explorer name, email, or reference
  - View individual participant details, dietary notes, and emergency contacts
  - Manual payment verification toggle (mark offline cash / UPI verified)
  - **Export Attendees CSV**: One-click attendee list export for trip leaders and forest permits

### 7. ⚖️ Community & Legal Pages
- `/about` — Origin story, mission, and the 4 non-negotiable community pillars
- `/contact` — Interactive validated inquiry form, helpline, and WhatsApp community links
- `/cancellation-refund-policy` — Slabs (7+ days, 3-6 days, <48h) and reversal guidelines
- `/safety-waiver` — Outdoor participation and safety disclaimer
- `/terms` & `/privacy-policy` — Code of conduct, zero-litter policy, and data handling

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server & Client Components)
- **Language**: TypeScript (strict types)
- **Styling**: Tailwind CSS v4 with custom forest green and lime design tokens
- **Icons**: Lucide React + custom SVG brand icons
- **Database Layer**:
  - **Local Resilient JSON Database**: Auto-initializes at `data/social_club_db.json` with seed events and sample bookings. Works out of the box with zero external dependencies.
  - **Supabase PostgreSQL**: Ready for managed cloud deployment with complete SQL schema migrations (`supabase/schema.sql`) including Row Level Security (RLS) policies and triggers.
- **Payments**: Razorpay Node SDK with cryptographic signature verification and sandbox simulator fallback
- **Voucher Effects**: Canvas Confetti

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher; tested on v24)
- npm (v9 or higher)

### 2. Installation
Clone or navigate to the project directory:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default configuration in `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_SECRET_KEY=socialclub2026

# Optional: Add your Razorpay test keys for live checkout modal
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Optional: Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🔐 Admin Portal Access

1. Visit [http://localhost:3000/admin](http://localhost:3000/admin).
2. Enter the admin passcode:
   ```text
   socialclub2026
   ```
   *(Configurable via `ADMIN_SECRET_KEY` in `.env.local`)*
3. Manage events, view booking details, manually verify offline payments, and export attendee lists as CSV.

---

## 🗄️ Supabase PostgreSQL Setup (Optional for Cloud)

If you wish to use a hosted Supabase PostgreSQL database:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Open `supabase/schema.sql` from this repository and run the SQL script. This creates:
   - `events` table with constraints and indexes
   - `bookings` table with unique reference checks
   - `payments` table
   - `inquiries` and `subscribers` tables
   - Row-Level Security (RLS) policies and updated-at triggers
4. Copy your project URL and service role key into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 🧪 Testing the Booking & Payment Flow

1. Go to the Home Page or `/events`.
2. Click **Book** on any event (e.g. *Kudremukh Peak Trek* or *Sunday Sunrise Coffee*).
3. Fill in your details (name, email, phone, emergency contact) and accept the waiver.
4. For paid events, click **Proceed to Payment**:
   - The Razorpay checkout modal opens.
   - In test mode, select your preferred method (UPI, Card, or Netbanking) and click **Pay & Confirm Spot**.
   - The backend validates the signature, marks the booking as paid, and deducts the available seats atomically.
5. You will be redirected to the **Booking Confirmation Page** with your unique reference (e.g., `SC-2026-X8K9`).
6. Test lookup: Go to `/my-bookings` and enter your reference code and email to inspect or manage your booking!

