"use server";

import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTPEmail, sendOrderReceiptEmail, sendOrderStatusUpdateEmail } from "@/lib/email";
import { signSession, verifySession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";
import Product from "@/models/Product";
import { coupons } from "@/data/products";
import { 
  findUserByEmail, 
  createUser, 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getCategories, 
  addCategory, 
  getOrders, 
  createOrder, 
  updateOrderStatus 
} from "@/data/db";

// Authorization Middleware Helpers
export async function requireAdmin() {
  const user = await getSessionUserAction();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return user;
}

export async function requireUser() {
  const user = await getSessionUserAction();
  if (!user) {
    throw new Error("Unauthorized: User access required.");
  }
  return user;
}

// Authentication Actions
export async function loginUserAction(email, password) {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return { success: false, error: "No account found with this email." };
    }
    
    // Cryptographic verification
    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid password." };
    }

    // Auto-migrate legacy plain-text passwords to hashed passwords on successful login
    if (user.password && !user.password.includes(":")) {
      await dbConnect();
      await User.findByIdAndUpdate(user.id, { $set: { password: hashPassword(password) } });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const cookieStore = await cookies();
    cookieStore.set("gaonse_session", signSession(sessionUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error("Login action error", error);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}

export async function registerUserAction(name, email, password) {
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return { success: false, error: "An account already exists with this email." };
    }

    // Cryptographically hash password before storage
    const newUser = await createUser({ name, email, password: hashPassword(password) });
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    const cookieStore = await cookies();
    cookieStore.set("gaonse_session", signSession(sessionUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error("Register action error", error);
    return { success: false, error: "An unexpected error occurred during registration." };
  }
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete("gaonse_session");
  return { success: true };
}

export async function getSessionUserAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get("gaonse_session");
  if (!session) return null;
  return verifySession(session.value);
}

// Product Actions
export async function getProductsAction() {
  return await getProducts();
}

export async function addProductAction(productData) {
  try {
    await requireAdmin();
    const product = await addProduct(productData);
    return { success: true, product };
  } catch (error) {
    console.error("Add product error", error);
    return { success: false, error: "Failed to create product." };
  }
}

export async function updateProductAction(id, productData) {
  try {
    await requireAdmin();
    await updateProduct(id, productData);
    return { success: true };
  } catch (error) {
    console.error("Update product error", error);
    return { success: false, error: "Failed to update product." };
  }
}

export async function deleteProductAction(id) {
  try {
    await requireAdmin();
    const success = await deleteProduct(id);
    return { success };
  } catch (error) {
    console.error("Delete product error", error);
    return { success: false, error: "Failed to delete product." };
  }
}

// Category Actions
export async function getCategoriesAction() {
  return await getCategories();
}

export async function addCategoryAction(categoryData) {
  try {
    await requireAdmin();
    const category = await addCategory(categoryData);
    return { success: true, category };
  } catch (error) {
    console.error("Add category error", error);
    return { success: false, error: "Failed to create category." };
  }
}

// Order Actions
export async function getOrdersAction() {
  await requireAdmin();
  return await getOrders();
}

export async function createOrderAction(orderData) {
  try {
    // Validate order input structure
    if (!orderData || !orderData.cart || !Array.isArray(orderData.cart)) {
      return { success: false, error: "Invalid order payload: Cart is empty or malformed." };
    }
    
    await dbConnect(); // ensure mongo is connected
    
    // Server-side price recalculation & validation
    let calculatedSubtotal = 0;
    for (const item of orderData.cart) {
      if (!item.product || !item.selectedWeight) {
        return { success: false, error: "Invalid cart item structure." };
      }
      const productId = item.product.id || item.product._id;
      const dbProduct = await Product.findById(productId);
      if (!dbProduct) {
        return { success: false, error: `Product not found: ${item.product.name}` };
      }
      if (!dbProduct.inStock) {
        return { success: false, error: `Sourced item is currently out of stock: ${dbProduct.name}` };
      }
      const matchedWeight = dbProduct.weightOptions.find(o => o.weight === item.selectedWeight.weight);
      if (!matchedWeight) {
        return { success: false, error: `Invalid weight option selected for ${dbProduct.name}` };
      }
      
      calculatedSubtotal += matchedWeight.price * item.quantity;
    }
    
    // Calculate Coupon discount
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
    
    // Calculate dynamic GST (5% split based on destination state)
    const taxableAmount = Math.max(0, calculatedSubtotal - calculatedDiscount);
    const calculatedGst = Math.round(taxableAmount * 0.05);
    
    // Calculate shipping fee
    const calculatedDelivery = calculatedSubtotal >= 499 ? 0 : 50;
    
    // Final total calculation
    const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedGst + calculatedDelivery;
    
    // Compare server vs client calculations to prevent tampering
    if (Math.abs(calculatedTotal - orderData.total) > 1 || 
        Math.abs(calculatedSubtotal - orderData.subtotal) > 1 || 
        Math.abs(calculatedDiscount - orderData.discount) > 1) {
      return { success: false, error: "Price tampering verification failed: Total price mismatch detected." };
    }
    
    // Build validated order payload
    const validatedOrder = {
      cart: orderData.cart,
      shippingDetails: orderData.shippingDetails,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      delivery: calculatedDelivery,
      gst: calculatedGst,
      total: calculatedTotal
    };

    const order = await createOrder(validatedOrder);
    let emailSent = false;
    try {
      const mailRes = await sendOrderReceiptEmail(order);
      emailSent = mailRes && !mailRes.error;
    } catch (mailErr) {
      console.error("Failed to send order receipt email:", mailErr);
    }
    return { success: true, order, emailSent };
  } catch (error) {
    console.error("Create order error", error);
    return { success: false, error: "Failed to save order." };
  }
}

export async function updateOrderStatusAction(orderId, status, trackingId) {
  try {
    await requireAdmin();
    await updateOrderStatus(orderId, status, trackingId);
    try {
      const orders = await getOrders();
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        await sendOrderStatusUpdateEmail(order);
      }
    } catch (mailErr) {
      console.error("Failed to send order status update email:", mailErr);
    }
    return { success: true };
  } catch (error) {
    console.error("Update order status error", error);
    return { success: false, error: "Failed to update order status." };
  }
}

