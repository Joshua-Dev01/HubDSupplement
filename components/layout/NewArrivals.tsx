'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const products = [
  {
    id: 1,
    category: 'Shirts',
    name: 'Structured Linen Shirt',
    price: 120,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80',
    slug: 'structured-linen-shirt',
  },
  {
    id: 2,
    category: 'Denim',
    name: 'Raw Selvedge Denim',
    price: 185,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    slug: 'raw-selvedge-denim',
  },
  {
    id: 3,
    category: 'Outerwear',
    name: 'Matte Technical Parka',
    price: 340,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    slug: 'matte-technical-parka',
  },
  {
    id: 4,
    category: 'Footwear',
    name: 'Essential Leather Sneaker',
    price: 210,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    slug: 'essential-leather-sneaker',
  },
]

function ProductCard({ product }: { product: typeof products[0] }) {
  const [added, setAdded] = useState(false)

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">

      {/* Image */}
      <div className="relative w-full h-72 overflow-hidden bg-gray-100 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className={`absolute bottom-0 left-0 right-0 py-3 cursor-pointer text-xs tracking-widest uppercase font-medium transition-all duration-300 translate-y-full group-hover:translate-y-0 ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          {added ? '✓ Added' : 'Quick Add'}
        </button>
      </div>

      {/* Info */}
      <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">
        {product.category}
      </p>
      <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-500 transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-gray-900">
        ${product.price.toFixed(2)}
      </p>

    </Link>
  )
}

export default function NewArrivals() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">
            The Latest
          </p>
          <h2 className="text-2xl font-black tracking-wide uppercase text-gray-900">
            New Arrivals
          </h2>
        </div>
        <Link
          href="/new-arrivals"
          className="text-xs tracking-widest uppercase text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  )
}