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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import TableViewRoundedIcon from "@mui/icons-material/TableViewRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useProductsStore, type Product } from "@/store/products-store";

const PAGE_SIZE = 12;

type SortOption = "price-asc" | "price-desc" | "rating" | "name-asc" | "name-desc";

const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  return (
    <Card sx={{
      overflow: "hidden",
      height: "100%",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 12px 32px rgba(20, 40, 28, 0.08)"
      }
    }}>
      <CardActionArea
        component={NextLink}
        href={`/products/${product.id}`}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%" }}
      >
        <Box sx={{
          position: "relative",
          bgcolor: "background.paper",
          height: 200,
          display: "grid",
          placeItems: "center",
          p: 1.5,
          width: "100%",
          borderBottom: "1px solid",
          borderColor: "divider"
        }}>
          {product.thumbnail || product.images?.[0] ? (
            <CardMedia
              component="img"
              image={product.thumbnail || product.images?.[0]}
              alt={product.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                mixBlendMode: "multiply"
              }}
            />
          ) : (
            <Box sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.light",
              color: "primary.dark"
            }}>
              <Typography variant="h3" sx={{ fontSize: 24, fontWeight: 700 }}>
                {product.title.charAt(0)}
              </Typography>
            </Box>
          )}
          <Chip
            label={product.category.replaceAll("-", " ")}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              textTransform: "capitalize",
              bgcolor: "rgba(255,255,255,.92)"
            }}
          />
        </Box>
        <CardContent sx={{ width: "100%", display: "flex", flexDirection: "column", flexGrow: 1, p: 2.25 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: 16,
              lineHeight: 1.35,
              minHeight: 46,
              mb: 0.5
            }}
            noWrap
          >
            {product.title}
          </Typography>
          <Stack direction="row" spacing={0.75} sx={{ mt: 0.25, alignItems: "center" }}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              {product.rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              • {product.stock} in stock
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt: "auto",
              pt: 2,
              justifyContent: "space-between",
              alignItems: "end"
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ fontSize: 20, fontWeight: 700 }}>${product.price.toFixed(2)}</Typography>
              {product.discountPercentage > 0 && (
                <Chip
                  label={`${product.discountPercentage.toFixed(0)}% off`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontSize: 10, height: 20, mt: 0.5 }}
                />
              )}
            </Box>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
              View
            </Typography>
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
  const [sort, setSort] = useState<SortOption>("rating");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

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
    void fetchProducts({
      skip: page * PAGE_SIZE,
      limit: PAGE_SIZE,
      search,
      category
    });
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

  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];
    switch (sort) {
      case "price-asc":
        return productsCopy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsCopy.sort((a, b) => b.price - a.price);
      case "rating":
        return productsCopy.sort((a, b) => b.rating - a.rating);
      case "name-asc":
        return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return productsCopy.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return productsCopy;
    }
  }, [products, sort]);

  const sortOptions = [
    { value: "rating", label: "Top Rated" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: { xs: "stretch", sm: "end" }, flexDirection: { xs: "column", sm: "row" } }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 36 }, mb: 0.75 }}>Products</Typography>
          <Typography color="text.secondary">Search the catalog, filter by category, and sort to find what you need.</Typography>
        </Box>

        {/* Controls Row */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            width: { xs: "100%", sm: "auto" },
            flexDirection: { xs: "column", sm: "row" }
          }}
        >
          <TextField
            value={input}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search products..."
            size="small"
            sx={{
              width: { xs: "100%", sm: 260 },
              "& .MuiInputBase-input": { py: 0.75 }
            }}
            slotProps={{
              htmlInput: { "aria-label": "Search products" },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                )
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              value={category}
              disabled={isCategoriesLoading}
              onChange={(event) => handleCategoryChange(event.target.value)}
            >
              <MenuItem value="">All categories</MenuItem>
              {sortedCategories.map((value) => (
                <MenuItem
                  key={value}
                  value={value}
                  sx={{ textTransform: "capitalize" }}
                >
                  {value.replaceAll("-", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="sort-label">Sort by</InputLabel>
            <Select
              labelId="sort-label"
              label="Sort by"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewQuiltRoundedIcon />}
            onClick={() => setViewMode("grid")}
            sx={{
              borderRadius: 2,
              minWidth: 48,
              px: 1.5,
              ...(viewMode === "grid" ? { bgcolor: "primary.main", color: "#fff" } : {})
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" }, px: 0.5 }}>Grid</Box>
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<TableViewRoundedIcon />}
            onClick={() => setViewMode("table")}
            sx={{
              borderRadius: 2,
              minWidth: 48,
              px: 1.5,
              ...(viewMode === "table" ? { bgcolor: "primary.main", color: "#fff" } : {})
            }}
          >
            <Box component="span" sx={{ display: { xs: "none", sm: "inline" }, px: 0.5 }}>Table</Box>
          </Button>
        </Stack>
      </Box>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void fetchProducts({
                skip: page * PAGE_SIZE,
                limit: PAGE_SIZE,
                search,
                category
              })}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && products.length === 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
            gap: 2
          }}
        >
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} variant="rounded" height={340} />
          ))}
        </Box>
      ) : (
        <>
          {/* Table View (responsive - shown on md+) */}
          <TableContainer
            component={Card}
            sx={{
              display: { xs: "none", md: viewMode === "table" ? "block" : "none" },
              overflowX: "auto"
            }}
          >
            <Table aria-label="Products">
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafbf9" }}>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">No products match your filters.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        "&:hover": { bgcolor: "action.hover" },
                        transition: "background-color 0.2s"
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                          <Box
                            component="img"
                            src={product.thumbnail || product.images?.[0]}
                            alt={product.title}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                              borderRadius: 1,
                              bgcolor: "background.paper"
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {product.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.category.replaceAll("-", " ")}
                          size="small"
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Rating value={product.rating} precision={0.1} size="small" readOnly sx={{ pb: 0.25 }} />
                        <Typography variant="caption" color="text.secondary">
                          {product.rating.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 600 }}>${product.price.toFixed(2)}</Typography>
                        {product.discountPercentage > 0 && (
                          <Typography variant="caption" color="success.main">
                            {product.discountPercentage.toFixed(0)}% off
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={product.stock}
                          color={product.stock > 0 ? "success" : "error"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          component={NextLink}
                          href={`/products/${product.id}`}
                          size="small"
                          startIcon={<ArrowForwardRoundedIcon />}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Grid View */}
          <Box sx={{ display: { xs: "block", md: viewMode === "grid" ? "block" : "none" } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                  xl: "repeat(4, minmax(0, 1fr))"
                },
                gap: 2
              }}
            >
              {isLoading && products.length > 0
                ? Array.from({ length: 8 }, (_, index) => (
                    <Skeleton key={index} variant="rounded" height={340} />
                  ))
                : sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}

              {!isLoading && sortedProducts.length === 0 && (
                <Card sx={{ p: 4, textAlign: "center", gridColumn: "1 / -1" }}>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    {search || category
                      ? `No products found matching "${search || category}"`
                      : "No products available"}
                  </Typography>
                  {!search && !category && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setCategory("");
                        setInput("");
                        setSearch("");
                        setPage(0);
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </Card>
              )}
            </Box>
          </Box>
        </>
      )}

      {/* Pagination */}
      {total > 0 && !isLoading && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            pt: 1
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min(page * PAGE_SIZE + 1, total)}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total} products
          </Typography>
          <Pagination
            count={pageCount}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </Stack>
  );
}