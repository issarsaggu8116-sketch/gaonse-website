import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions of use for GaonSe Organics."
};

export default function TermsConditions() {
  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light">
        <div className="max-w-4xl mx-auto bg-theme-white p-8 md:p-12 rounded-2xl shadow-sm border border-cream-medium">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-2">Terms & Conditions</h1>
          <p className="text-xs text-[#8C7A6B] mb-8 font-sans">Last Updated: June 20, 2026</p>
          
          <div className="space-y-6 text-sm text-[#5C5043] leading-relaxed font-sans">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">1. Scope of Service</h2>
              <p>
                The website gaonse.com is owned and operated by GaonSe Organics Private Limited. By accessing or using our website, ordering our food products, or enrolling in our community platforms, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">2. Account Registration and Eligibility</h2>
              <p>
                To place an order, you may shop as a guest or create an account. You represent that you are at least 18 years old and capable of forming legally binding contracts. You are solely responsible for maintaining the confidentiality of your account password and updating your address details accurately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">3. Sourcing, Pricing & Weight Variations</h2>
              <p>
                At GaonSe, we prioritize authentic craftsmanship. Because our items are handmade in small village batches:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Colors, textures, and aromas of pickles, jaggery, or raw honey may vary slightly with each seasonal harvest.</li>
                <li>All prices listed are in Indian Rupees (INR) and include GST, unless stated otherwise.</li>
                <li>We reserve the right to revise prices or cancel orders in the event of stock unavailability or technical database issues displaying incorrect pricing.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">4. Payments & Billing</h2>
              <p>
                We accept payments through standard credit/debit cards, net banking, UPI, and digital wallets. All transactions are securely routed through our payment gateway partner, Razorpay. The buyer agrees to pay the final amount (inclusive of product pricing, applicable shipping, and transaction taxes) as summarized in the checkout screen prior to confirming the order.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">5. Intellectual Property</h2>
              <p>
                All content on this website, including but not limited to text, logo branding, graphics, pictures, video stories, layout designs, and code databases, is the intellectual property of GaonSe Organics Private Limited and protected by Indian copyright laws. Any unauthorized use or reproduction is strictly prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">6. Limitation of Liability</h2>
              <p>
                GaonSe will not be held responsible for any direct, indirect, incidental, or consequential damages resulting from the consumption of our products if they are handled, stored, or heated inappropriately, or consumed past their listed expiry date. Please review the ingredients list closely to avoid personal food allergens.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">7. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by the laws of India. Any disputes arising in connection with these terms, orders, or services shall be subject to the exclusive jurisdiction of the courts located in Varanasi, Uttar Pradesh.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
