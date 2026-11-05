"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useAuthStore } from "@/store/auth-store";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: <DashboardRoundedIcon fontSize="small" /> },
  { href: "/users", label: "Users", icon: <GroupsRoundedIcon fontSize="small" /> },
  { href: "/products", label: "Products", icon: <Inventory2RoundedIcon fontSize="small" /> },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearCredentials = useAuthStore((state) => state.clearCredentials);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    clearCredentials();
    router.replace("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "rgba(255,255,255,.94)" }}>
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ minHeight: 72, gap: 2, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: 2.5, display: "grid", placeItems: "center", color: "white", bgcolor: "primary.main", fontWeight: 800, letterSpacing: "-.06em" }}>HS</Box>
              <Box>
                <Typography sx={{ fontWeight: 750, lineHeight: 1.15 }}>Help Study Abroad</Typography>
                <Typography variant="caption" color="text.secondary">Admin workspace</Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Avatar src={user?.image || undefined} alt={user?.name ?? "Admin"} sx={{ width: 34, height: 34, bgcolor: "primary.light", color: "primary.dark", fontSize: 14, fontWeight: 700 }}>
                {user?.name?.[0] ?? "A"}
              </Avatar>
              <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, maxWidth: 150 }} noWrap>{user?.name ?? "Administrator"}</Typography>
              <Button size="small" color="inherit" startIcon={<LogoutRoundedIcon />} onClick={handleLogout} sx={{ ml: 0.5 }}>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>Sign out</Box>
              </Button>
            </Stack>
          </Toolbar>
          <Stack direction="row" spacing={0.5} sx={{ px: { xs: 2, sm: 3 }, pb: 1.5, overflowX: "auto" }}>
            {navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Button
                  key={item.href}
                  component={NextLink}
                  href={item.href}
                  startIcon={item.icon}
                  color={active ? "primary" : "inherit"}
                  variant={active ? "contained" : "text"}
                  size="small"
                  sx={{ flexShrink: 0, px: 1.5, bgcolor: active ? "primary.main" : "transparent", color: active ? "#fff" : "text.secondary" }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Container>
      </AppBar>
      <Container component="main" maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </Box>
  );
}
