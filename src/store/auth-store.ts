import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
};

// Zustand keeps the app's admin state available to any client component without prop drilling.
type AuthState = {
  user: AdminProfile | null;
  accessToken: string | null;
  setCredentials: (user: AdminProfile, accessToken: string) => void;
  clearCredentials: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setCredentials: (user, accessToken) => set({ user, accessToken }),
      clearCredentials: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "help-study-abroad-auth",
      storage: createJSONStorage(() => localStorage),
      // Keep the profile handy across refreshes, but leave the bearer token in memory only.
      partialize: (state) => ({ ...state, accessToken: null }),
    },
  ),
);
