import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: {
    default: "GaonSe - Authentic Taste From India's Villages",
    template: "%s | GaonSe"
  },
  description: "Authentic, premium food products sourced directly from rural Indian farmers and artisans. Shop organic jaggery (gud), traditional sun-dried pickles, sweet amla murabba, raw forest honey, stone-ground spices, and sprouted millet foods.",
  keywords: ["gaonse", "organic food", "village foods", "jaggery", "gud", "indian pickles", "traditional ghee", "raw honey", "lakadong turmeric", "millets", "direct from farmers", "rural india"],
  authors: [{ name: "GaonSe Team" }],
  metadataBase: new URL("https://gaonse.com"),
  openGraph: {
    title: "GaonSe - Authentic Taste From India's Villages",
    description: "Traditional food products sourced directly from rural Indian farmers and artisans. 100% chemical-free and premium quality.",
    url: "https://gaonse.com",
    siteName: "GaonSe",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "GaonSe Authentic Indian Village Foods",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GaonSe - Authentic Taste From India's Villages",
    description: "Traditional, chemical-free food products sourced directly from rural Indian artisans.",
    images: ["https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream-light text-[#2C2520] font-sans selection:bg-[#D6A15F] selection:text-[#FFFFFF]">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
