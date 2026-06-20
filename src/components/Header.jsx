"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  User, 
  Plus, 
  Minus, 
  Trash2,
  ArrowRight,
  MapPin
} from "lucide-react";

export default function Header() {
  const { 
    cart, 
    wishlist, 
    searchQuery, 
    setSearchQuery, 
    updateQuantity, 
    removeFromCart, 
    getCartSubtotal,
    getItemsCount,
    addToCart,
    removeFromWishlist
  } = useCart();

  const { user, logout, isAdmin } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [tempSearch, setTempSearch] = useState("");
  
  const pathname = usePathname();
  const router = useRouter();

  // Keep search input synced with global context
  useEffect(() => {
    setTempSearch(searchQuery);
  }, [searchQuery]);

  // Close menus/drawers on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCartDrawerOpen(false);
    setIsWishlistDrawerOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(tempSearch);
    if (pathname !== "/shop") {
      router.push(`/shop?search=${encodeURIComponent(tempSearch)}`);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-primary text-cream-light text-center py-2 px-4 text-xs md:text-sm font-medium tracking-wide flex justify-center items-center gap-2">
        <MapPin size={14} className="text-secondary" />
        <span>Sourcing Authenticity Directly from Rural Farmers and Artisans | Free Delivery above ₹499</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-theme-white/95 backdrop-blur-md shadow-sm border-b border-cream-medium transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex flex-col">
                <span className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-primary flex items-center gap-1">
                  Gaon<span className="text-secondary">Se</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-semibold text-[#8C7A6B] -mt-1">
                  Pure Village Harvest
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${
                    pathname === link.path 
                      ? "text-primary border-b-2 border-secondary pb-1" 
                      : "text-[#5C5043] hover:text-primary hover:border-b-2 hover:border-cream-dark pb-1"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Utilities */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative w-48 lg:w-64">
                <input
                  type="text"
                  placeholder="Search village harvests..."
                  value={tempSearch}
                  onChange={(e) => setTempSearch(e.target.value)}
                  className="w-full bg-cream-light/60 border border-cream-dark/50 rounded-full py-1.5 pl-3 pr-9 text-xs focus:outline-none focus:border-secondary focus:bg-theme-white text-[#2C2520] transition-all placeholder-[#A09080]"
                />
                <button type="submit" className="absolute right-2.5 top-2 text-[#8C7A6B] hover:text-primary">
                  <Search size={15} />
                </button>
              </form>

              {/* Wishlist Icon */}
              <button 
                onClick={() => setIsWishlistDrawerOpen(true)}
                className="relative p-1.5 text-[#5C5043] hover:text-accent transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={22} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-theme-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button 
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-1.5 text-[#5C5043] hover:text-primary transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={22} />
                {getItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-theme-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemsCount()}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1.5 text-[#5C5043] hover:text-primary transition-colors flex items-center gap-1 focus:outline-none"
                  aria-label="User Account"
                >
                  <User size={22} />
                  {user && (
                    <span className="text-[10px] bg-cream-medium border border-cream-dark px-1.5 py-0.5 rounded-full font-bold text-primary max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                  )}
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-52 bg-theme-white rounded-lg shadow-lg border border-cream-medium py-2 z-50 animate-fade-in"
                    >
                      <div className="px-4 py-2 border-b border-cream-light">
                        <p className="text-[10px] text-[#8C7A6B]">Namaste,</p>
                        <p className="text-xs font-extrabold text-primary truncate">
                          {user ? user.name : "Guest User"}
                        </p>
                        {user && (
                          <span className="text-[9px] uppercase tracking-wider bg-cream-dark/50 text-primary font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
                            {user.role}
                          </span>
                        )}
                      </div>
                      
                      {isAdmin ? (
                        <Link href="/admin" className="block px-4 py-2 text-xs text-[#5C5043] hover:bg-cream-light hover:text-primary font-semibold">
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link href="/track-order" className="block px-4 py-2 text-xs text-[#5C5043] hover:bg-cream-light hover:text-primary font-semibold">
                          Track My Order
                        </Link>
                      )}
                      
                      <Link href="/about" className="block px-4 py-2 text-xs text-[#5C5043] hover:bg-cream-light hover:text-primary">
                        Farmer Support Program
                      </Link>
                      <hr className="border-cream-light my-1" />
                      
                      {user ? (
                        <button 
                          onClick={async () => {
                            await logout();
                            router.push("/");
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-[#D9534F] font-bold hover:bg-cream-light"
                        >
                          Log Out
                        </button>
                      ) : (
                        <Link 
                          href="/login"
                          className="block w-full text-left px-4 py-2 text-xs text-secondary font-bold hover:bg-cream-light"
                        >
                          Login / Sign Up
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Actions and Hamburger Toggle */}
            <div className="flex items-center space-x-4 md:hidden">
              <button 
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-1.5 text-[#5C5043]"
                aria-label="Cart"
              >
                <ShoppingBag size={22} />
                {getItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-theme-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {getItemsCount()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-[#5C5043] hover:text-primary transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-theme-white border-t border-cream-medium overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Search Bar for Mobile */}
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search village harvests..."
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    className="w-full bg-cream-light/60 border border-cream-dark/50 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none text-[#2C2520]"
                  />
                  <button type="submit" className="absolute right-3 top-2.5 text-[#8C7A6B]">
                    <Search size={16} />
                  </button>
                </form>

                {/* Nav Links */}
                <nav className="flex flex-col space-y-3 pl-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.path}
                      className={`text-sm font-semibold tracking-wide ${
                        pathname === link.path ? "text-primary" : "text-[#5C5043]"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsWishlistDrawerOpen(true);
                    }}
                    className="text-left text-sm font-semibold text-[#5C5043] flex items-center gap-2 pt-1"
                  >
                    <Heart size={16} className="text-accent" />
                    <span>My Wishlist ({wishlist.length})</span>
                  </button>
                  {user && isAdmin && (
                    <Link
                      href="/admin"
                      className="text-left text-sm font-semibold text-primary flex items-center gap-2 pt-1"
                    >
                      <User size={16} />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}
                  <Link
                    href={user ? (isAdmin ? "/admin" : "/track-order") : "/login"}
                    className="text-left text-sm font-semibold text-[#5C5043] flex items-center gap-2 pt-1"
                  >
                    <User size={16} className="text-secondary" />
                    <span>{user ? `My Account (${user.name.split(" ")[0]})` : "Login / Sign Up"}</span>
                  </Link>
                  {user && (
                    <button
                      onClick={async () => {
                        await logout();
                        router.push("/");
                      }}
                      className="text-left text-sm font-semibold text-[#D9534F] flex items-center gap-2 pt-1"
                    >
                      <X size={16} />
                      <span>Log Out</span>
                    </button>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Slider Drawer */}
      <AnimatePresence>
        {isCartDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartDrawerOpen(false)}
              className="fixed inset-0 bg-[#000000] z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-cream-light z-55 shadow-2xl flex flex-col h-full"
            >
              <div className="p-5 border-b border-cream-medium bg-theme-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  <h2 className="text-lg font-bold font-serif text-primary">Your Basket</h2>
                  <span className="bg-cream-dark text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                    {getItemsCount()} items
                  </span>
                </div>
                <button 
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1 rounded-full text-[#8C7A6B] hover:bg-cream-medium hover:text-primary transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="p-4 bg-cream-medium rounded-full text-primary">
                      <ShoppingBag size={48} />
                    </div>
                    <h3 className="text-md font-semibold text-primary">Your basket is empty</h3>
                    <p className="text-xs text-[#8C7A6B] max-w-[220px]">
                      Sustain village farmers by adding some authentic products to your cart!
                    </p>
                    <Link 
                      href="/shop"
                      className="bg-primary text-cream-light text-xs font-bold px-5 py-2.5 rounded-full hover:bg-primary-light transition-all flex items-center gap-2"
                    >
                      <span>Explore Shop</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div 
                      key={`${item.product.id}-${item.selectedWeight.id}`}
                      className="flex gap-4 p-3 bg-theme-white rounded-lg shadow-sm border border-cream-medium/50 hover:border-cream-dark transition-all duration-200"
                    >
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded-md bg-cream-light"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-primary truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-accent font-semibold flex items-center gap-1 mt-0.5">
                          <span>Weight: {item.selectedWeight.weight}</span>
                        </p>
                        <p className="text-sm font-semibold text-[#2C2520] mt-1.5">
                          ₹{item.selectedWeight.price}
                        </p>
                        {/* Qty selectors */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-cream-dark/50 rounded-full bg-cream-light px-1">
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.selectedWeight.id, item.quantity - 1)}
                              className="p-1 text-primary hover:text-secondary"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs font-bold text-primary">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.selectedWeight.id, item.quantity + 1)}
                              className="p-1 text-primary hover:text-secondary"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.product.id, item.selectedWeight.id)}
                            className="text-[#B08968] hover:text-[#D9534F] p-1 transition-colors"
                            aria-label="Remove Item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {cart.length > 0 && (
                <div className="p-5 bg-theme-white border-t border-cream-medium space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[#5C5043]">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-primary">₹{getCartSubtotal()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#5C5043]">
                      <span>Delivery Fee:</span>
                      <span className="font-semibold text-primary">
                        {getCartSubtotal() >= 499 ? (
                          <span className="text-accent">FREE</span>
                        ) : (
                          "₹50"
                        )}
                      </span>
                    </div>
                    <hr className="border-cream-medium my-2" />
                    <div className="flex justify-between text-sm text-[#2C2520]">
                      <span className="font-bold">Estimated Total:</span>
                      <span className="font-extrabold text-primary text-base">
                        ₹{getCartSubtotal() + (getCartSubtotal() >= 499 ? 0 : 50)}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8C7A6B] italic pt-1">
                      * Taxes calculated at checkout page. Free shipping on orders over ₹499.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link 
                      href="/cart"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="text-center bg-cream-medium text-primary text-xs font-bold py-3 px-4 rounded-full border border-cream-dark/50 hover:bg-cream-dark transition-all"
                    >
                      View Cart
                    </Link>
                    <Link 
                      href="/checkout"
                      onClick={() => setIsCartDrawerOpen(false)}
                      className="text-center bg-primary text-cream-light text-xs font-bold py-3 px-4 rounded-full hover:bg-primary-light transition-all flex justify-center items-center gap-1.5 shadow-md shadow-primary/10"
                    >
                      <span>Checkout</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistDrawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistDrawerOpen(false)}
              className="fixed inset-0 bg-[#000000] z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-cream-light z-55 shadow-2xl flex flex-col h-full"
            >
              <div className="p-5 border-b border-cream-medium bg-theme-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart size={20} className="text-accent fill-accent" />
                  <h2 className="text-lg font-bold font-serif text-primary">My Wishlist</h2>
                  <span className="bg-cream-dark text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                    {wishlist.length} products
                  </span>
                </div>
                <button 
                  onClick={() => setIsWishlistDrawerOpen(false)}
                  className="p-1 rounded-full text-[#8C7A6B] hover:bg-cream-medium hover:text-primary transition-colors"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="p-4 bg-cream-medium rounded-full text-accent">
                      <Heart size={48} />
                    </div>
                    <h3 className="text-md font-semibold text-primary">Wishlist is empty</h3>
                    <p className="text-xs text-[#8C7A6B] max-w-[220px]">
                      Collect traditional products that catch your eye while shopping.
                    </p>
                    <Link 
                      href="/shop"
                      onClick={() => setIsWishlistDrawerOpen(false)}
                      className="bg-primary text-cream-light text-xs font-bold px-5 py-2.5 rounded-full hover:bg-primary-light transition-all"
                    >
                      Start Browsing
                    </Link>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <div 
                      key={item.id}
                      className="flex gap-4 p-3 bg-theme-white rounded-lg shadow-sm border border-cream-medium/50 hover:border-cream-dark transition-all duration-200"
                    >
                      <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-md bg-cream-light"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-primary truncate">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-[#8C7A6B] mt-0.5">
                            {item.origin}
                          </p>
                          <p className="text-xs font-bold text-[#2C2520] mt-1">
                            From ₹{item.price}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-cream-light">
                          <button
                            onClick={() => {
                              addToCart(item, item.weightOptions[0], 1);
                              removeFromWishlist(item.id);
                              setIsWishlistDrawerOpen(false);
                              setIsCartDrawerOpen(true);
                            }}
                            className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <span>Add to Cart</span>
                          </button>

                          <button 
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-[#B08968] hover:text-[#D9534F] p-1 transition-colors"
                            aria-label="Remove from Wishlist"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
