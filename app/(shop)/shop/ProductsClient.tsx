'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { SlidersHorizontal, ShoppingBag, Loader2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'

const TABS = ['All', ...CATEGORIES.map((c) => c.label)]
const LABEL_TO_VALUE: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.label, c.value])
)

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  async function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await addItem(product.id)
    setLoading(false)

    if (result.error === 'not_authenticated') {
      toast.error('Please log in to add items to your cart')
      router.push('/login')
      return
    }
    if (result.error) {
      toast.error(result.error)
      return
    }

    setAdded(true)
    toast.success('Added to cart')
    setTimeout(() => setAdded(false), 1500)
  }

  const image = product.images?.[0] ?? 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80'

  return (
    <Link href={`/products/${product.slug}`} className="group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEDE6] rounded-2xl mb-3">
        <Image src={image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />

        {product.is_new && (
          <span className="absolute top-3 left-3 bg-[#1F2421] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">New</span>
        )}
        {!product.in_stock && (
          <span className="absolute top-3 right-3 bg-gray-400 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">Sold Out</span>
        )}

        <button
          onClick={handleQuickAdd}
          disabled={loading || !product.in_stock}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
            added ? 'bg-green-600 text-white' : 'bg-white text-[#1F2421] hover:bg-[#5F7A5B] hover:text-white'
          }`}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingBag size={14} />}
        </button>
      </div>

      <p className="text-[11px] uppercase tracking-widest text-[#8A928E] mb-1">{product.category}</p>
      <h3 className="text-sm font-semibold text-[#1F2421] mb-1 group-hover:text-[#5F7A5B] transition-colors">{product.name}</h3>
      <p className="text-sm font-bold text-[#1F2421]">${product.price.toFixed(2)}</p>
    </Link>
  )
}

export default function ProductsClient({
  products,
  initialCategory = 'All',
}: {
  products: Product[]
  initialCategory?: string
}) {
  const startLabel = CATEGORIES.find((c) => c.value === initialCategory)?.label ?? initialCategory ?? 'All'
  const [activeTab, setActiveTab] = useState(startLabel)
  const [sortBy, setSortBy] = useState('featured')

  const filtered = activeTab === 'All' ? products : products.filter((p) => p.category === LABEL_TO_VALUE[activeTab])
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-black/10 pb-6 gap-6">
        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs uppercase tracking-widest pb-1 border-b transition-all ${
                activeTab === tab ? 'text-[#1F2421] font-bold border-[#1F2421]' : 'text-[#8A928E] border-transparent hover:text-[#1F2421] hover:border-[#8A928E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <p className="text-xs text-[#8A928E] tracking-widest uppercase">{sorted.length} items</p>
          <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#3F4744] hover:text-[#1F2421] transition-colors border border-black/10 px-3 py-2 rounded-full">
            <SlidersHorizontal size={14} />
            Filter
          </button>
          <select
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs uppercase tracking-widest text-[#3F4744] border border-black/10 px-3 py-2 rounded-full outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {sorted.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#8A928E] text-sm uppercase tracking-widest">No products found in this category</p>
        </div>
      )}
    </div>
  )
}