"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getProductsAction, getCategoriesAction } from "@/app/actions";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SlidersHorizontal, 
  Search, 
  Grid, 
  Heart, 
  ArrowUpDown, 
  Plus, 
  Check,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

export default function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist } = useCart();

  // Dynamic Sourcing States
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // URL Params
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceLimit, setPriceLimit] = useState(1500);
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);

  // Load database lists on mount
  useEffect(() => {
    async function loadData() {
      setDataLoading(true);
      try {
        const p = await getProductsAction();
        const c = await getCategoriesAction();
        setProductsList(p);
        setCategoriesList(c);
      } catch (e) {
        console.error("Failed to load shop data", e);
      } finally {
        setDataLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync URL params to local state
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("All");
    }
  }, [categoryParam]);

  useEffect(() => {
    if (searchParam) {
      setSearchTerm(searchParam);
    } else {
      setSearchTerm("");
    }
  }, [searchParam]);

  // Handle Search Input Submission locally
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    setCurrentPage(1);
    router.push(`/shop?${params.toString()}`);
  };

  // Handle Category click
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (categoryName !== "All") {
      params.set("category", categoryName);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  // Filter & Sort logic
  const filteredProducts = productsList.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Check base price
    const matchesPrice = product.price <= priceLimit;
    
    // Check search term
    const query = searchTerm.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(query) || 
                          product.description.toLowerCase().includes(query) || 
                          product.origin.toLowerCase().includes(query) ||
                          product.farmer.toLowerCase().includes(query);

    return matchesCategory && matchesPrice && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    // Default to featured (featured products first, or by id)
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setPriceLimit(1500);
    setSortBy("featured");
    setSearchTerm("");
    setCurrentPage(1);
    router.push("/shop");
  };

  const handleQuickAdd = (product) => {
    // Add default first weight option
    addToCart(product, product.weightOptions[0], 1);
    setJustAddedId(`${product.id}-added`);
    setTimeout(() => setJustAddedId(null), 2000);
  };

  return (
    <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 bg-cream-light">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Title */}
        <div className="bg-cream-medium/40 py-8 px-6 rounded-2xl border border-cream-medium text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary">Shop Organic Harvests</h1>
          <p className="text-xs text-[#8C7A6B] max-w-lg mx-auto">
            100% natural, direct-from-farmer spices, honey, jaggery, and handcrafted foods.
          </p>
        </div>

        {/* Search, Filter Toggles & Sort Header */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-theme-white p-4 rounded-xl border border-cream-medium shadow-sm">
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search in store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-cream-light/60 border border-cream-medium rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-secondary text-[#2C2520]"
            />
            <button type="submit" className="absolute right-3 top-2 text-[#8C7A6B] hover:text-primary">
              <Search size={16} />
            </button>
          </form>

          {/* Controls */}
          <div className="flex gap-3 justify-end w-full md:w-auto items-center">
            
            {/* Filter Toggle Mobile */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1 px-4 py-2 border border-cream-medium bg-cream-light rounded-full text-xs font-bold text-primary"
            >
              <Filter size={14} />
              <span>Filters</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-[#8C7A6B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-cream-light border border-cream-medium rounded-full py-1.5 px-3 text-xs focus:outline-none text-[#5C5043] font-semibold"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            
          </div>
        </div>

        {/* Primary Shop Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Left Sidebar Filter Section (Desktop) */}
          <aside className="hidden md:flex flex-col space-y-6 bg-theme-white p-6 rounded-2xl border border-cream-medium shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-cream-light">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-primary font-serif flex items-center gap-1.5">
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </h2>
              <button 
                onClick={clearAllFilters}
                className="text-[10px] text-secondary hover:text-primary underline font-bold"
              >
                Clear All
              </button>
            </div>

            {/* S1: Categories */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider">Category</h3>
              <div className="flex flex-col space-y-1.5">
                <button
                  onClick={() => handleCategorySelect("All")}
                  className={`text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors font-medium ${
                    selectedCategory === "All"
                      ? "bg-cream-medium text-primary font-bold"
                      : "text-[#5C5043] hover:bg-cream-light hover:text-primary"
                  }`}
                >
                  All Categories
                </button>
                {categoriesList.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleCategorySelect(c.name)}
                    className={`text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors font-medium ${
                      selectedCategory.toLowerCase() === c.name.toLowerCase()
                        ? "bg-cream-medium text-primary font-bold"
                        : "text-[#5C5043] hover:bg-cream-light hover:text-primary"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* S2: Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-primary font-serif uppercase tracking-wider">Max Price</h3>
                <span className="text-xs font-bold text-primary bg-cream-medium px-2 py-0.5 rounded-full">₹{priceLimit}</span>
              </div>
              <input
                type="range"
                min="90"
                max="2500"
                step="50"
                value={priceLimit}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="w-full accent-primary bg-cream-medium rounded-lg appearance-none h-1.5"
              />
              <div className="flex justify-between text-[10px] text-[#8C7A6B]">
                <span>₹90</span>
                <span>₹2500</span>
              </div>
            </div>

            {/* Trust Indicator Widget */}
            <div className="p-4 bg-cream-light/60 rounded-xl border border-cream-medium/40 text-center space-y-2 text-[10px] text-[#5C5043] font-medium leading-relaxed">
              <p>🌾 Sourced directly from certified self-help groups & tribal collectives.</p>
              <p>🛡️ Zero artificial preservatives, dyes, or stabilizers.</p>
            </div>
          </aside>

          {/* Right Product Grid Column */}
          <div className="md:col-span-3 space-y-8">
            {dataLoading ? (
              <div className="text-center py-20 bg-theme-white rounded-2xl border border-cream-medium/60 text-xs font-semibold text-[#8C7A6B] animate-pulse">
                Fetching village harvests...
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-theme-white rounded-2xl border border-cream-medium/60 text-[#8C7A6B] space-y-4">
                <SlidersHorizontal size={40} className="mx-auto text-cream-dark" />
                <h3 className="text-md font-bold text-primary">No products found</h3>
                <p className="text-xs max-w-xs mx-auto">
                  Try adjusting your filter settings or search terms.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-primary text-cream-light text-xs font-bold px-5 py-2 rounded-full hover:bg-primary-light transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Total count */}
                <p className="text-xs text-[#8C7A6B] font-semibold">
                  Showing {indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} results
                </p>
                
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((p) => {
                    const isInWishlist = wishlist.some(item => item.id === p.id);
                    const isJustAdded = justAddedId === `${p.id}-added`;
                    
                    return (
                      <div 
                        key={p.id}
                        className="bg-theme-white rounded-2xl border border-cream-medium overflow-hidden shadow-sm hover:shadow-md hover:border-cream-dark transition-all duration-300 flex flex-col h-full group"
                      >
                        {/* Image Panel */}
                        <div className="relative pt-[100%] overflow-hidden bg-cream-light">
                          <img 
                            src={p.images[0]} 
                            alt={p.name} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Sourcing Badge */}
                          <span className="absolute top-3 left-3 bg-primary/90 text-cream-light text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {p.origin.split(",")[0]}
                          </span>

                          {/* Wishlist toggle */}
                          <button
                            onClick={() => toggleWishlist(p)}
                            className="absolute top-3 right-3 p-1.5 bg-theme-white/90 rounded-full shadow-sm text-[#5C5043] hover:text-accent transition-colors duration-200 cursor-pointer"
                            aria-label="Wishlist"
                          >
                            <Heart size={15} className={isInWishlist ? "fill-accent text-accent" : ""} />
                          </button>
                        </div>

                        {/* Text Details */}
                        <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
                              {p.category}
                            </span>
                            <Link href={`/shop/${p.id}`} className="block">
                              <h3 className="text-sm font-bold text-primary font-serif line-clamp-2 hover:text-[#9C6644] transition-colors leading-snug">
                                {p.name}
                              </h3>
                            </Link>
                            {/* Rating */}
                            <div className="flex items-center gap-1 pt-0.5">
                              <span className="text-xs text-[#D6A15F]">★</span>
                              <span className="text-[10px] text-primary font-bold">{p.rating}</span>
                              <span className="text-[9px] text-[#8C7A6B]">({p.reviews.length})</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-cream-light">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-[#8C7A6B]">Base Price</span>
                              <span className="text-sm font-extrabold text-[#2C2520]">₹{p.price}</span>
                            </div>

                            <button
                              onClick={() => handleQuickAdd(p)}
                              className={`py-1.5 px-3.5 rounded-full text-[10px] font-extrabold transition-all duration-200 cursor-pointer shadow-sm ${
                                isJustAdded 
                                  ? "bg-accent text-theme-white" 
                                  : "bg-primary text-cream-light hover:bg-primary-light"
                              }`}
                            >
                              {isJustAdded ? (
                                <span className="flex items-center gap-1">
                                  <Check size={11} />
                                  <span>Added</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Plus size={11} />
                                  <span>Add</span>
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6 border-t border-cream-medium">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-cream-medium rounded-full bg-theme-white text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream-medium transition-all"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-full text-xs font-bold border transition-all ${
                            currentPage === pageNum
                              ? "bg-primary text-cream-light border-primary"
                              : "bg-theme-white text-primary border-cream-medium hover:bg-cream-medium"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-cream-medium rounded-full bg-theme-white text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream-medium transition-all"
                      aria-label="Next Page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Filters Side Drawer Sheet */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-[#000000] z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-theme-white p-6 z-55 shadow-2xl overflow-y-auto flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-cream-medium mb-6">
                <h3 className="text-md font-bold text-primary font-serif">Filters</h3>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-xs font-bold text-secondary"
                >
                  Close
                </button>
              </div>

              {/* Mobile Filter content */}
              <div className="space-y-6 flex-1">
                {/* Category */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-primary font-serif uppercase tracking-wider">Category</h4>
                  <div className="flex flex-col space-y-1.5">
                    <button
                      onClick={() => {
                        handleCategorySelect("All");
                        setIsMobileFilterOpen(false);
                      }}
                      className={`text-left text-xs py-2 px-3 rounded-lg font-semibold ${
                        selectedCategory === "All" ? "bg-cream-medium text-primary" : "text-[#5C5043]"
                      }`}
                    >
                      All Categories
                    </button>
                    {categoriesList.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          handleCategorySelect(c.name);
                          setIsMobileFilterOpen(false);
                        }}
                        className={`text-left text-xs py-2 px-3 rounded-lg font-semibold ${
                          selectedCategory.toLowerCase() === c.name.toLowerCase() ? "bg-cream-medium text-primary" : "text-[#5C5043]"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-primary font-serif uppercase tracking-wider">Max Price</h4>
                    <span className="text-xs font-bold text-primary bg-cream-medium px-2 py-0.5 rounded-full">₹{priceLimit}</span>
                  </div>
                  <input
                    type="range"
                    min="90"
                    max="2500"
                    step="50"
                    value={priceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-cream-medium mt-6 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="py-2.5 px-4 bg-cream-medium text-primary rounded-full text-xs font-bold"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="py-2.5 px-4 bg-primary text-cream-light rounded-full text-xs font-bold"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
