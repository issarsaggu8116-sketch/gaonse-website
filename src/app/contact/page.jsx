"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  ShieldCheck, 
  CheckCircle2 
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        orderId: "",
        subject: "General Inquiry",
        message: ""
      });
      // Clear toast after 5s
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold font-serif text-primary">Contact Our Support Team</h1>
            <p className="text-xs text-[#8C7A6B] uppercase tracking-wider">Reach out for order help, bulk bookings, or partner program inquiries</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            
            {/* Contact Details Grid */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Box 1: Support Coordinates */}
              <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm space-y-6">
                <h2 className="text-lg font-bold font-serif text-primary">Get In Touch</h2>
                
                <div className="space-y-4 text-xs text-[#5C5043]">
                  
                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <span className="p-2 bg-cream-light text-secondary rounded-full shrink-0">
                      <Phone size={16} />
                    </span>
                    <div>
                      <h4 className="font-bold text-primary font-serif">Customer Phone Support</h4>
                      <p className="mt-0.5">+91 88536 72031</p>
                      <p className="text-[10px] text-[#8C7A6B] mt-0.5">Mon - Sat, 10:00 AM - 06:00 PM IST</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <span className="p-2 bg-cream-light text-accent rounded-full shrink-0">
                      <Mail size={16} />
                    </span>
                    <div>
                      <h4 className="font-bold text-primary font-serif">Email Support</h4>
                      <a href="mailto:support@gaonse.com" className="underline hover:text-primary mt-0.5 block">
                        support@gaonse.com
                      </a>
                      <p className="text-[10px] text-[#8C7A6B] mt-0.5">We respond to email tickets within 24 hours.</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <span className="p-2 bg-cream-light text-primary rounded-full shrink-0">
                      <MapPin size={16} />
                    </span>
                    <div>
                      <h4 className="font-bold text-primary font-serif">Registered Corporate Office</h4>
                      <p className="mt-0.5 leading-relaxed">
                        <strong>GaonSe Organics Private Limited</strong><br />
                        Plot 14, Kabir Nagar, Near Durga Temple,<br />
                        Varanasi, Uttar Pradesh - 221005, India
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Box 2: Operations timing */}
              <div className="bg-cream-medium/40 p-6 rounded-2xl border border-cream-medium space-y-4 text-xs text-[#5C5043]">
                <h3 className="font-bold text-primary font-serif flex items-center gap-1.5">
                  <Clock size={16} className="text-secondary" />
                  <span>Sourcing Hub Operations</span>
                </h3>
                <p className="leading-relaxed">
                  Our village-sourcing consolidation hubs in Muzaffarnagar, Mandya, and Varanasi package products fresh from local harvests. For wholesale bulk orders or farmer supplier enrollments, write directly to <strong className="text-primary font-serif">partners@gaonse.com</strong>.
                </p>
              </div>

            </div>

            {/* Contact Form Form */}
            <div className="lg:col-span-3 bg-theme-white p-6 sm:p-8 rounded-2xl border border-cream-medium shadow-sm">
              <h2 className="text-lg font-bold font-serif text-primary mb-6">Send A Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary font-serif">Your Name <span className="text-[#D9534F]">*</span></label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs text-[#2C2520] focus:outline-none focus:border-secondary"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary font-serif">Email Address <span className="text-[#D9534F]">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. ramesh@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs text-[#2C2520] focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary font-serif">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs text-[#2C2520] focus:outline-none focus:border-secondary"
                    />
                  </div>

                  {/* Order ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary font-serif">Order ID (optional)</label>
                    <input
                      type="text"
                      name="orderId"
                      placeholder="e.g. GS-10492"
                      value={formData.orderId}
                      onChange={handleChange}
                      className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs text-[#2C2520] focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                {/* Subject Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary font-serif">Topic of Inquiry</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs text-[#2C2520] focus:outline-none focus:border-secondary"
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Order Status">My Order Status & Delivery</option>
                    <option value="Return or Replacement">Return / Replacement Request</option>
                    <option value="Payment Issue">Razorpay Online Payment Issue</option>
                    <option value="Farmer Sourcing">Bulk/Wholesale Farmer Partnerships</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary font-serif">Message Details <span className="text-[#D9534F]">*</span></label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    placeholder="Describe your question or issue in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs text-[#2C2520] focus:outline-none focus:border-secondary"
                  />
                </div>

                {error && (
                  <div className="text-xs text-[#D9534F] font-semibold">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-light text-cream-light font-bold text-xs py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={13} />
                    </>
                  )}
                </button>

                {/* Success Toast */}
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-accent font-bold mt-4"
                  >
                    <CheckCircle2 size={16} />
                    <span>Message sent! Our support team will respond shortly via email.</span>
                  </motion.div>
                )}

              </form>
            </div>

          </div>

          {/* Map Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-serif text-primary text-center md:text-left">Locate Us in Varanasi</h2>
            <div className="rounded-2xl overflow-hidden border border-cream-medium shadow-sm h-[350px] relative bg-cream-medium/30 flex items-center justify-center">
              <iframe
                title="Varanasi Head Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14427.604712211516!2d83.00350485!3d25.3176452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db7bf21226d%3A0xc39f884a4f89d316!2sDurga%20Temple!5e0!3m2!1sen!2sin!4v1718872031892!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
