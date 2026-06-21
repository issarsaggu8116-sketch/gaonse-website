import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrackOrderContent from "./TrackOrderContent";

export const metadata = {
  title: "Track Your Order | GaonSe",
  description: "Check the status and delivery progress of your authentic village harvests from GaonSe.",
};

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center min-h-[400px] bg-cream-light">
          <div className="text-[#8C7A6B] text-xs font-semibold animate-pulse">
            Loading order tracking...
          </div>
        </div>
      }>
        <TrackOrderContent />
      </Suspense>
      <Footer />
    </>
  );
}
