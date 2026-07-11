'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Star, ShoppingCart, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'

export default function ProductDetailClient({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80',
  ]
  const [activeImage, setActiveImage] = useState(0)
  const [plan, setPlan] = useState<'subscribe' | 'onetime'>('subscribe')
  const [loading, setLoading] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  const rating = product.rating ?? 4.8
  const reviewCount = product.review_count ?? 0
  const supplyDays = product.supply_days ?? 30
  const discountPct = product.subscription_discount_pct ?? 15
  const subscribePrice = product.price * (1 - discountPct / 100)
  const isSoldOut = product.in_stock === false

  async function handleAddToCart() {
    setLoading(true)
    try {
      const result = await addItem(product.id)

      if (result.error === 'not_authenticated') {
        toast.error('Please log in to add items to your cart')
        router.push('/login')
        return
      }
      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Added to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
      {/* Left — Image gallery */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActiveImage(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden bg-[#EFEDE6] border-2 transition-colors ${
                activeImage === i ? 'border-[#5F7A5B]' : 'border-transparent'
              }`}
            >
              <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>

        <div className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-[#EFEDE6]">
          <Image
            src={images[activeImage]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {product.is_new && (
            <span className="absolute top-4 left-4 bg-[#1F2421] text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
              Best Seller
            </span>
          )}
          {isSoldOut && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <p className="text-xs uppercase tracking-widest font-bold text-[#8A928E]">Sold Out</p>
            </div>
          )}
        </div>
      </div>

      {/* Right — Info */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1F2421] mb-3">{product.name}</h1>

        <div className="flex items-center gap-2 mb-5">
          <div className="flex text-[#5F7A5B]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-sm font-medium text-[#1F2421]">{rating}</span>
          {reviewCount > 0 && (
            <span className="text-sm text-[#8A928E]">({reviewCount.toLocaleString()} Reviews)</span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-[#1F2421]">${product.price.toFixed(2)}</span>
          <span className="text-sm text-[#8A928E]">/ {supplyDays}-Day Supply</span>
        </div>

        {product.description && (
          <p className="text-sm text-[#3F4744] leading-relaxed mb-8 max-w-md">{product.description}</p>
        )}

        {/* Subscription toggle */}
        <div className="border border-black/10 rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-3 bg-[#EFEDE6] text-xs font-medium text-[#1F2421]">
            <span>Subscription</span>
            <span className="text-[#5F7A5B]">Save {discountPct}%</span>
          </div>

          <label className="flex items-center justify-between px-5 py-4 border-b border-black/5 cursor-pointer hover:bg-[#F7F5F0] transition-colors">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={plan === 'subscribe'}
                onChange={() => setPlan('subscribe')}
                className="accent-[#5F7A5B] w-4 h-4"
              />
              <div>
                <p className="text-sm font-medium text-[#1F2421]">Subscribe & Save</p>
                <p className="text-xs text-[#8A928E]">Delivered every {supplyDays} days. Cancel anytime.</p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#1F2421]">${subscribePrice.toFixed(2)}</span>
          </label>

          <label className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-[#F7F5F0] transition-colors">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={plan === 'onetime'}
                onChange={() => setPlan('onetime')}
                className="accent-[#5F7A5B] w-4 h-4"
              />
              <p className="text-sm font-medium text-[#1F2421]">One-time Purchase</p>
            </div>
            <span className="text-sm font-bold text-[#1F2421]">${product.price.toFixed(2)}</span>
          </label>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={loading || isSoldOut}
          className="flex items-center justify-center cursor-pointer gap-2 bg-[#5F7A5B] hover:bg-[#4F6A4B] disabled:opacity-50 text-white font-medium py-4 rounded-full transition-colors mb-3"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
          {isSoldOut ? 'Sold Out' : 'Add to Cart'}
        </button>

        <p className="text-xs text-[#8A928E] text-center">
          Free shipping on orders over $75
        </p>
      </div>
    </div>
  )
}