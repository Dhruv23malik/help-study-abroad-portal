import NextLink from "next/link";
import {
  ArrowForwardRounded,
  GroupsRounded,
  Inventory2Rounded,
  VerifiedUserRounded,
} from "@mui/icons-material";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

export const instant = false;

const sections = [
  {
    href: "/users",
    title: "User directory",
    description: "Search the user directory, move through paginated results, and inspect complete profiles.",
    icon: <GroupsRounded />,
    label: "Browse users",
  },
  {
    href: "/products",
    title: "Product catalog",
    description: "Explore the catalog with search, category filters, and detailed product specifications.",
    icon: <Inventory2Rounded />,
    label: "Browse products",
  },
];

export default function DashboardPage() {
  return (
    <Stack spacing={4}>
      <Box>
        <Chip icon={<VerifiedUserRounded />} label="Authenticated admin session" color="success" variant="outlined" sx={{ mb: 2 }} />
        <Typography variant="h1" sx={{ mb: 1 }}>Workspace overview</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 650, fontSize: 17 }}>
          Your starting point for managing directory records and reviewing the product catalog.
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2.5 }}>
        {sections.map((section) => (
          <Card key={section.href} sx={{ height: "100%" }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 3, display: "grid", placeItems: "center", bgcolor: "primary.light", color: "primary.dark", mb: 2.5 }}>
                {section.icon}
              </Box>
              <Typography variant="h3" sx={{ fontSize: 23, mb: 1 }}>{section.title}</Typography>
              <Typography color="text.secondary" sx={{ minHeight: { sm: 50 }, mb: 3 }}>{section.description}</Typography>
              <NextLink href={section.href} style={{ display: "inline-flex" }}>
                <Button variant="contained" endIcon={<ArrowForwardRounded />}>
                  {section.label}
                </Button>
              </NextLink>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", p: 2, borderRadius: 3, bgcolor: "#edf2ee" }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Data source</Typography>
        <Typography variant="body2" color="text.secondary">All directory and catalog records load from the DummyJSON public REST API.</Typography>
      </Box>
    </Stack>
  );
}
