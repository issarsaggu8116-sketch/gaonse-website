"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { getProductsAction } from "@/app/actions";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Heart, 
  ArrowLeft, 
  Play, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Plus,
  Minus,
  Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetailContent({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const router = useRouter();

  // State
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState("description"); // description, ingredients, farmer
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  // Custom new review state
  const [reviews, setReviews] = useState(product.reviews);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Dynamic Products List for related harvests
  const [productsList, setProductsList] = useState([]);

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const p = await getProductsAction();
        setProductsList(p);
      } catch (e) {
        console.error("Failed to load products list", e);
      }
    }
    loadProducts();
  }, []);

  const isInWishlist = wishlist.some(item => item.id === product.id);

  // Handlers
  const handleQuantityChange = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedWeight, quantity);
    router.push("/checkout");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const reviewObj = {
      id: `r-new-${Date.now()}`,
      name: newReview.name,
      rating: Number(newReview.rating),
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0]
    };

    setReviews([reviewObj, ...reviews]);
    setReviewSubmitted(true);
    setNewReview({ name: "", rating: 5, comment: "" });
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  // Find related products
  const relatedProducts = productsList
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Calculate rating averages
  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  // SEO schema markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "GaonSe"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": selectedWeight.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "GaonSe Organics"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": reviews.length
    }
  };

  return (
    <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-cream-light text-[#2C2520]">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Back Link */}
        <div>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C7A6B] hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Shop Listing</span>
          </Link>
        </div>

        {/* Core Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-theme-white p-6 sm:p-8 rounded-2xl border border-cream-medium shadow-sm">
          
          {/* Left Column: Media Gallery */}
          <div className="space-y-4">
            
            {/* Main view (Image or Video) */}
            <div className="relative pt-[80%] rounded-xl overflow-hidden bg-cream-light border border-cream-medium">
              {isPlayingVideo ? (
                <div className="absolute inset-0 bg-[#000000] flex items-center justify-center">
                  <video 
                    src={product.video} 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                  />
                  <button 
                    onClick={() => setIsPlayingVideo(false)}
                    className="absolute top-4 right-4 bg-theme-white/80 hover:bg-theme-white text-primary text-xs font-bold py-1 px-3 rounded-full"
                  >
                    Show Images
                  </button>
                </div>
              ) : (
                <>
                  <img 
                    src={activeImage} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {product.video && (
                    <button 
                      onClick={() => setIsPlayingVideo(true)}
                      className="absolute bottom-4 right-4 p-3 bg-primary text-cream-light rounded-full shadow-lg hover:bg-primary-light transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                    >
                      <Play size={14} className="fill-cream-light" />
                      <span>Play Farmer Video</span>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImage(img);
                    setIsPlayingVideo(false);
                  }}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-cream-light transition-all ${
                    activeImage === img && !isPlayingVideo
                      ? "border-secondary scale-95" 
                      : "border-cream-medium hover:border-cream-dark"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
              
              {product.video && (
                <button
                  onClick={() => setIsPlayingVideo(true)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-[#000000]/10 flex flex-col items-center justify-center gap-1 transition-all ${
                    isPlayingVideo ? "border-secondary scale-95" : "border-cream-medium hover:border-cream-dark"
                  }`}
                >
                  <Play size={20} className="text-primary fill-primary" />
                  <span className="text-[9px] font-bold text-primary">Farmer Story</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Order Configuration */}
          <div className="space-y-6">
            
            {/* Title / Rating / Origin */}
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <span className="bg-cream-dark text-primary text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                  Sourced from {product.origin}
                </span>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-2 border border-cream-medium rounded-full bg-cream-light text-[#5C5043] hover:text-accent hover:border-cream-dark transition-all"
                  aria-label="Toggle Wishlist"
                >
                  <Heart size={18} className={isInWishlist ? "fill-accent text-accent" : ""} />
                </button>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold font-serif text-primary leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-[#D6A15F] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.floor(averageRating) ? "★" : "☆"}</span>
                  ))}
                </div>
                <span className="text-xs font-bold text-primary">{averageRating} out of 5</span>
                <span className="text-xs text-[#8C7A6B]">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="bg-cream-light/60 p-4 rounded-xl border border-cream-medium/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#8C7A6B] block uppercase tracking-wider">Price</span>
                <span className="text-2xl font-extrabold text-[#2C2520]">₹{selectedWeight.price}</span>
              </div>
              <div className="text-right text-[10px] text-accent font-bold">
                <p>Tax Included (GST 5%)</p>
                <p className="text-[#8C7A6B] font-normal mt-0.5">Free shipping on orders above ₹499</p>
              </div>
            </div>

            {/* Weight Picker */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider">Select Weight</h3>
              <div className="flex gap-3">
                {product.weightOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedWeight(opt)}
                    className={`py-2 px-4 rounded-full text-xs font-extrabold border transition-all ${
                      selectedWeight.id === opt.id
                        ? "bg-primary text-cream-light border-primary shadow-sm"
                        : "bg-theme-white text-primary border-cream-medium hover:bg-cream-medium/40"
                    }`}
                  >
                    {opt.weight} - ₹{opt.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty Selector & Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-primary font-serif uppercase tracking-wider">Qty:</span>
                <div className="flex items-center border border-cream-dark/50 rounded-full bg-cream-light px-1">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 text-primary hover:text-secondary"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-xs font-extrabold text-primary">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 text-primary hover:text-secondary"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`py-3.5 px-6 rounded-full text-xs font-extrabold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                    justAdded 
                      ? "bg-accent text-theme-white" 
                      : "bg-cream-medium text-primary border border-cream-dark hover:bg-cream-dark"
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check size={16} />
                      <span>Added to Basket</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>Add to Basket</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-full text-xs font-extrabold tracking-wide bg-primary text-cream-light hover:bg-primary-light transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/10 cursor-pointer"
                >
                  <span>Buy Now (Vedic Checkout)</span>
                </button>
              </div>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-cream-medium text-[9px] font-bold text-[#8C7A6B] text-center">
              <div className="flex flex-col items-center gap-1.5 p-2 bg-cream-light/45 rounded-lg">
                <ShieldCheck size={16} className="text-accent" />
                <span>Quality Tested</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-cream-light/45 rounded-lg">
                <Truck size={16} className="text-secondary" />
                <span>Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-cream-light/45 rounded-lg">
                <RefreshCw size={16} className="text-[#E76F51]" />
                <span>Easy Replacements</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Section: Tabs and Farmer Origin */}
        <div className="bg-theme-white p-6 sm:p-8 rounded-2xl border border-cream-medium shadow-sm space-y-6">
          {/* Tab buttons */}
          <div className="flex border-b border-cream-medium gap-6">
            {[
              { id: "description", name: "Product & Farmer Story" },
              { id: "ingredients", name: "Ingredients & Health Benefits" },
              { id: "reviews", name: `Reviews (${reviews.length})` }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`pb-3 text-xs uppercase font-extrabold tracking-wider transition-all relative ${
                  activeTab === t.id 
                    ? "text-primary font-bold" 
                    : "text-[#8C7A6B] hover:text-[#5C5043]"
                }`}
              >
                {t.name}
                {activeTab === t.id && (
                  <motion.div 
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="text-xs sm:text-sm text-[#5C5043] leading-relaxed font-sans min-h-[160px]">
            
            {activeTab === "description" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2 space-y-4">
                  <p>{product.longDescription}</p>
                  <div>
                    <h4 className="font-extrabold text-primary font-serif uppercase tracking-wider text-[11px] mb-1">Origin</h4>
                    <p>{product.origin}</p>
                  </div>
                </div>
                
                {/* Farmer story card */}
                {product.farmer && (
                  <div className="p-5 bg-cream-light/60 rounded-xl border border-cream-medium space-y-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.farmerImage} 
                        alt={product.farmer} 
                        className="w-12 h-12 object-cover rounded-full border border-cream-medium shadow-sm"
                      />
                      <div>
                        <h4 className="font-extrabold text-primary font-serif text-xs">{product.farmer}</h4>
                        <span className="text-[10px] text-[#8C7A6B] font-semibold">Local Artisan Sourced</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5C5043] leading-relaxed italic">
                      "{product.farmerStory}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ingredients" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-primary font-serif uppercase tracking-wider text-[11px]">Ingredients</h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {product.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-extrabold text-primary font-serif uppercase tracking-wider text-[11px]">Key Health Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    {product.benefits.map((ben, i) => (
                      <li key={i}>{ben}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                
                {/* Add review form */}
                <div className="p-5 bg-cream-light/50 rounded-xl border border-cream-medium space-y-4 max-w-xl">
                  <h4 className="font-bold text-primary font-serif text-sm">Write a Customer Review</h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-primary font-serif">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Ramesh Sharma"
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          className="w-full bg-theme-white border border-cream-medium rounded-lg p-2 text-xs text-[#2C2520] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-primary font-serif">Rating</label>
                        <select
                          value={newReview.rating}
                          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                          className="w-full bg-theme-white border border-cream-medium rounded-lg p-2 text-xs text-[#2C2520] focus:outline-none"
                        >
                          <option value="5">5 Stars (Excellent)</option>
                          <option value="4">4 Stars (Good)</option>
                          <option value="3">3 Stars (Average)</option>
                          <option value="2">2 Stars (Poor)</option>
                          <option value="1">1 Star (Terrible)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-primary font-serif">Comments</label>
                      <textarea
                        required
                        rows="3"
                        placeholder="Share your experience (taste, aroma, freshness)..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full bg-theme-white border border-cream-medium rounded-lg p-2 text-xs text-[#2C2520] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-primary text-cream-light font-bold text-[10px] py-2 px-4 rounded-full hover:bg-primary-light transition-all"
                    >
                      Submit Review
                    </button>
                    {reviewSubmitted && (
                      <p className="text-[10px] text-accent font-bold mt-2">
                        ✔ Review submitted! It is active on this page.
                      </p>
                    )}
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-cream-light/30 rounded-lg border border-cream-light space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary text-xs">{rev.name}</span>
                        <span className="text-[10px] text-[#8C7A6B]">{rev.date}</span>
                      </div>
                      <div className="flex text-[#D6A15F] text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <p className="text-xs text-[#5C5043] font-medium leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-serif text-primary">Related Village Harvests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div 
                  key={p.id}
                  className="bg-theme-white rounded-2xl border border-cream-medium overflow-hidden shadow-sm hover:shadow-md hover:border-cream-dark transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="relative pt-[80%] overflow-hidden bg-cream-light">
                    <img src={p.images[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[9px] text-secondary font-bold uppercase tracking-wider">{p.category}</span>
                      <Link href={`/shop/${p.id}`} className="block">
                        <h3 className="text-xs font-bold text-primary font-serif line-clamp-2 hover:text-[#9C6644] leading-snug">
                          {p.name}
                        </h3>
                      </Link>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-cream-light">
                      <span className="text-xs font-extrabold text-[#2C2520]">₹{p.price}</span>
                      <Link href={`/shop/${p.id}`} className="text-[10px] font-bold text-primary underline">
                        View Item
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
