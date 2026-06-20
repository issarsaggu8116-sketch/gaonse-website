import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shipping Policy",
  description: "Shipping and delivery terms for GaonSe Organics."
};

export default function ShippingPolicy() {
  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light">
        <div className="max-w-4xl mx-auto bg-theme-white p-8 md:p-12 rounded-2xl shadow-sm border border-cream-medium">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-2">Shipping & Delivery Policy</h1>
          <p className="text-xs text-[#8C7A6B] mb-8 font-sans">Last Updated: June 20, 2026</p>
          
          <div className="space-y-6 text-sm text-[#5C5043] leading-relaxed font-sans">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">1. Shipping Coverage</h2>
              <p>
                We ship our authentic village-sourced foods to all major cities and towns across India. We partner with leading courier carriers such as Delhivery, Blue Dart, and Indian Post to ensure your package arrives fresh and safely. Unfortunately, we do not support international shipping at this time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">2. Order Processing Timelines</h2>
              <p>
                Since our food products are natural and free from chemical stabilizers, they are stored and packed under controlled hygienic conditions in rural hubs.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Orders are processed and packed within <strong>1 to 2 business days</strong> after receipt of payment confirmation.</li>
                <li>Orders are not processed, packed, or dispatched on Sundays or national gazetted holidays.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">3. Shipping Rates & Delivery Timelines</h2>
              <p>
                Our delivery fees are flat-rate based on order values:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Orders above ₹499:</strong> Free standard shipping across India.</li>
                <li><strong>Orders below ₹499:</strong> Flat delivery charge of ₹50.</li>
              </ul>
              <p>Estimated transit times after order dispatch:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Metro Cities (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, etc.):</strong> 3 to 5 business days.</li>
                <li><strong>Non-Metro & Tier 2/3 Cities:</strong> 5 to 7 business days.</li>
                <li><strong>Remote and Rural Districts (e.g. Hill states, Northeast region):</strong> 7 to 10 business days.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">4. Order Tracking</h2>
              <p>
                Once your shipment is handed over to the courier partner, we will email and SMS you a tracking number and link. You can use this tracking link to check your package coordinates in real-time. If you do not receive a tracking notification within 48 hours of your purchase, please contact us.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">5. Delayed Shipments</h2>
              <p>
                On rare occasions, seasonal monsoons, agricultural blockades, or festival volumes may cause logistic delays. We will proactively notify you of any delay. If your order is not delivered within 12 business days of shipment, you are eligible to request an order cancellation and full refund.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">6. Damaged or Broken Packages</h2>
              <p>
                Because we package pickles and honey in glass jars, we use high-density cardboard and honeycomb wrapping. If you receive a jar that was cracked or leaked in transit, please take a photograph immediately and send it to our team at <strong>support@gaonse.com</strong> within 24 hours of delivery. We will ship a free replacement next day.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
