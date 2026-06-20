"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ArrowLeft,
  Truck,
  HelpCircle,
  X
} from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getCartSubtotal, 
    getDiscountAmount,
    getDeliveryFee,
    getCartTotal,
    activeCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState({ type: "", message: "" });

  const subtotal = getCartSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscountAmount();
  const total = getCartTotal();

  const freeShippingThreshold = 499;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;
  const freeShippingPercent = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponFeedback({ type: "", message: "" });
    if (!couponCode) return;

    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponFeedback({ type: "success", message: res.message });
      setCouponCode("");
    } else {
      setCouponFeedback({ type: "error", message: res.message });
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light text-[#2C2520]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <h1 className="text-3xl font-bold font-serif text-primary">Your Shopping Basket</h1>

          {cart.length === 0 ? (
            <div className="bg-theme-white rounded-2xl border border-cream-medium p-12 text-center max-w-xl mx-auto space-y-6">
              <div className="p-4 bg-cream-light text-primary rounded-full inline-block">
                <ShoppingBag size={48} />
              </div>
              <h2 className="text-xl font-bold font-serif text-primary">Your basket is currently empty</h2>
              <p className="text-xs text-[#5C5043] leading-relaxed max-w-xs mx-auto">
                Discover organic sugarcane jaggery, stone-ground turmeric, raw Satpura honey, and traditional sun-matured pickles.
              </p>
              <Link 
                href="/shop" 
                className="inline-flex items-center gap-1 bg-primary text-cream-light font-bold text-xs py-3 px-6 rounded-full hover:bg-primary-light transition-all shadow-sm"
              >
                <span>Browse Store Catalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Side: Basket Items */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Free Shipping Progress Alert */}
                <div className="bg-theme-white p-5 rounded-2xl border border-cream-medium shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary font-serif">
                    <Truck size={18} className="text-secondary animate-bounce" />
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-accent">Congratulations! You qualify for FREE Delivery!</span>
                    ) : (
                      <span>Add ₹{remainingForFreeShipping} more to unlock FREE Shipping!</span>
                    )}
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="w-full bg-cream-medium h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-accent h-full transition-all duration-500" 
                      style={{ width: `${freeShippingPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items Table / Cards list */}
                <div className="bg-theme-white rounded-2xl border border-cream-medium shadow-sm overflow-hidden">
                  
                  {/* Desktop header */}
                  <div className="hidden sm:grid grid-cols-5 p-4 bg-cream-medium/40 border-b border-cream-medium text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider">
                    <span className="col-span-2">Product Description</span>
                    <span className="text-center">Weight Unit</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Line Total</span>
                  </div>

                  <div className="divide-y divide-cream-medium/60">
                    {cart.map((item) => (
                      <div 
                        key={`${item.product.id}-${item.selectedWeight.id}`}
                        className="grid grid-cols-1 sm:grid-cols-5 items-center p-5 gap-4"
                      >
                        {/* Image + Title */}
                        <div className="col-span-2 flex gap-4 items-center">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-16 h-16 object-cover rounded-lg bg-cream-light shrink-0 border border-cream-medium"
                          />
                          <div className="min-w-0">
                            <Link href={`/shop/${item.product.id}`} className="hover:underline">
                              <h3 className="text-xs font-bold text-primary font-serif leading-snug line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>
                            <span className="text-[9px] text-secondary font-bold uppercase tracking-wider">{item.product.category}</span>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedWeight.id)}
                              className="text-[10px] font-semibold text-[#B08968] hover:text-[#D9534F] flex items-center gap-1 mt-1 cursor-pointer"
                            >
                              <Trash2 size={12} />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>

                        {/* Weight selection */}
                        <div className="text-center sm:text-center flex sm:flex-col justify-between sm:justify-center items-center text-xs font-semibold text-[#5C5043]">
                          <span className="sm:hidden text-[10px] text-[#8C7A6B]">Weight:</span>
                          <span>{item.selectedWeight.weight}</span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex sm:justify-center items-center justify-between text-xs font-semibold">
                          <span className="sm:hidden text-[10px] text-[#8C7A6B]">Quantity:</span>
                          <div className="flex items-center border border-cream-dark/50 rounded-full bg-cream-light px-1">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.selectedWeight.id, item.quantity - 1)}
                              className="p-1 text-primary hover:text-secondary"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-primary">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.selectedWeight.id, item.quantity + 1)}
                              className="p-1 text-primary hover:text-secondary"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Price line total */}
                        <div className="text-right sm:text-right flex sm:flex-col justify-between sm:justify-end items-center font-bold text-xs text-primary">
                          <span className="sm:hidden text-[10px] text-[#8C7A6B]">Total Price:</span>
                          <span>₹{item.selectedWeight.price * item.quantity}</span>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>

                {/* Return Shopping button */}
                <div>
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C7A6B] hover:text-primary transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Continue Sourcing Harvests</span>
                  </Link>
                </div>

              </div>

              {/* Right Side: Order Summary Panel */}
              <div className="space-y-6">
                
                {/* Coupon widget */}
                <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={14} className="text-secondary" />
                    <span>Apply Promotion Coupon</span>
                  </h3>
                  
                  {activeCoupon ? (
                    <div className="p-3 bg-accent-light/10 border border-accent-light/35 text-accent text-xs rounded-lg flex justify-between items-center font-bold">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider">{activeCoupon.code}</span>
                        <span className="text-[9px] font-normal text-[#5C5043]">{activeCoupon.description}</span>
                      </div>
                      <button 
                        onClick={removeCoupon}
                        className="text-[#D9534F] hover:bg-cream-light p-1 rounded-full"
                        aria-label="Remove Coupon"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. GAONSE10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-cream-light/60 border border-cream-medium rounded-lg px-3 py-2 text-xs text-[#2C2520] focus:outline-none placeholder-cream-dark/60 font-semibold"
                      />
                      <button 
                        type="submit"
                        className="bg-primary text-cream-light text-[10px] font-extrabold px-4 py-2 rounded-lg hover:bg-primary-light transition-all"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponFeedback.message && (
                    <p className={`text-[10px] font-bold ${
                      couponFeedback.type === "success" ? "text-accent" : "text-[#D9534F]"
                    }`}>
                      {couponFeedback.message}
                    </p>
                  )}

                  <p className="text-[9px] text-[#8C7A6B] leading-relaxed">
                    * Try codes <strong className="text-primary font-serif">GAONSE10</strong> (10% off above ₹500) or <strong className="text-primary font-serif">FARMERWELCOME</strong> (₹50 off above ₹300).
                  </p>
                </div>

                {/* Subtotals & checkout details */}
                <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider pb-2 border-b border-cream-light">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-2 text-xs text-[#5C5043]">
                    <div className="flex justify-between">
                      <span>Basket Subtotal:</span>
                      <span className="font-semibold text-primary">₹{subtotal}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-accent font-bold">
                        <span>Coupon Discount:</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Shipping:</span>
                      <span>
                        {deliveryFee === 0 ? (
                          <strong className="text-accent">FREE</strong>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#8C7A6B] italic leading-relaxed pt-1.5 border-t border-cream-light/60">
                      * 5% Goods and Services Tax (GST) calculated dynamically at Checkout stage.
                    </p>

                    <hr className="border-cream-medium my-3" />
                    
                    <div className="flex justify-between text-sm text-[#2C2520] font-serif">
                      <span className="font-bold">Total (Excl. Tax):</span>
                      <span className="font-extrabold text-primary text-base">₹{subtotal - discount + deliveryFee}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link 
                      href="/checkout"
                      className="bg-primary hover:bg-primary-light text-cream-light font-extrabold text-xs py-3.5 px-6 rounded-full transition-all text-center flex justify-center items-center gap-1.5 shadow-md shadow-primary/10 w-full"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
