import { create } from "zustand";
import { encodeQuery, getJson } from "@/lib/dummyjson";

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  tags: string[];
  images: string[];
  thumbnail: string;
  reviews?: ProductReview[];
  meta?: { createdAt: string; updatedAt: string; barcode: string; qrCode: string };
};

type ProductResponse = { products: Product[]; total: number; skip: number; limit: number };
type Cached<T> = { value: T; savedAt: number };
type ProductsState = {
  products: Product[];
  total: number;
  categories: string[];
  selectedProduct: Product | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isCategoriesLoading: boolean;
  error: string | null;
  listCache: Record<string, Cached<ProductResponse>>;
  detailCache: Record<number, Cached<Product>>;
  categoriesCache: Cached<string[]> | null;
  fetchProducts: (options: { skip: number; limit: number; search: string; category: string }) => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
};

// Caching avoids repeat API requests when an admin revisits the same filter, page, category, or product.
// Successful list responses are keyed by search/category/offset/limit; detail and category responses live for five minutes.
const CACHE_TTL = 5 * 60 * 1000;
let productsRequestId = 0;
let productDetailRequestId = 0;

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  categories: [],
  selectedProduct: null,
  isLoading: false,
  isDetailLoading: false,
  isCategoriesLoading: false,
  error: null,
  listCache: {},
  detailCache: {},
  categoriesCache: null,
  fetchProducts: async ({ skip, limit, search, category }) => {
    // Invalidate an older in-flight request even when this result can be served from cache.
    const requestId = ++productsRequestId;
    const query = search.trim();
    const key = `${query.toLowerCase()}|${category}|${skip}|${limit}`;
    const cached = get().listCache[key];

    if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
      set({ products: cached.value.products, total: cached.value.total, isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const suffix = `?limit=${limit}&skip=${skip}`;
      const path = query
        ? `/products/search?q=${encodeQuery(query)}&limit=${limit}&skip=${skip}`
        : category
          ? `/products/category/${encodeQuery(category)}${suffix}`
          : `/products${suffix}`;
      const result = await getJson<ProductResponse>(path);
      if (requestId !== productsRequestId) return;
      set((state) => ({
        products: result.products,
        total: result.total,
        isLoading: false,
        error: null,
        listCache: { ...state.listCache, [key]: { value: result, savedAt: Date.now() } },
      }));
    } catch (error) {
      if (requestId !== productsRequestId) return;
      set({ isLoading: false, error: error instanceof Error ? error.message : "Could not load products." });
    }
  },
  fetchProduct: async (id) => {
    const cached = get().detailCache[id];
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
      productDetailRequestId += 1;
      set({ selectedProduct: cached.value, isDetailLoading: false, error: null });
      return;
    }

    const requestId = ++productDetailRequestId;
    set({ isDetailLoading: true, error: null, selectedProduct: null });
    try {
      const product = await getJson<Product>(`/products/${id}`);
      if (requestId !== productDetailRequestId) return;
      set((state) => ({
        selectedProduct: product,
        isDetailLoading: false,
        detailCache: { ...state.detailCache, [id]: { value: product, savedAt: Date.now() } },
      }));
    } catch (error) {
      if (requestId !== productDetailRequestId) return;
      set({ isDetailLoading: false, error: error instanceof Error ? error.message : "Could not load this product." });
    }
  },
  fetchCategories: async () => {
    const cached = get().categoriesCache;
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
      set({ categories: cached.value, isCategoriesLoading: false });
      return;
    }
    set({ isCategoriesLoading: true });
    try {
      const categories = await getJson<string[]>("/products/category-list");
      set({ categories, isCategoriesLoading: false, categoriesCache: { value: categories, savedAt: Date.now() } });
    } catch (error) {
      set({ isCategoriesLoading: false, error: error instanceof Error ? error.message : "Could not load categories." });
    }
  },
}));
