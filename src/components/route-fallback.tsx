import { Box, CircularProgress, Typography } from "@mui/material";

export function RouteFallback({ label = "Loading workspace" }: { label?: string }) {
  return (
    <Box sx={{ minHeight: 240, display: "grid", placeContent: "center", justifyItems: "center", gap: 1.5 }}>
      <CircularProgress size={28} />
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  );
}
