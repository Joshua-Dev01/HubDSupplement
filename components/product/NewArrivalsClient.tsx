'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Heart, ArrowUpRight } from 'lucide-react'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  description: string
  images: string[]
  is_new: boolean
  in_stock: boolean
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
]

export default function NewArrivalsClient({ products }: { products: Product[] }) {
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({})

  function toggleWishlist(e: React.MouseEvent, id: string, name: string) {
    e.preventDefault()
    setWishlisted(prev => {
      const next = { ...prev, [id]: !prev[id] }
      toast.success(next[id] ? `${name} added to wishlist` : `${name} removed from wishlist`)
      return next
    })
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-light">
          No new arrivals yet — check back soon.
        </p>
      </div>
    )
  }

  const [hero, second, third, ...rest] = products

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 bg-white selection:bg-neutral-900 selection:text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-100 pb-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold block mb-3">
            Latest Drop — {products.length} pieces
          </span>
          <h2 className="text-3xl md:text-4xl font-extralight tracking-tight text-neutral-900 uppercase">
            New <span className="font-serif italic text-neutral-500">Arrivals</span>
          </h2>
        </div>
        <p className="text-xs text-neutral-500 max-w-xs font-light leading-relaxed">
          Curated silhouettes designed with precision, blending timeless architectural lines with ultimate modern utility.
        </p>
      </div>

      {/* --- EDITORIAL HERO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        
        {/* Hero Product - Left Box */}
        {hero && (
          <Link
            href={`/products/${hero.slug}`}
            className="md:col-span-7 lg:col-span-8 group relative overflow-hidden bg-neutral-50 aspect-[4/5] md:aspect-auto md:h-[680px] block"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={hero.images?.[0] ?? FALLBACK_IMAGES[0]}
                alt={hero.name}
                fill
                priority
                className="object-cover object-center transition-transform duration-[1600ms] ease-out scale-[1.01] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-700 opacity-90 group-hover:opacity-100" />
            </div>

            <span className="absolute top-6 left-6 z-10 backdrop-blur-md bg-white/90 text-neutral-900 text-[10px] tracking-[0.2em] uppercase font-medium px-3 py-1.5 shadow-sm">
              New Drop
            </span>

            <button
              onClick={(e) => toggleWishlist(e, hero.id, hero.name)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full backdrop-blur-md bg-white/40 hover:bg-white flex items-center justify-center transition-all duration-300 border border-white/20 group/btn shadow-sm"
            >
              <Heart
                size={15}
                fill={wishlisted[hero.id] ? '#ef4444' : 'none'}
                className={`transition-colors duration-300 ${wishlisted[hero.id] ? 'text-red-500' : 'text-neutral-900 group-hover/btn:scale-110'}`}
              />
            </button>

            {/* Premium Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-white flex flex-col justify-end h-1/2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-medium mb-2 block">
                {hero.category}
              </span>
              <h3 className="text-2xl md:text-4xl font-light tracking-wide uppercase mb-2 max-w-xl leading-tight">
                {hero.name}
              </h3>
              <p className="text-lg font-light text-neutral-200 mb-6">
                ${hero.price.toFixed(2)}
              </p>
              <div className="overflow-hidden h-5">
                <span className="text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 transition-transform duration-500 ease-out translate-y-0 group-hover:-translate-y-[120%]">
                  Discover Piece <ArrowUpRight size={14} />
                </span>
                <span className="text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 transition-transform duration-500 ease-out translate-y-full group-hover:-translate-y-5 text-neutral-300">
                  Shop Silhouette <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Second Product - Right Column Tall Box */}
        {second && (
          <Link
            href={`/products/${second.slug}`}
            className="md:col-span-5 lg:col-span-4 group relative overflow-hidden bg-neutral-50 aspect-[4/5] md:aspect-auto md:h-[680px] block"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={second.images?.[0] ?? FALLBACK_IMAGES[1]}
                alt={second.name}
                fill
                className="object-cover object-center transition-transform duration-[1600ms] ease-out scale-[1.01] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-700 opacity-90" />
            </div>

            <button
              onClick={(e) => toggleWishlist(e, second.id, second.name)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full backdrop-blur-md bg-white/40 hover:bg-white flex items-center justify-center transition-all duration-300 border border-white/20 group/btn"
            >
              <Heart
                size={15}
                fill={wishlisted[second.id] ? '#ef4444' : 'none'}
                className={wishlisted[second.id] ? 'text-red-500' : 'text-neutral-900 group-hover/btn:scale-110'}
              />
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-white">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 font-medium mb-2 block">
                {second.category}
              </span>
              <h3 className="text-xl md:text-2xl font-light tracking-wide uppercase mb-1.5">
                {second.name}
              </h3>
              <p className="text-base font-light text-neutral-200 mb-5">
                ${second.price.toFixed(2)}
              </p>
              <div className="overflow-hidden h-5">
                <span className="text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 transition-transform duration-500 ease-out translate-y-0 group-hover:-translate-y-[120%]">
                  View Detail <ArrowUpRight size={14} />
                </span>
                <span className="text-xs uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 transition-transform duration-500 ease-out translate-y-full group-hover:-translate-y-5 text-neutral-300">
                  Shop Collection <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* --- THREE-COLUMN EDITORIAL BLOCK --- */}
      {(third || rest.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[third, ...rest].filter(Boolean).slice(0, 3).map((product, i) => (
            <Link
              key={product!.id}
              href={`/products/${product!.slug}`}
              className="group relative overflow-hidden bg-neutral-50 aspect-[3/4] block"
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={product!.images?.[0] ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                  alt={product!.name}
                  fill
                  className="object-cover object-center transition-transform duration-[1400ms] ease-out scale-[1.01] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <button
                onClick={(e) => toggleWishlist(e, product!.id, product!.name)}
                className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full backdrop-blur-md bg-white/40 hover:bg-white flex items-center justify-center transition-all duration-300 border border-white/20"
              >
                <Heart
                  size={14}
                  fill={wishlisted[product!.id] ? '#ef4444' : 'none'}
                  className={wishlisted[product!.id] ? 'text-red-500' : 'text-neutral-900'}
                />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-300 font-medium mb-1.5 block">
                  {product!.category}
                </span>
                <h3 className="text-lg font-light tracking-wide uppercase mb-1">
                  {product!.name}
                </h3>
                <p className="text-sm font-light text-neutral-200">
                  ${product!.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* --- STANDARD GRID (MORE PRODUCTS) --- */}
      {rest.length > 3 && (
        <>
          <div className="flex items-center gap-4 mb-12 border-t border-neutral-100 pt-16">
            <h4 className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-semibold">
              More Architectural Finishes
            </h4>
            <div className="h-[1px] bg-neutral-200 flex-grow" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {rest.slice(3).map((product, i) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group flex flex-col block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-4">
                  <Image
                    src={product.images?.[0] ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-103"
                  />
                  
                  <button
                    onClick={(e) => toggleWishlist(e, product.id, product.name)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full backdrop-blur-sm bg-white/60 hover:bg-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
                  >
                    <Heart
                      size={13}
                      fill={wishlisted[product.id] ? '#ef4444' : 'none'}
                      className={wishlisted[product.id] ? 'text-red-500' : 'text-neutral-900'}
                    />
                  </button>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-medium">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-normal text-neutral-800 tracking-wide transition-colors duration-300 group-hover:text-neutral-500">
                    {product.name}
                  </h3>
                  <p className="text-sm font-light text-neutral-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* --- FOOTER CTA --- */}
      <div className="mt-32 border-t border-neutral-100 pt-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-semibold mb-2">
            In the know
          </p>
          <h3 className="text-xl font-light uppercase tracking-wide text-neutral-900">
            Subscribe for <span className="font-serif italic text-neutral-500">priority releases</span>
          </h3>
        </div>
        <Link
          href="/products"
          className="relative inline-flex items-center justify-center px-12 py-4 border border-neutral-900 text-xs uppercase tracking-[0.2em] font-medium text-neutral-900 overflow-hidden transition-all duration-500 hover:text-white before:absolute before:inset-0 before:bg-neutral-900 before:scale-x-0 before:origin-right hover:before:scale-x-100 before:transition-transform before:duration-500 before:ease-out before:z-0"
        >
          <span className="relative z-10">View Entire Catalog</span>
        </Link>
      </div>

    </div>
  )
}