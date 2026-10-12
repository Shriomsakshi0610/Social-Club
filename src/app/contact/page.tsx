"use client";

import React, { useState } from "react";
import { Mail, Phone, MessageCircle, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { InstagramIcon } from "@/components/Icons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Question",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Question",
          message: ""
        });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Failed to send inquiry.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="bg-[#06150e] text-[#cbdad1] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#bbf451]">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Have Questions? We&apos;re Here.
          </h1>
          <p className="text-sm sm:text-base text-[#9bb3a6]">
            Whether you want to inquire about custom corporate retreats, fitness requirements for a peak, 
            or suggest a new trail, ping us anytime!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Contact Details & Quick Links */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-4">
              <h3 className="text-lg font-black text-white">Direct Channels</h3>

              <div className="space-y-3 text-xs">
                <a
                  href="https://chat.whatsapp.com/demo-socialclub-community"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#143e29] hover:bg-[#1f5c3d] text-white transition-all font-bold"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>Join WhatsApp Community</span>
                </a>

                <a
                  href="https://instagram.com/socialclub.community"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#143e29] hover:bg-[#1f5c3d] text-white transition-all font-bold"
                >
                  <InstagramIcon className="w-5 h-5 text-[#ff5f8f]" />
                  <span>Instagram Direct Message</span>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b2015] border border-[#1b3d2c] space-y-3 text-xs text-[#9bb3a6]">
              <div className="space-y-1">
                <span className="text-[#86a394] font-bold uppercase block">Official Email</span>
                <span className="text-white font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#bbf451]" /> hello@socialclub.org
                </span>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[#86a394] font-bold uppercase block">Helpline & WhatsApp</span>
                <span className="text-white font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#bbf451]" /> +91 98765 43210 (9 AM - 8 PM IST)
                </span>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[#86a394] font-bold uppercase block">Hub Chapters</span>
                <span className="text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#bbf451]" /> Bengaluru • Mumbai • Pune • Goa
                </span>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-[#0b2015] border border-[#1b3d2c] shadow-2xl space-y-6">
            <h2 className="text-xl font-black text-white">Send Us a Direct Message</h2>

            {status === "success" && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#bbf451]" />
                <span>Thank you! Your message has been received. Our team will get back to you within 12 hours.</span>
              </div>
            )}

            {status === "error" && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Iyer"
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. priya@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Phone / WhatsApp (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-white focus:outline-none focus:border-[#bbf451]"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Upcoming Trip Inquiries">Upcoming Trip Inquiries</option>
                    <option value="Custom Group / Corporate Trip">Custom Group / Corporate Trip</option>
                    <option value="Lead Trekker Application">Join As a Trek Lead</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-[#c2d7cc]">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what's on your mind..."
                    className="w-full px-3.5 py-2.5 bg-[#06150e] border border-[#143e29] rounded-xl text-white focus:outline-none focus:border-[#bbf451]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-xl bg-[#bbf451] hover:bg-[#cdf879] active:scale-95 text-[#06150e] font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#bbf451]/20 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
