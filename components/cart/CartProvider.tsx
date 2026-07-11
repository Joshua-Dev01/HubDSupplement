'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { createClient } from '@/lib/supabase/client'

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const init = useCartStore((s) => s.init)
  const subscribeRealtime = useCartStore((s) => s.subscribeRealtime)

  useEffect(() => {
    init()
    const unsubscribe = subscribeRealtime()

    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => init())

    return () => {
      unsubscribe()
      subscription.unsubscribe()
    }
  }, [init, subscribeRealtime])

  return <>{children}</>
}