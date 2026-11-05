import NextLink from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

const features = [
  {
    title: "User directory",
    description: "Search profiles and review contact, company, and location details.",
    icon: <GroupsRoundedIcon />,
  },
  {
    title: "Product catalog",
    description: "Explore products with category filters, ratings, and full specifications.",
    icon: <Inventory2RoundedIcon />,
  },
];

export default function HomePage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "rgba(255,255,255,.88)" }}>
        <Container maxWidth="lg" sx={{ minHeight: 76, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 2.5, bgcolor: "primary.main", color: "white", fontWeight: 800 }}>HS</Box>
            <Typography sx={{ fontWeight: 750 }}>Help Study Abroad</Typography>
          </Stack>
          <NextLink href="/login" style={{ display: "inline-flex" }}>
            <Button variant="outlined">Admin sign in</Button>
          </NextLink>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 12 } }}>
        <Box sx={{ maxWidth: 760, mb: { xs: 5, md: 7 } }}>
          <Typography variant="overline" color="primary.main" sx={{ letterSpacing: ".15em", fontWeight: 750 }}>
            ADMIN WORKSPACE
          </Typography>
          <Typography variant="h1" sx={{ mt: 1.5, mb: 2.5 }}>
            A simpler way to manage your directory and catalog.
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 650, fontSize: { xs: 17, md: 19 }, lineHeight: 1.7 }}>
            Sign in to search user profiles, browse products, and review details from one organized workspace.
          </Typography>
          <NextLink href="/login" style={{ display: "inline-flex", marginTop: 28 }}>
            <Button size="large" variant="contained" endIcon={<ArrowForwardRoundedIcon />}>
              Continue to admin sign in
            </Button>
          </NextLink>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2.5 }}>
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Box sx={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: 3, bgcolor: "primary.light", color: "primary.dark", mb: 2.5 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h3" sx={{ fontSize: 21, mb: 1 }}>{feature.title}</Typography>
                <Typography color="text.secondary">{feature.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
