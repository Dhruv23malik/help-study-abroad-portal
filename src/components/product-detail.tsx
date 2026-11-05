"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useProductsStore } from "@/store/products-store";

function ProductFact({ label, value }: { label: string; value?: string | number }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ mt: 0.35 }}>{value || "—"}</Typography>
    </Box>
  );
}

export function ProductDetail({ id }: { id: number }) {
  const product = useProductsStore((state) => state.selectedProduct);
  const isLoading = useProductsStore((state) => state.isDetailLoading);
  const error = useProductsStore((state) => state.error);
  const fetchProduct = useProductsStore((state) => state.fetchProduct);
  const [imageSelection, setImageSelection] = useState({ productId: id, index: 0 });

  useEffect(() => {
    void fetchProduct(id);
  }, [fetchProduct, id]);

  const images = useMemo(() => product?.images?.length ? product.images : product?.thumbnail ? [product.thumbnail] : [], [product]);
  const activeImage = product?.id === imageSelection.productId ? imageSelection.index : 0;

  if (isLoading || product?.id !== id && !error) {
    return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}><Skeleton variant="rounded" height={440} /><Skeleton variant="rounded" height={440} /></Box>;
  }

  if (error || !product) {
    return (
      <Stack spacing={2}>
        <Button component={NextLink} href="/products" startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "start" }}>Back to Products</Button>
        {error ? <Alert severity="error">{error}</Alert> : <Alert severity="info">Product not found.</Alert>}
        {error && <Button variant="outlined" onClick={() => void fetchProduct(id)} sx={{ alignSelf: "start" }}>Retry</Button>}
      </Stack>
    );
  }

  const moveImage = (direction: number) => {
    setImageSelection({
      productId: id,
      index: (activeImage + direction + images.length) % images.length,
    });
  };

  return (
    <Stack spacing={3}>
      <Button component={NextLink} href="/products" startIcon={<ArrowBackRoundedIcon />} sx={{ alignSelf: "start" }}>Back to Products</Button>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.05fr) minmax(0, .95fr)" }, gap: { xs: 2.5, md: 3 } }}>
        <Card>
          <Box sx={{ position: "relative", height: { xs: 320, sm: 450 }, bgcolor: "#f0f3ef", display: "grid", placeItems: "center", p: { xs: 2, sm: 4 } }}>
            {images.length > 0 && <Box component="img" src={images[activeImage]} alt={product.title} sx={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />}
            {images.length > 1 && (
              <>
                <IconButton aria-label="Previous image" onClick={() => moveImage(-1)} sx={{ position: "absolute", left: 12, bgcolor: "rgba(255,255,255,.92)" }}><ArrowBackIosNewRoundedIcon fontSize="small" /></IconButton>
                <IconButton aria-label="Next image" onClick={() => moveImage(1)} sx={{ position: "absolute", right: 12, bgcolor: "rgba(255,255,255,.92)" }}><ArrowForwardIosRoundedIcon fontSize="small" /></IconButton>
              </>
            )}
          </Box>
          {images.length > 1 && (
            <Stack direction="row" spacing={1} sx={{ p: 1.5, overflowX: "auto" }}>
              {images.map((image, index) => (
                <Box key={`${image}-${index}`} component="button" aria-label={`Show image ${index + 1}`} onClick={() => setImageSelection({ productId: product.id, index })} sx={{ border: index === activeImage ? "2px solid" : "1px solid #e0e5e0", borderColor: index === activeImage ? "primary.main" : "divider", bgcolor: "#fff", borderRadius: 2, p: 0.5, width: 66, height: 66, flex: "0 0 auto", cursor: "pointer" }}>
                  <Box component="img" src={image} alt="" sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </Box>
              ))}
            </Stack>
          )}
        </Card>

        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 1.5, flexWrap: "wrap" }}>
              <Chip label={product.category.replaceAll("-", " ")} size="small" color="primary" variant="outlined" sx={{ textTransform: "capitalize" }} />
              {product.brand && <Chip label={product.brand} size="small" />}
            </Stack>
            <Typography variant="h1" sx={{ fontSize: { xs: 30, md: 38 }, lineHeight: 1.15 }}>{product.title}</Typography>
            <Stack direction="row" spacing={0.75} sx={{ mt: 1.5, alignItems: "center" }}>
              <Rating value={product.rating} precision={0.1} size="small" readOnly />
              <Typography variant="body2" color="text.secondary">{product.rating.toFixed(1)} · {product.reviews?.length ?? 0} reviews</Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ mt: 2.5, lineHeight: 1.8 }}>{product.description}</Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3, alignItems: "baseline" }}>
              <Typography variant="h2" sx={{ fontSize: 32 }}>${product.price.toFixed(2)}</Typography>
              <Chip label={`${product.discountPercentage.toFixed(0)}% off`} color="success" size="small" />
            </Stack>
            <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 1.5, flexWrap: "wrap" }}>
              <Chip size="small" variant="outlined" label={`${product.stock} in stock`} />
              {product.availabilityStatus && <Chip size="small" variant="outlined" label={product.availabilityStatus} />}
              {product.minimumOrderQuantity && <Chip size="small" variant="outlined" label={`Min order ${product.minimumOrderQuantity}`} />}
            </Stack>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" }, gap: 2.5, mt: 3.5, pt: 3, borderTop: 1, borderColor: "divider" }}>
              <ProductFact label="SKU" value={product.sku} />
              <ProductFact label="Weight" value={product.weight ? `${product.weight} kg` : undefined} />
              <ProductFact label="Dimensions" value={product.dimensions ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm` : undefined} />
              <ProductFact label="Warranty" value={product.warrantyInformation} />
              <ProductFact label="Shipping" value={product.shippingInformation} />
              <ProductFact label="Returns" value={product.returnPolicy} />
              <ProductFact label="Barcode" value={product.meta?.barcode} />
              <ProductFact label="Updated" value={product.meta?.updatedAt ? new Date(product.meta.updatedAt).toLocaleDateString() : undefined} />
            </Box>

            {!!product.tags?.length && <Stack direction="row" spacing={0.75} useFlexGap sx={{ mt: 3, flexWrap: "wrap" }}>{product.tags.map((tag) => <Chip key={tag} size="small" label={tag} />)}</Stack>}
          </CardContent>
        </Card>
      </Box>

      {!!product.reviews?.length && (
        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="h3" sx={{ fontSize: 21, mb: 2 }}>Customer reviews</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 1.5 }}>
              {product.reviews.map((review, index) => (
                <Box key={`${review.reviewerEmail}-${index}`} sx={{ p: 2, borderRadius: 2.5, bgcolor: "#f7f8f6" }}>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 700 }}>{review.reviewerName}</Typography>
                    <Stack direction="row" spacing={0.25} sx={{ alignItems: "center" }}><StarRoundedIcon sx={{ fontSize: 17, color: "#cf9a39" }} /><Typography variant="body2">{review.rating}</Typography></Stack>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{review.comment}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
