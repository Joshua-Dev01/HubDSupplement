import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/product'

export type CartItem = {
  id: string
  product_id: string
  quantity: number
  product: Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'images'>
}

type CartState = {
  items: CartItem[]
  loading: boolean
  count: number
  authUserId: string | null
  authUserEmail: string | null
  setAuth: (id: string | null, email: string | null) => void
  init: () => Promise<void>
  addItem: (productId: string) => Promise<{ error?: string }>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  count: 0,
  authUserId: null,
  authUserEmail: null,

  setAuth: (id: string | null, email: string | null) => {
    set({ authUserId: id, authUserEmail: email })
    if (id) {
      get().init()
    } else {
      set({ items: [], count: 0 })
    }
  },

  init: async () => {
    const userId = get().authUserId
    if (!userId) {
      set({ items: [], count: 0, loading: false })
      return
    }

    set({ loading: true })

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('cart_items')
        .select('id, product_id, quantity, product:products(id, name, slug, price, images)')
        .eq('user_id', userId)

      if (error) {
        console.error('Cart fetch error:', error.message, error.details, error.hint)
        set({ items: [], count: 0, loading: false })
        return
      }

      const items = (data ?? []) as unknown as CartItem[]
      set({ items, count: items.reduce((sum, i: CartItem) => sum + i.quantity, 0), loading: false })
    } catch (err) {
      console.error('Cart init threw an exception:', err)
      set({ items: [], count: 0, loading: false })
    }
  },

  addItem: async (productId: string) => {
    const userId = get().authUserId
    if (!userId) return { error: 'not_authenticated' }

    try {
      const supabase = createClient()

      const existing = get().items.find((i) => i.product_id === productId)
      if (existing) {
        await get().updateQuantity(existing.id, existing.quantity + 1)
        return {}
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity: 1 })

      if (error) {
        console.error('Add to cart error:', error.message, error.details, error.hint)
        return { error: error.message }
      }

      await get().init()
      return {}
    } catch (err) {
      console.error('addItem threw an exception:', err)
      return { error: 'Something went wrong adding this to your cart' }
    }
  },

  updateQuantity: async (cartItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await get().removeItem(cartItemId)
        return
      }
      const supabase = createClient()
      const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', cartItemId)
      if (error) console.error('Update quantity error:', error.message)
      await get().init()
    } catch (err) {
      console.error('updateQuantity threw an exception:', err)
    }
  },

  removeItem: async (cartItemId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId)
      if (error) console.error('Remove item error:', error.message)
      await get().init()
    } catch (err) {
      console.error('removeItem threw an exception:', err)
    }
  },
}))