"use client";

import { useEffect } from "react";
import NextLink from "next/link";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import { useUsersStore } from "@/store/users-store";

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ mt: 0.35, overflowWrap: "anywhere" }}>{value || "—"}</Typography>
    </Box>
  );
}

export function UserDetail({ id }: { id: number }) {
  const user = useUsersStore((state) => state.selectedUser);
  const isLoading = useUsersStore((state) => state.isDetailLoading);
  const error = useUsersStore((state) => state.error);
  const fetchUser = useUsersStore((state) => state.fetchUser);

  useEffect(() => {
    void fetchUser(id);
  }, [fetchUser, id]);

  if (isLoading || user?.id !== id && !error) {
    return <Stack spacing={2}><Skeleton variant="rounded" height={190} /><Skeleton variant="rounded" height={250} /></Stack>;
  }

  if (error || !user) {
    return (
      <Stack spacing={2}>
        <Button component={NextLink} href="/users" startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "start" }}>Back to Users</Button>
        {error ? <Alert severity="error">{error}</Alert> : <Alert severity="info">User not found.</Alert>}
        {error && <Button variant="outlined" onClick={() => void fetchUser(id)} sx={{ alignSelf: "start" }}>Retry</Button>}
      </Stack>
    );
  }

  const address = `${user.address.address}, ${user.address.city}, ${user.address.state} ${user.address.postalCode}, ${user.address.country}`;

  return (
    <Stack spacing={3}>
      <Button component={NextLink} href="/users" startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "start" }}>Back to Users</Button>
      <Card>
        <CardContent sx={{ p: { xs: 2.5, sm: 4 }, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "start", sm: "center" }, gap: 2.5 }}>
          <Avatar src={user.image} alt={`${user.firstName} ${user.lastName}`} sx={{ width: 92, height: 92 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: 31, md: 40 } }}>{user.firstName} {user.lastName}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>@{user.username} · User #{user.id}</Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 1.5, flexWrap: "wrap" }}>
              <Chip size="small" label={`${user.age} years old`} />
              <Chip size="small" label={user.gender} sx={{ textTransform: "capitalize" }} />
              <Chip size="small" color="primary" variant="outlined" label={user.role} />
            </Stack>
          </Box>
          <Stack spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Button href={`mailto:${user.email}`} startIcon={<MailOutlineRoundedIcon />} variant="outlined">Email</Button>
            <Button href={`tel:${user.phone}`} startIcon={<PhoneIphoneRoundedIcon />} variant="outlined">Call</Button>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2.5 }}>
        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2.5, alignItems: "center" }}>
              <MailOutlineRoundedIcon color="primary" /><Typography variant="h3" sx={{ fontSize: 19 }}>Contact & profile</Typography>
            </Stack>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.5 }}>
              <DetailItem label="Email" value={user.email} />
              <DetailItem label="Phone" value={user.phone} />
              <DetailItem label="Date of birth" value={user.birthDate} />
              <DetailItem label="Blood group" value={user.bloodGroup} />
              <DetailItem label="University" value={user.university} />
              <DetailItem label="Height" value={`${user.height} cm`} />
              <DetailItem label="Weight" value={`${user.weight} kg`} />
              <DetailItem label="Eye color" value={user.eyeColor} />
              <DetailItem label="Hair" value={`${user.hair.color}, ${user.hair.type}`} />
              <DetailItem label="IP address" value={user.ip} />
              <DetailItem label="MAC address" value={user.macAddress} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2.5, alignItems: "center" }}>
              <PlaceRoundedIcon color="primary" /><Typography variant="h3" sx={{ fontSize: 19 }}>Address</Typography>
            </Stack>
            <Typography sx={{ mb: 2.5 }}>{address}</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2.5 }}>
              <DetailItem label="City" value={user.address.city} />
              <DetailItem label="State" value={user.address.state} />
              <DetailItem label="Postal code" value={user.address.postalCode} />
              <DetailItem label="Country" value={user.address.country} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ gridColumn: { md: "1 / -1" } }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2.5, alignItems: "center" }}>
              <WorkOutlineRoundedIcon color="primary" /><Typography variant="h3" sx={{ fontSize: 19 }}>Company</Typography>
            </Stack>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
              <DetailItem label="Organization" value={user.company.name} />
              <DetailItem label="Title" value={user.company.title} />
              <DetailItem label="Department" value={user.company.department} />
              <DetailItem label="Office" value={`${user.company.address.address}, ${user.company.address.city}, ${user.company.address.state}`} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ gridColumn: { md: "1 / -1" } }}>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="h3" sx={{ fontSize: 19, mb: 2.5 }}>Additional profile information</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
              <DetailItem label="Employer ID" value={user.ein} />
              <DetailItem label="Tax ID" value={user.ssn ? `•••-••-${user.ssn.slice(-4)}` : undefined} />
              <DetailItem label="Browser" value={user.userAgent} />
              <DetailItem label="Bank card" value={`${user.bank.cardType} · •••• ${user.bank.cardNumber.slice(-4)}`} />
              <DetailItem label="Card expiration" value={user.bank.cardExpire} />
              <DetailItem label="Currency" value={user.bank.currency} />
              <DetailItem label="Crypto asset" value={user.crypto.coin} />
              <DetailItem label="Crypto network" value={user.crypto.network} />
              <DetailItem label="Wallet" value={user.crypto.wallet} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
