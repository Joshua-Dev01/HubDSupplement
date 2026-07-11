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
  init: () => Promise<void>
  addItem: (productId: string) => Promise<{ error?: string }>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  removeItem: (cartItemId: string) => Promise<void>
  subscribeRealtime: () => () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  count: 0,

  init: async () => {
    set({ loading: true })

    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error('Auth check failed:', userError)
        set({ items: [], count: 0, loading: false })
        return
      }

      if (!user) {
        set({ items: [], count: 0, loading: false })
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select('id, product_id, quantity, product:products(id, name, slug, price, images)')
        .eq('user_id', user.id)

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
    try {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error('Auth check failed in addItem:', userError)
        return { error: userError.message }
      }
      if (!user) return { error: 'not_authenticated' }

      const existing = get().items.find((i) => i.product_id === productId)
      if (existing) {
        await get().updateQuantity(existing.id, existing.quantity + 1)
        return {}
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: productId, quantity: 1 })

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

  subscribeRealtime: () => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      channel = supabase
        .channel('cart-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${data.user.id}` },
          () => get().init()
        )
        .subscribe()
    })

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  },
}))