import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection terms for GaonSe Organics."
};

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-cream-light">
        <div className="max-w-4xl mx-auto bg-theme-white p-8 md:p-12 rounded-2xl shadow-sm border border-cream-medium">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-2">Privacy Policy</h1>
          <p className="text-xs text-[#8C7A6B] mb-8 font-sans">Last Updated: June 20, 2026</p>
          
          <div className="space-y-6 text-sm text-[#5C5043] leading-relaxed font-sans">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">1. Introduction</h2>
              <p>
                Welcome to GaonSe. We value your trust and are committed to protecting your privacy. This Privacy Policy explains how GaonSe Organics Private Limited ("we", "us", or "our") collects, uses, shares, and protects your personal information when you visit our website, mobile application, or purchase our products.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">2. Information We Collect</h2>
              <p>We collect information to provide better services to all our users. The types of personal information we collect include:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Contact Information:</strong> Name, shipping address, billing address, phone number, and email address.</li>
                <li><strong>Payment Details:</strong> Secure checkout tokens (payments are processed via encrypted channels by our payment processor, Razorpay). We do not store your credit/debit card numbers or PINs directly on our servers.</li>
                <li><strong>Transaction History:</strong> Details of products you purchased, order dates, values, and payment status.</li>
                <li><strong>Technical Information:</strong> IP address, device types, browser version, and page usage statistics collected via cookies.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">3. How We Use Your Information</h2>
              <p>We use the collected information for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Processing, packing, and dispatching your orders.</li>
                <li>Sending order tracking notifications and customer support responses.</li>
                <li>Verifying payments and preventing fraudulent transactions.</li>
                <li>Sending promotional emails, farmer newsletters, and seasonal offers (only if you opt-in).</li>
                <li>Improving our web application experience and resolving performance bugs.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">4. Data Sharing & Third-Party Disclosure</h2>
              <p>
                We do not sell, rent, or trade your personal information to third parties. We share your information only with trusted service partners for specific operations:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Delivery Services:</strong> Logistics partners (e.g., Delhivery, Blue Dart) who require your shipping details and contact number to deliver packages.</li>
                <li><strong>Payment Gateways:</strong> Razorpay, which securely processes your transaction.</li>
                <li><strong>SMS & Email Services:</strong> Automated notification services to send you transactional updates.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">5. Cookies and Tracking</h2>
              <p>
                We use cookies to analyze web traffic, remember your cart items when you close the tab, and save your account preferences. You can configure your browser to reject cookies, but this might prevent you from utilizing our shopping basket checkout system.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">6. Data Security</h2>
              <p>
                We employ industry-standard Secure Sockets Layer (SSL) encryption for all communication on our site. Your payment flows are fully handled inside PCI-DSS compliant secure frameworks. However, please remember that no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-primary font-serif">7. Contact Information</h2>
              <p>
                For questions regarding this policy or to request removal of your personal information from our databases, please contact our Grievance Officer at:
              </p>
              <p className="bg-cream-light p-4 rounded-lg font-mono text-xs border border-cream-medium text-[#5C5043]">
                <strong>GaonSe Privacy Office</strong><br />
                Email: support@gaonse.com<br />
                Address: Plot 14, Kabir Nagar, Near Durga Temple, Varanasi, Uttar Pradesh - 221005, India<br />
                Phone: +91 88536 72031
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
