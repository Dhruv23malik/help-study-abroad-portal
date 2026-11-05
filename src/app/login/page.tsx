"use client";

import { FormEvent, useEffect, useState } from "react";
import NextLink from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "authenticated") router.replace("/dashboard");
  }, [router, status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // In NextAuth v5, ok: true means successful
      if (result?.ok !== true) {
        setError(result?.error || "Those credentials could not be verified. Check them and try again.");
        return;
      }

      // After successful signin, the session cookie is set
      // Use window.location to ensure a full page reload with new session
      window.location.href = "/dashboard";
    } catch {
      setError("Unable to reach the sign-in service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.08fr .92fr" }, bgcolor: "#f6f7f4" }}>
      <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "space-between", minHeight: "100vh", p: { md: 6, lg: 9 }, color: "white", background: "radial-gradient(circle at 82% 12%, rgba(192,222,198,.22), transparent 30%), linear-gradient(145deg, #183a2d, #285b47 58%, #42735c)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 42, height: 42, display: "grid", placeItems: "center", borderRadius: 3, bgcolor: "rgba(255,255,255,.14)", fontWeight: 800 }}>HS</Box>
          <Typography sx={{ fontWeight: 750 }}>Help Study Abroad</Typography>
        </Box>
        <Box sx={{ maxWidth: 570 }}>
          <Typography variant="h1" sx={{ mb: 2 }}>A clearer view of your operations.</Typography>
          <Typography sx={{ color: "rgba(255,255,255,.76)", fontSize: 18, maxWidth: 470 }}>
            Sign in to review user profiles and explore the product catalog from one focused workspace.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 4, alignItems: "center", color: "rgba(255,255,255,.82)" }}>
            <LockOutlinedIcon fontSize="small" />
            <Typography variant="body2">Secure admin access powered by NextAuth</Typography>
          </Stack>
        </Box>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,.55)" }}>Admin workspace · DummyJSON demo environment</Typography>
      </Box>

      <Box sx={{ display: "grid", placeItems: "center", minHeight: { xs: "100vh", md: "auto" }, p: { xs: 2, sm: 4 } }}>
        <Card sx={{ width: "100%", maxWidth: 460, borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.25, mb: 4 }}>
              <Box sx={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: 2.5, bgcolor: "primary.main", color: "white", fontWeight: 800 }}>HS</Box>
              <Typography sx={{ fontWeight: 750 }}>Help Study Abroad</Typography>
            </Box>
            <Typography variant="h2" sx={{ fontSize: 29, mb: 1 }}>Welcome back</Typography>
            <Typography color="text.secondary" sx={{ mb: 3.5 }}>Enter your admin credentials to continue.</Typography>

            {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.2}>
                <TextField label="Admin email" name="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required fullWidth autoFocus />
                <TextField label="Password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required fullWidth />
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ mt: 0.5, minHeight: 48 }}>
                  {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Sign in to workspace"}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.7 }}>
              Demo credentials: <strong>admin@helpstudyabroad.in</strong> / <strong>StudyAbroad@123</strong>.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.7, mt: 1 }}>
              The portal verifies this demo login, then authenticates through DummyJSON. Account registration is not available.
            </Typography>
            <Button component={NextLink} href="/" size="small" color="inherit" sx={{ mt: 2, px: 0 }}>Back to home</Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
