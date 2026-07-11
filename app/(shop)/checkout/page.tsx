'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Minus, Plus, Trash2, ShieldCheck, Truck, RotateCcw, Award, ArrowRight, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatNaira } from '@/lib/utils'
import { loadPaystackScript } from '@/lib/paystack'
import { createOrder } from '@/actions/orders'

function generateReference() {
  return `HD_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
}

const TAX_RATE = 0.075

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara',
]

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, authUserEmail, init } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    fullName: '',
    email: authUserEmail ?? '',
    phone: '',
    address: '',
    city: '',
    state: '',
  })

  function updateForm(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = 0
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  function handleApplyPromo() {
    if (!promoCode.trim()) return
    toast.error('Invalid promo code')
  }

  function validateForm() {
    if (!form.fullName.trim()) return 'Please enter your full name'
    if (!form.email.trim() || !form.email.includes('@')) return 'Please enter a valid email'
    if (!form.phone.trim()) return 'Please enter your phone number'
    if (!form.address.trim()) return 'Please enter your delivery address'
    if (!form.city.trim()) return 'Please enter your city'
    if (!form.state.trim()) return 'Please select your state'
    return null
  }

  async function handleCheckout() {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError)
      return
    }

    setProcessing(true)

    try {
      await loadPaystackScript()

      const reference = generateReference()

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: form.email,
        amount: Math.round(total * 100),
        currency: 'NGN',
        ref: reference,
        callback: (response) => {
          createOrder({
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            subtotal,
            shipping,
            tax,
            total,
            paymentReference: response.reference,
          }).then((result) => {
            if ('error' in result && result.error) {
              toast.error(result.error)
              setProcessing(false)
              return
            }
            toast.success('Payment successful!')
            init()
            router.push(`/order-confirmation/${result.orderId}`)
          })
        },
        onClose: () => {
          setProcessing(false)
          toast.error('Checkout cancelled')
        },
      })

      handler.openIframe()
    } catch (err) {
      console.error('Checkout error:', err)
      toast.error('Something went wrong starting checkout')
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 text-center bg-[#F7F5F0] min-h-screen">
        <p className="text-sm text-[#8A928E] mb-4">Your cart is empty</p>
        <Link href="/shop" className="text-sm font-medium text-[#5F7A5B] underline">Start shopping</Link>
      </div>
    )
  }

  const inputClass = "w-full bg-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5F7A5B] transition-colors"

  return (
    <div className="bg-[#F7F5F0] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#1F2421]  mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Cart items */}
            <div>
              <h2 className="text-xl font-bold text-[#1F2421] mb-4">Your Selection</h2>
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-5 py-6 border-b border-black/10">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#EFEDE6] shrink-0">
                    {item.product.images?.[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1F2421]">{item.product.name}</h3>
                  </div>
                  <p className="font-bold text-[#1F2421] w-24 text-right shrink-0">
                    {formatNaira(item.product.price)}
                  </p>
                  <div className="flex items-center border border-black/10 rounded-full shrink-0">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 text-[#8A928E] hover:text-[#1F2421] transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-medium text-[#1F2421]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 text-[#8A928E] hover:text-[#1F2421] transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="flex items-center gap-1.5 text-xs text-[#8A928E] hover:text-red-500 transition-colors shrink-0">
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Customer details form */}
            <div>
              <h2 className="text-xl font-bold text-[#1F2421] mb-4">Delivery Details</h2>
              <div className=" rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Full Name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => updateForm('fullName', e.target.value)}
                    placeholder="Your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="080X XXX XXXX"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Delivery Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    placeholder="Street address"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">City</label>
                  <input
                    value={form.city}
                    onChange={(e) => updateForm('city', e.target.value)}
                    placeholder="City"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">State</label>
                  <select
                    value={form.state}
                    onChange={(e) => updateForm('state', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select state</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Shipping method */}
            <div>
              <h2 className="text-xl font-bold text-[#1F2421] mb-4">Shipping Method</h2>
              <div className="bg-[#EFEDE6] border border-[#5F7A5B]/30 rounded-2xl px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1F2421]">Standard Delivery</p>
                  <p className="text-xs text-[#8A928E]">3–5 Business Days</p>
                </div>
                <span className="font-semibold text-[#5F7A5B]">Free</span>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#1F2421] mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm border-b border-black/10 pb-6">
              <div className="flex justify-between text-[#8A928E]">
                <span>Subtotal</span>
                <span className="text-[#1F2421] font-medium">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#8A928E]">
                <span>Shipping</span>
                <span className="text-[#1F2421] font-medium">Free</span>
              </div>
              <div className="flex justify-between text-[#8A928E]">
                <span>Estimated Tax</span>
                <span className="text-[#1F2421] font-medium">{formatNaira(tax)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline py-6">
              <span className="text-lg font-bold text-[#1F2421]">Total</span>
              <span className="text-2xl font-bold text-[#1F2421]">{formatNaira(total)}</span>
            </div>

            <div className="mb-4">
              <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-2 block">Promo Code</label>
              <div className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 border border-black/10 rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#5F7A5B] transition-colors"
                />
                <button onClick={handleApplyPromo} className="bg-[#5F7A5B] hover:bg-[#4F6A4B] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 bg-[#1F2421] hover:bg-[#2E3634] disabled:opacity-50 text-white font-medium py-4 rounded-full transition-colors mb-4"
            >
              {processing ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  Pay Now
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="bg-[#EFEDE6] rounded-lg px-4 py-2 flex items-center gap-2">
                <span className="text-sm font-bold text-[#00C3F7]">Pay</span>
                <span className="text-sm font-bold text-[#1F2421]">stack</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-[#3F4744]">
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#5F7A5B]" />Secure Checkout</div>
              <div className="flex items-center gap-2"><Award size={14} className="text-[#5F7A5B]" />Licensed Pharmacy</div>
              <div className="flex items-center gap-2"><Truck size={14} className="text-[#5F7A5B]" />Fast Delivery</div>
              <div className="flex items-center gap-2"><RotateCcw size={14} className="text-[#5F7A5B]" />Easy Returns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}