"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  loginUserAction, 
  registerUserAction, 
  logoutUserAction, 
  getSessionUserAction,
  verifyOTPAction
} from "@/app/actions";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser = await getSessionUserAction();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const res = await loginUserAction(email, password);
    if (res.success) {
      setUser(res.user);
    }
    setLoading(false);
    return res;
  };

  const register = async (name, email, password) => {
    setLoading(true);
    const res = await registerUserAction(name, email, password);
    if (res.success) {
      setUser(res.user);
    }
    setLoading(false);
    return res;
  };

  const logout = async () => {
    setLoading(true);
    await logoutUserAction();
    setUser(null);
    setLoading(false);
  };

  const loginWithOTP = async (email, otp) => {
    setLoading(true);
    const res = await verifyOTPAction(email, otp);
    if (res.success) {
      setUser(res.user);
    }
    setLoading(false);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithOTP,
        isAdmin: user?.role === "admin"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
