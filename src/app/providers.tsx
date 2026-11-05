"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { appTheme } from "@/theme";
import { AuthStateSync } from "@/components/auth-state-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <SessionProvider>
          <AuthStateSync />
          {children}
        </SessionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
