import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopContent from "./ShopContent";

export const metadata = {
  title: "Shop Traditional Village Harvests | GaonSe",
  description: "Browse organic jaggery (gud), traditional sun-dried pickles, sweet amla murabba, raw forest honey, stone-ground spices, and sprouted millet foods. Sourced directly from rural Indian artisans."
};

export default function ShopPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center min-h-[400px] bg-cream-light">
          <div className="text-[#8C7A6B] text-xs font-semibold animate-pulse">
            Loading village harvests...
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </>
  );
}
