"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Language } from "./i18n"

export interface Product {
  id: string
  name: string
  nameAr: string
  price: number
  image: string
  category: string
  description: string
  descriptionAr: string
  specs: Record<string, string>
  inStock: boolean
  rating: number
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  date: string
  status: "completed" | "pending" | "failed"
  txid?: string
}

interface StoreState {
  // Language
  language: Language
  setLanguage: (lang: Language) => void

  // Cart
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // User
  piUsername: string | null
  setPiUsername: (username: string) => void
  orders: Order[]
  addOrder: (order: Order) => void
  savedProducts: string[]
  toggleSaveProduct: (productId: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Language
      language: "en",
      setLanguage: (lang) => set({ language: lang }),

      // Cart
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id)
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            }
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ cart: [] }),

      // User
      piUsername: null,
      setPiUsername: (username) => set({ piUsername: username }),
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      savedProducts: [],
      toggleSaveProduct: (productId) =>
        set((state) => ({
          savedProducts: state.savedProducts.includes(productId)
            ? state.savedProducts.filter((id) => id !== productId)
            : [...state.savedProducts, productId],
        })),
    }),
    {
      name: "smartmall-storage",
    },
  ),
)
