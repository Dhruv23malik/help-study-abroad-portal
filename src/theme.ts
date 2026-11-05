"use client";

import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#285b47", dark: "#194332", light: "#e9f1ed" },
    secondary: { main: "#bf7548" },
    background: { default: "#f6f7f4", paper: "#ffffff" },
    text: { primary: "#18231e", secondary: "#64716a" },
    divider: "#e5e9e5",
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 750, letterSpacing: "-0.045em" },
    h2: { fontWeight: 720, letterSpacing: "-0.035em" },
    h3: { fontWeight: 700, letterSpacing: "-0.025em" },
    button: { fontWeight: 650, textTransform: "none" },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 10, minHeight: 40 } } },
    MuiCard: { styleOverrides: { root: { border: "1px solid #e9ece8", boxShadow: "0 8px 28px rgba(20, 40, 28, 0.045)" } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10, backgroundColor: "#fff" } } },
  },
});
