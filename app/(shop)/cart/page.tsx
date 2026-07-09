'use client'

import Image from 'next/image'
import { Trash2, Plus, Minus, ShieldCheck, Award, Truck, RefreshCw } from 'lucide-react'
import { useState } from 'react'

type CartItem = {
  id: string
  name: string
  ref: string
  price: number
  size: string
  colorName: string
  colorHex: string
  quantity: number
  image: string
}

export default function CartClient() {
  // Mock state populated to perfectly mimic CnP_08062026_151316.png
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Structured Wool Blazer',
      ref: '9928/012',
      price: 495.00,
      size: 'M',
      colorName: 'Charcoal',
      colorHex: '#374151',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80',
    },
    {
      id: '2',
      name: 'Monochrome Runner',
      ref: '4410/500',
      price: 180.00,
      size: '42',
      colorName: 'Optic White',
      colorHex: '#ffffff',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80',
    }
  ])

  const [promoCode, setPromoCode] = useState('')

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta
        return nextQty > 0 ? { ...item, quantity: nextQty } : item
      }
      return item
    }))
  }

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  // Exact math computations matching the layout references
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingEstimate = 0 // FREE
  const tax = 0.00
  const total = subtotal + shippingEstimate + tax

  return (
    <div className="bg-neutral-50/50 min-h-screen pt-32 pb-24 selection:bg-neutral-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-wide text-neutral-900 uppercase">
            Your Cart
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-light tracking-wide">
            {cartItems.length} items in your selection
          </p>
        </div>

        {/* Main Interface Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-neutral-200/80 p-6 flex gap-6 relative"
              >
                {/* Product Frame Image Box */}
                <div className="relative w-36 h-44 bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover object-center contrast-[1.02]"
                  />
                </div>

                {/* Information Column Area */}
                <div className="flex flex-col justify-between flex-grow py-1">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-medium text-neutral-900 tracking-wide">
                        {item.name}
                      </h3>
                      <p className="text-lg font-medium text-neutral-900 tracking-tight">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                      Ref. {item.ref}
                    </p>

                    {/* Variant Specifics Metadata Frame */}
                    <div className="flex items-center gap-8 mt-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-medium mb-1">Size</span>
                        <div className="border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 min-w-[32px] text-center bg-white">
                          {item.size}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-medium mb-1">Color</span>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-light py-1">
                          <span 
                            className="w-3 h-3 rounded-full border border-neutral-300 inline-block shadow-sm"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Actions & Remove Option footer rows inside product context */}
                  <div className="flex justify-between items-end mt-4">
                    {/* Stepper Frame */}
                    <div className="flex items-center border border-neutral-200 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                        aria-label="Decrease Quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-xs font-medium text-neutral-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                        aria-label="Increase Quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Delete Item Handle Trigger */}
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-400 hover:text-red-500 transition-colors font-medium py-1"
                    >
                      <Trash2 size={13} strokeWidth={1.8} className="text-neutral-400 transition-colors group-hover:text-red-500" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cartItems.length === 0 && (
              <div className="bg-white border border-neutral-200 py-20 text-center">
                <p className="text-xs uppercase tracking-widest text-neutral-400">Your selection is currently empty</p>
              </div>
            )}
          </div>

          {/* Right Column Side Panel: Checkout summary aggregates */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Box Module Area 1: Summary calculation table layout */}
            <div className="bg-white border border-neutral-200/80 p-6">
              <h2 className="text-lg font-medium text-neutral-900 tracking-wide mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 border-b border-neutral-100 pb-6">
                <div className="flex justify-between text-xs tracking-wide text-neutral-500 font-light">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs tracking-wide text-neutral-500 font-light">
                  <span>Shipping Estimate</span>
                  <span className="text-blue-600 uppercase font-semibold text-[10px] tracking-wider">
                    {shippingEstimate === 0 ? 'Free' : `$${shippingEstimate.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs tracking-wide text-neutral-500 font-light">
                  <span>Tax</span>
                  <span className="font-medium text-neutral-800">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Grand Aggregate Total Display Box Row */}
              <div className="flex justify-between items-baseline py-6">
                <span className="text-sm font-medium tracking-wide text-neutral-900">Total</span>
                <span className="text-xl font-bold tracking-tight text-neutral-900">${total.toFixed(2)}</span>
              </div>

              {/* Promotion Code Field Container Section */}
              <div className="mb-6">
                <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-neutral-400 block mb-1.5">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="border border-neutral-200 text-xs tracking-wide px-3 py-2.5 flex-grow focus:outline-none focus:border-neutral-900 transition-colors placeholder:text-neutral-300 font-light"
                  />
                  <button className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 hover:bg-neutral-800 transition-all duration-300">
                    Apply
                  </button>
                </div>
              </div>

              {/* CTA Primary Action Route Trigger to stripe/payment processor checkout */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold tracking-[0.2em] uppercase py-4 shadow-lg shadow-blue-600/10 transition-all duration-300 hover:shadow-xl">
                Proceed To Checkout
              </button>

              <p className="text-[9px] text-center uppercase text-neutral-400 font-medium tracking-widest leading-relaxed mt-4 px-2">
                Tax included. Shipping and discounts calculated at checkout.
              </p>
            </div>

            {/* Box Module Area 2: Assurances Trust grid badges */}
            <div className="bg-white border border-neutral-200/80 p-5 grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                <ShieldCheck size={14} strokeWidth={2} className="text-neutral-500" />
                Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                <Award size={14} strokeWidth={2} className="text-neutral-500" />
                Premium Quality
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                <Truck size={14} strokeWidth={2} className="text-neutral-500" />
                Carbon Neutral
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                <RefreshCw size={13} strokeWidth={2} className="text-neutral-500" />
                30-Day Returns
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}