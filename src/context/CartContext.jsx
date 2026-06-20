"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { coupons } from "@/data/products";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("gaonse_cart");
    const savedWishlist = localStorage.getItem("gaonse_wishlist");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    setIsMounted(true);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("gaonse_cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  // Sync wishlist to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("gaonse_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

  const addToCart = (product, selectedWeight, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight.id === selectedWeight.id
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, selectedWeight, quantity }];
      }
    });
  };

  const removeFromCart = (productId, weightId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedWeight.id === weightId))
    );
  };

  const updateQuantity = (productId, weightId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, weightId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedWeight.id === weightId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item.id === product.id)) {
        return prevWishlist; // Already in wishlist
      }
      return [...prevWishlist, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    if (wishlist.some((item) => item.id === product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const applyCoupon = (code) => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { success: false, message: "Invalid coupon code." };
    }

    const subtotal = getCartSubtotal();
    if (subtotal < coupon.minPurchase) {
      return {
        success: false,
        message: `Minimum purchase of ₹${coupon.minPurchase} required for this coupon.`,
      };
    }

    setActiveCoupon(coupon);
    return { success: true, message: `Coupon applied successfully! You saved ₹${calculateDiscount(coupon, subtotal)}.` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const calculateDiscount = (coupon, subtotal) => {
    if (!coupon) return 0;
    if (coupon.type === "percent") {
      return Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.type === "fixed") {
      return coupon.value;
    }
    return 0;
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.selectedWeight.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getCartSubtotal();
    return calculateDiscount(activeCoupon, subtotal);
  };

  const getGstAmount = () => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    // 5% GST on food items in India (calculated on subtotal after discount)
    const taxableAmount = Math.max(0, subtotal - discount);
    return Math.round(taxableAmount * 0.05);
  };

  const getDeliveryFee = () => {
    const subtotal = getCartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 499 ? 0 : 50; // Free delivery above 499, otherwise 50
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    const gst = getGstAmount();
    const delivery = getDeliveryFee();
    return Math.max(0, subtotal - discount + gst + delivery);
  };

  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        activeCoupon,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        getCartSubtotal,
        getDiscountAmount,
        getGstAmount,
        getDeliveryFee,
        getCartTotal,
        getItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
