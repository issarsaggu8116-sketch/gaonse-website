import mongoose from "mongoose";
import crypto from "crypto";

// Standalone verification logic test
function checkOtpRateLimit(user) {
  if (user && user.otpLastRequested) {
    const timeSinceLastOtp = Date.now() - new Date(user.otpLastRequested).getTime();
    const cooldownMs = 60 * 1000;
    if (timeSinceLastOtp < cooldownMs) {
      const secondsRemaining = Math.ceil((cooldownMs - timeSinceLastOtp) / 1000);
      return { 
        success: false, 
        error: `Please wait ${secondsRemaining} seconds before requesting another code.` 
      };
    }
  }
  return { success: true };
}

// Standalone price recalculation checker
function checkPriceValidation(orderData, dbProducts, coupons) {
  let calculatedSubtotal = 0;
  
  for (const item of orderData.cart) {
    const dbProduct = dbProducts.find(p => p._id === (item.product.id || item.product._id));
    if (!dbProduct) {
      return { success: false, error: `Product not found: ${item.product.name}` };
    }
    const matchedWeight = dbProduct.weightOptions.find(o => o.weight === item.selectedWeight.weight);
    if (!matchedWeight) {
      return { success: false, error: `Invalid weight option selected for ${dbProduct.name}` };
    }
    calculatedSubtotal += matchedWeight.price * item.quantity;
  }

  let calculatedDiscount = 0;
  if (orderData.couponCode) {
    const coupon = coupons.find(c => c.code.toUpperCase() === orderData.couponCode.toUpperCase());
    if (coupon && calculatedSubtotal >= coupon.minPurchase) {
      if (coupon.type === "percent") {
        calculatedDiscount = Math.round((calculatedSubtotal * coupon.value) / 100);
      } else if (coupon.type === "fixed") {
        calculatedDiscount = coupon.value;
      }
    }
  }

  const taxableAmount = Math.max(0, calculatedSubtotal - calculatedDiscount);
  const calculatedGst = Math.round(taxableAmount * 0.05);
  const calculatedDelivery = calculatedSubtotal >= 499 ? 0 : 50;
  const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedGst + calculatedDelivery;

  if (Math.abs(calculatedTotal - orderData.total) > 1 || 
      Math.abs(calculatedSubtotal - orderData.subtotal) > 1 || 
      Math.abs(calculatedDiscount - orderData.discount) > 1) {
    return { 
      success: false, 
      error: `Price verification failed: Total price mismatch detected. Server calculated total ₹${calculatedTotal}, client sent ₹${orderData.total}` 
    };
  }

  return { success: true, total: calculatedTotal };
}

async function runTests() {
  console.log("=========================================");
  console.log("RUNNING ORDER VALIDATION & RATE LIMIT TESTS");
  console.log("=========================================");

  // 1. OTP Cooldown Test
  console.log("\n--- TEST 1: OTP Rate Limit Cooldown check ---");
  const testUser = {
    email: "test@example.com",
    otpLastRequested: new Date(Date.now() - 25 * 1000) // 25 seconds ago
  };

  let otpRes = checkOtpRateLimit(testUser);
  console.log("Rate limit checked (Request made 25s ago):", otpRes);
  console.log("Rejected?", !otpRes.success ? "YES (SUCCESS)" : "NO (FAILED)");

  // Request made 65 seconds ago
  testUser.otpLastRequested = new Date(Date.now() - 65 * 1000);
  otpRes = checkOtpRateLimit(testUser);
  console.log("Rate limit checked (Request made 65s ago):", otpRes);
  console.log("Allowed?", otpRes.success ? "YES (SUCCESS)" : "NO (FAILED)");

  // 2. Price Validation Test
  console.log("\n--- TEST 2: Checkout Price Validation (Valid Order) ---");
  const mockDbProducts = [
    {
      _id: "p-jaggery",
      name: "Organic Jaggery",
      weightOptions: [{ weight: "500g", price: 150 }]
    },
    {
      _id: "p-oil",
      name: "Cold Pressed Oil",
      weightOptions: [{ weight: "1L", price: 280 }]
    }
  ];
  const mockCoupons = [
    { code: "GAONSE10", type: "percent", value: 10, minPurchase: 500 }
  ];

  const validOrder = {
    cart: [
      { product: { id: "p-jaggery" }, selectedWeight: { weight: "500g" }, quantity: 2 },
      { product: { id: "p-oil" }, selectedWeight: { weight: "1L" }, quantity: 1 }
    ],
    couponCode: "GAONSE10",
    subtotal: 580,
    discount: 58,
    delivery: 0,
    gst: 26,
    total: 548
  };

  let priceRes = checkPriceValidation(validOrder, mockDbProducts, mockCoupons);
  console.log("Price verification result (Valid):", priceRes);
  console.log("Is successful?", priceRes.success ? "YES (SUCCESS)" : "NO (FAILED)");

  // 3. Tampered Price Test
  console.log("\n--- TEST 3: Checkout Price Validation (Tampered Order) ---");
  const tamperedOrder = {
    ...validOrder,
    total: 100 // Attacker changed total from 548 to 100
  };

  priceRes = checkPriceValidation(tamperedOrder, mockDbProducts, mockCoupons);
  console.log("Price verification result (Tampered):", priceRes);
  console.log("Rejected?", !priceRes.success ? "YES (SUCCESS)" : "NO (FAILED)");
}

runTests();
