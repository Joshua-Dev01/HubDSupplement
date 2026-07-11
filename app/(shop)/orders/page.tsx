'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cartStore'
import { formatNaira } from '@/lib/utils'
import { getOrders } from '@/actions/orders'

type OrderItem = {
  id: string
  product_name: string
  product_image: string | null
  price: number
  quantity: number
}

type Order = {
  id: string
  status: string
  total: number
  created_at: string
  full_name: string
  address: string
  city: string
  state: string
  order_items: OrderItem[]
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-200 text-gray-600',
}

export default function OrdersPage() {
  const authUserId = useCartStore((s) => s.authUserId)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data as Order[])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!authUserId) return
    const supabase = createClient()
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${authUserId}` },
        () => getOrders().then((data) => setOrders(data as Order[]))
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [authUserId])

  return (
    <div className="bg-[#F7F5F0] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-[#1F2421] mb-8">Order History</h1>

        {loading ? (
          <p className="text-sm text-[#8A928E]">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl py-20 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#EFEDE6] flex items-center justify-center">
              <Package size={22} className="text-[#8A928E]" />
            </div>
            <p className="text-sm text-[#8A928E]">You haven&apos;t placed any orders yet</p>
            <Link href="/shop" className="text-sm font-medium text-[#5F7A5B] underline">Start shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#8A928E]">
                      {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-[#8A928E]">Order #{order.id.slice(0, 8)}</p>
                  </div>
                  <span className={`text-xs font-medium uppercase tracking-wider px-3 py-1 rounded-full ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>

                <p className="text-xs text-[#8A928E] mb-4">
                  Delivering to {order.full_name} — {order.address}, {order.city}, {order.state}
                </p>

                <div className="flex flex-col gap-3 border-t border-black/5 pt-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#EFEDE6] shrink-0">
                        {item.product_image && <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#1F2421] truncate">{item.product_name}</p>
                        <p className="text-xs text-[#8A928E]">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-[#1F2421]">{formatNaira(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-black/5 mt-4 pt-4">
                  <span className="text-sm font-medium text-[#1F2421]">Total</span>
                  <span className="text-lg font-bold text-[#1F2421]">{formatNaira(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}