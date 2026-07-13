'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { getAllOrders, updateOrderStatus } from '@/actions/admin-orders'
import { createClient } from '@/lib/supabase/client'
import { formatNaira } from '@/lib/utils'

type OrderItem = {
  id: string
  product_image?: string | null
  product_name: string
  quantity: number
  price: number
}

type Order = {
  id: string
  full_name: string
  email: string
  phone: string
  created_at: string
  status: string
  address: string
  city: string
  state: string
  order_items?: OrderItem[]
  total: number
}

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'failed', 'cancelled']

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-200 text-gray-600',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  async function loadOrders() {
    const data = await getAllOrders()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    async function fetchOrders() {
      await loadOrders()
    }

    fetchOrders()

    // Real-time: new orders / status changes from anywhere show up instantly
    const supabase = createClient()
    const channel = supabase
      .channel('admin-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadOrders())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function handleStatusChange(orderId: string, status: string) {
    const result = await updateOrderStatus(orderId, status)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Order status updated')
  }

  if (loading) return <p className="text-sm text-[#8A928E]">Loading orders...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2421] mb-8">Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="font-semibold text-[#1F2421]">{order.full_name}</p>
                <p className="text-xs text-[#8A928E]">{order.email} · {order.phone}</p>
                <p className="text-xs text-[#8A928E] mt-1">
                  {new Date(order.created_at).toLocaleString('en-NG')} · #{order.id.slice(0, 8)}
                </p>
              </div>

              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={`text-xs font-medium uppercase tracking-wider px-3 py-1.5 rounded-full border-none outline-none cursor-pointer ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <p className="text-xs text-[#8A928E] mb-4">
              {order.address}, {order.city}, {order.state}
            </p>

            <div className="flex flex-col gap-2 border-t border-black/5 pt-4">
              {order.order_items?.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#EFEDE6] shrink-0">
                    {item.product_image && <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />}
                  </div>
                  <p className="text-sm text-[#1F2421] flex-1">{item.product_name} × {item.quantity}</p>
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

        {orders.length === 0 && (
          <div className="bg-white rounded-2xl py-16 text-center">
            <p className="text-sm text-[#8A928E]">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  )
}