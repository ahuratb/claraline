import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean        // cart drawer
  isMenuOpen: boolean    // side / mobile menu drawer
  addItem: (item: CartItem) => void
  removeItem: (productId: string, shade?: string) => void
  updateQuantity: (productId: string, quantity: number, shade?: string) => void
  clearCart: () => void
  // Drawer actions — mutex: opening one closes the other.
  openCart: () => void
  closeCart: () => void
  openMenu: () => void
  closeMenu: () => void
  closeAll: () => void
  total: () => number
  count: () => number
  isAnyDrawerOpen: () => boolean
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isMenuOpen: false,

      addItem: (item) => set(state => {
        const existing = state.items.find(
          i => i.productId === item.productId && i.shade === item.shade
        )
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === item.productId && i.shade === item.shade
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),

      removeItem: (productId, shade) => set(state => ({
        items: state.items.filter(
          i => !(i.productId === productId && i.shade === shade)
        )
      })),

      updateQuantity: (productId, quantity, shade) => set(state => ({
        items: quantity === 0
          ? state.items.filter(i => !(i.productId === productId && i.shade === shade))
          : state.items.map(i =>
              i.productId === productId && i.shade === shade
                ? { ...i, quantity }
                : i
            )
      })),

      clearCart: () => set({ items: [] }),

      // Mutex drawer actions
      openCart:  () => set({ isOpen: true,  isMenuOpen: false }),
      closeCart: () => set({ isOpen: false }),
      openMenu:  () => set({ isMenuOpen: true,  isOpen: false }),
      closeMenu: () => set({ isMenuOpen: false }),
      closeAll:  () => set({ isOpen: false, isMenuOpen: false }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      isAnyDrawerOpen: () => get().isOpen || get().isMenuOpen,
    }),
    {
      name: 'claraline-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
