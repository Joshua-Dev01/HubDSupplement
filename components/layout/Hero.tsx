'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ShieldCheck, Brain, ChevronDown, Leaf, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { formatNaira } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'
import Categories from './Categories'
import BestSellers from './BestSellers'
import Perks from './Perks'
import Testimonials from './Testimonials'
import Newsletter from './Newsletter'
import { SITE } from '@/lib/constants'
import LeafSpinner from '../ui/Leafspinner'

const STATS = [
  { value: '100%', label: 'Verified Provenance' },
  { value: '24–48h', label: 'Express Dispatch' },
  { value: '60-Day', label: 'Wellness Promise' },
]

export default function Hero() {
  const [featured, setFeatured] = useState<Product | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function fetchFeatured() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      setFeatured((data ?? null) as Product | null)
    }

    fetchFeatured()
  }, [])

  async function handleQuickAdd() {
    if (!featured) return
    setAddingToCart(true)
    try {
      const result = await addItem(featured.id)

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
      setAddingToCart(false)
    }
  }

  return (
    <>
      <section className="w-full pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="relative max-w-7xl mx-auto rounded-[2rem] overflow-hidden min-h-[560px] sm:min-h-[600px] md:min-h-[640px] flex items-center">
          {/* Background photo */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero.png')" }}
          />
          {/* Dark brand-green gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2421]/90 via-[#1F2421]/60 to-[#1F2421]/20" />

          <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 py-10">
            {/* Top-right floating badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden md:flex absolute top-8 right-10 items-center gap-2 bg-white rounded-full shadow-lg px-4 py-2.5"
            >
              <Brain size={14} className="text-[#5F7A5B]" />
              <span className="text-xs font-medium text-[#1F2421]">Backed by science</span>
            </motion.div>

            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium px-4 py-2 rounded-full mb-5">
                <ShieldCheck size={13} className="text-[#8FBF87]" />
                NAFDAC Regulated &bull; 100% Authentic Quality
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white mb-4 sm:mb-5">
                {SITE.tagline}
              </h1>

              <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-7 max-w-md">
                Genuine medications and wellness essentials, verified for
                potency and sourced only from licensed, certified
                manufacturers. Every batch is cataloged, tested, and
                cold-chain inspected before it reaches you.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#1F2421] px-6 py-3.5 rounded-full text-sm font-semibold transition-colors"
                >
                  Choose a Product
                  <ChevronDown size={15} />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white px-6 py-3.5 rounded-full text-sm font-medium transition-colors"
                >
                  <Leaf size={14} />
                  Clinical Standards
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2.5"
                  >
                    <p className="text-sm font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating featured-product card */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block absolute bottom-10 right-10 bg-white rounded-2xl shadow-2xl p-4 w-72"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-widest text-[#8A928E] font-medium">
                  Featured Essential &bull; {featured.in_stock === false ? 'Sold Out' : 'In Stock'}
                </span>
                <span className="text-[10px] font-semibold text-[#5F7A5B] bg-[#EFEDE6] px-2 py-0.5 rounded-full">
                  Grade A
                </span>
              </div>

              <div className="flex gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#EFEDE6] shrink-0">
                  {featured.images?.[0] && (
                    <img src={featured.images[0]} alt={featured.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[#1F2421] truncate">{featured.name}</h3>
                  <p className="text-xs text-[#8A928E] line-clamp-2 leading-snug">
                    {featured.description ?? 'Verified, science-backed formulation.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-base font-bold text-[#1F2421]">{formatNaira(featured.price)}</p>
                  <p className="text-[10px] text-[#8A928E]">Fast Nationwide Delivery</p>
                </div>
                <button
                  onClick={handleQuickAdd}
                  disabled={addingToCart || featured.in_stock === false}
                  className="flex items-center gap-1.5 bg-[#5F7A5B] hover:bg-[#4F6A4B] disabled:opacity-50 text-white text-xs font-medium px-4 py-2.5 rounded-full transition-colors"
                >
                  {addingToCart ? <LeafSpinner size={13} /> : <ShoppingCart size={13} />}
                  Add
                </button>
              </div>

              <span className="inline-flex items-center gap-1.5 bg-[#EFEDE6] text-[#3F5C42] text-[10px] font-medium px-3 py-1.5 rounded-full">
                <Leaf size={11} />
                Pure Botanical &amp; Pharmaceutical Grade
              </span>
            </motion.div>
          )}
        </div>
      </section>

      <Categories />
      <BestSellers />
      <Perks />
      <Testimonials />
      <Newsletter />
    </>
  )
}