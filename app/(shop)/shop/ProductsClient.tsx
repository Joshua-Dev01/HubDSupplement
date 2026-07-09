'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'

const categories = [
  'All', 'Shirts', 'Polos', 'Skirts', 'Trousers', 'Knitwear', 'Outerwear', 'Dresses', 'Accessories'
]

type Product = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  images: string[]
  is_new: boolean
  in_stock: boolean
}

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const image = product.images?.[0] ?? 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80'

  return (
    <Link href={`/products/${product.slug}`} className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {product.is_new && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 tracking-widest uppercase">
            New
          </span>
        )}

        {!product.in_stock && (
          <span className="absolute top-3 right-3 bg-gray-400 text-white text-xs px-2 py-1 tracking-widest uppercase">
            Sold Out
          </span>
        )}

        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-0 left-0 right-0 py-3 text-xs tracking-widest uppercase font-medium transition-all duration-300 translate-y-full group-hover:translate-y-0 ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {added ? '✓ Added' : 'Quick Add'}
        </button>
      </div>

      <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
        {product.category}
      </p>
      <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-400 transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-blue-600 font-medium">
        ${product.price.toFixed(2)}
      </p>
    </Link>
  )
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-6 pt-14">

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gray-200 pb-6 gap-6">
        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs uppercase tracking-widest pb-1 border-b transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-black font-bold border-black'
                  : 'text-gray-400 border-transparent hover:text-black hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <p className="text-xs text-gray-400 tracking-widest uppercase">
            {sorted.length} items
          </p>
          <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-700 hover:text-black transition-colors border border-gray-200 px-3 py-2">
            <SlidersHorizontal size={14} />
            Filter
          </button>
          <select
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs uppercase tracking-widest text-gray-700 border border-gray-200 px-3 py-2 outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm uppercase tracking-widest">
            No products found in this category
          </p>
        </div>
      )}

      {/* Load More */}
      <div className="mt-20 flex flex-col items-center gap-6">
        <p className="text-xs text-gray-400 italic">
          Showing {sorted.length} of {products.length} products
        </p>
        <div className="w-48 h-px bg-gray-200 relative">
          <div
            className="absolute left-0 top-0 h-full bg-black transition-all duration-1000"
            style={{ width: `${(sorted.length / products.length) * 100}%` }}
          />
        </div>
        <button className="px-12 py-4 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 bg-white">
          Load More
        </button>
      </div>

    </div>
  )
}