"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "shipping", name: "Shipping & Delivery" },
    { id: "quality", name: "Product & Quality" },
    { id: "payments", name: "Payments & Coupons" },
    { id: "returns", name: "Returns & Refunds" }
  ];

  const faqs = [
    {
      id: "faq-1",
      category: "shipping",
      question: "What are your shipping rates and delivery timelines?",
      answer: "We ship orders across India. Shipping is FREE on all orders of ₹499 and above. For orders below ₹499, a flat delivery fee of ₹50 is applied. Metro cities typically receive deliveries within 3-5 business days, while non-metro and remote locations take 5-7 and 7-10 business days, respectively."
    },
    {
      id: "faq-2",
      category: "quality",
      question: "Are GaonSe food products 100% organic and chemical-free?",
      answer: "Yes, absolutely! All our products are sourced directly from village farmers and self-help groups. We guarantee zero artificial preservatives, colors, or sulfur clarification. Our jaggery is boiled in open iron pans clarified with wild okra stems, and our spices are stone-ground to preserve natural essential oils."
    },
    {
      id: "faq-3",
      category: "payments",
      question: "Is it safe to pay online? Which payment methods do you accept?",
      answer: "Yes, our checkout is completely secure. We use Razorpay as our payment gateway, which is PCI-DSS compliant. We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, major credit/debit cards (Visa, MasterCard, RuPay), and mobile wallets. Cash on Delivery is currently not supported to reduce delivery handling."
    },
    {
      id: "faq-4",
      category: "returns",
      question: "What is your return and refund policy?",
      answer: "Due to the perishable nature of food items, we accept returns or replacements within 7 days of delivery only if the product package was damaged in transit, leaked, or has a broken seal. Please email photos of the damaged item to support@gaonse.com along with your Order ID, and we will dispatch a replacement or initiate a full refund within 5-7 business days."
    },
    {
      id: "faq-5",
      category: "quality",
      question: "Why does the color or texture of my jaggery or pickle differ slightly from my previous order?",
      answer: "Because our products are handcrafted in small batches by rural artisans using seasonal crops, natural differences in sugarcane mineral content, ambient humidity, and solar heat curation can lead to slight variations in texture, color, or acidity. This variation is a hallmark of authentic, non-industrial, preservative-free food!"
    },
    {
      id: "faq-6",
      category: "shipping",
      question: "How do I track my shipment details?",
      answer: "As soon as your package is dispatched, we send you an SMS and email notification containing your courier tracking number and link. You can track your package directly on our delivery partners' (Delhivery/Blue Dart) tracking portal."
    },
    {
      id: "faq-7",
      category: "returns",
      question: "Can I cancel my order after placement?",
      answer: "You can cancel your order at any time before it is dispatched from our village consolidation center. Simply email support@gaonse.com or call us. If the order has already been handed over to the courier partner, it cannot be cancelled, and you must refuse delivery or contact support to check eligibility."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id) => {
    if (expandedFaqId === id) {
      setExpandedFaqId(null);
    } else {
      setExpandedFaqId(id);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* FAQ Header & Search */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold font-serif text-primary">Frequently Asked Questions</h1>
            <p className="text-xs text-[#8C7A6B] uppercase tracking-wider">How can we help you today?</p>
            
            <div className="relative max-w-md mx-auto pt-2">
              <input
                type="text"
                placeholder="Search FAQs (e.g. jaggery, delivery)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-theme-white border border-cream-medium rounded-full py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-secondary shadow-sm text-[#2C2520]"
              />
              <Search className="absolute right-3.5 top-5 text-[#8C7A6B]" size={16} />
            </div>
          </div>

          {/* Categories Tab Navigation */}
          <div className="flex flex-wrap gap-2 justify-center border-b border-cream-medium pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setExpandedFaqId(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                  activeCategory === category.id
                    ? "bg-primary text-cream-light border-primary shadow-sm"
                    : "bg-theme-white text-[#5C5043] border-cream-medium hover:bg-cream-medium/40"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-4 min-h-[300px]">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-theme-white rounded-xl border border-cream-medium text-[#8C7A6B]">
                <HelpCircle size={36} className="mx-auto text-cream-dark mb-2" />
                <p className="text-sm font-semibold">No questions found matching your search.</p>
                <p className="text-xs">Try searching for keywords like 'shipping' or 'quality'.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className="bg-theme-white rounded-xl border border-cream-medium shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-5 flex justify-between items-center gap-4 focus:outline-none group"
                    >
                      <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors font-serif">
                        {faq.question}
                      </span>
                      <span className="p-1 rounded-full bg-cream-light text-primary group-hover:bg-cream-medium shrink-0">
                        {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-cream-light"
                        >
                          <div className="p-5 text-xs text-[#5C5043] leading-relaxed font-sans bg-cream-light/35">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* Sticky Farmer Banner */}
          <div className="bg-cream-medium/55 rounded-2xl p-6 text-center border border-cream-medium space-y-4">
            <h3 className="text-md font-bold text-primary font-serif">Still have questions?</h3>
            <p className="text-xs text-[#5C5043] max-w-sm mx-auto leading-relaxed">
              Our Customer Support Team can help clarify details regarding packaging, organic certifications, or support pathways.
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="mailto:support@gaonse.com" 
                className="bg-primary text-cream-light text-xs font-bold px-5 py-2.5 rounded-full hover:bg-primary-light transition-all shadow-sm"
              >
                Email Support
              </a>
              <a 
                href="tel:+918853672031" 
                className="bg-theme-white text-primary border border-cream-dark text-xs font-bold px-5 py-2.5 rounded-full hover:bg-cream-medium transition-all shadow-sm"
              >
                Call Support
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
