import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CheckCircle } from 'lucide-react'
import { notFound } from 'next/navigation'
import { formatNaira } from '@/lib/utils'

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <div className="bg-[#F7F5F0] min-h-screen pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <CheckCircle className="w-16 h-16 text-[#5F7A5B] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[#1F2421] mb-2">Order Confirmed</h1>
        <p className="text-sm text-[#8A928E] mb-10">
          Order #{order.id.slice(0, 8).toUpperCase()} ·{' '}
          {new Date(order.created_at).toLocaleDateString()}
        </p>

        <div className="bg-white rounded-2xl p-6 text-left mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A928E] mb-4">
            Items
          </h3>
          {order.order_items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm text-[#3F4744] mb-2">
              <span>{item.product_name} × {item.quantity}</span>
              <span>{formatNaira(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="space-y-2 pt-4 mt-4 border-t border-black/10">
            <div className="flex justify-between text-sm text-[#8A928E]">
              <span>Subtotal</span>
              <span>{formatNaira(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#8A928E]">
              <span>Shipping</span>
              <span>{order.shipping_fee === 0 ? 'Free' : formatNaira(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#8A928E]">
              <span>Tax</span>
              <span>{formatNaira(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#1F2421] pt-2 border-t border-black/10">
              <span>Total</span>
              <span>{formatNaira(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 text-left mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A928E] mb-4">
            Delivery Address
          </h3>
          <p className="text-sm text-[#1F2421]">{order.full_name}</p>
          <p className="text-sm text-[#1F2421]">{order.address}</p>
          <p className="text-sm text-[#1F2421]">{order.city}, {order.state}</p>
          <p className="text-sm text-[#1F2421]">{order.phone}</p>
        </div>

        <p className="text-xs text-[#8A928E] mb-8">
          A receipt has been sent to {order.email}
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/orders"
            className="border border-[#1F2421] text-[#1F2421] px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-[#1F2421] hover:text-white transition-colors"
          >
            Track Order
          </Link>
          <Link
            href="/shop"
            className="bg-[#5F7A5B] hover:bg-[#4F6A4B] text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}