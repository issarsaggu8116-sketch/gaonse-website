"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackOrderAction } from "@/app/actions";
import { 
  Search, 
  Truck, 
  Package, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Loader2,
  FileText,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams) {
      const id = searchParams.get("id");
      if (id) {
        setOrderIdInput(id);
        const fetchOrder = async () => {
          setLoading(true);
          setSearched(true);
          try {
            const result = await trackOrderAction(id);
            setOrder(result);
          } catch (e) {
            console.error("Tracking lookup error", e);
          } finally {
            setLoading(false);
          }
        };
        fetchOrder();
      }
    }
  }, [searchParams]);

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const result = await trackOrderAction(orderIdInput);
      setOrder(result);
    } catch (e) {
      console.error("Tracking lookup error", e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepClass = (stepStatus) => {
    if (!order) return "border-cream-medium text-[#A09080]";
    const currentStatus = order.status;

    if (stepStatus === "Placed") {
      return "bg-accent text-white border-accent";
    }
    if (stepStatus === "Dispatched") {
      if (currentStatus === "Dispatched" || currentStatus === "Delivered") {
        return "bg-accent text-white border-accent";
      }
    }
    if (stepStatus === "Delivered") {
      if (currentStatus === "Delivered") {
        return "bg-accent text-white border-accent";
      }
    }
    return "bg-theme-white text-[#A09080] border-cream-medium";
  };

  return (
    <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light text-[#2C2520]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Tracking Search Card */}
        <div className="bg-theme-white p-6 sm:p-8 rounded-2xl border border-cream-medium shadow-sm space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-serif text-primary">Track Your Village Harvest</h1>
            <p className="text-xs text-[#8C7A6B]">
              Enter your unique Order ID from your email invoice (e.g. GS-123456) to see dynamic dispatch updates
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="text"
              required
              placeholder="e.g. GS-104928"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="flex-grow bg-cream-light/60 border border-cream-medium rounded-full py-2.5 px-4 text-xs text-[#2C2520] focus:outline-none focus:border-secondary font-semibold"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-light text-cream-light font-bold text-xs py-2.5 px-6 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span>Track Order</span>
                  <Search size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        {searched && !loading && (
          order ? (
            <div className="space-y-6">
              
              {/* Status Dashboard Header */}
              <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C7A6B] uppercase font-bold tracking-wider">Order ID</span>
                  <h2 className="text-lg font-bold text-primary font-mono">{order.id}</h2>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C7A6B] uppercase font-bold tracking-wider">Estimated Delivery</span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C5043]">
                    <Calendar size={14} className="text-secondary" />
                    <span>{order.date} (Pending Courier)</span>
                  </div>
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] text-[#8C7A6B] uppercase font-bold tracking-wider block">Fulfillment Status</span>
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    order.status === "Delivered"
                      ? "bg-accent/15 text-accent border border-accent/25"
                      : order.status === "Dispatched"
                        ? "bg-secondary/15 text-[#8C6239] border border-secondary/25"
                        : "bg-[#D6A15F]/15 text-[#7A4E2D] border border-[#D6A15F]/25"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Timeline Progress Visualizer */}
              <div className="bg-theme-white p-6 sm:p-8 rounded-2xl border border-cream-medium shadow-sm space-y-6">
                <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider pb-2 border-b border-cream-light">
                  Tracking Milestones
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  
                  {/* Milestone 1 */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${getStatusStepClass("Placed")}`}>
                      <Package size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary font-serif">1. Order Confirmed</h4>
                      <p className="text-[10px] text-[#8C7A6B] mt-0.5">Sourced & packed in Varanasi</p>
                    </div>
                  </div>

                  {/* Milestone 2 */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${getStatusStepClass("Dispatched")}`}>
                      <Truck size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary font-serif">2. Dispatched</h4>
                      {order.status === "Dispatched" || order.status === "Delivered" ? (
                        <div className="text-[10px] text-accent font-bold mt-0.5">
                          <span>Track: {order.trackingId || "In Transit"}</span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-[#8C7A6B] mt-0.5">Awaiting courier handover</p>
                      )}
                    </div>
                  </div>

                  {/* Milestone 3 */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${getStatusStepClass("Delivered")}`}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary font-serif">3. Delivered</h4>
                      <p className="text-[10px] text-[#8C7A6B] mt-0.5">Handed over to customer</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Items & Invoice Card */}
              <div className="bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider border-b border-cream-light pb-2 flex items-center gap-1.5">
                  <FileText size={14} className="text-secondary" />
                  <span>Purchase Invoice Details</span>
                </h3>

                {/* Customer coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5C5043] bg-cream-light/35 p-4 rounded-xl border border-cream-medium/40">
                  <div className="space-y-1">
                    <p className="font-bold text-primary font-serif">Shipping Coordinates</p>
                    <p className="font-semibold">{order.shippingDetails.name}</p>
                    <p>{order.shippingDetails.address}</p>
                    <p>{order.shippingDetails.city}, {order.shippingDetails.state} - {order.shippingDetails.zip}</p>
                    <p>📞 Phone: {order.shippingDetails.phone}</p>
                  </div>
                  <div className="space-y-1 sm:text-right">
                    <p className="font-bold text-primary font-serif">Billing Summary</p>
                    <p>Date: {order.date}</p>
                    <p>Payment: <strong className="text-accent">Razorpay Sandbox Approved</strong></p>
                    <p>Customer: {order.shippingDetails.email}</p>
                  </div>
                </div>

                {/* Products purchased */}
                <div className="divide-y divide-cream-light text-xs text-[#5C5043] pt-2">
                  {order.cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2.5">
                      <div>
                        <p className="font-bold text-primary">{item.product.name}</p>
                        <p className="text-[10px] text-[#8C7A6B] mt-0.5">Weight: {item.selectedWeight.weight} x {item.quantity}</p>
                      </div>
                      <span className="font-semibold">₹{item.selectedWeight.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Tiers */}
                <div className="pt-4 border-t border-cream-medium flex flex-col items-end text-xs text-[#5C5043] space-y-1.5">
                  <div className="flex gap-12 w-48 justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex gap-12 w-48 justify-between text-accent font-bold">
                      <span>Discount:</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex gap-12 w-48 justify-between">
                    <span>Delivery Shipping:</span>
                    <span>{order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</span>
                  </div>
                  <div className="flex gap-12 w-48 justify-between text-[10px] text-[#8C7A6B]">
                    <span>GST (5% split):</span>
                    <span>₹{order.gst}</span>
                  </div>
                  <div className="flex gap-12 w-48 justify-between font-serif font-extrabold text-[#2C2520] pt-2 border-t border-cream-light text-sm">
                    <span>Grand Total:</span>
                    <span className="text-primary text-base">₹{order.total}</span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-theme-white p-12 rounded-2xl border border-cream-medium text-center space-y-4 max-w-md mx-auto">
              <Clock size={36} className="text-[#D9534F] mx-auto animate-pulse" />
              <h3 className="text-md font-bold text-primary">Order ID Not Found</h3>
              <p className="text-xs text-[#8C7A6B]">
                Double check the ID (e.g. GS-104928) or log in to your account to review order histories.
              </p>
              <button
                onClick={() => setSearched(false)}
                className="bg-cream-medium text-primary text-xs font-bold py-2 px-5 rounded-full hover:bg-cream-dark transition-all"
              >
                Search Again
              </button>
            </div>
          )
        )}

      </div>
    </main>
  );
}
