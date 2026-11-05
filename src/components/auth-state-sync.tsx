"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth-store";

export function AuthStateSync() {
  const { data: session, status } = useSession();
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const clearCredentials = useAuthStore((state) => state.clearCredentials);

  useEffect(() => {
    if (status === "authenticated" && session?.user && session.accessToken) {
      setCredentials(
        {
          id: session.user.id,
          name: session.user.name ?? "Admin",
          email: session.user.email ?? "",
          image: session.user.image ?? "",
          username: session.user.username,
        },
        session.accessToken,
      );
    } else if (status === "unauthenticated") {
      clearCredentials();
    }
  }, [session, status, setCredentials, clearCredentials]);

  return null;
}
