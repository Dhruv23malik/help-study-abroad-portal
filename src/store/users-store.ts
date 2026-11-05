import { create } from "zustand";
import { encodeQuery, getJson } from "@/lib/dummyjson";

export type DummyUser = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  birthDate: string;
  gender: string;
  email: string;
  phone: string;
  username: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: { color: string; type: string };
  ip: string;
  macAddress: string;
  ein: string;
  ssn: string;
  userAgent: string;
  bank: { cardExpire: string; cardNumber: string; cardType: string; currency: string; iban: string };
  crypto: { coin: string; wallet: string; network: string };
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  university: string;
  company: {
    name: string;
    title: string;
    department: string;
    address: { address: string; city: string; state: string };
  };
  role: string;
};

type UserResponse = { users: DummyUser[]; total: number; skip: number; limit: number };
type Cached<T> = { value: T; savedAt: number };
type UsersState = {
  users: DummyUser[];
  total: number;
  selectedUser: DummyUser | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  listCache: Record<string, Cached<UserResponse>>;
  detailCache: Record<number, Cached<DummyUser>>;
  fetchUsers: (options: { skip: number; limit: number; search: string }) => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
};

// Caching avoids repeat API requests when an admin returns to the same list page or profile.
// Successful list responses are keyed by search, offset, and limit; detail responses are keyed by user ID for five minutes.
const CACHE_TTL = 5 * 60 * 1000;
let usersRequestId = 0;
let userDetailRequestId = 0;

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  selectedUser: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
  listCache: {},
  detailCache: {},
  fetchUsers: async ({ skip, limit, search }) => {
    // Invalidate an older in-flight request even when this result can be served from cache.
    const requestId = ++usersRequestId;
    const query = search.trim();
    const key = `${query.toLowerCase()}|${skip}|${limit}`;
    const cached = get().listCache[key];

    if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
      set({ users: cached.value.users, total: cached.value.total, isLoading: false, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const suffix = `?limit=${limit}&skip=${skip}`;
      const path = query
        ? `/users/search?q=${encodeQuery(query)}&limit=${limit}&skip=${skip}`
        : `/users${suffix}`;
      const result = await getJson<UserResponse>(path);
      if (requestId !== usersRequestId) return;
      set((state) => ({
        users: result.users,
        total: result.total,
        isLoading: false,
        error: null,
        listCache: { ...state.listCache, [key]: { value: result, savedAt: Date.now() } },
      }));
    } catch (error) {
      if (requestId !== usersRequestId) return;
      set({ isLoading: false, error: error instanceof Error ? error.message : "Could not load users." });
    }
  },
  fetchUser: async (id) => {
    const cached = get().detailCache[id];
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
      userDetailRequestId += 1;
      set({ selectedUser: cached.value, isDetailLoading: false, error: null });
      return;
    }

    const requestId = ++userDetailRequestId;
    set({ isDetailLoading: true, error: null, selectedUser: null });
    try {
      const user = await getJson<DummyUser>(`/users/${id}`);
      if (requestId !== userDetailRequestId) return;
      set((state) => ({
        selectedUser: user,
        isDetailLoading: false,
        detailCache: { ...state.detailCache, [id]: { value: user, savedAt: Date.now() } },
      }));
    } catch (error) {
      if (requestId !== userDetailRequestId) return;
      set({ isDetailLoading: false, error: error instanceof Error ? error.message : "Could not load this user." });
    }
  },
}));
