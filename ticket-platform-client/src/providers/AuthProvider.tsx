"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { useAuthService } from "@/src/hooks/auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const { getMe } = useAuthService();

  useEffect(() => {
    // If we have a token but no user object in store, fetch the profile
    if (isAuthenticated && !user) {
      getMe().then((userData) => {
        if (userData) {
          setUser(userData);
        }
      });
    }
  }, [isAuthenticated, user, getMe, setUser]);

  return <>{children}</>;
}
