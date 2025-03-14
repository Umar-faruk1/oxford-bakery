import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Cake } from "@/types/types"

interface CartItem extends Cake {
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (cake: Cake) => void
  removeItem: (cakeId: number) => void
  updateQuantity: (cakeId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

interface User {
  email: string;
  name: string;
  image?: string | null;
  role?: string | null;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, name: string, image: string | null, token: string, role?: string | null) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (cake: Cake) => {
        const { items } = get()
        const existingItem = items.find((item) => item.id === cake.id)

        if (existingItem) {
          set({
            items: items.map((item) => (item.id === cake.id ? { ...item, quantity: item.quantity + 1 } : item)),
          })
        } else {
          set({ items: [...items, { ...cake, quantity: 1 }] })
        }
      },
      removeItem: (cakeId: number) => {
        set({ items: get().items.filter((item) => item.id !== cakeId) })
      },
      updateQuantity: (cakeId: number, quantity: number) => {
        const { items } = get()
        if (quantity <= 0) {
          set({ items: items.filter((item) => item.id !== cakeId) })
        } else {
          set({
            items: items.map((item) => (item.id === cakeId ? { ...item, quantity } : item)),
          })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      login: (email: string, name: string, image: string | null, token: string, role?: string | null) => {
        const userData = { email, name, image, role };
        set({ 
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false
        });
        localStorage.setItem('token', token);
      },
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false
        });
        localStorage.removeItem('token');
      },
      hydrate: async () => {
        set({ isLoading: true });
        try {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const parts = token.split('.');
              if (parts.length === 3) {
                const tokenData = JSON.parse(atob(parts[1]));
                if (tokenData.exp * 1000 > Date.now()) {
                  set((state) => ({ 
                    ...state, 
                    token,
                    isAuthenticated: true,
                    isLoading: false 
                  }));
                  return;
                }
              }
            } catch (e) {
              console.error('Invalid token format:', e);
            }
            localStorage.removeItem('token');
          }
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to hydrate auth store:', error);
          set({ isLoading: false });
        }
      }
    }),
    {
      name: "auth-storage",
      skipHydration: false
    }
  )
);

