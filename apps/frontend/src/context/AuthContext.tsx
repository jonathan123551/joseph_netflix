"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate user profile on load
  useEffect(() => {
    async function initAuth() {
      try {
        const profile = await api.getProfile();
        if (profile) {
          setUser({
            id: profile.sub || profile.id,
            email: profile.email,
            role: profile.role,
            name: profile.name,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.warn("Could not load user profile on startup.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-1871f.up.railway.app'}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "Invalid credentials");
    }

    const result = await response.json();
    setUser({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      name: result.user.name,
    });
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-1871f.up.railway.app'}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || "Registration failed");
    }

    const result = await response.json();
    setUser({
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
      name: result.user.name,
    });
    return true;
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-1871f.up.railway.app'}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Backend logout failed. Clearing state directly.");
    } finally {
      setUser(null);
      // Clear cookie helper
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
