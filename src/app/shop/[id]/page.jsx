import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailContent from "./ProductDetailContent";
import { getProducts } from "@/data/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  
  if (!product) {
    return {
      title: "Product Not Found | GaonSe",
      description: "This product details page is not found in our catalog."
    };
  }
  return {
    title: `${product.name} | GaonSe`,
    description: product.description,
    openGraph: {
      title: `${product.name} | GaonSe`,
      description: product.description,
      images: [{ url: product.images[0] }]
    }
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 bg-cream-light flex items-center justify-center">
          <div className="max-w-md text-center space-y-4 bg-theme-white p-8 rounded-2xl border border-cream-medium shadow-sm">
            <h1 className="text-2xl font-bold font-serif text-[#D9534F]">Harvest Not Found</h1>
            <p className="text-xs text-[#5C5043]">
              The product you are trying to view does not exist or has been retired from our village catalogs.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-1 text-xs font-bold bg-primary text-cream-light py-2.5 px-5 rounded-full hover:bg-primary-light transition-all shadow-sm"
            >
              <ArrowLeft size={14} />
              <span>Back to Store Catalog</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ProductDetailContent product={product} />
      <Footer />
    </>
  );
}
