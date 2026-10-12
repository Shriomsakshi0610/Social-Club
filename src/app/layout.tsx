import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOCIAL CLUB | Find Your People. Live More.",
  description:
    "Social Club organizes mountain treks, overnight lakeside camping trips, scenic road trips, and curated social meetups. Less Scrolling. More Living.",
  keywords: [
    "Social Club",
    "Trekking community",
    "Weekend trips",
    "Camping in India",
    "Kudremukh trek",
    "Pawna lake camping",
    "Solo travelers community",
    "Outdoor adventures"
  ],
  authors: [{ name: "Social Club Expeditions" }],
  openGraph: {
    title: "SOCIAL CLUB | Find Your People. Live More.",
    description: "Join curated mountain treks, lakeside campouts, and welcoming community meetups.",
    url: "https://socialclub.org",
    siteName: "SOCIAL CLUB",
    locale: "en_IN",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#06150e] text-[#cbdad1]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
