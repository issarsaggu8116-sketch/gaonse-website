"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Heart, 
  Users, 
  Sparkles, 
  Leaf, 
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Leaf className="text-accent" size={24} />,
      title: "100% Organic & Chemical-Free",
      desc: "We ensure zero artificial preservatives, sulfur, or dyes are added. Every product is purely crafted by hand using age-old organic recipes."
    },
    {
      icon: <Users className="text-secondary" size={24} />,
      title: "Direct Farmer Support",
      desc: "By removing middle distributors, we return up to 75% of the consumer rupee directly to local farmers, self-help groups, and cottage artisans."
    },
    {
      icon: <Heart className="text-[#E76F51]" size={24} />,
      title: "Preserving Rural Heritage",
      desc: "We celebrate traditional methods like clay-pot Bilona ghee, wood-fired jaggery, and sun-dried pickles matured in stone martabans."
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "The Seeds are Sown",
      desc: "GaonSe began as a simple initiative to help 5 organic sugarcane farmers in Uttar Pradesh market chemical-free jaggery blocks."
    },
    {
      year: "2025",
      title: "Empowering Rural Women",
      desc: "Collaborated with Ganga Women's Self-Help Group (SHG) in Varanasi to launch our sun-dried pickles, training them in hygienic packaging."
    },
    {
      year: "2026",
      title: "Expanding Horizons",
      desc: "Today, we support over 150+ farmers and SHGs across 6 Indian states, connecting premium traditional harvests with thousands of urban families."
    }
  ];

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-cream-medium overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&q=80" 
            alt="Indian Village Landscape" 
            className="w-full h-full object-cover filter blur-[2px]"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.2em] font-semibold text-secondary"
          >
            Our Roots
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary"
          >
            The Story Behind GaonSe
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-[#5C5043] max-w-2xl mx-auto leading-relaxed"
          >
            Bridging the gap between the purity of India's rural lands and the conscious dining tables of urban homes.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-accent">What Drives Us</span>
          <h2 className="text-3xl font-bold font-serif text-primary">Our Mission & Vision</h2>
          <p className="text-sm text-[#5C5043] leading-relaxed">
            Our mission is simple: to make traditional, chemically unaltered, nutrient-dense village foods accessible to urban consumers, while fostering economic empowerment and preserving ancient farming models in rural India.
          </p>
          <p className="text-sm text-[#5C5043] leading-relaxed">
            We envision a sustainable ecosystem where farmers are respected and compensated fairly for their heritage agricultural skills, and where consumers can trust the absolute purity of the food they nourish their families with.
          </p>
          <div className="pt-4 flex gap-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-cream-medium rounded-full text-accent">
                <Leaf size={16} />
              </span>
              <span className="text-xs font-bold text-primary">100% Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-cream-medium rounded-full text-secondary">
                <Users size={16} />
              </span>
              <span className="text-xs font-bold text-primary">Fair Trade Sourced</span>
            </div>
          </div>
        </div>
        
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-cream-medium">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80" 
            alt="Rural Woman Sifting Grains" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end p-6">
            <p className="text-white text-sm font-semibold italic">
              "Authentic taste comes from patience, sunshine, and generations of traditional culinary skills."
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-theme-white py-16 border-y border-cream-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold font-serif text-primary">Our Core Pillars</h2>
            <p className="text-xs text-[#8C7A6B] uppercase tracking-wider">How we do what we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => (
              <div 
                key={idx}
                className="p-8 bg-cream-light/60 rounded-xl border border-cream-medium/50 hover:border-cream-dark transition-all duration-300 space-y-4 text-center md:text-left"
              >
                <div className="inline-block p-3 bg-theme-white rounded-full shadow-sm">
                  {v.icon}
                </div>
                <h3 className="text-md font-bold text-primary font-serif">{v.title}</h3>
                <p className="text-xs text-[#5C5043] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmer Partnership Flowchart */}
      <section className="py-20 max-w-5xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold font-serif text-primary">The GaonSe Partnership Model</h2>
          <p className="text-sm text-[#8C7A6B] max-w-xl mx-auto">
            Our transparent, direct-to-consumer value chain ensures maximum earnings flow back to rural artisans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            { step: "1", title: "Harvesting", desc: "Small farmers grow crops organically; SHGs prepare foods by hand." },
            { step: "2", title: "Direct Buying", desc: "GaonSe buys directly at a premium price, bypassing middle commission brokers." },
            { step: "3", title: "Packaging", desc: "Hygienically verified, eco-packaged at rural collection hubs." },
            { step: "4", title: "Doorstep Delivery", desc: "Shipped directly to urban consumers, ensuring high quality and freshness." }
          ].map((s, idx) => (
            <div key={idx} className="bg-theme-white p-6 rounded-xl border border-cream-medium shadow-sm relative space-y-3">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-theme-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-cream-light shadow-sm">
                {s.step}
              </span>
              <h3 className="text-sm font-bold text-primary font-serif pt-3">{s.title}</h3>
              <p className="text-[11px] text-[#5C5043] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-cream-medium/40 border-t border-cream-medium">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif text-primary text-center mb-12">Our Journey</h2>
          
          <div className="relative border-l-2 border-cream-dark/60 pl-8 ml-4 space-y-12">
            {timeline.map((t, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[41px] top-1.5 bg-primary text-secondary text-[10px] font-extrabold w-6 h-6 rounded-full border-4 border-cream-light flex items-center justify-center shadow-sm">
                  {idx + 1}
                </span>
                <span className="inline-block px-2.5 py-1 bg-secondary text-theme-white text-[10px] font-bold rounded-full mb-2">
                  {t.year}
                </span>
                <h3 className="text-md font-bold text-primary font-serif">{t.title}</h3>
                <p className="text-xs text-[#5C5043] leading-relaxed mt-1.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Placeholder Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <h2 className="text-3xl font-bold font-serif text-primary">Meet Our Founders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {[
            {
              name: "Amrita Patel",
              role: "Co-Founder & Sourcing Lead",
              desc: "Amrita has spent 8 years working in rural development. She oversees direct farmer partnerships, ensuring strict adherence to organic standards.",
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
            },
            {
              name: "Rajesh K. Pandey",
              role: "Co-Founder & Operations",
              desc: "Rajesh specializes in agricultural supply chains. He designed our low-waste, rural-to-urban delivery pipeline that preserves product freshness.",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            }
          ].map((founder, idx) => (
            <div key={idx} className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm flex flex-col items-center text-center space-y-4">
              <img 
                src={founder.image} 
                alt={founder.name} 
                className="w-32 h-32 object-cover rounded-full border-4 border-cream-medium shadow-inner"
              />
              <div>
                <h3 className="text-md font-bold text-primary font-serif">{founder.name}</h3>
                <p className="text-xs text-secondary font-semibold">{founder.role}</p>
              </div>
              <p className="text-xs text-[#5C5043] leading-relaxed max-w-xs">{founder.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
