"use client";

import { memo, useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Rating,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useProductsStore, type Product } from "@/store/products-store";

const PAGE_SIZE = 10;

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return (
    <Card sx={{ overflow: "hidden", height: "100%" }}>
      <CardActionArea component={NextLink} href={`/products/${product.id}`} sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%" }}>
        <Box sx={{ position: "relative", bgcolor: "#f1f4f0", height: 210, display: "grid", placeItems: "center", p: 2, width: "100%" }}>
          <CardMedia component="img" image={product.thumbnail || product.images?.[0]} alt={product.title} sx={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
          <Chip label={product.category.replaceAll("-", " ")} size="small" sx={{ position: "absolute", top: 12, left: 12, textTransform: "capitalize", bgcolor: "rgba(255,255,255,.92)" }} />
        </Box>
        <CardContent sx={{ width: "100%", display: "flex", flexDirection: "column", flexGrow: 1, p: 2.25 }}>
          <Typography variant="h3" sx={{ fontSize: 17, lineHeight: 1.35, minHeight: 46 }}>
            {product.title}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mt: 1.25, alignItems: "center" }}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">{product.rating.toFixed(1)}</Typography>
          </Stack>
          <Stack direction="row" sx={{ mt: "auto", pt: 2, justifyContent: "space-between", alignItems: "end" }}>
            <Box>
              <Typography variant="h3" sx={{ fontSize: 21 }}>${product.price.toFixed(2)}</Typography>
              <Typography variant="caption" color="text.secondary">{product.stock} in stock</Typography>
            </Box>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>View details</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export function ProductsList() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const products = useProductsStore((state) => state.products);
  const total = useProductsStore((state) => state.total);
  const categories = useProductsStore((state) => state.categories);
  const isLoading = useProductsStore((state) => state.isLoading);
  const isCategoriesLoading = useProductsStore((state) => state.isCategoriesLoading);
  const error = useProductsStore((state) => state.error);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const fetchCategories = useProductsStore((state) => state.fetchCategories);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(input.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    void fetchProducts({ skip: page * PAGE_SIZE, limit: PAGE_SIZE, search, category });
  }, [fetchProducts, page, search, category]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);
  const sortedCategories = useMemo(() => [...categories].sort((a, b) => a.localeCompare(b)), [categories]);

  const handleSearchChange = (value: string) => {
    setInput(value);
    setCategory("");
    setPage(0);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setInput("");
    setSearch("");
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: { xs: "stretch", sm: "end" }, flexDirection: { xs: "column", sm: "row" } }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 42 }, mb: 0.75 }}>Products</Typography>
          <Typography color="text.secondary">Search the catalog or narrow products by category.</Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <TextField
            value={input}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search products"
            size="small"
            sx={{ width: { xs: "100%", sm: 250 } }}
            slotProps={{
              htmlInput: { "aria-label": "Search products" },
              input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> },
            }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 220 } }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select labelId="category-label" label="Category" value={category} disabled={isCategoriesLoading} onChange={(event) => handleCategoryChange(event.target.value)}>
              <MenuItem value="">All categories</MenuItem>
              {sortedCategories.map((value) => <MenuItem key={value} value={value} sx={{ textTransform: "capitalize" }}>{value.replaceAll("-", " ")}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {error && <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => void fetchProducts({ skip: page * PAGE_SIZE, limit: PAGE_SIZE, search, category })}>Retry</Button>}>{error}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }, gap: 2 }}>
        {isLoading && products.length === 0
          ? Array.from({ length: 8 }, (_, index) => <Skeleton key={index} variant="rounded" height={365} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
        {!isLoading && products.length === 0 && <Card sx={{ p: 4, textAlign: "center", gridColumn: "1 / -1" }}><Typography color="text.secondary">No products match your filters.</Typography></Card>}
      </Box>

      {total > 0 && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">Showing page {page + 1} of {pageCount} · {total} products</Typography>
          <Pagination count={pageCount} page={page + 1} onChange={(_, value) => setPage(value - 1)} color="primary" shape="rounded" />
        </Stack>
      )}
    </Stack>
  );
}
