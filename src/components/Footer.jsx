"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-cream-light mt-auto border-t border-primary-dark pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-primary-light/30">
          
          {/* Brand Info & Newsletter */}
          <div className="space-y-6">
            <div>
              <span className="text-2xl font-bold font-serif tracking-tight text-cream-light">
                Gaon<span className="text-secondary">Se</span>
              </span>
              <p className="text-xs font-sans tracking-[0.2em] font-medium text-cream-dark uppercase mt-1">
                Pure Village Harvest
              </p>
            </div>
            <p className="text-xs text-cream-dark/95 leading-relaxed font-sans max-w-xs">
              Sourcing authentic, traditional, and 100% chemical-free food products directly from self-help groups, small farmers, and cottage artisans in rural India.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase font-bold tracking-wider text-secondary">
                Join our Rural Circle
              </h4>
              <p className="text-[11px] text-cream-dark/80">
                Receive farmer stories, seasonal harvests, and recipe secrets.
              </p>
              
              <form onSubmit={handleSubscribe} className="relative max-w-xs">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-primary-dark/80 border border-primary-light/50 rounded-full py-2 pl-4 pr-10 text-xs text-cream-light focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary placeholder-cream-dark/50"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1.5 p-1 bg-secondary text-primary hover:bg-theme-white rounded-full transition-colors duration-200"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={12} />
                </button>
              </form>
              
              {subscribed && (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-accent-light font-semibold"
                >
                  Thank you! Namaste for subscribing.
                </motion.p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-secondary uppercase font-serif">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-cream-dark">
              <li>
                <Link href="/shop?category=Jaggery" className="hover:text-theme-white transition-colors">
                  Organic Jaggery (Gud)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Pickles" className="hover:text-theme-white transition-colors">
                  Sun-Dried Pickles
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Murabba" className="hover:text-theme-white transition-colors">
                  Vedic Murabbas
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Honey" className="hover:text-theme-white transition-colors">
                  Raw Forest Honey
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Spices" className="hover:text-theme-white transition-colors">
                  Stone-Ground Spices
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Millets" className="hover:text-theme-white transition-colors">
                  Organic Millets
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance Pages */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-secondary uppercase font-serif">
              Compliance & Policy
            </h3>
            <ul className="space-y-2.5 text-xs text-cream-dark">
              <li>
                <Link href="/privacy-policy" className="hover:text-theme-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-theme-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-theme-white transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-theme-white transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-theme-white transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-theme-white transition-colors">
                  FAQs & Support Help
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-secondary uppercase font-serif">
              Contact GaonSe
            </h3>
            <ul className="space-y-3.5 text-xs text-cream-dark">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-secondary shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>GaonSe Organics Pvt. Ltd.</strong><br />
                  Plot 14, Kabir Nagar, Near Durga Temple,<br />
                  Varanasi, Uttar Pradesh - 221005, India
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-secondary shrink-0" />
                <span>+91 88536 72031 (Mon - Sat, 10 AM - 6 PM)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-secondary shrink-0" />
                <a href="mailto:support@gaonse.com" className="hover:text-theme-white underline">
                  support@gaonse.com
                </a>
              </li>
              <li className="pt-2 flex items-center gap-2 text-[10px] text-cream-dark/70 border-t border-primary-light/20">
                <ShieldCheck size={14} className="text-accent-light" />
                <span>GSTIN: 09AAFGC7810A1Z2 (Placeholder)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream-dark/80">
          <div>
            <p>&copy; {currentYear} GaonSe Organics Private Limited. All rights reserved.</p>
            <p className="text-[10px] text-cream-dark/60 mt-1">
              Made with pride in Indian Villages. Supporting sustainable rural livelihoods.
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-dark/80 hover:bg-secondary hover:text-primary rounded-full flex items-center justify-center transition-all w-8 h-8" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.885.058 1.086.049 1.82.221 2.478.477.68.263 1.257.617 1.832 1.192.575.575.929 1.152 1.192 1.832.256.657.428 1.39.477 2.478.049 1.096.058 1.45.058 3.885 0 2.43-.009 2.784-.058 3.885-.049 1.086-.221 1.82-.477 2.478-.263.68-.617 1.257-1.192 1.832-.575.575-1.152.929-1.832 1.192-.657.256-1.39.428-2.478.477-1.096.049-1.45.058-3.885.058-2.43 0-2.784-.008-3.885-.058-1.086-.049-1.82-.221-2.478-.477a5.078 5.078 0 0 1-1.832-1.192 5.077 5.077 0 0 1-1.192-1.832c-.256-.657-.428-1.39-.477-2.478C2.007 14.814 2 14.46 2 12c0-2.43.008-2.784.058-3.885.049-1.086.221-1.82.477-2.478.263-.68.617-1.257 1.192-1.832.575-.575 1.152-.929 1.832-1.192.657-.256 1.39-.428 2.478-.477C9.216 2.007 9.569 2 12 2zm0 2.222c-2.396 0-2.68.009-3.626.052-.873.04-1.348.186-1.663.309-.418.162-.716.357-1.03.671-.314.314-.51.612-.67 1.03-.124.316-.27.79-.31 1.664-.043.945-.052 1.23-.052 3.626 0 2.396.009 2.68.052 3.626.04.873.186 1.348.31 1.663.16.418.356.716.67 1.03.314.314.612.51 1.03.67.316.124.79.27 1.664.31.945.043 1.23.052 3.626.052 2.396 0 2.68-.009 3.626-.052.873-.04 1.348-.186 1.663-.31.418-.162.716-.356 1.03-.67.314-.314.51-.612.67-1.03.124-.316.27-.79.31-1.664.043-.945.052-1.23.052-3.626 0-2.396-.009-2.68-.052-3.626-.04-.873-.186-1.348-.31-1.663-.16-.418-.356-.716-.67-1.03-.314-.314-.612-.51-1.03-.67-.316-.124-.79-.27-1.664-.31C14.68 4.23 14.396 4.222 12 4.222zM12 7.778a4.222 4.222 0 1 0 0 8.444 4.222 4.222 0 0 0 0-8.444zM12 14a2.222 2.222 0 1 1 0-4.444A2.222 2.222 0 0 1 12 14zm5.884-7.39a1.002 1.002 0 1 0 0 2.004 1.002 1.002 0 0 0 0-2.004z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-dark/80 hover:bg-secondary hover:text-primary rounded-full flex items-center justify-center transition-all w-8 h-8" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-dark/80 hover:bg-secondary hover:text-primary rounded-full flex items-center justify-center transition-all w-8 h-8" aria-label="Youtube">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.42 4.814a2.502 2.502 0 0 1-1.768 1.768c-1.56.419-7.812.419-7.812.419s-6.253 0-7.812-.419a2.502 2.502 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.42-4.814a2.502 2.502 0 0 1 1.768-1.768C5.747 5 12 5 12 5s6.253 0 7.812.418ZM9.75 8.986V15.01l5.485-3.013L9.75 8.986Z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary-dark/80 hover:bg-secondary hover:text-primary rounded-full flex items-center justify-center transition-all w-8 h-8" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.6823 10.6218L20.2641 3H18.7042L13.0035 9.58559L8.43806 3H3.16406L10.0656 13.0074L3.16406 21H4.72403L10.7439 14.0437L15.5505 21H20.8246L13.682 10.6218H13.6823ZM11.5376 13.1274L10.8383 12.1328L5.28667 4.29344H7.68305L12.1645 10.6407L12.8638 11.6353L18.7049 19.9478H16.3085L11.5376 13.1292V13.1274Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
