'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'

export default function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      const userId = session?.user?.id ?? null
      const email = session?.user?.email ?? null
      useCartStore.getState().setAuth(userId, email)

      if (userId) {
        channel = supabase
          .channel('cart-changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${userId}` },
            () => useCartStore.getState().init()
          )
          .subscribe()
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id ?? null
      const email = session?.user?.email ?? null
      useCartStore.getState().setAuth(userId, email)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return <>{children}</>
}