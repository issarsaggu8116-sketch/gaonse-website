import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Cancellation & Refund Policy",
  description: "Order cancellation and payment refund terms for GaonSe Organics."
};

export default function RefundPolicy() {
  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light">
        <div className="max-w-4xl mx-auto bg-theme-white p-8 md:p-12 rounded-2xl shadow-sm border border-cream-medium">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-2">Cancellation & Refund Policy</h1>
          <p className="text-xs text-[#8C7A6B] mb-8 font-sans">Last Updated: June 20, 2026</p>
          
          <div className="space-y-6 text-sm text-[#5C5043] leading-relaxed font-sans">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">1. Order Cancellations</h2>
              <p>
                You can cancel your order at any time before it is dispatched from our packing warehouse.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Pre-Dispatch Cancellation:</strong> If the order status is still "Processing" and has not been dispatched, you can cancel it by emailing <strong>support@gaonse.com</strong> or calling our help desk. A full refund will be initiated immediately.</li>
                <li><strong>Post-Dispatch Cancellation:</strong> Once an order is handed over to our courier partner and a tracking ID is generated, the order cannot be cancelled or recalled. If you refuse delivery at your doorstep, return shipping charges may be deducted from your final refund.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">2. Refund Processing Timelines</h2>
              <p>
                Once an order cancellation is approved or a returned product is received back at our warehouse and verified, the refund process is initiated:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Refunds will be processed back to the <strong>original payment method</strong> (Credit/Debit Card, Net Banking, UPI, Wallet) used during purchase.</li>
                <li>The funds generally reflect in your bank account or card balance within <strong>5 to 7 business days</strong>, depending on your bank's clearance cycles.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">3. Partial Refunds & Coupons</h2>
              <p>
                If you applied a promo coupon during check out and request a return/refund for only one of multiple items in your order:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>The discount value will be proportionally distributed across all products in the invoice.</li>
                <li>The refund amount will match the exact discounted purchase price of that specific item listed on the invoice.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">4. Failed Transactions</h2>
              <p>
                In case of a transaction failure where money was debited from your account but the order confirmation was not generated on our site:
              </p>
              <p>
                The payment gateway (Razorpay) will automatically reverse the transaction and refund the amount back to your account within 24 to 48 hours. If the amount does not reflect in your account, please email us or contact your bank's customer support.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">5. Contact Information</h2>
              <p>For any queries about refunds, failed transactions, or cancellations, please reach out to our billing desk at <strong>support@gaonse.com</strong>.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
