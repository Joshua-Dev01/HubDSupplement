'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Sparkles, Brain, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { formatNaira } from '@/lib/utils'
import type { Product } from '@/types/product'
import Categories from './Categories'
import BestSellers from './BestSellers'
import Perks from './Perks'
import Testimonials from './Testimonials'
import Newsletter from './Newsletter'
import { SITE } from '@/lib/constants'

export default function Hero() {
  const [featured, setFeatured] = useState<Product | null>(null)

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

  return (
    <>
      <section className="relative w-full overflow-hidden pt-24 sm:pt-32 md:pt-36 pb-12 sm:pb-20 md:pb-24">
        {/* Soft diagonal mint gradient, matching the brand green */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F7F5F0] via-[#F3F7F1] to-[#DCEEE0]" />
        <div className="absolute -right-24 sm:-right-40 -top-20 w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] rounded-full bg-[#5F7A5B]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left — copy */}
          <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
            <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm text-[#5F7A5B] mb-4 sm:mb-6">
              <Sparkles size={16} className="sm:hidden" />
              <Sparkles size={18} className="hidden sm:block" />
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] sm:leading-[1.05] text-[#1F2421] mb-4 sm:mb-5">
              {SITE.tagline}
            </h1>

            <p className="text-sm sm:text-base text-[#3F4744]/80 leading-relaxed mb-6 sm:mb-8 max-w-sm mx-auto md:mx-0">
              {SITE.description}
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#5F7A5B] hover:bg-[#4F6A4B] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-[#5F7A5B]/20"
            >
              Choose a Product
            </Link>
          </div>

          {/* Right — product image with floating badge cards */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[460px] flex items-center justify-center mt-4 md:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-44 sm:w-60 md:w-64 lg:w-72 aspect-[3/4] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img src="/images/vitamin.png" className="object-cover w-full h-full" alt={featured?.name ?? 'Featured product'} />
            </motion.div>

            {featured?.category && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-2 sm:top-6 left-0 sm:left-4 bg-white rounded-xl sm:rounded-2xl shadow-lg px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2"
              >
                <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[#5F7A5B] shrink-0">
                  <ShieldCheck size={11} className="sm:hidden" />
                  <ShieldCheck size={14} className="hidden sm:block" />
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-[#1F2421] capitalize whitespace-nowrap">
                  {featured.category.replace('-', ' ')}
                </span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute bottom-8 sm:bottom-10 right-0 sm:right-2 bg-white rounded-xl sm:rounded-2xl shadow-lg px-2.5 sm:px-4 py-1.5 sm:py-2.5 flex items-center gap-1.5 sm:gap-2"
            >
              <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[#5F7A5B] shrink-0">
                <Brain size={11} className="sm:hidden" />
                <Brain size={14} className="hidden sm:block" />
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-[#1F2421] whitespace-nowrap">Backed by science</span>
            </motion.div>

            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute bottom-0 left-0 sm:left-8 bg-[#1F2421] text-white rounded-xl sm:rounded-2xl shadow-lg px-2.5 sm:px-4 py-1.5 sm:py-2.5"
              >
                <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-white/60 mb-0.5">Featured</p>
                <p className="text-[10px] sm:text-xs font-semibold whitespace-nowrap">{formatNaira(featured.price)}</p>
              </motion.div>
            )}
          </div>
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