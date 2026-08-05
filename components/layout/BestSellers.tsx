'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cartStore'
import { formatNaira } from '@/lib/utils'
import type { Product } from '@/types/product'
import { FaCartPlus } from 'react-icons/fa'

const VISIBLE_COUNT = 4

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(12)

      if (error) {
        console.error('BestSellers fetch error:', error.message)
        setLoading(false)
        return
      }

      setProducts((data ?? []) as Product[])
      setLoading(false)
    }

    fetchProducts()

    // Live updates — any insert/update/delete on products reflects here
    // immediately without needing a page refresh.
    const channel = supabase
      .channel('best-sellers-products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          fetchProducts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleAddToCart(productId: string) {
    setAddingId(productId)
    try {
      const result = await addItem(productId)

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
      setAddingId(null)
    }
  }

  const visibleProducts = products.slice(startIndex, startIndex + VISIBLE_COUNT)
  const canGoBack = startIndex > 0
  const canGoForward = startIndex + VISIBLE_COUNT < products.length

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-center py-20 text-[#8A928E]">
          <Loader2 size={20} className="animate-spin" />
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2421]">Patient Favorites</h2>
          <p className="text-sm text-[#8A928E] mt-1">The most trusted foundations for your daily ritual.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-sm font-medium text-[#5F7A5B] hover:text-[#4F6A4B] transition-colors"
          >
            View All
            <ArrowRight size={14} />
          </Link>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => setStartIndex((i) => Math.max(0, i - VISIBLE_COUNT))}
              disabled={!canGoBack}
              className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#EFEDE6] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setStartIndex((i) => (canGoForward ? i + VISIBLE_COUNT : i))}
              disabled={!canGoForward}
              className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#EFEDE6] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {visibleProducts.map((p) => {
          const image = p.images?.[0] ?? 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80'
          const isAdding = addingId === p.id

          return (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-black/5">
              <Link href={`/products/${p.slug}`} className="relative block aspect-[4/3] bg-[#EFEDE6]">
                <Image src={image} alt={p.name} fill className="object-cover" />
                {p.is_new && (
                  <span className="absolute top-3 left-3 bg-[#1F2421] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </Link>
              <div className="p-5">
                <p className="text-[11px] uppercase tracking-widest text-[#8A928E] mb-1">{p.category}</p>
                <h3 className="font-semibold text-[#1F2421] mb-1">{p.name}</h3>
                <p className="text-xs text-[#8A928E] leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F2421]">{formatNaira(p.price)}</span>
                  <button
                    onClick={() => handleAddToCart(p.id)}
                    disabled={isAdding}
                    className="w-9 h-9 rounded-full bg-[#F7F5F0] flex cursor-pointer items-center justify-center hover:bg-[#5F7A5B] hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isAdding ? <Loader2 size={14} className="animate-spin" /> : <FaCartPlus size={14} />}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}