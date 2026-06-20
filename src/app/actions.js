"use server";

import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendOTPEmail, sendOrderReceiptEmail, sendOrderStatusUpdateEmail } from "@/lib/email";
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

// Authentication Actions
export async function loginUserAction(email, password) {
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return { success: false, error: "No account found with this email." };
    }
    if (user.password !== password) {
      return { success: false, error: "Invalid password." };
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const cookieStore = await cookies();
    cookieStore.set("gaonse_session", JSON.stringify(sessionUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
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

    const newUser = await createUser({ name, email, password });
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    const cookieStore = await cookies();
    cookieStore.set("gaonse_session", JSON.stringify(sessionUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
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
  try {
    return JSON.parse(session.value);
  } catch (e) {
    return null;
  }
}

// Product Actions
export async function getProductsAction() {
  return await getProducts();
}

export async function addProductAction(productData) {
  try {
    const product = await addProduct(productData);
    return { success: true, product };
  } catch (error) {
    console.error("Add product error", error);
    return { success: false, error: "Failed to create product." };
  }
}

export async function updateProductAction(id, productData) {
  try {
    await updateProduct(id, productData);
    return { success: true };
  } catch (error) {
    console.error("Update product error", error);
    return { success: false, error: "Failed to update product." };
  }
}

export async function deleteProductAction(id) {
  try {
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
    const category = await addCategory(categoryData);
    return { success: true, category };
  } catch (error) {
    console.error("Add category error", error);
    return { success: false, error: "Failed to create category." };
  }
}

// Order Actions
export async function getOrdersAction() {
  return await getOrders();
}

export async function createOrderAction(orderData) {
  try {
    const order = await createOrder(orderData);
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

// Nodemailer Helper for OTP sending
    const emailResult = await sendOTPEmail(email.toLowerCase().trim(), otp);

    return { 
      success: true, 
      message: !emailResult.sandbox ? "OTP sent to your email." : "OTP generated in sandbox mode.",
      sandbox: emailResult.sandbox,
      otp: emailResult.sandbox ? otp : null
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
    cookieStore.set("gaonse_session", JSON.stringify(sessionUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error("Verify OTP Action error", error);
    return { success: false, error: "Failed to verify OTP." };
  }
}

