"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Key, 
  Clock 
} from "lucide-react";
import { sendOTPAction } from "@/app/actions";

export default function LoginPage() {
  const { user, login, register, loginWithOTP, loading } = useAuth();
  const router = useRouter();

  // Page mode: login or register
  const [mode, setMode] = useState("login");
  const [loginMethod, setLoginMethod] = useState("otp"); // "otp" or "password"
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // OTP specific state variables
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);


  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await sendOTPAction(formData.email);
      if (res.success) {
        setOtpSent(true);
        setOtpTimer(60); // 60 seconds countdown
        setSuccess(res.message);

      } else {
        setError(res.error || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!formData.email || !otpVal) {
      setError("Please enter the OTP code sent to you.");
      return;
    }
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await loginWithOTP(formData.email, otpVal);
      if (res.success) {
        setSuccess("Verification successful! Redirecting...");
        setTimeout(() => {
          if (res.user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }, 1000);
      } else {
        setError(res.error || "Invalid OTP code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please check your network connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (mode === "login") {
      if (loginMethod === "otp") {
        if (!otpSent) {
          await handleSendOTP(e);
        } else {
          await handleVerifyOTP(e);
        }
      } else {
        // Password login
        if (!formData.email || !formData.password) {
          setError("Please enter your email and password.");
          setSubmitting(false);
          return;
        }
        
        const res = await login(formData.email, formData.password);
        if (res.success) {
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => {
            if (res.user.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/");
            }
          }, 1000);
        } else {
          setError(res.error || "Login failed.");
          setSubmitting(false);
        }
      }
    } else {
      // Registration flow
      if (!formData.name || !formData.email || !formData.password) {
        setError("Please fill in all registration fields.");
        setSubmitting(false);
        return;
      }
      if (formData.password.length < 4) {
        setError("Password must be at least 4 characters long.");
        setSubmitting(false);
        return;
      }

      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        setSuccess("Account registered! Welcome to GaonSe.");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError(res.error || "Registration failed.");
        setSubmitting(false);
      }
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    setOtpVal("");
    const mockEvent = { preventDefault: () => {} };
    await handleSendOTP(mockEvent);
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-16 px-4 bg-[#FDFBF7] flex items-center justify-center text-[#2C2520]">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#F5EFEB] shadow-lg overflow-hidden">
          
          {/* Main Card Tabs */}
          <div className="flex border-b border-[#F5EFEB]">
            <button
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
                setOtpSent(false);
                setOtpVal("");
              }}
              className={`flex-1 py-4 text-xs uppercase font-extrabold tracking-wider transition-colors ${
                mode === "login"
                  ? "bg-[#F5EFEB]/40 text-[#7A4E2D] font-bold border-b-2 border-[#D6A15F]"
                  : "text-[#8C7A6B] hover:text-[#7A4E2D] hover:bg-[#F5EFEB]/30"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
              className={`flex-1 py-4 text-xs uppercase font-extrabold tracking-wider transition-colors ${
                mode === "register"
                  ? "bg-[#F5EFEB]/40 text-[#7A4E2D] font-bold border-b-2 border-[#D6A15F]"
                  : "text-[#8C7A6B] hover:text-[#7A4E2D] hover:bg-[#F5EFEB]/30"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-serif text-[#7A4E2D]">
                {mode === "login" ? "Welcome back to GaonSe" : "Join Our Sourcing Circle"}
              </h2>
              <p className="text-xs text-[#8C7A6B]">
                {mode === "login"
                  ? "Sign in to manage orders, check tracking details, or access the admin panel."
                  : "Register to support rural farmers and access pure, handcrafted village harvests."}
              </p>
            </div>

            {/* Login Method Sub-Tabs (Login mode only) */}
            {mode === "login" && (
              <div className="flex bg-[#FDFBF7] p-1 rounded-lg border border-[#F5EFEB] gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("otp");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${
                    loginMethod === "otp"
                      ? "bg-white text-[#7A4E2D] shadow-sm border border-[#F5EFEB]"
                      : "text-[#8C7A6B] hover:text-[#7A4E2D]"
                  }`}
                >
                  Quick OTP Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("password");
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${
                    loginMethod === "password"
                      ? "bg-white text-[#7A4E2D] shadow-sm border border-[#F5EFEB]"
                      : "text-[#8C7A6B] hover:text-[#7A4E2D]"
                  }`}
                >
                  With Password
                </button>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Name (Registration Only) */}
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7A4E2D] font-serif">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Rahul Patel"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#FDFBF7]/60 border border-[#F5EFEB] rounded-lg py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-[#D6A15F] text-[#2C2520]"
                    />
                    <User size={14} className="absolute left-3 top-3.5 text-[#8C7A6B]" />
                  </div>
                </div>
              )}

              {/* Email (Always shown, disabled in verification step) */}
              {(!otpSent || mode !== "login" || loginMethod !== "otp") && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7A4E2D] font-serif">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#FDFBF7]/60 border border-[#F5EFEB] rounded-lg py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-[#D6A15F] text-[#2C2520]"
                    />
                    <Mail size={14} className="absolute left-3 top-3.5 text-[#8C7A6B]" />
                  </div>
                </div>
              )}

              {/* Verification Info / Disabled Email Display in OTP Verify Step */}
              {mode === "login" && loginMethod === "otp" && otpSent && (
                <div className="bg-[#F5EFEB]/35 p-3 rounded-lg border border-[#F5EFEB] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] block">Sending OTP to</span>
                    <strong className="text-xs text-[#7A4E2D] font-mono">{formData.email}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpVal("");
                      setSandboxOtp("");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-[10px] font-bold text-[#D6A15F] hover:underline"
                  >
                    Change Email
                  </button>
                </div>
              )}

              {/* Password Field (Password Login / Registration) */}
              {(mode === "register" || (mode === "login" && loginMethod === "password")) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#7A4E2D] font-serif">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-[#FDFBF7]/60 border border-[#F5EFEB] rounded-lg py-2.5 pl-9 pr-10 text-xs focus:outline-none focus:border-[#D6A15F] text-[#2C2520]"
                    />
                    <Lock size={14} className="absolute left-3 top-3.5 text-[#8C7A6B]" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#8C7A6B] hover:text-[#7A4E2D] focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Code Input (OTP Login mode - Verify Step) */}
              {mode === "login" && loginMethod === "otp" && otpSent && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#7A4E2D] font-serif">Enter 6-Digit OTP</label>
                    {otpTimer > 0 ? (
                      <span className="text-[10px] text-[#8C7A6B] flex items-center gap-1 font-mono">
                        <Clock size={11} />
                        <span>Resend in {otpTimer}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-[10px] font-bold text-[#D6A15F] hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={otpVal}
                      onChange={(e) => setOtpVal(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full bg-[#FDFBF7]/60 border border-[#F5EFEB] rounded-lg py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-[#D6A15F] text-[#2C2520] tracking-[4px] font-mono font-bold"
                    />
                    <Key size={14} className="absolute left-3 top-3.5 text-[#8C7A6B]" />
                  </div>
                </div>
              )}



              {error && (
                <div className="text-xs text-[#D9534F] bg-[#D9534F]/5 border border-[#D9534F]/20 p-3 rounded-lg font-semibold animate-shake">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-xs text-accent bg-accent/5 border border-accent/20 p-3 rounded-lg font-bold">
                  {success}
                </div>
              )}

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full bg-[#7A4E2D] hover:bg-[#7A4E2D]/90 text-[#FFFDF8] text-xs font-extrabold py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <span>
                  {submitting 
                    ? "Processing..." 
                    : (mode === "register" 
                        ? "Register Account" 
                        : (loginMethod === "otp" 
                            ? (otpSent ? "Verify & Sign In" : "Send OTP Verification") 
                            : "Sign In"))}
                </span>
                <ArrowRight size={14} />
              </button>

            </form>

            {/* Default Sandbox accounts info boxes */}
            {mode === "login" && (
              <div className="bg-[#FDFBF7] border border-[#F5EFEB] rounded-xl p-4 space-y-2 text-[10px] text-[#5C5043]">
                <h4 className="font-extrabold text-[#7A4E2D] font-serif uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={14} className="text-[#D6A15F]" />
                  <span>Sandbox Testing Credentials</span>
                </h4>
                <p>💡 **Password Sign In fallback**: Access admin panel with <strong className="text-[#7A4E2D]">admin-harvest-master@gaonse.com</strong> / password <strong className="text-[#7A4E2D]">GSe-984_Harvest_Secure_Master_#2026!</strong>.</p>
                <p>💡 **OTP Sandbox**: Enter any email address (e.g. `customer@test.com`) in OTP Login. It automatically outputs a code card on-screen for login.</p>
              </div>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
