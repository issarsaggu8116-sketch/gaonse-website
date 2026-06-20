import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Return Policy",
  description: "Return and product replacement rules for GaonSe Organics."
};

export default function ReturnPolicy() {
  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light">
        <div className="max-w-4xl mx-auto bg-theme-white p-8 md:p-12 rounded-2xl shadow-sm border border-cream-medium">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-2">Return Policy</h1>
          <p className="text-xs text-[#8C7A6B] mb-8 font-sans">Last Updated: June 20, 2026</p>
          
          <div className="space-y-6 text-sm text-[#5C5043] leading-relaxed font-sans">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">1. Overview for Food Products</h2>
              <p>
                At GaonSe, we specialize in food products (including jaggery, pickles, murabba, honey, spices, and millets) that are prepared naturally by rural communities. Due to the perishable nature of food, we enforce specific guidelines regarding returns to ensure food safety and quality control.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">2. Eligibility for Returns</h2>
              <p>We accept return and replacement requests within <strong>7 days</strong> from the date of delivery. An item is eligible for return or replacement under the following conditions:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The product was received in a damaged, broken, or leaky state.</li>
                <li>The seal of the jar or package is broken at the time of delivery.</li>
                <li>You received an incorrect product or size that does not match your invoice.</li>
                <li>The product has expired before delivery or is found to contain foreign materials.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">3. Non-Returnable Items</h2>
              <p>We cannot accept returns or provide refunds for:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Products that have been partially consumed, opened, or have their safety seals broken after delivery.</li>
                <li>Products where the original packaging (jars, boxes, outer labels) has been discarded.</li>
                <li>Requests raised after 7 days from the time of delivery confirmation.</li>
                <li>Dislike of taste or texture variations, as these are natural artisanal foods and differ slightly from commercial brands.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">4. Return Process</h2>
              <p>To request a return or replacement:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Take clear photos or a short video showing the damaged product, the packaging, and the invoice.</li>
                <li>Send these files via email to <strong>support@gaonse.com</strong> along with your Order ID and contact details.</li>
                <li>Our quality assurance team will inspect the request within 24 to 48 hours.</li>
                <li>If approved, we will arrange a reverse pickup from your address at no additional cost, or issue a direct shipment replacement.</li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">5. Contact Information</h2>
              <p>For any assistance regarding your returns, feel free to email our customer desk: <strong>support@gaonse.com</strong> or call us at <strong>+91 88536 72031</strong>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
