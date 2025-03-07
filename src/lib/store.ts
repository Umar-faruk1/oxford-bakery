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

interface AuthState {
  user: {
    name: string
    email: string
    image?: string
    role?: string
  } | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, userData: { email: string; name: string; image?: string; role?: string }) => void
  logout: () => void
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, userData) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
        }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

