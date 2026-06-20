"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getProductsAction, getCategoriesAction } from "@/app/actions";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Users, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  Play, 
  Star, 
  ShoppingBag,
  Truck,
  RotateCcw,
  Check,
  Plus
} from "lucide-react";

export default function HomePage() {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [justAddedId, setJustAddedId] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    async function loadData() {
      const p = await getProductsAction();
      const c = await getCategoriesAction();
      setProductsList(p);
      setCategoriesList(c);
    }
    loadData();
  }, []);

  // Sourcing only featured products
  const featuredProducts = productsList.filter(p => p.isFeatured).slice(0, 4);

  const handleQuickAdd = (product) => {
    addToCart(product, product.weightOptions[0], 1);
    setJustAddedId(`${product.id}-home`);
    setTimeout(() => setJustAddedId(null), 2000);
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const reasons = [
    {
      icon: <Leaf className="text-accent" size={32} />,
      title: "100% Authentic",
      desc: "Completely natural food products containing zero synthetic preservatives, binders, or artificial coloring agents."
    },
    {
      icon: <Users className="text-secondary" size={32} />,
      title: "Direct From Farmers",
      desc: "Purchased directly from micro-farmers, cottage clarifiers, and self-help guilds, returning up to 75% of profits."
    },
    {
      icon: <ShieldCheck className="text-primary" size={32} />,
      title: "Quality Tested",
      desc: "Batches are strictly analyzed for safety, moisture levels, and chemical purity at local consolidation units."
    }
  ];

  const testimonials = [
    {
      quote: "The organic jaggery powder and Bilona ghee have completely changed my kitchen. It has that authentic smoky village aroma. Exceptional quality!",
      name: "Sneha Nair",
      role: "Home Maker, Mumbai"
    },
    {
      quote: "Sourced their sun-dried mango pickle. It tastes exactly like the ones my grandmother used to mature in porcelain jars. Pure nostalgia!",
      name: "Rohan Deshmukh",
      role: "IT Professional, Pune"
    },
    {
      quote: "Lakadong Turmeric is vibrant and curcumin-rich. Knowing the money goes directly to women cooperatives in Meghalaya makes it even better.",
      name: "Dr. Ananya Ray",
      role: "Ayurveda Practitioner, Delhi"
    }
  ];

  const homeFaqs = [
    {
      question: "How does GaonSe support rural farmers?",
      answer: "We source directly from farmer-owned cooperatives and small cottage self-help groups. By bypassing traditional commission agents and packaging at rural source hubs, we ensure farmers receive a fair, premium price for their crops."
    },
    {
      question: "What are your delivery timelines and fees?",
      answer: "Standard shipping is FREE for all order totals of ₹499 and above. For orders below ₹499, we charge a flat fee of ₹50. Deliveries usually take 3 to 5 business days in metro cities and 5 to 7 business days elsewhere."
    },
    {
      question: "Can I return a product if I am unsatisfied?",
      answer: "Since we sell food items, we accept return or replacement requests within 7 days of delivery only in cases where the security seals are broken, or package leaks occurred in transit. Reach support at support@gaonse.com."
    }
  ];

  return (
    <>
      <Header />

      {/* SECTION 1: HERO CONTAINER WITH VIDEO BACKGROUND */}
      <section className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[#2C2520]">
        
        {/* Cinematic Village Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-35 scale-105 filter blur-[0.5px]"
            src="https://assets.mixkit.co/videos/preview/mixkit-working-with-crops-in-a-sunny-field-42283-large.mp4"
            // Secondary fallback poster if video fails
            poster="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&q=80"
          />
          {/* Subtle gradient overlay to enhance text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-cream-light via-[#2C2520]/60 to-[#2C2520]/80 z-1" />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-3 py-1 bg-secondary text-theme-white text-xs font-bold uppercase tracking-[0.2em] rounded-full"
          >
            Direct From India's Heartlands
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#FFFFFF] font-serif leading-tight tracking-tight"
          >
            Authentic Taste From <br />
            <span className="text-secondary font-serif">India's Villages</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-cream-light max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Chemical-free sweeteners, sun-matured pickles, raw forest honeys, and traditional food products sourced directly from organic farmers and local self-help artisans.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link 
              href="/shop" 
              className="bg-secondary hover:bg-cream-dark text-primary font-extrabold text-xs py-3.5 px-8 rounded-full transition-all shadow-lg flex items-center gap-2 tracking-wider uppercase cursor-pointer"
            >
              <span>Shop All Harvests</span>
              <ArrowRight size={14} />
            </Link>
            <Link 
              href="/about" 
              className="bg-theme-white/10 hover:bg-theme-white/20 text-[#FFFFFF] border border-theme-white/30 font-extrabold text-xs py-3.5 px-8 rounded-full transition-all tracking-wider uppercase backdrop-blur-sm cursor-pointer"
            >
              Our Farmer Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: WHY CHOOSE GAONSE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-accent">The GaonSe Promise</span>
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary">Why Conscious Shoppers Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((r, idx) => (
            <div 
              key={idx}
              className="p-8 bg-theme-white rounded-2xl border border-cream-medium/80 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 flex flex-col items-center text-center md:items-start md:text-left hover:border-cream-dark group"
            >
              <div className="p-3 bg-cream-light rounded-2xl group-hover:scale-105 transition-transform duration-300">
                {r.icon}
              </div>
              <h3 className="text-lg font-bold font-serif text-primary">{r.title}</h3>
              <p className="text-xs text-[#5C5043] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED CATEGORIES circles */}
      <section className="py-16 bg-theme-white border-y border-cream-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-bold text-secondary">Seasonal Bounties</span>
              <h2 className="text-3xl font-bold font-serif text-primary">Featured Categories</h2>
            </div>
            <Link href="/shop" className="text-xs font-bold text-primary underline hover:text-[#9C6644] transition-colors flex items-center gap-1">
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-center">
            {categoriesList.map((c) => (
              <Link 
                key={c.name}
                href={`/shop?category=${encodeURIComponent(c.name)}`}
                className="group flex flex-col items-center text-center space-y-3 cursor-pointer"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cream-medium group-hover:border-secondary transition-all shadow-sm scale-95 group-hover:scale-100 duration-300">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-primary font-serif group-hover:text-secondary transition-colors">
                    {c.name}
                  </h3>
                  <span className="text-[9px] text-[#8C7A6B] font-semibold">{c.count} Items</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED PRODUCTS GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-bold text-accent">Curated Selections</span>
            <h2 className="text-3xl font-bold font-serif text-primary">Trending Village Harvests</h2>
          </div>
          <Link href="/shop" className="text-xs font-bold text-primary underline hover:text-[#9C6644] transition-colors flex items-center gap-1">
            <span>Explore Catalog</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => {
            const isInWishlist = wishlist.some(item => item.id === p.id);
            const isJustAdded = justAddedId === `${p.id}-home`;

            return (
              <div 
                key={p.id}
                className="bg-theme-white rounded-2xl border border-cream-medium overflow-hidden shadow-sm hover:shadow-md hover:border-cream-dark transition-all duration-300 flex flex-col h-full group"
              >
                <div className="relative pt-[100%] overflow-hidden bg-cream-light">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-primary/95 text-cream-light text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {p.origin.split(",")[0]}
                  </span>
                  
                  <button
                    onClick={() => toggleWishlist(p)}
                    className="absolute top-3 right-3 p-1.5 bg-theme-white/90 rounded-full shadow-sm text-[#5C5043] hover:text-accent cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Star size={14} className={isInWishlist ? "fill-accent text-accent" : ""} />
                  </button>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">{p.category}</span>
                    <Link href={`/shop/${p.id}`}>
                      <h3 className="text-xs font-bold text-primary font-serif line-clamp-2 hover:text-[#9C6644] transition-colors leading-snug">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 text-[#D6A15F] text-[10px]">
                      <span>★</span>
                      <span className="font-bold text-primary">{p.rating}</span>
                      <span className="text-[#8C7A6B]">({p.reviews.length})</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-cream-light">
                    <span className="text-sm font-extrabold text-[#2C2520]">₹{p.price}</span>
                    <button
                      onClick={() => handleQuickAdd(p)}
                      className={`py-1.5 px-3 rounded-full text-[10px] font-extrabold cursor-pointer transition-all ${
                        isJustAdded ? "bg-accent text-white" : "bg-primary text-cream-light hover:bg-primary-light"
                      }`}
                    >
                      {isJustAdded ? (
                        <span className="flex items-center gap-0.5">
                          <Check size={11} />
                          <span>Added</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5">
                          <Plus size={11} />
                          <span>Add</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: FARMER STORY VIDEO SECTION */}
      <section className="py-20 bg-cream-medium/40 border-y border-cream-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-cream-medium group h-[380px] bg-primary flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=800&q=80" 
              alt="Farmer Ram Swaroop at sugarcane field" 
              className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-[#2C2520]/20 group-hover:bg-[#2C2520]/30 transition-all duration-300" />
            
            {/* Play trigger */}
            <button 
              onClick={() => alert("Playing simulated farmer story video documentary. gaonse.com connects you directly to this harvest.")}
              className="relative z-10 p-5 bg-theme-white text-primary rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer"
              aria-label="Play Story"
            >
              <Play size={24} className="fill-primary text-primary translate-x-0.5" />
            </button>

            <span className="absolute bottom-4 left-4 bg-primary/90 text-cream-light text-[10px] font-bold py-1 px-3 rounded-full backdrop-blur-sm">
              Muzaffarnagar Sugarcane Cottage Unit
            </span>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-secondary">The Faces of GaonSe</span>
            <h2 className="text-3xl font-bold font-serif text-primary">Sourced from Handcrafted Legacies</h2>
            <p className="text-sm text-[#5C5043] leading-relaxed">
              Every jar of pickle, every block of jaggery, and every bottle of honey carries a legacy. We work directly with smallholders like Ram Swaroop, who clarify sugarcane juice organically, and Varanasi women cooperatives, who sun-cure mango pickles in clay jars.
            </p>
            <p className="text-sm text-[#5C5043] leading-relaxed">
              By packaging products directly at our rural consolidation centers, we retain the highest value locally within the community, providing steady sustainable livelihood opportunities to villages.
            </p>
            <div className="pt-2">
              <Link 
                href="/about" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary underline transition-colors"
              >
                <span>Read Our Sourcing Model</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: CUSTOMER TESTIMONIALS */}
      <section className="py-16 max-w-5xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-accent">Verified Buyers</span>
          <h2 className="text-3xl font-bold font-serif text-primary">Loved By Organic Enthusiasts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-theme-white p-6 rounded-2xl border border-cream-medium/70 shadow-sm flex flex-col justify-between text-left space-y-4"
            >
              <div className="space-y-2">
                <div className="flex text-[#D6A15F] text-xs">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xs text-[#5C5043] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
              <div>
                <h4 className="font-extrabold text-primary font-serif text-xs">{t.name}</h4>
                <span className="text-[9px] text-[#8C7A6B] font-semibold">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: TRUST INDICATORS WIDGET */}
      <section className="py-10 bg-primary text-cream-light text-center border-y border-primary-dark">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <ShieldCheck size={20} className="text-secondary" />, title: "Secure Checkout", desc: "Razorpay Sandbox Integrated" },
            { icon: <Leaf size={20} className="text-accent-light" />, title: "100% Authentic", desc: "Handmade in Villages" },
            { icon: <Truck size={20} className="text-secondary" />, title: "Free Delivery", desc: "For Orders over ₹499" },
            { icon: <RotateCcw size={20} className="text-accent-light" />, title: "Easy Replacements", desc: "7-Day Transit Damage Cover" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1.5">
              <span className="p-2.5 bg-primary-dark/80 rounded-full">{item.icon}</span>
              <h4 className="text-xs font-bold text-cream-light font-serif">{item.title}</h4>
              <span className="text-[9px] text-cream-dark">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: FAQ PANEL PREVIEW */}
      <section className="py-16 max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-serif text-primary">Frequently Asked Questions</h2>
          <p className="text-xs text-[#8C7A6B] uppercase tracking-wider">Quick Answers</p>
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq, idx) => {
            const isExpanded = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className="bg-theme-white rounded-xl border border-cream-medium overflow-hidden shadow-sm hover:border-cream-dark transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex justify-between items-center gap-4 text-[#2C2520] focus:outline-none"
                >
                  <span className="text-xs sm:text-sm font-bold text-primary font-serif">{faq.question}</span>
                  <span className="text-primary font-bold">{isExpanded ? "−" : "+"}</span>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 text-xs text-[#5C5043] leading-relaxed font-sans border-t border-cream-light pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link href="/faq" className="text-xs font-bold text-primary underline hover:text-[#9C6644] transition-all">
            View All FAQs
          </Link>
        </div>
      </section>

      {/* SECTION 9: NEWSLETTER WIDGET */}
      <section className="py-16 bg-cream-medium/40 border-t border-cream-medium">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-primary">Join our Rural Sourcing Circle</h2>
            <p className="text-xs text-[#5C5043] max-w-md mx-auto leading-relaxed">
              Stay updated on harvest cycles, tribal honey gatherings, organic farming methods, and exclusive discount coupons.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you! Namaste for subscribing.");
            }} 
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-grow bg-theme-white border border-cream-medium rounded-full py-2.5 px-4 text-xs text-[#2C2520] focus:outline-none focus:border-secondary shadow-inner placeholder-cream-dark"
            />
            <button 
              type="submit"
              className="bg-primary hover:bg-primary-light text-cream-light font-extrabold text-xs py-3 px-6 rounded-full transition-all cursor-pointer whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
