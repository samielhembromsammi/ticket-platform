import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePhoto?: string;
  profileUrl?: string;
  status?: string;
  phoneNumber?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: !!Cookies.get("token"),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        set({ user: null, isAuthenticated: false });
        window.location.href = "/auth/login";
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
