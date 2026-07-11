'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { Trash2, Plus, Minus, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, loading, init, updateQuantity, removeItem } = useCartStore()

  useEffect(() => { init() }, [init])

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const total = subtotal

  if (loading) {
    return <div className="pt-32 pb-24 text-center text-sm text-[#8A928E]">Loading your cart...</div>
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1F2421]">Your Cart</h1>
          <p className="text-sm text-[#8A928E] mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 flex gap-6">
                <Link href={`/products/${item.product.slug}`} className="relative w-28 h-28 bg-[#EFEDE6] rounded-xl overflow-hidden shrink-0">
                  {item.product.images?.[0] && (
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  )}
                </Link>

                <div className="flex flex-col justify-between flex-grow">
                  <div className="flex justify-between items-start gap-4">
                    <Link href={`/products/${item.product.slug}`} className="font-semibold text-[#1F2421] hover:text-[#5F7A5B] transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="font-bold text-[#1F2421]">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-black/10 rounded-full">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5 text-[#8A928E] hover:text-[#1F2421] transition-colors">
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-[#1F2421]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5 text-[#8A928E] hover:text-[#1F2421] transition-colors">
                        <Plus size={12} />
                      </button>
                    </div>

                    <button onClick={() => removeItem(item.id)} className="flex items-center gap-1.5 text-xs text-[#8A928E] hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="bg-white rounded-2xl py-20 text-center">
                <p className="text-sm text-[#8A928E] mb-4">Your cart is empty</p>
                <Link href="/shop" className="text-sm font-medium text-[#5F7A5B] underline">Start shopping</Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-semibold text-[#1F2421] mb-6">Order Summary</h2>

              <div className="space-y-3 border-b border-black/10 pb-6 text-sm">
                <div className="flex justify-between text-[#8A928E]">
                  <span>Subtotal</span>
                  <span className="text-[#1F2421] font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#8A928E]">
                  <span>Shipping</span>
                  <span className="text-[#5F7A5B] font-medium uppercase text-xs">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline py-6">
                <span className="font-medium text-[#1F2421]">Total</span>
                <span className="text-xl font-bold text-[#1F2421]">${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="block text-center w-full bg-[#5F7A5B] hover:bg-[#4F6A4B] text-white text-sm font-medium py-4 rounded-full transition-colors"
              >
                Proceed To Checkout
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-5 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-[#3F4744]">
                <ShieldCheck size={14} className="text-[#5F7A5B]" />
                Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#3F4744]">
                <Truck size={14} className="text-[#5F7A5B]" />
                Fast Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}