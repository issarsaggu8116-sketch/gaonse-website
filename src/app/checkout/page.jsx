"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  CreditCard,
  QrCode,
  Globe,
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createOrderAction } from "@/app/actions";
import Link from "next/link";

export default function CheckoutPage() {
  const { 
    cart, 
    clearCart,
    getCartSubtotal, 
    getDiscountAmount,
    getGstAmount,
    getDeliveryFee,
    getCartTotal,
    activeCoupon
  } = useCart();

  const { user } = useAuth();

  // Form Fields
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Uttar Pradesh", // Default
    zip: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, cards, netbanking
  
  // Interactive Simulator States
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState("select"); // select, processing, success, failure
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [lastOrderId, setLastOrderId] = useState("");

  // Pre-fill user values if authenticated
  React.useEffect(() => {
    if (user) {
      setShippingDetails((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email
      }));
    }
  }, [user]);

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const delivery = getDeliveryFee();
  const gst = getGstAmount();
  const total = getCartTotal();

  // GST Breakdown: 5% split into CGST (2.5%) and SGST (2.5%) for UP sourcing deliveries, or IGST (5%) elsewhere
  const cgst = Math.round(gst / 2);
  const sgst = gst - cgst;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrderClick = (e) => {
    e.preventDefault();
    if (!shippingDetails.name || !shippingDetails.email || !shippingDetails.phone || !shippingDetails.address || !shippingDetails.zip) {
      alert("Please fill in all shipping details first.");
      return;
    }
    // Open Razorpay Simulator Modal
    setIsRazorpayOpen(true);
    setPaymentStep("select");
  };

  const triggerRazorpaySimulatePayment = (status) => {
    setPaymentStep("processing");
    setTimeout(async () => {
      if (status === "success") {
        try {
          const orderData = {
            cart,
            shippingDetails,
            subtotal,
            discount,
            delivery,
            gst,
            total,
            couponCode: activeCoupon?.code || ""
          };
          const res = await createOrderAction(orderData);
          if (res.success) {
            setLastOrderId(res.order.id);
            setPaymentStep("success");
            setTimeout(() => {
              setIsRazorpayOpen(false);
              setOrderConfirmed(true);
              clearCart();
            }, 1500);
          } else {
            alert(res.error || "Failed to save order.");
            setPaymentStep("select");
          }
        } catch (e) {
          console.error("Order creation failed", e);
          setPaymentStep("select");
        }
      } else {
        setPaymentStep("failure");
      }
    }, 2000);
  };

  if (orderConfirmed) {
    return (
      <>
        <Header />
        <main className="flex-grow py-16 px-4 bg-cream-light flex items-center justify-center">
          <div className="max-w-xl text-center space-y-6 bg-theme-white p-8 md:p-12 rounded-2xl border border-cream-medium shadow-sm">
            <div className="inline-block p-4 bg-accent-light/10 text-accent rounded-full">
              <CheckCircle2 size={54} />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-accent uppercase font-bold tracking-wider">Payment Approved via Razorpay</span>
              <h1 className="text-3xl font-bold font-serif text-primary">Namaste, Order Confirmed!</h1>
              <p className="text-xs text-[#8C7A6B]">
                Your Order ID is <strong className="text-primary font-mono">{lastOrderId}</strong>. A GST invoice has been emailed to you.
              </p>
            </div>
            <div className="p-4 bg-cream-light rounded-xl text-left border border-cream-medium space-y-2 text-xs text-[#5C5043]">
              <h3 className="font-bold text-primary font-serif">Delivery Tracking details</h3>
              <p>📍 Sourcing Consolidation Center: <strong>Varanasi, UP</strong></p>
              <p>📦 Expected Dispatch: <strong>Within 24 Hours</strong></p>
              <p>🚚 Courier Logistics Partner: <strong>Delhivery Standard Air</strong></p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link 
                href={`/track-order?id=${lastOrderId}`} 
                className="bg-accent hover:bg-[#a53b12] text-[#FFFDF8] font-bold text-xs py-3.5 px-6 rounded-full transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Track Your Order</span>
                <ArrowRight size={14} />
              </Link>
              <Link 
                href="/shop" 
                className="bg-[#F5EFEB] border border-[#E5DFD9] text-[#7A4E2D] hover:bg-[#E5DFD9] font-bold text-xs py-3.5 px-6 rounded-full transition-all flex items-center justify-center"
              >
                Continue Sourcing
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light text-[#2C2520]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex items-center gap-3">
            <Link href="/cart" className="p-2 border border-cream-medium bg-theme-white rounded-full text-primary hover:bg-cream-medium transition-all">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-3xl font-bold font-serif text-primary">Checkout & Shipping</h1>
          </div>

          {cart.length === 0 ? (
            <div className="bg-theme-white rounded-2xl border border-cream-medium p-12 text-center max-w-md mx-auto space-y-4">
              <h2 className="text-lg font-bold text-primary font-serif">No items to checkout</h2>
              <p className="text-xs text-[#5C5043]">Add traditional harvests to your basket to proceed.</p>
              <Link href="/shop" className="inline-block bg-primary text-cream-light font-bold text-xs py-2.5 px-5 rounded-full">
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              
              {/* Left Column: Form Details */}
              <form onSubmit={handlePlaceOrderClick} className="lg:col-span-3 space-y-6">
                
                {/* Shipping Details Box */}
                <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm space-y-4">
                  <h2 className="text-md font-bold text-primary font-serif border-b border-cream-light pb-2">
                    1. Shipping Information
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary font-serif">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Rohan Sharma"
                        value={shippingDetails.name}
                        onChange={handleInputChange}
                        className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs focus:outline-none"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary font-serif">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="e.g. 9876543210"
                        value={shippingDetails.phone}
                        onChange={handleInputChange}
                        className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary font-serif">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="rohan@gmail.com"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary font-serif">Detailed Delivery Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="e.g. Flat 304, Green Heights, Kabir Nagar"
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary font-serif">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Varanasi"
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary font-serif">State *</label>
                      <select
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleInputChange}
                        className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs focus:outline-none"
                      >
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bihar">Bihar</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-primary font-serif">Postal PIN Code *</label>
                      <input
                        type="text"
                        name="zip"
                        required
                        placeholder="221005"
                        value={shippingDetails.zip}
                        onChange={handleInputChange}
                        className="w-full bg-cream-light/60 border border-cream-medium rounded-lg p-2.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Submitting Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-[#7A4E2D]/5 p-5 rounded-2xl border border-[#7A4E2D]/20 gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#5C5043]">
                    <Lock size={15} className="text-primary" />
                    <span>Transactions are secured via Razorpay and 256-bit SSL encryption.</span>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-light text-cream-light font-extrabold text-xs py-3.5 px-8 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10 w-full sm:w-auto"
                  >
                    <span>Proceed to Pay</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </form>

              {/* Right Column: Invoice Summary Breakdown */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Items summary review */}
                <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider border-b border-cream-light pb-2">
                    Review Basket ({cart.length})
                  </h3>
                  
                  <div className="max-h-48 overflow-y-auto divide-y divide-cream-light pr-1">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2.5 text-xs">
                        <div className="min-w-0 pr-4">
                          <p className="font-bold text-primary truncate">{item.product.name}</p>
                          <p className="text-[10px] text-[#8C7A6B] mt-0.5">
                            {item.selectedWeight.weight} x {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold text-[#2C2520] shrink-0">
                          ₹{item.selectedWeight.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <hr className="border-cream-medium" />

                  {/* Pricing Tiers & dynamic GST breakdown */}
                  <div className="space-y-2 text-xs text-[#5C5043]">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-primary">₹{subtotal}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-accent font-bold">
                        <span>Discount ({activeCoupon?.code}):</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
                    </div>

                    {/* GST Breakdown */}
                    <div className="pt-2 border-t border-cream-light/60 space-y-1 text-[10px] text-[#8C7A6B]">
                      {shippingDetails.state === "Uttar Pradesh" ? (
                        <>
                          <div className="flex justify-between">
                            <span>CGST (2.5%):</span>
                            <span>₹{cgst}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SGST (2.5%):</span>
                            <span>₹{sgst}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span>IGST (5%):</span>
                          <span>₹{gst}</span>
                        </div>
                      )}
                    </div>

                    <hr className="border-cream-medium my-2" />

                    <div className="flex justify-between text-sm text-[#2C2520] font-serif font-extrabold pt-1">
                      <span>Grand Total (Net):</span>
                      <span className="text-lg text-primary">₹{total}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* RAZORPAY GATEWAY MODAL SIMULATOR */}
      {isRazorpayOpen && (
        <div className="fixed inset-0 bg-[#000000]/65 z-55 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-sm rounded-xl overflow-hidden shadow-2xl border border-cream-medium flex flex-col font-sans">
            
            {/* Razorpay Top Header */}
            <div className="bg-[#17233B] text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="bg-[#3D85F4] text-white text-xs font-bold w-6 h-6 rounded flex items-center justify-center font-serif">
                  R
                </span>
                <div>
                  <h3 className="text-xs font-bold leading-none">Razorpay Secured Checkout</h3>
                  <span className="text-[9px] text-[#A0AABF] uppercase tracking-wider">Merchant: GaonSe Organics</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsRazorpayOpen(false)}
                className="text-[#A0AABF] hover:text-white text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Amount details */}
            <div className="bg-[#F8FAFC] px-5 py-4 flex justify-between items-center border-b border-[#E2E8F0]">
              <span className="text-xs text-[#64748B]">Amount to Pay</span>
              <span className="text-base font-extrabold text-[#1E293B]">₹{total}.00</span>
            </div>

            {/* Main content body based on step */}
            <div className="p-5 flex-1 min-h-[180px] flex flex-col justify-center">
              
              {paymentStep === "select" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Select Demo Payment Path</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    This is a Razorpay API simulator. Choose the simulated outcome of your sandbox test:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => triggerRazorpaySimulatePayment("success")}
                      className="py-3 px-4 bg-accent text-white rounded-lg text-xs font-bold hover:bg-opacity-95 transition-all cursor-pointer text-center"
                    >
                      Simulate Success
                    </button>
                    
                    <button
                      onClick={() => triggerRazorpaySimulatePayment("failure")}
                      className="py-3 px-4 bg-[#D9534F] text-white rounded-lg text-xs font-bold hover:bg-opacity-95 transition-all cursor-pointer text-center"
                    >
                      Simulate Failure
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === "processing" && (
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 size={36} className="text-[#3D85F4] animate-spin" />
                  <h4 className="text-xs font-bold text-[#1E293B]">Processing payment details...</h4>
                  <p className="text-[10px] text-[#64748B]">Do not close this modal or refresh the page.</p>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-2 bg-accent/10 text-accent rounded-full">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xs font-bold text-accent">Payment Successful!</h4>
                  <p className="text-[10px] text-[#64748B]">Clearing basket and updating invoice metrics...</p>
                </div>
              )}

              {paymentStep === "failure" && (
                <div className="space-y-4 text-center">
                  <div className="inline-block p-2 bg-[#D9534F]/10 text-[#D9534F] rounded-full mx-auto">
                    <AlertTriangle size={32} />
                  </div>
                  <h4 className="text-xs font-bold text-[#D9534F]">Transaction Declined</h4>
                  <p className="text-[10px] text-[#64748B] max-w-xs mx-auto">
                    Simulated payment failure (e.g. Insufficient balance or incorrect OTP). Please retry.
                  </p>
                  <button
                    onClick={() => setPaymentStep("select")}
                    className="mt-2 text-xs font-bold text-[#3D85F4] hover:underline"
                  >
                    Try Another Payment
                  </button>
                </div>
              )}

            </div>

            {/* Razorpay Footer */}
            <div className="bg-[#F8FAFC] py-3.5 px-5 border-t border-[#E2E8F0] flex justify-between items-center text-[10px] text-[#64748B]">
              <span className="flex items-center gap-1">
                <Lock size={12} className="text-accent" />
                <span>100% Encrypted</span>
              </span>
              <span>Razorpay API v2 Sandbox</span>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