export async function trackOrderAction(orderId) {
  try {
    const orders = await getOrders();
    const order = orders.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase());
    return order || null;
  } catch (error) {
    console.error("Track order error", error);
    return null;
  }
}

export async function sendOTPAction(email) {
  try {
    await dbConnect();
    if (!email) {
      return { success: false, error: "Email address is required." };
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return { 
        success: false, 
        error: "No account found with this email. Please create an account first." 
      };
    }
    
    // Rate limiting: 60 seconds cooldown check
    if (user.otpLastRequested) {
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otpCode = otp;
    user.otpExpires = expiresAt;
    user.otpLastRequested = new Date();
    await user.save();

    const emailResult = await sendOTPEmail(normalizedEmail, otp);

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to send OTP email."
      };
    }

    return { 
      success: true, 
      message: "OTP sent to your email."
    };
  } catch (error) {
    console.error("Send OTP Action error", error);
    return { success: false, error: "Failed to generate or send OTP." };
  }
}

export async function verifyOTPAction(email, otp) {
  try {
    await dbConnect();
    if (!email || !otp) {
      return { success: false, error: "Email and OTP code are required." };
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return { success: false, error: "No active OTP transaction found." };
    }

    if (!user.otpCode || user.otpCode !== otp.trim()) {
      return { success: false, error: "Invalid OTP code. Please check and try again." };
    }

    if (new Date() > user.otpExpires) {
      return { success: false, error: "This OTP has expired. Please request a new code." };
    }

    // OTP is valid! Verify and login
    user.otpCode = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const cookieStore = await cookies();
    cookieStore.set("gaonse_session", signSession(sessionUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error("Verify OTP Action error", error);
    return { success: false, error: "Failed to verify OTP." };
  }
}

